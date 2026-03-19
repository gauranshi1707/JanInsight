"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Flame, 
  Bell, 
  X, 
  MapPin, 
  Clock,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Alert {
  id: string
  type: "critical" | "warning" | "trending" | "positive"
  title: string
  description: string
  location: string
  time: string
  metric?: string
  metricChange?: string
  isRead: boolean
  priority: number
}

interface AlertsPanelProps {
  expanded?: boolean
  onAlertClick?: (alert: Alert) => void
}

const generateAlerts = (): Alert[] => [
  {
    id: "alert-1",
    type: "critical",
    title: "Sentiment spike in Kashmere Gate",
    description: "Sentiment dropped 23% in the last hour due to water supply complaints",
    location: "Ward 5 - Kashmere Gate",
    time: "2 mins ago",
    metric: "35%",
    metricChange: "-23%",
    isRead: false,
    priority: 1,
  },
  {
    id: "alert-2",
    type: "trending",
    title: "Unemployment concerns trending",
    description: "342 mentions in the last 3 hours across social platforms",
    location: "Multiple Wards",
    time: "15 mins ago",
    metric: "342",
    metricChange: "+186%",
    isRead: false,
    priority: 2,
  },
  {
    id: "alert-3",
    type: "warning",
    title: "Rising complaints in Paharganj",
    description: "Road repair requests increased significantly overnight",
    location: "Ward 8 - Paharganj",
    time: "32 mins ago",
    metric: "47",
    metricChange: "+28",
    isRead: false,
    priority: 3,
  },
  {
    id: "alert-4",
    type: "critical",
    title: "Drainage overflow reported",
    description: "Multiple complaints about drainage issues near market area",
    location: "Ward 3 - Jama Masjid",
    time: "45 mins ago",
    metric: "12",
    metricChange: "+8",
    isRead: true,
    priority: 4,
  },
  {
    id: "alert-5",
    type: "positive",
    title: "Sentiment improvement in Civil Lines",
    description: "Water supply issue resolved, sentiment up 15%",
    location: "Ward 6 - Civil Lines",
    time: "1 hour ago",
    metric: "88%",
    metricChange: "+15%",
    isRead: true,
    priority: 5,
  },
  {
    id: "alert-6",
    type: "warning",
    title: "Electricity complaints rising",
    description: "Power outage complaints increasing in Karol Bagh",
    location: "Ward 9 - Karol Bagh",
    time: "1.5 hours ago",
    metric: "23",
    metricChange: "+12",
    isRead: true,
    priority: 6,
  },
]

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-l-destructive",
    label: "Critical",
  },
  warning: {
    icon: TrendingDown,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    border: "border-l-chart-2",
    label: "Warning",
  },
  trending: {
    icon: Flame,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-l-accent",
    label: "Trending",
  },
  positive: {
    icon: TrendingUp,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    border: "border-l-chart-1",
    label: "Positive",
  },
}

