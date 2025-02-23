"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useState } from "react";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [useMemory, setUseMemory] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  async function onSubmit() {
    setLoading(true);
    let newMessages: { role: string; content: string }[] = [...messages];
    if (useMemory) {
      newMessages.push({ role: "user", content: inputValue });
    } else newMessages = [{ role: "user", content: inputValue }];
    setInputValue("");

    const res = await axios.post("/api/chat/completions", {
      model: "deepseek-r1:1.5b",
      messages: newMessages,
    });

    const fullResponse = res.data.choices[0].message.content;
    const thinkMatch = fullResponse.match(/<think>([\s\S]*?)<\/think>/);

    const thinkPart = thinkMatch ? thinkMatch[1].trim() : "";
    const answerPart = fullResponse
      .replace(/<think>[\s\S]*?<\/think>/, "")
      .trim();

    console.log("Think Part:", thinkPart);

    newMessages.push({ role: "deepseek", content: answerPart });
    setMessages(newMessages);

    setLoading(false);
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <div className="max-w-5xl w-full flex-col gap-4">
        <div>
          <div className="flex justify-between">
            <div className="text-3xl font-bold">Chat with AI</div>
            <div className="flex gap-4">
              <div>Use Memory</div>
              <Switch checked={useMemory} onCheckedChange={setUseMemory} />
            </div>
          </div>
          <div className="flex-col space-y-4">
            {messages.map((message, i) =>
              message.role === "user" ? (
                <div
                  className="bg-slate-100 rounded-full p-4 w-fit justify-self-end"
                  key={i}
                >
                  {message.content}
                </div>
              ) : (
                <div className="border rounded-md p-4" key={i}>
                  {message.content}
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <Input
            placeholder="Type something..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={onSubmit}>Send</Button>
          {loading && <div>Loading...</div>}
        </div>
      </div>
    </div>
  );
}
