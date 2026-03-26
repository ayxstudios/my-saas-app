import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      shopifyStore: {
        include: {
          products: {
            orderBy: { createdAt: "desc" },
            take: 100,
          },
        },
      },
    },
  })

  return Response.json({
    products: user?.shopifyStore?.products || [],
    storeId: user?.shopifyStore?.id || null,
  })
}
