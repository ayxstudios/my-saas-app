import { GoogleGenerativeAI } from "@google/generative-ai"

export interface ScrapedProduct {
  name: string
  description: string
  price?: string | null
  imageUrl?: string | null
  category?: string | null
}

export interface ScrapedService {
  name: string
  description: string
  price?: string | null
}

export interface BrandContext {
  brandName: string
  tagline?: string
  description: string
  businessType: "product" | "service" | "mixed"
  industry: string
  products: ScrapedProduct[]
  services: ScrapedService[]
  keyValueProps: string[]
  priceRange?: string | null
  scrapedAt: string
}

const PRODUCT_PATH_PATTERNS = [
  /\/shop/i,
  /\/products/i,
  /\/collections/i,
  /\/store/i,
  /\/catalogue/i,
  /\/catalog/i,
  /\/menu/i,
  /\/services/i,
  /\/pricing/i,
  /\/packages/i,
  /\/about/i,
]

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function extractMeta(html: string) {
  const title =
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || ""
  const description =
    html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    )?.[1]?.trim() ||
    html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i
    )?.[1]?.trim() ||
    ""
  const ogTitle =
    html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    )?.[1]?.trim() ||
    html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i
    )?.[1]?.trim() ||
    ""
  const ogDesc =
    html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    )?.[1]?.trim() ||
    html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i
    )?.[1]?.trim() ||
    ""
  return { title, description, ogTitle, ogDesc }
}

function extractLinks(html: string, baseUrl: string): string[] {
  const base = new URL(baseUrl)
  const hrefs = [...html.matchAll(/href=["']([^"'#?][^"']*?)["']/gi)].map(
    (m) => m[1]
  )
  const seen = new Set<string>()
  const links: string[] = []
  for (const href of hrefs) {
    if (
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    )
      continue
    try {
      const resolved = new URL(href, baseUrl).href
      if (new URL(resolved).hostname !== base.hostname) continue
      if (seen.has(resolved)) continue
      seen.add(resolved)
      links.push(resolved)
    } catch {
      // ignore invalid URLs
    }
  }
  return links
}

function extractImages(html: string, baseUrl: string): string[] {
  const srcs = [
    ...html.matchAll(
      /(?:src|data-src|data-lazy-src)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi
    ),
  ].map((m) => m[1])
  const seen = new Set<string>()
  const images: string[] = []
  for (const src of srcs) {
    // Skip tiny icons, logos in specific paths, tracking pixels
    if (src.includes("icon") || src.includes("logo") || src.includes("pixel"))
      continue
    try {
      const resolved = new URL(src, baseUrl).href
      if (seen.has(resolved)) continue
      seen.add(resolved)
      images.push(resolved)
    } catch {
      // ignore
    }
  }
  return images
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SocialAI-Scraper/1.0; +https://socialai.app)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const ct = res.headers.get("content-type") || ""
    if (!ct.includes("text/html")) return null
    return await res.text()
  } catch {
    return null
  }
}

