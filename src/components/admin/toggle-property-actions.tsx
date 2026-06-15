"use client"
import React, { useState } from "react"
import { Star, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TogglePropertyActionsProps {
  propertyId: string
  featured: boolean
  published: boolean
}

export function TogglePropertyActions({ propertyId, featured: initialFeatured, published: initialPublished }: TogglePropertyActionsProps) {
  const router = useRouter()
  const [featured, setFeatured] = useState(initialFeatured)
  const [published, setPublished] = useState(initialPublished)
  const [loading, setLoading] = useState(false)

  const toggle = async (field: "featured" | "published") => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field }),
      })
      if (response.ok) {
        if (field === "featured") setFeatured(!featured)
        else setPublished(!published)
        router.refresh()
      }
    } catch {}
    finally { setLoading(false) }
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className={cn("h-7 px-2 gap-1 text-xs", featured && "text-amber-600 bg-amber-50 hover:bg-amber-100")}
        onClick={() => toggle("featured")}
        disabled={loading}
        title={featured ? "Remover destaque" : "Marcar como destaque"}
      >
        <Star className={cn("h-3.5 w-3.5", featured && "fill-current")} />
        {featured ? "Destaque" : "Destacar"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={cn("h-7 px-2 gap-1 text-xs", !published && "text-gray-400")}
        onClick={() => toggle("published")}
        disabled={loading}
        title={published ? "Ocultar imóvel" : "Publicar imóvel"}
      >
        {published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        {published ? "Visível" : "Oculto"}
      </Button>
    </>
  )
}
