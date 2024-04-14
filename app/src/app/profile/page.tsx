"use client"

import { api } from "~/trpc/react"

export type ProfilePageProps = {}

function ProfilePage({}: ProfilePageProps) {
  const balanceQuery = api.balances.fetch.useQuery()
  return (
    <div className="">
      Balance:{" "}
      {`${balanceQuery.data?.balance.count} token${
        balanceQuery.data?.balance.count === 1 ? "" : "s"
      }` ?? "Loading..."}
    </div>
  )
}
export default ProfilePage
