/**
 * AI Config Service
 * Handles AI configuration API communication
 * Single Responsibility: AI configuration management operations
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface AIProvider {
    provider: string;
    models: string[];
}

export interface AIConfig {
    provider: string;
    model_id: string;
    is_active: boolean;
    created_at: string;
}

export interface AIConfigCreate {
    provider: string;
    model_id: string;
    api_key: string;
}

export interface AIConfigUpdate {
    provider?: string;
    model_id?: string;
    api_key?: string;
    is_active?: boolean;
}

export class AIConfigError extends Error {
    constructor(
        message: string,
        public readonly statusCode?: number,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = "AIConfigError";
    }
}

function parseApiError(data: any, statusCode: number): string {
    if (typeof data.detail === "string") {
        return data.detail;
    }
    if (Array.isArray(data.detail)) {
        return data.detail
            .map((err: { loc?: string[]; msg: string }) => {
                const field = err.loc?.[err.loc.length - 1] || "field";
                return `${field}: ${err.msg}`;
            })
            .join(", ");
    }
    return "An unexpected error occurred";
}

async function makeRequest<T>(
    endpoint: string,
    method: string,
    token: string,
    body?: any
): Promise<T> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = parseApiError(errorData, response.status);
            throw new AIConfigError(errorMessage, response.status, errorData);
        }

        if (response.status === 204) {
            return undefined as T;
        }

        const result = await response.json();
        return result;
    } catch (error) {
        if (error instanceof AIConfigError) {
            throw error;
        }
        throw new AIConfigError(
            error instanceof Error ? error.message : "Network error occurred"
        );
    }
}

export async function getAIConfig(token: string): Promise<AIConfig | null> {
    return makeRequest<AIConfig | null>("/api/settings/ai", "GET", token);
}

export async function saveAIConfig(
    token: string,
    data: AIConfigCreate
): Promise<AIConfig> {
    return makeRequest<AIConfig>("/api/settings/ai", "PUT", token, data);
}

export async function updateAIConfig(
    token: string,
    data: AIConfigUpdate
): Promise<AIConfig> {
    return makeRequest<AIConfig>("/api/settings/ai", "PATCH", token, data);
}

export async function deleteAIConfig(token: string): Promise<void> {
    return makeRequest<void>("/api/settings/ai", "DELETE", token);
}

export async function getAIProviders(
    token: string
): Promise<{ providers: AIProvider[] }> {
    return makeRequest<{ providers: AIProvider[] }>(
        "/api/settings/ai/providers",
        "GET",
        token
    );
}
