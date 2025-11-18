import type { ReactNode } from "react";
import Link from "next/link";
import { getIsAdmin, destroyAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  children: ReactNode;
};

async function logout() {
  "use server";
  await destroyAdminSession();
  redirect("/admin/login");
}


export async function AppShell({ children }: AppShellProps) {
  const isAdmin = await getIsAdmin();


  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Godspeed
          </Link>

          <nav className="flex gap-6 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/history" className="hover:text-white">History</Link>
            <Link href="/members" className="hover:text-white">Members</Link>
            <Link href="/results" className="hover:text-white">Results</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/events" className="hover:text-white">Events</Link>
            <Link href="/map" className="hover:text-white">Map</Link>
          </nav>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/login">Admin login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}