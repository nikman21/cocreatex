'use client';
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { listenForMessages } from "@/lib/firebaseMessaging";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
}

interface MessageListProps {
  onSelectConversation: (id: string) => void;
}

export default function MessageList({ onSelectConversation }: MessageListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    listenForMessages("chatIdPlaceholder", (messages) => {
      console.log(messages);
      const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : "No messages yet";
      setConversations([
        { id: "1", name: "John Doe", lastMessage, avatar: "/avatars/john.jpg" },
      ]);
    });
  }, []);

  return (
    <div className="overflow-y-auto h-full">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
          onClick={() => onSelectConversation(conversation.id)}
        >
          <Avatar>
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback>{conversation.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{conversation.name}</p>
            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
