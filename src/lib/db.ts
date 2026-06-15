import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

// Use a Proxy to defer initialization until first use
let _prisma: PrismaClient | undefined

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    if (globalThis.__prisma) {
      _prisma = globalThis.__prisma
    } else {
      _prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
      if (process.env.NODE_ENV !== 'production') {
        globalThis.__prisma = _prisma
      }
    }
  }
  return _prisma
}

// For backward compatibility export a proxy that initializes on first property access
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getPrisma()[prop as keyof PrismaClient]
  }
})

export default prisma
