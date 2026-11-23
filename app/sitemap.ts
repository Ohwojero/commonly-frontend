import type { MetadataRoute } from 'next'
import { fetchCategories, fetchProducts, type ApiProduct } from '@/lib/api'
import { isNotDummyProduct, products as fallbackProducts, type Product } from '@/lib/products'
import {
  getStorefrontRouteSlug,
  storefrontNavGroups,
  storefrontNavSlug,
} from '@/lib/storefront-navigation'

const siteUrl = 'https://www.commonlys.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, apiProducts] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchProducts().catch(() => []),
  ])
  const urls = new Map<string, MetadataRoute.Sitemap[number]>()

  const add = (path: string) => {
    urls.set(path, { url: new URL(path, siteUrl).toString() })
  }

  add('/')
  add('/about')
  add('/how-it-works')
  add('/contact')
  add('/privacy-policy')
  add('/terms')
  add('/affiliate-disclosure')

  for (const group of storefrontNavGroups) {
    const categoryPath = `/category/${getStorefrontRouteSlug(group.slug)}`
    add(categoryPath)
    for (const niche of group.subNiches) {
      add(`${categoryPath}/${niche.slug}`)
    }
  }

  for (const category of categories) {
    const categoryPath = `/category/${getStorefrontRouteSlug(category.slug)}`
    add(categoryPath)
    for (const subcategory of category.subcategories ?? []) {
      add(`${categoryPath}/${subcategory.slug}`)
    }
  }

  const productMap = new Map<string, Product | ApiProduct>()
  for (const product of fallbackProducts) {
    if (isNotDummyProduct(product.slug)) productMap.set(product.slug, product)
  }
  for (const product of apiProducts) {
    if (isNotDummyProduct(product.slug)) productMap.set(product.slug, product)
  }

  for (const product of productMap.values()) {
    add(`/products/${product.slug}`)
    const categorySlug = 'createdAt' in product
      ? product.subcategory?.category?.slug
      : product.categorySlug
    const subcategorySlug = 'createdAt' in product
      ? product.subcategory?.slug
      : product.subcategorySlug
    if (categorySlug && subcategorySlug) {
      add(
        `/category/${getStorefrontRouteSlug(categorySlug)}/${storefrontNavSlug(subcategorySlug)}`,
      )
    }
  }

  return Array.from(urls.values())
}
