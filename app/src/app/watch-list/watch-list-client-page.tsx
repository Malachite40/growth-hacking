"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Ellipsis,
  Flame,
  LoaderCircle,
  Pencil,
  PlayCircle,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button, buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Input } from "~/components/ui/input"

import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Badge } from "~/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Separator } from "~/components/ui/separator"
import { Textarea } from "~/components/ui/textarea"
import { useToast } from "~/components/ui/use-toast"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
export type WatchListClientPageProps = {}

const formSchema = z.object({
  watchedSubredditId: z.string().uuid().optional(),
  subreddits: z.array(z.object({ value: z.string().min(2) })),
  topic: z.string().min(2),
  title: z.string().min(2),
})

function WatchListClientPage({}: WatchListClientPageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [subredditSuggestions, setSubredditSuggestions] = useState<string[]>([])
  const [prompt, setPrompt] = useState("")
  const settings = api.settings.fetch.useQuery()
  const subredditWatchListItems = api.watchList.fetch.useQuery()
  const { toast } = useToast()

  const scanSubredditHot = api.tasks.scanSubredditHot.useMutation()
  const scanSubredditNew = api.tasks.scanSubredditNew.useMutation()
  const deleteSubredditWatchListItem =
    api.watchList.deleteWatchedSubreddit.useMutation({
      onSuccess: () => {
        subredditWatchListItems.refetch()
      },
    })

  const editSubredditWatchListItem =
    api.watchList.editWatchedSubreddit.useMutation({
      onSuccess: () => {
        subredditWatchListItems.refetch()
        setIsOpen(false)
      },
    })
  const createSubredditWatchListItem =
    api.watchList.createWatchedSubreddit.useMutation({
      onSuccess: () => {
        setIsOpen(false)
        subredditWatchListItems.refetch()
      },
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      watchedSubredditId: undefined,
      subreddits: [
        {
          value: "",
        },
      ],
      topic: "",
      title: "",
    },
    reValidateMode: "onChange",
  })

  const similarSubredditQuery = api.tasks.fetchSubreddit.useQuery(
    { prompt },
    { enabled: searchEnabled },
  )

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.watchedSubredditId) {
      editSubredditWatchListItem.mutate({
        watchedSubredditId: values.watchedSubredditId,
        subreddits: values.subreddits,
        topic: values.topic,
        title: values.title,
      })
      return
    }
    createSubredditWatchListItem.mutate(values)
  }

  useEffect(() => {
    if (!settings.data) return
    subredditWatchListItems.refetch()
  }, [settings.data])

  useEffect(() => {
    if (!similarSubredditQuery.data) return
    setSearchEnabled(false)
  }, [similarSubredditQuery.data])

  const { fields, append } = useFieldArray({
    name: "subreddits",
    control: form.control,
  })

  useEffect(() => {
    if (!similarSubredditQuery.data) return
    setSubredditSuggestions([...similarSubredditQuery.data.subreddits])
  }, [similarSubredditQuery.data])

  return (
    <div className="max-w-4xl p-10">
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
          )}
          onClick={() => {
            form.reset({
              watchedSubredditId: undefined,
              subreddits: [
                {
                  value: "",
                },
              ],
              topic: "",
            })
            setSubredditSuggestions([])
            setPrompt("")
            setIsOpen(true)
          }}
        >
          + Watch List Item
        </AlertDialogTrigger>
        <AlertDialogContent className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <AlertDialogHeader className="mb-8 space-y-6">
                <AlertDialogTitle>
                  Create a new watch list item.
                </AlertDialogTitle>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Keycaps Search" {...field} />
                      </FormControl>
                      <FormDescription>
                        A label to identify this watch list item.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Looking for conversations about:</FormLabel>
                      <FormControl>
                        <Textarea
                          onChangeCapture={(value) => {
                            setPrompt(value.currentTarget.value)
                          }}
                          placeholder="people who might be interested in purchasing custom keycaps for their mechanical keyboard."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mb-4">
                  {fields.map((field, index) => (
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`subreddits.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(index !== 0 && "sr-only")}>
                            Subreddits
                          </FormLabel>
                          <FormDescription
                            className={cn(index !== 0 && "sr-only")}
                          >
                            The subreddits you want to search.
                          </FormDescription>
                          <FormControl>
                            <div className="group relative">
                              <Input {...field} />
                              <div
                                onClick={() => {
                                  form.setValue(
                                    "subreddits",
                                    form.getValues("subreddits").filter((v) => {
                                      return v.value !== field.value
                                    }),
                                  )
                                }}
                                className={cn(
                                  buttonVariants({
                                    variant: "link",
                                    size: "sm",
                                  }),
                                  "absolute right-[2px] top-1/2 -translate-y-1/2 cursor-pointer text-background duration-200 ease-in-out group-hover:text-primary",
                                )}
                              >
                                <Trash2 className="h-4 w-4"></Trash2>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ value: "" })}
                  >
                    + Subreddit
                  </Button>
                </div>

                {subredditSuggestions.length > 1 ? (
                  <div className="mb-10 mt-10 flex flex-col">
                    <div className="my-4">Similar Subreddits</div>

                    <div className="flex flex-wrap gap-2">
                      {subredditSuggestions.map((subreddit) => {
                        subreddit = subreddit.replace("/r/", "")
                        subreddit = subreddit.replace("r/", "")
                        return (
                          <Button
                            variant={
                              form
                                .getValues("subreddits")
                                .find((v) => v.value === subreddit)
                                ? "default"
                                : "outline"
                            }
                            key={subreddit}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const values = form
                                .getValues("subreddits")
                                .filter((v) => v.value !== "")

                              if (values.find((v) => v.value === subreddit)) {
                                const newValues = values.filter(
                                  (v) => v.value !== subreddit,
                                )
                                form.setValue("subreddits", newValues)
                              } else {
                                form.setValue("subreddits", [
                                  ...values,
                                  { value: subreddit },
                                ])
                              }
                            }}
                          >
                            {subreddit}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    {similarSubredditQuery.isFetching ? (
                      <div className="flex h-40 w-full items-center justify-center">
                        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (prompt.length < 2) {
                      toast({
                        title: "Prompt is too short",
                        description: "Please enter a longer prompt.",
                        variant: "default",
                      })
                      return
                    }
                    setSearchEnabled(!searchEnabled)
                  }}
                  variant={"link"}
                >
                  {searchEnabled ? "Cancel search" : "Search subreddits"}
                </Button>
                <AlertDialogCancel
                  onClick={() => {
                    setIsOpen(false)
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  disabled={createSubredditWatchListItem.isPending}
                  type="submit"
                >
                  Submit
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      <Separator className="my-4" />

      <div className="flex flex-col gap-4">
        {subredditWatchListItems.data &&
          subredditWatchListItems.data.watchedSubreddit.map((item) => {
            return (
              <Card
                key={item.id}
                className={`relative duration-500 ${scanSubredditHot.isPending ? "border-primary" : ""}`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                      }),
                      "absolute right-2 top-2",
                    )}
                  >
                    <Ellipsis className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        scanSubredditHot.mutate({
                          watchedSubredditId: item.id,
                        })
                      }}
                      className="cursor-pointer"
                    >
                      <Flame className="mr-2 h-4 w-4" />
                      <span>Scan (hot)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        scanSubredditNew.mutate({
                          watchedSubredditId: item.id,
                        })
                      }}
                      className="cursor-pointer"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      <span>Scan (new)</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        form.reset({
                          watchedSubredditId: item.id,
                          subreddits: item.subreddits.map((subreddit) => {
                            return { value: subreddit.name }
                          }),
                          topic: item.searchConversation.topic,
                          title: item.title,
                        })
                        setPrompt(item.searchConversation.topic)
                        setIsOpen(true)
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () => {
                        deleteSubredditWatchListItem.mutate({
                          watchedSubredditId: item.id,
                          searchConversationId: item.searchConversation.id,
                        })
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="text-lg">{item.title}</div>
                    {item.lastScanAt && (
                      <div className="text-sm text-muted-foreground">
                        Last Scanned:{" "}
                        {format(item.lastScanAt, "MMMM do - hh:mma")}
                      </div>
                    )}
                  </div>
                  <div className="cursor-pointer text-sm text-muted-foreground hover:underline hover:underline-offset-1">
                    {item.searchConversation.topic}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.subreddits.map((subreddit) => {
                      // TODO:: fix div inside p tag issue
                      return (
                        <Badge variant={"secondary"} key={subreddit.name}>
                          {subreddit.name}
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>
    </div>
  )
}
export default WatchListClientPage
