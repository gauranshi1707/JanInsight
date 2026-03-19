"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { StatsCards } from "./stats-cards"
import { SentimentChart } from "./sentiment-chart"
import { BoothHeatmap } from "./booth-heatmap"
import { AICoPilot } from "./ai-copilot"
import { IssueTracker } from "./issue-tracker"
import { LanguageBreakdown } from "./language-breakdown"
import { AlertsPanel } from "./alerts-panel"
import { HistoricalTrends } from "./historical-trends"
import { ExportPanel } from "./export-panel"
import { QuickInsights } from "./quick-insights"
import { TopIssuesChart } from "./top-issues-chart"
import { SentimentTrendsChart } from "./sentiment-trends-chart"

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex h-screen overflow-hidden bg-background" suppressHydrationWarning>
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Key Metrics Section */}
              <section>
                <StatsCards />
              </section>
              
              {/* Primary Analytics - Map and Sentiment */}
              <section className="grid gap-6 xl:grid-cols-5">
                <div className="xl:col-span-3">
                  <BoothHeatmap />
                </div>
                <div className="xl:col-span-2">
                  <SentimentChart />
                </div>
              </section>
              
              {/* Secondary Analytics - Issues and Charts */}
              <section className="grid gap-6 lg:grid-cols-2">
                <IssueTracker />
                <TopIssuesChart />
              </section>
              
              {/* Tertiary - Insights and Language */}
              <section className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <SentimentTrendsChart />
                </div>
                <div className="space-y-6">
                  <QuickInsights compact={false} />
                  <LanguageBreakdown />
                </div>
              </section>
            </div>
          )}
          
          {activeTab === "heatmap" && (
            <div className="h-[calc(100vh-140px)]">
              <BoothHeatmap fullscreen />
            </div>
          )}
          
          {activeTab === "sentiment" && (
            <div className="space-y-6">
              {/* Top Row - Sentiment Trends and Top Issues */}
              <div className="grid gap-6 lg:grid-cols-2">
                <SentimentTrendsChart expanded />
                <TopIssuesChart expanded />
              </div>
              
              {/* Second Row - Live Analysis */}
              <SentimentChart expanded />
              
              {/* Third Row - Historical and Language */}
              <div className="grid gap-6 lg:grid-cols-2">
                <HistoricalTrends />
                <LanguageBreakdown />
              </div>
            </div>
          )}
          
          {activeTab === "copilot" && (
            <AICoPilot fullscreen />
          )}

          {activeTab === "alerts" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AlertsPanel expanded />
              </div>
              <div className="space-y-6">
                <QuickInsights />
                <ExportPanel />
              </div>
            </div>
          )}
        </main>
      </div>
      
      {activeTab !== "copilot" && <AICoPilot />}
    </div>
  )
}
