export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Canguçu Imóveis",
  description: "A imobiliária mais completa de Canguçu e região. Casas, apartamentos, terrenos e imóveis rurais.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5553999999999",
  email: "contato@cangucu-imoveis.com.br",
  phone: "(53) 9 9999-9999",
  address: "Rua Coronel Fonseca, 123 - Centro, Canguçu/RS",
  city: "Canguçu",
  state: "RS",
}

export const PROPERTY_TYPES = [
  { value: "CASA", label: "Casa", icon: "🏠" },
  { value: "APARTAMENTO", label: "Apartamento", icon: "🏢" },
  { value: "TERRENO", label: "Terreno", icon: "🌳" },
  { value: "RURAL", label: "Imóvel Rural", icon: "🚜" },
  { value: "COMERCIAL", label: "Comercial", icon: "🏪" },
]

export const PROPERTY_PURPOSES = [
  { value: "VENDA", label: "Comprar" },
  { value: "ALUGUEL", label: "Alugar" },
  { value: "AMBOS", label: "Comprar ou Alugar" },
]

export const PROPERTY_BADGES = [
  { value: "DESTAQUE", label: "🔥 Destaque" },
  { value: "OPORTUNIDADE", label: "💰 Oportunidade" },
  { value: "NOVO", label: "🆕 Novo" },
  { value: "EXCLUSIVO", label: "🏡 Exclusivo" },
]

export const PRICE_RANGES = [
  { label: "Até R$ 100 mil", min: 0, max: 100000 },
  { label: "R$ 100 mil - R$ 300 mil", min: 100000, max: 300000 },
  { label: "R$ 300 mil - R$ 500 mil", min: 300000, max: 500000 },
  { label: "R$ 500 mil - R$ 1 milhão", min: 500000, max: 1000000 },
  { label: "Acima de R$ 1 milhão", min: 1000000, max: null },
]

export const CITIES = [
  "Canguçu",
  "Pelotas",
  "São Lourenço do Sul",
  "Turuçu",
  "Cristal",
  "Amaral Ferrador",
  "Piratini",
]

export const MAX_IMAGES_PER_PROPERTY = 20
export const MAX_IMAGE_SIZE_MB = 5
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
export const ITEMS_PER_PAGE = 12
