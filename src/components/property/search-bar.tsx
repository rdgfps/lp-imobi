"use client"
import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PROPERTY_TYPES, CITIES, PRICE_RANGES } from "@/lib/constants"

interface SearchBarProps {
  compact?: boolean
}

export function SearchBar({ compact = false }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [type, setType] = useState(searchParams.get("type") || "")
  const [city, setCity] = useState(searchParams.get("city") || "")
  const [priceRange, setPriceRange] = useState(searchParams.get("priceRange") || "")
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (type) params.set("type", type)
    if (city) params.set("city", city)
    if (search) params.set("search", search)
    if (priceRange) {
      const range = PRICE_RANGES[parseInt(priceRange)]
      if (range) {
        params.set("minPrice", range.min.toString())
        if (range.max) params.set("maxPrice", range.max.toString())
      }
    }
    router.push(`/imoveis?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  if (compact) {
    return (
      <div className="flex gap-2">
        <Input
          placeholder="Buscar imóveis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-border p-2 flex flex-col sm:flex-row gap-2">
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="sm:w-44 border-0 shadow-none focus:ring-0">
          <SelectValue placeholder="Tipo de imóvel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          {PROPERTY_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.icon} {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="hidden sm:block w-px bg-border self-stretch" />

      <Select value={city} onValueChange={setCity}>
        <SelectTrigger className="sm:w-44 border-0 shadow-none focus:ring-0">
          <SelectValue placeholder="Cidade ou bairro" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as cidades</SelectItem>
          {CITIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="hidden sm:block w-px bg-border self-stretch" />

      <Select value={priceRange} onValueChange={setPriceRange}>
        <SelectTrigger className="sm:w-52 border-0 shadow-none focus:ring-0">
          <SelectValue placeholder="Faixa de preço" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Qualquer valor</SelectItem>
          {PRICE_RANGES.map((range, i) => (
            <SelectItem key={i} value={i.toString()}>{range.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleSearch}
        size="lg"
        className="sm:px-8 gap-2 flex-shrink-0"
      >
        <Search className="h-4 w-4" />
        Buscar imóveis
      </Button>
    </div>
  )
}
