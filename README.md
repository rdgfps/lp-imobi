# 🏠 Canguçu Imóveis — Plataforma Imobiliária

Plataforma imobiliária moderna, completa e pronta para produção. Desenvolvida com Next.js 15, TypeScript, TailwindCSS, Prisma ORM e PostgreSQL.

---

## ✨ Funcionalidades

### 🌐 Plataforma pública
- Home com hero, busca inteligente, destaques e categorias
- Catálogo de imóveis com filtros (tipo, finalidade, cidade, preço)
- Página de imóvel com galeria, mapa, características e CTAs WhatsApp
- Links diretos para WhatsApp com mensagem pré-preenchida
- Design premium mobile-first (inspirado em Airbnb + Zillow)

### 🔒 Painel Administrativo
- Login seguro com e-mail e senha (NextAuth.js v5)
- Dashboard com estatísticas e atividade recente
- CRUD completo de imóveis (criar, editar, excluir)
- Upload de imagens (validação de tipo e tamanho)
- Marcar como destaque, publicar/ocultar, badges
- Gestão de usuários (Admin/Corretor)
- Logs de auditoria
- RBAC: Admin tem acesso total; Corretor gerencia apenas seus imóveis

### 🔐 Segurança
- Senhas hasheadas com bcrypt (12 rounds)
- Sessões JWT via NextAuth
- Proteção de rotas (middleware)
- Validação de dados com Zod (client + server)
- Proteção contra SQL Injection via Prisma ORM
- Uploads com validação de tipo e tamanho
- Rate limiting ready (tabela RateLimit no schema)
- Logs de auditoria de todas ações

---

## 🚀 Instalação e execução

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou pnpm

### 1. Clone e instale

\`\`\`bash
git clone <url-do-repositorio>
cd imoveis
npm install
\`\`\`

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` e preencha:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edite `.env.local`:

\`\`\`env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/imoveis_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-com-32-caracteres-aleatorios"
NEXT_PUBLIC_WHATSAPP_NUMBER="5553999999999"
NEXT_PUBLIC_SITE_NAME="Canguçu Imóveis"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
\`\`\`

### 3. Configure o banco de dados

\`\`\`bash
# Cria as tabelas
npm run db:push

# Popula com dados de exemplo
npm run db:seed
\`\`\`

### 4. Execute

\`\`\`bash
npm run dev
\`\`\`

Acesse em **http://localhost:3000**

---

## 🔑 Credenciais padrão (após seed)

| Usuário | E-mail | Senha |
|---------|--------|-------|
| Administrador | admin@cangucu.com.br | admin123456 |
| Corretor | corretor@cangucu.com.br | corretor123 |

⚠️ **Troque as senhas imediatamente em produção!**

---

## 📁 Estrutura do projeto

\`\`\`
src/
├── app/
│   ├── (public)/           # Páginas públicas (home, imóveis, sobre, contato)
│   │   ├── page.tsx        # Home page
│   │   ├── imoveis/        # Listagem e detalhes de imóveis
│   │   ├── sobre/          # Página sobre
│   │   ├── contato/        # Página de contato
│   │   └── anunciar/       # Página anunciar imóvel
│   ├── admin/              # Painel administrativo (protegido)
│   │   ├── login/          # Página de login
│   │   ├── dashboard/      # Dashboard com estatísticas
│   │   ├── imoveis/        # Gestão de imóveis
│   │   ├── usuarios/       # Gestão de usuários (Admin)
│   │   └── configuracoes/  # Configurações (Admin)
│   └── api/                # API Routes
│       ├── auth/           # NextAuth handlers
│       ├── properties/     # API pública de imóveis
│       ├── admin/          # API administrativa protegida
│       └── upload/         # Upload de imagens
├── components/
│   ├── ui/                 # Componentes base (Button, Card, Input...)
│   ├── layout/             # Navbar, Footer
│   ├── property/           # Cards, busca, skeleton
│   └── admin/              # Sidebar, Header, formulários
├── lib/
│   ├── auth.ts             # Configuração NextAuth
│   ├── db.ts               # Cliente Prisma
│   ├── utils.ts            # Funções utilitárias
│   └── constants.ts        # Configurações do site
├── types/                  # TypeScript types
└── middleware.ts            # Proteção de rotas admin
prisma/
├── schema.prisma           # Schema do banco de dados
└── seed.ts                 # Seed com dados de exemplo
\`\`\`

---

## 🛠️ Stack tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | TailwindCSS + componentes custom |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | NextAuth.js v5 (Auth.js) |
| Validação | Zod |
| Ícones | Lucide React |
| Deploy | Vercel / VPS |

---

## 🎨 Personalização por imobiliária

Para adaptar para outra imobiliária, altere apenas:

1. **`src/lib/constants.ts`** — Nome, WhatsApp, e-mail, endereço, cidades
2. **`src/app/globals.css`** — Cores primárias (variável `--primary`)
3. **Logo** — Substitua o componente de logo na Navbar e Admin Sidebar
4. **Seed** — Edite `prisma/seed.ts` com imóveis reais

---

## 📦 Scripts disponíveis

\`\`\`bash
npm run dev          # Desenvolvimento (http://localhost:3000)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run db:push      # Sincroniza schema com o banco
npm run db:migrate   # Cria migration
npm run db:seed      # Popula banco com dados de exemplo
npm run db:studio    # Interface visual do banco (Prisma Studio)
\`\`\`

---

## 🚀 Deploy em produção

### Vercel (recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente no painel
3. Deploy automático a cada push

### VPS / Docker
\`\`\`bash
npm run build
npm run start
\`\`\`

Configure nginx como reverse proxy na porta 3000.

---

## 📝 Licença

Projeto comercial. Todos os direitos reservados.
