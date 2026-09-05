export interface AttachedFile {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export interface ChatRequest {
  conversationId?: string;
  message: string;
  jurisdiction?: string;
  file?: AttachedFile;
}

export interface EvidenceItem {
  title: string;
  detail: string;
  status: "Supported" | "Partly supported" | "Insufficient";
}

export interface ChatResponse {
  conversationId: string;
  message: string;
  confidenceScore?: number; // Confidence level in percentage (e.g. 85 for 85%)
  options?: string[];
  summary?: string;
  evidence?: EvidenceItem[];
  error?: string;
}

export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error (${response.status})`);
  }

  const data = await response.json();
  return data as ChatResponse;
}
