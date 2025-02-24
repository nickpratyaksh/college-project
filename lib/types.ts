export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ProcessedResponse = {
  thinkPart: string;
  answerPart: string;
};
