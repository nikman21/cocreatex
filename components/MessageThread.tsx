"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listenForMessages, sendMessage } from "@/lib/firebaseMessaging";
import { useSession } from "next-auth/react";


interface Message {
  id: string;
  senderEmail: string;
  content: string;
  timestamp: number;
  senderName?: string;
  senderProfilePicture?: string;
}

interface MessageThreadProps {
  conversationId: string;
  onBack: () => void;
}

export default function MessageThread({ conversationId, onBack }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    listenForMessages(conversationId, async (messagesData) => {
      const enrichedMessages = await Promise.all(
        messagesData.map(async (msg) => {
          const response = await fetch(`/api/getUserByEmail?email=${msg.senderEmail}`);
          const user = await response.json();

          return {
            ...msg,
            senderName: user?.name || "Unknown",
            senderProfilePicture: user?.image || "",
          };
        })
      );
      setMessages(enrichedMessages);
    });
  }, [conversationId]);

  const handleSend = async () => {
    if (!newMessage || !session?.user?.email) return;
    await sendMessage(conversationId, session.user.email, newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-3 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar>
          <AvatarImage src="/avatars/john.jpg" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <span className="font-medium">John Doe</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.senderEmail === session?.user?.email ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] rounded-lg p-2 ${message.senderEmail === session?.user?.email ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1" />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
