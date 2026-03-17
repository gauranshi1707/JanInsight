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
  Volume2, 
  VolumeX,
  ChevronRight,
  MapPin,
  Clock,
  ExternalLink,
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

// Sample alerts data
const generateAlerts = (): Alert[] => [
  {
    id: "alert-1",
    type: "critical",
    title: "Negative sentiment spike in Kashmere Gate",
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
    title: "Issue trending: Unemployment concerns",
    description: "342 mentions in the last 3 hours across Twitter and WhatsApp",
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
    title: "Rising complaints in Paharganj area",
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
  {
    id: "alert-7",
    type: "trending",
    title: "New campaign feedback surge",
    description: "Positive response to recent cleanliness drive announcement",
    location: "Constituency-wide",
    time: "2 hours ago",
    metric: "1.2K",
    metricChange: "+540%",
    isRead: true,
    priority: 7,
  },
]

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    iconColor: "text-destructive",
    badgeClass: "bg-destructive/20 text-destructive border-destructive/30",
  },
  warning: {
    icon: TrendingDown,
    bgColor: "bg-chart-2/10",
    borderColor: "border-chart-2/30",
    iconColor: "text-chart-2",
    badgeClass: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  },
  trending: {
    icon: Flame,
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
    iconColor: "text-accent",
    badgeClass: "bg-accent/20 text-accent border-accent/30",
  },
  positive: {
    icon: TrendingUp,
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/30",
    iconColor: "text-chart-1",
    badgeClass: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  },
}

export function AlertsPanel({ expanded = false, onAlertClick }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "trending" | "positive">("all")
  const [isLive, setIsLive] = useState(true)

  // Simulate live alerts
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Randomly add a new alert occasionally
      if (Math.random() > 0.7) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: ["critical", "warning", "trending"][Math.floor(Math.random() * 3)] as Alert["type"],
          title: [
            "New complaint surge detected",
            "Sentiment change in progress",
            "Issue gaining traction",
          ][Math.floor(Math.random() * 3)],
          description: "AI detected a pattern that requires attention",
          location: `Ward ${Math.floor(Math.random() * 10) + 1}`,
          time: "Just now",
          metric: `${Math.floor(Math.random() * 100)}`,
          metricChange: `+${Math.floor(Math.random() * 30)}%`,
          isRead: false,
          priority: 0,
        }
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)])
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [isLive])

  const unreadCount = alerts.filter(a => !a.isRead).length
  const criticalCount = alerts.filter(a => a.type === "critical" && !a.isRead).length

  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter(a => a.type === filter)

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

  return (
    <Card className={cn("bg-card border-border", expanded && "h-full")}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-5 w-5 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <CardTitle className="text-lg text-card-foreground">Live Alerts</CardTitle>
            <p className="text-xs text-muted-foreground">
              {criticalCount > 0 && (
                <span className="text-destructive font-medium">{criticalCount} critical</span>
              )}
              {criticalCount > 0 && unreadCount - criticalCount > 0 && " · "}
              {unreadCount - criticalCount > 0 && `${unreadCount - criticalCount} new`}
              {unreadCount === 0 && "All caught up"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className={cn(
              "relative flex h-2 w-2",
              isLive && "animate-pulse"
            )}>
              <span className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                isLive ? "bg-chart-1 animate-ping" : "bg-muted-foreground"
              )} />
              <span className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                isLive ? "bg-chart-1" : "bg-muted-foreground"
              )} />
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsLive(!isLive)}
              className="h-6 px-2 text-xs"
            >
              {isLive ? "Live" : "Paused"}
            </Button>
          </div>

          {/* Sound toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-8 w-8"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 border-border">
                <Filter className="h-3 w-3" />
                {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All Alerts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("critical")}>Critical Only</DropdownMenuItem>
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
              className="text-xs text-muted-foreground"
            >
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className={cn(expanded ? "h-[calc(100vh-220px)]" : "h-80")}>
          <div className="space-y-2 p-4 pt-0">
            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No alerts to show</p>
                <p className="text-xs text-muted-foreground/70">You&apos;re all caught up!</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const config = alertConfig[alert.type]
                const Icon = config.icon

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "group relative rounded-lg border p-3 transition-all cursor-pointer hover:shadow-md",
                      config.bgColor,
                      config.borderColor,
                      !alert.isRead && "ring-1 ring-offset-1 ring-offset-background",
                      !alert.isRead && alert.type === "critical" && "ring-destructive/50"
                    )}
                    onClick={() => {
                      markAsRead(alert.id)
                      onAlertClick?.(alert)
                    }}
                  >
                    {/* Unread indicator */}
                    {!alert.isRead && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary" />
                    )}

                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        config.bgColor
                      )}>
                        <Icon className={cn("h-5 w-5", config.iconColor)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "font-medium text-sm text-card-foreground line-clamp-1",
                            !alert.isRead && "font-semibold"
                          )}>
                            {alert.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              dismissAlert(alert.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {alert.description}
                        </p>

                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {alert.location}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {alert.time}
                          </div>
                          {alert.metric && (
                            <Badge variant="outline" className={cn("text-[10px] py-0", config.badgeClass)}>
                              {alert.metric} 
                              {alert.metricChange && (
                                <span className="ml-1">{alert.metricChange}</span>
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>

        {/* Quick actions footer */}
        <div className="border-t border-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-destructive" /> {alerts.filter(a => a.type === "critical").length} Critical
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-chart-2" /> {alerts.filter(a => a.type === "warning").length} Warnings
            </span>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View History <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
