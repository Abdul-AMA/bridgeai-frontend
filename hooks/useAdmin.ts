"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AdminAnalyticsQueryDTO,
  AdminOverviewStatsDTO,
  AdminTeamDetailDTO,
  AdminTeamListItemDTO,
  AdminTimeSeriesDTO,
  AdminUserDetailDTO,
  AdminUserListItemDTO,
  PaginatedResponseDTO,
} from "@/dto/admin.dto";
import {
  fetchAdminAnalytics,
  fetchAdminOverview,
  fetchAdminTeam,
  fetchAdminTeams,
  fetchAdminUser,
  fetchAdminUsers,
} from "@/services/admin.service";
import type {
  AdminTeamsParams,
  AdminUsersParams,
} from "@/lib/api-admin";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAsync<T>(fn: () => Promise<T>): AsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: Error) =>
        setState({ data: null, loading: false, error: err.message })
      );
  }, [fn]);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, refetch: run };
}

export function useAdminOverview() {
  return useAsync<AdminOverviewStatsDTO>(fetchAdminOverview);
}

export function useAdminUsers(params: AdminUsersParams = {}) {
  const fn = useCallback(
    () => fetchAdminUsers(params),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(params)]
  );
  return useAsync<PaginatedResponseDTO<AdminUserListItemDTO>>(fn);
}

export function useAdminUser(id: number) {
  const fn = useCallback(() => fetchAdminUser(id), [id]);
  return useAsync<AdminUserDetailDTO>(fn);
}

export function useAdminTeams(params: AdminTeamsParams = {}) {
  const fn = useCallback(
    () => fetchAdminTeams(params),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(params)]
  );
  return useAsync<PaginatedResponseDTO<AdminTeamListItemDTO>>(fn);
}

export function useAdminTeam(id: number) {
  const fn = useCallback(() => fetchAdminTeam(id), [id]);
  return useAsync<AdminTeamDetailDTO>(fn);
}

export function useAdminAnalytics(query: AdminAnalyticsQueryDTO) {
  const fn = useCallback(
    () => fetchAdminAnalytics(query),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(query)]
  );
  return useAsync<AdminTimeSeriesDTO>(fn);
}
