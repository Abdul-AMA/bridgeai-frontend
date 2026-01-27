/**
 * useChatScroll Hook
 * Manages auto-scroll behavior for chat messages
 */

import { useEffect, useRef } from "react";

export function useChatScroll(dependencies: ReadonlyArray<unknown> = []) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, dependencies);

  return bottomRef;
}
