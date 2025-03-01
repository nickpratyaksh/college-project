import { create } from "zustand";
import { Message, ProcessedResponse } from "./types";
import axios from "axios";
import { processResponse } from "./utils";

type ChatStore = {
  messages: Message[];
  loading: boolean;
  summary: string;
  chatCompletion: (prompt: string) => Promise<void>;
  generateSummary: () => Promise<string | undefined>;
};

const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  loading: false,
  summary: "",

  chatCompletion: async (prompt) => {
    const { messages, generateSummary } = get();
    set({ loading: true });
    if (messages.length > 10) {
      const summary = await generateSummary();
      messages.splice(
        0,
        messages.length - 1,
        { role: "assistant", content: summary! },
        { role: "user", content: prompt }
      );
    } else messages.push({ role: "user", content: prompt });
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
          "Summarize the following conversation. Only mention the main topic the user talked about. Do not mention anything from the assistant's answers" +
          JSON.stringify(messages),
        stream: false,
      });

      const processedResponse = processResponse(res.data.response);
      console.log("Generated Summary:", processedResponse.answerPart);
      return processedResponse.answerPart;
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  },
}));

export default useChatStore;
