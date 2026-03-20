"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  ReferenceLine
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HistoricalTrendsProps {
  expanded?: boolean
}

// Historical sentiment data (last 30 days)
const sentimentHistoryData = [
  { date: "Feb 15", sentiment: 68, feedback: 2340, issues: 42 },
  { date: "Feb 16", sentiment: 65, feedback: 2456, issues: 48 },
  { date: "Feb 17", sentiment: 62, feedback: 2890, issues: 56 },
  { date: "Feb 18", sentiment: 58, feedback: 3120, issues: 62 },
  { date: "Feb 19", sentiment: 61, feedback: 2780, issues: 54 },
  { date: "Feb 20", sentiment: 64, feedback: 2450, issues: 47 },
  { date: "Feb 21", sentiment: 67, feedback: 2230, issues: 41 },
  { date: "Feb 22", sentiment: 70, feedback: 2100, issues: 38 },
  { date: "Feb 23", sentiment: 72, feedback: 2340, issues: 35 },
  { date: "Feb 24", sentiment: 69, feedback: 2567, issues: 40 },
  { date: "Feb 25", sentiment: 66, feedback: 2890, issues: 45 },
  { date: "Feb 26", sentiment: 68, feedback: 2654, issues: 42 },
  { date: "Feb 27", sentiment: 71, feedback: 2456, issues: 38 },
  { date: "Feb 28", sentiment: 74, feedback: 2234, issues: 34 },
  { date: "Mar 1", sentiment: 72, feedback: 2567, issues: 36 },
  { date: "Mar 2", sentiment: 70, feedback: 2890, issues: 39 },
  { date: "Mar 3", sentiment: 73, feedback: 2654, issues: 35 },
  { date: "Mar 4", sentiment: 75, feedback: 2432, issues: 32 },
  { date: "Mar 5", sentiment: 74, feedback: 2567, issues: 33 },
  { date: "Mar 6", sentiment: 72, feedback: 2789, issues: 37 },
  { date: "Mar 7", sentiment: 70, feedback: 2945, issues: 41 },
  { date: "Mar 8", sentiment: 68, feedback: 3120, issues: 45 },
  { date: "Mar 9", sentiment: 71, feedback: 2876, issues: 40 },
  { date: "Mar 10", sentiment: 73, feedback: 2654, issues: 37 },
  { date: "Mar 11", sentiment: 75, feedback: 2432, issues: 34 },
  { date: "Mar 12", sentiment: 76, feedback: 2345, issues: 31 },
  { date: "Mar 13", sentiment: 74, feedback: 2567, issues: 33 },
  { date: "Mar 14", sentiment: 72, feedback: 2789, issues: 36 },
  { date: "Mar 15", sentiment: 73, feedback: 2654, issues: 35 },
  { date: "Mar 16", sentiment: 72, feedback: 2847, issues: 34 },
]

// Issue popularity trends
const issueTrendsData = [
  { week: "Week 1", waterSupply: 45, drainage: 38, roads: 32, electricity: 25, sanitation: 28 },
  { week: "Week 2", waterSupply: 52, drainage: 35, roads: 41, electricity: 28, sanitation: 31 },
  { week: "Week 3", waterSupply: 48, drainage: 42, roads: 38, electricity: 32, sanitation: 35 },
  { week: "Week 4", waterSupply: 42, drainage: 48, roads: 35, electricity: 29, sanitation: 38 },
]

// Weekly comparison data
const weeklyComparisonData = [
  { day: "Mon", thisWeek: 72, lastWeek: 68 },
  { day: "Tue", thisWeek: 68, lastWeek: 71 },
  { day: "Wed", thisWeek: 75, lastWeek: 69 },
  { day: "Thu", thisWeek: 71, lastWeek: 72 },
  { day: "Fri", thisWeek: 69, lastWeek: 70 },
  { day: "Sat", thisWeek: 78, lastWeek: 74 },
  { day: "Sun", thisWeek: 82, lastWeek: 76 },
]

// Key metrics for quick view
const keyMetrics = [
  { 
    label: "Avg Sentiment", 
    current: "72%", 
    previous: "68%", 
    change: "+4%", 
    trend: "up" as const 
  },
  { 
    label: "Total Feedback", 
    current: "84.2K", 
    previous: "79.8K", 
    change: "+5.5%", 
    trend: "up" as const 
  },
  { 
    label: "Issues Resolved", 
    current: "156", 
    previous: "142", 
    change: "+9.8%", 
    trend: "up" as const 
  },
  { 
    label: "Response Time", 
    current: "2.4h", 
    previous: "3.1h", 
    change: "-22%", 
    trend: "up" as const 
  },
]

const issueColors: Record<string, string> = {
  waterSupply: "oklch(0.55 0.18 250)",
  drainage: "oklch(0.70 0.16 75)",
  roads: "oklch(0.60 0.21 25)",
  electricity: "oklch(0.65 0.19 145)",
  sanitation: "oklch(0.65 0.18 50)",
}

