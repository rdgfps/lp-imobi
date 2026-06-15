import type { Metadata } from "next"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"
import { generateWhatsAppLink } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a Canguçu Imóveis. Estamos prontos para ajudar você.",
}

export default function ContatoPage() {
  const whatsappLink = generateWhatsAppLink(SITE_CONFIG.whatsapp, "Olá! Gostaria de mais informações.")

  return (
    <div className="pt-16 lg:pt-20 pb-16 bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Fale conosco</h1>
          <p className="text-lg text-muted-foreground">Nossa equipe está pronta para ajudar você a encontrar o imóvel ideal.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-6">Canais de atendimento</h2>
            
            {[
              {
                icon: MessageCircle,
                title: "WhatsApp",
                desc: "Resposta rápida pelo WhatsApp",
                value: SITE_CONFIG.phone,
                action: whatsappLink,
                actionLabel: "Enviar mensagem",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Phone,
                title: "Telefone",
                desc: "Ligue para nós",
                value: SITE_CONFIG.phone,
                action: `tel:${SITE_CONFIG.phone}`,
                actionLabel: "Ligar agora",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                icon: Mail,
                title: "E-mail",
                desc: "Envie sua mensagem",
                value: SITE_CONFIG.email,
                action: `mailto:${SITE_CONFIG.email}`,
                actionLabel: "Enviar e-mail",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-border flex items-start gap-4">
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground mb-0.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                  <p className="text-sm font-medium text-foreground mb-3">{item.value}</p>
                  <a href={item.action} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">{item.actionLabel}</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Info Side */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-border mb-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Nossa localização
              </h3>
              <p className="text-muted-foreground text-sm mb-4">{SITE_CONFIG.address}</p>
              <div className="rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Mapa — Canguçu/RS</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Horário de atendimento
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: "Segunda a Sexta", time: "08:00 – 18:00" },
                  { day: "Sábado", time: "08:00 – 12:00" },
                  { day: "Domingo", time: "Fechado" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground">{item.day}</span>
                    <span className="font-medium text-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-xl">
                <p className="text-xs text-primary font-medium">
                  💬 WhatsApp disponível 24h para dúvidas sobre imóveis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
