"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts"
import { cn } from "@/lib/utils"

interface SentimentTrendsChartProps {
  expanded?: boolean
}

// Daily sentiment distribution data (March 4-17)
const sentimentTrendsData = [
  { date: "4 Mar", positive: 245, negative: 142, neutral: 178 },
  { date: "5 Mar", positive: 210, negative: 98, neutral: 165 },
  { date: "6 Mar", positive: 320, negative: 145, neutral: 198 },
  { date: "7 Mar", positive: 178, negative: 125, neutral: 145 },
  { date: "8 Mar", positive: 256, negative: 168, neutral: 187 },
  { date: "9 Mar", positive: 234, negative: 112, neutral: 156 },
  { date: "10 Mar", positive: 289, negative: 134, neutral: 178 },
  { date: "11 Mar", positive: 312, negative: 98, neutral: 198 },
  { date: "12 Mar", positive: 198, negative: 178, neutral: 167 },
  { date: "13 Mar", positive: 267, negative: 145, neutral: 189 },
  { date: "14 Mar", positive: 298, negative: 112, neutral: 201 },
  { date: "15 Mar", positive: 312, negative: 125, neutral: 187 },
  { date: "16 Mar", positive: 278, negative: 134, neutral: 178 },
  { date: "17 Mar", positive: 234, negative: 108, neutral: 195 },
]

export function SentimentTrendsChart({ expanded = false }: SentimentTrendsChartProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Card className={cn("bg-card border-border", expanded && "col-span-full")}>
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base text-card-foreground">Sentiment Trends</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Daily sentiment distribution over time</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
            <span className="text-xs text-muted-foreground">Positive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
            <span className="text-xs text-muted-foreground">Negative</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
            <span className="text-xs text-muted-foreground">Neutral</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: expanded ? 320 : 256 }}>
          {!isMounted ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : <ResponsiveContainer width="100%" height={expanded ? 320 : 256}>
            <AreaChart
              data={sentimentTrendsData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="positiveAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="negativeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="neutralAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="oklch(0.5 0 0)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="oklch(0.5 0 0)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 340]}
                ticks={[0, 85, 170, 255, 340]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "oklch(0.18 0.025 250)", 
                  border: "1px solid oklch(0.3 0.04 250)",
                  borderRadius: "8px",
                  color: "oklch(0.98 0 0)"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="positive" 
                stroke="#4ade80" 
                strokeWidth={2}
                fill="url(#positiveAreaGradient)"
                name="Positive"
              />
              <Area 
                type="monotone" 
                dataKey="neutral" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fill="url(#neutralAreaGradient)"
                name="Neutral"
              />
              <Area 
                type="monotone" 
                dataKey="negative" 
                stroke="#ef4444" 
                strokeWidth={2}
                fill="url(#negativeAreaGradient)"
                name="Negative"
              />
            </AreaChart>
          </ResponsiveContainer>
          }
        </div>
      </CardContent>
    </Card>
  )
}
