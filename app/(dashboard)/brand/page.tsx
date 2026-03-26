import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import BrandForm from "@/components/brand/BrandForm"

export default async function BrandPage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { brandProfile: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Brand Profile</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Define your brand voice so AI generates content that sounds like you.
        </p>
      </div>
      <BrandForm
        existing={
          user?.brandProfile
            ? {
                tone: user.brandProfile.tone,
                audience: user.brandProfile.audience,
                exampleCaptions: user.brandProfile.exampleCaptions || "",
                competitors: user.brandProfile.competitors || "",
                moodBoardImages: user.brandProfile.moodBoardImages || [],
              }
            : null
        }
      />
    </div>
  )
}
