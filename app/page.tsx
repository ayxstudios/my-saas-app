import { redirect } from "next/navigation"
import { auth } from "@/auth"
import FishGame from "./FishGame"

export default async function Home() {
  const session = await auth()
  if (!session) redirect("/login")

  return <FishGame name={session.user?.name} />
}