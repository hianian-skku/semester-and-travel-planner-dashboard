'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Globe,
  Info,
  ListOrdered,
  MapPin,
  Moon,
  Navigation,
  Plane,
  Shield,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  getStoredTrips,
  getStoredBlockedDates,
  getStoredClasses,
  getStoredDestinations,
  getStoredIdeaRoutes,
} from '@/lib/storage'
import {
  TripRegionKey,
  TripDestination,
  TripCategory,
  ScheduledTrip,
  BlockedDateItem,
  TravelIdeaRoute,
  ClassEvent,
  initialScheduledTrips,
  initialBlockedGrayDates,
  initialTravelDestinations,
  initialTravelIdeaRoutes,
  initialTimeEditClasses,
  calendarMonths,
  regionFilterTabs,
} from '@/lib/planner-data'

export type Language = 'ko' | 'en'

export const translations = {
  ko: {
    siteTitle: '여행계획 아이디어보드',
    semesterTag: '2026.09 ~ 2027.01',
    copyLink: '공유 링크 복사',
    copied: '복사 완료',
    themeLight: '라이트 모드로 전환',
    themeDark: '다크 모드로 전환',
    langToggle: 'English',
    langButtonText: 'ENG',
    bannerTitle: '여행계획 아이디어보드',
    bannerDesc:
      '녹색(수업 없음)과 주황색(온라인 줌) 날짜를 참고하여 여행 일정을 조율할 수 있음. 확정된 여행은 하늘색, 고민 중인 여행은 보라색이야. 여행 같이 가면 좋으니 겹치면 같이 가자!!!',
    sciCompLabel: 'Scientific Computing 표시:',
    sciCompOn: 'ON',
    sciCompOff: 'OFF (드랍 모드)',
    legendFree: '수업 없음 (초록)',
    legendZoom: '줌 수업 (주황)',
    legendClass: '수업/실습 (회색)',
    legendVisited: '다녀옴 (빨강)',
    legendConfirmed: '확정 여행 (하늘)',
    legendPlanned: '고민 중 (보라)',
    weekdays: ['월', '화', '수', '목', '금', '토', '일'],
    labelFree: '수업 없음',
    labelZoom: '줌(온라인) 수업',
    labelClass: '대면 수업/실습',
    labelVisited: '다녀온 여행',
    labelConfirmed: '확정된 여행',
    labelPlanned: '고민 중인 여행',
    tagVisited: '✓ 다녀옴',
    tagConfirmed: '✈️ 확정',
    tagPlanned: '💡 고민 중',
    weekend: '주말',
    freeDay: '자유 일정',
    classPrefix: '수업: ',
    inspectorFree: '수업 없는 날 (여행 일정 편성 가능)',
    inspectorClickHelp: '날짜 클릭 시 갱신',
    wishlistTitle: '가려는 여행지 리스트',
    wishlistSubtitle: '목적지와 권장 체류 박수 목록입니다. (클릭 시 세부 메모 확인)',
    placesCount: '곳',
    modalDurationLabel: '권장 체류:',
    modalCoreSchedule: '핵심 일정 및 체류 이유:',
    modalClose: '닫기',
    dayOfWeekNames: ['일', '월', '화', '수', '목', '금', '토'],
    viewCalendar: '달력',
    viewAgenda: '목록',
    mobileTip: '날짜 터치 시 세부 수업/여행 정보 확인',
    agendaTrips: '이번 달 여행 일정',
    agendaClasses: '날짜별 상세 일정',
    noTripsThisMonth: '이번 달 등록된 여행 일정이 없습니다.',
    routesSectionBadge: '아이디어',
    routesSectionTitle: '생각 중인 코스',
    routesSectionSubtitle: '이건 그냥 아직 아이디어 정도.',
    routesActionJoin: '일정 공유',
    routesActionCopied: '복사 완료!',
    routesActionViewCalendar: '달력에서 확인',
  },
  en: {
    siteTitle: 'Travel Idea Board',
    semesterTag: 'Sep 2026 ~ Jan 2027',
    copyLink: 'Copy Share Link',
    copied: 'Copied!',
    themeLight: 'Switch to Light Mode',
    themeDark: 'Switch to Dark Mode',
    langToggle: '한국어',
    langButtonText: 'KOR',
    bannerTitle: 'Travel Idea Board',
    bannerDesc:
      'Check green (no class) and orange (online Zoom) dates to coordinate travel. Confirmed trips are in sky blue, trips under consideration are in purple. Let\'s travel together if schedules align!',
    sciCompLabel: 'Scientific Computing:',
    sciCompOn: 'ON',
    sciCompOff: 'OFF (Dropped)',
    legendFree: 'No Class (Green)',
    legendZoom: 'Zoom Class (Orange)',
    legendClass: 'On-Campus (Gray)',
    legendVisited: 'Visited (Red)',
    legendConfirmed: 'Confirmed (Sky)',
    legendPlanned: 'Considering (Purple)',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labelFree: 'No Class',
    labelZoom: 'Online Zoom',
    labelClass: 'On-Campus Class',
    labelVisited: 'Visited Trip',
    labelConfirmed: 'Confirmed Trip',
    labelPlanned: 'Considering Trip',
    tagVisited: '✓ Visited',
    tagConfirmed: '✈️ Confirmed',
    tagPlanned: '💡 Considering',
    weekend: 'Weekend',
    freeDay: 'Free Day',
    classPrefix: 'Class: ',
    inspectorFree: 'No class (Free to travel!)',
    inspectorClickHelp: 'Click date to view details',
    wishlistTitle: 'Travel Destinations Wishlist',
    wishlistSubtitle: 'Destinations & recommended duration (Click card for notes)',
    placesCount: 'places',
    modalDurationLabel: 'Recommended Stay:',
    modalCoreSchedule: 'Key itinerary & reasons to visit:',
    modalClose: 'Close',
    dayOfWeekNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    viewCalendar: 'Calendar',
    viewAgenda: 'Agenda',
    mobileTip: 'Tap a date to view classes & details',
    agendaTrips: 'Trips This Month',
    agendaClasses: 'Daily Schedule',
    noTripsThisMonth: 'No trips scheduled for this month.',
    routesSectionBadge: 'Ideas',
    routesSectionTitle: 'Routes Under Consideration',
    routesSectionSubtitle: 'Just rough ideas for now.',
    routesActionJoin: 'Share Link',
    routesActionCopied: 'Copied!',
    routesActionViewCalendar: 'View on Calendar',
  },
}

