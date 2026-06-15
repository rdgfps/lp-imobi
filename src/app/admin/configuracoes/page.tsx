export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SITE_CONFIG } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Lock, Phone, Globe } from "lucide-react"




export const metadata: Metadata = { title: "Configurações | Admin" }

export default async function ConfiguracoesPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/admin/dashboard")

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-sm text-muted-foreground">Configurações do sistema e informações do site.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Informações do site
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Nome do site", value: SITE_CONFIG.name },
            { label: "URL do site", value: SITE_CONFIG.url },
            { label: "Cidade", value: SITE_CONFIG.city + "/" + SITE_CONFIG.state },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "WhatsApp", value: SITE_CONFIG.whatsapp },
            { label: "Telefone", value: SITE_CONFIG.phone },
            { label: "E-mail", value: SITE_CONFIG.email },
            { label: "Endereço", value: SITE_CONFIG.address },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-start py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground flex-shrink-0">{item.label}</span>
              <span className="text-sm font-medium text-right ml-4">{item.value}</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            ⚠️ Para alterar dados de contato, edite as variáveis de ambiente no servidor.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: "Autenticação", value: "NextAuth.js com JWT", ok: true },
              { label: "Hash de senhas", value: "bcrypt (12 rounds)", ok: true },
              { label: "Proteção de rotas", value: "Middleware + Server-side", ok: true },
              { label: "Validação de dados", value: "Zod (client + server)", ok: true },
              { label: "Proteção CSRF", value: "NextAuth built-in", ok: true },
              { label: "Upload seguro", value: "Validação de tipo + tamanho", ok: true },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Informações técnicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { label: "Framework", value: "Next.js 15 (App Router)" },
              { label: "Banco de dados", value: "PostgreSQL + Prisma ORM" },
              { label: "UI Components", value: "Tailwind CSS + shadcn/ui" },
              { label: "Autenticação", value: "Auth.js v5 (NextAuth)" },
              { label: "Ambiente", value: process.env.NODE_ENV },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium font-mono text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
