"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface MonthlyHoursChartProps {
  data: Array<{
    name: string
    hours: number
  }>
}

export function MonthlyHoursChart() {
  return null;
} 