import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ campaigns: [] })

  const campaigns = await prisma.campaign.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return Response.json({ campaigns })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, description, discount } = await request.json()
  if (!name) return Response.json({ error: "Name is required" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const campaign = await prisma.campaign.create({
    data: { userId: user.id, name, description, discount },
  })

  return Response.json({ campaign }, { status: 201 })
}
