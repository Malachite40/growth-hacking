import { Button } from "./button"

export type BasicToastProps = {
  title: string
  description: string | React.ReactElement
  button?: {
    label: string
    onClick?: () => void
  }
}

function BasicToast({ title, description, button }: BasicToastProps) {
  return (
    <>
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span>{title}</span>
          <div className="text-muted-foreground">{description}</div>
        </div>
        {button && (
          <div>
            <Button size={"sm"} onClick={button.onClick}>
              {button.label}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
export default BasicToast