async function parseBrandContextWithGemini(input: {
  url: string
  homeMeta: ReturnType<typeof extractMeta>
  homeText: string
  subPageContents: string[]
  allImages: string[]
}): Promise<BrandContext> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  })

  const imagesBlock =
    input.allImages.length > 0
      ? `\nPRODUCT/CONTENT IMAGE URLs FOUND ON SITE:\n${input.allImages.slice(0, 12).join("\n")}`
      : ""

  const subPagesBlock =
    input.subPageContents.length > 0
      ? `\nSUB-PAGE CONTENT:\n${input.subPageContents.join("\n\n---\n\n")}`
      : ""

  const prompt = `You are a brand intelligence analyst. Analyze this website's scraped content and extract a detailed, structured brand profile to power social media marketing.

WEBSITE: ${input.url}
PAGE TITLE: ${input.homeMeta.title}
META DESCRIPTION: ${input.homeMeta.description}
OG TITLE: ${input.homeMeta.ogTitle}
OG DESCRIPTION: ${input.homeMeta.ogDesc}

HOMEPAGE TEXT:
${input.homeText}
${subPagesBlock}
${imagesBlock}

INSTRUCTIONS:
- Identify every distinct product, SKU, or service you can find with as much detail as possible
- For jewellery: include material, stone, style (e.g. "14k Gold Diamond Solitaire Ring")
- For fashion: include material, style, sizing notes
- For food/drink: include flavours, ingredients highlights
- For services: include what's included, duration, deliverables
- Be SPECIFIC — "Gold Ring" is useless, "18k Gold Vermeil Adjustable Stacking Ring" is valuable
- For imageUrl: match the most relevant image URL from the list above to each product, based on filename/URL keywords
- keyValueProps: extract the brand's actual differentiators (e.g. "handmade in London", "ethically sourced", "30-day returns")

Return ONLY this JSON (no markdown, no explanation):
{
  "brandName": "the actual brand name",
  "tagline": "their slogan or headline if found, else null",
  "description": "2-3 sentence summary: what they sell, who for, what makes them special",
  "businessType": "product | service | mixed",
  "industry": "specific industry (e.g. fine jewellery, streetwear, skincare, wedding photography, SaaS, personal training)",
  "products": [
    {
      "name": "specific product name",
      "description": "detailed description: materials, features, benefits, use case",
      "price": "price with currency symbol if found, else null",
      "imageUrl": "matching image URL from the list or null",
      "category": "collection or category name if identifiable, else null"
    }
  ],
  "services": [
    {
      "name": "service name",
      "description": "what it includes, who it's for",
      "price": "price/tier if found, else null"
    }
  ],
  "keyValueProps": ["3-6 specific selling points or brand differentiators"],
  "priceRange": "price range or positioning (e.g. '$25-$500', 'Luxury $500+', 'Budget-friendly', 'Mid-range') or null"
}`

  const result = await model.generateContent(prompt)
  const parsed = JSON.parse(result.response.text())

  return {
    brandName: parsed.brandName || new URL(input.url).hostname.replace("www.", ""),
    tagline: parsed.tagline || undefined,
    description: parsed.description || "",
    businessType: parsed.businessType || "product",
    industry: parsed.industry || "retail",
    products: Array.isArray(parsed.products) ? parsed.products : [],
    services: Array.isArray(parsed.services) ? parsed.services : [],
    keyValueProps: Array.isArray(parsed.keyValueProps) ? parsed.keyValueProps : [],
    priceRange: parsed.priceRange || undefined,
    scrapedAt: new Date().toISOString(),
  }
}

export async function scrapeWebsite(websiteUrl: string): Promise<BrandContext> {
  const normalizedUrl = websiteUrl.startsWith("http")
    ? websiteUrl
    : `https://${websiteUrl}`

  const homeHtml = await fetchPage(normalizedUrl)

  if (!homeHtml) {
    // Site unreachable — return skeleton so Gemini can still use the URL/domain
    const domain = new URL(normalizedUrl).hostname.replace("www.", "")
    return {
      brandName: domain,
      description: "",
      businessType: "product",
      industry: "retail",
      products: [],
      services: [],
      keyValueProps: [],
      scrapedAt: new Date().toISOString(),
    }
  }

  const homeMeta = extractMeta(homeHtml)
  const homeText = stripHtml(homeHtml).slice(0, 4000)
  const allLinks = extractLinks(homeHtml, normalizedUrl)
  const homeImages = extractImages(homeHtml, normalizedUrl)

  // Find sub-pages with product/service signals from discovered links
  const matchedLinks = allLinks
    .filter((link) => PRODUCT_PATH_PATTERNS.some((p) => p.test(new URL(link).pathname)))
    .slice(0, 6)

  // Also probe common paths that might not be linked
  const base = new URL(normalizedUrl)
  const commonPaths = [
    "/shop",
    "/products",
    "/collections",
    "/services",
    "/pricing",
    "/about",
    "/menu",
    "/packages",
  ]
  for (const path of commonPaths) {
    const candidate = `${base.origin}${path}`
    if (!matchedLinks.includes(candidate)) {
      matchedLinks.push(candidate)
    }
    if (matchedLinks.length >= 8) break
  }

  // Fetch up to 5 sub-pages concurrently
  const subPageResults = await Promise.allSettled(
    matchedLinks.slice(0, 5).map(async (url) => {
      const html = await fetchPage(url)
      if (!html) return null
      return {
        url,
        text: stripHtml(html).slice(0, 2500),
        images: extractImages(html, url),
      }
    })
  )

  const subPageContents: string[] = []
  const subPageImages: string[] = []

  for (const r of subPageResults) {
    if (r.status === "fulfilled" && r.value) {
      subPageContents.push(`[Page: ${r.value.url}]\n${r.value.text}`)
      subPageImages.push(...r.value.images)
    }
  }

  // Deduplicate images, prioritise sub-page images (more likely to be products)
  const allImages = [...subPageImages, ...homeImages].filter(
    (v, i, a) => a.indexOf(v) === i
  )

  return parseBrandContextWithGemini({
    url: normalizedUrl,
    homeMeta,
    homeText,
    subPageContents,
    allImages,
  })
}
