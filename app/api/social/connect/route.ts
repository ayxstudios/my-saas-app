import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Manual connection for MVP — users provide their Page access token
// Full OAuth flow requires a Meta App configured in production
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { platform, accessToken, accountId, accountName, pageId, testMode } =
    await request.json()

  if (!platform || !accessToken || !accountId || !accountName) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (!["instagram", "facebook"].includes(platform)) {
    return Response.json({ error: "Platform must be instagram or facebook" }, { status: 400 })
  }

  // Validate the token against Graph API unless testMode is enabled
  if (!testMode) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`
      )
      if (!res.ok) {
        return Response.json({ error: "Invalid access token" }, { status: 400 })
      }
    } catch {
      return Response.json({ error: "Could not validate token" }, { status: 400 })
    }
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const account = await prisma.socialAccount.upsert({
    where: { userId_platform: { userId: user.id, platform } },
    update: { accessToken, accountId, accountName, pageId },
    create: { userId: user.id, platform, accessToken, accountId, accountName, pageId },
  })

  return Response.json({
    account: {
      id: account.id,
      platform: account.platform,
      accountName: account.accountName,
    },
  })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { socialAccounts: true },
  })

  const accounts = (user?.socialAccounts || []).map((a) => ({
    id: a.id,
    platform: a.platform,
    accountName: a.accountName,
  }))

  return Response.json({ accounts })
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { platform } = await request.json()
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  await prisma.socialAccount.deleteMany({
    where: { userId: user.id, platform },
  })

  return Response.json({ success: true })
}
