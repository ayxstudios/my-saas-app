import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user?.stripeCustomerId) {
    return Response.json({ error: "No active subscription" }, { status: 400 })
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${baseUrl}/billing`,
  })

  return Response.json({ url: portalSession.url })
}
