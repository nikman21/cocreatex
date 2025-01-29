import { database } from "./firebase";
import { ref, push, set, serverTimestamp, onValue, get } from "firebase/database";

interface Message {
  id: string;
  senderEmail: string;
  content: string;
  timestamp: number;
}

export async function sendMessage(chatId: string, senderEmail: string, content: string) {
  const messageRef = ref(database, `chats/${chatId}/messages`);
  const newMessageRef = push(messageRef);

  await set(newMessageRef, {
    senderEmail,
    content,
    timestamp: serverTimestamp(),
  });
}

export function listenForMessages(chatId: string, callback: (messages: Message[]) => void) {
  const messageRef = ref(database, `chats/${chatId}/messages`);
  
  onValue(messageRef, (snapshot) => {
    if (snapshot.exists()) {
      const messagesData: { [key: string]: Omit<Message, "id"> } = snapshot.val();
      const messagesArray: Message[] = Object.entries(messagesData).map(([id, msg]) => ({
        id,
        ...msg,
      }));
      callback(messagesArray);
    } else {
      callback([]);
    }
  });
}

export async function createChat(user1Id: string, user2Id: string) {
    const sanitizedUser1Id = user1Id.replace(/\./g, "_");
    const sanitizedUser2Id = user2Id.replace(/\./g, "_");
  
    const chatId = sanitizedUser1Id < sanitizedUser2Id 
      ? `${sanitizedUser1Id}_${sanitizedUser2Id}` 
      : `${sanitizedUser2Id}_${sanitizedUser1Id}`;
  
    const chatRef = ref(database, `chats/${chatId}`);
  
    // Check if chat already exists
    const snapshot = await get(chatRef);
    if (!snapshot.exists()) {
      await set(chatRef, {
        createdAt: serverTimestamp(),
        users: { [sanitizedUser1Id]: true, [sanitizedUser2Id]: true },
      });
    }
  
    return chatId;
}
  
  
  
  