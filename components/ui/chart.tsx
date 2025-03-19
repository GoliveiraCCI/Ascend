"use client"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts"

interface BarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  className?: string
}

export const BarChart = ({
  data,
  index,
  categories = [],
  colors = [],
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  className,
}: BarChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={index}
            tickLine={false}
            axisLine={false}
            padding={{ left: 10, right: 10 }}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            width={yAxisWidth}
            tickLine={false}
            axisLine={false}
            tickFormatter={valueFormatter}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            formatter={valueFormatter}
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 11,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length] || `hsl(${i * 50}, 70%, 50%)`}
              radius={[4, 4, 0, 0]}
            >
              <LabelList dataKey={category} position="top" formatter={valueFormatter} fontSize={9} />
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface LineChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  className?: string
}

export const LineChart = ({
  data,
  index,
  categories = [],
  colors = [],
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  className,
}: LineChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={index}
            tickLine={false}
            axisLine={false}
            padding={{ left: 10, right: 10 }}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            width={yAxisWidth}
            tickLine={false}
            axisLine={false}
            tickFormatter={valueFormatter}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            formatter={valueFormatter}
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 11,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length] || `hsl(${i * 50}, 70%, 50%)`}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            >
              <LabelList dataKey={category} position="top" formatter={valueFormatter} fontSize={9} />
            </Line>
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface PieChartProps {
  data: any[]
  index: string
  category: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export const PieChart = ({
  data,
  index,
  category,
  colors = [],
  valueFormatter = (value) => `${value}`,
  className,
}: PieChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 20, right: 30, left: 30, bottom: 10 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey={category}
            nameKey={index}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={true}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={colors[i % colors.length] || `hsl(${i * 50}, 70%, 50%)`} />
            ))}
            <LabelList dataKey={category} position="outside" formatter={valueFormatter} fontSize={9} />
          </Pie>
          <Tooltip
            formatter={valueFormatter}
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
              fontSize: 11,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

