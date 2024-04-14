import { parseAsInteger, useQueryState } from "nuqs"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"

export type PaginateProps = {
  defaultLimit?: number
  pageQueryKey?: string
  limitQueryKey?: string
  hasNextPage: boolean
  fetchNextPage: () => void
  totalCount: number
  pageLength: number
  pages: any[]
  data: any | undefined
}

function Paginate({
  pageQueryKey = "page",
  limitQueryKey = "limit",
  hasNextPage,
  fetchNextPage,
  totalCount,
  pageLength,
  pages,
  data,
  defaultLimit = 10,
}: PaginateProps) {
  const [page, setPage] = useQueryState(
    pageQueryKey,
    parseAsInteger.withDefault(1),
  )
  const [limit, setLimit] = useQueryState(
    limitQueryKey,
    parseAsInteger.withDefault(defaultLimit),
  )

  return (
    <>
      <div
        className={`flex items-center justify-center space-x-2 py-4 ${
          !hasNextPage && page === 0 ? "hidden" : ""
        }`}
      >
        {totalCount > 0 && Math.ceil(totalCount / limit) > 1 && data ? (
          <Pagination>
            <PaginationContent>
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious
                  onClick={() => {
                    if (page < 2) return
                    setPage(page - 1)
                  }}
                />
              </PaginationItem>
              {Array.from({
                length: pageLength,
              }).map((_, i) => {
                return (
                  <PaginationItem
                    className="cursor-pointer"
                    key={i}
                    onClick={() => {
                      if (!pages[page]) {
                        fetchNextPage()
                      }
                      setPage(i + 1)
                    }}
                  >
                    <PaginationLink isActive={page === i + 1}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              {Math.ceil(totalCount / limit) > pageLength ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              <PaginationItem className="cursor-pointer">
                <PaginationNext
                  onClick={() => {
                    if (page * limit >= totalCount) return
                    fetchNextPage()
                    setPage(page + 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </>
  )
}
export default Paginate
