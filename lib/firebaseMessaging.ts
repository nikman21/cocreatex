import { database } from "./firebase";
import { ref, push, set, serverTimestamp, onValue, get, update } from "firebase/database";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
}

interface Conversation {
  unreadCount: number;
  id: string;
  otherUserId: string;
  name: string;
  lastMessage: string;
  avatar: string;
}

export async function sendMessage(chatId: string, senderId: string, content: string) {
  const messageRef = ref(database, `chats/${chatId}/messages`);
  const newMessageRef = push(messageRef);

  await set(newMessageRef, {
    senderId,
    content,
    timestamp: serverTimestamp(),
    read: false,
  });
}



export function listenForMessages(chatId: string, callback: (messages: Message[]) => void) {
  const messageRef = ref(database, `chats/${chatId}/messages`);

  onValue(messageRef, (snapshot) => {
    if (snapshot.exists()) {
      const messagesData = snapshot.val();
      const messagesArray: Message[] = Object.entries(messagesData).map(([id, msg]: [string, any]) => ({
        id,
        senderId: msg.senderId ?? "unknown", 
        content: msg.content,
        timestamp: msg.timestamp,
      }));
      callback(messagesArray);
    } else {
      callback([]); // No messages found
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


export function getUserConversations(userId: string, callback: (conversations: Conversation[]) => void) {
  const userChatsRef = ref(database, `chats`);

  onValue(userChatsRef, async (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const chatsData = snapshot.val();
    const conversations: Conversation[] = [];

    for (const chatId in chatsData) {
      const chat = chatsData[chatId];

      if (chat.users && chat.users[userId]) {
        const otherUserId = Object.keys(chat.users).find((id) => id !== userId) || "Unknown";
        
        // Count unread messages
        let unreadCount = 0;
        if (chat.messages) {
          for (const msgId in chat.messages) {
            const message = chat.messages[msgId];
            if (message.senderId !== userId && message.read === false) {
              unreadCount++;
            }
          }
        }

        // Get last message
        let lastMessage = "No messages yet";
        if (chat.messages) {
          const messageKeys = Object.keys(chat.messages);
          const lastMessageData = chat.messages[messageKeys[messageKeys.length - 1]];
          lastMessage = lastMessageData.content;
        }

        conversations.push({
          id: chatId,
          otherUserId,
          name: otherUserId,
          lastMessage,
          unreadCount, 
          avatar: "",
        });
      }
    }

    callback(conversations);
  });
}


export async function markMessagesAsRead(chatId: string, userId: string) {
  const messagesRef = ref(database, `chats/${chatId}/messages`);

  // Get the messages
  const snapshot = await get(messagesRef);
  if (!snapshot.exists()) return;

  const updates: Record<string, any> = {};

  Object.entries(snapshot.val()).forEach(([msgId, message]: [string, any]) => {
    if (message.senderId !== userId && !message.read) {
      updates[`chats/${chatId}/messages/${msgId}/read`] = true; // ✅ Update read status
    }
  });

  await update(ref(database), updates);
}


export function getUserUnreadCount(userId: string): Promise<number> {
  return new Promise((resolve) => {
    const userChatsRef = ref(database, `chats`);
    let totalUnreadCount = 0;

    onValue(userChatsRef, (snapshot) => {
      if (!snapshot.exists()) {
        resolve(0);
        return;
      }

      const chatsData = snapshot.val();
      for (const chatId in chatsData) {
        const chat = chatsData[chatId];

        if (chat.users && chat.users[userId]) {
          let unreadCount = 0;

          if (chat.messages) {
            for (const msgId in chat.messages) {
              const message = chat.messages[msgId];
              if (message.senderId !== userId && message.read === false) {
                unreadCount++; 
              }
            }
          }
          totalUnreadCount += unreadCount;
        }
      }

      resolve(totalUnreadCount);
    });
  });
}

  
  
  
  