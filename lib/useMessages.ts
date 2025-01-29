import { useEffect, useState } from "react";
import { database } from "./firebase";
import { ref, onValue } from "firebase/database";
import { Message } from "../types/chat";

export function useMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messageRef = ref(database, `chats/${chatId}/messages`);

    const unsubscribe = onValue(messageRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesData: { [key: string]: Omit<Message, "id"> } = snapshot.val();
        const messagesArray: Message[] = Object.entries(messagesData).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  return messages;
}
