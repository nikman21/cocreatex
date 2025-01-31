"use client";

import { useState, useEffect } from "react";
import MessageButton from "./MessageButton";
import MessagePanel from "./MessagePanel";
import { getUserUnreadCount } from "@/lib/firebaseMessaging"; 
import { useSession } from "next-auth/react";

interface MessagingProps {
  chatId?: string | null;
}

export function Messaging({ chatId }: MessagingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();
  const userId = session?.user?.id ?? ""; 

  useEffect(() => {
    if (!userId) return; 

    const fetchUnreadCount = async () => {
      const count = await getUserUnreadCount(userId);
      setUnreadCount(count);
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  const togglePanel = () => {
    setIsOpen((prev) => !prev);

    
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <MessageButton onClick={togglePanel} unreadCount={unreadCount} />
      {isOpen && <MessagePanel chatId={chatId} onClose={() => setIsOpen(false)} />}
    </div>
  );
}
