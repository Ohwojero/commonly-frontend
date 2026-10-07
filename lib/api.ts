// Central API client for the Commonly NestJS backend

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// ── Types ──────────────────────────────────────────────────────────────────

export type ApiProduct = {
  id: string
  slug: string
  name: string
  brand: string
  price: number
  rating: number
  reviewCount: number
  views: number
  image: string
  images?: string[]
  description: string
  tags: string[]
  affiliateUrl?: string
  isSpotlight?: boolean
  highlights?: string[]
  itemDetails?: string[]
  specs?: string[]
  subcategory?: {
    id: string
    slug: string
    label: string
    image: string
    category?: ApiCategory
  }
  createdAt: string
}

export type ApiCategory = {
  id: string
  slug: string
  label: string
  eyebrow: string
  title: string
  description: string
  image: string
  tone: string
  subcategories: Array<{
    id: string
    slug: string
    label: string
    image: string
  }>
}

export type ApiMediaItem = {
  id: string
  title: string
  slug: string
  type: 'Product' | 'Category' | 'Subcategory'
  url: string
}

export type AuthResponse = {
  access_token: string
  user: { id: string; email: string; name?: string; location?: string; role: string }
}

export type MeResponse = {
  id: string
  email: string
  name?: string
  location?: string
  role: string
  createdAt: string
}

export type ApiActivityLog = {
  id: string
  eventType: string
  eventName: string
  email?: string
  location?: string
  productSlug?: string
  createdAt: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('commonly_token')
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    let msg = `API error ${res.status}`
    try { const body = await res.json(); msg = body.message || msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── Format helpers ────────────────────────────────────────────────────────

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

// ── Products ──────────────────────────────────────────────────────────────

export type ProductQuery = {
  category?: string
  subcategory?: string
  tag?: string
  sort?: 'views' | 'rating' | 'price' | 'newest'
}

export function fetchProducts(query?: ProductQuery): Promise<ApiProduct[]> {
  const params = new URLSearchParams()
  if (query?.category) params.set('category', query.category)
  if (query?.subcategory) params.set('subcategory', query.subcategory)
  if (query?.tag) params.set('tag', query.tag)
  if (query?.sort) params.set('sort', query.sort)
  const qs = params.toString()
  return apiFetch<ApiProduct[]>(`/products${qs ? `?${qs}` : ''}`)
}

export function fetchProduct(slug: string): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/products/${slug}`)
}

export function incrementProductView(slug: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/products/${slug}/view`, { method: 'PATCH' })
}

export function apiCreateProduct(dto: any): Promise<ApiProduct> {
  return apiFetch<ApiProduct>('/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(dto),
  })
}

export function apiUpdateProduct(slug: string, dto: any): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/products/${slug}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(dto),
  })
}

export function apiDeleteProduct(slug: string): Promise<any> {
  return apiFetch<any>(`/products/${slug}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

// ── Categories ────────────────────────────────────────────────────────────

export function fetchCategories(): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>('/categories')
}

export function fetchCategory(slug: string): Promise<ApiCategory> {
  return apiFetch<ApiCategory>(`/categories/${slug}`)
}

export function apiCreateCategory(dto: any): Promise<ApiCategory> {
  return apiFetch<ApiCategory>('/categories', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(dto),
  })
}

export function apiUpdateCategory(slug: string, dto: any): Promise<ApiCategory> {
  return apiFetch<ApiCategory>(`/categories/${slug}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(dto),
  })
}

export function apiDeleteCategory(slug: string): Promise<any> {
  return apiFetch<any>(`/categories/${slug}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

export function apiUpdateSubcategoryImage(slug: string, image: string): Promise<any> {
  return apiFetch<any>(`/categories/subcategories/${slug}/image`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ image }),
  })
}

export function apiAddSubcategory(categorySlug: string, label: string): Promise<ApiCategory> {
  return apiFetch<ApiCategory>(`/categories/${categorySlug}/subcategories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ label }),
  })
}

export function apiUpdateSubcategoryLabel(slug: string, label: string): Promise<ApiCategory> {
  return apiFetch<ApiCategory>(`/categories/subcategories/${slug}/label`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ label }),
  })
}

export function apiRemoveSubcategory(slug: string): Promise<ApiCategory> {
  return apiFetch<ApiCategory>(`/categories/subcategories/${slug}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

export function apiFetchMedia(): Promise<ApiMediaItem[]> {
  return apiFetch<ApiMediaItem[]>('/categories/media/all')
}

export function apiRemoveMedia(type: string, slug: string): Promise<any> {
  return apiFetch<any>(`/categories/media/${type}/${slug}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

// ── Auth ──────────────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function apiRegister(email: string, password: string, name: string | undefined, location: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, location }),
  })
}

export async function apiGetMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>('/auth/me', {
    headers: authHeaders(),
  })
}

// ── Saves ─────────────────────────────────────────────────────────────────

export async function fetchSaves(): Promise<Array<{ id: string; product: ApiProduct; savedAt: string }>> {
  return apiFetch('/saves', { headers: authHeaders() })
}

export async function fetchSavedIds(): Promise<string[]> {
  return apiFetch('/saves/ids', { headers: authHeaders() })
}

export async function toggleSave(productId: string): Promise<{ saved: boolean }> {
  return apiFetch(`/saves/${productId}`, {
    method: 'POST',
    headers: authHeaders(),
  })
}

export async function removeSave(productId: string): Promise<{ saved: boolean }> {
  return apiFetch(`/saves/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

// ── Reviews ───────────────────────────────────────────────────────────────

export type ApiReview = {
  id: string
  rating: number
  body: string | null
  createdAt: string
  user: { id: string; name?: string; email: string }
}

export type ApiReviewsResponse = {
  rating: number
  reviewCount: number
  reviews: ApiReview[]
}

export function fetchReviews(productSlug: string): Promise<ApiReviewsResponse> {
  return apiFetch<ApiReviewsResponse>(`/reviews/${productSlug}`)
}

export function submitReview(productSlug: string, rating: number, body?: string): Promise<ApiReviewsResponse> {
  return apiFetch<ApiReviewsResponse>(`/reviews/${productSlug}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ rating, body }),
  })
}

export function updateReview(reviewId: string, rating: number, body?: string): Promise<ApiReviewsResponse> {
  return apiFetch<ApiReviewsResponse>(`/reviews/${reviewId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ rating, body }),
  })
}

export function deleteReview(reviewId: string): Promise<ApiReviewsResponse> {
  return apiFetch<ApiReviewsResponse>(`/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

// ── Activity ──────────────────────────────────────────────────────────────

export function fetchActivities(): Promise<ApiActivityLog[]> {
  return apiFetch<ApiActivityLog[]>('/activity')
}

export function logActivity(dto: {
  eventType: string
  eventName: string
  email?: string
  location?: string
  productSlug?: string
}): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>('/activity', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}
