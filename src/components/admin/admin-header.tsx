"use client"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, Menu, X, LayoutDashboard, Home, Users, Settings, Plus, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"

const breadcrumbs: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/imoveis": "Imóveis",
  "/admin/imoveis/novo": "Novo Imóvel",
  "/admin/usuarios": "Usuários",
  "/admin/configuracoes": "Configurações",
}

interface AdminHeaderProps {
  user: { name?: string | null; email?: string | null; role?: string }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentTitle = Object.entries(breadcrumbs).find(([path]) =>
    pathname === path || (path !== "/admin/dashboard" && pathname.startsWith(path))
  )?.[1] || "Admin"

  const isAdmin = user.role === "ADMIN"

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/imoveis", label: "Imóveis", icon: Home },
    ...(isAdmin ? [
      { href: "/admin/usuarios", label: "Usuários", icon: Users },
      { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
    ] : []),
  ]

  return (
    <>
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          {/* Mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="font-semibold text-foreground">{currentTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Ver site
          </a>
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#1E3A5F] text-white flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
              <span className="font-bold">{SITE_CONFIG.name}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/10">
                <Link
                  href="/admin/imoveis/novo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <Plus className="h-5 w-5" />
                  Novo imóvel
                </Link>
              </div>
            </nav>
            <div className="border-t border-white/10 p-3">
              <div className="px-3 py-2 mb-2">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-white/50">{isAdmin ? "Administrador" : "Corretor"}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <LogOut className="h-5 w-5" />
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
