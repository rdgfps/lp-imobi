# Deploy na Vercel com Supabase

## Variáveis na Vercel

Configure em `Project Settings > Environment Variables`:

```env
DATABASE_URL="postgresql://postgres.xxxxx:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1"
NEXTAUTH_URL="https://seu-dominio.vercel.app"
NEXTAUTH_SECRET="uma-chave-forte"
AUTH_TRUST_HOST="true"
NEXT_PUBLIC_SITE_URL="https://seu-dominio.vercel.app"
NEXT_PUBLIC_SITE_NAME="Canguçu Imóveis"
NEXT_PUBLIC_WHATSAPP_NUMBER="5553999999999"

STORAGE_PROVIDER="supabase"
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
SUPABASE_STORAGE_BUCKET="imoveis"
```

Use a `service_role key` apenas no ambiente de servidor da Vercel. Nunca exponha essa chave no frontend como `NEXT_PUBLIC_*`.

## Banco

A Vercel não cria as tabelas do Prisma automaticamente. Depois de apontar para o Supabase, rode uma vez na sua máquina:

```powershell
$env:DATABASE_URL="sua-url-do-supabase"
npm.cmd run db:push
npm.cmd run db:seed
```

O seed cria:

```text
admin@cangucu.com.br / admin123456
corretor@cangucu.com.br / corretor123
```

## Storage

No Supabase, crie um bucket público chamado `imoveis`.

O projeto envia imagens para:

```text
imoveis/properties/<arquivo>
```

Se o bucket não for público, o cadastro pode salvar o imóvel, mas as imagens não vão carregar no site.

## Erros comuns

- `relation does not exist`: faltou rodar `npm.cmd run db:push` no Supabase.
- `Authentication failed`: `DATABASE_URL` errada ou senha com caractere especial não escapado.
- Upload falha na Vercel: `STORAGE_PROVIDER` ainda está como `local`.
- Login falha: faltou `NEXTAUTH_SECRET`, `NEXTAUTH_URL` ou usuário seed no banco.
