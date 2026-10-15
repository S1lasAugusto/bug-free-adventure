import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import AdminWorkspace from "@/components/admin/AdminWorkspace";

export default function AdminPage() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const enabled = !!user && user.role === "ADMIN";
  const utils = api.useContext();
  const users = api.admin.listUsers.useQuery(undefined, { enabled });
  const defaultGroup = api.admin.getDefaultGroup.useQuery(undefined, {
    enabled,
  });
  const updateStudent = api.admin.updateStudent.useMutation();
  const updateGroup = api.admin.setGroupForSelected.useMutation();
  const updateDefault = api.admin.setDefaultGroup.useMutation();
  const resetPassword = api.admin.resetPassword.useMutation();

  useEffect(() => {
    if (!isLoading && !enabled) void router.replace("/");
  }, [enabled, isLoading, router]);

  async function refreshConnections() {
    // Refresh all consumers of learner data after editing the signed-in account too.
    await Promise.allSettled([refreshUser(), utils.invalidate()]);
  }

  if (isLoading)
    return (
      <p className="p-8 text-sm text-slate-500">Loading administration…</p>
    );
  if (!enabled) return null;

  return (
    <AdminWorkspace
      users={users.data || []}
      defaultGroup={defaultGroup.data}
      loading={users.isLoading}
      error={users.error?.message}
      defaultError={defaultGroup.error?.message}
      onRefresh={() => {
        void users.refetch();
        void defaultGroup.refetch();
      }}
      onUpdateStudent={async (input) => {
        await updateStudent.mutateAsync(input);
        await refreshConnections();
      }}
      onUpdateGroup={async (input) => {
        await updateGroup.mutateAsync(input);
        await refreshConnections();
      }}
      onUpdateDefault={async (group) => {
        await updateDefault.mutateAsync({ group });
        await defaultGroup.refetch();
      }}
      onResetPassword={(input) => resetPassword.mutateAsync(input)}
    />
  );
}
