import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import AccountPageClient from "./account-client"

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <AccountPageClient user={session.user ? { ...session.user, id: session.user.id || "" } : undefined} />
}
