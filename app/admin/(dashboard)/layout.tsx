import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { LogoutButton } from "./_components/logout-button";
import { AdminShell } from "./_components/admin-shell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  const signOutForm = (
    <form action={doSignOut}>
      <LogoutButton />
    </form>
  );

  return (
    <AdminShell email={session.user.email ?? ""} signOutForm={signOutForm}>
      {children}
    </AdminShell>
  );
}
