"use client"
import { MessageSquare } from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"
import { useEffect } from "react"
import { buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import Paginate from "~/components/ui/paginate"
import { ScrollArea } from "~/components/ui/scroll-area"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

export type FavoritesPageProps = {}

const LIMIT = 5
function FavoritesPage({}: FavoritesPageProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const leadsQuery = api.leads.fetchAll.useInfiniteQuery(
    {
      goodLead: true,
      limit: LIMIT,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor
      },
    },
  )

  const settingsQuery = api.settings.fetch.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!settingsQuery.data) return
    leadsQuery.refetch()
  }, [settingsQuery.data])
  return (
    <div className="p-10">
      <div className="text-xl">Leads</div>
      <div className="my-4 flex w-full" />

      <div className="flex flex-col gap-4">
        {leadsQuery.data &&
          leadsQuery.data.pages[page - 1] &&
          leadsQuery.data.pages[page - 1]?.leads.map((lead, key) => {
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

      <Paginate
        defaultLimit={LIMIT}
        hasNextPage={leadsQuery.hasNextPage ?? false}
        fetchNextPage={leadsQuery.fetchNextPage}
        totalCount={
          leadsQuery.data &&
          leadsQuery.data.pages[0] &&
          leadsQuery.data.pages.length > 0
            ? leadsQuery.data.pages[0].totalCount
            : 0
        }
        pageLength={leadsQuery.data ? leadsQuery.data.pages.length : 0}
        pages={leadsQuery.data ? leadsQuery.data.pages : []}
        data={leadsQuery.data}
      />
    </div>
  )
}
export default FavoritesPage
