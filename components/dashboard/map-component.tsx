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
  if (sentiment >= 0.8) return "#22c55e" // bright green
  if (sentiment >= 0.7) return "#4ade80" // green
  if (sentiment >= 0.6) return "#84cc16" // lime
  if (sentiment >= 0.5) return "#eab308" // yellow  
  if (sentiment >= 0.4) return "#f97316" // orange
  return "#ef4444" // red
}

function getSentimentIntensity(sentiment: number): number {
  // Returns opacity based on distance from neutral (0.5)
  const distance = Math.abs(sentiment - 0.5)
  return 0.5 + distance * 0.8 // Range from 0.5 to 0.9
}

function getRadius(issues: number, isHovered: boolean, isSelected: boolean): number {
  const baseRadius = Math.max(12, Math.min(28, issues * 1.8 + 8))
  if (isSelected) return baseRadius * 1.4
  if (isHovered) return baseRadius * 1.2
  return baseRadius
}

function getTrendIcon(trend: "up" | "down" | "stable"): string {
  switch (trend) {
    case "up": return "&#9650;" // up arrow
    case "down": return "&#9660;" // down arrow
    default: return "&#9644;" // dash
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
  const markersRef = useRef<L.CircleMarker[]>([])
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredBoothId, setHoveredBoothId] = useState<number | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Initialize map centered on Delhi
    mapRef.current = L.map(containerRef.current, {
      center: [28.6448, 77.2167],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    })

    // Initial tile layer
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

  // Update tile layer when map style changes
  useEffect(() => {
    if (!mapRef.current) return

    // Remove old tile layer
    if (tileLayerRef.current) {
      tileLayerRef.current.remove()
    }

    // Add new tile layer
    const tileConfig = mapTiles[mapStyle]
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution,
    }).addTo(mapRef.current)
  }, [mapStyle])

  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Filter booths by category
    const filteredBooths = selectedCategory
      ? boothData.filter(booth => booth.category === selectedCategory)
      : boothData

    // Add booth markers
    filteredBooths.forEach(booth => {
      const isHovered = hoveredBoothId === booth.id
      const isSelected = selectedBoothId === booth.id
      
      const marker = L.circleMarker([booth.lat, booth.lng], {
        radius: getRadius(booth.issues, isHovered, isSelected),
        fillColor: getSentimentColor(booth.sentiment),
        fillOpacity: getSentimentIntensity(booth.sentiment),
        color: isSelected ? "#ffffff" : getSentimentColor(booth.sentiment),
        weight: isSelected ? 3 : isHovered ? 2.5 : 2,
        opacity: 1,
        className: `booth-marker-${booth.id}`,
      })

      const popupTextColor = "#1a1f35"
      
      // Enhanced tooltip on hover
      marker.bindTooltip(`
        <div style="min-width: 180px; padding: 8px;">
          <div style="font-weight: 600; font-size: 13px; margin-bottom: 6px; color: ${popupTextColor};">${booth.name}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="color: #666; font-size: 11px;">Sentiment</span>
            <span style="font-weight: 600; font-size: 12px; color: ${getSentimentColor(booth.sentiment)};">
              ${Math.round(booth.sentiment * 100)}% 
              <span style="color: ${getTrendColor(booth.trend)};">${getTrendIcon(booth.trend)}</span>
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #666; font-size: 11px;">Active Issues</span>
            <span style="font-weight: 600; font-size: 12px; color: ${booth.issues > 8 ? '#ef4444' : '#1a1f35'};">${booth.issues}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #666; font-size: 11px;">Feedback</span>
            <span style="font-weight: 600; font-size: 12px; color: ${popupTextColor};">${booth.feedbackCount.toLocaleString()}</span>
          </div>
          <div style="font-size: 10px; color: #888; margin-top: 6px; text-align: center;">Click for details</div>
        </div>
      `, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'booth-tooltip'
      })
      
      // Click popup with full details
      marker.bindPopup(`
        <div style="min-width: 280px; color: ${popupTextColor}; padding: 8px;">
          <h3 style="font-weight: bold; margin-bottom: 12px; color: ${popupTextColor}; font-size: 15px; border-bottom: 2px solid ${getSentimentColor(booth.sentiment)}; padding-bottom: 8px;">
            ${booth.name}
          </h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: #f5f5f5; padding: 8px; border-radius: 6px; text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: ${getSentimentColor(booth.sentiment)};">${Math.round(booth.sentiment * 100)}%</div>
              <div style="font-size: 10px; color: #666;">Sentiment</div>
            </div>
            <div style="background: #f5f5f5; padding: 8px; border-radius: 6px; text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: ${booth.issues > 8 ? '#ef4444' : '#1a1f35'};">${booth.issues}</div>
              <div style="font-size: 10px; color: #666;">Active Issues</div>
            </div>
          </div>
          
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px;">
              <span style="color: #666;">Population:</span>
              <span style="font-weight: 600;">${booth.population.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px;">
              <span style="color: #666;">Voter Turnout:</span>
              <span style="font-weight: 600;">${booth.voterTurnout}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px;">
              <span style="color: #666;">Total Feedback:</span>
              <span style="font-weight: 600;">${booth.feedbackCount.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px;">
              <span style="color: #666;">Trend:</span>
              <span style="font-weight: 600; color: ${getTrendColor(booth.trend)};">${booth.trend.charAt(0).toUpperCase() + booth.trend.slice(1)} ${getTrendIcon(booth.trend)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
              <span style="color: #666;">Last Updated:</span>
              <span style="font-weight: 600;">${booth.lastUpdated}</span>
            </div>
          </div>
          
          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; color: #666; margin-bottom: 6px;">Top Issues:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${booth.topIssues.map(issue => `<span style="background: #e5e7eb; padding: 2px 8px; border-radius: 12px; font-size: 10px;">${issue}</span>`).join('')}
            </div>
          </div>
          
          <button onclick="window.dispatchEvent(new CustomEvent('boothSelect', {detail: ${booth.id}}))" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #d4a73a 0%, #f4c842 100%); color: #1a1f35; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            View Full Analysis
          </button>
        </div>
      `, {
        className: "custom-popup",
        maxWidth: 320,
      })

      // Hover events
      marker.on('mouseover', () => {
        setHoveredBoothId(booth.id)
      })
      
      marker.on('mouseout', () => {
        setHoveredBoothId(null)
      })
      
      // Click event
      marker.on('click', () => {
        if (onBoothSelect) {
          onBoothSelect(booth)
        }
      })

      marker.addTo(mapRef.current!)
      markersRef.current.push(marker)
    })
  }, [selectedCategory, mapStyle, hoveredBoothId, selectedBoothId, onBoothSelect])

  useEffect(() => {
    updateMarkers()
  }, [updateMarkers])

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full"
      style={{ minHeight: "300px", isolation: "isolate" }}
    />
  )
}
