import { supabase, isSupabaseConfigured } from './supabase'
import {
  getStoredTrips,
  getStoredBlockedDates,
  getStoredClasses,
  getStoredDestinations,
  getStoredIdeaRoutes,
  saveStoredTrips,
  saveStoredBlockedDates,
  saveStoredClasses,
  saveStoredDestinations,
  saveStoredIdeaRoutes,
} from './storage'

export interface CloudPlannerData {
  id?: string
  trips: unknown[]
  blocked_dates: Record<string, unknown>
  classes: unknown[]
  destinations: unknown[]
  idea_routes: unknown[]
  updated_at?: string
}

/**
 * Supabase 클라우드에서 최신 데이터를 가져와 로컬에 동기화
 */
export async function syncFromSupabase(): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false

  try {
    const { data, error } = await supabase
      .from('planner_store')
      .select('*')
      .eq('id', 'main')
      .single()

    if (error) {
      // 행이 아직 없다면 최초 1회 현재 데이터로 Seed 생성
      if (error.code === 'PGRST116') {
        await pushAllToSupabase()
        return true
      }
      console.warn('Supabase fetch notice:', error.message)
      return false
    }

    if (data) {
      if (Array.isArray(data.trips)) {
        saveStoredTrips(data.trips, false)
      }
      if (data.blocked_dates && typeof data.blocked_dates === 'object') {
        saveStoredBlockedDates(data.blocked_dates, false)
      }
      if (Array.isArray(data.classes)) {
        saveStoredClasses(data.classes, false)
      }
      if (Array.isArray(data.destinations)) {
        saveStoredDestinations(data.destinations, false)
      }
      if (Array.isArray(data.idea_routes)) {
        saveStoredIdeaRoutes(data.idea_routes, false)
      }
      return true
    }
    return false
  } catch (err) {
    console.error('Failed to sync from Supabase:', err)
    return false
  }
}

/**
 * 현재 로컬 데이터를 Supabase 클라우드로 즉시 업로드
 */
export async function pushAllToSupabase(): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false

  try {
    const payload: CloudPlannerData = {
      id: 'main',
      trips: getStoredTrips(),
      blocked_dates: getStoredBlockedDates(),
      classes: getStoredClasses(),
      destinations: getStoredDestinations(),
      idea_routes: getStoredIdeaRoutes(),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('planner_store')
      .upsert(payload)

    if (error) {
      console.error('Supabase upsert error:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.error('Failed to push to Supabase:', err)
    return false
  }
}

/**
 * 실시간 변경 감지 리스너 (다른 기기에서 수정 시 실시간 반영)
 */
export function subscribeToSupabaseChanges(onUpdate: () => void) {
  if (!supabase || !isSupabaseConfigured) return () => {}

  const channel = supabase
    .channel('planner_store_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'planner_store', filter: 'id=eq.main' },
      (payload) => {
        const newData = payload.new as CloudPlannerData
        if (newData) {
          if (Array.isArray(newData.trips)) saveStoredTrips(newData.trips, false)
          if (newData.blocked_dates && typeof newData.blocked_dates === 'object') {
            saveStoredBlockedDates(newData.blocked_dates as any, false)
          }
          if (Array.isArray(newData.classes)) saveStoredClasses(newData.classes, false)
          if (Array.isArray(newData.destinations)) saveStoredDestinations(newData.destinations, false)
          if (Array.isArray(newData.idea_routes)) saveStoredIdeaRoutes(newData.idea_routes, false)
          onUpdate()
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
