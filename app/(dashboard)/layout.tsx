import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Sidebar from "@/components/ui/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userName={session.user?.name || session.user?.email || "User"} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
