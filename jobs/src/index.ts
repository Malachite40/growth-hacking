import { createWorker } from "celery-node";
import dotenv from "dotenv";
import { ScanRedditPost } from "./scan-reddit-post";
import { ScanSubredditHot } from "./scan-subreddit-hot";
import { ScanSubredditNew } from "./scan-subreddit-new";

dotenv.config({ path: ".env" });

const worker = createWorker(process.env.BROKER, process.env.REDIS_URL);

worker.register("tasks.scan_subreddit_hot", ScanSubredditHot);
worker.register("tasks.scan_reddit_post", ScanRedditPost);
worker.register("tasks.scan_subreddit_new", ScanSubredditNew);

worker.start();