export function HistoricalTrends({ expanded = false }: HistoricalTrendsProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "14d" | "30d" | "90d">("30d")
  const [chartView, setChartView] = useState<"sentiment" | "issues" | "comparison">("sentiment")

  const getFilteredData = () => {
    switch (timeRange) {
      case "7d":
        return sentimentHistoryData.slice(-7)
      case "14d":
        return sentimentHistoryData.slice(-14)
      case "90d":
        // In real app, would fetch more data
        return sentimentHistoryData
      default:
        return sentimentHistoryData
    }
  }

  const currentAvg = Math.round(
    getFilteredData().reduce((acc, d) => acc + d.sentiment, 0) / getFilteredData().length
  )
  const previousAvg = Math.round(
    sentimentHistoryData.slice(0, 15).reduce((acc, d) => acc + d.sentiment, 0) / 15
  )
  const sentimentChange = currentAvg - previousAvg

  return (
    <Card className={cn("bg-card border-border", expanded && "h-full")}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg text-card-foreground">Historical Trends</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sentiment and issue trends over time
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 border-border">
                <Calendar className="h-3 w-3" />
                {timeRange === "7d" ? "7 Days" : 
                 timeRange === "14d" ? "14 Days" : 
                 timeRange === "30d" ? "30 Days" : "90 Days"}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange("7d")}>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("14d")}>Last 14 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("30d")}>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("90d")}>Last 90 Days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Chart Type Tabs */}
          <Tabs value={chartView} onValueChange={(v) => setChartView(v as typeof chartView)}>
            <TabsList className="bg-secondary">
              <TabsTrigger value="sentiment" className="text-xs">Sentiment</TabsTrigger>
              <TabsTrigger value="issues" className="text-xs">Issues</TabsTrigger>
              <TabsTrigger value="comparison" className="text-xs">Compare</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {keyMetrics.map((metric) => (
            <div 
              key={metric.label}
              className="rounded-lg bg-secondary/50 p-3"
            >
              <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-card-foreground">{metric.current}</span>
                <div className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  metric.trend === "up" ? "text-chart-1" : "text-destructive"
                )}>
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {metric.change}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">vs previous period</p>
            </div>
          ))}
        </div>

        {/* Main Chart Area */}
        <div className={cn("w-full", expanded ? "h-80" : "h-64")} style={{ minHeight: expanded ? 320 : 256 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={expanded ? 320 : 256}>
            {chartView === "sentiment" ? (
              <AreaChart data={getFilteredData()}>
                <defs>
                  <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.19 145)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="oklch(0.65 0.19 145)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="feedbackGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.18 250)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="oklch(0.55 0.18 250)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 250)" />
                <XAxis 
                  dataKey="date" 
                  stroke="oklch(0.65 0 0)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="oklch(0.65 0 0)" 
                  fontSize={11}
                  tickLine={false}
                  domain={[50, 100]}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="oklch(0.65 0 0)" 
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "oklch(0.18 0.025 250)", 
                    border: "1px solid oklch(0.3 0.04 250)",
                    borderRadius: "8px",
                    color: "oklch(0.98 0 0)"
                  }}
                />
                <Legend />
                <ReferenceLine 
                  yAxisId="left"
                  y={70} 
                  stroke="oklch(0.70 0.16 75)" 
                  strokeDasharray="5 5" 
                  label={{ value: "Target", fill: "oklch(0.70 0.16 75)", fontSize: 10 }}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="oklch(0.65 0.19 145)" 
                  strokeWidth={2}
                  fill="url(#sentimentGradient)"
                  name="Sentiment %"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="issues" 
                  stroke="oklch(0.60 0.21 25)" 
                  strokeWidth={2}
                  dot={false}
                  name="Active Issues"
                />
              </AreaChart>
            ) : chartView === "issues" ? (
              <BarChart data={issueTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 250)" />
                <XAxis dataKey="week" stroke="oklch(0.65 0 0)" fontSize={11} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "oklch(0.18 0.025 250)", 
                    border: "1px solid oklch(0.3 0.04 250)",
                    borderRadius: "8px",
                    color: "oklch(0.98 0 0)"
                  }}
                />
                <Legend />
                <Bar dataKey="waterSupply" fill={issueColors.waterSupply} name="Water Supply" radius={[2, 2, 0, 0]} />
                <Bar dataKey="drainage" fill={issueColors.drainage} name="Drainage" radius={[2, 2, 0, 0]} />
                <Bar dataKey="roads" fill={issueColors.roads} name="Roads" radius={[2, 2, 0, 0]} />
                <Bar dataKey="electricity" fill={issueColors.electricity} name="Electricity" radius={[2, 2, 0, 0]} />
                <Bar dataKey="sanitation" fill={issueColors.sanitation} name="Sanitation" radius={[2, 2, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={weeklyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 250)" />
                <XAxis dataKey="day" stroke="oklch(0.65 0 0)" fontSize={11} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={11} domain={[60, 90]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "oklch(0.18 0.025 250)", 
                    border: "1px solid oklch(0.3 0.04 250)",
                    borderRadius: "8px",
                    color: "oklch(0.98 0 0)"
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="thisWeek" 
                  stroke="oklch(0.65 0.19 145)" 
                  strokeWidth={3}
                  dot={{ fill: "oklch(0.65 0.19 145)", strokeWidth: 2 }}
                  name="This Week"
                />
                <Line 
                  type="monotone" 
                  dataKey="lastWeek" 
                  stroke="oklch(0.65 0 0)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Last Week"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Insights Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {sentimentChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-chart-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className="text-sm text-card-foreground">
                <span className={cn(
                  "font-semibold",
                  sentimentChange >= 0 ? "text-chart-1" : "text-destructive"
                )}>
                  {sentimentChange >= 0 ? "+" : ""}{sentimentChange}%
                </span>
                {" "}sentiment change
              </span>
            </div>
            <Badge variant="outline" className="border-border text-muted-foreground">
              Avg: {currentAvg}%
            </Badge>
          </div>
          
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View Detailed Report <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
