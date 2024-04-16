import { ScanStatus } from "@prisma/client";
import { prisma } from "../lib/db/db";
import openai from "../lib/openai/openai";
import reddit from "../lib/reddit/reddit";

export async function ScanRedditPost({
  subreddit,
  topic,
  title,
  postId,
  watchedSubredditId,
  subredditScanRecordId,
}: {
  subreddit: string;
  topic: string;
  title: string;
  postId: string;
  watchedSubredditId: string;
  subredditScanRecordId: string;
}) {
  if (!subredditScanRecordId) return console.log("no subredditScanRecordId");

  const comments = await reddit.getSubmission(postId).comments.fetchAll();

  const comments_map = comments.map((c) => ({
    comment: c.body,
    id: c.id,
  }));

  const lead_response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `You are a bot that helps find conversations on reddit that match certain criteria. You will be given a prompt in the form of, "Looking for conversations about" followed by the search. You will then be given a list of comments from a reddit post. You will need to identify conversations that may fit the search. Respond in with a JSON array of objects with the following keys: id, score, reason. The id is the comment id and the score is a whole number between 0 and 100 representing how well the comment fits the search. Score 100 means the comment is a perfect match. Score 0 means the comment is not relevant. Score 80 means the comment is somewhat relevant. Be strict with your scoring. The reason is a string explaining why the comment fits the search. Only give a reason if the score is above 80.`,
      },
      {
        role: "user",
        content: `I've attached a list of comments from the ${title} post on the ${subreddit} subreddit. Please identify conversations that may fit the search ${topic}. Here are the comments: ${JSON.stringify(
          comments_map
        )}.`,
      },
    ],
    temperature: 0,
  });

  const answer = lead_response?.choices[0]?.message.content;

  if (!answer) return console.log("no response");

  let hot_leads: {
    id: string;
    score: number;
    reason: string;
  }[] = [];

  try {
    hot_leads = JSON.parse(answer) as {
      id: string;
      score: number;
      reason: string;
    }[];
  } catch {
    const subredditScanRecord = await prisma.subredditScanRecord.update({
      where: { id: subredditScanRecordId },
      data: {
        scanStatus: ScanStatus.ERROR,
        totalErrors: {
          increment: 1,
        },
      },
    });
    return `Error parsing response for ${subreddit} post ${postId} \n\n ${answer}`;
  }

  const reddit_post = await prisma.redditPost.create({
    data: {
      title: title,
      postId: postId,
    },
  });

  const new_leads = hot_leads.map((h) => {
    const comment = comments.find((c) => c.id === h.id);
    return {
      id: h.id,
      comment: comment.body,
      score: h.score,
      reason: h.reason,
      action:
        process.env.REDDIT_BASE_URL +
        `/r/${subreddit}` +
        `/comments/${postId}/comment/${comment?.id}/?context=2`,
    };
  });

  const l = await prisma.commentLeadReddit.createMany({
    data: new_leads.map((h) => {
      return {
        watchedSubredditId: watchedSubredditId,
        redditPostId: reddit_post.id,
        action: h.action,
        commentId: h.id,
        comment: h.comment,
        score: h.score,
        reasoning: h.reason,
      };
    }),
  });

  const leadsRatedAbove80 = new_leads.filter((h) => h.score > 80).length;

  const subredditScanRecord = await prisma.subredditScanRecord.update({
    where: { id: subredditScanRecordId },
    data: {
      scanStatus: ScanStatus.PENDING,
      potentialLeads: {
        increment: leadsRatedAbove80,
      },
      totalPostsScanned: {
        increment: 1,
      },
    },
  });

  if (
    subredditScanRecord.totalPostsToScan <=
    subredditScanRecord.totalPostsScanned
  ) {
    await prisma.subredditScanRecord.update({
      where: { id: subredditScanRecordId },
      data: {
        scanStatus: ScanStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }

  return `Created ${l.count} leads for ${subreddit} post ${postId}`;
}
