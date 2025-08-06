"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Edit3, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pie, PieChart, TooltipProps } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

interface FacilitiesByRegionPieChartProps {
  data: Record<string, number>
  chartTitleId: string // Required - MongoDB ObjectID of existing chart title
}

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function formatRegionName(region: string): string {
  return region
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

// Editable Title Component with DB Fetch
interface EditableTitleProps {
  titleId: string
  className?: string
}

const EditableTitle: React.FC<EditableTitleProps> = ({ 
  titleId,
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [tempTitle, setTempTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Use useCallback to fix the missing dependency warning
  const fetchTitle = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/chart-titles/${titleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Failed to fetch title`);
      }

      const fetchedTitle = result.data.name;
      setTitle(fetchedTitle);
      setTempTitle(fetchedTitle);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load title';
      setError(errorMessage);
      setTitle('Failed to load title');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [titleId]);

  // Fetch title from database on mount
  useEffect(() => {
    fetchTitle();
  }, [fetchTitle]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setTempTitle(title);
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setTempTitle(title);
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (tempTitle.trim() === '') {
      setError('Title cannot be empty');
      return;
    }

    if (tempTitle === title) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/chart-titles/${titleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: tempTitle.trim()
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      // Success - update UI
      setTitle(tempTitle.trim());
      setIsEditing(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update title');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <CardTitle className="text-xl font-semibold text-muted-foreground">
            Loading title...
          </CardTitle>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 space-y-1">
            <Input
              ref={inputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className={`text-xl font-semibold h-9 ${
                error ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
              disabled={isSaving}
              placeholder="Enter title..."
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          
          <div className="flex gap-1">
            <Button
              onClick={handleSave}
              disabled={isSaving || tempTitle.trim() === ''}
              size="sm"
              className="h-8 w-8 p-0"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              onClick={handleCancel}
              disabled={isSaving}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 group w-full">
          <CardTitle className="text-xl font-semibold text-foreground flex-1">
            {title}
          </CardTitle>
          <Button
            onClick={handleEdit}
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit3 className="h-3 w-3" />
            <span className="sr-only">Edit title</span>
          </Button>
        </div>
      )}
    </div>
  );
};

// Define proper types for the tooltip payload
interface ChartDataItem {
  browser: string;
  visitors: number;
  percentage: number;
  fill: string;
}

// Custom tooltip component to show percentages with proper typing
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataItem;
    return (
      <div className="bg-background border border-border rounded-md shadow-md p-3">
        <p className="font-medium text-foreground">{data.browser}</p>
        <p className="text-muted-foreground">{data.percentage}%</p>
      </div>
    );
  }
  return null;
};

export function FacilitiesByRegionPieChart({ data, chartTitleId }: FacilitiesByRegionPieChartProps) {
  // Calculate total for percentage calculation
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  
  const chartData: ChartDataItem[] = Object.entries(data).map(([region, count], index) => {
    // Calculate percentage
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return {
      browser: formatRegionName(region),
      visitors: count,
      percentage: parseFloat(percentage.toFixed(1)), // Round to 1 decimal place
      fill: chartColors[index % chartColors.length],
    };
  });

  const chartConfig: ChartConfig = {
    visitors: {
      label: "Facilities",
    },
  };

  return (
    <Card className="flex w-full h-full flex-col max-w-[400px]">
      <CardHeader className="items-center pb-0">
        <EditableTitle
          titleId={chartTitleId}
          className="w-full mb-2"
        />
        <CardDescription>Distribution of facilities across KSA regions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square h-[300px] mt-[40px] pb-0"
        >
          <PieChart>
            <ChartTooltip 
              content={<CustomTooltip />} 
              formatter={(value) => [`${value}%`, 'Percentage']} 
            />
            <Pie 
              data={chartData} 
              dataKey="visitors" 
              nameKey="browser"
              label={({ percentage }) => `${percentage}%`}
              labelLine={false}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}