'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Feather,
  Filter,
  GraduationCap,
  Layers,
  MapPin,
  Moon,
  MoreHorizontal,
  MoveRight,
  Plane,
  Plus,
  Sparkles,
  Sun,
  TentTree,
  Trash2,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Types
export type TripStatus = 'idea' | 'planning' | 'confirmed'

export interface RouteOption {
  name: string
  transport: string
  description: string
  pros: string
  meta: string
}

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface Trip {
  id: string
  emoji: string
  title: string
  period: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  status: TripStatus
  keyTheme: string
  academicOverlapNote: string
  academicRiskLevel: 'low' | 'medium' | 'high'
  routeOptions: RouteOption[]
  notes: string
  checklist: ChecklistItem[]
  weeks: number[] // week indices 0~15
}

export interface Course {
  id: string
  name: string
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
  time: string
  room: string
  color: string
  dotClass: string
  hasConflictRisk?: boolean
}

export interface Milestone {
  id: string
  title: string
  date: string // YYYY-MM-DD
  type: 'exam' | 'assignment' | 'holiday'
  description: string
  weekIndex: number
}

// Initial Mock Data
const defaultCourses: Course[] = [
  { id: 'c1', day: 'Mon', name: '디자인 시스템 (Design Systems)', time: '10:00–11:30', room: 'Studio 2B', color: 'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700', dotClass: 'bg-violet-500' },
  { id: 'c2', day: 'Mon', name: 'UX 연구방법론 (Research Methods)', time: '14:00–15:30', room: '공학관 301', color: 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700', dotClass: 'bg-sky-500' },
  { id: 'c3', day: 'Tue', name: '데이터와 사회 (Data & Society)', time: '09:30–11:00', room: '경영관 104', color: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700', dotClass: 'bg-amber-500' },
  { id: 'c4', day: 'Wed', name: '디자인 시스템 (Design Systems)', time: '10:00–11:30', room: 'Studio 2B', color: 'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700', dotClass: 'bg-violet-500' },
  { id: 'c5', day: 'Thu', name: '시각 문화 세미나 (Visual Culture)', time: '13:00–15:00', room: '세미나실 1', color: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700', dotClass: 'bg-rose-500', hasConflictRisk: true },
]

const semesterMilestones: Milestone[] = [
  { id: 'm1', title: '개강 (Semester Starts)', date: '2025-09-01', type: 'holiday', description: '2025 가을학기 시작', weekIndex: 0 },
  { id: 'm2', title: '추석 연휴 (Chuseok Holiday)', date: '2025-10-06', type: 'holiday', description: '추석 황금연휴 기간', weekIndex: 5 },
  { id: 'm3', title: '중간고사 (Midterm Exam)', date: '2025-10-20', type: 'exam', description: '중간고사 시험 기간 (여행 비추천)', weekIndex: 7 },
  { id: 'm4', title: 'UX 리서치 1차 과제 제출', date: '2025-11-03', type: 'assignment', description: '방법론 보고서 제출 마감', weekIndex: 9 },
  { id: 'm5', title: '디자인 프로젝트 크리틱', date: '2025-11-14', type: 'assignment', description: '중간 프로토타입 발표 세션', weekIndex: 10 },
  { id: 'm6', title: '기말고사 및 종강 (Finals & Wrap-up)', date: '2025-12-15', type: 'exam', description: '기말고사 및 학기 마감', weekIndex: 15 },
]

const initialTrips: Trip[] = [
  {
    id: 'trip-1',
    emoji: '🇮🇸',
    title: '아이슬란드 레이캬비크 · 오로라 탐방',
    period: '10월 16일–19일 · 목–일 (3박 4일)',
    startDate: '2025-10-16',
    endDate: '2025-10-19',
    status: 'planning',
    keyTheme: '오로라 & 온천',
    academicOverlapNote: '목요일 시각문화 세미나 1회 겹침 (사전 출결 사유서 제출 필요)',
    academicRiskLevel: 'medium',
    routeOptions: [
      { name: '루트 A (골든서클 & 남부)', transport: '렌터카 직행', description: '레이캬비크 거점 + 싱벨리르, 굴포스, 레이니스파라', pros: '풍경 감상 최적, 자유로운 오로라 헌팅', meta: '이동 시간 적정 · 렌트비 분담' },
      { name: '루트 B (투어 버스 중심)', transport: '현지 패키지 투어', description: '블루라군 온천 휴식 + 1일 오로라 투어 버스', pros: '운전 피로 없음, 초행자 친화적', meta: '비용 소폭 상승 · 안정적' },
    ],
    notes: '• 렌터카 예약 전 국제면허증 확인\n• 방한 장갑, 핫팩 필수 준비\n• 오로라 관측 앱 다운로드 (My Aurora Forecast)',
    checklist: [
      { id: 'chk-1', text: '목요일 세미나 교수님께 사전 공결서 문의', done: true },
      { id: 'chk-2', text: '오로라 헌팅용 카메라 삼각대 대여', done: false },
      { id: 'chk-3', text: '블루라군 온천 입장권 사전 예매', done: false },
    ],
    weeks: [6],
  },
  {
    id: 'trip-2',
    emoji: '🇯🇵',
    title: '교토 · 늦가을 단풍 & 카페 산책',
    period: '11월 07일–10일 · 금–월 (3박 4일)',
    startDate: '2025-11-07',
    endDate: '2025-11-10',
    status: 'idea',
    keyTheme: '단풍 & 미식 산책',
    academicOverlapNote: '금요 공강 완벽 활용! (월요일 오전 10시 수업 복귀 가능)',
    academicRiskLevel: 'low',
    routeOptions: [
      { name: '루트 A (교토 중심 정원 투어)', transport: '간사이 공항 하루카 + 버스/도보', description: '기요미즈데라 야간 라이트업 + 아라시야마 텐류지', pros: '가장 진한 가을 교토 정취', meta: '숙소 예약 조기 필요' },
      { name: '루트 B (교토 2일 + 오사카 미식 1일)', transport: '한큐 전철 연계', description: '교토 감성 카페 + 우메다 야경 및 타코야키 투어', pros: '다양한 분위기 체험', meta: '이동이 다소 잦음' },
    ],
    notes: '• 11월 첫째 주는 교토 단풍 절정 직전으로 인파 적당함\n• 아침 일찍 산책하는 코스가 핵심',
    checklist: [
      { id: 'chk-4', text: '특가 항공권 알림 설정', done: true },
      { id: 'chk-5', text: '간사이 조용한 료칸/호텔 후보 3곳 추리기', done: false },
    ],
    weeks: [9],
  },
  {
    id: 'trip-3',
    emoji: '🇵🇹',
    title: '리스본 & 신트라 · 햇살과 에그타르트',
    period: '11월 27일–30일 · 목–일 (3박 4일)',
    startDate: '2025-11-27',
    endDate: '2025-11-30',
    status: 'confirmed',
    keyTheme: '가을 도시 건축 & 미식',
    academicOverlapNote: '중간고사 완전 종료 후 여유 기간 — 학업 부담 제로',
    academicRiskLevel: 'low',
    routeOptions: [
      { name: '루트 A (리스본 시내 + 신트라 당일)', transport: '기차 및 트램', description: '알파마 언덕, 벨렝탑, 신트라 페나성 일일 기차 여행', pros: '클래식 명소 완벽 정복', meta: '도보 이동 많음' },
      { name: '루트 B (카스카이스 해안 산책 연계)', transport: '해안 열차', description: '리스본 구시가지 + 유럽의 서쪽 끝 호카곶 방문', pros: '대서양 오션뷰 감상', meta: '일몰 타이밍 중요' },
    ],
    notes: '• 파스테이스 드 벨렝 본점 대기 시간 고려\n• 28번 트램은 아침 일찍 탑승 권장',
    checklist: [
      { id: 'chk-6', text: '항공권 및 리스본 시내 에어비앤비 예약 완료', done: true },
      { id: 'chk-7', text: '오프라인 구글 지도 다운로드', done: true },
      { id: 'chk-8', text: '벨렝 에그타르트 & 해산물 바 예약', done: false },
    ],
    weeks: [12],
  },
]

const statusMeta: Record<TripStatus, { label: string; className: string; dot: string; border: string }> = {
  idea: {
    label: '아이디어 (Idea)',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800',
    dot: 'bg-indigo-500',
    border: 'border-dashed border-indigo-400/80',
  },
  planning: {
    label: '코스 구상 중 (Planning)',
    className: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500',
    border: 'border-solid border-amber-400',
  },
  confirmed: {
    label: '확정됨 (Confirmed)',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    border: 'border-solid border-emerald-500',
  },
}

// 2025 Fall Semester Calendar Month Data
const monthData = [
  { year: 2025, month: 9, name: '2025년 9월', startDay: 1, days: 30 }, // 9월 1일 월요일 (index 1)
  { year: 2025, month: 10, name: '2025년 10월', startDay: 3, days: 31 }, // 10월 1일 수요일 (index 3)
  { year: 2025, month: 11, name: '2025년 11월', startDay: 6, days: 30 }, // 11월 1일 토요일 (index 6)
  { year: 2025, month: 12, name: '2025년 12월', startDay: 1, days: 31 }, // 12월 1일 월요일 (index 1)
]

const semesterWeeks = [
  { label: 'W1', period: '9/01–9/07', note: '개강' },
  { label: 'W2', period: '9/08–9/14', note: '수강신청 확정' },
  { label: 'W3', period: '9/15–9/21', note: '발표조 구성' },
  { label: 'W4', period: '9/22–9/28', note: '정상 수업' },
  { label: 'W5', period: '9/29–10/05', note: '추석 연휴' },
  { label: 'W6', period: '10/06–10/12', note: '수업 복귀' },
  { label: 'W7', period: '10/13–10/19', note: '중간고사 전주' },
  { label: 'W8', period: '10/20–10/26', note: '중간고사 기간' },
  { label: 'W9', period: '10/27–11/02', note: '학기 후반 시작' },
  { label: 'W10', period: '11/03–11/09', note: '과제 1차 마감' },
  { label: 'W11', period: '11/10–11/16', note: '프로젝트 크리틱' },
  { label: 'W12', period: '11/17–11/23', note: '정상 수업' },
  { label: 'W13', period: '11/24–11/30', note: '여행 추천 주' },
  { label: 'W14', period: '12/01–12/07', note: '기말 프로젝트 정리' },
  { label: 'W15', period: '12/08–12/14', note: '기말고사 전주' },
  { label: 'W16', period: '12/15–12/21', note: '기말고사 & 종강' },
]

export function SemesterDashboard() {
  const [view, setView] = useState<'calendar' | 'board' | 'timetable'>('calendar')
  const [trips, setTrips] = useState<Trip[]>(initialTrips)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(1) // 10월 기본
  const [selectedDate, setSelectedDate] = useState<string>('2025-10-17')
  const [selectedWeek, setSelectedWeek] = useState(6) // 10월 셋째 주
  const [dark, setDark] = useState(true)
  const [newOpen, setNewOpen] = useState(false)

  // New Trip Form state
  const [newTitle, setNewTitle] = useState('')
  const [newEmoji, setNewEmoji] = useState('✈️')
  const [newStartDate, setNewStartDate] = useState('2025-11-20')
  const [newEndDate, setNewEndDate] = useState('2025-11-23')
  const [newPeriodText, setNewPeriodText] = useState('')
  const [newStatus, setNewStatus] = useState<TripStatus>('idea')
  const [newTheme, setNewTheme] = useState('')
  const [newAcademicNote, setNewAcademicNote] = useState('')
  const [newRouteADesc, setNewRouteADesc] = useState('')
  const [newRouteBDesc, setNewRouteBDesc] = useState('')
  const [newNotes, setNewNotes] = useState('')

  // Theme synchronization with document element
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('semester-theme')
    if (savedTheme === 'light') {
      setDark(false)
      document.documentElement.classList.remove('dark')
    } else {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !dark
    setDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      window.localStorage.setItem('semester-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      window.localStorage.setItem('semester-theme', 'light')
    }
  }

  // LocalStorage trips persistence
  useEffect(() => {
    const saved = window.localStorage.getItem('semester-trips-v2')
    if (saved) {
      try {
        setTrips(JSON.parse(saved))
      } catch {
        // use default
      }
    }
  }, [])

  const saveTrips = (updated: Trip[]) => {
    setTrips(updated)
    window.localStorage.setItem('semester-trips-v2', JSON.stringify(updated))
  }

  // Update trip status
  const handleUpdateStatus = (tripId: string, nextStatus: TripStatus) => {
    const updated = trips.map((t) => (t.id === tripId ? { ...t, status: nextStatus } : t))
    saveTrips(updated)
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip({ ...selectedTrip, status: nextStatus })
    }
  }

  // Toggle checklist item
  const handleToggleChecklist = (tripId: string, checkId: string) => {
    const updated = trips.map((t) => {
      if (t.id !== tripId) return t
      const nextChecklist = t.checklist.map((item) =>
        item.id === checkId ? { ...item, done: !item.done } : item
      )
      return { ...t, checklist: nextChecklist }
    })
    saveTrips(updated)
    if (selectedTrip && selectedTrip.id === tripId) {
      const nextSelected = updated.find((t) => t.id === tripId) || null
      setSelectedTrip(nextSelected)
    }
  }

  // Delete trip
  const handleDeleteTrip = (tripId: string) => {
    const updated = trips.filter((t) => t.id !== tripId)
    saveTrips(updated)
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip(null)
    }
  }

  // Add new trip
  const handleCreateTrip = () => {
    if (!newTitle.trim()) return

    const periodStr =
      newPeriodText.trim() ||
      `${newStartDate.split('-')[1]}월 ${newStartDate.split('-')[2]}일 ~ ${newEndDate.split('-')[1]}월 ${newEndDate.split('-')[2]}일`

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      emoji: newEmoji || '✈️',
      title: newTitle.trim(),
      period: periodStr,
      startDate: newStartDate,
      endDate: newEndDate,
      status: newStatus,
      keyTheme: newTheme.trim() || '자유 힐링 여행',
      academicOverlapNote: newAcademicNote.trim() || '금요 공강 활용 가능 여부 확인 필요',
      academicRiskLevel: 'low',
      routeOptions: [
        {
          name: '루트 A (메인)',
          transport: '기차/대중교통',
          description: newRouteADesc.trim() || '시내 중심 코스 및 주요 명소',
          pros: '접근성 우수',
          meta: '가장 무난한 코스',
        },
        ...(newRouteBDesc.trim()
          ? [
              {
                name: '루트 B (대안)',
                transport: '렌터카/항공',
                description: newRouteBDesc.trim(),
                pros: '자유로운 이동',
                meta: '체력 및 비용 고려',
              },
            ]
          : []),
      ],
      notes: newNotes.trim() || '• 세부 일정 구상 중',
      checklist: [
        { id: `c-${Date.now()}-1`, text: '항공/교통편 시간표 확인', done: false },
        { id: `c-${Date.now()}-2`, text: '겹치는 수업 과제 및 출결 체크', done: false },
      ],
      weeks: [selectedWeek],
    }

    const updated = [newTrip, ...trips]
    saveTrips(updated)

    // Reset form
    setNewTitle('')
    setNewPeriodText('')
    setNewTheme('')
    setNewAcademicNote('')
    setNewRouteADesc('')
    setNewRouteBDesc('')
    setNewNotes('')
    setNewOpen(false)
  }

  // Current month config
  const currentMonth = monthData[selectedMonthIndex]

  // Day click inspector helper
  const inspectDateDetails = useMemo(() => {
    if (!selectedDate) return null
    const dateObj = new Date(selectedDate)
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()]
    const isFriday = dateObj.getDay() === 5
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6

    const dayNameMap: Record<number, 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | null> = {
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
    }
    const dayCode = dayNameMap[dateObj.getDay()]
    const matchingCourses = dayCode ? defaultCourses.filter((c) => c.day === dayCode) : []
    const matchingMilestones = semesterMilestones.filter((m) => m.date === selectedDate)
    const matchingTrips = trips.filter((t) => {
      return selectedDate >= t.startDate && selectedDate <= t.endDate
    })

    return {
      date: selectedDate,
      dayOfWeek,
      isFriday,
      isWeekend,
      courses: matchingCourses,
      milestones: matchingMilestones,
      trips: matchingTrips,
    }
  }, [selectedDate, trips])

  return (
    <div className={cn('min-h-screen transition-colors duration-200', dark ? 'dark bg-[#0e1117] text-zinc-100' : 'bg-[#fafafa] text-zinc-900')}>
      {/* 1. Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-[#0e1117]/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/20">
              <Compass className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  학기 & 여행 로드맵
                </span>
                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  2025 가을학기
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Semester & Travel Planner · 학업과 여행의 균형잡힌 로드맵
              </p>
            </div>
          </div>

          {/* Action buttons & View switcher */}
          <div className="flex items-center gap-2">
            {/* Dark / Light Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              title={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {dark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-indigo-600" />}
            </Button>

            {/* New Trip Dialog */}
            <Dialog open={newOpen} onOpenChange={setNewOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 bg-indigo-600 font-medium text-white shadow hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400">
                  <Plus className="size-4" />
                  <span>새 여행 추가</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-200 bg-white text-zinc-900 shadow-xl dark:border-zinc-800 dark:bg-[#161922] dark:text-zinc-100 sm:max-w-[540px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                    <span>✨ 새 여행 아이디어 등록</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                  <div className="grid grid-cols-[64px_1fr] gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">이모지</label>
                      <Input
                        value={newEmoji}
                        onChange={(e) => setNewEmoji(e.target.value)}
                        className="text-center text-lg border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">여행지명 및 제목 *</label>
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="예: 삿포로 눈꽃 축제 · 온천 힐링"
                        className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">시작 날짜</label>
                      <Input
                        type="date"
                        value={newStartDate}
                        onChange={(e) => setNewStartDate(e.target.value)}
                        className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">종료 날짜</label>
                      <Input
                        type="date"
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                        className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">시기 요약 (선택)</label>
                    <Input
                      value={newPeriodText}
                      onChange={(e) => setNewPeriodText(e.target.value)}
                      placeholder="예: 11월 셋째 주 목~일 (3박 4일)"
                      className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">진행 상태</label>
                      <Select value={newStatus} onValueChange={(val) => setNewStatus(val as TripStatus)}>
                        <SelectTrigger className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                          <SelectItem value="idea">💡 아이디어 (Idea)</SelectItem>
                          <SelectItem value="planning">🧭 코스 구상 중 (Planning)</SelectItem>
                          <SelectItem value="confirmed">✈️ 확정됨 (Confirmed)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">테마 태그</label>
                      <Input
                        value={newTheme}
                        onChange={(e) => setNewTheme(e.target.value)}
                        placeholder="예: 오로라, 미식, 단풍 산책"
                        className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">학업 영향도 메모</label>
                    <Input
                      value={newAcademicNote}
                      onChange={(e) => setNewAcademicNote(e.target.value)}
                      placeholder="예: 금요 공강 활용 가능 / 목요 세미나 1회 겹침 주의"
                      className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </div>

                  <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <p className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">루트 옵션 비교 (선택)</p>
                    <div className="flex flex-col gap-2">
                      <Input
                        value={newRouteADesc}
                        onChange={(e) => setNewRouteADesc(e.target.value)}
                        placeholder="루트 A: 기차/대중교통 중심 코스 설명"
                        className="text-xs border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                      />
                      <Input
                        value={newRouteBDesc}
                        onChange={(e) => setNewRouteBDesc(e.target.value)}
                        placeholder="루트 B: 렌터카 또는 항공 대안 코스 설명"
                        className="text-xs border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">메모 & 챙길 것</label>
                    <Textarea
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="• 항공권 특가 확인하기&#10;• 방한복 챙기기"
                      rows={3}
                      className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewOpen(false)} className="border-zinc-300 dark:border-zinc-700">
                    취소
                  </Button>
                  <Button onClick={handleCreateTrip} className="bg-indigo-600 text-white hover:bg-indigo-500">
                    추가하기
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* 2. Sub-Nav & View Switcher Bar */}
      <div className="border-b border-zinc-200/70 bg-white/50 dark:border-zinc-800/60 dark:bg-[#12151c]/60">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-2.5 py-1 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Sparkles className="size-3.5" />
              <span>등록된 여행 <strong>{trips.length}개</strong></span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <TentTree className="size-3.5" />
              <span>금요 공강 <strong>매주 확보 (Long Weekend)</strong></span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/80 px-2.5 py-1 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
              <Clock className="size-3.5" />
              <span>다음 마일스톤: <strong>10/20 중간고사</strong></span>
            </div>
          </div>

          {/* 3 Main View Tabs */}
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="w-full sm:w-auto">
            <TabsList className="grid h-10 w-full grid-cols-3 border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900/80 sm:w-[420px]">
              <TabsTrigger
                value="calendar"
                className="gap-1.5 text-xs font-medium text-zinc-700 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:text-zinc-300 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-indigo-400"
              >
                <CalendarDays className="size-3.5" />
                <span>월별 달력 & 로드맵</span>
              </TabsTrigger>
              <TabsTrigger
                value="board"
                className="gap-1.5 text-xs font-medium text-zinc-700 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:text-zinc-300 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-indigo-400"
              >
                <Layers className="size-3.5" />
                <span>여행 보드</span>
              </TabsTrigger>
              <TabsTrigger
                value="timetable"
                className="gap-1.5 text-xs font-medium text-zinc-700 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:text-zinc-300 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-indigo-400"
              >
                <GraduationCap className="size-3.5" />
                <span>주간 시간표</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 3. Main Views */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* VIEW 1: MONTHLY CALENDAR & ROADMAP */}
        {view === 'calendar' && (
          <div className="flex flex-col gap-6">
            {/* Top Overview Roadmap Bar (Lane 1: Academic Milestones, Lane 2: Trips) */}
            <Card className="border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-[#13161f]">
              <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/60">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      학기 전체 타임라인 로드맵 (Semester Overview)
                    </CardTitle>
                    <Badge variant="outline" className="border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400 text-[10px]">
                      16 Weeks
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    주차(Week)를 클릭하면 하단 달력 및 해당 주간의 학업-여행 충돌 코스가 연동됩니다.
                  </p>
                </div>
                {/* Legend */}
                <div className="hidden items-center gap-3 text-[11px] text-zinc-600 dark:text-zinc-400 md:flex">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-500" />
                    <span>시험/과제 마감</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-indigo-500" />
                    <span>아이디어</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <span>구상 중</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>확정된 여행</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="overflow-x-auto p-4">
                <div className="min-w-[900px]">
                  {/* Grid of 16 weeks */}
                  <div className="grid grid-cols-[90px_repeat(16,minmax(50px,1fr))] gap-1">
                    {/* Header: Weeks */}
                    <div className="py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      주차 / 일자
                    </div>
                    {semesterWeeks.map((sw, idx) => (
                      <button
                        key={sw.label}
                        onClick={() => setSelectedWeek(idx)}
                        className={cn(
                          'group flex flex-col items-center rounded-lg py-2 text-center transition-all',
                          selectedWeek === idx
                            ? 'bg-indigo-100/80 text-indigo-900 ring-2 ring-indigo-500 dark:bg-indigo-950/80 dark:text-indigo-200'
                            : 'hover:bg-zinc-100 text-zinc-600 dark:hover:bg-zinc-800/60 dark:text-zinc-400'
                        )}
                      >
                        <span className="text-[11px] font-bold">{sw.label}</span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500">{sw.period.split('–')[0]}</span>
                      </button>
                    ))}

                    {/* Lane 1: Academic Milestones */}
                    <div className="flex items-center gap-1.5 border-t border-zinc-100 py-3 text-xs font-semibold text-zinc-700 dark:border-zinc-800/80 dark:text-zinc-300">
                      <GraduationCap className="size-3.5 text-rose-500" />
                      <span>학사 일정</span>
                    </div>
                    {semesterWeeks.map((_, idx) => {
                      const mile = semesterMilestones.find((m) => m.weekIndex === idx)
                      return (
                        <div
                          key={`academic-${idx}`}
                          className={cn(
                            'relative min-h-[52px] border-l border-t border-zinc-100 p-1 transition-colors dark:border-zinc-800/60',
                            selectedWeek === idx && 'bg-indigo-50/40 dark:bg-indigo-950/20'
                          )}
                        >
                          {mile && (
                            <div
                              title={`${mile.title} (${mile.date})`}
                              className={cn(
                                'flex flex-col items-center justify-center rounded px-1 py-1 text-[9px] font-medium leading-tight shadow-xs',
                                mile.type === 'exam'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800'
                                  : mile.type === 'assignment'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800'
                                  : 'bg-zinc-100 text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                              )}
                            >
                              <span className="truncate max-w-[50px]">{mile.title.split(' ')[0]}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Lane 2: Travel Bars */}
                    <div className="flex items-center gap-1.5 border-t border-zinc-100 py-3 text-xs font-semibold text-zinc-700 dark:border-zinc-800/80 dark:text-zinc-300">
                      <Plane className="size-3.5 text-indigo-500" />
                      <span>여행 계획</span>
                    </div>
                    {semesterWeeks.map((_, idx) => {
                      const weekTrips = trips.filter((t) => t.weeks.includes(idx))
                      return (
                        <div
                          key={`travel-${idx}`}
                          className={cn(
                            'relative min-h-[58px] border-l border-t border-zinc-100 p-1 transition-colors dark:border-zinc-800/60',
                            selectedWeek === idx && 'bg-indigo-50/40 dark:bg-indigo-950/20'
                          )}
                        >
                          {weekTrips.map((trip) => (
                            <button
                              key={trip.id}
                              onClick={() => setSelectedTrip(trip)}
                              className={cn(
                                'w-full rounded border px-1.5 py-1 text-left text-[10px] font-medium transition-all hover:scale-[1.03] shadow-xs',
                                statusMeta[trip.status].className,
                                trip.status === 'idea' && 'border-dashed'
                              )}
                            >
                              <span className="block truncate font-semibold">
                                {trip.emoji} {trip.title.split(' · ')[0]}
                              </span>
                            </button>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MONTHLY CALENDAR VIEW (핵심 요구사항) */}
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              {/* Left: Monthly Calendar Grid */}
              <Card className="border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-[#13161f]">
                {/* Month Navigator Header */}
                <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/60">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800/60">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={selectedMonthIndex === 0}
                        onClick={() => setSelectedMonthIndex((prev) => Math.max(0, prev - 1))}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <span className="px-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        {currentMonth.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={selectedMonthIndex === monthData.length - 1}
                        onClick={() => setSelectedMonthIndex((prev) => Math.min(monthData.length - 1, prev + 1))}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>

                    {/* Quick Month Switch buttons */}
                    <div className="hidden sm:flex items-center gap-1">
                      {monthData.map((m, idx) => (
                        <Button
                          key={m.name}
                          variant={selectedMonthIndex === idx ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedMonthIndex(idx)}
                          className={cn(
                            'h-7 px-2.5 text-xs',
                            selectedMonthIndex === idx
                              ? 'bg-indigo-600 text-white'
                              : 'text-zinc-600 dark:text-zinc-400'
                          )}
                        >
                          {m.month}월
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    날짜를 클릭하여 당일 수업 및 여행 세부사항을 확인하세요.
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5">
                  {/* Days of week header (월 화 수 목 금 토 일) */}
                  <div className="grid grid-cols-7 gap-1 pb-2 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <div className="text-zinc-600 dark:text-zinc-300">월 (Mon)</div>
                    <div className="text-zinc-600 dark:text-zinc-300">화 (Tue)</div>
                    <div className="text-zinc-600 dark:text-zinc-300">수 (Wed)</div>
                    <div className="text-zinc-600 dark:text-zinc-300">목 (Thu)</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">금 (공강 ✨)</div>
                    <div className="text-zinc-400 dark:text-zinc-500">토 (Sat)</div>
                    <div className="text-rose-500 dark:text-rose-400">일 (Sun)</div>
                  </div>

                  {/* Calendar Grid cells */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {/* Empty placeholder cells for previous month padding */}
                    {Array.from({ length: (currentMonth.startDay + 6) % 7 }).map((_, idx) => (
                      <div
                        key={`pad-${idx}`}
                        className="min-h-[92px] rounded-lg border border-dashed border-zinc-100 bg-zinc-50/40 p-1.5 opacity-40 dark:border-zinc-800/40 dark:bg-zinc-900/20"
                      />
                    ))}

                    {/* Actual Days of this month */}
                    {Array.from({ length: currentMonth.days }).map((_, idx) => {
                      const dayNumber = idx + 1
                      const dateStr = `${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
                      const dayOfWeekIndex = (currentMonth.startDay + idx) % 7 // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
                      const isFriday = dayOfWeekIndex === 5
                      const isSunday = dayOfWeekIndex === 0
                      const isSaturday = dayOfWeekIndex === 6
                      const isSelected = selectedDate === dateStr

                      // Check Milestones on this date
                      const dayMilestone = semesterMilestones.find((m) => m.date === dateStr)

                      // Check Trips covering this date
                      const dayTrips = trips.filter((t) => dateStr >= t.startDate && dateStr <= t.endDate)

                      // Day classes
                      const weekdayNames: Record<number, 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | null> = {
                        1: 'Mon',
                        2: 'Tue',
                        3: 'Wed',
                        4: 'Thu',
                        5: 'Fri',
                      }
                      const classDay = weekdayNames[dayOfWeekIndex]
                      const dayCourses = classDay ? defaultCourses.filter((c) => c.day === classDay) : []

                      return (
                        <div
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={cn(
                            'group relative min-h-[96px] cursor-pointer rounded-xl border p-1.5 transition-all sm:p-2',
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/40'
                              : 'border-zinc-200/70 bg-white hover:border-zinc-300 hover:bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-850',
                            isFriday && !isSelected && 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200/50 dark:border-emerald-900/40'
                          )}
                        >
                          {/* Date Number & Top badges */}
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                'text-xs font-semibold',
                                isSunday && 'text-rose-500 dark:text-rose-400',
                                isFriday && 'text-emerald-700 dark:text-emerald-400 font-bold',
                                !isSunday && !isFriday && 'text-zinc-800 dark:text-zinc-200'
                              )}
                            >
                              {dayNumber}
                            </span>

                            {/* Friday Free Day badge */}
                            {isFriday && (
                              <span className="rounded bg-emerald-100 px-1 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                공강
                              </span>
                            )}

                            {/* Class dot indicators */}
                            {dayCourses.length > 0 && !isFriday && (
                              <div className="flex items-center gap-0.5" title={`${dayCourses.length}개 수업`}>
                                {dayCourses.map((c) => (
                                  <span key={c.id} className={cn('size-1.5 rounded-full', c.dotClass)} />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Academic Milestone Badge on Date */}
                          {dayMilestone && (
                            <div
                              className={cn(
                                'mt-1 truncate rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight shadow-2xs',
                                dayMilestone.type === 'exam'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                              )}
                              title={dayMilestone.title}
                            >
                              ⭐ {dayMilestone.title.split(' ')[0]}
                            </div>
                          )}

                          {/* Trips scheduled on this Date */}
                          <div className="mt-1 flex flex-col gap-1">
                            {dayTrips.map((trip) => (
                              <div
                                key={trip.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedTrip(trip)
                                }}
                                className={cn(
                                  'truncate rounded border px-1.5 py-0.5 text-[10px] font-medium transition-transform hover:scale-105',
                                  statusMeta[trip.status].className,
                                  trip.status === 'idea' && 'border-dashed'
                                )}
                                title={`${trip.title} (${trip.period})`}
                              >
                                {trip.emoji} {trip.title.split(' · ')[0]}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Right: Selected Date & Academic Inspector Panel */}
              <div className="flex flex-col gap-4">
                {/* Date Detail Card */}
                <Card className="border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-[#13161f]">
                  <CardHeader className="border-b border-zinc-100 pb-3 dark:border-zinc-800/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        선택된 날짜 상세
                      </span>
                      <Badge variant="outline" className="border-zinc-200 dark:border-zinc-700">
                        {inspectDateDetails?.dayOfWeek}요일
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {inspectDateDetails?.date}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 p-4 text-xs">
                    {/* Free day highlight */}
                    {inspectDateDetails?.isFriday && (
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-200">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Sparkles className="size-4 text-emerald-500" />
                          <span>금요일 공강일 (Free Day)!</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300">
                          정규 수업이 없는 요일입니다. 목요일 저녁부터 일요일까지 <strong>3박 4일 여행 시뮬레이션</strong>에 가장 이상적인 타이밍입니다.
                        </p>
                      </div>
                    )}

                    {/* Milestones on this day */}
                    {inspectDateDetails && inspectDateDetails.milestones.length > 0 && (
                      <div>
                        <span className="mb-1.5 block font-semibold text-zinc-700 dark:text-zinc-300">
                          📌 학사 일정 / 마감
                        </span>
                        {inspectDateDetails.milestones.map((m) => (
                          <div
                            key={m.id}
                            className="rounded-lg border border-rose-200 bg-rose-50/80 p-2.5 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
                          >
                            <p className="font-semibold">{m.title}</p>
                            <p className="mt-0.5 text-[11px] text-rose-700 dark:text-rose-300">{m.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Classes on this day */}
                    <div>
                      <span className="mb-1.5 block font-semibold text-zinc-700 dark:text-zinc-300">
                        📚 당일 수업 시간표
                      </span>
                      {inspectDateDetails && inspectDateDetails.courses.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {inspectDateDetails.courses.map((course) => (
                            <div
                              key={course.id}
                              className={cn(
                                'flex items-center justify-between rounded-lg border p-2.5',
                                course.color
                              )}
                            >
                              <div>
                                <p className="font-semibold">{course.name}</p>
                                <p className="text-[11px] opacity-80">{course.room}</p>
                              </div>
                              <span className="font-mono text-[11px] font-bold">{course.time}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-400">
                          {inspectDateDetails?.isWeekend ? '주말 (수업 없음)' : '수업이 없는 날입니다.'}
                        </div>
                      )}
                    </div>

                    {/* Trips overlapping with this day */}
                    <div>
                      <span className="mb-1.5 block font-semibold text-zinc-700 dark:text-zinc-300">
                        ✈️ 겹치는 여행 계획
                      </span>
                      {inspectDateDetails && inspectDateDetails.trips.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {inspectDateDetails.trips.map((trip) => (
                            <div
                              key={trip.id}
                              onClick={() => setSelectedTrip(trip)}
                              className={cn(
                                'cursor-pointer rounded-lg border p-3 transition-transform hover:scale-[1.02]',
                                statusMeta[trip.status].className
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">
                                  {trip.emoji} {trip.title}
                                </span>
                                <Badge variant="outline" className="text-[10px]">
                                  {statusMeta[trip.status].label.split(' ')[0]}
                                </Badge>
                              </div>
                              <p className="mt-1 text-[11px] opacity-80">{trip.period}</p>
                              <p className="mt-2 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                                ⚠️ {trip.academicOverlapNote}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-400">
                          이 날짜에 계획된 여행이 없습니다.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Add helper prompt */}
                <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/50 p-4 text-xs text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-200">
                  <p className="font-semibold">💡 여행 계획 시뮬레이션 팁</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-indigo-700 dark:text-indigo-300">
                    시험 1주 전(10월 13일~19일)은 학업 부담이 급증하므로, <strong>11월 13주차(11/24–11/30)</strong>나 <strong>11월 초(11/7–11/10)</strong> 공강 주말을 노리는 것이 가장 안전합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TRAVEL KANBAN BOARD & ROUTE CANVAS */}
        {view === 'board' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  여행 아이디어 칸반 보드 (Travel Kanban & Route Canvas)
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  아이디어 발굴부터 구상, 확정까지 여행 단계를 관리하고 학업 충돌을 시뮬레이션합니다.
                </p>
              </div>

              <Button
                onClick={() => setNewOpen(true)}
                size="sm"
                className="gap-1.5 bg-indigo-600 font-medium text-white hover:bg-indigo-500 self-start sm:self-auto"
              >
                <Plus className="size-4" />
                <span>새 여행 등록</span>
              </Button>
            </div>

            {/* 3 Columns: Idea | Planning | Confirmed */}
            <div className="grid gap-5 lg:grid-cols-3">
              {(['idea', 'planning', 'confirmed'] as TripStatus[]).map((status) => {
                const columnTrips = trips.filter((t) => t.status === status)
                return (
                  <div
                    key={status}
                    className="flex flex-col rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800/80 dark:bg-[#12151c]/70 min-h-[500px]"
                  >
                    {/* Column Header */}
                    <div className="mb-4 flex items-center justify-between border-b border-zinc-200/60 pb-3 dark:border-zinc-800/60">
                      <div className="flex items-center gap-2">
                        <span className={cn('size-2.5 rounded-full', statusMeta[status].dot)} />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {statusMeta[status].label}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-[11px] bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {columnTrips.length}
                        </Badge>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        onClick={() => {
                          setNewStatus(status)
                          setNewOpen(true)
                        }}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>

                    {/* Column Cards */}
                    <div className="flex flex-col gap-3">
                      {columnTrips.length === 0 ? (
                        <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
                          <span>아직 등록된 여행이 없습니다.</span>
                          <button
                            onClick={() => {
                              setNewStatus(status)
                              setNewOpen(true)
                            }}
                            className="mt-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                          >
                            + 새 아이디어 추가
                          </button>
                        </div>
                      ) : (
                        columnTrips.map((trip) => (
                          <div
                            key={trip.id}
                            onClick={() => setSelectedTrip(trip)}
                            className={cn(
                              'group cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-[#161922]',
                              'border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500'
                            )}
                          >
                            {/* Card Top: Emoji & Quick status badge */}
                            <div className="mb-2 flex items-start justify-between">
                              <span className="text-2xl">{trip.emoji}</span>
                              <Badge
                                variant="outline"
                                className={cn('text-[10px] font-semibold', statusMeta[trip.status].className)}
                              >
                                {statusMeta[trip.status].label.split(' ')[0]}
                              </Badge>
                            </div>

                            {/* Title & Period */}
                            <h4 className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
                              {trip.title}
                            </h4>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              📅 {trip.period}
                            </p>

                            {/* Theme badge */}
                            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                              <Badge
                                variant="secondary"
                                className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 text-[10px]"
                              >
                                #{trip.keyTheme}
                              </Badge>
                              {trip.checklist.length > 0 && (
                                <Badge
                                  variant="outline"
                                  className="border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400 text-[10px]"
                                >
                                  체크리스트 {trip.checklist.filter((c) => c.done).length}/{trip.checklist.length}
                                </Badge>
                              )}
                            </div>

                            {/* Academic Overlap Warning Badge */}
                            <div className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50/70 p-2 text-[11px] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                              <span className="font-semibold">학업 연계:</span> {trip.academicOverlapNote}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: WEEKLY TIMETABLE & FREE DAY ANALYSIS */}
        {view === 'timetable' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                학업 주간 시간표 & 공강 시뮬레이션 (Weekly Timetable)
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                월~금 주간 수업 리듬을 조망하고, 롱 위켄드(Long Weekend) 및 여행 결석 가능성을 검토합니다.
              </p>
            </div>

            {/* Timetable Component with conflict toggle */}
            <TimetableDetailed courses={defaultCourses} trips={trips} />
          </div>
        )}
      </main>

      {/* 4. TRIP DETAIL DRAWER / SHEET (루트 옵션 비교, 체크리스트, 상태 변경) */}
      <Sheet open={!!selectedTrip} onOpenChange={(open) => !open && setSelectedTrip(null)}>
        <SheetContent className="w-full overflow-y-auto border-zinc-200 bg-white text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-[#151821] dark:text-zinc-100 sm:max-w-[560px]">
          {selectedTrip && (
            <div className="flex flex-col gap-6 py-4">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={cn('text-xs font-bold', statusMeta[selectedTrip.status].className)}>
                    {statusMeta[selectedTrip.status].label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTrip(selectedTrip.id)}
                    className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="size-4 mr-1" />
                    삭제
                  </Button>
                </div>
                <SheetTitle className="text-left text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
                  {selectedTrip.emoji} {selectedTrip.title}
                </SheetTitle>
                <p className="text-left text-xs text-zinc-500 dark:text-zinc-400">
                  일정: {selectedTrip.period} ({selectedTrip.startDate} ~ {selectedTrip.endDate})
                </p>
              </SheetHeader>

              {/* Status Change Selector */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  진행 상태 변경
                </label>
                <Select
                  value={selectedTrip.status}
                  onValueChange={(val) => handleUpdateStatus(selectedTrip.id, val as TripStatus)}
                >
                  <SelectTrigger className="border-zinc-300 bg-zinc-50 font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                    <SelectItem value="idea">💡 아이디어 (Idea)</SelectItem>
                    <SelectItem value="planning">🧭 코스 구상 중 (Planning)</SelectItem>
                    <SelectItem value="confirmed">✈️ 확정됨 (Confirmed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Academic Overlap Assessment */}
              <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 dark:border-amber-900/70 dark:bg-amber-950/30">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200 text-xs">
                  <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>학업 영향도 및 수업 겹침 분석</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                  {selectedTrip.academicOverlapNote}
                </p>
              </div>

              {/* Route Options Comparison (핵심 요구사항: 루트 A vs 루트 B 비교) */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    루트 옵션 비교 (Route Options)
                  </h4>
                  <span className="text-[11px] text-zinc-400">교통수단 및 소요시간 대조</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedTrip.routeOptions.map((route, idx) => (
                    <div
                      key={route.name}
                      className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 dark:border-zinc-700/80 dark:bg-zinc-850/60"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {route.name}
                          </span>
                          <Badge variant="outline" className="text-[9px] border-zinc-300 dark:border-zinc-700">
                            {route.transport}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                          {route.description}
                        </p>
                      </div>

                      <div className="mt-3 border-t border-zinc-200/80 pt-2 dark:border-zinc-750 text-[11px]">
                        <p className="text-emerald-700 dark:text-emerald-400 font-medium">✓ {route.pros}</p>
                        <p className="mt-0.5 text-zinc-400">{route.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Checklist */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    준비 체크리스트
                  </h4>
                  <span className="text-[11px] text-zinc-400">
                    {selectedTrip.checklist.filter((c) => c.done).length}/{selectedTrip.checklist.length} 완료
                  </span>
                </div>

                <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                  {selectedTrip.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(selectedTrip.id, item.id)}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <div
                        className={cn(
                          'flex size-4 items-center justify-center rounded border transition-colors',
                          item.done
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-zinc-400 dark:border-zinc-600'
                        )}
                      >
                        {item.done && <Check className="size-3" />}
                      </div>
                      <span
                        className={cn(
                          'text-xs',
                          item.done
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-800 dark:text-zinc-200 font-medium'
                        )}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  자유 메모장
                </h4>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3.5 text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 whitespace-pre-line font-mono">
                  {selectedTrip.notes}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Subcomponent: Detailed Timetable with Conflict Toggle
function TimetableDetailed({ courses, trips }: { courses: Course[]; trips: Trip[] }) {
  const [highlightOverlap, setHighlightOverlap] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      {/* Long weekend banner */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-5 dark:border-emerald-800/80 dark:bg-emerald-950/30 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
              금요일 전면 공강 (Free Friday) 확정!
            </h3>
          </div>
          <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
            금요일에 배정된 수업이 없어, 목요일 오후 수업(15:00) 종료 직후부터 일요일까지 <strong>매주 3박 4일 여행 찬스</strong>를 활용할 수 있습니다.
          </p>
        </div>

        {/* Filter Toggle: Highlight classes overlapping with travel */}
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white/90 px-4 py-2.5 dark:border-emerald-900/80 dark:bg-zinc-900">
          <div>
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">여행 시 겹치는 수업 체크</p>
            <p className="text-[10px] text-zinc-500">목요일 세미나 등 출결 주의 과목 강조</p>
          </div>
          <Switch checked={highlightOverlap} onCheckedChange={setHighlightOverlap} />
        </div>
      </div>

      {/* Monday ~ Friday Columns */}
      <div className="grid gap-3 sm:grid-cols-5">
        {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const).map((day) => {
          const dayCourses = courses.filter((c) => c.day === day)
          const dayNamesKorean: Record<string, string> = {
            Mon: '월요일',
            Tue: '화요일',
            Wed: '수요일',
            Thu: '목요일',
            Fri: '금요일',
          }

          return (
            <Card
              key={day}
              className={cn(
                'border transition-all',
                day === 'Fri'
                  ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-800/60 dark:bg-emerald-950/20'
                  : 'border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-[#13161f]'
              )}
            >
              <CardHeader className="border-b border-zinc-100 p-3.5 pb-2.5 dark:border-zinc-800/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{day}</span>
                    <span className="text-[11px] text-zinc-400">({dayNamesKorean[day]})</span>
                  </div>
                  {day === 'Fri' ? (
                    <Badge className="bg-emerald-500 text-white text-[9px] hover:bg-emerald-600">공강</Badge>
                  ) : (
                    <span className="text-[10px] text-zinc-400">{dayCourses.length}과목</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-3.5">
                {dayCourses.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {dayCourses.map((c) => {
                      const isRisk = highlightOverlap && c.hasConflictRisk
                      return (
                        <div
                          key={c.id}
                          className={cn(
                            'rounded-xl border p-3 transition-all',
                            isRisk
                              ? 'border-rose-400 bg-rose-50 shadow-md ring-2 ring-rose-500/30 dark:border-rose-700 dark:bg-rose-950/50'
                              : 'border-zinc-200/70 bg-zinc-50/70 dark:border-zinc-700/60 dark:bg-zinc-850/60'
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={cn('size-2 rounded-full', c.dotClass)} />
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                              {c.name}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                            <span className="font-mono">{c.time}</span>
                            <span>{c.room}</span>
                          </div>

                          {isRisk && (
                            <div className="mt-2 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                              ⚠️ 여행 출발 시 세미나 출결 확인 필요
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 text-center text-zinc-500 dark:text-zinc-400">
                    <span className="text-3xl">✨</span>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">수업 없는 날</p>
                    <p className="text-[11px] text-zinc-400 leading-tight">
                      3박 4일 여행 코스 시뮬레이션 추천
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default SemesterDashboard
