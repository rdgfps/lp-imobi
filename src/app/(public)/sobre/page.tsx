import type { Metadata } from "next"
import Image from "next/image"
import { CheckCircle2, Phone, MapPin, Mail, Star, Users, Home, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"
import { generateWhatsAppLink } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Sobre nós",
  description: "Conheça a Canguçu Imóveis, a imobiliária mais completa de Canguçu e região.",
}

const stats = [
  { icon: Home, value: "100+", label: "Imóveis disponíveis" },
  { icon: Users, value: "500+", label: "Famílias atendidas" },
  { icon: Star, value: "15+", label: "Anos de experiência" },
  { icon: Award, value: "98%", label: "Clientes satisfeitos" },
]

export default function SobrePage() {
  const whatsappLink = generateWhatsAppLink(SITE_CONFIG.whatsapp, "Olá! Gostaria de conhecer melhor os serviços da imobiliária.")

  return (
    <div className="pt-16 lg:pt-20 pb-16 bg-[#FAFAFA]">
      {/* Hero */}
      <section className="bg-white border-b border-border py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Conectando pessoas<br />
                <span className="text-primary">ao lar ideal</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                A {SITE_CONFIG.name} nasceu com o objetivo de modernizar o mercado imobiliário de Canguçu e região, oferecendo uma experiência de compra e locação mais transparente, eficiente e satisfatória.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Com mais de 15 anos de mercado, nossa equipe local conhece cada bairro, cada rua e cada oportunidade da região. Somos a ponte entre você e o imóvel dos seus sonhos.
              </p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="whatsapp" className="gap-2">
                  <Phone className="h-5 w-5" />
                  Falar com nossa equipe
                </Button>
              </a>
            </div>
            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80"
                  alt="Equipe Canguçu Imóveis"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Nossa missão</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Facilitar a realização do sonho da casa própria e tornar o processo de locação mais simples, transparente e seguro para todos os envolvidos.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-left mt-12">
            {[
              { title: "Transparência", desc: "Informações claras e completas sobre cada imóvel, sem surpresas." },
              { title: "Agilidade", desc: "Processo otimizado para que você encontre o imóvel ideal mais rápido." },
              { title: "Segurança", desc: "Documentação verificada e assessoria jurídica em cada transação." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Onde nos encontrar</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: MapPin, label: "Endereço", value: SITE_CONFIG.address },
              { icon: Phone, label: "Telefone", value: SITE_CONFIG.phone },
              { icon: Mail, label: "E-mail", value: SITE_CONFIG.email },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground mb-1">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
