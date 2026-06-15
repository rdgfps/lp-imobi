export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id || typeof id !== "string" || id.length > 50) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const property = await prisma.property.findFirst({
      where: { id, published: true },
      include: {
        images: { orderBy: { order: "asc" } },
        features: true,
        createdBy: { select: { name: true } },
      },
    })

    if (!property) {
      return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
