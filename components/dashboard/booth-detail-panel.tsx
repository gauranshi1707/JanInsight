"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  X, 
  MapPin, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Minus,
  MessageSquare,
  AlertTriangle,
  Vote,
  Clock,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type BoothData } from "./booth-data"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart
} from "recharts"

interface BoothDetailPanelProps {
  booth: BoothData | null
  onClose: () => void
}

// Generate sample mini trend data for a booth
const generateMiniTrendData = () => {
  const data = []
  for (let i = 0; i < 7; i++) {
    data.push({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      sentiment: Math.floor(Math.random() * 30) + 50,
      feedback: Math.floor(Math.random() * 100) + 50,
    })
  }
  return data
}

export function BoothDetailPanel({ booth, onClose }: BoothDetailPanelProps) {
  if (!booth) return null

  const trendData = generateMiniTrendData()
  
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-chart-1" />
      case "down": return <TrendingDown className="h-4 w-4 text-destructive" />
      default: return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return "text-chart-1"
    if (sentiment >= 0.5) return "text-chart-2"
    return "text-destructive"
  }

  const getSentimentBg = (sentiment: number) => {
    if (sentiment >= 0.7) return "bg-chart-1/10"
    if (sentiment >= 0.5) return "bg-chart-2/10"
    return "bg-destructive/10"
  }

  return (
    <Card className="absolute right-4 top-4 bottom-4 w-80 z-[1000] bg-card/95 backdrop-blur border-border shadow-xl overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between pb-2 shrink-0">
        <div className="flex-1 min-w-0 pr-2">
          <CardTitle className="text-base text-card-foreground line-clamp-2">{booth.name}</CardTitle>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>Delhi Constituency</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
        {/* Sentiment Score Card */}
        <div className={cn("rounded-lg p-4", getSentimentBg(booth.sentiment))}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Sentiment Score</span>
            {getTrendIcon(booth.trend)}
          </div>
          <div className="flex items-end gap-2">
            <span className={cn("text-4xl font-bold font-mono", getSentimentColor(booth.sentiment))}>
              {Math.round(booth.sentiment * 100)}%
            </span>
            <span className={cn(
              "text-sm mb-1 font-mono",
              booth.trend === "up" ? "text-chart-1" : booth.trend === "down" ? "text-destructive" : "text-muted-foreground"
            )}>
              {booth.trend === "up" ? "+5%" : booth.trend === "down" ? "-3%" : "0%"} this week
            </span>
          </div>
          <Progress 
            value={booth.sentiment * 100} 
            className="h-2 mt-2"
          />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-chart-4" />
              <span className="text-xs text-muted-foreground">Population</span>
            </div>
            <span className="text-lg font-semibold text-card-foreground font-mono">
              {booth.population.toLocaleString()}
            </span>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Vote className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Voter Turnout</span>
            </div>
            <span className="text-lg font-semibold text-card-foreground font-mono">
              {booth.voterTurnout}%
            </span>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-chart-1" />
              <span className="text-xs text-muted-foreground">Feedback</span>
            </div>
            <span className="text-lg font-semibold text-card-foreground font-mono">
              {booth.feedbackCount.toLocaleString()}
            </span>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Active Issues</span>
            </div>
            <span className={cn(
              "text-lg font-semibold font-mono",
              booth.issues > 8 ? "text-destructive" : "text-card-foreground"
            )}>
              {booth.issues}
            </span>
          </div>
        </div>

        {/* Mini Trend Chart */}
        <div className="rounded-lg border border-border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-card-foreground">7-Day Trend</span>
            <Badge variant="secondary" className="text-[10px]">Live</Badge>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="boothSentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.19 145)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="oklch(0.65 0.19 145)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'oklch(0.65 0 0)' }}
                />
                <YAxis hide domain={[40, 90]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "oklch(0.18 0.025 250)", 
                    border: "1px solid oklch(0.3 0.04 250)",
                    borderRadius: "6px",
                    color: "oklch(0.98 0 0)",
                    fontSize: "12px"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="oklch(0.65 0.19 145)" 
                  strokeWidth={2}
                  fill="url(#boothSentimentGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Issues */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-card-foreground">Top Issues</span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {booth.topIssues.map((issue, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm text-card-foreground">{issue}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Last updated: {booth.lastUpdated}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 gap-2" size="sm">
            <ExternalLink className="h-4 w-4" />
            Full Report
          </Button>
          <Button variant="outline" className="flex-1 gap-2" size="sm">
            <MessageSquare className="h-4 w-4" />
            Ask AI
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
