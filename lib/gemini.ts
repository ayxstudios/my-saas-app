import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface PostOutput {
  hook: string
  caption: string
  hashtags: string[]
  image_url: string
  post_type: "product" | "lifestyle" | "promo"
}

export interface GeneratePostsInput {
  products: Array<{
    title: string
    description: string
    price: string
    imageUrl: string
    collection?: string
  }>
  brandProfile: {
    tone: string
    audience: string
    exampleCaptions?: string
  }
  campaign?: {
    name: string
    description: string
    discount?: string
  }
  count: number
}

export interface GenerateFromWebsiteInput {
  websiteUrl: string
  topic?: string
  brandProfile: {
    tone: string
    audience: string
    exampleCaptions?: string
  }
  campaign?: {
    name: string
    description: string
    discount?: string
  }
  count: number
  websiteContext?: {
    brandName: string
    tagline?: string
    description: string
    businessType: string
    industry: string
    products: Array<{
      name: string
      description: string
      price?: string | null
      imageUrl?: string | null
      category?: string | null
    }>
    services: Array<{
      name: string
      description: string
      price?: string | null
    }>
    keyValueProps: string[]
    priceRange?: string | null
  } | null
}

const SYSTEM_PROMPT = `You are an expert ecommerce social media strategist who creates high-converting Instagram and Facebook posts that drive real sales — not just likes.

Your posts must:
- Lead with a powerful hook (first line stops the scroll)
- Focus on BENEFITS over features
- Hit emotional triggers and pain points
- Include a clear, urgent CTA (Shop Now, Limited Stock, Link in Bio, etc.)
- Sound human, not AI-generated
- Match the brand's exact tone
- Be platform-native (Instagram/Facebook style)

NEVER write:
- Generic intros ("Introducing our amazing product...")
- Vague fluff ("high quality", "you'll love it")
- Weak CTAs ("check it out")
- Hashtags that are irrelevant or too niche

Always return valid JSON matching the exact schema provided.`

export async function generateSocialPosts(
  input: GeneratePostsInput
): Promise<PostOutput[]> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.85,
      topP: 0.9,
    },
    systemInstruction: SYSTEM_PROMPT,
  })

  const productsText = input.products
    .map(
      (p, i) =>
        `Product ${i + 1}: "${p.title}" | Price: ${p.price} | ${p.description?.slice(0, 200) || "No description"}${p.collection ? ` | Collection: ${p.collection}` : ""}`
    )
    .join("\n")

  const campaignText = input.campaign
    ? `\nACTIVE CAMPAIGN: "${input.campaign.name}" — ${input.campaign.description}${input.campaign.discount ? `. Discount: ${input.campaign.discount}` : ""}`
    : ""

  const exampleText = input.brandProfile.exampleCaptions
    ? `\nEXAMPLE CAPTIONS FOR STYLE REFERENCE:\n${input.brandProfile.exampleCaptions}`
    : ""

  const prompt = `Generate ${input.count} unique, high-converting social media posts for this ecommerce brand.

BRAND PROFILE:
- Tone: ${input.brandProfile.tone}
- Target Audience: ${input.brandProfile.audience}${exampleText}${campaignText}

PRODUCTS TO FEATURE:
${productsText}

RULES:
- Rotate across the products (don't feature the same product too many times)
- Mix post types: product highlights, lifestyle posts, and promos
- Each post must feel distinct — no repetitive structures
- If there's a campaign/promo, at least 40% of posts should reference it
- Hashtags: 8–15 per post, mix of broad (#fashion) and specific (#sustainablestyle)
- image_url: use the product's image URL if featuring that product, else use the most relevant product image

Return a JSON array of exactly ${input.count} objects, each with this schema:
{
  "hook": "First line of post — scroll-stopping, max 15 words",
  "caption": "Full post caption (hook included), 50-150 words, with CTA at end",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "image_url": "URL from the product data",
  "post_type": "product | lifestyle | promo"
}

Return ONLY the JSON array, no other text.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const parsed = JSON.parse(text)
  return Array.isArray(parsed) ? parsed : parsed.posts || []
}

export async function generateSocialPostsFromWebsite(
  input: GenerateFromWebsiteInput
): Promise<PostOutput[]> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.85,
      topP: 0.9,
    },
    systemInstruction: SYSTEM_PROMPT,
  })

  const ctx = input.websiteContext
  const campaignText = input.campaign
    ? `\nACTIVE CAMPAIGN: "${input.campaign.name}" — ${input.campaign.description}${input.campaign.discount ? `. Discount: ${input.campaign.discount}` : ""}`
    : ""

  const exampleText = input.brandProfile.exampleCaptions
    ? `\nEXAMPLE CAPTIONS FOR STYLE REFERENCE:\n${input.brandProfile.exampleCaptions}`
    : ""

  const topicText = input.topic ? `\nFOCUS TOPIC/PRODUCT: ${input.topic}` : ""

  let brandContextBlock: string
  let hasImages = false

  if (ctx) {
    // Rich scraped context available
    const productLines =
      ctx.products.length > 0
        ? ctx.products
            .map(
              (p, i) =>
                `  ${i + 1}. "${p.name}"${p.category ? ` [${p.category}]` : ""}` +
                `\n     Description: ${p.description}` +
                (p.price ? `\n     Price: ${p.price}` : "") +
                (p.imageUrl ? `\n     Image: ${p.imageUrl}` : "")
            )
            .join("\n")
        : "  (no specific products identified)"

    const serviceLines =
      ctx.services.length > 0
        ? ctx.services
            .map(
              (s, i) =>
                `  ${i + 1}. "${s.name}"` +
                `\n     ${s.description}` +
                (s.price ? ` — ${s.price}` : "")
            )
            .join("\n")
        : ""

    hasImages = ctx.products.some((p) => p.imageUrl)

    brandContextBlock = `BRAND: ${ctx.brandName}${ctx.tagline ? ` — "${ctx.tagline}"` : ""}
