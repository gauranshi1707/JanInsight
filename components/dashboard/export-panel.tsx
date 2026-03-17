"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Calendar,
  Clock,
  CheckCircle,
  Loader2,
  Settings,
  Mail,
  Share2,
  FolderOpen,
  ChevronDown,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ExportPanelProps {
  expanded?: boolean
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: typeof FileText
  sections: string[]
  estimatedPages: number
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "daily",
    name: "Daily Summary Report",
    description: "Quick overview of today's key metrics and alerts",
    icon: FileText,
    sections: ["Executive Summary", "Key Metrics", "Top Issues", "Sentiment Overview"],
    estimatedPages: 3,
  },
  {
    id: "weekly",
    name: "Weekly Analysis Report",
    description: "Comprehensive weekly performance analysis",
    icon: FileText,
    sections: ["Executive Summary", "Sentiment Trends", "Issue Analysis", "Ward Comparison", "Action Items"],
    estimatedPages: 8,
  },
  {
    id: "monthly",
    name: "Monthly Performance Report",
    description: "Detailed monthly report with historical comparison",
    icon: FileText,
    sections: ["Executive Summary", "Monthly Trends", "Issue Resolution", "Citizen Engagement", "Recommendations"],
    estimatedPages: 15,
  },
  {
    id: "custom",
    name: "Custom Report",
    description: "Build a report with selected sections",
    icon: Settings,
    sections: [],
    estimatedPages: 0,
  },
]

const exportSections = [
  { id: "summary", label: "Executive Summary", description: "Overview and key highlights" },
  { id: "sentiment", label: "Sentiment Analysis", description: "Detailed sentiment breakdowns" },
  { id: "issues", label: "Issue Tracker", description: "Active and resolved issues" },
  { id: "wards", label: "Ward-wise Analysis", description: "Performance by ward/booth" },
  { id: "trends", label: "Historical Trends", description: "Charts and trend analysis" },
  { id: "alerts", label: "Alerts History", description: "Critical alerts and responses" },
  { id: "feedback", label: "Feedback Analysis", description: "Citizen feedback breakdown" },
  { id: "recommendations", label: "AI Recommendations", description: "AI-generated suggestions" },
]

const recentExports = [
  { name: "Weekly_Report_Mar10-16.pdf", date: "Mar 16, 2026", size: "2.4 MB", type: "pdf" },
  { name: "Issue_Data_Export.csv", date: "Mar 15, 2026", size: "156 KB", type: "csv" },
  { name: "Monthly_Report_Feb.pdf", date: "Mar 1, 2026", size: "4.8 MB", type: "pdf" },
  { name: "Sentiment_Data_Q1.csv", date: "Feb 28, 2026", size: "892 KB", type: "csv" },
]

