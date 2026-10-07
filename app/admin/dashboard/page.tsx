'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  Globe,
  ImageIcon,
  LayoutDashboard,
  Loader2,
  Menu,
  Package,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { type Product } from '@/lib/products'
import { type Category, apiCategoryToCategory } from '@/lib/categories'
import { storefrontNavGroups } from '@/lib/storefront-navigation'
import {
  fetchProducts,
  fetchCategories,
  formatPrice,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  apiUpdateSubcategoryImage,
  apiAddSubcategory,
  apiUpdateSubcategoryLabel,
  apiRemoveSubcategory,
  apiFetchMedia,
  apiRemoveMedia,
  uploadImageFile,
  type ApiMediaItem,
} from '@/lib/api'

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  products: 'commonly-products',
  categories: 'commonly-categories',
  subImages: 'commonly-subcategory-images',
}
const FALLBACK_IMG = '/luxury-placeholder.svg'

const emptyProduct: ProductForm = {
  name: '', brand: '', category: 'luxury-skincare', subcategory: '',
  image: '', images: [], affiliateUrl: '', description: '',
  highlights: '', itemDetails: '', specs: '', tags: '',
  rating: '5.0', views: '0',
  prime: false, isSpotlight: false,
}

type ProductForm = {
  name: string; brand: string; category: string; subcategory: string
  image: string; images: string[]; affiliateUrl: string; description: string
  highlights: string; itemDetails: string; specs: string
  tags: string; rating: string; views: string
  prime: boolean; isSpotlight: boolean
}

type View = 'overview' | 'catalog' | 'categories' | 'media' | 'activity' | 'settings'

interface ActivityItem {
  id: string; eventName: string; eventType: string; email?: string
  location?: string; productSlug?: string; createdAt: string
}

// ─── Utilities ────────────────────────────────────────────────────────────────
const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const split = (v: string) => v.split(',').map((p) => p.trim()).filter(Boolean)
const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
  catch { return iso }
}

