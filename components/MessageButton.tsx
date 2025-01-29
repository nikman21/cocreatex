import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MessageButtonProps {
  onClick: () => void
}

export default function MessageButton({ onClick }: MessageButtonProps) {
  return (
    <Button onClick={onClick} className="rounded-full w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90">
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Open messages</span>
    </Button>
  )
}

