import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { PropertyForm } from "@/components/admin/property-form"
import type { Property } from "@/types"

export const metadata: Metadata = { title: "Editar Imóvel | Admin" }

async function getProperty(id: string): Promise<Property | null> {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } }, features: true },
    })
    return property as Property | null
  } catch {
    return null
  }
}

export default async function EditImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) notFound()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Editar imóvel</h2>
        <p className="text-muted-foreground text-sm mt-1 truncate">{property.title}</p>
      </div>
      <PropertyForm property={property} mode="edit" />
    </div>
  )
}
