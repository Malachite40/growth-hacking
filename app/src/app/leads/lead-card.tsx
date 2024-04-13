"use client"

import { CommentLeadReddit, RedditPost, WatchedSubreddit } from "@prisma/client"
import { motion, useAnimate } from "framer-motion"
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import { useEffect, useState } from "react"
import { buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { ScrollArea } from "~/components/ui/scroll-area"
import { cn } from "~/lib/utils"

export type LeadsClientPageProps = {
  subreddit: WatchedSubreddit
  redditPost: RedditPost
  lead: CommentLeadReddit
  position: number
  parentRef: React.RefObject<HTMLDivElement>
  onClickThumbUp: () => void
  onClickThumbDown: () => void
}

function LeadCard({
  subreddit,
  redditPost,
  lead,
  position,
  parentRef,
  onClickThumbUp,
  onClickThumbDown,
}: LeadsClientPageProps) {
  const [scope, animate] = useAnimate()
  const [state, setState] = useState<"dislike" | "liked" | "stack">("stack")

  const variants = {
    dislike: {
      opacity: [1, 0],
      scale: [1, 1.05],
      y: [0, -15],
      transition: {
        duration: 0.5,
        times: [0, 1],
        ease: ["easeInOut"],
      },
    },
    liked: {
      opacity: [1, 0],
      scale: [1, 1.5],
      y: [0, -140],
      transition: {
        duration: 1,
        ease: ["easeOut"],
        times: [0, 1],
      },
      transitionEnd: {
        opacity: 0,
      },
    },
    stack: {
      opacity: [position < 10 ? 1 : 0],
      y: [position * 15],
      scale: [1 - position * 0.04],
      top: [parentRef.current?.getBoundingClientRect().top],
      left: [parentRef.current?.getBoundingClientRect().left],
      height: [parentRef.current?.getBoundingClientRect().height],
      transition: {
        duration: 0.5,
      },
    },
  }

  useEffect(() => {
    if (position < 0) return
    setState("stack")
    animate(scope.current, {
      y: position * 15,
      opacity: position < 1 ? 1 : position > 10 ? 0 : 1,
      scale: 1 - position * 0.04,
      top: parentRef.current?.getBoundingClientRect().top,
      left: parentRef.current?.getBoundingClientRect().left,
      height: parentRef.current?.getBoundingClientRect().height,
      transition: {
        duration: 0.5,
      },
    })
  }, [position])

  return (
    <motion.div
      ref={scope}
      variants={variants}
      style={{
        position: "absolute",
        zIndex: 200 - position,
      }}
      initial={{
        opacity: 0,
      }}
      animate={state}
      className={cn(
        "h-full w-full bg-background",
        position < 0 && "pointer-events-none ",
      )}
    >
      <Card
        className={cn(
          "flex h-full w-full cursor-pointer flex-col justify-between hover:border-primary",
          position < 0 && "border-primary",
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
              <div className="font-semibold text-background">{lead.score}</div>
            </div>
            <div className="text-lg">{subreddit.title}</div>
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
        <CardFooter className="">
          <div className="flex h-full w-full items-end justify-center gap-2">
            <div
              onClick={() => {
                setState("dislike")
                onClickThumbDown()
              }}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hover:bg-secondary",
              )}
            >
              <ThumbsDown className="h-4 w-4 text-primary" />
            </div>
            <div
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hover:bg-secondary",
              )}
              onClick={() => {
                setState("liked")
                onClickThumbUp()
              }}
            >
              <ThumbsUp className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
export default LeadCard
