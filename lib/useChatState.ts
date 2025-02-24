import { create } from "zustand";
import { Message, ProcessedResponse } from "./types";
import axios from "axios";
import { processResponse } from "./utils";

type ChatStore = {
  messages: Message[];
  loading: boolean;
  chatCompletion: (prompt: string) => Promise<void>;
};

const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  loading: false,

  chatCompletion: async (prompt) => {
    const { messages } = get();
    set({ loading: true });
    messages.push({ role: "user", content: prompt });
    set({ messages });

    try {
      const res = await axios.post("/api/chat", {
        model: "deepseek-r1",
        messages: messages,
        stream: false,
      });
      const response: ProcessedResponse = processResponse(
        res.data.message.content
      );
      console.log("Thinking:", response.thinkPart);
      messages.push({ role: "assistant", content: response.answerPart });
      set({ messages });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useChatStore;
