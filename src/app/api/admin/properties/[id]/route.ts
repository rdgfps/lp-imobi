export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  type: z.enum(["CASA", "APARTAMENTO", "TERRENO", "RURAL", "COMERCIAL"]).optional(),
  purpose: z.enum(["VENDA", "ALUGUEL", "AMBOS"]).optional(),
  status: z.enum(["DISPONIVEL", "VENDIDO", "ALUGADO", "RESERVADO", "INATIVO"]).optional(),
  badge: z.enum(["DESTAQUE", "OPORTUNIDADE", "NOVO", "EXCLUSIVO"]).nullable().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  price: z.number().positive().optional(),
  condoFee: z.number().nullable().optional(),
  iptu: z.number().nullable().optional(),
  area: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).nullable().optional(),
  bathrooms: z.number().int().min(0).nullable().optional(),
  suites: z.number().int().min(0).nullable().optional(),
  parkingSpots: z.number().int().min(0).nullable().optional(),
  floor: z.number().int().min(0).nullable().optional(),
  address: z.string().min(3).max(300).optional(),
  neighborhood: z.string().min(2).max(100).optional(),
  city: z.string().min(2).max(100).optional(),
  state: z.string().length(2).optional(),
  zipCode: z.string().max(10).nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  features: z.array(z.string().max(100)).max(50).optional(),
  images: z.array(z.string()).max(20).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    if (!id || id.length > 50) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const existing = await prisma.property.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 })
    }

    // Corretores can only edit their own properties
    const isAdmin = session.user.role === "ADMIN"
    if (!isAdmin && existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const { features, images, ...propertyData } = parsed.data

    const property = await prisma.$transaction(async (tx: any) => {
      if (features !== undefined) {
        await tx.propertyFeature.deleteMany({ where: { propertyId: id } })
        await tx.propertyFeature.createMany({
          data: features.map((name) => ({ name, propertyId: id })),
        })
      }

      if (images !== undefined) {
        await tx.propertyImage.deleteMany({ where: { propertyId: id } })
        await tx.propertyImage.createMany({
          data: images.map((url, index) => ({ url, order: index, propertyId: id })),
        })
      }

      return tx.property.update({
        where: { id },
        data: propertyData,
        include: { images: true, features: true },
      })
    })

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_PROPERTY",
        entity: "Property",
        entityId: id,
        details: property.title,
        userId: session.user.id,
      },
    })

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    if (!id || id.length > 50) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const existing = await prisma.property.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 })
    }

    const isAdmin = session.user.role === "ADMIN"
    if (!isAdmin) {
      return NextResponse.json({ error: "Apenas administradores podem excluir imóveis" }, { status: 403 })
    }

    await prisma.property.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        action: "DELETE_PROPERTY",
        entity: "Property",
        entityId: id,
        details: existing.title,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
