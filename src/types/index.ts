// Reponse API standard
export type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };

// Reponse paginee
export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// Parametres de pagination
export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

// Message AI (Claude / OpenAI compatible)
export type AIMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};
