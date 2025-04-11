"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useChatStore from "@/lib/useChatState";
import { useState } from "react";

export default function ChatPage() {
  const { messages, loading, chatCompletion } = useChatStore();
  const [inputValue, setInputValue] = useState("");

  async function onSubmit() {
    if (!inputValue.trim()) return;
    chatCompletion(inputValue);
    setInputValue("");
  }

  return (
    <div className="flex justify-center h-full p-4 ">
      <div className="max-w-5xl w-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center border-b pb-2 gap-4">
          <SidebarTrigger />
          <div className="text-2xl font-bold">Chat with AI (uses memory)</div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-full rounded-lg">
          <div className="flex flex-col gap-2">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-md w-fit max-w-xl ${
                  message.role === "user"
                    ? "bg-blue-500 text-white self-end"
                    : message.role === "assistant"
                    ? "bg-gray-200 text-black"
                    : "hidden"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
          {loading && <div className="text-gray-500">Thinking...</div>}
        </ScrollArea>

        {/* Input & Send Button */}
        <div className="flex gap-3">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            disabled={loading}
          />
          <Button onClick={onSubmit} disabled={loading}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
