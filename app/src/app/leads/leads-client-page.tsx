"use client"

import { ThumbsDown, ThumbsUp } from "lucide-react"
import { buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { useToast } from "~/components/ui/use-toast"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

export type LeadsClientPageProps = {}

function LeadsClientPage({}: LeadsClientPageProps) {
  const leads = api.leads.fetch.useQuery()
  const { toast } = useToast()
  const rate_lead = api.leads.rateLead.useMutation({
    onSuccess: () => {
      leads.refetch()
      toast({
        title: "Success",
        description: "Lead has been rated",
        variant: "default",
      })
    },
  })

  return (
    <div className="flex max-w-4xl flex-col p-10">
      <div className="text-xl font-semibold">Leads</div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-4">
        {leads.data &&
          leads.data.leads.map((lead) => {
            return (
              <Card
                className="relative cursor-pointer hover:border-primary"
                key={lead.id}
              >
                <CardHeader>{lead.RedditPost.title}</CardHeader>
                <CardContent>
                  <a
                    href={lead.action}
                    className="text-sm opacity-60 hover:underline hover:underline-offset-1"
                    target="_blank"
                  >
                    {lead.comment}
                  </a>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full justify-end gap-2">
                    <div
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "hover:bg-secondary",
                      )}
                    >
                      <ThumbsDown
                        onClick={() => {
                          rate_lead.mutate({
                            leadId: lead.id,
                            goodLead: false,
                          })
                        }}
                        className="h-4 w-4"
                      />
                    </div>
                    <div
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "hover:bg-secondary",
                      )}
                    >
                      <ThumbsUp
                        onClick={() => {
                          rate_lead.mutate({
                            leadId: lead.id,
                            goodLead: true,
                          })
                        }}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </CardFooter>
                <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <div className="font-semibold text-background">
                    {lead.score}
                  </div>
                </div>
              </Card>
            )
          })}
      </div>
    </div>
  )
}
export default LeadsClientPage
