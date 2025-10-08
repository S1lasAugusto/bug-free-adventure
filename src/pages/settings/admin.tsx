import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const { data: users = [], refetch } = api.admin.listUsers.useQuery(
    undefined,
    {
      enabled: !!user && user.role === "ADMIN",
    }
  );

  const setProtusId = api.admin.setUserProtusId.useMutation({
    onSuccess: () => refetch(),
  });
  const setUserGroup = api.admin.setUserGroup.useMutation({
    onSuccess: () => refetch(),
  });
  const setGroupForAll = api.admin.setGroupForAll.useMutation({
    onSuccess: () => refetch(),
  });
  const setDefaultGroup = api.admin.setDefaultGroup.useMutation();
  const resetPassword = api.admin.resetPassword.useMutation();

  const [bulkGroup, setBulkGroup] = useState("");
  const [defaultGroup, setDefaultGroupState] = useState("");

  const [filter, setFilter] = useState("");
  const filtered = useMemo(() => {
    if (!filter) return users;
    const f = filter.toLowerCase();
    return users.filter(
      (u: any) =>
        (u.name || "").toLowerCase().includes(f) ||
        (u.email || "").toLowerCase().includes(f) ||
        (u.group || "").toLowerCase().includes(f) ||
        (u.protusId || "").toLowerCase().includes(f)
    );
  }, [users, filter]);

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin Panel</h1>

      <div className="mb-6 flex items-center gap-2">
        <input
          className="rounded border px-3 py-2"
          placeholder="Filter by name, email, group, Student ID"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <div className="rounded border p-4">
          <div className="mb-2 font-semibold">
            Set group for all existing users
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border px-3 py-2"
              placeholder="norwaySpring2025"
              value={bulkGroup}
              onChange={(e) => setBulkGroup(e.target.value)}
            />
            <button
              className="rounded bg-blue-600 px-3 py-2 text-white"
              onClick={() =>
                bulkGroup && setGroupForAll.mutate({ group: bulkGroup })
              }
            >
              Apply to all
            </button>
          </div>
        </div>
        <div className="rounded border p-4">
          <div className="mb-2 font-semibold">
            Default group for future users
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border px-3 py-2"
              placeholder="norwaySpring2025"
              value={defaultGroup}
              onChange={(e) => setDefaultGroupState(e.target.value)}
            />
            <button
              className="rounded bg-zinc-800 px-3 py-2 text-white"
              onClick={() =>
                defaultGroup && setDefaultGroup.mutate({ group: defaultGroup })
              }
            >
              Save default
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="border px-2 py-2 text-left">Name</th>
              <th className="border px-2 py-2 text-left">Email</th>
              <th className="border px-2 py-2 text-left">Group</th>
              <th className="border px-2 py-2 text-left">Student ID</th>
              <th className="border px-2 py-2 text-left">Role</th>
              <th className="border px-2 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u: any) => (
              <tr key={u.id} className="odd:bg-white even:bg-zinc-50">
                <td className="border px-2 py-2">{u.name}</td>
                <td className="border px-2 py-2">{u.email}</td>
                <td className="border px-2 py-2">
                  <div className="flex items-center gap-2">
                    <input
                      className="w-44 rounded border px-2 py-1"
                      defaultValue={u.group || ""}
                      onBlur={(e) =>
                        setUserGroup.mutate({
                          userId: u.id,
                          group: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
                <td className="border px-2 py-2">
                  <input
                    className="w-44 rounded border px-2 py-1"
                    defaultValue={u.protusId || ""}
                    placeholder="Norway25001"
                    onBlur={(e) =>
                      setProtusId.mutate({
                        userId: u.id,
                        protusId: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="border px-2 py-2">{u.role}</td>
                <td className="border px-2 py-2">
                  <button
                    className="rounded bg-red-600 px-3 py-1 text-white"
                    onClick={() => {
                      const newPass = prompt(
                        "New password for " + (u.email || u.name)
                      );
                      if (newPass && newPass.length >= 6) {
                        resetPassword.mutate({
                          userId: u.id,
                          newPassword: newPass,
                        });
                      }
                    }}
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
