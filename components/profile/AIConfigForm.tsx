/**
 * AI Config Form Component
 * Form for configuring AI provider settings
 * Single Responsibility: AI configuration form
 */

"use client";

import { useState, useEffect } from "react";
import { useAIConfig } from "@/hooks/profile/useAIConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Bot, Trash2, Loader2 } from "lucide-react";

const PROVIDER_LABELS: Record<string, string> = {
    anthropic: "Anthropic (Claude)",
    openai: "OpenAI (GPT)",
    gemini: "Google Gemini",
    groq: "Groq",
    mistral: "Mistral AI",
};

export function AIConfigForm() {
    const {
        config,
        providers,
        isLoading,
        isSaving,
        error,
        success,
        saveConfig,
        removeConfig,
        clearMessages,
    } = useAIConfig();

    const [selectedProvider, setSelectedProvider] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [apiKey, setApiKey] = useState<string>("");
    const [showApiKey, setShowApiKey] = useState(false);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (config) {
            setSelectedProvider(config.provider);
            setSelectedModel(config.model_id);
            setIsActive(config.is_active);
            setApiKey("");
        }
    }, [config]);

    const currentModels = providers.find((p) => p.provider === selectedProvider)?.models || [];

    useEffect(() => {
        if (selectedProvider && currentModels.length > 0 && !currentModels.includes(selectedModel)) {
            setSelectedModel(currentModels[0]);
        }
    }, [selectedProvider, currentModels]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();

        if (!selectedProvider || !selectedModel) {
            return;
        }

        await saveConfig(selectedProvider, selectedModel, apiKey);
        setApiKey("");
    };

    const handleRemove = async () => {
        if (confirm("Are you sure you want to remove your AI configuration? This will use the default settings.")) {
            await removeConfig();
            setSelectedProvider("");
            setSelectedModel("");
            setApiKey("");
            setIsActive(true);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading AI configuration...</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Provider Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    AI Provider
                </label>
                <Select
                    value={selectedProvider}
                    onValueChange={(value) => {
                        setSelectedProvider(value);
                        setSelectedModel("");
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an AI provider" />
                    </SelectTrigger>
                    <SelectContent>
                        {providers.map((provider) => (
                            <SelectItem key={provider.provider} value={provider.provider}>
                                {PROVIDER_LABELS[provider.provider] || provider.provider}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Model Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                </label>
                <Select
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                    disabled={!selectedProvider}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={selectedProvider ? "Select a model" : "Select provider first"} />
                    </SelectTrigger>
                    <SelectContent>
                        {currentModels.map((model) => (
                            <SelectItem key={model} value={model}>
                                {model}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* API Key */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                </label>
                <div className="relative">
                    <Input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={config ? "Enter new key to update" : "Enter your API key"}
                        className="pr-10"
                        disabled={isSaving}
                    />
                    <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Your API key will be encrypted and stored securely
                </p>
            </div>

            {/* Active Toggle Info */}
            {config && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">
                            Current config: {PROVIDER_LABELS[config.provider] || config.provider} - {config.model_id}
                        </span>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-sm text-green-600">{success}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
                {config ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemove}
                        disabled={isSaving}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                    </Button>
                ) : (
                    <div />
                )}
                <div className="flex gap-2">
                    <Button
                        type="submit"
                        disabled={isSaving || !selectedProvider || !selectedModel}
                        className="px-6"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : config ? "Update" : "Save"}
                    </Button>
                </div>
            </div>

            {/* Default info when no config */}
            {!config && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-gray-600">
                        <strong>Default:</strong> Using server&apos;s default AI configuration.
                        Add your own API key to use a custom provider.
                    </p>
                </div>
            )}
        </form>
    );
}
