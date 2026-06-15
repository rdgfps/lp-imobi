export const dynamic = "force-dynamic"
import React from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { MapPin, Bed, Bath, Maximize2, Car, Phone, MessageCircle, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/db"
import { formatCurrency, formatArea, generateWhatsAppLink, generatePropertyWhatsAppMessage } from "@/lib/utils"
import { SITE_CONFIG } from "@/lib/constants"
import type { Property } from "@/types"

const typeLabels: Record<string, string> = {
  CASA: "Casa", APARTAMENTO: "Apartamento", TERRENO: "Terreno", RURAL: "Imóvel Rural", COMERCIAL: "Comercial",
}

const purposeLabels: Record<string, string> = {
  VENDA: "Venda", ALUGUEL: "Aluguel", AMBOS: "Venda/Aluguel",
}

const badgeConfig: Record<string, string> = {
  DESTAQUE: "🔥 Destaque",
  OPORTUNIDADE: "💰 Oportunidade",
  NOVO: "🆕 Novo",
  EXCLUSIVO: "🏡 Exclusivo",
}

async function getProperty(id: string): Promise<Property | null> {
  try {
    const property = await prisma.property.findFirst({
      where: { id, published: true },
      include: {
        images: { orderBy: { order: "asc" } },
        features: true,
      },
    })
    return property as Property | null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) return { title: "Imóvel não encontrado" }
  return {
    title: property.title,
    description: property.description.substring(0, 160),
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) notFound()

  const whatsappMessage = generatePropertyWhatsAppMessage(property.title)
  const whatsappLink = generateWhatsAppLink(SITE_CONFIG.whatsapp, whatsappMessage)
  const visitMessage = `Olá! Gostaria de agendar uma visita para o imóvel "${property.title}".`
  const visitLink = generateWhatsAppLink(SITE_CONFIG.whatsapp, visitMessage)

  const sortedImages = [...property.images].sort((a, b) => a.order - b.order)

  return (
    <div className="pt-16 lg:pt-20 pb-16 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link href="/imoveis" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar para imóveis
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden mb-8">
              {sortedImages.length > 0 ? (
                <div className="grid gap-2">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={sortedImages[0].url}
                      alt={sortedImages[0].alt || property.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    {property.badge && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-sm font-semibold border border-white/20 shadow-sm">
                          {badgeConfig[property.badge]}
                        </span>
                      </div>
                    )}
                  </div>
                  {sortedImages.length > 1 && (
                    <div className={`grid gap-2 ${sortedImages.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                      {sortedImages.slice(1, sortedImages.length >= 3 ? 4 : 3).map((img, i) => (
                        <div key={img.id} className="relative aspect-video">
                          <Image src={img.url} alt={img.alt || `Imagem ${i + 2}`} fill className="object-cover" />
                          {i === 2 && sortedImages.length > 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-semibold">+{sortedImages.length - 4} fotos</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                  <span className="text-5xl">🏠</span>
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-border mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="default">{typeLabels[property.type]}</Badge>
                <Badge variant="outline">{purposeLabels[property.purpose]}</Badge>
                {property.status === "VENDIDO" && <Badge variant="destructive">Vendido</Badge>}
                {property.status === "RESERVADO" && <Badge variant="secondary">Reservado</Badge>}
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">{property.title}</h1>

              <div className="flex items-center gap-1.5 text-muted-foreground mb-6">
                <MapPin className="h-4 w-4" />
                <span>{property.address}, {property.neighborhood} — {property.city}/{property.state}</span>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAFAFA] rounded-xl mb-6">
                {property.bedrooms != null && (
                  <div className="flex flex-col items-center gap-1">
                    <Bed className="h-5 w-5 text-primary" />
                    <span className="font-bold text-foreground">{property.bedrooms}</span>
                    <span className="text-xs text-muted-foreground">Quarto{property.bedrooms !== 1 ? "s" : ""}</span>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex flex-col items-center gap-1">
                    <Bath className="h-5 w-5 text-primary" />
                    <span className="font-bold text-foreground">{property.bathrooms}</span>
                    <span className="text-xs text-muted-foreground">Banheiro{property.bathrooms !== 1 ? "s" : ""}</span>
                  </div>
                )}
                {property.area > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <Maximize2 className="h-5 w-5 text-primary" />
                    <span className="font-bold text-foreground">{property.area}</span>
                    <span className="text-xs text-muted-foreground">m²</span>
                  </div>
                )}
                {property.parkingSpots != null && (
                  <div className="flex flex-col items-center gap-1">
                    <Car className="h-5 w-5 text-primary" />
                    <span className="font-bold text-foreground">{property.parkingSpots}</span>
                    <span className="text-xs text-muted-foreground">Vaga{property.parkingSpots !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-3">Descrição</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            </div>

            {/* Features/Amenities */}
            {property.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-border mb-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Características</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.features.map((f) => (
                    <div key={f.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      {f.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map */}
            {property.latitude && property.longitude && (
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-border">
                <h2 className="text-lg font-bold text-foreground mb-4">Localização</h2>
                <div className="rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${property.longitude}!3d${property.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1spt!2sbr!4v1`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Price Card */}
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-4">
                <p className="text-sm text-muted-foreground mb-1">
                  {property.purpose === "ALUGUEL" ? "Aluguel por mês" : "Valor de venda"}
                </p>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {formatCurrency(property.price)}
                </p>
                {property.purpose === "ALUGUEL" && (
                  <p className="text-sm text-muted-foreground">/mês</p>
                )}

                {(property.condoFee || property.iptu) && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    {property.condoFee && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Condomínio</span>
                        <span className="font-medium">{formatCurrency(property.condoFee)}/mês</span>
                      </div>
                    )}
                    {property.iptu && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">IPTU</span>
                        <span className="font-medium">{formatCurrency(property.iptu)}/ano</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="whatsapp" className="w-full gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Tenho interesse
                    </Button>
                  </a>
                  <a href={visitLink} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <Calendar className="h-4 w-4" />
                      Agendar visita
                    </Button>
                  </a>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="subtle" className="w-full gap-2">
                      <Phone className="h-4 w-4" />
                      Solicitar informações
                    </Button>
                  </a>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Detalhes do imóvel</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Código</span>
                    <span className="font-medium font-mono text-xs">{property.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="font-medium">{typeLabels[property.type]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Finalidade</span>
                    <span className="font-medium">{purposeLabels[property.purpose]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Área total</span>
                    <span className="font-medium">{formatArea(property.area)}</span>
                  </div>
                  {property.suites != null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Suítes</span>
                      <span className="font-medium">{property.suites}</span>
                    </div>
                  )}
                  {property.floor != null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Andar</span>
                      <span className="font-medium">{property.floor}º</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cidade</span>
                    <span className="font-medium">{property.city}/{property.state}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
