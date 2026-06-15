export const dynamic = "force-dynamic"
import React, { Suspense } from "react"
import type { Metadata } from "next"
import { SearchBar } from "@/components/property/search-bar"
import { PropertyCard } from "@/components/property/property-card"
import { prisma } from "@/lib/db"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import type { Property } from "@/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Imóveis",
  description: "Explore nosso catálogo completo de imóveis em Canguçu e região.",
}

interface SearchParams {
  type?: string
  purpose?: string
  city?: string
  minPrice?: string
  maxPrice?: string
  bedrooms?: string
  search?: string
  page?: string
}

function withTimeout<T>(promise: Promise<T>, ms = 3000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Database query timed out")), ms)
    }),
  ])
}

function canQueryDatabase() {
  return !process.env.DATABASE_URL?.includes("postgresql://root:@")
}

async function getProperties(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || "1")
  const limit = ITEMS_PER_PAGE
  const skip = (page - 1) * limit

  const where: any = { published: true, status: "DISPONIVEL" }

  if (searchParams.type && searchParams.type !== "all") where.type = searchParams.type
  if (searchParams.purpose && searchParams.purpose !== "all") {
    const p = searchParams.purpose
    if (p === "VENDA" || p === "ALUGUEL") {
      where.OR = [{ purpose: p }, { purpose: "AMBOS" }]
    }
  }
  if (searchParams.city && searchParams.city !== "all") {
    where.city = { contains: searchParams.city, mode: "insensitive" }
  }
  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {}
    if (searchParams.minPrice) where.price.gte = parseFloat(searchParams.minPrice)
    if (searchParams.maxPrice) where.price.lte = parseFloat(searchParams.maxPrice)
  }
  if (searchParams.bedrooms) where.bedrooms = { gte: parseInt(searchParams.bedrooms) }
  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
      { neighborhood: { contains: searchParams.search, mode: "insensitive" } },
      { city: { contains: searchParams.search, mode: "insensitive" } },
    ]
  }

  if (!canQueryDatabase()) {
    return { properties: [] as Property[], total: 0, page, totalPages: 0 }
  }

  try {
    const [properties, total] = await withTimeout(
      Promise.all([
        prisma.property.findMany({
          where,
          include: { images: { orderBy: { order: "asc" } }, features: true },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          skip,
          take: limit,
        }),
        prisma.property.count({ where }),
      ])
    )

    return { properties: properties as Property[], total, page, totalPages: Math.ceil(total / limit) }
  } catch {
    return { properties: [] as Property[], total: 0, page, totalPages: 0 }
  }
}

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { properties, total, page, totalPages } = await getProperties(params)

  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams(params as Record<string, string>)
    sp.set("page", p.toString())
    return `/imoveis?${sp.toString()}`
  }

  const purposeLabel = params.purpose === "VENDA" ? "Comprar" : params.purpose === "ALUGUEL" ? "Alugar" : "Todos"

  return (
    <div className="pt-16 lg:pt-20 pb-16 bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {params.type ? `${params.type.charAt(0) + params.type.slice(1).toLowerCase()}s` : "Imóveis"}{" "}
            {params.purpose === "VENDA" ? "para Venda" : params.purpose === "ALUGUEL" ? "para Alugar" : ""}
          </h1>
          <p className="text-muted-foreground mb-6">
            {total === 0 ? "Nenhum imóvel encontrado" : `${total} imóvel${total !== 1 ? "is" : ""} encontrado${total !== 1 ? "s" : ""}`}
          </p>
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏠</p>
            <h2 className="text-xl font-bold text-foreground mb-2">Nenhum imóvel encontrado</h2>
            <p className="text-muted-foreground mb-6">Tente ajustar os filtros ou realizar uma nova busca.</p>
            <Link href="/imoveis">
              <Button variant="outline">Limpar filtros</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {page > 1 && (
                  <Link href={buildPageUrl(page - 1)}>
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 2)
                  .map((p) => (
                    <Link key={p} href={buildPageUrl(p)}>
                      <Button variant={p === page ? "default" : "outline"} size="sm" className="w-10">
                        {p}
                      </Button>
                    </Link>
                  ))}
                {page < totalPages && (
                  <Link href={buildPageUrl(page + 1)}>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
