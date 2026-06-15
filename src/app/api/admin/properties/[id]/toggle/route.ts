export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const toggleSchema = z.object({
  field: z.enum(["featured", "published"]),
})

export async function PATCH(
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

    const body = await request.json()
    const parsed = toggleSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Campo inválido" }, { status: 400 })
    }

    const existing = await prisma.property.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 })
    }

    const isAdmin = session.user.role === "ADMIN"
    if (!isAdmin && existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const { field } = parsed.data
    const currentValue = existing[field as keyof typeof existing] as boolean

    const property = await prisma.property.update({
      where: { id },
      data: { [field]: !currentValue },
    })

    await prisma.auditLog.create({
      data: {
        action: "TOGGLE_" + field.toUpperCase(),
        entity: "Property",
        entityId: id,
        details: `${field}: ${!currentValue}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error toggling property:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
