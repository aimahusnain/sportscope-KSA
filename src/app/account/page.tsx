import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import AccountPageClient from "./account-client"
import { authOptions } from "@/lib/authOptions"

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <AccountPageClient user={session.user ? { ...session.user, id: session.user.id || "" } : undefined} />
}
