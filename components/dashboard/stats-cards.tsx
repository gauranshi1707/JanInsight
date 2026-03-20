"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, MessageSquare, AlertTriangle, ThumbsUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Overall Sentiment",
    value: "72%",
    change: "+5.2%",
    trend: "up",
    icon: ThumbsUp,
    color: "text-chart-1",
  },
  {
    label: "Active Issues",
    value: "156",
    change: "-12",
    trend: "down",
    icon: AlertTriangle,
    color: "text-chart-2",
  },
  {
    label: "Feedback Today",
    value: "2,847",
    change: "+324",
    trend: "up",
    icon: MessageSquare,
    color: "text-chart-4",
  },
  {
    label: "Citizens Reached",
    value: "45.2K",
    change: "+2.1K",
    trend: "up",
    icon: Users,
    color: "text-primary",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
        
        return (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-card-foreground font-mono">{stat.value}</p>
                    <div className="flex items-center gap-0.5">
                      <TrendIcon 
                        className={cn(
                          "h-3.5 w-3.5",
                          stat.trend === "up" ? "text-chart-1" : "text-destructive"
                        )} 
                      />
                      <span 
                        className={cn(
                          "text-xs font-medium font-mono",
                          stat.trend === "up" ? "text-chart-1" : "text-destructive"
                        )}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
                <Icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
