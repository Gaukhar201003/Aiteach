import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const MODELS = {
  TEXT: "gemini-3-flash-preview",
  PRO: "gemini-3.1-pro-preview",
};
