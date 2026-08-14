import { api } from '../apiCaller';
import { axiosInstance } from '../axiosInstance';
import type {
  ActivityEntity,
  ApiResponse,
  HealthEntity,
  StatsEntity,
  SystemEntity,
} from '../types';

/**
 * Dashboard aggregates, the activity feed and runtime telemetry — all computed
 * server-side from the live collections.
 */
export const insightsService = {
  async getStats(days = 30): Promise<ApiResponse<StatsEntity | null>> {
    const res = await api.get<StatsEntity>('/admin/stats', { days });
    return res.success ? res : { ...res, data: null };
  },

  async getActivity(limit = 12): Promise<ApiResponse<ActivityEntity[]>> {
    const res = await api.get<{ items: ActivityEntity[] }>('/admin/activity', { limit });
    return res.success ? { ...res, data: res.data?.items ?? [] } : { ...res, data: [] };
  },

  async getSystem(): Promise<ApiResponse<SystemEntity | null>> {
    const res = await api.get<SystemEntity>('/admin/system');
    return res.success ? res : { ...res, data: null };
  },

  /**
   * Health probe. Measures the real round-trip and reports a degraded backend
   * honestly instead of always showing "Ready".
   */
  async getHealth(): Promise<ApiResponse<HealthEntity | null>> {
    const start = performance.now();
    try {
      const response = await axiosInstance.get<HealthEntity>('/health');
      return {
        data: { ...response.data, latencyMs: Math.round(performance.now() - start) },
        status: response.status,
        success: true,
        message: 'Success',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      // A 503 still carries a usable body — the API is up but the database is not.
      const body = error?.data;
      if (body?.database) {
        return {
          data: { ...body, latencyMs: Math.round(performance.now() - start) },
          status: error?.status || 503,
          success: false,
          message: 'Backend reachable but degraded.',
          timestamp: new Date().toISOString(),
        };
      }
      return {
        data: null,
        status: error?.status || 0,
        success: false,
        message: error?.message || 'Backend unreachable.',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
