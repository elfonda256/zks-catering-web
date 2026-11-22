"use client";

import { useState, useTransition } from "react";
import { createAdminAction, deleteAdminAction, resetAdminPasswordAction, type UserActionResult } from "@/app/admin/users/actions";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { formatDate } from "@/shared/utils/formatters";
import { MIN_PASSWORD_LENGTH } from "../validation";

export interface AdminAccount {
  id: number;
  username: string;
  createdAt: string;
}

type Dialog = { type: "create" } | { type: "password"; admin: AdminAccount } | { type: "delete"; admin: AdminAccount };

interface AdminUsersViewProps {
  admins: AdminAccount[];
  currentAdminId: number;
}

export function AdminUsersView({ admins, currentAdminId }: AdminUsersViewProps) {
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function open(next: Dialog) {
    setError(null);
    setNotice(null);
    setDialog(next);
  }

  function run(action: () => Promise<UserActionResult>, successNotice: string) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
        return;
      }
      setDialog(null);
      setNotice(successNotice);
    });
  }

  function submitForm(e: React.FormEvent<HTMLFormElement>, action: (form: FormData) => Promise<UserActionResult>, successNotice: string) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    run(() => action(form), successNotice);
  }

  const columns: DataColumn<AdminAccount>[] = [
    {
      key: "username",
      header: "Username",
      mobile: "title",
      cell: (a) => (
        <span className="flex items-center gap-2 font-medium text-slate-900">
          {a.username}
          {a.id === currentAdminId && <Badge variant="info">Anda</Badge>}
        </span>
      ),
    },
    { key: "created", header: "Dibuat", mobile: "subtitle", cell: (a) => formatDate(a.createdAt) },
    {
      key: "actions",
      header: "Aksi",
      align: "right",
      wide: true,
      cell: (a) => (
        <div className="flex flex-wrap justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => open({ type: "password", admin: a })}>
            Ganti kata sandi
          </Button>
          {a.id !== currentAdminId && admins.length > 1 && (
            <Button size="sm" variant="danger" onClick={() => open({ type: "delete", admin: a })}>
              Hapus
            </Button>
          )}
        </div>
      ),
    },
  ];

  const errorNode = error && (
    <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
      {error}
    </p>
  );

  const footer = (formId: string, label: string, danger = false) => (
    <>
      <Button type="button" variant="secondary" onClick={() => setDialog(null)} disabled={isPending}>
        Batal
      </Button>
      <Button type="submit" form={formId} variant={danger ? "danger" : "primary"} disabled={isPending}>
        {isPending ? "Memproses..." : label}
      </Button>
    </>
  );

  const passwordFields = (
    <>
      <Input id="pw-new" name="password" type="password" label="Kata sandi baru" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" helperText={`Minimal ${MIN_PASSWORD_LENGTH} karakter.`} />
      <Input id="pw-confirm" name="confirmPassword" type="password" label="Ulangi kata sandi" required autoComplete="new-password" />
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[13px] text-slate-600">Semua admin punya akses penuh ke panel ini.</p>
        <Button onClick={() => open({ type: "create" })}>Tambah admin</Button>
      </div>

      {notice && (
        <p role="status" className="rounded-[12px] border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-[13px] text-emerald-950">
          {notice}
        </p>
      )}

      <DataList rows={admins} columns={columns} rowKey={(a) => String(a.id)} />

      {dialog?.type === "create" && (
        <Modal isOpen onClose={() => !isPending && setDialog(null)} title="Tambah admin" footer={footer("create-admin", "Tambah admin")}>
          <form id="create-admin" onSubmit={(e) => submitForm(e, createAdminAction, "Admin baru sudah bisa masuk.")} className="space-y-4">
            <Input id="new-username" name="username" label="Username" required autoComplete="off" autoFocus helperText="Dipakai saat masuk, huruf besar-kecil berpengaruh." />
            {passwordFields}
            {errorNode}
          </form>
        </Modal>
      )}

      {dialog?.type === "password" && (
        <Modal
          isOpen
          onClose={() => !isPending && setDialog(null)}
          title="Ganti kata sandi"
          subtitle={dialog.admin.username}
          footer={footer("reset-password", "Simpan kata sandi")}
        >
          <form
            id="reset-password"
            onSubmit={(e) => submitForm(e, (form) => resetAdminPasswordAction(dialog.admin.id, form), `Kata sandi ${dialog.admin.username} sudah diganti.`)}
            className="space-y-4"
          >
            {passwordFields}
            {errorNode}
          </form>
        </Modal>
      )}

      {dialog?.type === "delete" && (
        <Modal
          isOpen
          onClose={() => !isPending && setDialog(null)}
          title="Hapus admin"
          subtitle={dialog.admin.username}
          footer={
            <>
              <Button variant="secondary" onClick={() => setDialog(null)} disabled={isPending}>
                Batal
              </Button>
              <Button variant="danger" disabled={isPending} onClick={() => run(() => deleteAdminAction(dialog.admin.id), `${dialog.admin.username} sudah dihapus.`)}>
                {isPending ? "Memproses..." : "Hapus permanen"}
              </Button>
            </>
          }
        >
          <p className="text-[14px] text-slate-700">
            Akun <strong>{dialog.admin.username}</strong> langsung tidak bisa dipakai lagi, termasuk sesi yang sedang terbuka. Tindakan ini
            tidak bisa dibatalkan.
          </p>
          {errorNode}
        </Modal>
      )}
    </div>
  );
}
