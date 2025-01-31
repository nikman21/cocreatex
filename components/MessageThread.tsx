"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listenForMessages, markMessagesAsRead, sendMessage } from "@/lib/firebaseMessaging";
import { useSession } from "next-auth/react";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
}

interface User {
  name: string;
  image: string;
}

interface MessageThreadProps {
  conversationId: string | null;
  onBack: () => void;
}

export default function MessageThread({ conversationId, onBack }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id || !conversationId) return;

    markMessagesAsRead(conversationId, session.user.id);

    const [user1Id, user2Id] = conversationId.split("_");
    const otherUserId = session.user.id === user1Id ? user2Id : user1Id;

    const fetchUserDetails = async () => {
      try {
        const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id: otherUserId });
        setOtherUser(user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [conversationId, session?.user?.id]);

  useEffect(() => {
    if (!conversationId) return;

    listenForMessages(conversationId, (messagesData) => {
      const formattedMessages: Message[] = messagesData.map((msg) => ({
        id: msg.id,
        senderId: msg.senderId ?? "unknown",
        content: msg.content,
        timestamp: msg.timestamp,
      }));

      setMessages(formattedMessages);
    });
  }, [conversationId]);

  const handleSend = async () => {
    if (!newMessage || !session?.user?.id || !conversationId) return;
    await sendMessage(conversationId, session.user.id, newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full border-[5px] border-black  bg-white shadow-[6px_6px_0px_2px_rgb(0,0,0)] overflow-hidden">
      
      {/* Chat Header */}
      <div className="flex items-center gap-4 p-4 border-b-[5px] border-black bg-primary text-white shadow-[4px_4px_0px_0px_rgb(0,0,0)]">
        <Button variant="ghost" size="icon" onClick={onBack} className="border-black shadow-sm hover:shadow-none">
          <ArrowLeft className="h-6 w-6 text-black" />
        </Button>
        <Avatar className="border-[3px] border-black shadow-md">
          <AvatarImage src={otherUser?.image || ""} alt={otherUser?.name || "Unknown"} />
          <AvatarFallback>{otherUser?.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <span className="text-lg font-extrabold">{otherUser?.name || "Unknown"}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === session?.user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-4 border-[4px] border-black rounded-lg shadow-[4px_4px_0px_0px_rgb(0,0,0)] ${
                message.senderId === session?.user?.id
                  ? "bg-accent text-black rounded-br-xl"
                  : "bg-gray-100 text-black rounded-bl-xl"
              }`}
            >
              <p className="text-[16px] font-medium">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t-[5px] border-black bg-white flex items-center gap-3 rounded-b-2xl shadow-[4px_4px_0px_0px_rgb(0,0,0)]">
      <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border-[4px] border-black rounded-full px-4 py-3 text-black placeholder:text-muted-foreground font-semibold shadow-md"
          onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); 
              handleSend();
              }
            }}
        />

        <Button
          type="submit"
          size="icon"
          className="border-[4px] border-black bg-primary text-white rounded-full shadow-[4px_4px_0px_0px_rgb(0,0,0)] hover:shadow-none"
          onClick={handleSend}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
