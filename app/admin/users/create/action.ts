"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function createAdminAction(formData: FormData) {
  // Ensure only admins can create admins
  await requireAdmin()

  const email = formData.get("email")?.toString()
  const name = formData.get("name")?.toString()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    throw new Error("Missing email or password")
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "ADMIN",
    },
  })

  redirect("/admin/users") // later we can build this page
}