"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { boothData, type BoothData } from "./booth-data"

interface MapComponentProps {
  selectedCategory: string | null
  mapStyle: "default" | "satellite" | "terrain"
  onBoothSelect?: (booth: BoothData | null) => void
  selectedBoothId?: number | null
}

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
function generateRegionPolygon(lat: number, lng: number, size: number = 0.008): [number, number][] {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletType = any

export default function MapComponent({ selectedCategory, mapStyle, onBoothSelect, selectedBoothId }: MapComponentProps) {
  const mapRef = useRef<LeafletType | null>(null)
  const layersRef = useRef<LeafletType[]>([])
  const tileLayerRef = useRef<LeafletType | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredBoothId, setHoveredBoothId] = useState<number | null>(null)
  const [leaflet, setLeaflet] = useState<LeafletType | null>(null)

  // Dynamically import Leaflet on client side
  useEffect(() => {
    import("leaflet").then((L) => {
      import("leaflet/dist/leaflet.css")
      setLeaflet(L.default)
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !leaflet) return

    mapRef.current = leaflet.map(containerRef.current, {
      center: [28.6448, 77.2167],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    })

    const tileConfig = mapTiles[mapStyle]
    tileLayerRef.current = leaflet.tileLayer(tileConfig.url, {
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
  }, [leaflet])

  useEffect(() => {
    if (!mapRef.current || !leaflet) return

    if (tileLayerRef.current) {
      tileLayerRef.current.remove()
    }

    const tileConfig = mapTiles[mapStyle]
    tileLayerRef.current = leaflet.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution,
    }).addTo(mapRef.current)
  }, [mapStyle, leaflet])

  // Center map on selected booth
  useEffect(() => {
    if (!mapRef.current || !selectedBoothId) return
    const booth = boothData.find(b => b.id === selectedBoothId)
    if (booth) {
      mapRef.current.setView([booth.lat, booth.lng], 15, { animate: true })
    }
  }, [selectedBoothId])

  const updateLayers = useCallback(() => {
    if (!mapRef.current || !leaflet) return

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
      
      const polygon = leaflet.polygon(polygonCoords, {
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
      const centerMarker = leaflet.circleMarker([booth.lat, booth.lng], {
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
  }, [selectedCategory, hoveredBoothId, selectedBoothId, onBoothSelect, leaflet])

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