export function ExportPanel({ expanded = false }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "csv">("pdf")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("weekly")
  const [selectedSections, setSelectedSections] = useState<string[]>(["summary", "sentiment", "issues", "trends"])
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">("week")
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportComplete, setExportComplete] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleExport = () => {
    setIsExporting(true)
    setExportProgress(0)
    setExportComplete(false)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          setExportComplete(true)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)
  }

  const downloadSampleCSV = () => {
    const csvContent = `Date,Ward,Booth,Sentiment,Issues,Feedback Count,Top Issue
2026-03-16,Ward 1,Booth 001,82,3,847,Water Supply
2026-03-16,Ward 2,Booth 002,65,7,623,Drainage
2026-03-16,Ward 3,Booth 003,45,12,1124,Roads
2026-03-16,Ward 4,Booth 004,78,4,412,Electricity
2026-03-16,Ward 5,Booth 005,35,15,1456,Sanitation`
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `JanInsight_Export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className={cn("bg-card border-border", expanded && "h-full")}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg text-card-foreground">Export Reports</CardTitle>
          <p className="text-sm text-muted-foreground">Generate PDF reports or export data as CSV</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Quick Export
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Quick Export</DialogTitle>
              <DialogDescription>
                Export current dashboard data instantly
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 h-20 flex-col gap-2"
                  onClick={handleExport}
                >
                  <FileText className="h-6 w-6 text-primary" />
                  <span>PDF Report</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-20 flex-col gap-2"
                  onClick={downloadSampleCSV}
                >
                  <FileSpreadsheet className="h-6 w-6 text-chart-1" />
                  <span>CSV Data</span>
                </Button>
              </div>
              {isExporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Generating report...</span>
                    <span>{Math.round(exportProgress)}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </div>
              )}
              {exportComplete && (
                <div className="flex items-center gap-2 text-chart-1 bg-chart-1/10 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>Export complete! Your download will start automatically.</span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
            <TabsTrigger value="history">Export History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            {/* Format Selection */}
            <div className="flex gap-3">
              <Button
                variant={selectedFormat === "pdf" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => setSelectedFormat("pdf")}
              >
                <FileText className="h-4 w-4" />
                PDF Report
              </Button>
              <Button
                variant={selectedFormat === "csv" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => setSelectedFormat("csv")}
              >
                <FileSpreadsheet className="h-4 w-4" />
                CSV Export
              </Button>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Date Range</Label>
              <div className="flex gap-2">
                {[
                  { value: "today", label: "Today" },
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                  { value: "custom", label: "Custom" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={dateRange === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange(option.value as typeof dateRange)}
                    className="flex-1"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {selectedFormat === "pdf" && (
              <>
                {/* Report Templates */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Report Template</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {reportTemplates.map((template) => {
                      const Icon = template.icon
                      return (
                        <div
                          key={template.id}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-all",
                            selectedTemplate === template.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          )}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="flex items-start gap-2">
                            <Icon className={cn(
                              "h-4 w-4 mt-0.5",
                              selectedTemplate === template.id ? "text-primary" : "text-muted-foreground"
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-card-foreground">{template.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                              {template.estimatedPages > 0 && (
                                <Badge variant="secondary" className="mt-1 text-[10px]">
                                  ~{template.estimatedPages} pages
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Sections Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Include Sections</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-xs"
                    >
                      {showAdvanced ? "Hide" : "Show"} All
                      <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", showAdvanced && "rotate-180")} />
                    </Button>
                  </div>
                  <div className={cn(
                    "grid gap-2 transition-all",
                    showAdvanced ? "grid-cols-1" : "grid-cols-2"
                  )}>
                    {(showAdvanced ? exportSections : exportSections.slice(0, 4)).map((section) => (
                      <div
                        key={section.id}
                        className={cn(
                          "flex items-start gap-3 p-2 rounded-lg border transition-all",
                          selectedSections.includes(section.id)
                            ? "border-primary/50 bg-primary/5"
                            : "border-border"
                        )}
                      >
                        <Checkbox
                          id={section.id}
                          checked={selectedSections.includes(section.id)}
                          onCheckedChange={() => toggleSection(section.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <Label htmlFor={section.id} className="text-sm cursor-pointer">
                            {section.label}
                          </Label>
                          {showAdvanced && (
                            <p className="text-xs text-muted-foreground">{section.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Export Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button 
                className="flex-1 gap-2" 
                onClick={selectedFormat === "csv" ? downloadSampleCSV : handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    {selectedFormat === "pdf" ? "Generate PDF" : "Export CSV"}
                  </>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Mail className="h-4 w-4" /> Email Report
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Share2 className="h-4 w-4" /> Share Link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Calendar className="h-4 w-4" /> Schedule Export
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Progress */}
            {isExporting && (
              <div className="space-y-2 p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-card-foreground">Generating report...</span>
                  <span className="text-muted-foreground">{Math.round(exportProgress)}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Compiling sentiment data and generating charts...
                </p>
              </div>
            )}

            {exportComplete && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-chart-1/10 border border-chart-1/30">
                <CheckCircle className="h-5 w-5 text-chart-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Export complete!</p>
                  <p className="text-xs text-muted-foreground">Your download should start automatically</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setExportComplete(false)}>
                  Done
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Recent exports</p>
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <FolderOpen className="h-3 w-3" /> View All
              </Button>
            </div>
            
            <div className="space-y-2">
              {recentExports.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                >
                  {file.type === "pdf" ? (
                    <FileText className="h-8 w-8 text-destructive/70" />
                  ) : (
                    <FileSpreadsheet className="h-8 w-8 text-chart-1/70" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{file.date}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Scheduled Exports */}
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Scheduled Export Active</p>
                  <p className="text-xs text-muted-foreground">Weekly report generates every Monday at 6:00 AM</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  Manage
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
