"use client"
import { MessageSquare } from "lucide-react"
import { buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

export type FavoritesPageProps = {}

function FavoritesPage({}: FavoritesPageProps) {
  const leads = api.leads.fetchAll.useQuery({
    goodLead: true,
  })

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="text-xl">Leads</div>
      <Separator className="" />

      {leads.data &&
        leads.data.leads.map((lead, key) => {
          return (
            <Card
              className={cn(
                "flex h-full w-full cursor-pointer flex-col justify-between hover:border-primary",
              )}
              key={lead.id}
            >
              <CardHeader className="flex select-none flex-row items-center justify-between gap-4 ">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md bg-primary",
                    )}
                    style={{
                      opacity: Math.floor(lead.score / 10) * 0.1,
                    }}
                  >
                    <div className="font-semibold text-background">
                      {lead.score}
                    </div>
                  </div>
                  <div className="text-lg">{lead.WatchedSubreddit.title}</div>
                </div>
                <a
                  href={lead.action}
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex gap-2 text-primary ",
                  )}
                >
                  <MessageSquare className="h-4 w-4" />
                  comment
                </a>
              </CardHeader>
              <CardContent>
                <div className="mb mb-6 select-none text-sm text-muted-foreground ">
                  {lead.reasoning}
                </div>
                <ScrollArea className="h-[160px] rounded-md border border-border px-4">
                  <div className="overflow-x-hidden py-4 text-sm ">
                    {lead.comment}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )
        })}
    </div>
  )
}
export default FavoritesPage
