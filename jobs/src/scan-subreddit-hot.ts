import { ScanStatus } from "@prisma/client";
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
      searchConversation: true,
      subreddits: true,
    },
  });
  if (!watchedSubreddit) return console.log("no subreddit");

  if (!watchedSubreddit.subreddits.length) return console.log("no subreddits");

  watchedSubreddit.subreddits.forEach(async (subreddit) => {
    const posts = await reddit.getSubreddit(subreddit.name).getHot({
      limit: 5,
    });

    console.log(
      `Scanning ${posts.length} hot posts for subreddit ${watchedSubreddit.title}`
    );

    const subredditScanRecord = await prisma.subredditScanRecord.create({
      data: {
        watchedSubredditId: watchedSubreddit.id,
        scanStatus: ScanStatus.PENDING,
        totalPostsScanned: 0,
        totalPostsToScan: posts.length,
      },
    });

    posts.forEach((post) => {
      const task = client.createTask("tasks.scan_reddit_post");
      const pending_task = task.applyAsync([
        {
          subreddit: subreddit.name,
          watchedSubredditId: watchedSubreddit.id,
          topic: watchedSubreddit.searchConversation.topic,
          title: post.title,
          postId: post.id,
          subredditScanRecordId: subredditScanRecord.id,
        },
      ]);
    });
  });
}
