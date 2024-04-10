import { prisma } from "../lib/db/db";
import reddit from "../lib/reddit/reddit";
import { client } from "../lib/tasks/client";

export async function ScanSubredditHot({
  watchedSubredditId,
}: {
  watchedSubredditId: string;
}) {
  const watchedSubreddit = await prisma.watchedSubreddit.findUnique({
    where: { id: watchedSubredditId },
    include: {
      productList: true,
      subreddits: true,
    },
  });
  if (!watchedSubreddit) return console.log("no subreddit");

  if (!watchedSubreddit.subreddits.length) return console.log("no subreddits");

  watchedSubreddit.subreddits.forEach(async (subreddit) => {
    const posts = await reddit.getSubreddit(subreddit.name).getHot({
      limit: 1,
    });

    posts.forEach((post) => {
      const task = client.createTask("tasks.scan_reddit_post");
      const pending_task = task.applyAsync([
        {
          subreddit: subreddit.name,
          products: watchedSubreddit.productList.products,
          title: post.title,
          postId: post.id,
        },
      ]);
    });
  });

  // const post_map = posts.map((post) => {
  //   return {
  //     id: post.id,
  //     title: post.title,
  //     likes: post.ups,
  //     flair: post.link_flair_text,
  //   };
  // });

  // const surface_scan_response = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: [
  //     {
  //       role: "system",
  //       content: `You are a marketing lead generation bot. Your goal is to identify posts that are likely to contain comments we can reply to and convince people too go to our website to see our products. Our products include ${watchedSubreddit.productList.products}. You will receive a list of posts, respond with a json list that includes the id and a score for each post and nothing else. The score should be a number 0-100 that represents the likelihood of the post being a place where this conversation can take place.`,
  //     },
  //     {
  //       role: "user",
  //       content: `I've attached a list of trending posts from the ${
  //         watchedSubreddit.subreddit
  //       } subreddit. Please identify the hot leads. Here are the posts: ${JSON.stringify(
  //         post_map
  //       )}.`,
  //     },
  //   ],
  //   temperature: 0,
  // });

  // const answer = surface_scan_response?.choices?.[0]?.message?.content;

  // if (!answer) return console.log("no response");

  // const hot_leads = JSON.parse(answer) as {
  //   id: string;
  //   score: number;
  // }[];

  // const leads = hot_leads.map((h) => {
  //   const post = posts.find((p) => p.id === h.id);
  //   return {
  //     id: h.id,
  //     title: post?.title,
  //     flair: post?.link_flair_text,
  //     score: h.score,
  //     action: (process.env.REDDIT_BASE_URL as string) + post?.permalink,
  //   };
  // });

  // const new_leads = await prisma.potentialThreadReddit.createMany({
  //   data: leads.map((h) => {
  //     return {
  //       watchedSubredditId: watchedSubredditId,
  //       action: h.action,
  //       postId: h.id,
  //       title: h.title || "No title.",
  //       score: h.score,
  //     };
  //   }),
  // });
}
