import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Info,
  KeyRound,
  Pencil,
  Search,
  Settings2,
  Users,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import {
  groupSchema,
  updateStudentSchema,
} from "../../server/schema/AdminSchema";

export type AdminStudent = {
  id: string;
  name: string;
  email: string;
  group: string | null;
  protusId: string | null;
  role: "USER" | "ADMIN";
};

type Props = {
  users: AdminStudent[];
  defaultGroup?: string;
  loading?: boolean;
  error?: string;
  defaultError?: string;
  onRefresh: () => void;
  onUpdateStudent: (input: {
    userId: string;
    group: string;
    protusId: string;
  }) => Promise<unknown>;
  onUpdateGroup: (input: {
    group: string;
    students: { id: string; previousGroup: string | null }[];
  }) => Promise<unknown>;
  onUpdateDefault: (group: string) => Promise<unknown>;
  onResetPassword: (input: {
    userId: string;
    newPassword: string;
  }) => Promise<unknown>;
};

type Modal =
  | { kind: "bulk"; students: AdminStudent[] }
  | { kind: "edit"; student: AdminStudent }
  | { kind: "password"; student: AdminStudent }
  | { kind: "default" };

const field =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900";
const primary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50";
const secondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";
const checkbox =
  "h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900";
const pageSize = 20;

