// types/chart-title.ts
export interface ChartTitle {
  id: string;
  name: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChartTitleRequest {
  name: string;
  notes?: string;
}

export interface UpdateChartTitleRequest {
  name: string;
  notes?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type ChartTitleApiResponse = ApiResponse<ChartTitle>;
export type ChartTitlesApiResponse = ApiResponse<ChartTitle[]>;