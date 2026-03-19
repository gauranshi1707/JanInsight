"use client"

import dynamic from "next/dynamic"

// Dynamically import Dashboard with SSR disabled to prevent hydration mismatches
// caused by Radix UI's auto-generated IDs and the dynamically imported map component
const Dashboard = dynamic(
  () => import("@/components/dashboard/dashboard").then((mod) => mod.Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    ),
  }
)

export default function Page() {
  return <Dashboard />
}
