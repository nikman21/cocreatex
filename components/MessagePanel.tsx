import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import MessageList from "./MessageList"
import MessageThread from "./MessageThread"

interface MessagePanelProps {
  onClose: () => void
}

export default function MessagePanel({ onClose }: MessagePanelProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  return (
    <div className="fixed bottom-20 left-4 w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col">
      <div className="flex justify-between items-center p-3 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        {selectedConversation ? (
          <MessageThread conversationId={selectedConversation} onBack={() => setSelectedConversation(null)} />
        ) : (
          <MessageList onSelectConversation={setSelectedConversation} />
        )}
      </div>
    </div>
  )
}

