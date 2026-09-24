import {
  initialScheduledTrips,
  initialBlockedGrayDates,
  initialTravelDestinations,
  initialTravelIdeaRoutes,
  initialTimeEditClasses,
  ScheduledTrip,
  BlockedDateItem,
  TripDestination,
  TravelIdeaRoute,
  ClassEvent,
} from './planner-data'

const KEYS = {
  TRIPS: 'planner_scheduled_trips_v1',
  BLOCKED_DATES: 'planner_blocked_dates_v1',
  CLASSES: 'planner_timeedit_classes_v1',
  DESTINATIONS: 'planner_destinations_v1',
  IDEAS: 'planner_idea_routes_v1',
  ADMIN_PIN: 'planner_admin_pin_v1',
  ADMIN_AUTH: 'planner_admin_session_auth_v1',
}

const DEFAULT_PIN = '180124'

function notifyDataUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('planner_data_updated'))
  }
}

// 1. Trips
export function getStoredTrips(): ScheduledTrip[] {
  if (typeof window === 'undefined') return initialScheduledTrips
  try {
    const raw = window.localStorage.getItem(KEYS.TRIPS)
    if (!raw) return initialScheduledTrips
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : initialScheduledTrips
  } catch (err) {
    console.error('Failed to load trips from storage:', err)
    return initialScheduledTrips
  }
}

export function saveStoredTrips(trips: ScheduledTrip[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEYS.TRIPS, JSON.stringify(trips))
    notifyDataUpdated()
  } catch (err) {
    console.error('Failed to save trips to storage:', err)
  }
}

// 2. Blocked Dates
export function getStoredBlockedDates(): Record<string, BlockedDateItem> {
  if (typeof window === 'undefined') return initialBlockedGrayDates
  try {
    const raw = window.localStorage.getItem(KEYS.BLOCKED_DATES)
    if (!raw) return initialBlockedGrayDates
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : initialBlockedGrayDates
  } catch (err) {
    console.error('Failed to load blocked dates from storage:', err)
    return initialBlockedGrayDates
  }
}

export function saveStoredBlockedDates(dates: Record<string, BlockedDateItem>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEYS.BLOCKED_DATES, JSON.stringify(dates))
    notifyDataUpdated()
  } catch (err) {
    console.error('Failed to save blocked dates to storage:', err)
  }
}

// 3. Classes
export function getStoredClasses(): ClassEvent[] {
  if (typeof window === 'undefined') return initialTimeEditClasses
  try {
    const raw = window.localStorage.getItem(KEYS.CLASSES)
    if (!raw) return initialTimeEditClasses
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : initialTimeEditClasses
  } catch (err) {
    console.error('Failed to load classes from storage:', err)
    return initialTimeEditClasses
  }
}

export function saveStoredClasses(classes: ClassEvent[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEYS.CLASSES, JSON.stringify(classes))
    notifyDataUpdated()
  } catch (err) {
    console.error('Failed to save classes to storage:', err)
  }
}

// 4. Destinations
export function getStoredDestinations(): TripDestination[] {
  if (typeof window === 'undefined') return initialTravelDestinations
  try {
    const raw = window.localStorage.getItem(KEYS.DESTINATIONS)
    if (!raw) return initialTravelDestinations
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : initialTravelDestinations
  } catch (err) {
    console.error('Failed to load destinations from storage:', err)
    return initialTravelDestinations
  }
}

export function saveStoredDestinations(destinations: TripDestination[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEYS.DESTINATIONS, JSON.stringify(destinations))
    notifyDataUpdated()
  } catch (err) {
    console.error('Failed to save destinations to storage:', err)
  }
}

// 5. Idea Routes
export function getStoredIdeaRoutes(): TravelIdeaRoute[] {
  if (typeof window === 'undefined') return initialTravelIdeaRoutes
  try {
    const raw = window.localStorage.getItem(KEYS.IDEAS)
    if (!raw) return initialTravelIdeaRoutes
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : initialTravelIdeaRoutes
  } catch (err) {
    console.error('Failed to load idea routes from storage:', err)
    return initialTravelIdeaRoutes
  }
}

