"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useState } from "react";

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [useMemory, setUseMemory] = useState(true);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: "system",
        content: "You are an AI assistant",
      },
    ]
  );

  async function onSubmit() {
    if (!inputValue.trim()) return;
    setLoading(true);

    const newMessages = useMemory
      ? [...messages, { role: "user", content: inputValue }]
      : [{ role: "user", content: inputValue }];

    setMessages(newMessages);

    setInputValue("");

    try {
      const res = await axios.post("/api/chat", {
        model: "deepseek-r1",
        messages: newMessages,
        stream: false,
      });

      const fullResponse = res.data.message.content;
      const thinkMatch = fullResponse.match(/<think>([\s\S]*?)<\/think>/);
      const thinkPart = thinkMatch ? thinkMatch[1].trim() : "";
      const answerPart = fullResponse
        .replace(/<think>[\s\S]*?<\/think>/, "")
        .trim();

      console.log("Thinking:", thinkPart);

      setMessages([...newMessages, { role: "assistant", content: answerPart }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center h-screen p-4">
      <div className="max-w-5xl w-full flex flex-col gap-4 h-full">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h1 className="text-2xl font-bold">Chat with AI</h1>
          <div className="flex items-center gap-2">
            <span>Use Memory</span>
            <Switch checked={useMemory} onCheckedChange={setUseMemory} />
          </div>
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
