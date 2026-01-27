/**
 * useChatInput Hook
 * Manages chat input state and send operations
 */

import { useState, useRef, useCallback, ChangeEvent, KeyboardEvent } from "react";
import { SendMessagePayload, LocalChatMessage } from "@/dto";

interface UseChatInputOptions {
  onSend: (payload: SendMessagePayload, pendingMessage: LocalChatMessage) => Promise<void>;
  senderType: "ba" | "client";
  crsPattern: "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories";
  isConnected: boolean;
}

export function useChatInput({
  onSend,
  senderType,
  crsPattern,
  isConnected,
}: UseChatInputOptions) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const resetTextarea = useCallback(() => {
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !isConnected) return;

    const payload: SendMessagePayload = {
      content: input.trim(),
      sender_type: senderType,
      crs_pattern: crsPattern,
    };

    const pendingLocal: LocalChatMessage = {
      _localId: `local-${Date.now()}`,
      id: Date.now() * -1,
      session_id: 0, // Will be set by parent
      sender_type: senderType,
      sender_id: 0, // Will be set by parent
      content: payload.content,
      timestamp: new Date().toISOString(),
      pending: true,
    };

    setIsSending(true);
    resetTextarea();

    try {
      await onSend(payload, pendingLocal);
    } catch (err) {
      // Error handling is done in parent component
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  }, [input, isConnected, onSend, senderType, crsPattern, resetTextarea]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return {
    input,
    isSending,
    textareaRef,
    handleChange,
    handleSend,
    handleKeyDown,
  };
}
