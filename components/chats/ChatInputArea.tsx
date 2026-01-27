/**
 * ChatInputArea Component
 * Handles user input for sending messages
 */

"use client";

import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConnectionState, CRSDTO } from "@/dto";

interface ChatInputAreaProps {
  input: string;
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  isSending: boolean;
  connectionState: ConnectionState;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  crsPattern: "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories";
  onPatternChange: (pattern: "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories") => void;
  latestCRS: CRSDTO | null;
}

export function ChatInputArea({
  input,
  onInputChange,
  onKeyDown,
  onSend,
  isSending,
  connectionState,
  textareaRef,
  crsPattern,
  onPatternChange,
  latestCRS,
}: ChatInputAreaProps) {
  const isUnderReview = latestCRS?.status === "under_review";
  const isRejected = latestCRS?.status === "rejected";

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      {isUnderReview && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          <div className="font-semibold mb-1">CRS Under Review</div>
          <div className="text-xs">
            Your CRS is currently being reviewed by the BA. You can continue chatting while waiting
            for follow-up questions or new features.
          </div>
        </div>
      )}

      {isRejected && latestCRS?.rejection_reason && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <div className="font-semibold mb-1">Your CRS was rejected</div>
          <div className="text-xs">Feedback: {latestCRS.rejection_reason}</div>
          <div className="text-xs mt-2">
            Please review the feedback and regenerate an improved version.
          </div>
        </div>
      )}

      <div className="flex gap-3 items-end">
        <div className="flex-1 flex flex-col gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message... (Shift+Enter for new line)"
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            className="min-h-[44px] max-h-[200px] resize-none overflow-y-auto"
            disabled={connectionState !== "open"}
            rows={1}
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Pattern:</span>
              <select
                value={crsPattern}
                onChange={(e) =>
                  onPatternChange(
                    e.target.value as "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories"
                  )
                }
                className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none cursor-pointer hover:text-gray-900 transition-colors"
                title="Select the requirements pattern for AI interpretation"
              >
                <option value="babok">BABOK</option>
                <option value="ieee_830">IEEE 830</option>
                <option value="iso_iec_ieee_29148">ISO 29148</option>
                <option value="agile_user_stories">Agile Stories</option>
              </select>
            </div>
            <span className="text-xs text-gray-400">Shift+Enter for new line</span>
          </div>
        </div>
        <Button
          onClick={onSend}
          variant="primary"
          disabled={isSending || connectionState !== "open"}
          className="h-[44px] mb-6"
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
