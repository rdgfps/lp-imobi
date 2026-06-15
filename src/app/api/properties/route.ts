export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"
import { ITEMS_PER_PAGE } from "@/lib/constants"

const querySchema = z.object({
  type: z.enum(["CASA", "APARTAMENTO", "TERRENO", "RURAL", "COMERCIAL"]).optional(),
  purpose: z.enum(["VENDA", "ALUGUEL", "AMBOS"]).optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  status: z.enum(["DISPONIVEL", "VENDIDO", "ALUGADO", "RESERVADO", "INATIVO"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(ITEMS_PER_PAGE),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const parsed = querySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 })
    }

    const { type, purpose, city, neighborhood, minPrice, maxPrice, bedrooms, minArea, maxArea, status, featured, search, page, limit } = parsed.data

    const where: any = {
      published: true,
    }

    if (status) where.status = status
    else where.status = "DISPONIVEL"

    if (type) where.type = type
    if (purpose && purpose !== "AMBOS") {
      where.OR = [{ purpose }, { purpose: "AMBOS" }]
    }
    if (city && city !== "all") where.city = { contains: city, mode: "insensitive" }
    if (neighborhood) where.neighborhood = { contains: neighborhood, mode: "insensitive" }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }
    if (bedrooms !== undefined) where.bedrooms = { gte: bedrooms }
    if (minArea !== undefined || maxArea !== undefined) {
      where.area = {}
      if (minArea !== undefined) where.area.gte = minArea
      if (maxArea !== undefined) where.area.lte = maxArea
    }
    if (featured === "true") where.featured = true
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { neighborhood: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ]
    }

    const skip = (page - 1) * limit
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { images: { orderBy: { order: "asc" }, take: 1 }, features: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ])

    return NextResponse.json({
      data: properties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
