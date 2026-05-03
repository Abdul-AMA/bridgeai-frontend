export type DocumentStatus = "processing" | "ready" | "failed";

export interface DocumentDTO {
  id: number;
  project_id: number;
  filename: string;
  file_type: string;
  status: DocumentStatus;
  chunk_count: number;
  created_at: string;
}

export interface DocumentListDTO {
  items: DocumentDTO[];
  total: number;
}
