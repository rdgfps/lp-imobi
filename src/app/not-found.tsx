import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-8xl mb-6">🏠</p>
        <h1 className="text-4xl font-bold text-foreground mb-3">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          O imóvel ou página que você está procurando não existe ou foi removida.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/">
            <Button>Voltar ao início</Button>
          </Link>
          <Link href="/imoveis">
            <Button variant="outline">Ver imóveis</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
