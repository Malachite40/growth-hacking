import { createClient } from "celery-node"
import { env } from "~/env"

const globalForClient = global as unknown as { client: any }

export const client = createClient(env.BROKER, env.REDIS_URL)

if (env.NODE_ENV !== "production") globalForClient.client = client
