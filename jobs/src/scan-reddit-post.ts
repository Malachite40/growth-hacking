import { prisma } from "../lib/db/db";
import openai from "../lib/openai/openai";
import reddit from "../lib/reddit/reddit";

export async function ScanRedditPost({
  subreddit,
  products,
  title,
  postId,
}: {
  subreddit: string;
  products: string;
  title: string;
  postId: string;
}) {
  const comments = await reddit.getSubmission(postId).comments.fetchAll();

  const comments_map = comments.map((c) => ({
    comment: c.body,
    id: c.id,
  }));

  const lead_response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a bot that helps find conversations on reddit that match certain criteria. You will be given a prompt in the form of, "Looking for conversations about" followed by the search. You will then be given a list of comments from a reddit post. You will need to identify conversations that may fit the search.`,
      },
      {
        role: "user",
        content: `I've attached a list of comments from the ${title} post on the ${subreddit} subreddit. Please identify conversations that may fit the search ${products}. Here are the comments: ${JSON.stringify(
          comments_map
        )}.`,
      },
    ],
    temperature: 0,
  });

  const answer = lead_response?.choices[0]?.message.content;

  if (!answer) return console.log("no response");

  console.log(answer);

  const hot_leads = JSON.parse(answer) as {
    id: string;
    score: number;
  }[];

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
      action:
        process.env.REDDIT_BASE_URL +
        `/r/${subreddit}` +
        `/comments/${postId}/comment/${comment?.id}/?context=2`,
    };
  });

  const l = await prisma.commentLeadReddit.createMany({
    data: new_leads.map((h) => {
      return {
        redditPostId: reddit_post.id,
        action: h.action,
        commentId: h.id,
        comment: h.comment,
        score: h.score,
      };
    }),
  });

  return new_leads;
}