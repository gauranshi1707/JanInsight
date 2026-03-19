"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export interface BoothData {
  id: number
  name: string
  lat: number
  lng: number
  sentiment: number
  issues: number
  category: string
  population: number
  feedbackCount: number
  topIssues: string[]
  lastUpdated: string
  trend: "up" | "down" | "stable"
  voterTurnout: number
}

interface MapComponentProps {
  selectedCategory: string | null
  mapStyle: "default" | "satellite" | "terrain"
  onBoothSelect?: (booth: BoothData | null) => void
  selectedBoothId?: number | null
}

// Enhanced booth data for Delhi constituency
export const boothData: BoothData[] = [
  { id: 1, name: "Booth 001 - Chandni Chowk", lat: 28.6562, lng: 77.2299, sentiment: 0.82, issues: 3, category: "Water Supply", population: 12450, feedbackCount: 847, topIssues: ["Water Supply", "Traffic", "Parking"], lastUpdated: "2 mins ago", trend: "up", voterTurnout: 68 },
  { id: 2, name: "Booth 002 - Red Fort Area", lat: 28.6562, lng: 77.2410, sentiment: 0.65, issues: 7, category: "Drainage", population: 9820, feedbackCount: 623, topIssues: ["Drainage", "Sanitation", "Roads"], lastUpdated: "5 mins ago", trend: "down", voterTurnout: 72 },
  { id: 3, name: "Booth 003 - Jama Masjid", lat: 28.6507, lng: 77.2334, sentiment: 0.45, issues: 12, category: "Roads", population: 15670, feedbackCount: 1124, topIssues: ["Roads", "Electricity", "Water Supply"], lastUpdated: "1 min ago", trend: "down", voterTurnout: 65 },
  { id: 4, name: "Booth 004 - Darya Ganj", lat: 28.6448, lng: 77.2418, sentiment: 0.78, issues: 4, category: "Electricity", population: 8930, feedbackCount: 412, topIssues: ["Electricity", "Street Lights", "Parks"], lastUpdated: "8 mins ago", trend: "stable", voterTurnout: 71 },
  { id: 5, name: "Booth 005 - Kashmere Gate", lat: 28.6678, lng: 77.2287, sentiment: 0.35, issues: 15, category: "Sanitation", population: 11200, feedbackCount: 1456, topIssues: ["Sanitation", "Garbage", "Drainage"], lastUpdated: "30 secs ago", trend: "down", voterTurnout: 58 },
  { id: 6, name: "Booth 006 - Civil Lines", lat: 28.6804, lng: 77.2244, sentiment: 0.88, issues: 2, category: "Water Supply", population: 7650, feedbackCount: 289, topIssues: ["Water Supply", "Parks", "Security"], lastUpdated: "12 mins ago", trend: "up", voterTurnout: 78 },
  { id: 7, name: "Booth 007 - Sadar Bazaar", lat: 28.6596, lng: 77.2050, sentiment: 0.52, issues: 9, category: "Drainage", population: 18340, feedbackCount: 987, topIssues: ["Drainage", "Traffic", "Encroachment"], lastUpdated: "3 mins ago", trend: "stable", voterTurnout: 62 },
  { id: 8, name: "Booth 008 - Paharganj", lat: 28.6433, lng: 77.2144, sentiment: 0.41, issues: 11, category: "Roads", population: 14560, feedbackCount: 1089, topIssues: ["Roads", "Sanitation", "Security"], lastUpdated: "1 min ago", trend: "down", voterTurnout: 55 },
  { id: 9, name: "Booth 009 - Karol Bagh", lat: 28.6519, lng: 77.1905, sentiment: 0.72, issues: 5, category: "Electricity", population: 21300, feedbackCount: 756, topIssues: ["Electricity", "Parking", "Markets"], lastUpdated: "6 mins ago", trend: "up", voterTurnout: 69 },
  { id: 10, name: "Booth 010 - Connaught Place", lat: 28.6315, lng: 77.2167, sentiment: 0.91, issues: 1, category: "Sanitation", population: 5420, feedbackCount: 198, topIssues: ["Sanitation", "Beautification", "Events"], lastUpdated: "15 mins ago", trend: "up", voterTurnout: 82 },
  { id: 11, name: "Booth 011 - Rajiv Chowk", lat: 28.6328, lng: 77.2197, sentiment: 0.68, issues: 6, category: "Water Supply", population: 8970, feedbackCount: 534, topIssues: ["Water Supply", "Metro Access", "Vendors"], lastUpdated: "4 mins ago", trend: "stable", voterTurnout: 67 },
  { id: 12, name: "Booth 012 - India Gate", lat: 28.6129, lng: 77.2295, sentiment: 0.85, issues: 2, category: "Drainage", population: 3240, feedbackCount: 156, topIssues: ["Parks", "Security", "Tourism"], lastUpdated: "20 mins ago", trend: "up", voterTurnout: 75 },
  { id: 13, name: "Booth 013 - Khan Market", lat: 28.6003, lng: 77.2272, sentiment: 0.93, issues: 1, category: "Roads", population: 4560, feedbackCount: 123, topIssues: ["Parking", "Cleanliness", "Markets"], lastUpdated: "25 mins ago", trend: "up", voterTurnout: 79 },
  { id: 14, name: "Booth 014 - Lodhi Colony", lat: 28.5916, lng: 77.2190, sentiment: 0.77, issues: 4, category: "Electricity", population: 6780, feedbackCount: 345, topIssues: ["Electricity", "Gardens", "Heritage"], lastUpdated: "10 mins ago", trend: "stable", voterTurnout: 73 },
  { id: 15, name: "Booth 015 - Nizamuddin", lat: 28.5930, lng: 77.2467, sentiment: 0.58, issues: 8, category: "Sanitation", population: 13450, feedbackCount: 876, topIssues: ["Sanitation", "Drainage", "Traffic"], lastUpdated: "2 mins ago", trend: "down", voterTurnout: 61 },
]

