import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"

export async function getSession() {
  return getServerSession(authOptions)
}

export async function getCurrentUserRole() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role as "USER" | "ADMIN" | "SUPERADMIN" | undefined
  return role
}

export async function isAdmin() {
  const role = await getCurrentUserRole()
  return role === "ADMIN" || role === "SUPERADMIN"
}

export async function isSuperAdmin() {
  const role = await getCurrentUserRole()
  return role === "SUPERADMIN"
}

// For routes / pages where normal admins AND superadmins are allowed
export async function requireAdmin() {
  const role = await getCurrentUserRole()

  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    redirect("/admin/login?error=unauthorized")
  }

  return role
}

// For routes / pages where ONLY superadmins are allowed
export async function requireSuperAdmin() {
  const role = await getCurrentUserRole()

  if (role !== "SUPERADMIN") {
    redirect("/admin/login?error=forbidden")
  }

  return role
}

//removed tiny comment