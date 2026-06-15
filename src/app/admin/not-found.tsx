import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h2 className="text-2xl font-bold mb-2">Página não encontrada</h2>
        <p className="text-muted-foreground mb-6">O recurso que você procura não existe.</p>
        <Link href="/admin/dashboard">
          <Button>Voltar ao dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
