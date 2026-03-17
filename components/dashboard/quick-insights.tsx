"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Zap,
  Brain
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Insight {
  id: string
  type: "opportunity" | "warning" | "trend" | "action"
  title: string
  description: string
  metric?: string
  confidence: number
  priority: "high" | "medium" | "low"
}

const generateInsights = (): Insight[] => [
  {
    id: "1",
    type: "warning",
    title: "Sentiment declining in 3 wards",
    description: "Kashmere Gate, Paharganj, and Jama Masjid show 15-23% decline. Water supply is the common issue.",
    metric: "-19%",
    confidence: 92,
    priority: "high",
  },
  {
    id: "2",
    type: "opportunity",
    title: "High engagement window detected",
    description: "Evening hours (6-8 PM) show 3x more feedback. Consider scheduling announcements during this time.",
    metric: "3x",
    confidence: 88,
    priority: "medium",
  },
  {
    id: "3",
    type: "trend",
    title: "Road complaints trending upward",
    description: "42% increase in road-related complaints this week. Monsoon preparation may be needed.",
    metric: "+42%",
    confidence: 85,
    priority: "high",
  },
  {
    id: "4",
    type: "action",
    title: "Quick win: Civil Lines water issue",
    description: "Single pipeline repair could resolve 67% of complaints in Civil Lines. Estimated impact: +12% sentiment.",
    metric: "+12%",
    confidence: 78,
    priority: "medium",
  },
  {
    id: "5",
    type: "opportunity",
    title: "Positive response to cleanliness drive",
    description: "Connaught Place showing 91% positive sentiment after recent campaign. Consider expanding.",
    metric: "91%",
    confidence: 95,
    priority: "low",
  },
]

const insightConfig = {
  opportunity: {
    icon: Lightbulb,
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/30",
    iconColor: "text-chart-1",
    label: "Opportunity",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    iconColor: "text-destructive",
    label: "Warning",
  },
  trend: {
    icon: TrendingUp,
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4/30",
    iconColor: "text-chart-4",
    label: "Trend",
  },
  action: {
    icon: Target,
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    iconColor: "text-primary",
    label: "Action",
  },
}

interface QuickInsightsProps {
  compact?: boolean
}

export function QuickInsights({ compact = false }: QuickInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>(generateInsights())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)

  const refreshInsights = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setInsights(generateInsights())
      setIsRefreshing(false)
    }, 1500)
  }

  // Auto refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setInsights(generateInsights())
    }, 120000)
    return () => clearInterval(interval)
  }, [])

  const highPriorityCount = insights.filter(i => i.priority === "high").length

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-card-foreground">AI Insights</span>
            {highPriorityCount > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5">
                {highPriorityCount} urgent
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshInsights}
            disabled={isRefreshing}
            className="h-7 px-2"
          >
            <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
          </Button>
        </div>
        <div className="space-y-1.5">
          {insights.slice(0, 3).map((insight) => {
            const config = insightConfig[insight.type]
            const Icon = config.icon
            return (
              <div 
                key={insight.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors hover:bg-secondary/50",
                  config.bgColor,
                  config.borderColor
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", config.iconColor)} />
                <span className="text-xs text-card-foreground line-clamp-1 flex-1">{insight.title}</span>
                {insight.metric && (
                  <Badge variant="secondary" className="text-[10px] shrink-0">{insight.metric}</Badge>
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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base text-card-foreground">AI Quick Insights</CardTitle>
            <p className="text-xs text-muted-foreground">Real-time analysis and recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {highPriorityCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <Zap className="h-3 w-3" />
              {highPriorityCount} Urgent
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshInsights}
            disabled={isRefreshing}
            className="gap-1"
          >
            <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {insights.map((insight) => {
          const config = insightConfig[insight.type]
          const Icon = config.icon
          const isExpanded = expandedInsight === insight.id

          return (
            <div 
              key={insight.id}
              className={cn(
                "rounded-lg border p-3 cursor-pointer transition-all",
                config.bgColor,
                config.borderColor,
                isExpanded && "ring-1 ring-offset-1 ring-offset-background ring-primary/50"
              )}
              onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  config.bgColor
                )}>
                  <Icon className={cn("h-5 w-5", config.iconColor)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={cn("text-[10px] py-0", config.borderColor, config.iconColor)}>
                          {config.label}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-[10px] py-0",
                            insight.priority === "high" && "bg-destructive/20 text-destructive",
                            insight.priority === "medium" && "bg-chart-2/20 text-chart-2"
                          )}
                        >
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm text-card-foreground">{insight.title}</p>
                    </div>
                    {insight.metric && (
                      <span className={cn(
                        "text-lg font-bold shrink-0",
                        insight.metric.startsWith("+") ? "text-chart-1" : 
                        insight.metric.startsWith("-") ? "text-destructive" : config.iconColor
                      )}>
                        {insight.metric}
                      </span>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">AI Confidence:</span>
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  insight.confidence >= 85 ? "bg-chart-1" : 
                                  insight.confidence >= 70 ? "bg-chart-2" : "bg-destructive"
                                )}
                                style={{ width: `${insight.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-card-foreground">{insight.confidence}%</span>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                          Take Action <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <Button variant="outline" className="w-full gap-2" size="sm">
          <Brain className="h-4 w-4" />
          Ask AI for More Insights
        </Button>
      </CardContent>
    </Card>
  )
}