export function AlertsPanel({ expanded = false, onAlertClick }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts())
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "trending" | "positive">("all")

  const unreadCount = alerts.filter(a => !a.isRead).length
  const criticalCount = alerts.filter(a => a.type === "critical" && !a.isRead).length

  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter(a => a.type === filter)

  // Group alerts by category for better organization
  const groupedAlerts = {
    critical: filteredAlerts.filter(a => a.type === "critical"),
    warning: filteredAlerts.filter(a => a.type === "warning"),
    trending: filteredAlerts.filter(a => a.type === "trending"),
    positive: filteredAlerts.filter(a => a.type === "positive"),
  }

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, isRead: true } : a
    ))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId))
  }

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))
  }

  const renderAlertGroup = (type: keyof typeof groupedAlerts, alertsList: Alert[]) => {
    if (alertsList.length === 0) return null
    const config = alertConfig[type]
    
    return (
      <div key={type} className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <config.icon className={cn("h-3.5 w-3.5", config.color)} />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {config.label}
          </span>
          <span className="text-xs text-muted-foreground">({alertsList.length})</span>
        </div>
        <div className="space-y-1.5">
          {alertsList.map((alert) => {
            const alertCfg = alertConfig[alert.type]
            return (
              <div
                key={alert.id}
                className={cn(
                  "group relative rounded-md border-l-2 bg-secondary/30 p-3 transition-colors cursor-pointer hover:bg-secondary/50",
                  alertCfg.border,
                  !alert.isRead && "bg-secondary/50"
                )}
                onClick={() => {
                  markAsRead(alert.id)
                  onAlertClick?.(alert)
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm text-card-foreground line-clamp-1",
                      !alert.isRead && "font-medium"
                    )}>
                      {alert.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {alert.metric && (
                      <Badge variant="secondary" className="text-[10px] h-5">
                        {alert.metric}
                        {alert.metricChange && (
                          <span className={cn(
                            "ml-1",
                            alert.metricChange.startsWith("+") ? "text-chart-1" : "text-destructive"
                          )}>
                            {alert.metricChange}
                          </span>
                        )}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        dismissAlert(alert.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {!alert.isRead && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("bg-card border-border", expanded && "h-full")}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="h-4 w-4 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <CardTitle className="text-base text-card-foreground">Alerts</CardTitle>
            <p className="text-[10px] text-muted-foreground">
              {criticalCount > 0 && (
                <span className="text-destructive font-medium">{criticalCount} critical</span>
              )}
              {criticalCount > 0 && unreadCount - criticalCount > 0 && " | "}
              {unreadCount - criticalCount > 0 && `${unreadCount - criticalCount} new`}
              {unreadCount === 0 && "All caught up"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-xs border-border">
                <Filter className="h-3 w-3" />
                {filter === "all" ? "All" : alertConfig[filter].label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("critical")}>Critical</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("warning")}>Warnings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("trending")}>Trending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("positive")}>Positive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-7 text-[10px] text-muted-foreground"
            >
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className={cn(expanded ? "h-[calc(100vh-220px)]" : "h-72")}>
          <div className="space-y-4 p-4 pt-0">
            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-10 w-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No alerts</p>
              </div>
            ) : filter === "all" ? (
              // Show grouped alerts when viewing all
              <>
                {renderAlertGroup("critical", groupedAlerts.critical)}
                {renderAlertGroup("warning", groupedAlerts.warning)}
                {renderAlertGroup("trending", groupedAlerts.trending)}
                {renderAlertGroup("positive", groupedAlerts.positive)}
              </>
            ) : (
              // Show flat list when filtered
              <div className="space-y-1.5">
                {filteredAlerts.map((alert) => {
                  const alertCfg = alertConfig[alert.type]
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        "group relative rounded-md border-l-2 bg-secondary/30 p-3 transition-colors cursor-pointer hover:bg-secondary/50",
                        alertCfg.border,
                        !alert.isRead && "bg-secondary/50"
                      )}
                      onClick={() => {
                        markAsRead(alert.id)
                        onAlertClick?.(alert)
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm text-card-foreground line-clamp-1",
                            !alert.isRead && "font-medium"
                          )}>
                            {alert.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {alert.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {alert.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {alert.metric && (
                            <Badge variant="secondary" className="text-[10px] h-5">
                              {alert.metric}
                              {alert.metricChange && (
                                <span className={cn(
                                  "ml-1",
                                  alert.metricChange.startsWith("+") ? "text-chart-1" : "text-destructive"
                                )}>
                                  {alert.metricChange}
                                </span>
                              )}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              dismissAlert(alert.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Summary Footer */}
        <div className="border-t border-border px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
              {alerts.filter(a => a.type === "critical").length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />
              {alerts.filter(a => a.type === "warning").length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {alerts.filter(a => a.type === "trending").length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-chart-1" />
              {alerts.filter(a => a.type === "positive").length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
