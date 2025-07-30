// lib/api/chart-titles.ts
import { 
  ChartTitle, 
  CreateChartTitleRequest, 
  UpdateChartTitleRequest,
  ChartTitleApiResponse,
  ChartTitlesApiResponse 
} from '@/types/chart-title';

const API_BASE_URL = '/api/chart-titles';

export class ChartTitleAPI {
  // Fetch all chart titles
  static async getAll(): Promise<ChartTitle[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: ChartTitlesApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch chart titles');
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching chart titles:', error);
      throw error;
    }
  }

  // Fetch a specific chart title
  static async getById(id: string): Promise<ChartTitle> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: ChartTitleApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch chart title');
      }

      return result.data!;
    } catch (error) {
      console.error('Error fetching chart title:', error);
      throw error;
    }
  }

  // Create a new chart title
  static async create(data: CreateChartTitleRequest): Promise<ChartTitle> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ChartTitleApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create chart title');
      }

      return result.data!;
    } catch (error) {
      console.error('Error creating chart title:', error);
      throw error;
    }
  }

  // Update a chart title
  static async update(id: string, data: UpdateChartTitleRequest): Promise<ChartTitle> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ChartTitleApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update chart title');
      }

      return result.data!;
    } catch (error) {
      console.error('Error updating chart title:', error);
      throw error;
    }
  }

  // Delete a chart title
  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete chart title');
      }
    } catch (error) {
      console.error('Error deleting chart title:', error);
      throw error;
    }
  }
}