export default function AdminWorkspace({
  users,
  defaultGroup,
  loading,
  error,
  defaultError,
  onRefresh,
  onUpdateStudent,
  onUpdateGroup,
  onUpdateDefault,
  onResetPassword,
}: Props) {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [linkFilter, setLinkFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<Modal | null>(null);
  const [group, setGroup] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const headerCheckbox = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  const groups = useMemo(
    () =>
      Array.from(
        new Set(users.map((u) => u.group).filter((g): g is string => !!g))
      ).sort(),
    [users]
  );
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        (!query ||
          [u.name, u.email, u.protusId, u.group].some((v) =>
            v?.toLowerCase().includes(query)
          )) &&
        (!groupFilter ||
          (groupFilter === "__missing" ? !u.group : u.group === groupFilter)) &&
        (!roleFilter || u.role === roleFilter) &&
        (!linkFilter ||
          (linkFilter === "missing"
            ? !u.protusId || !u.group
            : !!u.protusId && !!u.group))
    );
  }, [users, search, groupFilter, roleFilter, linkFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const selectedUsers = users.filter((u) => selected.includes(u.id));
  const allVisibleSelected =
    visible.length > 0 && visible.every((u) => selected.includes(u.id));
  const someVisibleSelected = visible.some((u) => selected.includes(u.id));
  const missing = users.filter((u) => !u.group || !u.protusId).length;

  useEffect(() => {
    if (headerCheckbox.current)
      headerCheckbox.current.indeterminate =
        someVisibleSelected && !allVisibleSelected;
  }, [someVisibleSelected, allVisibleSelected]);

  function filterChanged() {
    setPage(1);
    setSelected([]);
  }

  function open(next: Modal) {
    setModal(next);
    setGroup(
      next.kind === "edit"
        ? next.student.group || ""
        : next.kind === "default"
        ? defaultGroup || ""
        : ""
    );
    setStudentId(next.kind === "edit" ? next.student.protusId || "" : "");
    setPassword("");
    setFormError("");
    setReviewed(false);
  }

  async function save() {
    if (!modal || inFlight.current) return;
    setFormError("");
    if (modal.kind !== "password") {
      const validation =
        modal.kind === "edit"
          ? updateStudentSchema.safeParse({
              userId: modal.student.id,
              group,
              protusId: studentId,
            })
          : groupSchema.safeParse(group);
      if (!validation.success) {
        setFormError(
          validation.error.issues[0]?.message ||
            "Check the values and try again."
        );
        return;
      }
    } else if (password.length < 6) {
      setFormError("Use at least 6 characters.");
      return;
    }
    if (modal.kind === "bulk" && !reviewed) {
      setReviewed(true);
      return;
    }
    inFlight.current = true;
    setSaving(true);
    try {
      if (modal.kind === "bulk") {
        await onUpdateGroup({
          group: group.trim(),
          students: modal.students.map((u) => ({
            id: u.id,
            previousGroup: u.group,
          })),
        });
        setNotice(
          `Group updated to ${group.trim()} for ${
            modal.students.length
          } selected account${modal.students.length === 1 ? "" : "s"}.`
        );
        setSelected([]);
      } else if (modal.kind === "edit") {
        await onUpdateStudent({
          userId: modal.student.id,
          group: group.trim(),
          protusId: studentId.trim(),
        });
        setNotice(
          `Learning connection updated for ${
            modal.student.name || modal.student.email
          }.`
        );
      } else if (modal.kind === "default") {
        await onUpdateDefault(group.trim());
        setNotice(
          `New students will use ${group.trim()}. Existing accounts are unchanged.`
        );
      } else {
        await onResetPassword({
          userId: modal.student.id,
          newPassword: password,
        });
        setNotice(`Password updated for ${modal.student.email}.`);
      }
      setModal(null);
      setPassword("");
    } catch (e) {
      setFormError(
        e instanceof Error ? e.message : "Unable to save. Please try again."
      );
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  }

  const inputChanged = (value: string) => {
    setGroup(value);
    setReviewed(false);
    setFormError("");
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Administration
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Students & groups
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Manage learning accounts and move a class to its next study group.
          </p>
        </div>
        <button
          className={secondary}
          onClick={() => open({ kind: "default" })}
          disabled={!defaultGroup || !!defaultError}
        >
          <Settings2 size={16} aria-hidden="true" /> New student settings
        </button>
      </header>

      <section
        aria-label="Learning connection guide"
        className="grid gap-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900 dark:bg-indigo-950/30 md:grid-cols-2"
      >
        <div className="flex gap-3">
          <Users
            size={20}
            className="mt-0.5 shrink-0 text-indigo-500"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-sm font-semibold">
              Group · the class or study cohort
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Use the exact group registered in Adapt2, such as{" "}
              <span className="font-mono text-xs">norwaySpring2026</span>. A new
              year may use a different group.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <GraduationCap
            size={20}
            className="mt-0.5 shrink-0 text-indigo-500"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-sm font-semibold">
              Student ID · the learner in Adapt2
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Links an account to its exercises and progress. Use the assigned
              ID, such as <span className="font-mono text-xs">norway25300</span>
              , rather than an email or university number.
            </p>
          </div>
        </div>
      </section>

      {notice && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
        >
          <Check size={18} aria-hidden="true" />
          <span className="flex-1">{notice}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {defaultError && (
        <p role="alert" className="text-sm text-red-600">
          Could not load the default group.{" "}
          <button className="underline" onClick={onRefresh}>
            Try again
          </button>
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-semibold">Account directory</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {loading ? "Loading…" : `${users.length} accounts`}
            </span>
            <span className="text-xs text-slate-500">
              {groups.length} {groups.length === 1 ? "group" : "groups"}
            </span>
          </div>
          {missing > 0 && (
            <button
              className="text-xs font-medium text-amber-700 underline decoration-dotted underline-offset-4 dark:text-amber-400"
              onClick={() => {
                setLinkFilter("missing");
                filterChanged();
              }}
            >
              {missing} missing connection details
            </button>
          )}
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_190px_150px_190px]">
          <label className="relative">
            <span className="sr-only">Search accounts</span>
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={17}
              aria-hidden="true"
            />
            <input
              className={`${field} pl-10`}
              placeholder="Search name, email or Student ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                filterChanged();
              }}
            />
          </label>
          <label>
            <span className="sr-only">Filter by group</span>
            <select
              className={field}
              value={groupFilter}
              onChange={(e) => {
                setGroupFilter(e.target.value);
                filterChanged();
              }}
            >
              <option value="">All groups</option>
              <option value="__missing">No group assigned</option>
              {groupFilter &&
                groupFilter !== "__missing" &&
                !groups.includes(groupFilter) && (
                  <option value={groupFilter}>
                    {groupFilter} (no accounts)
                  </option>
                )}
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by role</span>
            <select
              className={field}
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                filterChanged();
              }}
            >
              <option value="">All roles</option>
              <option value="USER">Students</option>
              <option value="ADMIN">Administrators</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by connection details</span>
            <select
              className={field}
              value={linkFilter}
              onChange={(e) => {
                setLinkFilter(e.target.value);
                filterChanged();
              }}
            >
              <option value="">All connections</option>
              <option value="missing">Missing details</option>
              <option value="complete">Details provided</option>
            </select>
          </label>
        </div>
        <div className="flex min-h-[64px] flex-wrap items-center gap-3 border-y border-slate-100 bg-slate-50/70 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/40">
          {selectedUsers.length ? (
            <>
              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                {selectedUsers.length} selected
              </span>
              <button
                className={primary}
                onClick={() =>
                  open({
                    kind: "bulk",
                    students: selectedUsers.map((u) => ({ ...u })),
                  })
                }
              >
                Change group <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button
                className="text-sm text-slate-500 underline"
                onClick={() => setSelected([])}
              >
                Clear selection
              </button>
            </>
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Select accounts to change their group together.
            </span>
          )}
          {filtered.length > 0 &&
            filtered.length <= 1000 &&
            selectedUsers.length < filtered.length && (
              <button
                className="ml-auto text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                onClick={() => setSelected(filtered.map((u) => u.id))}
              >
                Select all {filtered.length} matching accounts
              </button>
            )}
        </div>
        {loading ? (
          <div
            className="p-12 text-center text-sm text-slate-500"
            role="status"
          >
            Loading student accounts…
          </div>
        ) : error ? (
          <div className="space-y-3 p-10 text-center" role="alert">
            <p>{error}</p>
            <button className={secondary} onClick={onRefresh}>
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Search
              size={24}
              className="mx-auto mb-3 text-slate-400"
              aria-hidden="true"
            />
            <h3 className="font-semibold">No accounts found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search or clear your filters.
            </p>
            <button
              className={`${secondary} mt-4`}
              onClick={() => {
                setSearch("");
                setGroupFilter("");
                setRoleFilter("");
                setLinkFilter("");
                filterChanged();
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">
                Student accounts. Selection is kept between pages and cleared
                when filters change.
              </caption>
              <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="w-12 px-5 py-4">
                    <input
                      ref={headerCheckbox}
                      className={checkbox}
                      type="checkbox"
                      aria-label="Select accounts on this page"
                      checked={allVisibleSelected}
                      onChange={() =>
                        setSelected((old) =>
                          allVisibleSelected
                            ? old.filter(
                                (id) => !visible.some((u) => u.id === id)
                              )
                            : Array.from(
                                new Set([...old, ...visible.map((u) => u.id)])
                              )
                        )
                      }
                    />
                  </th>
                  <th className="py-4 pr-4">Student</th>
                  <th className="py-4 pr-4">Group</th>
                  <th className="py-4 pr-4">Student ID</th>
                  <th className="py-4 pr-4">Role</th>
                  <th className="py-4 pr-5 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visible.map((u) => (
                  <tr
                    key={u.id}
                    className={
                      selected.includes(u.id)
                        ? "bg-indigo-50/70 dark:bg-indigo-950/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }
                  >
                    <td className="px-5 py-4">
                      <input
                        className={checkbox}
                        type="checkbox"
                        aria-label={`Select ${u.email}`}
                        checked={selected.includes(u.id)}
                        onChange={() =>
                          setSelected((old) =>
                            old.includes(u.id)
                              ? old.filter((id) => id !== u.id)
                              : [...old, u.id]
                          )
                        }
                      />
                    </td>
                    <td className="py-4 pr-4">
                      <div className="font-medium">
                        {u.name || "Unnamed account"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {u.email}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      {u.group ? (
                        <span className="inline-block max-w-[210px] break-all rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {u.group}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-700 dark:text-amber-400">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={
                          u.protusId
                            ? "font-mono text-xs"
                            : "text-xs text-amber-700 dark:text-amber-400"
                        }
                      >
                        {u.protusId || "Not linked"}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={
                          u.role === "ADMIN"
                            ? "text-xs font-medium text-indigo-600 dark:text-indigo-400"
                            : "text-xs text-slate-500 dark:text-slate-400"
                        }
                      >
                        {u.role === "ADMIN" ? "Admin" : "Student"}
                      </span>
                    </td>
                    <td className="py-4 pr-5 text-right">
                      <button
                        className={secondary}
                        aria-label={`Edit ${u.email}`}
                        onClick={() =>
                          open({ kind: "edit", student: { ...u } })
                        }
                      >
                        <Pencil size={14} aria-hidden="true" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>
            {filtered.length
              ? `${(currentPage - 1) * pageSize + 1}–${Math.min(
                  currentPage * pageSize,
                  filtered.length
                )} of ${filtered.length} accounts`
              : "0 accounts"}
          </span>
          <div className="flex items-center gap-3">
            <button
              className={secondary}
              aria-label="Previous page"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={secondary}
              aria-label="Next page"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </footer>
      </section>
      <p className="flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
        <Info size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
        Group and Student ID must match Adapt2. Details shown here are saved
        settings, not a live connection check. Changing a group preserves the
        account and its local history.
      </p>

      <Dialog
        open={!!modal}
        onOpenChange={(isOpen) => {
          if (!isOpen && !saving) {
            setModal(null);
            setPassword("");
          }
        }}
      >
        <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border-slate-200 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
          <DialogTitle>
            {modal?.kind === "bulk"
              ? reviewed
                ? "Review group change"
                : "Change group for selected accounts"
              : modal?.kind === "default"
              ? "Group for new students"
              : modal?.kind === "password"
              ? "Reset password"
              : "Edit learning connection"}
          </DialogTitle>
          <DialogDescription className="pr-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {modal?.kind === "bulk"
              ? `${modal.students.length} selected accounts. Student IDs and local history will be preserved.`
              : modal?.kind === "default"
              ? "Used when a student completes onboarding. Existing accounts keep their current groups."
              : modal
              ? modal.student.email
              : ""}
          </DialogDescription>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            {modal?.kind !== "password" && (
              <label className="block text-sm font-medium">
                {modal?.kind === "default" ? "Default group" : "Adapt2 group"}
                <input
                  className={`${field} mt-2`}
                  value={group}
                  maxLength={100}
                  placeholder="e.g. norwaySpring2026"
                  disabled={saving || reviewed}
                  onChange={(e) => inputChanged(e.target.value)}
                  required
                />
                <span className="mt-2 block text-xs font-normal leading-5 text-slate-500 dark:text-slate-400">
                  Enter the exact group supplied by the study coordinator. This
                  does not create a group in Adapt2.
                </span>
              </label>
            )}
            {modal?.kind === "edit" && (
              <label className="block text-sm font-medium">
                Student ID
                <input
                  className={`${field} mt-2 font-mono`}
                  value={studentId}
                  maxLength={100}
                  placeholder="e.g. norway25300"
                  disabled={saving}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
                <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
                  Changing this ID changes which learner’s progress is
                  retrieved. Keep it when moving a student to a new group.
                </span>
              </label>
            )}
            {modal?.kind === "password" && (
              <label className="block text-sm font-medium">
                New password
                <input
                  className={`${field} mt-2`}
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  minLength={6}
                  disabled={saving}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="mt-2 block text-xs font-normal text-slate-500">
                  At least 6 characters. Share the new password securely with
                  this account’s owner.
                </span>
              </label>
            )}
            {modal?.kind === "bulk" && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {reviewed ? "Accounts that will change" : "Selected accounts"}
                </p>
                <ul className="max-h-56 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
                  {modal.students.map((u) => (
                    <li key={u.id} className="px-3 py-2.5 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{u.name || u.email}</span>
                        {u.role === "ADMIN" && (
                          <span className="text-xs text-indigo-500">
                            Admin account
                          </span>
                        )}
                      </div>
                      <p className="break-all text-xs text-slate-500">
                        {u.email}
                      </p>
                      <p className="mt-1 break-all font-mono text-xs text-slate-600 dark:text-slate-400">
                        {u.group || "No group"}
                        {reviewed && (
                          <>
                            {" "}
                            →{" "}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {group.trim()}
                            </span>
                          </>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
                {reviewed && (
                  <p className="mt-3 text-xs text-slate-500">
                    The default group for new students will not change.
                  </p>
                )}
              </div>
            )}
            {formError && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200"
              >
                {formError}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              {modal?.kind === "edit" && (
                <button
                  type="button"
                  className="mr-auto inline-flex items-center gap-2 text-xs text-slate-500 hover:text-red-600"
                  disabled={saving}
                  onClick={() =>
                    open({ kind: "password", student: modal.student })
                  }
                >
                  <KeyRound size={14} /> Reset password
                </button>
              )}
              <button
                type="button"
                className={secondary}
                disabled={saving}
                onClick={() => (reviewed ? setReviewed(false) : setModal(null))}
              >
                {reviewed ? "Back" : "Cancel"}
              </button>
              <button
                type="submit"
                className={primary}
                disabled={
                  saving || (modal?.kind !== "password" && !group.trim())
                }
              >
                {saving
                  ? "Saving…"
                  : modal?.kind === "bulk"
                  ? reviewed
                    ? `Confirm ${modal.students.length} changes`
                    : "Review changes"
                  : modal?.kind === "password"
                  ? "Save password"
                  : "Save changes"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
