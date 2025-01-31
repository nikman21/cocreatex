"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageList from "./MessageList";
import MessageThread from "./MessageThread";

interface MessagePanelProps {
  chatId?: string | null;
  onClose: () => void;
}

export default function MessagePanel({ chatId, onClose }: MessagePanelProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(chatId || null);

  useEffect(() => {
    if (chatId) {
      setSelectedConversation(chatId);
    }
  }, [chatId]);

  const handleClose = () => {
    setSelectedConversation(null);
    onClose();
  };

  return (
    <div className="fixed bottom-20 left-4 w-96 h-[450px] bg-white border-[5px] border-black shadow-200 rounded-[20px] flex flex-col">
      <div className="flex-between p-4 bg-secondary border-b-[5px] border-black rounded-t-[15px]">
        <h2 className="text-24-black">{selectedConversation ? "Chat" : "Messages"}</h2>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-6 w-6 text-black" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedConversation ? (
          <MessageThread
            conversationId={selectedConversation}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <MessageList onSelectConversation={setSelectedConversation} />
        )}
      </div>
    </div>
  );
}
