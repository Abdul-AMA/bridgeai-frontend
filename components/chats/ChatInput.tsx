"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  crsPattern?: string;
  onCrsPatternChange?: (pattern: "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories") => void;
}

const ChatInput = ({ onSend, disabled, crsPattern, onCrsPatternChange }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="relative bg-chat-input rounded-2xl border border-border shadow-lg shadow-primary/5 transition-shadow duration-200 focus-within:shadow-xl focus-within:shadow-primary/10 focus-within:border-primary/20">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          disabled={disabled}
          rows={1}
          className="w-full resize-none bg-transparent px-5 py-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 min-h-[56px] max-h-[200px]"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          className={`absolute right-3 bottom-0 top-0 my-auto h-10 w-10 flex items-center justify-center rounded-xl text-white transition-all duration-200 ${message.trim() && !disabled ? "bg-[rgb(52,27,171)] hover:bg-[rgb(52,27,171)]/90 shadow-md shadow-purple-200" : "bg-primary/10 text-primary/40 cursor-not-allowed"}`}
          style={{ bottom: "12px", top: "auto" }} // Fixed positioning to bottom right
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex justify-between items-center px-2 mt-3 text-xs text-muted-foreground">
        {onCrsPatternChange && crsPattern ? (
          <div className="flex items-center gap-2">
            <span className="opacity-70">Pattern:</span>
            <select
              value={crsPattern}
              onChange={(e) => onCrsPatternChange(e.target.value as any)}
              className="bg-transparent font-medium hover:text-foreground focus:outline-none cursor-pointer transition-colors"
              title="Select the requirements pattern for AI interpretation"
            >
              <option value="babok">BABOK</option>
              <option value="ieee_830">IEEE 830</option>
              <option value="iso_iec_ieee_29148">ISO 29148</option>
              <option value="agile_user_stories">Agile Stories</option>
            </select>
          </div>
        ) : (
          <div /> // Spacer
        )}
        <p>Press Enter to send, Shift + Enter for new line</p>
      </div>
    </motion.div>
  );
};

export default ChatInput;
