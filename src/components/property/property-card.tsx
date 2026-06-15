"use client"
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Maximize2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency, formatArea, generateWhatsAppLink, generatePropertyWhatsAppMessage } from "@/lib/utils"
import { SITE_CONFIG } from "@/lib/constants"
import type { Property } from "@/types"

const badgeConfig = {
  DESTAQUE: { label: "🔥 Destaque", className: "bg-orange-50 text-orange-700 border-orange-200" },
  OPORTUNIDADE: { label: "💰 Oportunidade", className: "bg-green-50 text-green-700 border-green-200" },
  NOVO: { label: "🆕 Novo", className: "bg-blue-50 text-blue-700 border-blue-200" },
  EXCLUSIVO: { label: "🏡 Exclusivo", className: "bg-purple-50 text-purple-700 border-purple-200" },
}

const typeLabels: Record<string, string> = {
  CASA: "Casa",
  APARTAMENTO: "Apartamento",
  TERRENO: "Terreno",
  RURAL: "Imóvel Rural",
  COMERCIAL: "Comercial",
}

const purposeLabels: Record<string, string> = {
  VENDA: "Venda",
  ALUGUEL: "Aluguel",
  AMBOS: "Venda/Aluguel",
}

interface PropertyCardProps {
  property: Property
  featured?: boolean
  className?: string
}

export function PropertyCard({ property, featured = false, className }: PropertyCardProps) {
  const mainImage = property.images.sort((a, b) => a.order - b.order)[0]
  const whatsappMessage = generatePropertyWhatsAppMessage(property.title)
  const whatsappLink = generateWhatsAppLink(SITE_CONFIG.whatsapp, whatsappMessage)

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        featured && "ring-2 ring-primary/20",
        className
      )}
    >
      {/* Image */}
      <Link href={`/imoveis/${property.id}`} className="block relative overflow-hidden">
        <div className={cn("relative bg-muted", featured ? "aspect-[4/3]" : "aspect-[16/10]")}>
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt || property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-4xl">🏠</span>
            </div>
          )}
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {property.badge && (
              <span className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm bg-white/90",
                badgeConfig[property.badge]?.className
              )}>
                {badgeConfig[property.badge]?.label}
              </span>
            )}
            {property.status === "VENDIDO" && (
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-900/90 text-white border-transparent backdrop-blur-sm">
                Vendido
              </span>
            )}
          </div>
          {/* Purpose badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/90 text-white border-transparent backdrop-blur-sm">
              {purposeLabels[property.purpose]}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-primary uppercase tracking-wide">
            {typeLabels[property.type]}
          </span>
        </div>

        <Link href={`/imoveis/${property.id}`}>
          <h3 className={cn(
            "font-bold text-foreground leading-tight mb-2 line-clamp-2 hover:text-primary transition-colors",
            featured ? "text-lg" : "text-base"
          )}>
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-sm line-clamp-1">
            {property.neighborhood}, {property.city}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 mb-4">
          {property.bedrooms != null && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bed className="h-3.5 w-3.5" />
              <span className="text-sm">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bath className="h-3.5 w-3.5" />
              <span className="text-sm">{property.bathrooms}</span>
            </div>
          )}
          {property.area > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="text-sm">{formatArea(property.area)}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={cn(
              "font-bold text-foreground",
              featured ? "text-2xl" : "text-xl"
            )}>
              {formatCurrency(property.price)}
            </p>
            {property.purpose === "ALUGUEL" && (
              <p className="text-xs text-muted-foreground">/mês</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/imoveis/${property.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Ver imóvel
            </Button>
          </Link>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="sm" className="gap-1.5">
              <MessageCircle className="h-4 w-4" />
              Tenho interesse
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
