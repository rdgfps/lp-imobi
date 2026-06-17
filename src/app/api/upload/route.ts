export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024

function getFileExtension(type: string) {
  if (type === "image/webp") return "webp"
  if (type === "image/png") return "png"
  return "jpg"
}

async function uploadToSupabase(buffer: Buffer, filename: string, contentType: string) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "")
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "imoveis"

  if (!supabaseUrl || !serviceRoleKey) {
    return { error: "Supabase Storage não configurado" }
  }

  const objectPath = `properties/${filename}`
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "x-upsert": "false",
    },
    body: buffer,
  })

  if (!response.ok) {
    console.error("Supabase upload error:", await response.text())
    return { error: "Erro ao enviar imagem para o Supabase" }
  }

  return {
    url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`,
  }
}

async function uploadToS3(buffer: Buffer, filename: string, contentType: string) {
  const bucket = process.env.S3_BUCKET
  const region = process.env.AWS_REGION

  if (!bucket || !region) {
    return { error: "S3 não configurado corretamente" }
  }

  const s3 = new S3Client({
    region,
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
  })

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  }))

  const publicUrl = process.env.S3_PUBLIC_URL
    ? `${process.env.S3_PUBLIC_URL.replace(/\/$/, "")}/${filename}`
    : `https://${bucket}.s3.${region}.amazonaws.com/${filename}`

  return { url: publicUrl }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Arquivo muito grande (máximo 5MB)" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${uuidv4()}.${getFileExtension(file.type)}`
    const storageProvider = (process.env.STORAGE_PROVIDER || "local").toLowerCase()

    if (storageProvider === "supabase") {
      const result = await uploadToSupabase(buffer, filename, file.type)
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: 500 })
      return NextResponse.json({ url: result.url })
    }

    if (storageProvider === "s3") {
      const result = await uploadToS3(buffer, filename, file.type)
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: 500 })
      return NextResponse.json({ url: result.url })
    }

    if (process.env.VERCEL === "1") {
      return NextResponse.json(
        { error: "Configure STORAGE_PROVIDER=supabase ou s3 para uploads em produção" },
        { status: 500 }
      )
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Erro ao processar arquivo" }, { status: 500 })
  }
}
