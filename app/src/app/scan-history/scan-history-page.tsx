"use client"

import {
  ScanStatus,
  SubredditScanRecord,
  WatchedSubreddit,
} from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { parseAsInteger, useQueryState } from "nuqs"
import { useEffect } from "react"
import { DataTable } from "~/components/ui/data-table"
import Paginate from "~/components/ui/paginate"
import { api } from "~/trpc/react"

export type ScanHistoryClientPageProps = {}

const LIMIT = 10

function ScanHistoryClientPage({}: ScanHistoryClientPageProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const settingsQuery = api.settings.fetch.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  const scanRecords = api.scanRecords.fetchAll.useInfiniteQuery(
    {
      limit: LIMIT,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor
      },
      refetchInterval: 1000 * 10,
    },
  )

  const columns: ColumnDef<{
    subredditScanRecord: SubredditScanRecord
    watchedSubreddit: WatchedSubreddit
  }>[] = [
    {
      id: "title",
      header: "Scan",
      accessorFn: (row) => row.watchedSubreddit.title,
      cell: ({ row }) => <div className="">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "totalPostsScanned",
      header: "Scanned",
      accessorFn: (row) => row.subredditScanRecord.totalPostsScanned,
      cell: ({ row }) => <div>{row.getValue("totalPostsScanned")}</div>,
    },
    {
      accessorKey: "potentialLeads",
      header: "Leads",
      accessorFn: (row) => row.subredditScanRecord.potentialLeads,
      cell: ({ row }) => <div>{row.getValue("potentialLeads")}</div>,
    },
    {
      accessorKey: "startedAt",
      header: "Start",
      accessorFn: (row) => row.subredditScanRecord.createdAt,
      cell: ({ row }) => {
        const startedAt = new Date(row.getValue("startedAt"))
        return <div>{format(startedAt, "h:mma")}</div>
      },
    },
    {
      accessorKey: "completedAt",
      header: "End",
      accessorFn: (row) => row.subredditScanRecord.completedAt,
      cell: ({ row }) => {
        const completedAtDate = row.getValue("completedAt")
        if (!completedAtDate) return <div className="text-muted">--------</div>
        const completedAt = new Date(row.getValue("completedAt"))
        return <div>{format(completedAt, "h:mma")}</div>
      },
    },
    {
      accessorKey: "scanStatus",
      header: "Status",
      accessorFn: (row) => ({
        scanStatus: row.subredditScanRecord.scanStatus,
        errors: row.subredditScanRecord.totalErrors,
      }),
      cell: ({ row }) => {
        const { errors, scanStatus } = row.getValue("scanStatus") as {
          scanStatus: string
          errors: number
        }

        switch (scanStatus) {
          case ScanStatus.COMPLETED:
            return <div className="text-primary">Completed</div>
          case ScanStatus.PENDING:
            return <div className="text-accent">Pending</div>
          case ScanStatus.ERROR:
            return <div className="text-destructive">Failed</div>
          default:
            return (
              <div className="capitalize">
                {(row.getValue("scanStatus") as string).toLowerCase()}
              </div>
            )
        }
      },
    },
  ]

  useEffect(() => {
    if (!settingsQuery.data) return
    scanRecords.refetch()
  }, [settingsQuery.data])

  return (
    <div className="p-10">
      <div className="text-xl">Scan History</div>
      <div className="my-4 flex w-full" />

      <DataTable
        columns={columns}
        data={
          scanRecords.data?.pages[page - 1]?.scanRecords.map((p) => ({
            watchedSubreddit: p.watchedSubreddit,
            subredditScanRecord: p,
          })) || []
        }
      />

      <Paginate
        defaultLimit={LIMIT}
        hasNextPage={scanRecords.hasNextPage ?? false}
        fetchNextPage={scanRecords.fetchNextPage}
        totalCount={
          scanRecords.data &&
          scanRecords.data.pages[0] &&
          scanRecords.data.pages.length > 0
            ? scanRecords.data.pages[0].totalCount
            : 0
        }
        pageLength={scanRecords.data ? scanRecords.data.pages.length : 0}
        pages={scanRecords.data ? scanRecords.data.pages : []}
        data={scanRecords.data}
      />
    </div>
  )
}
export default ScanHistoryClientPage
