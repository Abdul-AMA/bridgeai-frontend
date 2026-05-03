/**
 * AI Config Hook
 * Manages AI configuration state and API calls
 * Single Responsibility: AI config logic
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getAIConfig,
    saveAIConfig,
    updateAIConfig,
    deleteAIConfig,
    getAIProviders,
    AIConfig,
    AIProvider,
    AIConfigError,
} from "@/services/ai-config.service";
import { getCookie } from "@/lib/utils";

interface UseAIConfigReturn {
    config: AIConfig | null;
    providers: AIProvider[];
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    success: string | null;
    saveConfig: (provider: string, modelId: string, apiKey: string) => Promise<boolean>;
    updateConfig: (data: { provider?: string; model_id?: string; api_key?: string; is_active?: boolean }) => Promise<boolean>;
    removeConfig: () => Promise<boolean>;
    refreshConfig: () => Promise<void>;
    clearMessages: () => void;
}

export function useAIConfig(): UseAIConfigReturn {
    const [config, setConfig] = useState<AIConfig | null>(null);
    const [providers, setProviders] = useState<AIProvider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const getToken = useCallback(() => {
        const token = getCookie("token");
        if (!token) {
            setError("Not authenticated");
            return null;
        }
        return token;
    }, []);

    const loadProviders = useCallback(async () => {
        const token = getToken();
        if (!token) return;

        try {
            const data = await getAIProviders(token);
            setProviders(data.providers);
        } catch (err) {
            console.error("Failed to load providers:", err);
        }
    }, [getToken]);

    const refreshConfig = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getAIConfig(token);
            setConfig(data);
        } catch (err) {
            const errorMessage =
                err instanceof AIConfigError
                    ? err.message
                    : "Failed to load AI configuration";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    const saveConfig = useCallback(
        async (provider: string, modelId: string, apiKey: string): Promise<boolean> => {
            const token = getToken();
            if (!token) return false;

            setIsSaving(true);
            setError(null);
            setSuccess(null);

            try {
                const data = await saveAIConfig(token, {
                    provider,
                    model_id: modelId,
                    api_key: apiKey,
                });
                setConfig(data);
                setSuccess("AI configuration saved successfully!");
                return true;
            } catch (err) {
                const errorMessage =
                    err instanceof AIConfigError
                        ? err.message
                        : "Failed to save AI configuration";
                setError(errorMessage);
                return false;
            } finally {
                setIsSaving(false);
            }
        },
        [getToken]
    );

    const updateConfig = useCallback(
        async (data: {
            provider?: string;
            model_id?: string;
            api_key?: string;
            is_active?: boolean;
        }): Promise<boolean> => {
            const token = getToken();
            if (!token) return false;

            setIsSaving(true);
            setError(null);
            setSuccess(null);

            try {
                const updatedData = await updateAIConfig(token, data);
                setConfig(updatedData);
                setSuccess("AI configuration updated successfully!");
                return true;
            } catch (err) {
                const errorMessage =
                    err instanceof AIConfigError
                        ? err.message
                        : "Failed to update AI configuration";
                setError(errorMessage);
                return false;
            } finally {
                setIsSaving(false);
            }
        },
        [getToken]
    );

    const removeConfig = useCallback(async (): Promise<boolean> => {
        const token = getToken();
        if (!token) return false;

        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await deleteAIConfig(token);
            setConfig(null);
            setSuccess("AI configuration removed. Using default settings.");
            return true;
        } catch (err) {
            const errorMessage =
                err instanceof AIConfigError
                    ? err.message
                    : "Failed to remove AI configuration";
            setError(errorMessage);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [getToken]);

    const clearMessages = useCallback(() => {
        setError(null);
        setSuccess(null);
    }, []);

    useEffect(() => {
        refreshConfig();
        loadProviders();
    }, [refreshConfig, loadProviders]);

    return {
        config,
        providers,
        isLoading,
        isSaving,
        error,
        success,
        saveConfig,
        updateConfig,
        removeConfig,
        refreshConfig,
        clearMessages,
    };
}
