export const dynamic = "force-dynamic"
import React, { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2, Phone, Star, MapPin, Shield, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/property/search-bar"
import { PropertyCard } from "@/components/property/property-card"
import { PropertyCardSkeleton } from "@/components/property/property-skeleton"
import { SITE_CONFIG } from "@/lib/constants"
import { generateWhatsAppLink } from "@/lib/utils"
import { prisma } from "@/lib/db"
import type { Property } from "@/types"




async function getFeaturedProperties(): Promise<Property[]> {
  try {
    let properties = await prisma.property.findMany({
      where: { featured: true, published: true, status: "DISPONIVEL" },
      include: { images: true, features: true },
      orderBy: { updatedAt: "desc" },
      take: 3,
    })
    if (properties.length === 0) {
      properties = await prisma.property.findMany({
        where: { published: true, status: "DISPONIVEL" },
        include: { images: true, features: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      })
    }
    return properties as Property[]
  } catch {
    return []
  }
}

async function getLatestProperties(): Promise<Property[]> {
  try {
    const properties = await prisma.property.findMany({
      where: { published: true, status: "DISPONIVEL" },
      include: { images: true, features: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    })
    return properties as Property[]
  } catch {
    return []
  }
}

const categories = [
  { type: "CASA", label: "Casas", icon: "🏠", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80", count: "Residências" },
  { type: "APARTAMENTO", label: "Apartamentos", icon: "🏢", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", count: "Urbano" },
  { type: "TERRENO", label: "Terrenos", icon: "🌳", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80", count: "Para construir" },
  { type: "RURAL", label: "Imóveis Rurais", icon: "🚜", image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80", count: "Campo" },
]

const diferenciais = [
  { icon: Shield, title: "Imóveis Verificados", desc: "Todos os imóveis passam por verificação de documentação antes de serem anunciados." },
  { icon: MapPin, title: "Atendimento Local", desc: "Equipe local com profundo conhecimento do mercado de Canguçu e região." },
  { icon: Clock, title: "Disponível 24h", desc: "Consulte imóveis a qualquer hora. Nossa plataforma funciona dia e noite." },
  { icon: Users, title: "Suporte na Negociação", desc: "Acompanhamos todo o processo de compra ou aluguel ao seu lado." },
]

export default async function HomePage() {
  const [featuredProperties, latestProperties] = await Promise.all([
    getFeaturedProperties(),
    getLatestProperties(),
  ])

  const whatsappLink = generateWhatsAppLink(
    SITE_CONFIG.whatsapp,
    "Olá! Gostaria de mais informações sobre imóveis disponíveis."
  )

  return (
    <div className="pt-16 lg:pt-20">
      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-[#FAFAFA] to-[#F0F4F8] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Star className="h-3.5 w-3.5 fill-current" />
                A imobiliária mais completa de Canguçu
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Encontre seu
                <span className="text-primary block">próximo imóvel.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Casas, apartamentos, terrenos e imóveis rurais em Canguçu e região. Tudo em um só lugar, disponível 24 horas por dia.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/imoveis?purpose=VENDA">
                  <Button size="lg" className="gap-2">
                    Comprar imóvel
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/imoveis?purpose=ALUGUEL">
                  <Button size="lg" variant="outline" className="gap-2">
                    Alugar imóvel
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">100+</p>
                  <p className="text-xs text-muted-foreground">Imóveis</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">500+</p>
                  <p className="text-xs text-muted-foreground">Famílias atendidas</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">15+</p>
                  <p className="text-xs text-muted-foreground">Anos de mercado</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block animate-fade-in stagger-2">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85"
                  alt="Imóvel de destaque"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Imóvel verificado</p>
                    <p className="text-xs text-muted-foreground">Documentação conferida</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-12 max-w-3xl animate-fade-up stagger-3">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      {featuredProperties.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  🔥 Destaques da Semana
                </h2>
                <p className="text-muted-foreground">Imóveis que merecem sua atenção</p>
              </div>
              <Link href="/imoveis" className="hidden sm:flex items-center gap-1.5 text-primary font-medium hover:underline">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto sm:overflow-visible">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} featured />
              ))}
            </div>

            <div className="mt-8 sm:hidden text-center">
              <Link href="/imoveis">
                <Button variant="outline">Ver todos os imóveis</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="py-16 lg:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Encontre por categoria
            </h2>
            <p className="text-muted-foreground">Explore imóveis por tipo e encontre o que você procura</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((cat) => (
              <Link key={cat.type} href={`/imoveis?type=${cat.type}`} className="group">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-2xl mb-1">{cat.icon}</p>
                    <p className="text-white font-bold text-lg leading-tight">{cat.label}</p>
                    <p className="text-white/70 text-xs mt-0.5">{cat.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST PROPERTIES */}
      {latestProperties.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Imóveis recentes
                </h2>
                <p className="text-muted-foreground">Os mais novos disponíveis</p>
              </div>
              <Link href="/imoveis" className="hidden sm:flex items-center gap-1.5 text-primary font-medium hover:underline">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/imoveis">
                <Button size="lg" variant="outline" className="gap-2">
                  Ver todos os imóveis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* DIFERENCIAIS */}
      <section className="py-16 lg:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Por que escolher a {SITE_CONFIG.name}?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Trabalhamos para tornar a sua experiência de compra ou locação simples, segura e satisfatória.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Encontrou um imóvel interessante?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
            Nossa equipe está pronta para ajudar você a encontrar o imóvel ideal. Fale conosco agora mesmo.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="xl" variant="whatsapp" className="gap-2 shadow-lg shadow-green-600/30">
              <Phone className="h-5 w-5" />
              Falar no WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
