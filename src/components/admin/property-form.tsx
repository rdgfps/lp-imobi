"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Plus, Star, Eye, EyeOff, AlertCircle, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PROPERTY_TYPES, PROPERTY_PURPOSES, PROPERTY_BADGES, CITIES } from "@/lib/constants"
import type { Property } from "@/types"

interface PropertyFormProps {
  property?: Property
  mode: "create" | "edit"
}

const commonFeatures = [
  "Garagem", "Área de serviço", "Varanda", "Churrasqueira", "Piscina",
  "Academia", "Salão de festas", "Portaria 24h", "Elevador", "Ar condicionado",
  "Armários embutidos", "Cozinha americana", "Quintal", "Suíte master",
  "Lavabo", "Dependência de empregada", "Jardim", "Segurança 24h",
]

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    type: property?.type || "CASA",
    purpose: property?.purpose || "VENDA",
    status: property?.status || "DISPONIVEL",
    badge: property?.badge || "",
    featured: property?.featured || false,
    published: property?.published ?? true,
    price: property?.price?.toString() || "",
    condoFee: property?.condoFee?.toString() || "",
    iptu: property?.iptu?.toString() || "",
    area: property?.area?.toString() || "",
    bedrooms: property?.bedrooms?.toString() || "",
    bathrooms: property?.bathrooms?.toString() || "",
    suites: property?.suites?.toString() || "",
    parkingSpots: property?.parkingSpots?.toString() || "",
    floor: property?.floor?.toString() || "",
    address: property?.address || "",
    neighborhood: property?.neighborhood || "",
    city: property?.city || "Canguçu",
    state: property?.state || "RS",
    zipCode: property?.zipCode || "",
    latitude: property?.latitude?.toString() || "",
    longitude: property?.longitude?.toString() || "",
  })

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    property?.features?.map((f) => f.name) || []
  )
  const [customFeature, setCustomFeature] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>(
    property?.images?.sort((a, b) => a.order - b.order).map((img) => img.url) || []
  )
  const [newImageUrl, setNewImageUrl] = useState("")
  const [uploadingFiles, setUploadingFiles] = useState(false)

  const update = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    )
  }

  const addCustomFeature = () => {
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      setSelectedFeatures((prev) => [...prev, customFeature.trim()])
      setCustomFeature("")
    }
  }

  const addImageUrl = () => {
    if (newImageUrl.trim() && imageUrls.length < 20) {
      setImageUrls((prev) => [...prev, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploadingFiles(true)
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setError(`Arquivo ${file.name} excede o limite de 5MB.`)
          continue
        }
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if (!allowed.includes(file.type)) {
          setError(`Tipo de arquivo não permitido: ${file.type}`)
          continue
        }

        const formDataUpload = new FormData()
        formDataUpload.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        })

        if (res.ok) {
          const data = await res.json()
          setImageUrls((prev) => [...prev, data.url])
        }
      }
    } catch {
      setError("Erro ao enviar imagens.")
    } finally {
      setUploadingFiles(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!formData.title || !formData.description || !formData.price || !formData.area || !formData.address) {
      setError("Preencha todos os campos obrigatórios.")
      setIsLoading(false)
      return
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      area: parseFloat(formData.area),
      condoFee: formData.condoFee ? parseFloat(formData.condoFee) : null,
      iptu: formData.iptu ? parseFloat(formData.iptu) : null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      suites: formData.suites ? parseInt(formData.suites) : null,
      parkingSpots: formData.parkingSpots ? parseInt(formData.parkingSpots) : null,
      floor: formData.floor ? parseInt(formData.floor) : null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      badge: formData.badge || null,
      features: selectedFeatures,
      images: imageUrls,
    }

    try {
      const url = mode === "create" ? "/api/admin/properties" : `/api/admin/properties/${property?.id}`
      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(mode === "create" ? "Imóvel criado com sucesso!" : "Imóvel atualizado com sucesso!")
        if (mode === "create") {
          setTimeout(() => router.push(`/admin/imoveis/${data.id}`), 1000)
        } else {
          router.refresh()
        }
      } else {
        const err = await response.json()
        const firstDetail = Array.isArray(err.details) ? err.details[0]?.message : null
        setError(firstDetail || err.error || "Erro ao salvar imóvel.")
      }
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader><CardTitle>Informações básicas</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título do imóvel *</Label>
            <Input id="title" value={formData.title} onChange={(e) => update("title", e.target.value)} placeholder="Ex: Casa com 3 quartos no Centro" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => update("description", e.target.value)} placeholder="Descreva o imóvel em detalhes..." rows={5} className="mt-1.5" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Tipo *</Label>
              <Select value={formData.type} onValueChange={(v) => update("type", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.icon} {t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Finalidade *</Label>
              <Select value={formData.purpose} onValueChange={(v) => update("purpose", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROPERTY_PURPOSES.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[
                    { value: "DISPONIVEL", label: "Disponível" },
                    { value: "VENDIDO", label: "Vendido" },
                    { value: "ALUGADO", label: "Alugado" },
                    { value: "RESERVADO", label: "Reservado" },
                    { value: "INATIVO", label: "Inativo" },
                  ].map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Badge</Label>
              <Select value={formData.badge || "none"} onValueChange={(v) => update("badge", v === "none" ? "" : v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Sem badge" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem badge</SelectItem>
                  {PROPERTY_BADGES.map((b) => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-4 pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.featured} onChange={(e) => update("featured", e.target.checked)} className="w-4 h-4 rounded border-input accent-primary" />
                <span className="text-sm font-medium flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" />Destaque</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.published} onChange={(e) => update("published", e.target.checked)} className="w-4 h-4 rounded border-input accent-primary" />
                <span className="text-sm font-medium flex items-center gap-1">
                  {formData.published ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                  {formData.published ? "Publicado" : "Oculto"}
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader><CardTitle>Valores</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input id="price" type="number" value={formData.price} onChange={(e) => update("price", e.target.value)} placeholder="350000" className="mt-1.5" required min="0" />
          </div>
          <div>
            <Label htmlFor="condoFee">Condomínio/mês (R$)</Label>
            <Input id="condoFee" type="number" value={formData.condoFee} onChange={(e) => update("condoFee", e.target.value)} placeholder="500" className="mt-1.5" min="0" />
          </div>
          <div>
            <Label htmlFor="iptu">IPTU/ano (R$)</Label>
            <Input id="iptu" type="number" value={formData.iptu} onChange={(e) => update("iptu", e.target.value)} placeholder="1200" className="mt-1.5" min="0" />
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader><CardTitle>Detalhes do imóvel</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { id: "area", label: "Área (m²) *", placeholder: "120" },
            { id: "bedrooms", label: "Quartos", placeholder: "3" },
            { id: "bathrooms", label: "Banheiros", placeholder: "2" },
            { id: "suites", label: "Suítes", placeholder: "1" },
            { id: "parkingSpots", label: "Vagas", placeholder: "2" },
          ].map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type="number"
                value={formData[field.id as keyof typeof formData] as string}
                onChange={(e) => update(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="mt-1.5"
                min="0"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader><CardTitle>Localização</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Endereço *</Label>
            <Input id="address" value={formData.address} onChange={(e) => update("address", e.target.value)} placeholder="Rua das Flores, 123" className="mt-1.5" required />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input id="neighborhood" value={formData.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} placeholder="Centro" className="mt-1.5" required />
            </div>
            <div>
              <Label>Cidade</Label>
              <Select value={formData.city} onValueChange={(v) => update("city", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" value={formData.zipCode} onChange={(e) => update("zipCode", e.target.value)} placeholder="96600-000" className="mt-1.5" maxLength={9} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude (opcional)</Label>
              <Input id="latitude" value={formData.latitude} onChange={(e) => update("latitude", e.target.value)} placeholder="-31.3984" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude (opcional)</Label>
              <Input id="longitude" value={formData.longitude} onChange={(e) => update("longitude", e.target.value)} placeholder="-52.6768" className="mt-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader><CardTitle>Características</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {commonFeatures.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  selectedFeatures.includes(feature)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-accent"
                }`}
              >
                {selectedFeatures.includes(feature) ? "✓ " : ""}{feature}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={customFeature}
              onChange={(e) => setCustomFeature(e.target.value)}
              placeholder="Adicionar característica personalizada"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomFeature() } }}
            />
            <Button type="button" variant="outline" onClick={addCustomFeature}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {selectedFeatures.filter((f) => !commonFeatures.includes(f)).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedFeatures.filter((f) => !commonFeatures.includes(f)).map((feature) => (
                <span key={feature} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                  {feature}
                  <button type="button" onClick={() => toggleFeature(feature)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader><CardTitle>Imagens ({imageUrls.length}/20)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* File upload */}
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={uploadingFiles || imageUrls.length >= 20}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {uploadingFiles ? "Enviando..." : "Clique para enviar imagens (JPG, PNG, WebP — max 5MB cada)"}
              </p>
            </label>
          </div>

          {/* URL input */}
          <div className="flex gap-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Ou cole uma URL de imagem"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImageUrl() } }}
            />
            <Button type="button" variant="outline" onClick={addImageUrl} disabled={imageUrls.length >= 20}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Preview */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-muted">
                  <img src={url} alt={`Imagem ${i + 1}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-md">Principal</div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3 sticky bottom-0 bg-[#F4F6F9] py-4 border-t border-border -mx-8 px-8">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isLoading ? "Salvando..." : mode === "create" ? "Criar imóvel" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  )
}
