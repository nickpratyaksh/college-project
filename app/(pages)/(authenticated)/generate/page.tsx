"use client";

import { ChatBubble } from "@/components/chatBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { processResponse } from "@/lib/utils";
import axios from "axios";
import { useState } from "react";

export default function GeneratePage() {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!inputValue.trim()) return;

    try {
      setLoading(true);
      setMessage(inputValue);
      const res = await axios.post("/api/generate", {
        model: "deepseek-r1:1.5b",
        prompt: inputValue,
        stream: false,
      });
      const processedResponse = processResponse(res.data.response);
      console.log("Thinking:", processedResponse.thinkPart);
      setResponse(processedResponse.answerPart);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
    }

    setInputValue("");
  }

  return (
    <div className="flex justify-center h-full p-4 ">
      <div className="max-w-5xl w-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center border-b pb-2 gap-4">
          <SidebarTrigger />
          <div className="text-2xl font-bold">
            Message AI (single message only, no memory saved)
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-full rounded-lg">
          <div className="flex flex-col gap-2">
            {response && <ChatBubble message={response} />}
            {loading && <div className="text-gray-500">Thinking...</div>}
            {message && (
              <div className="px-3 py-2 rounded-md w-fit max-w-xl bg-blue-500 text-white self-end">
                {message}
              </div>
            )}
          </div>
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
