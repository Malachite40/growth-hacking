import { client } from "./client"

export async function ScanSubRedditNew(data: { watchedSubredditId: string }) {
  const task = client.createTask("tasks.scan_subreddit_new")
  const pending_task = task.applyAsync([data])

  const result = await pending_task.get()
  return result
}
