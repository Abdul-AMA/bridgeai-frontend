"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AIUsageHistoryDTO,
  AIUsageSummaryDTO,
} from "@/dto/aiusage.dto";
import {
  AiUsageError,
  fetchUsageHistory,
  fetchUsageSummary,
} from "@/services/aiusage.service";

const HISTORY_PAGE_SIZE = 20;

export function useAIUsage(days = 30) {
  const [summary, setSummary] = useState<AIUsageSummaryDTO | null>(null);
  const [history, setHistory] = useState<AIUsageHistoryDTO | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchUsageSummary(days);
      setSummary(data);
    } catch (err) {
      if (err instanceof AiUsageError) {
        setError(err.message);
      } else {
        setError("Failed to load usage summary");
      }
    }
  }, [days]);

  const loadHistory = useCallback(async (page: number) => {
    try {
      const data = await fetchUsageHistory(page, HISTORY_PAGE_SIZE);
      setHistory(data);
    } catch (err) {
      if (err instanceof AiUsageError) {
        setError(err.message);
      } else {
        setError("Failed to load usage history");
      }
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([loadSummary(), loadHistory(1)]).finally(() =>
      setIsLoading(false)
    );
  }, [loadSummary, loadHistory]);

  const goToPage = useCallback(
    (page: number) => {
      setHistoryPage(page);
      loadHistory(page);
    },
    [loadHistory]
  );

  const totalHistoryPages = useMemo(
    () =>
      history ? Math.ceil(history.total / HISTORY_PAGE_SIZE) : 0,
    [history]
  );

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([loadSummary(), loadHistory(historyPage)]).finally(() =>
      setIsLoading(false)
    );
  }, [loadSummary, loadHistory, historyPage]);

  return {
    summary,
    history,
    historyPage,
    totalHistoryPages,
    isLoading,
    error,
    goToPage,
    refresh,
  };
}
