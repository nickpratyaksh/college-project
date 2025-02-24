import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function processResponse(response: string) {
  const thinkMatch = response.match(/<think>([\s\S]*?)<\/think>/);
  const thinkPart = thinkMatch ? thinkMatch[1].trim() : "";
  const answerPart = response.replace(/<think>[\s\S]*?<\/think>/, "").trim();

  return { thinkPart, answerPart };
}
