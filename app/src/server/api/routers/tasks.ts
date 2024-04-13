import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { ConsumeTokens } from "~/lib/balance/util"
import openai from "~/lib/openai/openai"
import { ScanSubRedditHot } from "~/tasks/scan-subreddit-hot"
import { ScanSubRedditNew } from "~/tasks/scan-subreddit-new"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const tasksRouter = createTRPCRouter({
  scanSubredditHot: protectedProcedure
    .input(z.object({ watchedSubredditId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ConsumeTokens({
        tokenBalance: ctx.tokenBalance,
        tokenCost: 1,
      })
      await ScanSubRedditHot({
        watchedSubredditId: input.watchedSubredditId,
      })
    }),
  scanSubredditNew: protectedProcedure
    .input(z.object({ watchedSubredditId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ConsumeTokens({
        tokenBalance: ctx.tokenBalance,
        tokenCost: 1,
      })
      await ScanSubRedditNew({
        watchedSubredditId: input.watchedSubredditId,
      })
    }),
  fetchSubreddit: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .query(async ({ ctx, input }) => {
      const lead_response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: `You are a subreddit recommendation bot. Your goal is to recommend a subreddit to a user. You will receive a search request, respond with a json list of strings containing names of similar subreddits. Your response should include the name of the subreddit.`,
          },
          {
            role: "user",
            content: `Can you show me subreddits that would be related to ${input.prompt}`,
          },
        ],
        temperature: 0,
      })

      const answer = lead_response?.choices[0]?.message.content

      if (!answer) return console.log("no response")

      const subreddits = JSON.parse(answer) as string[]

      // Check if subreddits is an array
      if (!Array.isArray(subreddits)) {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Response is not an array",
        })
      }

      // Check if all elements in the array are strings
      if (subreddits.some((subreddit) => typeof subreddit !== "string")) {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Response is array but not all elements are strings",
        })
      }

      return {
        subreddits,
      }
    }),
})
