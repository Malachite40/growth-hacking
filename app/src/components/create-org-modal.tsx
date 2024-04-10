"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { api } from "~/trpc/react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
export type CreateOrganizationModalProps = {
  open: boolean
  onClose: () => void
}

const formSchema = z.object({
  name: z.string().min(2),
})

function CreateOrganizationModal({
  open,
  onClose,
}: CreateOrganizationModalProps) {
  const create = api.organization.create.useMutation({
    onSuccess: () => {
      organizations.refetch()
      settings.refetch()
      onClose()
    },
  })

  const organizations = api.organization.fetchAll.useQuery()
  const settings = api.settings.fetch.useQuery()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    create.mutate(values)
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AlertDialogHeader>
              <AlertDialogTitle>New Organization.</AlertDialogTitle>
              <AlertDialogDescription>
                Create a name for your new organization.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  onClose()
                }}
              >
                Cancel
              </AlertDialogCancel>
              <Button disabled={create.isPending} type="submit">
                Submit
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default CreateOrganizationModal
