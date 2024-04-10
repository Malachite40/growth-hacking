import { client } from "./client"

export async function ScanSubRedditHot(data: { watchedSubredditId: string }) {
  const task = client.createTask("tasks.scan_subreddit_hot")
  const pending_task = task.applyAsync([data])

  const result = await pending_task.get()
  return result
}
