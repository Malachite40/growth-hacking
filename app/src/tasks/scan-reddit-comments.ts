import { client } from "./client"

export async function ScanRedditPost(data: {
  threadId: string
  subreddit: string
  products: string
}) {
  const task = client.createTask("tasks.scan_reddit_post")
  const pending_task = task.applyAsync([data])

  const result = await pending_task.get()
  return result
}
