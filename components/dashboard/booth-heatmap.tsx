"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  RefreshCw, 
  Map, 
  Satellite, 
  Mountain,
  ChevronDown,
  Search,
  X
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { BoothDetailPanel } from "./booth-detail-panel"
import { boothData, type BoothData } from "./booth-data"

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-secondary/50">
      <div className="text-center">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

interface BoothHeatmapProps {
  fullscreen?: boolean
}

const mapStyles = [
  { id: "default", label: "Default", icon: Map },
  { id: "satellite", label: "Satellite", icon: Satellite },
  { id: "terrain", label: "Terrain", icon: Mountain },
] as const

type MapStyle = "default" | "satellite" | "terrain"

export function BoothHeatmap({ fullscreen = false }: BoothHeatmapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mapStyle, setMapStyle] = useState<MapStyle>("default")
  const [selectedBooth, setSelectedBooth] = useState<BoothData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const currentMapStyle = mapStyles.find(s => s.id === mapStyle)
  const CurrentIcon = currentMapStyle?.icon || Map

  // Filter booths for search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return boothData.filter(booth => 
      booth.name.toLowerCase().includes(query) ||
      booth.category.toLowerCase().includes(query)
    ).slice(0, 5)
  }, [searchQuery])

  const handleSearchSelect = (booth: BoothData) => {
    setSelectedBooth(booth)
    setSearchQuery("")
    setSearchFocused(false)
  }

  return (
    <Card className={cn("bg-card border-border", fullscreen && "h-full")}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base text-card-foreground">Booth Heatmap</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Sentiment by ECI booth boundaries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 border-border text-foreground">
                <CurrentIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">{currentMapStyle?.label}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {mapStyles.map((style) => {
                const Icon = style.icon
                return (
                  <DropdownMenuItem 
                    key={style.id}
                    onClick={() => setMapStyle(style.id)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer text-sm",
                      mapStyle === style.id && "bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {style.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Search Bar */}
        <div className="relative px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search booth, ward, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="pl-9 pr-9 h-9 text-sm bg-secondary/50 border-border"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute left-4 right-4 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
              {searchResults.map((booth) => (
                <button
                  key={booth.id}
                  onClick={() => handleSearchSelect(booth)}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{booth.name}</p>
                    <p className="text-xs text-muted-foreground">{booth.category}</p>
                  </div>
                  <div className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded",
                    booth.sentiment >= 0.7 ? "bg-chart-1/20 text-chart-1" :
                    booth.sentiment >= 0.5 ? "bg-chart-2/20 text-chart-2" :
                    "bg-destructive/20 text-destructive"
                  )}>
                    {Math.round(booth.sentiment * 100)}%
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className={cn("relative", fullscreen ? "h-[calc(100%-120px)]" : "h-72")} suppressHydrationWarning>
          <MapComponent 
            selectedCategory={selectedCategory} 
            mapStyle={mapStyle} 
            onBoothSelect={setSelectedBooth}
            selectedBoothId={selectedBooth?.id ?? null}
          />
          
          {/* Booth Detail Panel */}
          {selectedBooth && fullscreen && (
            <BoothDetailPanel 
              booth={selectedBooth} 
              onClose={() => setSelectedBooth(null)} 
            />
          )}
          
          {/* Legend */}
          <div className="absolute bottom-3 left-3 z-[1000] rounded-md bg-card/95 px-3 py-2 shadow-md backdrop-blur border border-border">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Sentiment</p>
            <div className="flex items-center gap-1">
              <div className="h-2 w-20 rounded-sm bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
            </div>
            <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="absolute right-3 top-3 z-[1000] flex gap-2">
            <div className="rounded-md bg-card/95 px-2.5 py-1.5 shadow-md backdrop-blur border border-border">
              <p className="text-[10px] text-muted-foreground">Booths</p>
              <p className="text-sm font-semibold text-card-foreground">247</p>
            </div>
            <div className="rounded-md bg-card/95 px-2.5 py-1.5 shadow-md backdrop-blur border border-border">
              <p className="text-[10px] text-muted-foreground">Hotspots</p>
              <p className="text-sm font-semibold text-destructive">12</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
