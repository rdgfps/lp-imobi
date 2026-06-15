import type { Metadata } from "next"
import "./globals.css"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} - Imóveis em Canguçu e região`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ["imóveis", "canguçu", "casas", "apartamentos", "terrenos", "imóveis rurais", "comprar imóvel", "alugar imóvel"],
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
