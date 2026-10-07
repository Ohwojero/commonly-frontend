import { NextResponse, type NextRequest } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || ''
    const res = await fetch(`${API_BASE}/activity`, {
      cache: 'no-store',
      headers: { ...(auth ? { Authorization: auth } : {}) },
    })
    if (!res.ok) return NextResponse.json([])
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const res = await fetch(`${API_BASE}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: body.eventType,
        eventName: body.eventName,
        email: body.email,
        location: body.location,
        productSlug: body.productSlug,
      }),
    })
    if (!res.ok) return NextResponse.json({ ok: false }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
