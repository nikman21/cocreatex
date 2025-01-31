"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserConversations, markMessagesAsRead } from "@/lib/firebaseMessaging";
import { useSession } from "next-auth/react";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  unreadCount: number;
}

interface MessageListProps {
  onSelectConversation: (id: string) => void;
}

export default function MessageList({ onSelectConversation }: MessageListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    getUserConversations(session.user.id, async (convos) => {
      const enrichedConversations = await Promise.all(
        convos.map(async (convo) => {
          const [user1Id, user2Id] = convo.id.split("_");
          const otherUserId = session?.user?.id === user1Id ? user2Id : user1Id;

          try {
            const otherUser = await client.fetch(AUTHOR_BY_ID_QUERY, { id: otherUserId });

            return {
              id: convo.id,
              name: otherUser?.name || "Unknown",
              avatar: otherUser?.image || "/default-avatar.jpg",
              lastMessage: convo.lastMessage || "No messages yet",
              unreadCount: convo.unreadCount || 0,
            };
          } catch (error) {
            console.error("Error fetching other user:", error);
            return {
              id: convo.id,
              name: "Unknown",
              avatar: "/default-avatar.jpg",
              lastMessage: convo.lastMessage || "No messages yet",
              unreadCount: convo.unreadCount || 0,
            };
          }
        })
      );

      setConversations(enrichedConversations);
    });
  }, [session?.user?.id]);

  const handleOpenConversation = (chatId: string) => {
    if (!session?.user?.id) return;


    markMessagesAsRead(chatId, session.user.id);

    onSelectConversation(chatId);
  };

  return (
    <div className="overflow-y-auto h-full bg-white border-[5px] border-black shadow-[6px_6px_0px_2px_rgb(0,0,0)]">
      {conversations.length === 0 ? (
        <p className="text-center text-black-100 text-sm font-medium p-5">
          No conversations yet
        </p>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-center gap-4 p-4 border-b-[5px] border-black hover:bg-primary cursor-pointer transition-all duration-200 shadow-[4px_4px_0px_0px_rgb(0,0,0)]"
            onClick={() => handleOpenConversation(conversation.id)}
          >
            <Avatar className="border-[4px] border-black shadow-sm">
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback>{conversation.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-extrabold text-black truncate">
                {conversation.name}
              </p>
              <p className="text-sm text-black-100 truncate">{conversation.lastMessage}</p>
            </div>

            {conversation.unreadCount > 0 && (
              <div className="bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-extrabold shadow-[4px_4px_0px_0px_rgb(0,0,0)]">
                {conversation.unreadCount}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

