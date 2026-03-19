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
