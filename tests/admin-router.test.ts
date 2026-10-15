import assert from "node:assert/strict";
import { test } from "node:test";
import type { PrismaClient } from "@prisma/client";
import { adminRouter } from "../src/server/api/routers/adminRouter";
import { generateToken } from "../src/lib/auth";

type Row = { id: string; group: string | null; protusId: string; role: string };
function setup(role = "ADMIN", authenticated = true) {
  let rows: Row[] = [
    { id: "one", group: "Erik", protusId: "norway25201", role: "USER" },
    { id: "two", group: "Erik", protusId: "norway25202", role: "USER" },
    {
      id: "three",
      group: "olderCohort",
      protusId: "norway25203",
      role: "USER",
    },
  ];
  let setting: { value: string } | null = null;
  let writes = 0;
  const user = {
    findUnique: async () => ({ id: "admin", role }),
    update: async ({
      where,
      data,
      select,
    }: {
      where: { id: string };
      data: Partial<Row>;
      select: unknown;
    }) => {
      writes++;
      assert.deepEqual(select, { id: true }); // No password hashes in mutation responses.
      if (rows.some((r) => r.id !== where.id && r.protusId === data.protusId))
        throw { code: "P2002" };
      const row = rows.find((r) => r.id === where.id);
      assert.ok(row);
      Object.assign(row, data);
      return { id: row.id };
    },
  };
  const db = {
    user,
    setting: {
      findUnique: async () => setting,
      upsert: async ({ update }: { update: { value: string } }) => {
        setting = update;
        return setting;
      },
    },
    $transaction: async (callback: (tx: unknown) => Promise<unknown>) => {
      const draft = rows.map((r) => ({ ...r }));
      const result = await callback({
        user: {
          updateMany: async ({
            where,
            data,
          }: {
            where: { OR: { id: string; group: string | null }[] };
            data: { group: string };
          }) => {
            writes++;
            let count = 0;
            for (const row of draft)
              if (
                where.OR.some(
                  (condition) =>
                    condition.id === row.id && condition.group === row.group
                )
              ) {
                row.group = data.group;
                count++;
              }
            return { count };
          },
        },
      });
      rows = draft;
      return result;
    },
  };
  const caller = adminRouter.createCaller({
    prisma: db as unknown as PrismaClient,
    req: {
      headers: authenticated
        ? { authorization: `Bearer ${generateToken("admin")}` }
        : {},
    },
    res: undefined,
  });
  return { caller, rows: () => rows, writes: () => writes };
}

const firstStudent = { id: "one", previousGroup: "Erik" };
const selection = [firstStudent, { id: "two", previousGroup: "Erik" }];

test("bulk changes only the selected accounts and preserves Student IDs", async () => {
  const db = setup();
  assert.deepEqual(
    await db.caller.setGroupForSelected({
      students: selection,
      group: " norwaySpring2026 ",
    }),
    { count: 2 }
  );
  assert.deepEqual(
    db.rows().map((r) => [r.id, r.group, r.protusId]),
    [
      ["one", "norwaySpring2026", "norway25201"],
      ["two", "norwaySpring2026", "norway25202"],
      ["three", "olderCohort", "norway25203"],
    ]
  );
});

test("a stale selection rolls back all changes", async () => {
  const db = setup();
  await assert.rejects(
    db.caller.setGroupForSelected({
      students: [firstStudent, { id: "two", previousGroup: "oldValue" }],
      group: "norwaySpring2026",
    }),
    { code: "CONFLICT" }
  );
  assert.equal(db.rows()[0]?.group, "Erik");
  assert.equal(db.rows()[1]?.group, "Erik");
});

test("a deleted account cancels the entire batch", async () => {
  const db = setup();
  await assert.rejects(
    db.caller.setGroupForSelected({
      students: [firstStudent, { id: "deleted", previousGroup: null }],
      group: "norwaySpring2026",
    }),
    { code: "CONFLICT" }
  );
  assert.equal(db.rows()[0]?.group, "Erik");
});

test("non-admin and anonymous callers cannot change accounts", async () => {
  for (const [role, authenticated, code] of [
    ["USER", true, "FORBIDDEN"],
    ["ADMIN", false, "UNAUTHORIZED"],
  ] as const) {
    const db = setup(role, authenticated);
    await assert.rejects(
      db.caller.setGroupForSelected({
        students: selection,
        group: "norwaySpring2026",
      }),
      { code }
    );
    await assert.rejects(
      db.caller.updateStudent({
        userId: "one",
        group: "new",
        protusId: "norway25201",
      }),
      { code }
    );
    assert.equal(db.writes(), 0);
  }
});

test("empty, duplicate and URL-breaking input is rejected without writing", async () => {
  const db = setup();
  for (const input of [
    { group: "new", students: [] },
    { group: "new", students: [firstStudent, firstStudent] },
    { group: "  ", students: selection },
    { group: "cohort&usr=another", students: selection },
    { group: "a group", students: selection },
  ])
    await assert.rejects(db.caller.setGroupForSelected(input), {
      code: "BAD_REQUEST",
    });
  assert.equal(db.writes(), 0);
});

test("editing one connection is atomic and duplicate IDs have a readable error", async () => {
  const db = setup();
  await assert.rejects(
    db.caller.updateStudent({
      userId: "one",
      group: "new",
      protusId: "norway25202",
    }),
    {
      code: "CONFLICT",
      message: "This Student ID is already linked to another account.",
    }
  );
  assert.equal(db.rows()[0]?.group, "Erik");
  assert.deepEqual(
    await db.caller.updateStudent({
      userId: "one",
      group: " new ",
      protusId: " norway25300 ",
    }),
    { id: "one" }
  );
  assert.equal(db.rows()[0]?.group, "new");
  assert.equal(db.rows()[0]?.protusId, "norway25300");
});

test("the actual default is loaded and updating it does not modify existing accounts", async () => {
  const db = setup();
  assert.equal(await db.caller.getDefaultGroup(), "norwaySpring2026");
  await db.caller.setDefaultGroup({ group: "norwaySpring2027" });
  assert.equal(await db.caller.getDefaultGroup(), "norwaySpring2027");
  assert.equal(db.rows()[0]?.group, "Erik");
  assert.equal(db.writes(), 0);
});
