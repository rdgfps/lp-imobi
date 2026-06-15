export type UserRole = "ADMIN" | "CORRETOR"
export type PropertyStatus = "DISPONIVEL" | "VENDIDO" | "ALUGADO" | "RESERVADO" | "INATIVO"
export type PropertyType = "CASA" | "APARTAMENTO" | "TERRENO" | "RURAL" | "COMERCIAL"
export type PropertyPurpose = "VENDA" | "ALUGUEL" | "AMBOS"
export type PropertyBadge = "DESTAQUE" | "OPORTUNIDADE" | "NOVO" | "EXCLUSIVO"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: Date
}

export interface PropertyImage {
  id: string
  url: string
  alt?: string
  order: number
}

export interface PropertyFeature {
  id: string
  name: string
}

export interface Property {
  id: string
  title: string
  description: string
  type: PropertyType
  purpose: PropertyPurpose
  status: PropertyStatus
  badge?: PropertyBadge
  featured: boolean
  published: boolean
  price: number
  condoFee?: number
  iptu?: number
  area: number
  bedrooms?: number
  bathrooms?: number
  suites?: number
  parkingSpots?: number
  floor?: number
  address: string
  neighborhood: string
  city: string
  state: string
  zipCode?: string
  latitude?: number
  longitude?: number
  images: PropertyImage[]
  features: PropertyFeature[]
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface PropertyFilters {
  type?: PropertyType
  purpose?: PropertyPurpose
  city?: string
  neighborhood?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  minArea?: number
  maxArea?: number
  status?: PropertyStatus
  featured?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DashboardStats {
  totalProperties: number
  availableProperties: number
  soldProperties: number
  featuredProperties: number
  propertiesForSale: number
  propertiesForRent: number
}
