export const dynamic = "force-dynamic"
import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Plus, Search, Filter, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils"
import { DeletePropertyButton } from "@/components/admin/delete-property-button"
import { TogglePropertyActions } from "@/components/admin/toggle-property-actions"

export const metadata: Metadata = { title: "Imóveis | Admin" }

const statusColors: Record<string, string> = {
  DISPONIVEL: "bg-emerald-50 text-emerald-700 border-emerald-200",
  VENDIDO: "bg-blue-50 text-blue-700 border-blue-200",
  ALUGADO: "bg-purple-50 text-purple-700 border-purple-200",
  RESERVADO: "bg-amber-50 text-amber-700 border-amber-200",
  INATIVO: "bg-gray-50 text-gray-600 border-gray-200",
}

const statusLabels: Record<string, string> = {
  DISPONIVEL: "Disponível", VENDIDO: "Vendido", ALUGADO: "Alugado",
  RESERVADO: "Reservado", INATIVO: "Inativo",
}

const typeLabels: Record<string, string> = {
  CASA: "Casa", APARTAMENTO: "Apto", TERRENO: "Terreno", RURAL: "Rural", COMERCIAL: "Comercial"
}

interface SearchParams { search?: string; status?: string; type?: string; page?: string }

export default async function AdminImoveisPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth()
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const limit = 15

  const where: any = {}
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { city: { contains: params.search, mode: "insensitive" } },
      { neighborhood: { contains: params.search, mode: "insensitive" } },
    ]
  }
  if (params.status) where.status = params.status
  if (params.type) where.type = params.type

  const isAdmin = session?.user?.role === "ADMIN"
  if (!isAdmin) where.userId = session?.user?.id

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { images: { take: 1, orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.property.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{total} imóvel{total !== 1 ? "is" : ""} no total</p>
        </div>
        <Link href="/admin/imoveis/novo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo imóvel
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <form className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="search"
              placeholder="Buscar por título, cidade..."
              defaultValue={params.search}
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select name="status" defaultValue={params.status || ""} className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">Todos os status</option>
            {Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select name="type" defaultValue={params.type || ""} className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">Todos os tipos</option>
            {Object.entries(typeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <Button type="submit" size="sm" variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          {(params.search || params.status || params.type) && (
            <Link href="/admin/imoveis">
              <Button size="sm" variant="ghost">Limpar</Button>
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {properties.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🏠</p>
            <p className="font-semibold text-foreground mb-1">Nenhum imóvel encontrado</p>
            <p className="text-sm text-muted-foreground mb-4">Tente ajustar os filtros ou adicione um novo imóvel.</p>
            <Link href="/admin/imoveis/novo">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Adicionar imóvel
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-[#FAFAFA]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Imóvel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Preço</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Destaques</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {properties.map((property: any) => (
                  <tr key={property.id} className="hover:bg-accent/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {property.images[0] ? (
                            <img src={property.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">🏠</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{property.title}</p>
                          <p className="text-xs text-muted-foreground">{property.neighborhood}, {property.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">{typeLabels[property.type]}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm font-medium text-foreground">{formatCurrency(property.price)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[property.status]}`}>
                        {statusLabels[property.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex gap-1.5">
                        <TogglePropertyActions propertyId={property.id} featured={property.featured} published={property.published} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/imoveis/${property.id}`} target="_blank">
                          <Button size="icon" variant="ghost" className="h-8 w-8" title="Ver no site">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/imoveis/${property.id}`}>
                          <Button size="icon" variant="ghost" className="h-8 w-8" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeletePropertyButton propertyId={property.id} propertyTitle={property.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/imoveis?${new URLSearchParams({ ...params, page: String(page - 1) })}`}>
                  <Button size="sm" variant="outline">Anterior</Button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/imoveis?${new URLSearchParams({ ...params, page: String(page + 1) })}`}>
                  <Button size="sm" variant="outline">Próxima</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
