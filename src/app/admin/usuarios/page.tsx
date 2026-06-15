export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Plus, Edit, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"


import { CreateUserDialog } from "@/components/admin/create-user-dialog"

export const metadata: Metadata = { title: "Usuários | Admin" }

export default async function UsuariosPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/admin/dashboard")

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{users.length} usuário{users.length !== 1 ? "s" : ""}</p>
        <CreateUserDialog />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-[#FAFAFA]">
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Usuário</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Função</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Criado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-accent/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    user.role === "ADMIN"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-secondary text-secondary-foreground border-border"
                  }`}>
                    {user.role === "ADMIN" && <Shield className="h-3 w-3" />}
                    {user.role === "ADMIN" ? "Admin" : "Corretor"}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    user.active
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}>
                    {user.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
