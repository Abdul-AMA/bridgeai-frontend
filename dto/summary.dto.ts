export type TriggerType = "document" | "chat" | "manual";

export interface ProjectContextSummaryDTO {
  project_id: number;
  content: string | null;
  generated_at: string | null;
  is_generating: boolean;
  last_trigger: TriggerType;
}
