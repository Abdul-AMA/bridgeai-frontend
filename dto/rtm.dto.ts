export interface RTMStatusDTO {
  project_id: number;
  is_refreshing: boolean;
  last_refreshed_at: string | null;
  last_trigger: "save" | "status_change" | "draft" | "manual" | null;
  requirement_count: number;
  unverified_count: number;
  untested_count: number;
}

export interface RequirementDTO {
  id: number;
  req_id: string;
  section: string;
  description: string;
  full_text: string;
  status: "active" | "archived";
  source_count: number;
  test_case_count: number;
  created_at: string;
}

export interface TraceabilityLinkDTO {
  id: number;
  source_type: "chat_message" | "document";
  source_id: number;
  excerpt: string;
  is_auto_generated: boolean;
  created_at: string;
}

export interface TestCaseDTO {
  id: number;
  requirement_id: number;
  title: string;
  preconditions: string | null;
  steps: string[];
  expected_result: string;
  is_auto_generated: boolean;
  status: "active" | "archived";
  created_at: string;
}

export interface CommentInlineDTO {
  id: number;
  author_id: number;
  content: string;
  created_at: string;
}

export interface RequirementDetailDTO extends RequirementDTO {
  source_links: TraceabilityLinkDTO[];
  test_cases: TestCaseDTO[];
  comments: CommentInlineDTO[];
}

export interface RTMFilters {
  section?: string;
  coverage?: "unverified" | "untested" | "complete";
  q?: string;
}

export interface GenerateTestCasesPayload {
  requirement_ids: number[];
  generate_all_untested: boolean;
}

export interface GeneratedRequirementTestCases {
  requirement_id: number;
  test_cases: TestCaseDTO[];
}

export interface GenerateTestCasesResponse {
  generated: GeneratedRequirementTestCases[];
  skipped: number[];
}

export interface TestCaseCreatePayload {
  title: string;
  preconditions?: string | null;
  steps: string[];
  expected_result: string;
}

export interface TestCaseUpdatePayload {
  title?: string;
  preconditions?: string | null;
  steps?: string[];
  expected_result?: string;
}

export interface TraceabilityLinkCreatePayload {
  source_type: "chat_message" | "document";
  source_id: number;
  excerpt: string;
}
