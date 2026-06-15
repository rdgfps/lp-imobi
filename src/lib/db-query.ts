export function hasDatabaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url) return false

  try {
    const parsed = new URL(url)
    return parsed.protocol === "postgresql:" || parsed.protocol === "postgres:"
  } catch {
    return false
  }
}

export async function safeDbQuery<T>(
  query: () => Promise<T>,
  fallback: T,
  timeoutMs = 5000
): Promise<T> {
  if (!hasDatabaseUrl()) return fallback

  let timeout: ReturnType<typeof setTimeout> | undefined

  try {
    return await Promise.race([
      query(),
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Database query timed out")), timeoutMs)
      }),
    ])
  } catch {
    return fallback
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}
