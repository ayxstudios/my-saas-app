import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const TONE_STYLE: Record<string, string> = {
  luxury: "high-end, elegant, sophisticated lighting, premium lifestyle aesthetic, rich textures",
  playful: "vibrant, colorful, fun and energetic composition, bright background",
  minimal: "clean, white or light background, minimal composition, modern and airy",
  bold: "high contrast, dramatic lighting, strong visual impact, bold colors",
  professional: "studio quality, neutral background, professional product lighting",
  friendly: "warm and inviting, natural light, lifestyle setting, relatable environment",
}

const TYPE_GUIDE: Record<string, string> = {
  product: "product photography focus, studio lighting, sharp detail on the product, clean background",
  lifestyle: "lifestyle photography, real-world setting with the product in use, person enjoying it",
  promo: "eye-catching promotional composition, clean layout with visual interest, impactful framing",
}

export async function generatePostImage(params: {
  hook: string
  caption: string
  postType: string
  brandTone: string
}): Promise<string | null> {
  const style = TONE_STYLE[params.brandTone] || TONE_STYLE.professional
  const type = TYPE_GUIDE[params.postType] || TYPE_GUIDE.product

  const prompt = `Create a high-quality social media image for this Instagram post.

Post hook: "${params.hook}"
Post summary: "${params.caption.slice(0, 120)}"

Visual style: ${style}
Shot type: ${type}
Format: Square (1:1), optimized for Instagram feed.
Do not include any text, words, or watermarks in the image.`

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: prompt,
    config: {
      responseModalities: ["IMAGE"],
    },
  })

  const parts = response.candidates?.[0]?.content?.parts ?? []
  for (const part of parts) {
    if (part.inlineData?.data) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
    }
  }
  return null
}
