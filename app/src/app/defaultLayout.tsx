"use client"

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs"
import { Organization, User } from "@prisma/client"
import { Cctv, Inbox, LucideIcon, PlusIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import CreateOrganizationModal from "~/components/create-org-modal"
import { Nav } from "~/components/nav"
import { Avatar } from "~/components/ui/avatar"
import { buttonVariants } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable"
import { Separator } from "~/components/ui/separator"
import { TooltipProvider } from "~/components/ui/tooltip"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

export type DefaultLayoutProps = {
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
  user: User | null
  organizations: Organization[] | null
}

function DefaultLayout({
  user,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: React.PropsWithChildren<DefaultLayoutProps>) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const pathname = usePathname()
  const { signOut, openSignIn } = useClerk()
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false)
  const organizations = api.organization.fetchAll.useQuery()
  const settings = api.settings.fetch.useQuery()
  const setDefaultOrganization =
    api.settings.setDefaultOrganization.useMutation({
      onSuccess: () => {
        settings.refetch()
      },
    })
  const navLinks = [
    {
      title: "Leads",
      label: "",
      icon: Inbox,
      variant: pathname.startsWith("/leads") ? "default" : "ghost",
      href: "/leads",
    },
    {
      title: "Watchlist",
      label: "",
      icon: Cctv,
      variant: pathname.startsWith("/watch-list") ? "default" : "ghost",
      href: "/watch-list",
    },
  ]
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`
        }}
        className="h-full flex-grow items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true,
            )}`
          }}
          onExpand={() => {
            setIsCollapsed(false)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false,
            )}`
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center ",
              isCollapsed ? "h-[52px] justify-center" : "justify-start px-2",
            )}
          >
            <CreateOrganizationModal
              onClose={() => {
                setShowCreateOrgModal(false)
              }}
              open={showCreateOrgModal}
            />
            <DropdownMenu>
              {!isCollapsed ? (
                <DropdownMenuTrigger
                  className={cn(
                    "w-full",
                    buttonVariants({
                      variant: "outline",
                    }),
                  )}
                >
                  {(settings.data && settings.data.organization?.name) ||
                    "Organization"}
                </DropdownMenuTrigger>
              ) : (
                <DropdownMenuTrigger className="m-2 flex w-full items-center justify-center rounded-md bg-primary py-2 font-semibold text-background">
                  {settings.data && settings.data.organization
                    ? settings.data.organization?.name.charAt(0)
                    : "O"}
                </DropdownMenuTrigger>
              )}
              <DropdownMenuContent align="start">
                {organizations.data &&
                settings.data &&
                organizations.data.organizations.length > 0 &&
                organizations.data.organizations.filter(
                  (o) => o.id !== settings.data.organization?.id,
                ).length > 0 ? (
                  <>
                    {organizations.data.organizations
                      .filter((o) => o.id !== settings.data.organization?.id)
                      .map((org) => (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          key={org.id}
                          onClick={() => {
                            setDefaultOrganization.mutate({
                              organizationId: org.id,
                            })
                          }}
                        >
                          {org.name}
                        </DropdownMenuItem>
                      ))}
                    <DropdownMenuSeparator />
                  </>
                ) : null}

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCreateOrgModal(true)
                  }}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  <span>Organization</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={
              navLinks as {
                title: string
                href: string
                label: string
                icon: LucideIcon
                variant: "default" | "ghost"
              }[]
            }
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          className="max-w-full"
          defaultSize={defaultLayout[1]}
          minSize={30}
        >
          <div className="flex h-[52px] w-full items-center justify-between px-4 py-2">
            <div className="flex h-full items-center justify-center font-semibold">
              {navLinks.find((nl) => nl.variant === "default")?.title}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  {/* <AvatarImage
                    src={
                      user && user.profileImageUrl
                        ? user.profileImageUrl
                        : undefined
                    }
                  /> */}
                  {/* <AvatarFallback>
                    {user && user.firstName && user.lastName
                      ? `${user.firstName.charAt(0)} ${user.lastName.charAt(0)}`
                      : "NA"}
                  </AvatarFallback> */}
                  <div className="flex h-full w-full items-center justify-center rounded-full text-primary duration-200 hover:bg-primary hover:text-background">
                    {user && user.firstName && user.lastName
                      ? `${user.firstName.charAt(0)} ${user.lastName.charAt(0)}`
                      : "NA"}
                  </div>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <a href="/dashboard/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </a>
                <a href="/dashboard/organization">
                  <DropdownMenuItem className="cursor-pointer">
                    Organization
                  </DropdownMenuItem>
                </a>
                <SignedIn>
                  <div
                    onClick={() => {
                      signOut()
                    }}
                  >
                    <DropdownMenuItem className="cursor-pointer">
                      Sign out
                    </DropdownMenuItem>
                  </div>
                </SignedIn>
                <SignedOut>
                  <div
                    onClick={() => {
                      openSignIn({
                        afterSignInUrl: window.location.href,
                      })
                    }}
                    className="cursor-pointer"
                  >
                    <DropdownMenuItem>Sign in</DropdownMenuItem>
                  </div>
                </SignedOut>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator />
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
export default DefaultLayout