const mapTiles = {
  default: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
}

function getSentimentColor(sentiment: number): string {
  if (sentiment >= 0.8) return "#22c55e"
  if (sentiment >= 0.7) return "#4ade80"
  if (sentiment >= 0.6) return "#84cc16"
  if (sentiment >= 0.5) return "#eab308"
  if (sentiment >= 0.4) return "#f97316"
  return "#ef4444"
}

// Generate polygon coordinates for region-based heatmap
function generateRegionPolygon(lat: number, lng: number, size: number = 0.008): L.LatLngExpression[] {
  const variance = () => (Math.random() - 0.5) * 0.002
  return [
    [lat + size + variance(), lng - size * 0.8 + variance()],
    [lat + size * 0.6 + variance(), lng + size + variance()],
    [lat - size * 0.4 + variance(), lng + size * 0.9 + variance()],
    [lat - size + variance(), lng + variance()],
    [lat - size * 0.7 + variance(), lng - size + variance()],
    [lat + variance(), lng - size * 1.1 + variance()],
  ]
}

function getTrendIcon(trend: "up" | "down" | "stable"): string {
  switch (trend) {
    case "up": return "&#9650;"
    case "down": return "&#9660;"
    default: return "&#9644;"
  }
}

function getTrendColor(trend: "up" | "down" | "stable"): string {
  switch (trend) {
    case "up": return "#22c55e"
    case "down": return "#ef4444"
    default: return "#eab308"
  }
}

export default function MapComponent({ selectedCategory, mapStyle, onBoothSelect, selectedBoothId }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const layersRef = useRef<L.Layer[]>([])
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredBoothId, setHoveredBoothId] = useState<number | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapRef.current = L.map(containerRef.current, {
      center: [28.6448, 77.2167],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    })

    const tileConfig = mapTiles[mapStyle]
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution,
    }).addTo(mapRef.current)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    if (tileLayerRef.current) {
      tileLayerRef.current.remove()
    }

    const tileConfig = mapTiles[mapStyle]
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution,
    }).addTo(mapRef.current)
  }, [mapStyle])

  // Center map on selected booth
  useEffect(() => {
    if (!mapRef.current || !selectedBoothId) return
    const booth = boothData.find(b => b.id === selectedBoothId)
    if (booth) {
      mapRef.current.setView([booth.lat, booth.lng], 15, { animate: true })
    }
  }, [selectedBoothId])

  const updateLayers = useCallback(() => {
    if (!mapRef.current) return

    layersRef.current.forEach(layer => layer.remove())
    layersRef.current = []

    const filteredBooths = selectedCategory
      ? boothData.filter(booth => booth.category === selectedCategory)
      : boothData

    // Create region polygons for each booth
    filteredBooths.forEach(booth => {
      const isHovered = hoveredBoothId === booth.id
      const isSelected = selectedBoothId === booth.id
      const polygonCoords = generateRegionPolygon(booth.lat, booth.lng)
      
      const polygon = L.polygon(polygonCoords, {
        fillColor: getSentimentColor(booth.sentiment),
        fillOpacity: isSelected ? 0.85 : isHovered ? 0.75 : 0.6,
        color: isSelected ? "#ffffff" : getSentimentColor(booth.sentiment),
        weight: isSelected ? 2 : isHovered ? 1.5 : 0.5,
        opacity: 1,
      })

      const popupTextColor = "#1a1f35"
      
      polygon.bindTooltip(`
        <div style="min-width: 160px; padding: 6px;">
          <div style="font-weight: 600; font-size: 12px; margin-bottom: 4px; color: ${popupTextColor};">${booth.name}</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #666; font-size: 11px;">Sentiment</span>
            <span style="font-weight: 600; font-size: 11px; color: ${getSentimentColor(booth.sentiment)};">
              ${Math.round(booth.sentiment * 100)}% 
              <span style="color: ${getTrendColor(booth.trend)};">${getTrendIcon(booth.trend)}</span>
            </span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #666; font-size: 11px;">Issues</span>
            <span style="font-weight: 600; font-size: 11px; color: ${booth.issues > 8 ? '#ef4444' : '#1a1f35'};">${booth.issues}</span>
          </div>
        </div>
      `, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'booth-tooltip'
      })

      polygon.on('mouseover', () => setHoveredBoothId(booth.id))
      polygon.on('mouseout', () => setHoveredBoothId(null))
      polygon.on('click', () => onBoothSelect?.(booth))

      polygon.addTo(mapRef.current!)
      layersRef.current.push(polygon)

      // Add a small center marker for the booth
      const centerMarker = L.circleMarker([booth.lat, booth.lng], {
        radius: isSelected ? 6 : 4,
        fillColor: "#ffffff",
        fillOpacity: 0.9,
        color: getSentimentColor(booth.sentiment),
        weight: 2,
      })

      centerMarker.on('mouseover', () => setHoveredBoothId(booth.id))
      centerMarker.on('mouseout', () => setHoveredBoothId(null))
      centerMarker.on('click', () => onBoothSelect?.(booth))

      centerMarker.addTo(mapRef.current!)
      layersRef.current.push(centerMarker)
    })
  }, [selectedCategory, hoveredBoothId, selectedBoothId, onBoothSelect])

  useEffect(() => {
    updateLayers()
  }, [updateLayers])

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full"
      style={{ minHeight: "280px", isolation: "isolate" }}
    />
  )
}
