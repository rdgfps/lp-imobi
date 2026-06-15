import type { Metadata } from "next"
import { Phone, TrendingUp, Eye, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"
import { generateWhatsAppLink } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Anunciar imóvel",
  description: "Anuncie seu imóvel na Canguçu Imóveis e alcance milhares de compradores.",
}

export default function AnunciarPage() {
  const whatsappLink = generateWhatsAppLink(
    SITE_CONFIG.whatsapp,
    "Olá! Gostaria de anunciar meu imóvel na plataforma."
  )

  return (
    <div className="pt-16 lg:pt-20 pb-16 bg-[#FAFAFA]">
      <section className="bg-white border-b border-border py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Anuncie seu imóvel<br />
            <span className="text-primary">e alcance mais compradores</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Nossa plataforma digital conecta seu imóvel a compradores e locatários em Canguçu e região, 24 horas por dia, 7 dias por semana.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="xl" variant="whatsapp" className="gap-2 shadow-lg shadow-green-600/20">
              <Phone className="h-5 w-5" />
              Quero anunciar meu imóvel
            </Button>
          </a>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Por que anunciar conosco?</h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Eye, title: "Visibilidade 24/7", desc: "Seu imóvel visível para compradores a qualquer hora do dia." },
              { icon: TrendingUp, title: "Mais contatos", desc: "Receba contatos de pessoas realmente interessadas no seu imóvel." },
              { icon: Users, title: "Equipe especializada", desc: "Corretores experientes para assessorar a negociação." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">Como funciona</h3>
            <div className="space-y-4">
              {[
                "Entre em contato pelo WhatsApp ou telefone",
                "Nossa equipe agenda uma visita ao imóvel",
                "Realizamos as fotos e colhemos as informações",
                "O imóvel é publicado na plataforma em até 24h",
                "Você recebe os contatos de compradores interessados",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-muted-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Falar com um corretor
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