// ─── ImagePicker ──────────────────────────────────────────────────────────────
function ImagePicker({ value, onChange, label = 'Image' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5 MB or smaller.')
      return
    }
    setUploading(true)
    setError('')
    try {
      onChange(await uploadImageFile(file))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed.')
    } finally {
      setUploading(false)
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="relative flex min-h-[110px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-border/70 bg-muted/30 transition hover:border-primary hover:bg-muted/50"
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="absolute inset-0 size-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }} />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition hover:opacity-100">
              <p className="text-xs font-semibold text-white">{uploading ? 'Uploading…' : 'Click to change'}</p>
            </div>
          </>
        ) : (
          <>
            <Upload className="size-5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{uploading ? 'Uploading to Supabase…' : 'Click to upload'}</p>
          </>
        )}
      </div>
      <Input value={value.startsWith('data:') ? '' : value} onChange={(e) => onChange(e.target.value)} placeholder="Or paste image URL…" className="h-8 text-xs" />
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={handleFile} disabled={uploading} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function GalleryImagePicker({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const maxImages = 3

  const addFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    const availableSlots = maxImages - images.length
    if (!files.length || availableSlots <= 0) return

    const selectedFiles = files.slice(0, availableSlots)
    const oversizedFile = selectedFiles.find((file) => file.size > 2 * 1024 * 1024)
    if (oversizedFile) {
      setError('Each gallery image must be 2 MB or smaller.')
      return
    }

    try {
      const uploadedImages = await Promise.all(selectedFiles.map(uploadImageFile))
      onChange([...images, ...uploadedImages])
      setError(files.length > availableSlots ? 'Only three additional images can be added.' : '')
    } catch {
      setError('Could not read one of the selected images.')
    }
  }

  const addUrl = () => {
    const trimmedUrl = imageUrl.trim()
    if (!trimmedUrl || images.length >= maxImages) return
    onChange([...images, trimmedUrl])
    setImageUrl('')
    setError('')
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs font-medium">Additional Gallery Images</p>
      {images.map((image, index) => (
        <div key={`${index}-${image.slice(0, 32)}`} className="flex items-center gap-3 rounded-md border border-border/70 p-2">
          <img
            src={image}
            alt={`Gallery image ${index + 1} preview`}
            className="size-14 shrink-0 rounded object-cover bg-muted"
            onError={(event) => { (event.target as HTMLImageElement).src = FALLBACK_IMG }}
          />
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {image.startsWith('data:') ? `Image ${index + 1} uploaded from this device` : image}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove gallery image ${index + 1}`}
            onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}

      {images.length < maxImages && (
        <>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addFiles} />
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="size-3.5" /> Select from computer
          </Button>
          <div className="flex gap-2">
            <Input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Or paste an image URL"
              className="h-8 text-xs"
            />
            <Button type="button" variant="outline" size="sm" onClick={addUrl} disabled={!imageUrl.trim()}>
              Add URL
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">Add up to three images. Device uploads must be 2 MB or smaller each.</p>
        </>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-left"
      aria-pressed={checked}
    >
      <div className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'}`}>
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm">{label}</span>
    </button>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, trend, accent = false }: { label: string; value: string | number; icon: React.ElementType; trend?: string; accent?: boolean }) {
  return (
    <Card className={`border-border/70 ${accent ? 'bg-primary text-primary-foreground' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${accent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{label}</p>
            <p className={`mt-2 text-3xl font-medium ${accent ? 'text-primary-foreground' : ''}`}>{value}</p>
            {trend && <p className={`mt-1 text-xs ${accent ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{trend}</p>}
          </div>
          <div className={`rounded-xl p-2.5 ${accent ? 'bg-white/10' : 'bg-muted'}`}>
            <Icon className={`size-4 ${accent ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  // — State
  const [items, setItems] = useState<Product[]>([])
  const [groups, setGroups] = useState<Category[]>([])
  const [subImages, setSubImages] = useState<Record<string, string>>({})
  const [subImageForm, setSubImageForm] = useState({ slug: '', url: '' })
  const [categoryForm, setCategoryForm] = useState({ label: '', image: '' })
  const [form, setForm] = useState<ProductForm>(emptyProduct)
  const [editing, setEditing] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [view, setView] = useState<View>('overview')
  const [query, setQuery] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [showProductForm, setShowProductForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [activityFilter, setActivityFilter] = useState('all')
  const [activityQuery, setActivityQuery] = useState('')
  const [mediaQuery, setMediaQuery] = useState('')
  const [mediaList, setMediaList] = useState<ApiMediaItem[]>([])
  const [mediaTab, setMediaTab] = useState<'all' | 'Product' | 'Category' | 'Subcategory'>('all')
  const [mediaLoading, setMediaLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState<string | null>(null)
  const [newSubcategoryLabel, setNewSubcategoryLabel] = useState('')
  const [editingSubcategory, setEditingSubcategory] = useState<{ slug: string; label: string; categorySlug: string } | null>(null)

  // — Fetch live media from database
  const reloadMedia = async () => {
    setMediaLoading(true)
    try {
      const media = await apiFetchMedia()
      setMediaList(media)
    } catch {
      // Fallback: construct from items & groups
      const fallbackMedia: ApiMediaItem[] = [
        ...items.map(p => ({ id: `p-${p.slug}`, title: `${p.brand} - ${p.name}`, slug: p.slug, type: 'Product' as const, url: p.image })),
        ...groups.map(g => ({ id: `c-${g.slug}`, title: g.label, slug: g.slug, type: 'Category' as const, url: g.image })),
      ]
      setMediaList(fallbackMedia)
    } finally {
      setMediaLoading(false)
    }
  }

  // — Fetch live data from PostgreSQL API
  const reloadData = async () => {
    setDataLoading(true)
    try {
      const [prods, cats] = await Promise.all([
        fetchProducts().catch(() => []),
        fetchCategories().catch(() => []),
      ])

      if (prods && prods.length > 0) {
        const mapped: Product[] = prods.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          category: p.subcategory?.category?.label || p.subcategory?.label || 'Luxury Skincare',
          subcategory: p.subcategory?.label,
          subcategorySlug: p.subcategory?.slug,
          categorySlug: p.subcategory?.category?.slug,
          price: formatPrice(Number(p.price)),
          rating: Number(p.rating).toFixed(1),
          reviewCount: p.reviewCount ?? 0,
          views: p.views || 0,
          image: p.image,
          images: p.images || [],
          description: p.description,
          tags: p.tags || [],
          affiliateUrl: p.affiliateUrl,
          highlights: p.highlights || [],
          itemDetails: p.itemDetails || [],
          specs: p.specs || [],
          prime: !!p.affiliateUrl,
          isSpotlight: !!p.isSpotlight,
        }))
        setItems(mapped)
      }

      if (cats && cats.length > 0) {
        setGroups(cats.map(apiCategoryToCategory))
      }

      await reloadMedia()
    } catch {
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    reloadData()
  }, [])

  // — Activity Fetch
  const fetchActivity = () => {
    setActivityLoading(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('commonly_token') : null
    fetch('/api/activity', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => setActivityItems(Array.isArray(data) ? data : []))
      .catch(() => setActivityItems([]))
      .finally(() => setActivityLoading(false))
  }
  useEffect(() => { if (view === 'activity' || view === 'overview') fetchActivity() }, [view])
  useEffect(() => { if (view === 'media') reloadMedia() }, [view])

  // — Derived
  const filtered = useMemo(() => items.filter(item => {
    const matchesQuery = `${item.name} ${item.brand} ${item.category} ${item.subcategory || ''}`.toLowerCase().includes(query.toLowerCase())
    const selectedNavGroup = storefrontNavGroups.find(group => group.label === catFilter)
    const matchesCat = catFilter === 'All' || !!selectedNavGroup?.catalogSlugs.includes(item.categorySlug || '')
    return matchesQuery && matchesCat
  }), [items, query, catFilter])

  const filteredActivity = useMemo(() => activityItems.filter(a => {
    const matchesQuery = `${a.email || ''} ${a.productSlug || ''} ${a.eventName}`.toLowerCase().includes(activityQuery.toLowerCase())
    const matchesFilter = activityFilter === 'all' || a.eventType === activityFilter
    return matchesQuery && matchesFilter
  }), [activityItems, activityQuery, activityFilter])

  const filteredMedia = useMemo(() => {
    return mediaList.filter(item => {
      const matchesQuery = `${item.title} ${item.slug}`.toLowerCase().includes(mediaQuery.toLowerCase())
      const matchesFilter = mediaTab === 'all' || item.type === mediaTab
      return matchesQuery && matchesFilter
    })
  }, [mediaList, mediaQuery, mediaTab])

  const spotlight = items.find(p => p.isSpotlight) ?? items[0]
  const totalViews = items.reduce((sum, p) => sum + (p.views || 0), 0)
  const primeCount = items.filter(p => p.prime).length

  // — Product CRUD
  const update = (key: keyof ProductForm, value: string | string[] | boolean) => setForm(f => ({ ...f, [key]: value }))

  const openEdit = (item: Product) => {
    setEditing(item.slug)
    const navGroup = storefrontNavGroups.find(group => group.catalogSlugs.includes(item.categorySlug || ''))
    setForm({
      name: item.name, brand: item.brand, category: navGroup?.slug || '',
      subcategory: item.subcategorySlug || '', image: item.image,
      images: item.images || [],
      affiliateUrl: item.affiliateUrl || '',
      description: item.description,
      highlights: item.highlights?.join(', ') || '',
      itemDetails: item.itemDetails?.join(', ') || '',
      specs: item.specs?.join(', ') || '',
      tags: item.tags.join(', '),
      rating: item.rating,
      views: String(item.views),
      prime: item.prime ?? false,
      isSpotlight: item.isSpotlight ?? false,
    })
    setShowProductForm(true)
  }

  const submitProduct = async (e: FormEvent) => {
    e.preventDefault()
    const slug = editing || slugify(form.name) || `product-${Date.now()}`
    const ratingNum = parseFloat(form.rating) || 5.0

    const selectedNavGroup = storefrontNavGroups.find(group => group.slug === form.category)
    const categorySlug = selectedNavGroup?.catalogSlugs.find(slug => groups.some(group => group.slug === slug))
    if (!selectedNavGroup || !categorySlug) {
      alert('This category is not connected to an available database category yet. Sync categories and try again.')
      return
    }
    const subcategorySlug = form.subcategory || undefined
    const subcategoryLabel = selectedNavGroup.items.find(label => slugify(label) === form.subcategory)

    const payload = {
      slug,
      name: form.name.trim(),
      brand: form.brand.trim(),
      price: 0,
      rating: ratingNum,
      views: Number(form.views) || 0,
      image: form.image || (items[0]?.image ?? FALLBACK_IMG),
      images: form.images,
      description: form.description.trim(),
      affiliateUrl: form.affiliateUrl ? form.affiliateUrl.trim() : undefined,
      highlights: split(form.highlights),
      itemDetails: split(form.itemDetails),
      specs: split(form.specs),
      tags: split(form.tags),
      categorySlug,
      subcategorySlug,
      subcategoryLabel,
      isSpotlight: form.isSpotlight,
    }

    try {
      if (editing) {
        await apiUpdateProduct(editing, payload)
      } else {
        await apiCreateProduct(payload)
      }
      await reloadData()
      setForm(emptyProduct)
      setEditing(null)
      setShowProductForm(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      console.error('Failed to save product:', err)
      alert(`Error saving product: ${err?.message || 'Check inputs and ensure API is running'}`)
    }
  }

  const removeProduct = async (slug: string) => {
    if (!confirm('Delete this product from the database? This cannot be undone.')) return
    try {
      await apiDeleteProduct(slug)
      await reloadData()
    } catch {
      setItems(c => c.filter(i => i.slug !== slug))
    }
  }

  // — Category CRUD
  const saveCategory = async (e: FormEvent) => {
    e.preventDefault()
    if (!categoryForm.label.trim()) return
    const slug = editingCategory || slugify(categoryForm.label)
    const payload = {
      slug,
      label: categoryForm.label.trim(),
      eyebrow: `The ${categoryForm.label.toLowerCase()} edit`,
      title: `Explore ${categoryForm.label.toLowerCase()} more intentionally.`,
      description: `A considered collection of ${categoryForm.label.toLowerCase()} picks.`,
      image: categoryForm.image || (groups[0]?.image ?? FALLBACK_IMG),
    }

    try {
      if (editingCategory) {
        await apiUpdateCategory(editingCategory, payload)
      } else {
        await apiCreateCategory(payload)
      }
      await reloadData()
    } catch {
      const next: Category = {
        ...payload,
        tone: 'bg-secondary',
        items: [],
      }
      setGroups(current => editingCategory
        ? current.map(item => item.slug === editingCategory ? { ...item, ...next } : item)
        : [...current, next])
    }

    setCategoryForm({ label: '', image: '' })
    setEditingCategory(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const removeCategory = async (slug: string) => {
    if (!confirm('Remove this category from the database?')) return
    try {
      await apiDeleteCategory(slug)
      await reloadData()
    } catch {
      setGroups(current => current.filter(item => item.slug !== slug))
    }
  }

  const addSubcategory = async (categorySlug: string) => {
    if (!newSubcategoryLabel.trim()) return
    try {
      await apiAddSubcategory(categorySlug, newSubcategoryLabel.trim())
      await reloadData()
      setAddingSubcategoryTo(null)
      setNewSubcategoryLabel('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      alert(`Error adding subcategory: ${err?.message || 'Unknown error'}`)
    }
  }

  const saveSubcategoryEdit = async () => {
    if (!editingSubcategory || !editingSubcategory.label.trim()) return
    try {
      await apiUpdateSubcategoryLabel(editingSubcategory.slug, editingSubcategory.label.trim())
      await reloadData()
      setEditingSubcategory(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      alert(`Error updating subcategory: ${err?.message || 'Unknown error'}`)
    }
  }

  const removeSubcategory = async (slug: string) => {
    if (!confirm('Remove this subcategory? Products assigned to it will be unaffected but lose their subcategory.')) return
    try {
      await apiRemoveSubcategory(slug)
      await reloadData()
    } catch (err: any) {
      alert(`Error removing subcategory: ${err?.message || 'Unknown error'}`)
    }
  }

  // — Subcategory Image CRUD
  const saveSubImage = async (e: FormEvent) => {
    e.preventDefault()
    if (!subImageForm.slug || !subImageForm.url) return
    try {
      await apiUpdateSubcategoryImage(subImageForm.slug, subImageForm.url)
      await reloadMedia()
      await reloadData()
    } catch {
      setMediaList(prev => prev.map(m => m.slug === subImageForm.slug ? { ...m, url: subImageForm.url } : m))
    }
    setSubImageForm({ slug: '', url: '' })
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  // — Export helpers
  const exportJson = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: filename }).click()
    URL.revokeObjectURL(url)
  }

  const exportCsv = (rows: ActivityItem[]) => {
    const headers = ['ID', 'Event Type', 'Event Name', 'Email', 'Location', 'Product', 'Date']
    const lines = rows.map(r => [r.id, r.eventType, r.eventName, r.email || '', r.location || '', r.productSlug || '', r.createdAt].map(v => `"${v}"`).join(','))
    const blob = new Blob([[headers.join(','), ...lines].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: 'commonly-activity.csv' }).click()
    URL.revokeObjectURL(url)
  }

  const resetToDefaults = () => {
    reloadData()
    try {
      localStorage.removeItem(STORAGE_KEYS.products)
      localStorage.removeItem(STORAGE_KEYS.categories)
      localStorage.removeItem(STORAGE_KEYS.subImages)
    } catch {}
    setResetConfirm(false)
  }

  // — Navigation
  const nav: { id: View; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'catalog', label: 'Product Catalog', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'activity', label: 'Activity & Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const currentNavItem = nav.find(n => n.id === view)

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      {/* ── Mobile Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
        <Link href="/" className="font-serif text-xl">Commonly.</Link>
        <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu className="size-5" />
        </button>
      </header>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}>
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link href="/" className="font-serif text-2xl" onClick={() => setSidebarOpen(false)}>Commonly.</Link>
          <button type="button" className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="size-4" />
          </button>
        </div>

        <div className="px-4 pt-5">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Admin workspace</p>
        </div>

        <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-4">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => { setView(id); setSidebarOpen(false) }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${view === id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <Icon className="size-4 shrink-0" />
              {label}
              {view === id && <ChevronRight className="ml-auto size-3.5 text-primary" />}
            </button>
          ))}
        </nav>

        <div className="border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <Globe className="size-4" />
            View Storefront
            <ExternalLink className="ml-auto size-3 opacity-50" />
          </Link>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="md:pl-64">
        {/* Page Header */}
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm px-5 py-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Admin</span>
                  <ChevronRight className="size-3 text-muted-foreground/50" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{currentNavItem?.label}</span>
                </div>
                <h1 className="mt-0.5 font-serif text-xl">{currentNavItem?.label}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <Check className="size-3" /> Saved
                </span>
              )}
              {view === 'catalog' && (
                <Button size="sm" onClick={() => { setEditing(null); setForm(emptyProduct); setShowProductForm(true) }} className="h-8 rounded-full text-xs">
                  <Plus className="size-3.5" /> Add Product
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-xs gap-1.5"
                onClick={reloadData}
                disabled={dataLoading}
                title="Fetch latest data from PostgreSQL database"
              >
                <RefreshCw className={`size-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
                <span>Sync DB</span>
              </Button>
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-2.5 text-xs font-medium whitespace-nowrap transition-all hover:bg-muted hover:text-foreground"
              >
                <Globe className="size-3.5" /> Storefront
              </Link>
            </div>
          </div>
        </header>

        <section className="p-5 lg:p-8">

          {/* ════════════════════ OVERVIEW ════════════════════ */}
          {view === 'overview' && (
            <div className="space-y-8">
              {/* KPI Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Products" value={items.length} icon={Package} trend={`${primeCount} Amazon Prime eligible`} accent />
                <StatCard label="Catalog Views" value={totalViews.toLocaleString()} icon={Eye} trend="Across all products" />
                <StatCard label="Categories" value={groups.length} icon={Tag} trend={`${Object.keys(subImages).length} subcategory media`} />
                <StatCard label="Activity Events" value={activityItems.length} icon={TrendingUp} trend="Registrations & clicks" />
              </div>

              {/* Spotlight Preview */}
              <Card className="border-border/70 overflow-hidden">
                <div className="grid lg:grid-cols-[.45fr_1fr]">
                  <div className="relative aspect-[5/3] lg:aspect-auto overflow-hidden bg-muted">
                    <img
                      src={spotlight?.image}
                      alt={spotlight?.name}
                      className="size-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        <Sparkles className="size-2.5" /> Clinical Spotlight
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col justify-center gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{spotlight?.brand}</p>
                      <h2 className="mt-2 font-serif text-2xl leading-snug">{spotlight?.name}</h2>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{spotlight?.description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" /> {spotlight?.rating} ({spotlight?.reviewCount?.toLocaleString() ?? 0})
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{spotlight?.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={() => spotlight && openEdit(spotlight)}>
                        Edit Spotlight
                      </Button>
                      <Link
                        href={`/products/${spotlight?.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-2.5 text-xs font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary/80"
                      >
                        Preview <ExternalLink className="size-3" />
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Recent Products */}
              <Card className="border-border/70">
                <CardHeader className="flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base">Recent Products</CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 rounded-full text-xs" onClick={() => setView('catalog')}>
                    View all <ArrowRight className="size-3" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {items.slice(0, 5).map(item => (
                      <div key={item.slug} className="flex items-center gap-4 px-6 py-3.5">
                        <img
                          src={item.image}
                          alt=""
                          className="size-11 shrink-0 rounded-lg object-cover bg-muted"
                          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{item.brand} · {item.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.prime && (
                            <span className="hidden rounded-full bg-[#131921] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF9900] sm:inline-flex">Prime</span>
                          )}
                          {item.isSpotlight && (
                            <span className="hidden rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-600 border border-rose-200 sm:inline-flex">Spotlight</span>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}>
                            <Settings className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border/70">
                <CardHeader className="flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 rounded-full text-xs" onClick={() => setView('activity')}>
                    View all <ArrowRight className="size-3" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {activityLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : activityItems.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <Activity className="mx-auto size-8 text-muted-foreground/40" />
                      <p className="mt-3 text-sm text-muted-foreground">No activity recorded yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {activityItems.slice(0, 6).map(a => (
                        <div key={a.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                          <div>
                            <p className="text-sm font-medium">{a.eventName}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {a.email || 'Guest'}{a.location ? ` · ${a.location}` : ''}{a.productSlug ? ` · ${a.productSlug}` : ''}
                            </p>
                          </div>
                          <time className="shrink-0 text-[11px] text-muted-foreground">{formatDate(a.createdAt)}</time>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ════════════════════ CATALOG ════════════════════ */}
          {view === 'catalog' && (
            <div className="space-y-4">
              {/* Filters */}
              <Card className="border-border/70">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" className="h-9 pl-9 text-sm" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {['All', ...storefrontNavGroups.map(group => group.label)].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCatFilter(cat)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${catFilter === cat ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:border-primary/40'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product List */}
              <Card className="border-border/70">
                <CardHeader className="flex-row items-center justify-between py-4">
                  <CardTitle className="text-sm text-muted-foreground font-normal">
                    {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-xs" onClick={() => exportJson(items, 'commonly-catalog.json')}>
                      <Download className="size-3.5" /> Export JSON
                    </Button>
                    <Button size="sm" className="h-8 rounded-full text-xs" onClick={() => { setEditing(null); setForm(emptyProduct); setShowProductForm(true) }}>
                      <Plus className="size-3.5" /> Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filtered.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <Package className="mx-auto size-10 text-muted-foreground/30" />
                      <p className="mt-4 text-sm text-muted-foreground">No products found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {filtered.map(item => (
                        <div key={item.slug} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                          <img
                            src={item.image}
                            alt=""
                            className="size-14 shrink-0 rounded-xl object-cover bg-muted"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2 flex-wrap">
                              <p className="font-semibold text-sm">{item.name}</p>
                              {item.prime && <span className="rounded-full bg-[#131921] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#FF9900]">Prime</span>}
                              {item.isSpotlight && <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-rose-600 border border-rose-200">Spotlight</span>}
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">{item.brand} · {item.category}{item.subcategory ? ` / ${item.subcategory}` : ''}</p>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                              <Star className="size-3 fill-amber-400 text-amber-400" /> {item.rating}
                              <span>({item.reviewCount?.toLocaleString() ?? 0})</span>
                              <span>·</span>
                              <Eye className="size-3" /> {item.views.toLocaleString()} views
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <Button variant="outline" size="sm" className="h-7 rounded-full text-xs" onClick={() => openEdit(item)}>Edit</Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeProduct(item.slug)}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ════════════════════ CATEGORIES ════════════════════ */}
          {view === 'categories' && (
            <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
              <Card className="h-fit border-border/70">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">{editingCategory ? 'Edit Category' : 'Add Category'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={saveCategory} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Category Name</label>
                      <Input value={categoryForm.label} onChange={event => setCategoryForm({ ...categoryForm, label: event.target.value })} placeholder="e.g. Luxury Skincare" required />
                    </div>
                    <ImagePicker value={categoryForm.image} onChange={value => setCategoryForm({ ...categoryForm, image: value })} label="Hero Image" />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" className="h-8 rounded-full text-xs">
                        <Save className="size-3.5" /> {editingCategory ? 'Save Changes' : 'Add Category'}
                      </Button>
                      {editingCategory && (
                        <Button type="button" variant="ghost" size="sm" className="h-8 rounded-full text-xs" onClick={() => { setEditingCategory(null); setCategoryForm({ label: '', image: '' }) }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Categories &amp; Navbar Dropdowns ({groups.length})</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">Each subcategory appears as a link inside the navbar dropdown for that category.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groups.map(group => (
                    <div key={group.slug} className="overflow-hidden rounded-xl border border-border/70">
                      {group.image && (
                        <div className="relative aspect-[4/1] overflow-hidden bg-muted">
                          <img src={group.image} alt={group.label} className="size-full object-cover" onError={event => { (event.target as HTMLImageElement).src = FALLBACK_IMG }} />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                          <div className="absolute inset-4"><p className="font-serif text-xl text-white">{group.label}</p></div>
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            {!group.image && <p className="text-sm font-semibold">{group.label}</p>}
                            <p className="mt-0.5 text-xs text-muted-foreground">{group.items.length} subcategories in navbar dropdown</p>
                          </div>
                          <div className="flex shrink-0 gap-1.5">
                            <Button variant="outline" size="sm" className="h-7 rounded-full text-xs" onClick={() => { setEditingCategory(group.slug); setCategoryForm({ label: group.label, image: group.image }) }}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeCategory(group.slug)}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          {group.items.map(subLabel => {
                            const subSlug = slugify(subLabel)
                            const isEditingSubcategory = editingSubcategory?.slug === subSlug
                            return (
                              <div key={subSlug} className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                                {isEditingSubcategory ? (
                                  <>
                                    <Input
                                      autoFocus
                                      value={editingSubcategory.label}
                                      onChange={event => setEditingSubcategory({ ...editingSubcategory, label: event.target.value })}
                                      className="h-7 flex-1 text-xs"
                                      onKeyDown={async event => {
                                        if (event.key === 'Enter') { event.preventDefault(); await saveSubcategoryEdit() }
                                        if (event.key === 'Escape') setEditingSubcategory(null)
                                      }}
                                    />
                                    <Button size="sm" className="h-7 rounded-full px-2 text-xs" onClick={saveSubcategoryEdit}><Check className="size-3" /></Button>
                                    <Button variant="ghost" size="sm" className="h-7 rounded-full px-2 text-xs" onClick={() => setEditingSubcategory(null)}><X className="size-3" /></Button>
                                  </>
                                ) : (
                                  <>
                                    <span className="flex-1 text-xs font-medium">{subLabel}</span>
                                    <Link href={`/category/${group.slug}/${subSlug}`} target="_blank" className="text-muted-foreground hover:text-accent"><ExternalLink className="size-3" /></Link>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => setEditingSubcategory({ slug: subSlug, label: subLabel, categorySlug: group.slug })}><Settings className="size-3" /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeSubcategory(subSlug)}><Trash2 className="size-3" /></Button>
                                  </>
                                )}
                              </div>
                            )
                          })}

                          {addingSubcategoryTo === group.slug ? (
                            <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2">
                              <Input
                                autoFocus
                                value={newSubcategoryLabel}
                                onChange={event => setNewSubcategoryLabel(event.target.value)}
                                placeholder="Subcategory name…"
                                className="h-7 flex-1 text-xs"
                                onKeyDown={async event => {
                                  if (event.key === 'Enter') { event.preventDefault(); await addSubcategory(group.slug) }
                                  if (event.key === 'Escape') { setAddingSubcategoryTo(null); setNewSubcategoryLabel('') }
                                }}
                              />
                              <Button size="sm" className="h-7 rounded-full px-2 text-xs" onClick={() => addSubcategory(group.slug)}><Check className="size-3" /></Button>
                              <Button variant="ghost" size="sm" className="h-7 rounded-full px-2 text-xs" onClick={() => { setAddingSubcategoryTo(null); setNewSubcategoryLabel('') }}><X className="size-3" /></Button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { setAddingSubcategoryTo(group.slug); setNewSubcategoryLabel('') }}
                              className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                            >
                              <Plus className="size-3" /> Add subcategory to {group.label} dropdown
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              </div>
          )}

          {/* ════════════════════ MEDIA LIBRARY ════════════════════ */}
          {view === 'media' && (
            <div className="space-y-6">
              <Card className="border-border/70">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">{subImageForm.slug ? `Editing: ${subImageForm.slug}` : 'Add / Update Subcategory Image'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={saveSubImage} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Subcategory</label>
                      <select
                        value={subImageForm.slug}
                        onChange={e => setSubImageForm({ ...subImageForm, slug: e.target.value })}
                        className="h-9 rounded-md border bg-background px-3 text-sm"
                        required
                      >
                        <option value="">— Select a subcategory —</option>
                        {storefrontNavGroups.map(group => (
                          <optgroup key={group.slug} label={group.label}>
                            {group.items.map(subLabel => {
                              const subSlug = slugify(subLabel)
                              return (
                                <option key={subSlug} value={subSlug}>{subLabel}</option>
                              )
                            })}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <ImagePicker value={subImageForm.url} onChange={v => setSubImageForm({ ...subImageForm, url: v })} label="Hero Image" />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" className="rounded-full text-xs h-8">
                        <Save className="size-3.5" /> Save Image
                      </Button>
                      {subImageForm.slug && (
                        <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs h-8" onClick={() => setSubImageForm({ slug: '', url: '' })}>Cancel</Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardHeader className="flex-row items-center justify-between pb-4 flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-base">Media Library ({mediaList.length})</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Live assets from PostgreSQL (Products, Categories, and Subcategories)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-52">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input value={mediaQuery} onChange={e => setMediaQuery(e.target.value)} placeholder="Search media…" className="h-8 pl-8 text-xs" />
                    </div>
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-xs" onClick={reloadMedia} disabled={mediaLoading}>
                      <RefreshCw className={`size-3.5 ${mediaLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Media Type Filter Tabs */}
                  <div className="flex gap-1.5 border-b pb-3 mb-5">
                    {[
                      ['all', `All (${mediaList.length})`],
                      ['Product', `Products (${mediaList.filter(m => m.type === 'Product').length})`],
                      ['Category', `Categories (${mediaList.filter(m => m.type === 'Category').length})`],
                      ['Subcategory', `Subcategories (${mediaList.filter(m => m.type === 'Subcategory').length})`],
                    ].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setMediaTab(val as any)}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${mediaTab === val ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {mediaLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredMedia.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                      <ImageIcon className="mx-auto size-10 text-muted-foreground/30" />
                      <p className="mt-4 text-sm text-muted-foreground">No media assets found.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredMedia.map((item) => (
                        <div key={item.id} className="group overflow-hidden rounded-xl border border-border/70 bg-card">
                          <div className="relative aspect-video overflow-hidden bg-muted">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }}
                            />
                            <div className="absolute top-2 left-2">
                              <span className="rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                                {item.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 p-3">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold">{item.title}</p>
                              <p className="truncate text-[10px] text-muted-foreground">{item.slug}</p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 rounded-full text-[11px] px-2"
                                onClick={() => {
                                  setSubImageForm({ slug: item.slug, url: item.url })
                                  window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 rounded-full text-[11px] px-2 text-muted-foreground"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.url)
                                  setSaved(true)
                                  setTimeout(() => setSaved(false), 2000)
                                }}
                              >
                                Copy URL
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 rounded-full text-[11px] px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={async () => {
                                  if (!confirm(`Remove image for ${item.type} "${item.title}"?`)) return
                                  try {
                                    await apiRemoveMedia(item.type, item.slug)
                                    await reloadMedia()
                                    await reloadData()
                                    setSaved(true)
                                    setTimeout(() => setSaved(false), 2000)
                                  } catch (err: any) {
                                    alert(`Failed to remove image: ${err?.message || 'Error'}`)
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ════════════════════ ACTIVITY ════════════════════ */}
          {view === 'activity' && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Total Events" value={activityItems.length} icon={Activity} />
                <StatCard label="Registrations" value={activityItems.filter(a => a.eventType === 'register').length} icon={Users} accent />
                <StatCard label="Affiliate Clicks" value={activityItems.filter(a => a.eventType === 'affiliate_click').length} icon={ExternalLink} />
              </div>

              <Card className="border-border/70">
                <CardHeader className="flex-row items-center justify-between gap-4 pb-4 flex-wrap">
                  <CardTitle className="text-base">Activity Log</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input value={activityQuery} onChange={e => setActivityQuery(e.target.value)} placeholder="Search by email or product…" className="h-8 pl-8 text-xs w-56" />
                    </div>
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-xs" onClick={fetchActivity} disabled={activityLoading}>
                      {activityLoading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />} Refresh
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-xs" onClick={() => exportCsv(filteredActivity)}>
                      <Download className="size-3.5" /> Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Filter Tabs */}
                  <div className="flex gap-1.5 border-b px-5 pb-3">
                    {[['all', 'All'], ['register', 'Signups'], ['login', 'Logins'], ['affiliate_click', 'Affiliate Clicks']].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setActivityFilter(val)}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${activityFilter === val ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {activityLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredActivity.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                      <Activity className="mx-auto size-10 text-muted-foreground/30" />
                      <p className="mt-4 text-sm text-muted-foreground">No activity yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {filteredActivity.map(a => (
                        <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`size-2 rounded-full ${a.eventType === 'register' ? 'bg-emerald-500' : a.eventType === 'login' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                            <div>
                              <p className="text-sm font-medium">{a.eventName}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {a.email || 'Guest'}{a.location ? ` · ${a.location}` : ''}{a.productSlug ? ` · ${a.productSlug}` : ''}
                              </p>
                            </div>
                          </div>
                          <time className="shrink-0 text-[11px] text-muted-foreground">{formatDate(a.createdAt)}</time>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ════════════════════ SETTINGS ════════════════════ */}
          {view === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <Card className="border-border/70">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Catalog Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-6">
                    Your product catalog, categories, and media library are stored locally in this browser and are immediately reflected on the public storefront.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-8" onClick={() => exportJson(items, 'commonly-products.json')}>
                      <Download className="size-3.5" /> Export Products JSON
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-8" onClick={() => exportJson(groups, 'commonly-categories.json')}>
                      <Download className="size-3.5" /> Export Categories JSON
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-8" onClick={() => exportJson(subImages, 'commonly-media.json')}>
                      <Download className="size-3.5" /> Export Media JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Amazon Associates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold">Amazon Associates Disclosure</p>
                        <p className="mt-1 leading-6">As an Amazon Associate, we earn from qualifying purchases. All product links are affiliate links. Prices are managed directly on Amazon — do not display static prices on the storefront.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Restore all products, categories, and media to the original curated factory defaults. All custom edits will be permanently lost.</p>
                  {!resetConfirm ? (
                    <Button variant="outline" size="sm" className="mt-4 rounded-full text-xs h-8 border-destructive text-destructive hover:bg-destructive hover:text-white" onClick={() => setResetConfirm(true)}>
                      Restore Factory Defaults
                    </Button>
                  ) : (
                    <div className="mt-4 flex items-center gap-3">
                      <p className="text-sm text-destructive font-medium">Are you sure? This cannot be undone.</p>
                      <Button variant="destructive" size="sm" className="rounded-full text-xs h-8" onClick={resetToDefaults}>Yes, Reset</Button>
                      <Button variant="ghost" size="sm" className="rounded-full text-xs h-8" onClick={() => setResetConfirm(false)}>Cancel</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </div>

      {/* ════════════════ PRODUCT FORM MODAL ════════════════ */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm">
          <Card className="max-h-[92vh] w-full max-w-3xl overflow-auto shadow-2xl">
            <CardHeader className="sticky top-0 z-10 border-b bg-background flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-lg font-serif">{editing ? 'Edit Product' : 'New Product'}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{editing ? `Editing: ${editing}` : 'Fill in the product details below'}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowProductForm(false)} aria-label="Close">
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={submitProduct} className="space-y-8">

                {/* Basic Info */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Basic Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Product Name *</label>
                      <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Hyaluronic Serum" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Brand *</label>
                      <Input value={form.brand} onChange={e => update('brand', e.target.value)} placeholder="e.g. Dr. Barbara Sturm" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Category *</label>
                      <select
                        value={form.category}
                        onChange={e => {
                          update('category', e.target.value)
                          update('subcategory', '')
                        }}
                        className="h-9 rounded-md border bg-background px-3 text-sm"
                        required
                      >
                        <option value="">— Select a category —</option>
                        {storefrontNavGroups.map(group => <option key={group.slug} value={group.slug}>{group.label}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Subcategory</label>
                      {(() => {
                        const matched = storefrontNavGroups.find(group => group.slug === form.category)
                        const options = matched?.items || []
                        return options.length > 0 ? (
                          <select
                            value={form.subcategory}
                            onChange={e => update('subcategory', e.target.value)}
                            className="h-9 rounded-md border bg-background px-3 text-sm"
                          >
                            <option value="">— None —</option>
                            {options.map(item => (
                              <option key={slugify(item)} value={slugify(item)}>{item}</option>
                            ))}
                            {form.subcategory && !options.some(item => slugify(item) === form.subcategory) && (
                              <option value={form.subcategory}>{form.subcategory}</option>
                            )}
                          </select>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">No subcategories found for this category.</p>
                        )
                      })()}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Rating (0–5) — display only, auto-computed from reviews</label>
                      <Input value={form.rating} onChange={e => update('rating', e.target.value)} placeholder="4.9" />
                    </div>
                  </div>
                </div>

                {/* Amazon Details */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Amazon Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Affiliate URL</label>
                      <Input value={form.affiliateUrl} onChange={e => update('affiliateUrl', e.target.value)} placeholder="https://www.amazon.com/dp/B00XXXXXX" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Views Count</label>
                      <Input value={form.views} onChange={e => update('views', e.target.value)} placeholder="0" type="number" min="0" />
                    </div>
                  </div>
                </div>

                {/* Flags */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Product Flags</h3>
                  <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-muted/30 p-4">
                    <Toggle checked={form.prime} onChange={v => update('prime', v)} label="Amazon Prime Eligible" />
                    <Toggle checked={form.isSpotlight} onChange={v => update('isSpotlight', v)} label="Feature in Home Hero" />
                  </div>
                  {form.isSpotlight && (
                    <p className="mt-2 text-[11px] text-amber-700 flex items-center gap-1.5">
                      <AlertCircle className="size-3" /> Setting this will remove the Spotlight flag from the current featured product.
                    </p>
                  )}
                </div>

                {/* Image */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Product Image</h3>
                  <ImagePicker value={form.image} onChange={v => update('image', v)} label="Main Product Image" />
                  <GalleryImagePicker images={form.images} onChange={images => update('images', images)} />
                  <p className="mt-2 text-[11px] text-muted-foreground">The main product image appears first in the review page gallery.</p>
                </div>

                {/* Description & Tags */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Content & Tags</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Tags (comma separated)</label>
                      <Input value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="Editor Choice, Cult Classic, Prestige Luxury" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Description</label>
                      <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Short editorial description of the product…" className="min-h-24 rounded-md border bg-background p-3 text-sm resize-none" />
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Specifications (comma separated — use Label: Value)</h3>
                  <div className="grid gap-4">
                    {[
                      { key: 'highlights' as const, label: 'Top Highlights', placeholder: 'Key: Value, Key: Value' },
                      { key: 'itemDetails' as const, label: 'Item Details', placeholder: 'Brand: Name, Size: 30ml' },
                      { key: 'specs' as const, label: 'Features & Specs', placeholder: 'Packaging: Glass, Application: Morning' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium">{label}</label>
                        <textarea value={form[key]} onChange={e => update(key, e.target.value)} placeholder={placeholder} className="min-h-20 rounded-md border bg-background p-3 text-sm resize-none" />
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-full uppercase tracking-wider text-xs h-11">
                  <Save className="size-4" /> {editing ? 'Save Changes' : 'Add Product'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
