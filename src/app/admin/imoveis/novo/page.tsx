import type { Metadata } from "next"
import { PropertyForm } from "@/components/admin/property-form"

export const metadata: Metadata = { title: "Novo Imóvel | Admin" }

export default function NovoImovelPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Novo imóvel</h2>
        <p className="text-muted-foreground text-sm mt-1">Preencha os dados para cadastrar um novo imóvel.</p>
      </div>
      <PropertyForm mode="create" />
    </div>
  )
}
