import Anthropic from "@anthropic-ai/sdk";
import type { AIMessage } from "@/types";

// Client singleton
let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

// Modeles disponibles
export const AI_MODELS = {
  haiku: "claude-haiku-4-5-20251001", // Rapide, pas cher — taches simples
  sonnet: "claude-sonnet-4-6", // Defaut — la plupart des features
  opus: "claude-opus-4-6", // Complexe — archi, debug difficile
} as const;

export type AIModel = keyof typeof AI_MODELS;

// Completion simple (non-streaming)
export async function complete({
  messages,
  system,
  model = "sonnet",
  maxTokens = 1024,
}: {
  messages: AIMessage[];
  system?: string;
  model?: AIModel;
  maxTokens?: number;
}): Promise<string> {
  const anthropicMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const response = await getClient().messages.create({
    model: AI_MODELS[model],
    max_tokens: maxTokens,
    system,
    messages: anthropicMessages,
  });

  const block = response.content[0];
  if (!block || block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
}

// Streaming — retourne un ReadableStream pour les API routes Next.js
export async function stream({
  messages,
  system,
  model = "sonnet",
  maxTokens = 2048,
}: {
  messages: AIMessage[];
  system?: string;
  model?: AIModel;
  maxTokens?: number;
}): Promise<ReadableStream<string>> {
  const anthropicMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const anthropicStream = await getClient().messages.create({
    model: AI_MODELS[model],
    max_tokens: maxTokens,
    system,
    messages: anthropicMessages,
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const event of anthropicStream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(event.delta.text);
        }
      }
      controller.close();
    },
  });
}
