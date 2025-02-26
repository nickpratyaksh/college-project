import { create } from "zustand";
import { Message, ProcessedResponse } from "./types";
import axios from "axios";
import { processResponse } from "./utils";

type ChatStore = {
  messages: Message[];
  loading: boolean;
  summary: string;
  chatCompletion: (prompt: string) => Promise<void>;
  generateSummary: () => Promise<void>;
};

const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  loading: false,
  summary: "",

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
      // console.log("Thinking:", response.thinkPart);
      messages.push({ role: "assistant", content: response.answerPart });
      set({ messages });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      set({ loading: false });
    }
  },
  generateSummary: async () => {
    const { messages } = get();
    if (messages.length === 0) return;

    try {
      const res = await axios.post("/api/generate", {
        model: "deepseek-r1",
        prompt:
          "Extract key details about the user from the following conversation. Focus only on information that might be relevant for future interactions, such as user preferences, opinions, recurring topics, important context, and any explicitly stated facts about the user. Do not summarize the conversation—only list extracted details concisely." +
          JSON.stringify(messages),
        stream: false,
      });

      const processedResponse = processResponse(res.data.response);
      console.log("Generated Summary:", processedResponse.answerPart);
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  },
}));

export default useChatStore;
