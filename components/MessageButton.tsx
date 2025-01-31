import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

export default function MessageButton({ onClick, unreadCount = 0 }: MessageButtonProps) {
  return (
    <div className="relative">
      <Button
        onClick={onClick}
        className="rounded-full w-14 h-14 bg-secondary border-[5px] border-black text-white shadow-100 hover:shadow-300 transition-all duration-300"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="sr-only">Open messages</span>
      </Button>

      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white border-2 border-black rounded-full text-xs w-6 h-6 flex items-center justify-center font-bold shadow-100">
          {unreadCount}
        </div>
      )}
    </div>
  );
}