INDUSTRY: ${ctx.industry}
BUSINESS TYPE: ${ctx.businessType}
BRAND DESCRIPTION: ${ctx.description}${ctx.priceRange ? `\nPRICE RANGE: ${ctx.priceRange}` : ""}
KEY SELLING POINTS: ${ctx.keyValueProps.join(" | ")}

${ctx.products.length > 0 ? `PRODUCTS CATALOGUE:\n${productLines}` : ""}
${ctx.services.length > 0 ? `SERVICES OFFERED:\n${serviceLines}` : ""}
BRAND PROFILE:
- Tone: ${input.brandProfile.tone}
- Target Audience: ${input.brandProfile.audience}${exampleText}${campaignText}${topicText}`
  } else {
    // Fallback: minimal context, ask Gemini to infer
    brandContextBlock = `BRAND WEBSITE: ${input.websiteUrl}
BRAND PROFILE:
- Tone: ${input.brandProfile.tone}
- Target Audience: ${input.brandProfile.audience}${exampleText}${campaignText}${topicText}

Infer the brand's products/services from the website URL and create relevant posts.`
  }

  const imageRule = hasImages
    ? "- image_url: use the product's image URL from the PRODUCTS CATALOGUE when featuring that product, else use the most visually relevant product image"
    : '- image_url: return "" as no product images are available'

  const productRotationRule =
    ctx && ctx.products.length > 1
      ? `- Rotate across the product catalogue — don't feature the same product in consecutive posts
- Name specific products in captions when featuring them (use their real names)
- At least ${Math.ceil(input.count * 0.5)} posts should highlight a specific product from the catalogue`
      : ctx && ctx.services.length > 1
        ? `- Rotate across the different services offered
- Reference specific service names in captions`
        : "- Mix post types: product highlights, lifestyle posts, and promos"

  const prompt = `Generate ${input.count} unique, high-converting social media posts for this brand.

${brandContextBlock}

RULES:
${productRotationRule}
- Each post must feel distinct — no repetitive structures, hooks, or CTAs
- If there's a campaign/promo, at least 40% of posts should reference it
- Hashtags: 8–15 per post, mix of broad (#fashion) and niche-specific (#${ctx?.industry?.replace(/\s+/g, "") || "boutique"})
- Captions must sound human and brand-authentic — no generic AI fluff
- Always end with a clear CTA relevant to the brand (Shop Now, DM us, Book a call, Link in bio, etc.)
${imageRule}

Return a JSON array of exactly ${input.count} objects:
{
  "hook": "First line — scroll-stopping, max 15 words",
  "caption": "Full caption (hook included), 50-150 words, CTA at end",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "image_url": "product image URL or empty string",
  "post_type": "product | lifestyle | promo"
}

Return ONLY the JSON array, no other text.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const parsed = JSON.parse(text)
  return Array.isArray(parsed) ? parsed : parsed.posts || []
}
