"use client"

import { ScanSearch } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Card } from "~/components/ui/card"
import { api } from "~/trpc/react"
import LeadCard from "./lead-card"

export type LeadsClientPageProps = {}

function LeadsClientPage({}: LeadsClientPageProps) {
  const leads = api.leads.fetchAll.useQuery({ rating: 80 })
  const [offset, setOffset] = useState<number>(0)
  const ref = useRef(null)
  const undoRatingMutation = api.leads.undoRating.useMutation({
    onSuccess: () => {
      leads.refetch()
      toast("Undo Success", {
        description: "You can rate it again now!",
      })
    },
  })
  const rateLeadMutation = api.leads.rateLead.useMutation({
    onSuccess: (data) => {
      toast("Success", {
        description: "Lead has been rated",
        action: {
          label: "Undo",
          onClick: () => {
            undoRatingMutation.mutate({
              leadId: data.lead.id,
            })
          },
        },
      })
    },
  })

  useEffect(() => {
    setOffset(0)
  }, [leads.data])

  return (
    <div className="flex h-full flex-col p-10">
      <div className="flex min-h-[calc(100vh-300px)] flex-grow items-center justify-center">
        <div className="relative flex max-h-[500px] min-h-[500px] min-w-[650px] max-w-[650px] flex-col gap-4">
          {leads.data &&
            leads.data.leads.map((lead, key) => {
              return (
                <LeadCard
                  parentRef={ref}
                  position={key + offset}
                  lead={lead}
                  key={lead.id}
                  redditPost={lead.RedditPost}
                  subreddit={lead.WatchedSubreddit}
                  onClickThumbDown={() => {
                    setOffset(offset - 1)
                    rateLeadMutation.mutate({
                      leadId: lead.id,
                      goodLead: false,
                    })
                  }}
                  onClickThumbUp={() => {
                    setOffset(offset - 1)
                    rateLeadMutation.mutate({
                      leadId: lead.id,
                      goodLead: true,
                    })
                  }}
                />
              )
            })}

          {leads.data &&
            (leads.data.leads.length < 1 ||
              offset - leads.data.leads.length <= 0) && (
              <Card className="flex h-full w-full flex-grow cursor-pointer flex-col items-center justify-center gap-4 border-primary p-4">
                <div className="text-primary">{`Looks like you've reached the end of the leads.`}</div>
                <ScanSearch
                  strokeWidth={0.7}
                  className="h-12 w-12 text-primary"
                />
                <div className="w-96 text-center text-sm text-muted-foreground">
                  Start a search from your{" "}
                  <a
                    href="/watch-list"
                    className="text-sm text-primary hover:underline hover:underline-offset-1"
                  >
                    watch list
                  </a>{" "}
                  {`to find more leads. Or view your favorite'd leads`}{" "}
                  <a
                    href="/favorites"
                    className="text-sm text-primary hover:underline hover:underline-offset-1"
                  >
                    here
                  </a>
                  .
                </div>
              </Card>
            )}
        </div>
      </div>
    </div>
  )
}
export default LeadsClientPage
