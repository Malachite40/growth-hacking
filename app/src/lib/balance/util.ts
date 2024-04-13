"use server"

import { UserTokenBalance } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { db } from "~/server/db"

export async function ConsumeTokens({
  tokenBalance,
  tokenCost,
}: {
  tokenBalance: UserTokenBalance
  tokenCost: number
}) {
  if (tokenBalance.count < tokenCost)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Insufficient balance",
    })
  await db.userTokenBalance.update({
    where: { id: tokenBalance.id },
    data: { count: { decrement: tokenCost } },
  })
}
