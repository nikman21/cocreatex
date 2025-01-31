"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createChat } from "@/lib/firebaseMessaging";
import { useSession } from "next-auth/react";
import { Messaging } from "./Messaging";

interface UserProfileProps {
  user: {
    _id: string;
    name: string;
    username: string;
    image: string;
    bio: string;
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  const { data: session } = useSession();
  const [chatId, setChatId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleStartChat = async () => {
    if (!session?.user?.id) return;
    const newChatId = await createChat(session.user.id, user._id);
    setChatId(newChatId);
    setIsOpen(true);
  };

  return (
    <div className="profile_card">
      <div className="profile_title">
        <h3 className="text-24-black uppercase text-center line-clamp-1">{user.name}</h3>
      </div>

      <Image src={user.image} alt={user.name} width={220} height={220} className="profile_image" />

      <p className="text-30-extrabold mt-7 text-center">@{user?.username}</p>
      <p className="mt-1 text-center text-14-normal">{user?.bio}</p>

      <div className="mt-4 flex justify-center">
        <Button onClick={handleStartChat} className="bg-secondary text-white px-4 py-2">
          Start Chat
        </Button>
      </div>

      
      {isOpen && chatId && <Messaging chatId={chatId}  />}
    </div>
  );
}
