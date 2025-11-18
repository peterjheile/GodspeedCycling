import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"

export async function getSession() {
  return getServerSession(authOptions)
}

export async function isAdmin() {
  const session = await getServerSession(authOptions)
  return !!session && (session.user as any).role === "ADMIN"
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "ADMIN") {
    // Redirect to admin login if not authorized
    redirect("/admin/login?error=unauthorized")
  }

  return session
}