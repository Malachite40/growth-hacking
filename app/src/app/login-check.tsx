import { RedirectToSignIn } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"

export type LoginCheckProps = {}

async function LoginCheck({}: LoginCheckProps) {
  const user = await currentUser()

  if (!user) return <RedirectToSignIn />

  return <></>
}
export default LoginCheck
