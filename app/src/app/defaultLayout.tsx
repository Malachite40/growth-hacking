"use client"

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs"
import { Organization, User } from "@prisma/client"
import {
  Building2,
  Cctv,
  Clock3,
  Inbox,
  LucideIcon,
  PlusIcon,
  ThumbsUp,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import CreateOrganizationModal from "~/components/create-org-modal"
import { Nav } from "~/components/nav"
import { buttonVariants } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
  const unseenCountQuery = api.leads.fetchUnseenCount.useQuery(
    {},
    {
      refetchInterval: 1000 * 10,
    },
  )
  const navLinks = [
    {
      title: "Leads",
      label: unseenCountQuery.data ? unseenCountQuery.data.count : "",
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
    {
      title: "Favorites",
      label: "",
      icon: ThumbsUp,
      variant: pathname.startsWith("/favorites") ? "default" : "ghost",
      href: "/favorites",
    },
    {
      title: "Scan History",
      label: "",
      icon: Clock3,
      variant: pathname.startsWith("/scan-history") ? "default" : "ghost",
      href: "/scan-history",
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
            isCollapsed
              ? "flex min-w-[50px] max-w-[50px] flex-col transition-all duration-300 ease-in-out"
              : "max-w-[200px]",
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center ",
              isCollapsed ? "h-[52px] justify-center" : "justify-start",
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
                    buttonVariants({
                      variant: "ghost",
                    }),
                    "flex h-full w-full rounded-none",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div className="">
                      {settings.data
                        ? settings.data.organization?.name
                        : "Organization"}
                    </div>
                  </div>
                </DropdownMenuTrigger>
              ) : (
                <DropdownMenuTrigger
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-full w-full rounded-none",
                  )}
                >
                  <Building2 className="h-4 w-4" />
                </DropdownMenuTrigger>
              )}
              <DropdownMenuContent align="start">
                {organizations.data &&
                settings.data &&
                organizations.data.organizations.length > 0 ? (
                  <>
                    {organizations.data.organizations.map((org) => (
                      <DropdownMenuCheckboxItem
                        className="cursor-pointer"
                        checked={settings.data.organization?.id === org.id}
                        key={org.id}
                        onClick={() => {
                          setDefaultOrganization.mutate({
                            organizationId: org.id,
                          })
                        }}
                      >
                        {org.name}
                      </DropdownMenuCheckboxItem>
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
            <div className="flex h-full items-center justify-center font-semibold"></div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className={buttonVariants({ variant: "ghost" })}>
                  <div className="flex h-full w-full items-center justify-center rounded-full  ">
                    {user && user.firstName && user.lastName
                      ? `${user.firstName.charAt(0)} ${user.lastName.charAt(0)}`
                      : "NA"}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <a href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
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
