import { leadsRouter } from "./routers/leads"
import { organizationRouter } from "./routers/organization"
import { settingsRouter } from "./routers/settings"
import { tasksRouter } from "./routers/tasks"
import { watchListRouter } from "./routers/watch-list"
import { createCallerFactory, createTRPCRouter } from "./trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  leads: leadsRouter,
  tasks: tasksRouter,
  watchList: watchListRouter,
  organization: organizationRouter,
  settings: settingsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