export function saveStoredIdeaRoutes(routes: TravelIdeaRoute[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEYS.IDEAS, JSON.stringify(routes))
    notifyDataUpdated()
  } catch (err) {
    console.error('Failed to save idea routes to storage:', err)
  }
}

// 6. Admin Authentication & PIN
export function getAdminPin(): string {
  if (typeof window === 'undefined') return DEFAULT_PIN
  const stored = window.localStorage.getItem(KEYS.ADMIN_PIN)
  if (!stored || stored === '1234') {
    return DEFAULT_PIN
  }
  return stored
}

export function saveAdminPin(pin: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEYS.ADMIN_PIN, pin)
}

export function verifyAdminPin(inputPin: string): boolean {
  const currentPin = getAdminPin()
  return inputPin.trim() === currentPin.trim()
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(KEYS.ADMIN_AUTH) === 'true'
}

export function setAdminLoggedIn(loggedIn: boolean) {
  if (typeof window === 'undefined') return
  if (loggedIn) {
    window.sessionStorage.setItem(KEYS.ADMIN_AUTH, 'true')
  } else {
    window.sessionStorage.removeItem(KEYS.ADMIN_AUTH)
  }
}

// 7. Full Backup / Export / Import / Reset
export interface PlannerExportBundle {
  version: string
  exportedAt: string
  scheduledTrips: ScheduledTrip[]
  blockedGrayDates: Record<string, BlockedDateItem>
  timeEditClasses: ClassEvent[]
  travelDestinations: TripDestination[]
  travelIdeaRoutes: TravelIdeaRoute[]
}

export function exportAllPlannerData(): string {
  const bundle: PlannerExportBundle = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    scheduledTrips: getStoredTrips(),
    blockedGrayDates: getStoredBlockedDates(),
    timeEditClasses: getStoredClasses(),
    travelDestinations: getStoredDestinations(),
    travelIdeaRoutes: getStoredIdeaRoutes(),
  }
  return JSON.stringify(bundle, null, 2)
}

export function importAllPlannerData(jsonStr: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Window not available' }
  try {
    const parsed = JSON.parse(jsonStr)
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: '유효한 JSON 객체가 아닙니다.' }
    }

    if (Array.isArray(parsed.scheduledTrips)) {
      window.localStorage.setItem(KEYS.TRIPS, JSON.stringify(parsed.scheduledTrips))
    }
    if (parsed.blockedGrayDates && typeof parsed.blockedGrayDates === 'object') {
      window.localStorage.setItem(KEYS.BLOCKED_DATES, JSON.stringify(parsed.blockedGrayDates))
    }
    if (Array.isArray(parsed.timeEditClasses)) {
      window.localStorage.setItem(KEYS.CLASSES, JSON.stringify(parsed.timeEditClasses))
    }
    if (Array.isArray(parsed.travelDestinations)) {
      window.localStorage.setItem(KEYS.DESTINATIONS, JSON.stringify(parsed.travelDestinations))
    }
    if (Array.isArray(parsed.travelIdeaRoutes)) {
      window.localStorage.setItem(KEYS.IDEAS, JSON.stringify(parsed.travelIdeaRoutes))
    }

    notifyDataUpdated()
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'JSON 파싱 중 오류가 발생했습니다.' }
  }
}

export function resetAllPlannerDataToDefault() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEYS.TRIPS)
  window.localStorage.removeItem(KEYS.BLOCKED_DATES)
  window.localStorage.removeItem(KEYS.CLASSES)
  window.localStorage.removeItem(KEYS.DESTINATIONS)
  window.localStorage.removeItem(KEYS.IDEAS)
  notifyDataUpdated()
}
