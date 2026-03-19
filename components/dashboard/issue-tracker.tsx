"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  MapPin, 
  Clock,
  AlertCircle,
  CheckCircle,
  Circle,
  ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Issue {
  id: string
  title: string
  ward: string
  booth: string
  category: string
  sentiment: number
  complaints: number
  status: "critical" | "in-progress" | "resolved"
  lastUpdated: string
  source: string
}

const issues: Issue[] = [
  {
    id: "ISS-001",
    title: "Water supply disruption - Main pipeline leak",
    ward: "Ward 7",
    booth: "Booth 012",
    category: "Water Supply",
    sentiment: 28,
    complaints: 42,
    status: "critical",
    lastUpdated: "2 hours ago",
    source: "CM Helpline"
  },
  {
    id: "ISS-002",
    title: "Drainage overflow near market area",
    ward: "Ward 3",
    booth: "Booth 005",
    category: "Drainage",
    sentiment: 35,
    complaints: 28,
    status: "critical",
    lastUpdated: "3 hours ago",
    source: "Twitter/X"
  },
  {
    id: "ISS-003",
    title: "Street light outage - Main road stretch",
    ward: "Ward 5",
    booth: "Booth 008",
    category: "Electricity",
    sentiment: 45,
    complaints: 19,
    status: "in-progress",
    lastUpdated: "5 hours ago",
    source: "WhatsApp"
  },
  {
    id: "ISS-004",
    title: "Road repair needed - Potholes reported",
    ward: "Ward 2",
    booth: "Booth 003",
    category: "Roads",
    sentiment: 52,
    complaints: 15,
    status: "in-progress",
    lastUpdated: "8 hours ago",
    source: "Direct App"
  },
  {
    id: "ISS-005",
    title: "Garbage collection delay",
    ward: "Ward 9",
    booth: "Booth 021",
    category: "Sanitation",
    sentiment: 68,
    complaints: 8,
    status: "resolved",
    lastUpdated: "1 day ago",
    source: "News Portal"
  },
]

const statusConfig = {
  critical: { 
    label: "Critical", 
    icon: AlertCircle, 
    className: "bg-destructive/20 text-destructive border-destructive/30" 
  },
  "in-progress": { 
    label: "In Progress", 
    icon: Circle, 
    className: "bg-chart-2/20 text-chart-2 border-chart-2/30" 
  },
  resolved: { 
    label: "Resolved", 
    icon: CheckCircle, 
    className: "bg-chart-1/20 text-chart-1 border-chart-1/30" 
  },
}

export function IssueTracker() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter ? issue.status === statusFilter : true
    return matchesSearch && matchesStatus
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base text-card-foreground">Active Issues</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Prioritized by sentiment impact</p>
        </div>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground">
          View All
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-sm bg-secondary/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-1">
            <Button
              variant={statusFilter === null ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(null)}
              className="h-8 text-xs"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "critical" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("critical")}
              className="h-8 text-xs"
            >
              Critical
            </Button>
            <Button
              variant={statusFilter === "in-progress" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("in-progress")}
              className="h-8 text-xs"
            >
              Active
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Issue</TableHead>
                <TableHead className="text-muted-foreground">Location</TableHead>
                <TableHead className="text-muted-foreground">Sentiment</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.map((issue) => {
                const status = statusConfig[issue.status]
                const StatusIcon = status.icon

                return (
                  <TableRow key={issue.id} className="border-border hover:bg-secondary/50">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-card-foreground line-clamp-1">{issue.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                            {issue.category}
                          </Badge>
                          <span>{issue.complaints} complaints</span>
                          <span>via {issue.source}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-card-foreground">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {issue.ward}, {issue.booth}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-2 w-16 rounded-full bg-secondary overflow-hidden"
                        )}>
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              issue.sentiment < 40 ? "bg-destructive" :
                              issue.sentiment < 60 ? "bg-chart-2" : "bg-chart-1"
                            )}
                            style={{ width: `${issue.sentiment}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          issue.sentiment < 40 ? "text-destructive" :
                          issue.sentiment < 60 ? "text-chart-2" : "text-chart-1"
                        )}>
                          {issue.sentiment}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("gap-1", status.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Assign Team</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                          <DropdownMenuItem>Ask AI for Insights</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>


      </CardContent>
    </Card>
  )
}
