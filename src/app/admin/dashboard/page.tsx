export const dynamic = "force-dynamic"
import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Home, TrendingUp, Star, Plus, ArrowRight, Building2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"


import { formatCurrency } from "@/lib/utils"

export const metadata: Metadata = { title: "Dashboard | Admin" }

async function getDashboardData() {
  const [
    totalProperties,
    availableProperties,
    soldProperties,
    featuredProperties,
    forSale,
    forRent,
    recentProperties,
    recentLogs,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "DISPONIVEL" } }),
    prisma.property.count({ where: { status: "VENDIDO" } }),
    prisma.property.count({ where: { featured: true, published: true } }),
    prisma.property.count({ where: { purpose: { in: ["VENDA", "AMBOS"] } } }),
    prisma.property.count({ where: { purpose: { in: ["ALUGUEL", "AMBOS"] } } }),
    prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { images: { take: 1, orderBy: { order: "asc" } } },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true } } },
    }),
  ])

  return { totalProperties, availableProperties, soldProperties, featuredProperties, forSale, forRent, recentProperties, recentLogs }
}

const actionLabels: Record<string, string> = {
  LOGIN: "fez login",
  LOGOUT: "saiu do sistema",
  CREATE_PROPERTY: "criou imóvel",
  UPDATE_PROPERTY: "atualizou imóvel",
  DELETE_PROPERTY: "excluiu imóvel",
  CREATE_USER: "criou usuário",
  UPDATE_USER: "atualizou usuário",
  TOGGLE_PUBLISHED: "alterou publicação",
  TOGGLE_FEATURED: "alterou destaque",
}

export default async function DashboardPage() {
  const session = await auth()
  const data = await getDashboardData()

  const stats = [
    {
      title: "Total de Imóveis",
      value: data.totalProperties,
      icon: Building2,
      color: "text-primary",
      bg: "bg-primary/10",
      change: "cadastrados",
    },
    {
      title: "Disponíveis",
      value: data.availableProperties,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      change: "para venda/aluguel",
    },
    {
      title: "Vendidos",
      value: data.soldProperties,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
      change: "negócios fechados",
    },
    {
      title: "Em Destaque",
      value: data.featuredProperties,
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-50",
      change: "na página inicial",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Bom dia, {session?.user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-muted-foreground mt-1">Aqui está um resumo do seu catálogo de imóveis.</p>
        </div>
        <Link href="/admin/imoveis/novo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo imóvel
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Purpose breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Para venda</p>
                <p className="text-2xl font-bold text-foreground">{data.forSale}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Home className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Para aluguel</p>
                <p className="text-2xl font-bold text-foreground">{data.forRent}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Home className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent properties */}
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Imóveis recentes</CardTitle>
            <Link href="/admin/imoveis" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {data.recentProperties.map((property: any) => (
                <Link
                  key={property.id}
                  href={`/admin/imoveis/${property.id}`}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {property.images[0] ? (
                      <img src={property.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🏠</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{property.title}</p>
                    <p className="text-xs text-muted-foreground">{property.city} • {formatCurrency(property.price)}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${property.status === "DISPONIVEL" ? "bg-emerald-400" : "bg-gray-300"}`} />
                </Link>
              ))}
              {data.recentProperties.length === 0 && (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                  Nenhum imóvel cadastrado ainda.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity log */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Atividade recente</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {data.recentLogs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 px-6 py-3.5">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">
                      {log.user?.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{log.user?.name || "Sistema"}</span>{" "}
                      {actionLabels[log.action] || log.action.toLowerCase()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(log.createdAt).toLocaleString("pt-BR", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {data.recentLogs.length === 0 && (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                  Nenhuma atividade registrada.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
