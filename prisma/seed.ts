import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const unsplashImages = {
  casa: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80",
  ],
  apto: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  ],
  terreno: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    "https://images.unsplash.com/photo-1527430253228-e93688616381?w=800&q=80",
  ],
  rural: [
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
    "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80",
  ],
  interior: [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  ],
}

async function main() {
  console.log("🌱 Iniciando seed...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123456", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@cangucu.com.br" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@cangucu.com.br",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log("✅ Admin criado:", admin.email)

  // Create corretor
  const corretorPassword = await bcrypt.hash("corretor123", 12)
  const corretor = await prisma.user.upsert({
    where: { email: "corretor@cangucu.com.br" },
    update: {},
    create: {
      name: "Carlos Souza",
      email: "corretor@cangucu.com.br",
      password: corretorPassword,
      role: "CORRETOR",
    },
  })
  console.log("✅ Corretor criado:", corretor.email)

  // Clear existing properties
  await prisma.propertyImage.deleteMany()
  await prisma.propertyFeature.deleteMany()
  await prisma.property.deleteMany()

  const properties = [
    {
      title: "Casa Térrea com Jardim no Centro",
      description: "Excelente casa térrea localizada no centro de Canguçu, a poucos metros de comércios e serviços. Imóvel em ótimo estado de conservação, com acabamento de qualidade e espaços amplos. Ideal para família que busca conforto e praticidade.\n\nA residência conta com sala de estar espaçosa, cozinha americana moderna, 3 dormitórios sendo 1 suíte, banheiro social, lavabo e área de serviço completa. O quintal possui jardim bem cuidado e área para churrasqueira.",
      type: "CASA" as const,
      purpose: "VENDA" as const,
      status: "DISPONIVEL" as const,
      badge: "DESTAQUE" as const,
      featured: true,
      published: true,
      price: 320000,
      iptu: 800,
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      suites: 1,
      parkingSpots: 2,
      address: "Rua Coronel Genuíno, 450",
      neighborhood: "Centro",
      city: "Canguçu",
      state: "RS",
      zipCode: "96600-000",
      latitude: -31.3984,
      longitude: -52.6768,
      images: [unsplashImages.casa[0], unsplashImages.interior[0], unsplashImages.interior[1], unsplashImages.casa[1]],
      features: ["Garagem", "Quintal", "Churrasqueira", "Área de serviço", "Jardim", "Armários embutidos"],
    },
    {
      title: "Apartamento Moderno com Vista para o Centro",
      description: "Apartamento de alto padrão com localização privilegiada no coração de Canguçu. Vista panorâmica, acabamento nobre e total infraestrutura de condomínio. Uma oportunidade única de morar com conforto e segurança.\n\nO apartamento possui sala de estar/jantar integrada, varanda gourmet, cozinha planejada, 2 dormitórios sendo 1 suíte com closet, 2 banheiros e 1 vaga de garagem coberta.",
      type: "APARTAMENTO" as const,
      purpose: "VENDA" as const,
      status: "DISPONIVEL" as const,
      badge: "NOVO" as const,
      featured: true,
      published: true,
      price: 250000,
      condoFee: 350,
      iptu: 600,
      area: 85,
      bedrooms: 2,
      bathrooms: 2,
      suites: 1,
      parkingSpots: 1,
      floor: 5,
      address: "Av. Rio Branco, 780",
      neighborhood: "Centro",
      city: "Canguçu",
      state: "RS",
      zipCode: "96600-100",
      images: [unsplashImages.apto[0], unsplashImages.apto[1], unsplashImages.interior[2]],
      features: ["Elevador", "Portaria 24h", "Varanda", "Armários embutidos", "Ar condicionado", "Cozinha americana"],
    },
    {
      title: "Fazenda com 50 Hectares — Produção e Lazer",
      description: "Propriedade rural completa com 50 hectares em localização estratégica, a apenas 15 km de Canguçu. Excelente para criação de gado, produção agrícola ou turismo rural. Terreno fértil com acesso à água abundante.\n\nA fazenda possui sede com 4 dormitórios, galpão para equipamentos, curral, açude, sistema de irrigação e energia elétrica. Toda a documentação regularizada.",
      type: "RURAL" as const,
      purpose: "VENDA" as const,
      status: "DISPONIVEL" as const,
      badge: "EXCLUSIVO" as const,
      featured: true,
      published: true,
      price: 1200000,
      area: 500000,
      bedrooms: 4,
      bathrooms: 2,
      parkingSpots: 10,
      address: "Estrada Municipal Km 15",
      neighborhood: "Zona Rural",
      city: "Canguçu",
      state: "RS",
      latitude: -31.4200,
      longitude: -52.7100,
      images: [unsplashImages.rural[0], unsplashImages.rural[1], unsplashImages.rural[2]],
      features: ["Açude", "Galpão", "Energia elétrica", "Curral", "Sistema de irrigação", "Sede residencial"],
    },
    {
      title: "Terreno Plano no Bairro São Miguel",
      description: "Excelente terreno plano localizado no bairro São Miguel, em área de crescimento e valorização. Infraestrutura completa: água, luz, esgoto e asfalto. Ideal para construção residencial ou comercial.\n\nDocumentação completa e em dia. Frente de 12 metros e profundidade de 30 metros. Vizinhança tranquila e bem estruturada.",
      type: "TERRENO" as const,
      purpose: "VENDA" as const,
      status: "DISPONIVEL" as const,
      badge: "OPORTUNIDADE" as const,
      featured: false,
      published: true,
      price: 85000,
      iptu: 200,
      area: 360,
      address: "Rua São Miguel, 200",
      neighborhood: "São Miguel",
      city: "Canguçu",
      state: "RS",
      zipCode: "96600-200",
      images: [unsplashImages.terreno[0], unsplashImages.terreno[1]],
      features: ["Água encanada", "Energia elétrica", "Esgoto", "Rua asfaltada", "Frente ao sol"],
    },
    {
      title: "Casa para Alugar — 2 Quartos com Garagem",
      description: "Ótima casa para locação residencial no bairro Jardim das Flores. Imóvel bem conservado, com ambientes iluminados e ventilados. Próximo a escolas, supermercados e transporte público.\n\nDisponibilidade imediata. Inclui garagem para 1 carro, área de serviço coberta e quintal murado.",
      type: "CASA" as const,
      purpose: "ALUGUEL" as const,
      status: "DISPONIVEL" as const,
      badge: null,
      featured: false,
      published: true,
      price: 900,
      area: 80,
      bedrooms: 2,
      bathrooms: 1,
      parkingSpots: 1,
      address: "Rua das Acácias, 78",
      neighborhood: "Jardim das Flores",
      city: "Canguçu",
      state: "RS",
      zipCode: "96600-300",
      images: [unsplashImages.casa[2], unsplashImages.interior[3]],
      features: ["Garagem", "Quintal", "Área de serviço"],
    },
    {
      title: "Casa Ampla com Piscina no Bairro Nações",
      description: "Residência espaçosa em um dos bairros mais nobres de Canguçu. A casa possui 4 dormitórios, sendo 2 suítes, sala de estar e jantar amplas, cozinha gourmet e área de lazer completa com piscina e churrasqueira.\n\nAcabamento de alto padrão, com porcelanato, bancadas em granito e esquadrias em alumínio.",
      type: "CASA" as const,
      purpose: "VENDA" as const,
      status: "DISPONIVEL" as const,
      badge: "EXCLUSIVO" as const,
      featured: false,
      published: true,
      price: 650000,
      iptu: 1500,
      area: 280,
      bedrooms: 4,
      bathrooms: 3,
      suites: 2,
      parkingSpots: 3,
      address: "Av. das Nações, 1200",
      neighborhood: "Nações",
      city: "Canguçu",
      state: "RS",
      zipCode: "96600-400",
      images: [unsplashImages.casa[3], unsplashImages.interior[0], unsplashImages.interior[1]],
      features: ["Piscina", "Churrasqueira", "Jardim", "Garagem", "Suíte master", "Cozinha gourmet", "Segurança 24h"],
    },
    {
      title: "Sítio com Casa e Galpão — 5 Hectares",
      description: "Sítio produtivo com excelente localização a 8 km do centro de Canguçu. Propriedade com 5 hectares, casa sede com 3 quartos, galpão multiuso, poço artesiano e pomar diversificado.\n\nIdeal para horticultura, floricultura ou turismo rural. Terreno com topografia mista (parte plana, parte ondulada).",
      type: "RURAL" as const,
      purpose: "VENDA" as const,
      status: "DISPONIVEL" as const,
      badge: null,
      featured: false,
      published: true,
      price: 280000,
      area: 50000,
      bedrooms: 3,
      bathrooms: 1,
      address: "Estrada do Morro, Km 8",
      neighborhood: "Zona Rural",
      city: "Canguçu",
      state: "RS",
      images: [unsplashImages.rural[1], unsplashImages.rural[0]],
      features: ["Poço artesiano", "Galpão", "Pomar", "Energia elétrica", "Sede residencial"],
    },
    {
      title: "Apartamento Studio — Centro de Pelotas",
      description: "Studio moderno e funcional no centro de Pelotas, próximo à universidade e serviços. Perfeito para estudantes e profissionais que buscam praticidade e localização.\n\nAmbiente integrado com cozinha americana, banheiro completo e varanda. Condomínio com academia e lavanderia coletiva.",
      type: "APARTAMENTO" as const,
      purpose: "ALUGUEL" as const,
      status: "DISPONIVEL" as const,
      badge: "NOVO" as const,
      featured: false,
      published: true,
      price: 1200,
      condoFee: 250,
      area: 38,
      bedrooms: 1,
      bathrooms: 1,
      floor: 3,
      address: "Rua XV de Novembro, 456",
      neighborhood: "Centro",
      city: "Pelotas",
      state: "RS",
      zipCode: "96010-000",
      images: [unsplashImages.apto[2], unsplashImages.interior[2]],
      features: ["Academia", "Lavanderia coletiva", "Elevador", "Varanda"],
    },
  ]

  for (const p of properties) {
    const { images, features, ...propertyData } = p
    const created = await prisma.property.create({
      data: {
        ...propertyData,
        userId: admin.id,
        images: {
          create: images.map((url, i) => ({ url, order: i })),
        },
        features: {
          create: features.map((name) => ({ name })),
        },
      },
    })
    console.log("✅ Imóvel criado:", created.title)
  }

  console.log("\n✨ Seed concluído com sucesso!")
  console.log("\n🔐 Credenciais de acesso:")
  console.log("   Admin:    admin@cangucu.com.br  / admin123456")
  console.log("   Corretor: corretor@cangucu.com.br / corretor123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
