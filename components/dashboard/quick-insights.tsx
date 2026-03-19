"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  RefreshCw,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Insight {
  id: string
  type: "opportunity" | "warning" | "trend" | "action"
  title: string
  description: string
  metric?: string
  priority: "high" | "medium" | "low"
}

const generateInsights = (): Insight[] => [
  {
    id: "1",
    type: "warning",
    title: "Sentiment declining in 3 wards",
    description: "Kashmere Gate, Paharganj, and Jama Masjid show 15-23% decline",
    metric: "-19%",
    priority: "high",
  },
  {
    id: "2",
    type: "opportunity",
    title: "High engagement window",
    description: "Evening hours show 3x more feedback - schedule announcements then",
    metric: "3x",
    priority: "medium",
  },
  {
    id: "3",
    type: "trend",
    title: "Road complaints trending",
    description: "42% increase this week - monsoon preparation may be needed",
    metric: "+42%",
    priority: "high",
  },
  {
    id: "4",
    type: "action",
    title: "Quick win available",
    description: "Single pipeline repair could resolve 67% of Civil Lines complaints",
    metric: "+12%",
    priority: "medium",
  },
]

const insightConfig = {
  opportunity: {
    icon: Lightbulb,
    color: "text-chart-1",
    border: "border-l-chart-1",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-destructive",
    border: "border-l-destructive",
  },
  trend: {
    icon: TrendingUp,
    color: "text-chart-4",
    border: "border-l-chart-4",
  },
  action: {
    icon: Target,
    color: "text-primary",
    border: "border-l-primary",
  },
}

interface QuickInsightsProps {
  compact?: boolean
}

export function QuickInsights({ compact = false }: QuickInsightsProps) {
  const [insights] = useState<Insight[]>(generateInsights())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const refreshInsights = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const highPriorityCount = insights.filter(i => i.priority === "high").length

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">AI Insights</span>
          {highPriorityCount > 0 && (
            <Badge variant="secondary" className="text-[9px] h-4 bg-destructive/20 text-destructive">
              {highPriorityCount} urgent
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          {insights.slice(0, 3).map((insight) => {
            const config = insightConfig[insight.type]
            const Icon = config.icon
            return (
              <div 
                key={insight.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded border-l-2 bg-secondary/30",
                  config.border
                )}
              >
                <Icon className={cn("h-3.5 w-3.5 shrink-0", config.color)} />
                <span className="text-xs text-card-foreground line-clamp-1 flex-1">{insight.title}</span>
                {insight.metric && (
                  <span className={cn("text-[10px] font-medium", config.color)}>{insight.metric}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base text-card-foreground">AI Insights</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Analysis and recommendations</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshInsights}
          disabled={isRefreshing}
          className="h-7 w-7 p-0"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
        </Button>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {insights.map((insight) => {
          const config = insightConfig[insight.type]
          const Icon = config.icon
          const isExpanded = expandedId === insight.id

          return (
            <div 
              key={insight.id}
              className={cn(
                "rounded border-l-2 bg-secondary/30 p-3 cursor-pointer transition-colors hover:bg-secondary/50",
                config.border
              )}
              onClick={() => setExpandedId(isExpanded ? null : insight.id)}
            >
              <div className="flex items-start gap-2.5">
                <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", config.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-card-foreground">{insight.title}</p>
                    {insight.metric && (
                      <span className={cn(
                        "text-sm font-semibold shrink-0",
                        insight.metric.startsWith("-") ? "text-destructive" : 
                        insight.metric.startsWith("+") ? "text-chart-1" : config.color
                      )}>
                        {insight.metric}
                      </span>
                    )}
                  </div>
                  {isExpanded && (
                    <p className="text-xs text-muted-foreground mt-1.5">{insight.description}</p>
                  )}
                </div>
                <ChevronRight className={cn(
                  "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
                  isExpanded && "rotate-90"
                )} />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