export function SemesterPlannerMain() {
  const [lang, setLang] = useState<Language>('ko')
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0) // 9월 기본으로 시작
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-23')
  const [todayStr, setTodayStr] = useState<string>('2026-09-23')
  const [selectedDestination, setSelectedDestination] = useState<TripDestination | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('calendar')
  const [routeCopiedId, setRouteCopiedId] = useState<string | null>(null)

  // ⭐️ Introduction to Scientific Computing: 기본적으로 드랍(OFF)하는 것으로 전제!
  const [showSciComp, setShowSciComp] = useState<boolean>(false)

  // ⭐️ 기본 라이트 모드 (dark = false)
  const [dark, setDark] = useState<boolean>(false)

  // ⭐️ 동적 일정 상태 (로컬 스토리지에 저장된 사용자 추가 데이터 반영)
  const [scheduledTrips, setScheduledTrips] = useState<ScheduledTrip[]>(initialScheduledTrips)
  const [blockedGrayDates, setBlockedGrayDates] = useState<Record<string, BlockedDateItem>>(initialBlockedGrayDates)
  const [timeEditClasses, setTimeEditClasses] = useState<ClassEvent[]>(initialTimeEditClasses)
  const [travelDestinations, setTravelDestinations] = useState<TripDestination[]>(initialTravelDestinations)
  const [travelIdeaRoutes, setTravelIdeaRoutes] = useState<TravelIdeaRoute[]>(initialTravelIdeaRoutes)

  const curT = translations[lang]

  useEffect(() => {
    // 0. 로컬 스토리지 동적 데이터 불러오기 및 실시간 동기화 리스너
    const reloadStoredData = () => {
      setScheduledTrips(getStoredTrips())
      setBlockedGrayDates(getStoredBlockedDates())
      setTimeEditClasses(getStoredClasses())
      setTravelDestinations(getStoredDestinations())
      setTravelIdeaRoutes(getStoredIdeaRoutes())
    }
    reloadStoredData()

    window.addEventListener('planner_data_updated', reloadStoredData)
    window.addEventListener('storage', reloadStoredData)

    // Supabase 클라우드 동기화 및 실시간 업데이트 리스너 연결
    let unsubRealtime: (() => void) | undefined
    import('@/lib/supabase-sync').then(({ syncFromSupabase, subscribeToSupabaseChanges }) => {
      syncFromSupabase().then(() => reloadStoredData())
      unsubRealtime = subscribeToSupabaseChanges(reloadStoredData)
    }).catch(() => {})

    // 1. 언어 설정 감지 (URL param ?lang=en 우선, 그 다음 localStorage)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const paramLang = params.get('lang') as Language | null
      if (paramLang === 'en' || paramLang === 'ko') {
        setLang(paramLang)
      } else {
        const savedLang = window.localStorage.getItem('planner-lang-v1') as Language | null
        if (savedLang === 'en' || savedLang === 'ko') {
          setLang(savedLang)
        }
      }
    }

    // 2. 저장된 테마 불러오기
    const savedTheme = window.localStorage.getItem('planner-theme-v3')
    if (savedTheme === 'dark') {
      setDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setDark(false)
      document.documentElement.classList.remove('dark')
    }

    // 3. 접속 시 오늘 날짜 감지 및 자동 포커스
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const curToday = `${y}-${m}-${d}`

    setTodayStr(curToday)
    setSelectedDate(curToday)

    // 오늘 날짜가 속한 달로 자동 이동
    const monthIdx = calendarMonths.findIndex((cm) => cm.year === y && cm.month === now.getMonth() + 1)
    if (monthIdx !== -1) {
      setSelectedMonthIdx(monthIdx)
    }

    return () => {
      window.removeEventListener('planner_data_updated', reloadStoredData)
      window.removeEventListener('storage', reloadStoredData)
      if (unsubRealtime) unsubRealtime()
    }
  }, [])

  const toggleLanguage = () => {
    const nextLang = lang === 'ko' ? 'en' : 'ko'
    setLang(nextLang)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('planner-lang-v1', nextLang)
      const url = new URL(window.location.href)
      url.searchParams.set('lang', nextLang)
      window.history.replaceState({}, '', url.toString())
    }
  }

  const toggleTheme = () => {
    const nextDark = !dark
    setDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      window.localStorage.setItem('planner-theme-v3', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      window.localStorage.setItem('planner-theme-v3', 'light')
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', lang)
      navigator.clipboard.writeText(url.toString())
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleCopyRoute = (route: TravelIdeaRoute) => {
    if (typeof window === 'undefined') return
    const title = lang === 'en' ? route.titleEn : route.titleKo
    const summary = lang === 'en' ? route.summaryEn : route.summaryKo
    const textToCopy = `[${title}]\n${summary}\n\n여행 일정 보드: ${window.location.href}`
    navigator.clipboard.writeText(textToCopy)
    setRouteCopiedId(route.id)
    setTimeout(() => setRouteCopiedId(null), 2500)
  }

  const handleViewOnCalendar = (monthIdx?: number, dateStr?: string) => {
    if (monthIdx !== undefined) {
      setSelectedMonthIdx(monthIdx)
    }
    if (dateStr) {
      setSelectedDate(dateStr)
    }
    if (typeof window !== 'undefined') {
      const el = document.getElementById('calendar-card')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 100, behavior: 'smooth' })
      }
    }
  }

  // Filtered Destinations
  const filteredDestinations = useMemo(() => {
    if (selectedRegion === 'all') return travelDestinations
    return travelDestinations.filter((d) => d.region === selectedRegion)
  }, [selectedRegion, travelDestinations])

  // 1. O(1) 수업 데이터 사전 인덱싱 (날짜별 그룹화)
  const classesByDate = useMemo(() => {
    const map: Record<string, ClassEvent[]> = {}
    for (let i = 0; i < timeEditClasses.length; i++) {
      const c = timeEditClasses[i]
      if (!showSciComp && c.course.includes('Scientific Computing')) continue
      if (!map[c.date]) {
        map[c.date] = [c]
      } else {
        map[c.date].push(c)
      }
    }
    return map
  }, [timeEditClasses, showSciComp])

  // 2. O(1) 여행 일정 사전 인덱싱 (시작일~종료일 구간 매핑)
  const tripByDate = useMemo(() => {
    const map: Record<string, ScheduledTrip> = {}
    for (let i = 0; i < scheduledTrips.length; i++) {
      const trip = scheduledTrips[i]
      const [sy, sm, sd] = trip.startDate.split('-').map(Number)
      const [ey, em, ed] = trip.endDate.split('-').map(Number)
      const cur = new Date(sy, sm - 1, sd)
      const end = new Date(ey, em - 1, ed)
      while (cur <= end) {
        const y = cur.getFullYear()
        const m = String(cur.getMonth() + 1).padStart(2, '0')
        const d = String(cur.getDate()).padStart(2, '0')
        const key = `${y}-${m}-${d}`
        if (!map[key]) {
          map[key] = trip
        }
        cur.setDate(cur.getDate() + 1)
      }
    }
    return map
  }, [scheduledTrips])

  // Helper: 날짜별 수업 상태 및 여행 상태 판정 (O(1) 인덱스 활용)
  const getDateStatus = (dateStr: string) => {
    const trip = tripByDate[dateStr] || null
    const classes = classesByDate[dateStr] || []

    if (trip) {
      if (trip.category === 'visited') {
        return {
          type: 'visited' as const,
          label: curT.labelVisited,
          trip,
          bgClass: 'bg-red-50 text-red-950 border-2 border-red-500 shadow-xs dark:bg-red-950/40 dark:text-red-200 dark:border-red-600',
          badgeClass: 'bg-red-600 text-white font-bold dark:bg-red-600 dark:text-white',
          classes,
        }
      } else if (trip.category === 'confirmed') {
        return {
          type: 'confirmed' as const,
          label: curT.labelConfirmed,
          trip,
          bgClass: 'bg-sky-50 text-sky-950 border-2 border-sky-400 shadow-xs dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-500',
          badgeClass: 'bg-sky-500 text-white font-bold dark:bg-sky-500 dark:text-white',
          classes,
        }
      } else {
        return {
          type: 'planned' as const,
          label: curT.labelPlanned,
          trip,
          bgClass: 'bg-purple-50 text-purple-950 border-2 border-purple-400 shadow-xs dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-500',
          badgeClass: 'bg-purple-600 text-white font-bold dark:bg-purple-600 dark:text-white',
          classes,
        }
      }
    }

    // ⭐️ 회색 처리 날짜 (1/26, 1/27, 1/29, 1/31) 판정
    const grayItem = blockedGrayDates[dateStr]
    if (grayItem) {
      return {
        type: 'gray' as const,
        label: lang === 'en' ? grayItem.labelEn : grayItem.labelKo,
        note: lang === 'en' ? grayItem.noteEn : grayItem.noteKo,
        trip: null,
        bgClass: 'bg-zinc-200/80 text-zinc-700 border-zinc-300 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
        badgeClass: 'bg-zinc-300 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200 font-semibold',
        classes: [],
      }
    }

    if (classes.length === 0) {
      return {
        type: 'free' as const,
        label: curT.labelFree,
        trip: null,
        bgClass: 'bg-emerald-50 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100/70 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900/60',
        badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200',
        classes,
      }
    }

    const isAllZoom = classes.every((c) => c.isZoom)
    if (isAllZoom) {
      return {
        type: 'zoom' as const,
        label: curT.labelZoom,
        trip: null,
        bgClass: 'bg-amber-50 text-amber-900 border-amber-200/80 hover:bg-amber-100/70 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900/60',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200',
        classes,
      }
    }

    return {
      type: 'class' as const,
      label: curT.labelClass,
      trip: null,
      bgClass: 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200/70 dark:bg-zinc-850 dark:text-zinc-200 dark:border-zinc-750',
      badgeClass: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-750 dark:text-zinc-300',
      classes,
    }
  }

  const curMonth = calendarMonths[selectedMonthIdx]

  // 이번 달 일자별 데이터 사전 계산 (선택 변경 시 재계산 방지)
  const currentMonthDays = useMemo(() => {
    return Array.from({ length: curMonth.days }).map((_, idx) => {
      const dayNum = idx + 1
      const dateStr = `${curMonth.year}-${String(curMonth.month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
      const dayOfWeek = (curMonth.startDay + idx) % 7 // 0=Sun, 1=Mon, ..., 6=Sat
      const status = getDateStatus(dateStr)
      return { dayNum, dateStr, dayOfWeek, status }
    })
  }, [curMonth, tripByDate, classesByDate, blockedGrayDates, lang, curT])

  // 이번 달 여행 목록 사전 계산
  const currentMonthTrips = useMemo(() => {
    const monthPrefix = `${curMonth.year}-${String(curMonth.month).padStart(2, '0')}`
    return scheduledTrips.filter(
      (t) => t.startDate <= `${monthPrefix}-31` && t.endDate >= `${monthPrefix}-01`
    )
  }, [curMonth, scheduledTrips])

  // Selected date status for inspector
  const dateInfo = useMemo(() => {
    if (!selectedDate) return null
    const parts = selectedDate.split('-').map(Number)
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2])
    const dayOfWeek = curT.dayOfWeekNames[dateObj.getDay()]
    const status = getDateStatus(selectedDate)
    return {
      date: selectedDate,
      dayOfWeek,
      ...status,
    }
  }, [selectedDate, tripByDate, classesByDate, blockedGrayDates, lang, curT])

  return (
    <div className={cn('min-h-screen transition-colors duration-150', dark ? 'dark bg-[#0d1017] text-zinc-100' : 'bg-[#fafafa] text-zinc-900')}>
      {/* 1. Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-[#0d1017]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {curT.siteTitle}
            </span>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 font-medium">
              {curT.semesterTag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 🌐 언어 변경 버튼 (KO <-> EN) */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="gap-1.5 border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-850 dark:text-zinc-300 px-2.5"
              title={curT.langToggle}
            >
              <Globe className="size-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-extrabold tracking-wider">{curT.langButtonText}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {copySuccess ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              <span>{copySuccess ? curT.copied : curT.copyLink}</span>
            </Button>

            {/* 🛠️ 관리자 페이지 바로가기 버튼 */}
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-850 dark:text-zinc-300 px-2.5"
                title={lang === 'en' ? 'Admin Center (Manage Plans)' : '관리자 센터 (계획 직접 추가/수정)'}
              >
                <Shield className="size-3.5 text-zinc-500" />
                <span className="font-semibold">{lang === 'en' ? 'Admin' : '관리자'}</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-850 dark:text-zinc-300"
              title={dark ? curT.themeLight : curT.themeDark}
            >
              {dark ? <Sun className="size-3.5 text-amber-400" /> : <Moon className="size-3.5 text-indigo-600" />}
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Top Banner / Control Bar */}
      <div className="border-b border-zinc-200 bg-white py-4 dark:border-zinc-800 dark:bg-[#12151d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {curT.bannerTitle}
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
              {curT.bannerDesc}
            </p>
          </div>

          {/* Scientific Computing ON/OFF Toggle (기본 OFF: 드랍 모드) */}
          <div className="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-850 self-start sm:self-auto">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {curT.sciCompLabel}
            </span>
            <Switch checked={showSciComp} onCheckedChange={setShowSciComp} />
            <span className={cn('text-xs font-bold', showSciComp ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-700 dark:text-amber-400')}>
              {showSciComp ? curT.sciCompOn : curT.sciCompOff}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Left (Calendar) + Right (Travel Destinations List) */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          {/* LEFT: CALENDAR (달력) */}
          <div className="flex flex-col gap-4">
            <Card id="calendar-card" className="border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-[#13161f]">
              {/* Calendar Header with Month Selector & View Toggle */}
              <CardHeader className="p-3 sm:p-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                    {/* 월 선택 박스 */}
                    <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 p-0.5 sm:p-1 dark:border-zinc-700 dark:bg-zinc-850">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 sm:size-7 shrink-0"
                        disabled={selectedMonthIdx === 0}
                        onClick={() => setSelectedMonthIdx((p) => Math.max(0, p - 1))}
                      >
                        <ChevronLeft className="size-3.5 sm:size-4" />
                      </Button>
                      <span className="px-2 sm:px-3 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap min-w-[105px] sm:min-w-[110px] text-center shrink-0">
                        {lang === 'en' ? curMonth.nameEn : curMonth.nameKo}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 sm:size-7 shrink-0"
                        disabled={selectedMonthIdx === calendarMonths.length - 1}
                        onClick={() => setSelectedMonthIdx((p) => Math.min(calendarMonths.length - 1, p + 1))}
                      >
                        <ChevronRight className="size-3.5 sm:size-4" />
                      </Button>
                    </div>

                    {/* 모바일/데스크톱 뷰 모드 토글 (달력 ↔ 목록) */}
                    <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-700 dark:bg-zinc-850 shrink-0">
                      <button
                        type="button"
                        onClick={() => setViewMode('calendar')}
                        className={cn(
                          'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold transition-all',
                          viewMode === 'calendar'
                            ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-800 dark:text-zinc-100'
                            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
                        )}
                        title={curT.viewCalendar}
                      >
                        <CalendarDays className="size-3.5" />
                        <span className="text-[11px] font-semibold">{curT.viewCalendar}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('agenda')}
                        className={cn(
                          'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold transition-all',
                          viewMode === 'agenda'
                            ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-800 dark:text-zinc-100'
                            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
                        )}
                        title={curT.viewAgenda}
                      >
                        <ListOrdered className="size-3.5" />
                        <span className="text-[11px] font-semibold">{curT.viewAgenda}</span>
                      </button>
                    </div>
                  </div>

                  {/* 5 Month buttons: 모바일에서는 5등분 균등 배치로 1월까지 완벽 노출 */}
                  <div className="grid grid-cols-5 gap-1 w-full sm:flex sm:w-auto">
                    {calendarMonths.map((m, idx) => (
                      <Button
                        key={m.year + '-' + m.month}
                        variant={selectedMonthIdx === idx ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedMonthIdx(idx)}
                        className={cn(
                          'h-7 px-1 text-xs font-semibold rounded',
                          selectedMonthIdx === idx
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                            : 'bg-zinc-50 sm:bg-transparent text-zinc-600 dark:bg-zinc-850/60 dark:text-zinc-400'
                        )}
                      >
                        {lang === 'en' ? m.shortEn : m.shortKo}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Legend: 모바일에서는 3열 그리드로 깔끔하게 2줄 배치 */}
                <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 sm:flex sm:flex-wrap items-center sm:gap-2.5 text-[10px] sm:text-[11px] pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="flex items-center gap-1">
                    <span className="size-2 sm:size-2.5 rounded bg-emerald-100 border border-emerald-300 shrink-0" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium truncate">{curT.legendFree}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 sm:size-2.5 rounded bg-amber-100 border border-amber-300 shrink-0" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium truncate">{curT.legendZoom}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 sm:size-2.5 rounded bg-zinc-200 border border-zinc-300 shrink-0" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium truncate">{curT.legendClass}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                    <span className="size-2 sm:size-2.5 rounded border-2 border-red-500 bg-red-100 shrink-0" />
                    <span className="truncate">{curT.legendVisited}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400">
                    <span className="size-2 sm:size-2.5 rounded border-2 border-sky-400 bg-sky-100 shrink-0" />
                    <span className="truncate">{curT.legendConfirmed}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                    <span className="size-2 sm:size-2.5 rounded border-2 border-purple-400 bg-purple-100 shrink-0" />
                    <span className="truncate">{curT.legendPlanned}</span>
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-2 sm:p-3">
                {viewMode === 'calendar' ? (
                  <>
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 pb-1 text-center text-xs font-bold text-zinc-500">
                      {curT.weekdays.map((w, idx) => (
                        <div
                          key={w}
                          className={cn(
                            idx === 6 && 'text-rose-500',
                            idx === 5 && 'text-zinc-400'
                          )}
                        >
                          {w}
                        </div>
                      ))}
                    </div>

                    {/* Grid days */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Padding previous month */}
                      {Array.from({ length: (curMonth.startDay + 6) % 7 }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="h-14 sm:h-20 rounded border border-transparent bg-zinc-50/20 opacity-30" />
                      ))}

                      {/* Month days */}
                      {currentMonthDays.map(({ dayNum, dateStr, dayOfWeek, status }) => {
                        const isSelected = selectedDate === dateStr
                        const isToday = dateStr === todayStr
                        const trip = status.trip

                        const destName = trip ? (lang === 'en' ? trip.destinationEn : trip.destination) : ''

                        return (
                          <div
                            key={dateStr}
                            onClick={() => setSelectedDate(dateStr)}
                            className={cn(
                              'h-14 sm:h-20 rounded border p-1 sm:p-1.5 text-xs transition-colors duration-150 cursor-pointer flex flex-col justify-between relative overflow-hidden select-none',
                              status.bgClass,
                              // ⭐️ 오늘 날짜 박스 강조 표시 (선명한 파란색 박스만 적용)
                              isToday && 'border-2 !border-blue-600 shadow-md ring-2 ring-blue-500/40 z-10',
                              isSelected && 'ring-2 ring-indigo-600 shadow-md'
                            )}
                          >
                            {/* 상단 행: 날짜 숫자 + (데스크톱: 뱃지 / 모바일: 수업 인디케이터 점) */}
                            <div className="flex items-start justify-between gap-0.5">
                              <span
                                className={cn(
                                  'text-xs sm:text-sm font-bold leading-none',
                                  dayOfWeek === 0 && 'text-rose-600 dark:text-rose-400',
                                  trip?.category === 'visited' && 'text-red-700 font-extrabold',
                                  trip?.category === 'confirmed' && 'text-sky-800 dark:text-sky-200 font-extrabold',
                                  trip?.category === 'planned' && 'text-purple-800 dark:text-purple-200 font-extrabold',
                                  isToday && 'text-blue-700 dark:text-blue-300 font-black'
                                )}
                              >
                                {dayNum}
                              </span>

                              {/* 데스크톱 전용 뱃지 (sm 이상에서만 노출) */}
                              <div className="hidden sm:block">
                                {trip ? (
                                  <span className={cn('text-[9px] font-bold px-1 py-0.2 rounded shadow-2xs truncate max-w-[85px] block', status.badgeClass)}>
                                    {destName}
                                  </span>
                                ) : (
                                  <span className={cn('text-[9px] font-bold px-1 rounded block', status.badgeClass)}>
                                    {status.label}
                                  </span>
                                )}
                              </div>

                              {/* 모바일 전용 인디케이터 (수업 닷) */}
                              <div className="sm:hidden flex items-center gap-0.5">
                                {!trip && status.type === 'zoom' && (
                                  <span className="size-1.5 rounded-full bg-amber-500 shrink-0" title="Zoom" />
                                )}
                                {!trip && status.type === 'class' && (
                                  <span className="size-1.5 rounded-full bg-zinc-500 shrink-0" title="Class" />
                                )}
                              </div>
                            </div>

                            {/* 모바일 여행 뱃지 (모바일에서 세로로 깨지지 않게 깔끔한 1줄 뱃지) */}
                            {trip && (
                              <div className="sm:hidden my-auto w-full">
                                <div
                                  className={cn(
                                    'text-[8px] font-black px-0.5 py-0.5 rounded text-center truncate tracking-tighter leading-none shadow-2xs block w-full whitespace-nowrap overflow-hidden',
                                    status.badgeClass
                                  )}
                                >
                                  {trip.category === 'visited' && '✓ ' + destName}
                                  {trip.category === 'confirmed' && (trip.id === 'c-korea-arrive' ? '🛬 ' : trip.id === 'c-korea-band' ? '🎸 ' : '✈ ') + destName}
                                  {trip.category === 'planned' && (trip.id === 'p-clair-obscur' ? '🎵 ' : '💡 ') + destName}
                                </div>
                              </div>
                            )}

                            {/* 모바일 회색 처리 뱃지 */}
                            {!trip && status.type === 'gray' && (
                              <div className="sm:hidden my-auto w-full">
                                <div className="text-[8px] font-bold px-0.5 py-0.5 rounded text-center truncate tracking-tighter leading-none block w-full bg-zinc-300 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">
                                  {status.label}
                                </div>
                              </div>
                            )}

                            {/* 데스크톱 본문: 상세 텍스트 (모바일에서는 숨겨서 세로 쪼개짐 원천 차단) */}
                            <div className="hidden sm:block overflow-hidden">
                              {trip ? (
                                <div className="text-[10px] font-bold leading-tight truncate">
                                  {trip.category === 'visited' && (
                                    <span className="text-red-700 dark:text-red-300">{curT.tagVisited} ({destName})</span>
                                  )}
                                  {trip.category === 'confirmed' && (
                                    <span className="text-sky-700 dark:text-sky-300">
                                      {trip.id === 'c-korea-arrive' ? '🛬 ' : trip.id === 'c-korea-band' ? '🎸 ' : '✈️ '}
                                      {curT.tagConfirmed} ({destName})
                                    </span>
                                  )}
                                  {trip.category === 'planned' && (
                                    <span className="text-purple-700 dark:text-purple-300">
                                      {trip.id === 'p-clair-obscur' ? '🎵 ' : '💡 '}
                                      {curT.tagPlanned} ({destName})
                                    </span>
                                  )}
                                  {trip.note && (
                                    <span className="block text-[8.5px] font-normal text-zinc-500 dark:text-zinc-400 truncate">
                                      {lang === 'en' ? trip.noteEn : trip.note}
                                    </span>
                                  )}
                                  {status.classes.length > 0 && (
                                    <span className="block text-[9px] font-normal opacity-85 truncate">
                                      {curT.classPrefix}{status.classes[0].course.split(' ')[0]}
                                    </span>
                                  )}
                                </div>
                              ) : status.type === 'gray' ? (
                                <div className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 truncate">
                                  {status.note || '개인 일정'}
                                </div>
                              ) : status.classes.length > 0 ? (
                                <div className="text-[10px] leading-tight opacity-90 truncate font-medium">
                                  {status.classes[0].course.split(' ')[0]} {status.classes.length > 1 && `+${status.classes.length - 1}`}
                                </div>
                              ) : (
                                <div className="text-[10px] text-emerald-700/70 dark:text-emerald-300/70 truncate">
                                  {dayOfWeek === 0 || dayOfWeek === 6 ? curT.weekend : curT.freeDay}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* 모바일 힌트 문구 */}
                    <div className="sm:hidden text-center pt-2 text-[10px] text-zinc-400">
                      {curT.mobileTip}
                    </div>
                  </>
                ) : (
                  /* ⭐️ Agenda View: 모바일에서 스크롤하며 보기 편한 월간 일정표 */
                  <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
                    {/* 이번 달 주요 여행 목록 */}
                    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-850 p-2.5 border border-zinc-200 dark:border-zinc-700">
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center gap-1.5">
                        <Compass className="size-3.5 text-indigo-600" />
                        <span>{curT.agendaTrips}</span>
                      </div>
                      {currentMonthTrips.length === 0 ? (
                        <div className="text-xs text-zinc-400 py-1">{curT.noTripsThisMonth}</div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {currentMonthTrips.map((t) => {
                            const dest = lang === 'en' ? t.destinationEn : t.destination
                            const note = lang === 'en' ? t.noteEn : t.note
                            const isVisited = t.category === 'visited'
                            const isConfirmed = t.category === 'confirmed'
                            return (
                              <div
                                key={t.id}
                                onClick={() => setSelectedDate(t.startDate)}
                                className={cn(
                                  'p-2 rounded-md border text-xs cursor-pointer flex items-center justify-between transition-colors duration-150',
                                  isVisited && 'bg-red-50/80 border-red-300 text-red-950 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200',
                                  isConfirmed && 'bg-sky-50/80 border-sky-300 text-sky-950 dark:bg-sky-950/40 dark:border-sky-800 dark:text-sky-200',
                                  !isVisited && !isConfirmed && 'bg-purple-50/80 border-purple-300 text-purple-950 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-200'
                                )}
                              >
                                <div>
                                  <div className="font-bold flex items-center gap-1">
                                    {isVisited && '🚩'}
                                    {isConfirmed && (t.id === 'c-korea-arrive' ? '🛬' : t.id === 'c-korea-band' ? '🎸' : '✈️')}
                                    {!isVisited && !isConfirmed && (t.id === 'p-clair-obscur' ? '🎵' : '💡')}
                                    <span>{dest}</span>
                                    <span className="text-[10px] font-normal opacity-80">({note})</span>
                                  </div>
                                  <div className="text-[10px] opacity-75">
                                    {t.startDate.slice(5)} ~ {t.endDate.slice(5)}
                                  </div>
                                </div>
                                <Badge
                                  className={cn(
                                    'text-[10px] font-bold text-white',
                                    isVisited && 'bg-red-600',
                                    isConfirmed && 'bg-sky-500',
                                    !isVisited && !isConfirmed && 'bg-purple-600'
                                  )}
                                >
                                  {isVisited ? curT.tagVisited : isConfirmed ? curT.tagConfirmed : curT.tagPlanned}
                                </Badge>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* 일자별 전체 타임라인 */}
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1 mb-0.5">
                      {curT.agendaClasses} ({curMonth.year}.{curMonth.month})
                    </div>
                    {currentMonthDays.map(({ dayNum, dateStr, dayOfWeek, status }) => {
                      const isSelected = selectedDate === dateStr
                      const isToday = dateStr === todayStr
                      const trip = status.trip

                      return (
                        <div
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={cn(
                            'p-2 rounded-md border text-xs cursor-pointer flex items-center justify-between transition-colors duration-150',
                            status.bgClass,
                            isToday && 'border-2 !border-blue-600 ring-2 ring-blue-500/30',
                            isSelected && 'ring-2 ring-indigo-600 shadow-xs'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'font-bold w-12 text-center text-xs shrink-0',
                                dayOfWeek === 0 && 'text-rose-600',
                                dayOfWeek === 6 && 'text-zinc-500'
                              )}
                            >
                              {curMonth.month}/{dayNum} ({curT.dayOfWeekNames[dayOfWeek]})
                            </span>
                            <div className="flex flex-col">
                              {trip ? (
                                <span className="font-bold text-xs">
                                  {trip.category === 'visited' && '🚩 '}
                                  {trip.category === 'confirmed' && (trip.id === 'c-korea-arrive' ? '🛬 ' : trip.id === 'c-korea-band' ? '🎸 ' : '✈️ ')}
                                  {trip.category === 'planned' && (trip.id === 'p-clair-obscur' ? '🎵 ' : '💡 ')}
                                  {lang === 'en' ? trip.destinationEn : trip.destination}
                                  <span className="text-[10px] font-normal ml-1 opacity-80">
                                    ({lang === 'en' ? trip.noteEn : trip.note})
                                  </span>
                                </span>
                              ) : status.type === 'gray' ? (
                                <span className="font-semibold text-xs text-zinc-600 dark:text-zinc-300">
                                  {status.note || '개인 일정 (여행 불가)'}
                                </span>
                              ) : status.classes.length > 0 ? (
                                <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                                  {status.classes.map((c) => `${c.course.split(' ')[0]} (${c.time})`).join(', ')}
                                </span>
                              ) : (
                                <span className="text-emerald-700 dark:text-emerald-400 font-medium text-xs">
                                  {dayOfWeek === 0 || dayOfWeek === 6 ? curT.weekend : curT.freeDay}
                                </span>
                              )}
                            </div>
                          </div>

                          <Badge variant="outline" className={cn('text-[9px] font-bold shrink-0', status.badgeClass)}>
                            {status.label}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Date Inspector (간단한 날짜 상태 정보) */}
            {dateInfo && (
              <div className="rounded-lg border border-zinc-200 bg-white p-3 sm:p-3.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-[#13161f] dark:text-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                    {dateInfo.date} ({dateInfo.dayOfWeek})
                  </span>

                  {dateInfo.trip && dateInfo.trip.category === 'visited' && (
                    <Badge className="bg-red-600 text-white font-bold text-[10px]">
                      🚩 {lang === 'en' ? dateInfo.trip.destinationEn : dateInfo.trip.destination} ({lang === 'en' ? dateInfo.trip.noteEn || 'Visited' : dateInfo.trip.note})
                    </Badge>
                  )}

                  {dateInfo.trip && dateInfo.trip.category === 'confirmed' && (
                    <Badge className="bg-sky-500 text-white font-bold text-[10px]">
                      {dateInfo.trip.id === 'c-korea-arrive' ? '🛬 ' : dateInfo.trip.id === 'c-korea-band' ? '🎸 ' : '✈️ '}
                      {lang === 'en' ? dateInfo.trip.destinationEn : dateInfo.trip.destination} ({lang === 'en' ? dateInfo.trip.noteEn : dateInfo.trip.note})
                    </Badge>
                  )}

                  {dateInfo.trip && dateInfo.trip.category === 'planned' && (
                    <Badge className="bg-purple-600 text-white font-bold text-[10px]">
                      {dateInfo.trip.id === 'p-clair-obscur' ? '🎵 ' : '💡 '}
                      {lang === 'en' ? dateInfo.trip.destinationEn : dateInfo.trip.destination} ({lang === 'en' ? dateInfo.trip.noteEn : dateInfo.trip.note})
                    </Badge>
                  )}

                  <Badge variant="outline" className={cn('text-[10px] font-bold', dateInfo.badgeClass)}>
                    {dateInfo.label}
                  </Badge>

                  {dateInfo.type === 'gray' && (
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                      {dateInfo.note || '개인 일정 (여행 불가)'}
                    </span>
                  )}

                  {dateInfo.classes.length > 0 && (
                    <span className="text-zinc-600 dark:text-zinc-400 block sm:inline">
                      {curT.classPrefix}{dateInfo.classes.map((c) => `${c.course} (${c.time})`).join(', ')}
                    </span>
                  )}

                  {dateInfo.classes.length === 0 && !dateInfo.trip && dateInfo.type !== 'gray' && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      {curT.inspectorFree}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400 hidden sm:inline shrink-0">{curT.inspectorClickHelp}</span>
              </div>
            )}
          </div>

          {/* RIGHT: TRAVEL DESTINATIONS LIST (우측 여행지 리스트) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Compass className="size-4 text-indigo-600" />
                  <span>{curT.wishlistTitle}</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {curT.wishlistSubtitle}
                </p>
              </div>

              <span className="text-xs text-zinc-400 font-semibold">
                {filteredDestinations.length} {curT.placesCount}
              </span>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {regionFilterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedRegion(tab.key)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-semibold transition-all border',
                    selectedRegion === tab.key
                      ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-2xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800'
                  )}
                >
                  {lang === 'en' ? tab.labelEn : tab.labelKo}
                </button>
              ))}
            </div>

            {/* Clean List Items */}
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest)}
                  className={cn(
                    'group cursor-pointer rounded-lg border p-3 transition-colors flex items-center justify-between',
                    dest.isConfirmed
                      ? 'border-sky-300 bg-sky-50/50 hover:border-sky-400 hover:bg-sky-100/60 dark:border-sky-800 dark:bg-sky-950/20 dark:hover:border-sky-700'
                      : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50/80 dark:border-zinc-800 dark:bg-[#13161f] dark:hover:border-zinc-700 dark:hover:bg-zinc-850'
                  )}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {lang === 'en' ? dest.regionNameEn : dest.regionName}
                      </span>
                      {dest.isConfirmed && (
                        <Badge className="bg-sky-500 hover:bg-sky-500 text-white font-bold text-[10px] px-1.5 py-0 h-4 leading-none">
                          ✈️ {lang === 'en' ? 'Confirmed' : '확정됨'}
                        </Badge>
                      )}
                    </div>
                    <span className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400 mt-0.5 truncate">
                      {lang === 'en' ? dest.nameEn : dest.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {dest.isConfirmed && (
                      <Badge className="hidden sm:inline-flex bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800 font-bold text-[11px] px-2 py-0.5">
                        {lang === 'en' ? (dest.confirmedTagEn || 'Confirmed') : (dest.confirmedTagKo || '확정됨')}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="border-zinc-300 bg-zinc-50 font-bold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 text-xs px-2.5 py-1"
                    >
                      {lang === 'en' ? dest.durationEn : dest.duration}
                    </Badge>
                    <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. PROPOSED TRAVEL ROUTES & THEMES (생각 중인 코스) */}
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-xs dark:border-zinc-800 dark:bg-[#13161f]">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 mb-2">
                <Compass className="size-3.5 text-zinc-500" />
                <span>{curT.routesSectionBadge}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {curT.routesSectionTitle}
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
                {curT.routesSectionSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                {travelIdeaRoutes.length} {lang === 'en' ? 'Routes' : '개 코스'}
              </span>
            </div>
          </div>

          {/* 9 Idea Cards Grid */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {travelIdeaRoutes.map((route) => {
              const isCopied = routeCopiedId === route.id
              const title = lang === 'en' ? route.titleEn : route.titleKo
              const tag = lang === 'en' ? route.tagEn : route.tagKo
              const summary = lang === 'en' ? route.summaryEn : route.summaryKo
              const details = lang === 'en' ? route.detailsEn : route.detailsKo

              return (
                <div
                  key={route.id}
                  className={cn(
                    'group relative rounded-xl border transition-all flex flex-col justify-between p-4',
                    route.id === 'route-easygoing'
                      ? 'border-indigo-300 bg-indigo-50/25 hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-indigo-800/80 dark:bg-indigo-950/20 dark:hover:border-indigo-700 shadow-xs ring-1 ring-indigo-400/20'
                      : 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 hover:bg-white hover:shadow-2xs dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-850/80'
                  )}
                >
                  <div>
                    {/* Top Row: Emoji, Tag Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xl leading-none select-none">{route.emoji}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-md border',
                          route.id === 'route-easygoing'
                            ? 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-900/70 dark:text-indigo-200 dark:border-indigo-700 font-bold'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                        )}
                      >
                        {tag}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 transition-colors">
                      {title}
                    </h3>

                    {/* Summary */}
                    <div
                      className={cn(
                        'mt-2 rounded-md p-2.5 text-xs leading-relaxed',
                        route.id === 'route-easygoing'
                          ? 'bg-indigo-50/90 border-2 border-indigo-400 text-indigo-950 font-extrabold text-xs sm:text-[13px] dark:bg-indigo-950/70 dark:border-indigo-500 dark:text-indigo-100 shadow-2xs'
                          : 'bg-white dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 font-medium'
                      )}
                    >
                      {summary}
                    </div>

                    {/* Detail Bullets */}
                    <ul className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5">
                          <span className={cn('font-bold shrink-0 mt-0.5', route.id === 'route-easygoing' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400')}>•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between gap-2">
                    {/* 달력 연계 버튼 (있는 경우) */}
                    {route.targetDate ? (
                      <button
                        type="button"
                        onClick={() => handleViewOnCalendar(route.targetMonthIdx, route.targetDate)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                        title={curT.routesActionViewCalendar}
                      >
                        <Calendar className="size-3.5" />
                        <span>{curT.routesActionViewCalendar}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {lang === 'en' ? 'Flexible Dates' : '일정 상시 조율 가능'}
                      </span>
                    )}

                    {/* 일정 공유 복사 버튼 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyRoute(route)}
                      className={cn(
                        'h-7 px-2 text-[11px] font-semibold gap-1 rounded transition-colors',
                        isCopied
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750'
                      )}
                    >
                      {isCopied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                      <span>{isCopied ? curT.routesActionCopied : curT.routesActionJoin}</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* 4. DETAIL MODAL (목적지 클릭 시 나타나는 메모 및 박수 안내) */}
      <Dialog open={!!selectedDestination} onOpenChange={(open) => !open && setSelectedDestination(null)}>
        <DialogContent className="border-zinc-300 bg-white text-zinc-900 shadow-xl dark:border-zinc-700 dark:bg-[#141721] dark:text-zinc-100 sm:max-w-[480px] p-5">
          {selectedDestination && (
            <div className="flex flex-col gap-3">
              <DialogHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-medium">
                      {lang === 'en' ? selectedDestination.regionNameEn : selectedDestination.regionName}
                    </span>
                    {selectedDestination.isConfirmed && (
                      <Badge className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5">
                        ✈️ {lang === 'en' ? (selectedDestination.confirmedTagEn || 'Confirmed') : (selectedDestination.confirmedTagKo || '확정됨')}
                      </Badge>
                    )}
                  </div>
                  <Badge className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold">
                    {curT.modalDurationLabel} {lang === 'en' ? selectedDestination.durationEn : selectedDestination.duration}
                  </Badge>
                </div>
                <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {lang === 'en' ? selectedDestination.nameEn : selectedDestination.name}
                </DialogTitle>
              </DialogHeader>

              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3 text-xs leading-relaxed text-zinc-700 dark:bg-zinc-850 dark:border-zinc-750 dark:text-zinc-300">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
                  {curT.modalCoreSchedule}
                </span>
                {lang === 'en' ? selectedDestination.descriptionEn : selectedDestination.description}
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedDestination(null)} className="text-xs">
                  {curT.modalClose}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SemesterPlannerMain
