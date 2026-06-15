export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const propertySchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  type: z.enum(["CASA", "APARTAMENTO", "TERRENO", "RURAL", "COMERCIAL"]),
  purpose: z.enum(["VENDA", "ALUGUEL", "AMBOS"]),
  status: z.enum(["DISPONIVEL", "VENDIDO", "ALUGADO", "RESERVADO", "INATIVO"]).default("DISPONIVEL"),
  badge: z.enum(["DESTAQUE", "OPORTUNIDADE", "NOVO", "EXCLUSIVO"]).nullable().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  price: z.number().positive(),
  condoFee: z.number().nullable().optional(),
  iptu: z.number().nullable().optional(),
  area: z.number().positive(),
  bedrooms: z.number().int().min(0).nullable().optional(),
  bathrooms: z.number().int().min(0).nullable().optional(),
  suites: z.number().int().min(0).nullable().optional(),
  parkingSpots: z.number().int().min(0).nullable().optional(),
  floor: z.number().int().min(0).nullable().optional(),
  address: z.string().min(3).max(300),
  neighborhood: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  state: z.string().length(2).default("RS"),
  zipCode: z.string().max(10).nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  features: z.array(z.string().max(100)).max(50).default([]),
  images: z.array(z.string().url()).max(20).default([]),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = propertySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos", details: parsed.error.errors }, { status: 400 })
    }

    const { features, images, ...propertyData } = parsed.data

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        userId: session.user.id,
        features: {
          create: features.map((name) => ({ name })),
        },
        images: {
          create: images.map((url, index) => ({ url, order: index })),
        },
      },
      include: { images: true, features: true },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE_PROPERTY",
        entity: "Property",
        entityId: property.id,
        details: property.title,
        userId: session.user.id,
      },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
