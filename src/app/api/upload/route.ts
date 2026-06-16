export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg"
    const filename = `${uuidv4()}.${ext}`

    const storageProvider = (process.env.STORAGE_PROVIDER || "local").toLowerCase()

    if (storageProvider === "s3") {
      const bucket = process.env.S3_BUCKET
      const region = process.env.AWS_REGION

      if (!bucket || !region) {
        return NextResponse.json({ error: "S3 não configurado corretamente" }, { status: 500 })
      }

      const s3 = new S3Client({
        region,
        credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        } : undefined,
      })

      const put = new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      })

      await s3.send(put)

      const publicUrl = process.env.S3_PUBLIC_URL
        ? `${process.env.S3_PUBLIC_URL.replace(/\/$/, "")}/${filename}`
        : `https://${bucket}.s3.${region}.amazonaws.com/${filename}`

      return NextResponse.json({ url: publicUrl })
    }

    // Fallback: grava localmente (uso em desenvolvimento)
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Erro ao processar arquivo" }, { status: 500 })
  }
}
