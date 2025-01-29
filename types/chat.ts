export interface Message {
    id: string;
    senderEmail: string;
    content: string;
    timestamp: number;
  }
  
  export interface Chat {
    id: string;
    messages: Message[];
  }
  