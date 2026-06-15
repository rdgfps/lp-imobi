"use client"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Home, Users, Settings, ChevronLeft, ChevronRight, LogOut, Plus, Building2
} from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { SITE_CONFIG } from "@/lib/constants"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/imoveis", label: "Imóveis", icon: Home },
  { href: "/admin/usuarios", label: "Usuários", icon: Users, adminOnly: true },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings, adminOnly: true },
]

interface AdminSidebarProps {
  user: { name?: string | null; email?: string | null; role?: string }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const isAdmin = user.role === "ADMIN"

  const filteredNav = navItems.filter(item => !item.adminOnly || isAdmin)

  return (
    <aside
      className={cn(
        "bg-[#1E3A5F] text-white flex flex-col transition-all duration-300 relative hidden lg:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-white/10", collapsed ? "justify-center" : "gap-3")}>
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm truncate">{SITE_CONFIG.name}</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {filteredNav.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                active
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && item.label}
            </Link>
          )
        })}

        <div className={cn("pt-2 border-t border-white/10 mt-2", collapsed ? "px-0" : "px-0")}>
          <Link
            href="/admin/imoveis/novo"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium bg-white/10 hover:bg-white/20 text-white",
              collapsed && "justify-center"
            )}
            title={collapsed ? "Novo imóvel" : undefined}
          >
            <Plus className="h-5 w-5 flex-shrink-0" />
            {!collapsed && "Novo imóvel"}
          </Link>
        </div>
      </nav>

      {/* User & Logout */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-white/50 truncate">{user.role === "ADMIN" ? "Administrador" : "Corretor"}</p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && "Sair"}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-accent transition-colors z-10"
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3 text-foreground" /> : <ChevronLeft className="h-3 w-3 text-foreground" />}
      </button>
    </aside>
  )
}
