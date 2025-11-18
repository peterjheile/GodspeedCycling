"use server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function updateUserRoleAction(formData: FormData) {
  await requireAdmin()

  const userId = formData.get("userId")?.toString()
  const role = formData.get("role")?.toString() as "ADMIN" | "USER" | undefined

  if (!userId || !role) {
    throw new Error("Missing userId or role")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })

  redirect("/admin/users")
}