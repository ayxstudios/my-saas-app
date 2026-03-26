export interface ShopifyProduct {
  id: number
  title: string
  body_html: string
  vendor: string
  product_type: string
  handle: string
  variants: Array<{ price: string }>
  images: Array<{ src: string }>
  collections?: string[]
}

export interface ShopifyCollection {
  id: number
  title: string
}

export async function validateShopifyCredentials(
  shopDomain: string,
  accessToken: string
): Promise<{ valid: boolean; storeName?: string; error?: string }> {
  try {
    const res = await fetch(
      `https://${shopDomain}/admin/api/2024-01/shop.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    )
    if (!res.ok) {
      return { valid: false, error: "Invalid credentials or store domain" }
    }
    const data = await res.json()
    return { valid: true, storeName: data.shop?.name }
  } catch {
    return { valid: false, error: "Could not connect to store" }
  }
}

export async function fetchShopifyProducts(
  shopDomain: string,
  accessToken: string,
  limit = 50
): Promise<ShopifyProduct[]> {
  const res = await fetch(
    `https://${shopDomain}/admin/api/2024-01/products.json?limit=${limit}&status=active&fields=id,title,body_html,handle,variants,images,product_type`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`)
  }

  const data = await res.json()
  return data.products || []
}

export async function fetchShopifyCollections(
  shopDomain: string,
  accessToken: string
): Promise<ShopifyCollection[]> {
  const res = await fetch(
    `https://${shopDomain}/admin/api/2024-01/custom_collections.json?fields=id,title`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) return []
  const data = await res.json()
  return data.custom_collections || []
}

export function cleanDescription(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500)
}
