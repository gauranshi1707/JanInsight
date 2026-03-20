"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Cell
} from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopIssuesChartProps {
  expanded?: boolean
}

const issueData = [
  { name: "Water Supply", mentions: 547, sentiment: "negative" },
  { name: "Road Conditions", mentions: 423, sentiment: "negative" },
  { name: "Electricity", mentions: 312, sentiment: "positive" },
  { name: "Sanitation", mentions: 289, sentiment: "positive" },
  { name: "Healthcare", mentions: 234, sentiment: "positive" },
  { name: "Education", mentions: 198, sentiment: "positive" },
  { name: "Crime & Safety", mentions: 167, sentiment: "negative" },
  { name: "Employment", mentions: 124, sentiment: "positive" },
]

const trendingIssues = [
  { name: "Water Supply", trend: "up" as const },
  { name: "Road Conditions", trend: "down" as const },
  { name: "Electricity", trend: "stable" as const },
  { name: "Sanitation", trend: "down" as const },
]

function getBarColor(sentiment: string): string {
  return sentiment === "positive" ? "oklch(0.65 0.19 145)" : "oklch(0.60 0.21 25)"
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-chart-1" />
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-destructive" />
  return <Minus className="h-3 w-3 text-muted-foreground" />
}

function getTrendText(trend: "up" | "down" | "stable"): string {
  if (trend === "up") return "up"
  if (trend === "down") return "down"
  return "stable"
}

function getTrendColor(trend: "up" | "down" | "stable"): string {
  if (trend === "up") return "text-chart-1"
  if (trend === "down") return "text-destructive"
  return "text-muted-foreground"
}

export function TopIssuesChart({ expanded = false }: TopIssuesChartProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Card className={cn("bg-card border-border", expanded && "col-span-full")}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-card-foreground">Top Issues by Mentions</CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">Issue frequency and associated sentiment</p>
      </CardHeader>
      <CardContent>
        {/* Horizontal Bar Chart */}
        <div className="w-full" style={{ height: expanded ? 320 : 256 }}>
          {!isMounted ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : <ResponsiveContainer width="100%" height={expanded ? 320 : 256}>
            <BarChart
              data={issueData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                stroke="oklch(0.5 0 0)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 600]}
                ticks={[0, 150, 300, 450, 600]}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="oklch(0.7 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={75}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "oklch(0.18 0.025 250)", 
                  border: "1px solid oklch(0.3 0.04 250)",
                  borderRadius: "8px",
                  color: "oklch(0.98 0 0)"
                }}
                formatter={(value) => [`${value} mentions`, "Count"]}
                cursor={{ fill: 'oklch(0.3 0.04 250)', opacity: 0.2 }}
              />
              <Bar 
                dataKey="mentions" 
                radius={[0, 4, 4, 0]}
                maxBarSize={24}
              >
                {issueData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.sentiment)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          }
        </div>

        {/* Trending Issues Summary */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {trendingIssues.map((issue) => (
              <div key={issue.name} className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">{issue.name}</span>
                <div className="flex items-center gap-1">
                  <TrendIcon trend={issue.trend} />
                  <span className={cn("text-xs font-medium", getTrendColor(issue.trend))}>
                    {getTrendText(issue.trend)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
