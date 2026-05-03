export interface NodeTypeStats {
  calls: number;
  tokens: number;
}

export interface DailyStats {
  date: string;
  calls: number;
  input_tokens: number;
  output_tokens: number;
}

export interface AIUsageSummaryDTO {
  total_calls: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  by_node_type: Record<string, NodeTypeStats>;
  daily_breakdown: DailyStats[];
  estimated_cost_usd: number;
}

export interface AIUsageLogDTO {
  id: number;
  user_id: number;
  project_id: number | null;
  session_id: number | null;
  node_type: string;
  model_name: string;
  provider: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  created_at: string;
}

export interface AIUsageHistoryDTO {
  total: number;
  page: number;
  limit: number;
  items: AIUsageLogDTO[];
}
