// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(request: { ip?: string | null; headers: { get: (name: string) => string | null } }, limit: number = 5, windowMs: number = 15 * 60 * 1000) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()
  const windowStart = now - windowMs

  const current = rateLimitMap.get(ip)
  
  if (!current || current.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0, resetTime: current.resetTime }
  }

  current.count++
  return { success: true, remaining: limit - current.count }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}, 60 * 1000) // Clean up every minute 