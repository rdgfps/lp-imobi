import React from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"
import { generateWhatsAppLink } from "@/lib/utils"

export function Footer() {
  const whatsappLink = generateWhatsAppLink(
    SITE_CONFIG.whatsapp,
    "Olá! Gostaria de mais informações sobre imóveis disponíveis."
  )

  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CI</span>
              </div>
              <span className="font-bold text-xl">{SITE_CONFIG.name}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              A imobiliária mais completa de Canguçu e região. Encontre casas, apartamentos, terrenos e imóveis rurais com toda a segurança que você merece.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-xl flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="h-5 w-5 text-[#25D366]" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Imóveis</h3>
            <ul className="space-y-3">
              {[
                { href: "/imoveis?purpose=VENDA", label: "Comprar" },
                { href: "/imoveis?purpose=ALUGUEL", label: "Alugar" },
                { href: "/imoveis?type=CASA", label: "Casas" },
                { href: "/imoveis?type=APARTAMENTO", label: "Apartamentos" },
                { href: "/imoveis?type=TERRENO", label: "Terrenos" },
                { href: "/imoveis?type=RURAL", label: "Imóveis Rurais" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/sobre" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Sobre nós</Link>
            <Link href="/contato" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Contato</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
