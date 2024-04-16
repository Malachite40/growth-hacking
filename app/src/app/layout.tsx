import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Toaster } from "~/components/ui/sonner"
import { getUser } from "~/lib/auth/context"
import "~/styles/globals.css"
import { TRPCReactProvider } from "~/trpc/react"
import DefaultLayout from "./defaultLayout"
import LoginCheck from "./login-check"
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Growth v0.1",
  description: "Plant your seeds. Grow your business.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const { user, organizations, selectedOrganization } = await getUser()
  const layout = cookieStore.get("react-resizable-panels:layout")
  const collapsed = cookieStore.get("react-resizable-panels:collapsed")
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <LoginCheck />
        <html lang="en" suppressHydrationWarning>
          <body
            className={`font-sans ${inter.variable} flex max-h-screen min-h-screen overflow-hidden`}
          >
            <main className="flex max-w-full flex-grow justify-center">
              <DefaultLayout
                user={user}
                defaultLayout={layout ? JSON.parse(layout.value) : [265, 655]}
                navCollapsedSize={5}
                defaultCollapsed={
                  collapsed && collapsed.value === "true" ? true : false
                }
                organizations={organizations || null}
              >
                <div className="flex h-full pb-12">
                  <ScrollArea className="h-full w-full">{children}</ScrollArea>
                </div>
              </DefaultLayout>
            </main>
            <Toaster />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  )
}
