"use client"

import { Button } from "~/components/ui/button"

import { AlertDialogDescription } from "@radix-ui/react-alert-dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog"

export type DoubleScanModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  setShowAgain: () => void
}

function DoubleScanModal({
  open,
  setOpen,
  setShowAgain,
}: DoubleScanModalProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          {`You're about to scan the same lead twice!`}
        </AlertDialogHeader>
        <AlertDialogDescription>
          {`We recommend you only scan a lead once every 6 hours. Are you sure you
          want to continue?`}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            {`Good call, let's not do that`}
          </AlertDialogCancel>
          <Button
            onClick={() => {
              setOpen(false)
              setShowAgain()
            }}
          >
            {`Don't stop me!`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default DoubleScanModal
