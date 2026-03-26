import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { brandProfile: true },
  })

  return Response.json({ brand: user?.brandProfile || null })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { tone, audience, exampleCaptions, competitors, moodBoardImages } = await request.json()

  if (!tone || !audience) {
    return Response.json(
      { error: "Tone and audience are required" },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const brand = await prisma.brandProfile.upsert({
    where: { userId: user.id },
    update: { tone, audience, exampleCaptions, competitors, moodBoardImages: moodBoardImages ?? [] },
    create: { userId: user.id, tone, audience, exampleCaptions, competitors, moodBoardImages: moodBoardImages ?? [] },
  })

  return Response.json({ brand })
}
