'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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
  ExternalLink,
  Feather,
  Filter,
  GraduationCap,
  Info,
  Layers,
  MapPin,
  Moon,
  MoveRight,
  Plane,
  Plus,
  Power,
  Sparkles,
  Sun,
  TentTree,
  Trash2,
  Users,
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
  weeks: string[] // week ids e.g. ['w42', 'w43']
}

export interface ScheduledClass {
  id: string
  date: string // YYYY-MM-DD
  week: string // e.g. w39
  time: string // e.g. 10:15 - 12:00
  course: string
  room: string
  reason: 'Lecture' | 'Exercise' | 'Supervision' | 'Workshop' | 'Exam' | 'Presentation' | 'Field studies' | 'Seminar' | 'Problemlösning'
  teacher: string
  comment?: string
  mapUrl?: string
  isCrucial?: boolean // Exam or Presentation or Field studies
}

export interface AcademicMilestone {
  id: string
  title: string
  date: string // YYYY-MM-DD
  endDate?: string
  type: 'exam' | 'presentation' | 'field' | 'holiday'
  description: string
  week: string
  courseKey?: 'scicomp' | 'geophysics' | 'xr' | 'physics' | 'holiday'
}

// Actual Schedule Extracted from TimeEdit (2026-09-21 - 2027-01-17)
export const realScheduleEvents: ScheduledClass[] = [
  // w39
  { id: 'ev-1', date: '2026-09-21', week: 'w39', time: '10:15 - 12:00', course: 'Applied Geophysics and Rock Physics', room: 'Skåne, Geocentrum', reason: 'Lecture', teacher: 'Thomas Kalscheuer', comment: 'Electromagnetic and geoelectric methods' },
  { id: 'ev-2', date: '2026-09-22', week: 'w39', time: '13:15 - 15:00', course: 'Applied Geophysics and Rock Physics', room: 'Småland, Geocentrum', reason: 'Lecture', teacher: 'Thomas Kalscheuer', comment: 'Electromagnetic and geoelectric methods' },
  { id: 'ev-3', date: '2026-09-23', week: 'w39', time: '08:30 - 10:00', course: 'Project with Extended Reality', room: 'See Comments', reason: 'Supervision', teacher: 'Kaveh Amouzgar', comment: 'Online-Zoom' },
  { id: 'ev-4', date: '2026-09-23', week: 'w39', time: '15:15 - 17:00', course: 'Applied Geophysics and Rock Physics', room: 'Skåne, Geocentrum', reason: 'Lecture', teacher: 'Viktor Stender', comment: 'Exercise session EM/Electrical methods I' },
  { id: 'ev-5', date: '2026-09-24', week: 'w39', time: '10:15 - 12:00', course: 'Applied Geophysics and Rock Physics', room: 'Båthsalen, Geocentrum', reason: 'Lecture', teacher: 'Viktor Stender', comment: 'Exercise session EM/electrical Methods II' },
  { id: 'ev-6', date: '2026-09-25', week: 'w39', time: '10:15 - 12:00', course: 'Applied Geophysics and Rock Physics', room: 'Skåne, Geocentrum', reason: 'Lecture', teacher: 'Alireza Malehmir', comment: 'Fieldcourse prep' },

  // w40 (Full week field studies!)
  { id: 'ev-7', date: '2026-09-28', week: 'w40', time: '08:15 - 17:00', course: 'Applied Geophysics and Rock Physics', room: 'Field', reason: 'Field studies', teacher: 'Alireza Malehmir', isCrucial: true, comment: '야외 지질물리 실습 (전일 출석 필수)' },
  { id: 'ev-8', date: '2026-09-29', week: 'w40', time: '08:15 - 17:00', course: 'Applied Geophysics and Rock Physics', room: 'Field', reason: 'Field studies', teacher: 'Alireza Malehmir', isCrucial: true, comment: '야외 지질물리 실습 (전일 출석 필수)' },
  { id: 'ev-9', date: '2026-09-30', week: 'w40', time: '08:15 - 17:00', course: 'Applied Geophysics and Rock Physics', room: 'Field', reason: 'Field studies', teacher: 'Alireza Malehmir', isCrucial: true, comment: '야외 지질물리 실습 (전일 출석 필수)' },
  { id: 'ev-10', date: '2026-09-30', week: 'w40', time: '08:30 - 10:00', course: 'Project with Extended Reality', room: 'See Comments', reason: 'Supervision', teacher: 'Kaveh Amouzgar', comment: 'Online' },
  { id: 'ev-11', date: '2026-10-01', week: 'w40', time: '08:15 - 17:00', course: 'Applied Geophysics and Rock Physics', room: 'Field', reason: 'Field studies', teacher: 'Alireza Malehmir', isCrucial: true, comment: '야외 지질물리 실습 (전일 출석 필수)' },
  { id: 'ev-12', date: '2026-10-02', week: 'w40', time: '08:15 - 17:00', course: 'Applied Geophysics and Rock Physics', room: 'Field', reason: 'Field studies', teacher: 'Alireza Malehmir', isCrucial: true, comment: '야외 지질물리 실습 (전일 출석 필수)' },

  // w41
  { id: 'ev-13', date: '2026-10-05', week: 'w41', time: '10:15 - 12:00', course: 'Project with Extended Reality', room: 'Online', reason: 'Lecture', teacher: 'Kaveh Amouzgar', comment: 'Guest Lecture (Online)' },
  { id: 'ev-14', date: '2026-10-06', week: 'w41', time: '10:15 - 12:00', course: 'Project with Extended Reality', room: '101136, Ångström', reason: 'Workshop', teacher: 'Kaveh Amouzgar', comment: 'Evelyn Sokolowski, Ångström' },

  // w42
  { id: 'ev-15', date: '2026-10-16', week: 'w42', time: '13:15 - 16:00', course: 'Project with Extended Reality', room: 'Via Zoom', reason: 'Lecture', teacher: 'Kaveh Amouzgar', comment: 'Guest Lecture' },

  // w44 (Presentations & Exam)
  { id: 'ev-16', date: '2026-10-26', week: 'w44', time: '08:00 - 12:00', course: 'Project with Extended Reality', room: '101162, Ångström', reason: 'Presentation', teacher: 'Kaveh Amouzgar', isCrucial: true, comment: 'XR 프로젝트 최종 발표 (오전)' },
  { id: 'ev-17', date: '2026-10-26', week: 'w44', time: '13:15 - 17:00', course: 'Project with Extended Reality', room: '101162, Ångström', reason: 'Presentation', teacher: 'Kaveh Amouzgar', isCrucial: true, comment: 'XR 프로젝트 최종 발표 (오후)' },
  { id: 'ev-18', date: '2026-10-29', week: 'w44', time: '13:15 - 15:00', course: 'Applied Geophysics and Rock Physics', room: 'Hall', reason: 'Exam', teacher: 'Alireza Malehmir', isCrucial: true, comment: '지질물리학 중간 시험 (Exam)' },

  // w45 (Period 2 Starts!)
  { id: 'ev-19', date: '2026-11-02', week: 'w45', time: '08:15 - 10:00', course: 'Introduction to Scientific Computing', room: '101121, Sonja Lyttkens, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L1' },
  { id: 'ev-20', date: '2026-11-02', week: 'w45', time: '13:15 - 15:00', course: 'Introduction to Scientific Computing', room: '101142, Ångström', reason: 'Supervision', teacher: 'Murtazo Nazarov', comment: 'Project Supervision PHS1' },
  { id: 'ev-21', date: '2026-11-03', week: 'w45', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: '101121, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L2' },
  { id: 'ev-22', date: '2026-11-04', week: 'w45', time: '08:15 - 10:00', course: 'Human-Computer Interaction', room: '80127, Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F1' },
  { id: 'ev-23', date: '2026-11-04', week: 'w45', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: '101195, Heinz-Otto Kreiss, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L3' },
  { id: 'ev-24', date: '2026-11-06', week: 'w45', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: '2002, Ångström', reason: 'Problemlösning', teacher: 'Murtazo Nazarov', comment: 'ASP1' },

  // w46
  { id: 'ev-25', date: '2026-11-09', week: 'w46', time: '08:15 - 10:00', course: 'Human-Computer Interaction', room: '80101, Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F2' },
  { id: 'ev-26', date: '2026-11-09', week: 'w46', time: '10:15 - 12:00', course: 'Fails in Physics', room: '80115, Ångström', reason: 'Lecture', teacher: 'Rebeca Gonzalez Suarez' },
  { id: 'ev-27', date: '2026-11-10', week: 'w46', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80121, Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F3' },
  { id: 'ev-28', date: '2026-11-10', week: 'w46', time: '15:15 - 17:00', course: 'Introduction to Scientific Computing', room: '101195, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L4' },
  { id: 'ev-29', date: '2026-11-11', week: 'w46', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: '101142, Ångström', reason: 'Supervision', teacher: 'Murtazo Nazarov', comment: 'PHS2' },
  { id: 'ev-30', date: '2026-11-11', week: 'w46', time: '15:15 - 17:00', course: 'Introduction to Scientific Computing', room: '101121, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L5' },
  { id: 'ev-31', date: '2026-11-12', week: 'w46', time: '08:15 - 10:00', course: 'Introduction to Scientific Computing', room: '101195, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L6' },
  { id: 'ev-32', date: '2026-11-13', week: 'w46', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80127, Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F4' },

  // w47
  { id: 'ev-33', date: '2026-11-16', week: 'w47', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: '2002, Ångström', reason: 'Problemlösning', teacher: 'Murtazo Nazarov', comment: 'ASP2' },
  { id: 'ev-34', date: '2026-11-17', week: 'w47', time: '08:15 - 10:00', course: 'Human-Computer Interaction', room: '80127, Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F5' },
  { id: 'ev-35', date: '2026-11-17', week: 'w47', time: '13:15 - 15:00', course: 'Introduction to Scientific Computing', room: '101195, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L7' },
  { id: 'ev-36', date: '2026-11-18', week: 'w47', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80121, Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F6' },
  { id: 'ev-37', date: '2026-11-19', week: 'w47', time: '13:15 - 15:00', course: 'Introduction to Scientific Computing', room: '101195, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L8' },
  { id: 'ev-38', date: '2026-11-20', week: 'w47', time: '08:15 - 10:00', course: 'Introduction to Scientific Computing', room: '101142, Ångström', reason: 'Supervision', teacher: 'Murtazo Nazarov', comment: 'PHS3' },

  // w48
  { id: 'ev-39', date: '2026-11-24', week: 'w48', time: '08:15 - 10:00', course: 'Introduction to Scientific Computing', room: '101195, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L9' },
  { id: 'ev-40', date: '2026-11-25', week: 'w48', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80121, Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F7' },
  { id: 'ev-41', date: '2026-11-26', week: 'w48', time: '15:15 - 17:00', course: 'Introduction to Scientific Computing', room: '101195, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L10' },

  // w49
  { id: 'ev-42', date: '2026-11-30', week: 'w49', time: '15:15 - 17:00', course: 'Introduction to Scientific Computing', room: '2002, Ångström', reason: 'Problemlösning', teacher: 'Murtazo Nazarov', comment: 'ASP3' },
  { id: 'ev-43', date: '2026-12-01', week: 'w49', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: '101195, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L11' },

  // w50
  { id: 'ev-44', date: '2026-12-08', week: 'w50', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: '101142, Ångström', reason: 'Supervision', teacher: 'Murtazo Nazarov', comment: 'PHS4' },
  { id: 'ev-45', date: '2026-12-09', week: 'w50', time: '10:15 - 12:00', course: 'Human-Computer Interaction', room: '80121, Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F8' },
  { id: 'ev-46', date: '2026-12-09', week: 'w50', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: '101121, Ångström', reason: 'Lecture', teacher: 'Murtazo Nazarov', comment: 'L12' },
  { id: 'ev-47', date: '2026-12-11', week: 'w50', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80121, Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F9' },

  // w51 (Fails in Physics Intensive Week!)
  { id: 'ev-48', date: '2026-12-14', week: 'w51', time: '08:15 - 17:00', course: 'Fails in Physics', room: '4006, Ångström', reason: 'Seminar', teacher: 'Rebeca Gonzalez Suarez', isCrucial: true, comment: '전일 세미나' },
  { id: 'ev-49', date: '2026-12-14', week: 'w51', time: '13:15 - 15:00', course: 'Human-Computer Interaction', room: '11137, Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F10' },
  { id: 'ev-50', date: '2026-12-15', week: 'w51', time: '08:15 - 17:00', course: 'Fails in Physics', room: '4006, Ångström', reason: 'Seminar', teacher: 'Rebeca Gonzalez Suarez', isCrucial: true, comment: '전일 세미나' },
  { id: 'ev-51', date: '2026-12-16', week: 'w51', time: '08:15 - 17:00', course: 'Fails in Physics', room: '80115, Ångström', reason: 'Seminar', teacher: 'Rebeca Gonzalez Suarez', isCrucial: true, comment: '전일 세미나' },
  { id: 'ev-52', date: '2026-12-16', week: 'w51', time: '08:15 - 10:00', course: 'Introduction to Scientific Computing', room: '2002, Ångström', reason: 'Problemlösning', teacher: 'Murtazo Nazarov', comment: 'APS4' },
  { id: 'ev-53', date: '2026-12-17', week: 'w51', time: '08:15 - 17:00', course: 'Fails in Physics', room: '80115, Ångström', reason: 'Seminar', teacher: 'Rebeca Gonzalez Suarez', isCrucial: true, comment: '전일 세미나' },
  { id: 'ev-54', date: '2026-12-18', week: 'w51', time: '13:15 - 15:00', course: 'Human-Computer Interaction', room: 'Ångström', reason: 'Lecture', teacher: 'Edward White', comment: 'HCI F11 (종강 세션)' },

  // w2 (Final Exam 2027)
  { id: 'ev-55', date: '2027-01-11', week: 'w2', time: '08:00 - 17:00', course: 'Introduction to Scientific Computing', room: 'Visit Ladok', reason: 'Exam', teacher: 'Murtazo Nazarov', isCrucial: true, comment: '최종 기말고사 (Final Exam)' },
]

export const academicMilestones: AcademicMilestone[] = [
  { id: 'm-field', title: '야외 지질물리 실습 (Field studies)', date: '2026-09-28', endDate: '2026-10-02', type: 'field', description: '매일 08:15-17:00 야외 실습 (출석 필수)', week: 'w40', courseKey: 'geophysics' },
  { id: 'm-xr-pres', title: 'XR 프로젝트 최종 발표 (Final Presentation)', date: '2026-10-26', type: 'presentation', description: '08:00-12:00, 13:15-17:00 종일 발표 세션', week: 'w44', courseKey: 'xr' },
  { id: 'm-geo-exam', title: '지질물리학 중간 시험 (Geophysics Exam)', date: '2026-10-29', type: 'exam', description: '13:15 - 15:00 중간고사 필기시험', week: 'w44', courseKey: 'geophysics' },
  { id: 'm-p2-start', title: 'Period 2 개강', date: '2026-11-02', type: 'presentation', description: '2쿼터 개강 및 새 과목 시작', week: 'w45' },
  { id: 'm-fails-sem', title: 'Fails in Physics 집중 세미나 주간', date: '2026-12-14', endDate: '2026-12-17', type: 'field', description: '4일 연속 08:15-17:00 세미나 (필참)', week: 'w51', courseKey: 'physics' },
  { id: 'm-jul-eve', title: '크리스마스 이브 (Julafton)', date: '2026-12-24', type: 'holiday', description: '스웨덴 공식 휴일 / 겨울방학', week: 'w52', courseKey: 'holiday' },
  { id: 'm-jul-day', title: '크리스마스 (Juldagen)', date: '2026-12-25', type: 'holiday', description: '공휴일', week: 'w52', courseKey: 'holiday' },
  { id: 'm-annandag', title: '박싱데이 (Annandag jul)', date: '2026-12-26', type: 'holiday', description: '공휴일', week: 'w52', courseKey: 'holiday' },
  { id: 'm-nyar-eve', title: '연말 (Nyårsafton)', date: '2026-12-31', type: 'holiday', description: '휴일', week: 'w53', courseKey: 'holiday' },
  { id: 'm-nyar-day', title: '신정 (Nyårsdagen)', date: '2027-01-01', type: 'holiday', description: '새해 첫날 휴일', week: 'w53', courseKey: 'holiday' },
  { id: 'm-tretton', title: '주현절 (Trettondedag jul)', date: '2027-01-06', type: 'holiday', description: '스웨덴 공휴일', week: 'w1', courseKey: 'holiday' },
  { id: 'm-scicomp-exam', title: 'Scientific Computing 기말 시험 (Final Exam)', date: '2027-01-11', type: 'exam', description: '08:00 - 17:00 기말고사 및 학기 마감', week: 'w2', courseKey: 'scicomp' },
]

// Updated 2026-2027 Realistic Trip Mock Data
const initialTrips2026: Trip[] = [
  {
    id: 'trip-uk-scotland-france',
    emoji: '🇬🇧🇫🇷',
    title: '영국, 스코틀랜드, 프랑스 (런던·축구·대자연·파리게임위크·몽생미셸)',
    period: '2026-10-13 ~ 10-24 · 화~토 (11박 12일)',
    startDate: '2026-10-13',
    endDate: '2026-10-24',
    status: 'planning',
    keyTheme: '런던 산책 & EPL 축구 & 스코틀랜드 대자연 & 파리 게임 위크 & 몽생미셸',
    academicOverlapNote: '10/16(금) 13:15 XR 줌 수업 1회 (온라인 수강 가능), 대면 수업 일체 없음 (10/26 XR 발표 전 복귀)',
    academicRiskLevel: 'low',
    routeOptions: [
      { name: '루트 A (영국 ➔ 스코틀랜드 ➔ 유로스타 ➔ 프랑스)', transport: '항공 + 기차 + 유로스타', description: '런던(가볍게 시내 산책 + EPL 경기 직관) ➔ 에든버러 & 하이랜드 대자연 ➔ 유로스타로 파리 이동(파리 게임 위크 + 몽생미셸 당일 투어)', pros: '5대 희망 코스를 빠짐없이 연결하는 황금 동선', meta: '11박 12일 일정' },
    ],
    notes: '• 런던 가볍게 보기: 빅벤, 웨스트엔드 등 런던 시내 명소 산책\n• 축구 보기: 영국 EPL 프리미어리그 직관\n• 스코틀랜드 대자연 구경하기: 에든버러 및 하이랜드/스카이섬 대자연\n• 파리 게임 위크 구경: Paris Games Week(PGW) 관람\n• 몽생미셸 당일 투어: 파리 출발 몽생미셸 수도원 투어',
    checklist: [
      { id: 'chk-uk1', text: '런던-파리 유로스타 티켓 확인', done: false },
      { id: 'chk-uk2', text: 'EPL 축구 경기 일정 및 티켓 예매', done: false },
      { id: 'chk-uk3', text: '파리 게임 위크(PGW) 티켓 예매', done: false },
      { id: 'chk-uk4', text: '몽생미셸 당일 투어 예약', done: false },
    ],
    weeks: ['w42', 'w43'],
  },
  {
    id: 'trip-kiruna',
    emoji: '🌌',
    title: '키루나 & 아비스코 · 북극권 오로라 헌팅',
    period: '2026-10-15 ~ 10-18 · 목~일 (3박 4일)',
    startDate: '2026-10-15',
    endDate: '2026-10-18',
    status: 'planning',
    keyTheme: '오로라 & 설산 하이킹',
    academicOverlapNote: '10/16(금) 13:15 XR 줌 수업 1회 겹침 (온라인 참가 또는 리플레이 시청 가능)',
    academicRiskLevel: 'medium',
    routeOptions: [
      { name: '루트 A (스야열차 침대칸)', transport: 'SJ 나이트 트레인', description: '스톡홀름 중앙역 저녁 출발 ➔ 아침 아비스코 국립공원 도착', pros: '풍경 낭만 최고, 숙박비 절약', meta: '소요 16시간 · 학생 할인' },
      { name: '루트 B (항공 직행)', transport: 'SAS 항공 (ARN ➔ KRN)', description: '아를란다 공항 ➔ 키루나 공항 1시간 40분 비행', pros: '체력 및 이동 시간 압도적 단축', meta: '비용 다소 발생' },
    ],
    notes: '• 아비스코 하늘스테이션(Sky Station) 사전 티켓팅\n• 영하 15도 대비 히트텍, 방한 부츠 필수\n• XR 프로젝트 발표(10/26) 1주일 전이라 이동 중 슬라이드 준비',
    checklist: [
      { id: 'chk-k1', text: 'SJ 야간침대열차 예약하기', done: true },
      { id: 'chk-k2', text: '10/16 줌 수업 이동 중 수강 가능 여부 확인', done: false },
      { id: 'chk-k3', text: '아비스코 오로라 투어 가이드 예약', done: false },
    ],
    weeks: ['w42'],
  },
  {
    id: 'trip-cph',
    emoji: '🇩🇰',
    title: '코펜하겐 & 말뫼 · 디자인 & 건축 힐링',
    period: '2026-11-20 ~ 11-23 · 금~월 (3박 4일)',
    startDate: '2026-11-20',
    endDate: '2026-11-23',
    status: 'idea',
    keyTheme: '북유럽 디자인 & 베이커리',
    academicOverlapNote: '11/20(금) SciComp 드랍 시 금요일 전면 공강 확보! (월요일 수업 없음)',
    academicRiskLevel: 'low',
    routeOptions: [
      { name: '루트 A (SJ 고속철도 X2000)', transport: 'SJ 고속열차 직행', description: '스톡홀름 ➔ 코펜하겐 중앙역 직통 5시간 (외레순 다리 횡단)', pros: '도심에서 도심으로 편안한 이동', meta: '왕복 티켓 조기 예매 권장' },
      { name: '루트 B (코펜하겐 2일 + 말뫼 1일)', transport: '외레순스토그(Öresundståg)', description: '디자인 뮤지엄 + 뉘하운 운하 + 말뫼 터닝토르소', pros: '2개국 동시 여행 감성', meta: '교통 패스 이용' },
    ],
    notes: '• 루이지애나 현대미술관 방문 강추\n• 페이스트리 맛집 Hart Bageri 체크',
    checklist: [
      { id: 'chk-c1', text: 'SJ X2000 얼리버드 예매', done: false },
      { id: 'chk-c2', text: '코펜하겐 에어비앤비 위시리스트', done: false },
    ],
    weeks: ['w47', 'w48'],
  },
  {
    id: 'trip-winter',
    emoji: '🎄',
    title: '크리스마스 & 신년 남유럽 휴양 (바르셀로나 & 리스본)',
    period: '2026-12-21 ~ 2027-01-03 (13박 14일)',
    startDate: '2026-12-21',
    endDate: '2027-01-03',
    status: 'confirmed',
    keyTheme: '햇살 탈출 & 미식 휴양',
    academicOverlapNote: '완벽한 겨울방학 기간! (SciComp 드랍 시 1월 기말시험 부담까지 완전 제로)',
    academicRiskLevel: 'low',
    routeOptions: [
      { name: '루트 A (스페인 바르셀로나 + 안달루시아)', transport: '유럽 저가항공 + 렌페 고속열차', description: '가우디 건축 탐방 + 세비야 플라멩코 + 따뜻한 지중해 햇살', pros: '완벽한 날씨와 미식', meta: '성수기 항공권 사전 확보' },
      { name: '루트 B (포르투갈 리스본 & 포르투)', transport: '직항 항공', description: '도루강 와이너리 + 리스본 알파마 언덕 노을 감상', pros: '가성비와 여유로운 분위기', meta: '신년 불꽃놀이' },
    ],
    notes: '• 12/18일 종강 후 출발하여 1/4 복귀 예정\n• SciComp 드랍 시 여행 후 1월 시험공부 압박 없이 편안한 휴식 가능',
    checklist: [
      { id: 'chk-w1', text: '스톡홀름 ➔ 바르셀로나 항공권 발권 완료', done: true },
      { id: 'chk-w2', text: '크리스마스 당일(12/25) 영업 레스토랑 예약', done: true },
      { id: 'chk-w3', text: '사그라다 파밀리아 성당 입장권 사전 예약', done: false },
    ],
    weeks: ['w52', 'w53'],
  },
]

// 2026 Fall ~ 2027 January Calendar Month Metadata (5 Months!)
export const months2026_2027 = [
  { year: 2026, month: 9, name: '2026년 9월', startDay: 2, days: 30, quarter: 'Period 1 (가을학기 개강)' },
  { year: 2026, month: 10, name: '2026년 10월', startDay: 4, days: 31, quarter: 'Period 1 (야외실습 & 중간평가)' },
  { year: 2026, month: 11, name: '2026년 11월', startDay: 0, days: 30, quarter: 'Period 2 (SciComp & HCI 시작)' },
  { year: 2026, month: 12, name: '2026년 12월', startDay: 2, days: 31, quarter: 'Period 2 (세미나 & 겨울방학)' },
  { year: 2027, month: 1, name: '2027년 1월', startDay: 5, days: 31, quarter: '학기 기말고사 & 종강' },
]

// 17 Weeks in this semester (w39 to w2)
export const termWeeks = [
  { id: 'w39', label: 'w39', dates: '09/21–09/27', topic: '개강 주간 (Geophysics 시작)' },
  { id: 'w40', label: 'w40', dates: '09/28–10/04', topic: '야외 실습 (Field studies) ⚠️' },
  { id: 'w41', label: 'w41', dates: '10/05–10/11', topic: 'XR 워크숍' },
  { id: 'w42', label: 'w42', dates: '10/12–10/18', topic: '수업 주간 (오로라 여행 추천)' },
  { id: 'w43', label: 'w43', dates: '10/19–10/25', topic: '시험 준비 주간' },
  { id: 'w44', label: 'w44', dates: '10/26–11/01', topic: 'XR 발표(10/26) & 시험(10/29) 🚨' },
  { id: 'w45', label: 'w45', dates: '11/02–11/08', topic: 'Period 2 시작 (SciComp/HCI)' },
  { id: 'w46', label: 'w46', dates: '11/09–11/15', topic: 'SciComp & HCI 강의' },
  { id: 'w47', label: 'w47', dates: '11/16–11/22', topic: '정규 수업 주간' },
  { id: 'w48', label: 'w48', dates: '11/23–11/29', topic: '정규 수업 주간' },
  { id: 'w49', label: 'w49', dates: '11/30–12/06', topic: 'SciComp 수업' },
  { id: 'w50', label: 'w50', dates: '12/07–12/13', topic: '프로젝트 슈퍼비전' },
  { id: 'w51', label: 'w51', dates: '12/14–12/20', topic: 'Fails in Physics 집중세미나 ⚠️' },
  { id: 'w52', label: 'w52', dates: '12/21–12/27', topic: '크리스마스 방학 🎄' },
  { id: 'w53', label: 'w53', dates: '12/28–01/03', topic: '연말연시 휴일 ✈️' },
  { id: 'w1', label: 'w1', dates: '01/04–01/10', topic: '신년 주간 (1/6 휴일)' },
  { id: 'w2', label: 'w2', dates: '01/11–01/17', topic: 'SciComp 기말고사(1/11) & 종강 🎓' },
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

export function SemesterDashboard() {
  const [view, setView] = useState<'calendar' | 'board' | 'timetable'>('calendar')
  const [trips, setTrips] = useState<Trip[]>(initialTrips2026)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(1) // 2026년 10월 기본 선택
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-15')
  const [selectedWeekId, setSelectedWeekId] = useState<string>('w42')
  const [dark, setDark] = useState(false) // 라이트 모드 기본
  const [newOpen, setNewOpen] = useState(false)

  // ⭐️ Scientific Computing Drop Simulator Toggle
  const [showSciComp, setShowSciComp] = useState<boolean>(true)

  // New Trip state
  const [newTitle, setNewTitle] = useState('')
  const [newEmoji, setNewEmoji] = useState('✈️')
  const [newStartDate, setNewStartDate] = useState('2026-11-20')
  const [newEndDate, setNewEndDate] = useState('2026-11-23')
  const [newPeriodText, setNewPeriodText] = useState('')
  const [newStatus, setNewStatus] = useState<TripStatus>('idea')
  const [newTheme, setNewTheme] = useState('')
  const [newAcademicNote, setNewAcademicNote] = useState('')
  const [newRouteADesc, setNewRouteADesc] = useState('')
  const [newRouteBDesc, setNewRouteBDesc] = useState('')
  const [newNotes, setNewNotes] = useState('')

  // Theme Sync (Default: Light)
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('semester-theme-2026')
    if (savedTheme === 'dark') {
      setDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !dark
    setDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      window.localStorage.setItem('semester-theme-2026', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      window.localStorage.setItem('semester-theme-2026', 'light')
    }
  }

  // SciComp toggle sync with LocalStorage
  useEffect(() => {
    const savedSciComp = window.localStorage.getItem('semester-show-scicomp')
    if (savedSciComp !== null) {
      setShowSciComp(savedSciComp === 'true')
    }
  }, [])

  const toggleSciComp = (checked: boolean) => {
    setShowSciComp(checked)
    window.localStorage.setItem('semester-show-scicomp', String(checked))
  }

  // LocalStorage trips
  useEffect(() => {
    const saved = window.localStorage.getItem('semester-trips-2026')
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
    window.localStorage.setItem('semester-trips-2026', JSON.stringify(updated))
  }

  // Filtered Events and Milestones based on SciComp toggle
  const activeScheduleEvents = useMemo(() => {
    if (showSciComp) return realScheduleEvents
    return realScheduleEvents.filter((ev) => ev.course !== 'Introduction to Scientific Computing')
  }, [showSciComp])

  const activeMilestones = useMemo(() => {
    if (showSciComp) return academicMilestones
    return academicMilestones.filter((m) => m.courseKey !== 'scicomp')
  }, [showSciComp])

  // Status update
  const handleUpdateStatus = (tripId: string, nextStatus: TripStatus) => {
    const updated = trips.map((t) => (t.id === tripId ? { ...t, status: nextStatus } : t))
    saveTrips(updated)
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip({ ...selectedTrip, status: nextStatus })
    }
  }

  // Toggle checklist
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

  // Create Trip
  const handleCreateTrip = () => {
    if (!newTitle.trim()) return

    const periodStr =
      newPeriodText.trim() ||
      `${newStartDate.replace('2026-', '').replace('2027-', '')} ~ ${newEndDate.replace('2026-', '').replace('2027-', '')}`

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      emoji: newEmoji || '✈️',
      title: newTitle.trim(),
      period: periodStr,
      startDate: newStartDate,
      endDate: newEndDate,
      status: newStatus,
      keyTheme: newTheme.trim() || '북유럽 힐링 여행',
      academicOverlapNote: newAcademicNote.trim() || '금요일 수업 유무 및 과제 마감 확인 권장',
      academicRiskLevel: 'low',
      routeOptions: [
        {
          name: '루트 A (기본 코스)',
          transport: '기차/대중교통',
          description: newRouteADesc.trim() || '도심 명소 및 주요 문화 탐방',
          pros: '이동 편의성 우수',
          meta: '표준 코스',
        },
        ...(newRouteBDesc.trim()
          ? [
              {
                name: '루트 B (대안 코스)',
                transport: '항공/렌터카',
                description: newRouteBDesc.trim(),
                pros: '자유로운 이동',
                meta: '체력 및 예산 고려',
              },
            ]
          : []),
      ],
      notes: newNotes.trim() || '• 세부 일정 구상 중',
      checklist: [
        { id: `c-${Date.now()}-1`, text: '기차/항공권 시간표 대조', done: false },
        { id: `c-${Date.now()}-2`, text: '해당 주간 수업 과제 사전 완료', done: false },
      ],
      weeks: [selectedWeekId],
    }

    const updated = [newTrip, ...trips]
    saveTrips(updated)

    // Reset Form
    setNewTitle('')
    setNewPeriodText('')
    setNewTheme('')
    setNewAcademicNote('')
    setNewRouteADesc('')
    setNewRouteBDesc('')
    setNewNotes('')
    setNewOpen(false)
  }

  // Month navigation
  const currentMonth = months2026_2027[selectedMonthIndex]

  // Inspector details for selected date
  const inspectDateDetails = useMemo(() => {
    if (!selectedDate) return null
    const dateObj = new Date(selectedDate)
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()]
    const isFriday = dateObj.getDay() === 5
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6

    const dayClasses = activeScheduleEvents.filter((ev) => ev.date === selectedDate)
    const rawDayClasses = realScheduleEvents.filter((ev) => ev.date === selectedDate)
    const droppedSciCompClasses = rawDayClasses.filter(
      (ev) => ev.course === 'Introduction to Scientific Computing' && !showSciComp
    )

    const dayMilestones = activeMilestones.filter((m) => {
      if (m.endDate) {
        return selectedDate >= m.date && selectedDate <= m.endDate
      }
      return m.date === selectedDate
    })
    const dayTrips = trips.filter((t) => selectedDate >= t.startDate && selectedDate <= t.endDate)

    return {
      date: selectedDate,
      dayOfWeek,
      isFriday,
      isWeekend,
      classes: dayClasses,
      droppedSciCompClasses,
      milestones: dayMilestones,
      trips: dayTrips,
    }
  }, [selectedDate, activeScheduleEvents, activeMilestones, showSciComp, trips])

  return (
    <div className={cn('min-h-screen transition-colors duration-200', dark ? 'dark bg-[#0d1017] text-zinc-100' : 'bg-[#fafafa] text-zinc-900')}>
      {/* 1. Top Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-[#0d1017]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo & Semester Metadata */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white shadow-md shadow-indigo-500/20">
              <Compass className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  학기 & 여행 로드맵 (Semester & Travel Planner)
                </span>
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                  2026 가을 ~ 2027년 1월
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Uppsala University · Applied Geophysics, Scientific Computing, HCI & Fails in Physics
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Link to Travel Invite / Share Page */}
            <Link href="/invite">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-zinc-300 bg-zinc-50 font-semibold text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 text-xs shadow-xs"
              >
                <Compass className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>여행 후보 목록 & 일정 조율</span>
              </Button>
            </Link>

            {/* Theme Toggle */}
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
                <Button size="sm" className="gap-1.5 bg-indigo-600 font-semibold text-white shadow hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400">
                  <Plus className="size-4" />
                  <span>새 여행 등록</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-200 bg-white text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-[#161922] dark:text-zinc-100 sm:max-w-[540px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                    <span>✨ 2026/2027 새 여행 아이디어 등록</span>
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
                        placeholder="예: 트롬소 고래 사파리 · 피오르드 탐방"
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
                      placeholder="예: 11월 넷째 주 금~월 (3박 4일)"
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
                        placeholder="예: 오로라, 크리스마스 마켓, 미식"
                        className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">학업 영향도 메모</label>
                    <Input
                      value={newAcademicNote}
                      onChange={(e) => setNewAcademicNote(e.target.value)}
                      placeholder="예: 금요일 수업 유무 및 과제 마감 확인"
                      className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </div>

                  <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <p className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">루트 옵션 비교 (선택)</p>
                    <div className="flex flex-col gap-2">
                      <Input
                        value={newRouteADesc}
                        onChange={(e) => setNewRouteADesc(e.target.value)}
                        placeholder="루트 A: 기차/대중교통 중심 코스"
                        className="text-xs border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                      />
                      <Input
                        value={newRouteBDesc}
                        onChange={(e) => setNewRouteBDesc(e.target.value)}
                        placeholder="루트 B: 항공/렌터카 대안 코스"
                        className="text-xs border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">메모 & 챙길 것</label>
                    <Textarea
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="• 기차 시간표 확인&#10;• 방한 장갑 준비"
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

      {/* 2. Sub-Nav & View Switcher Bar with SciComp Drop Simulation Switch */}
      <div className="border-b border-zinc-200/70 bg-white/60 dark:border-zinc-800/60 dark:bg-[#11141c]/60">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          {/* Key Semester Highlights & Drop Toggle */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {/* ⭐️ SCIENTIFIC COMPUTING DROP SIMULATOR SWITCH */}
            <div
              className={cn(
                'flex items-center gap-2.5 rounded-full border px-3 py-1 transition-all shadow-xs',
                showSciComp
                  ? 'border-indigo-200 bg-indigo-50/70 text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200'
                  : 'border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200 ring-1 ring-amber-400/40'
              )}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span>{showSciComp ? '🧪' : '🛑'}</span>
                <span>Scientific Computing:</span>
              </div>
              <Switch
                checked={showSciComp}
                onCheckedChange={toggleSciComp}
                aria-label="Toggle Introduction to Scientific Computing"
              />
              <span className="font-extrabold text-[11px]">
                {showSciComp ? '수강 중 (ON)' : '드랍 시뮬레이션 (OFF)'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <Sparkles className="size-3.5 text-indigo-500" />
              <span>등록 여행 <strong>{trips.length}개</strong></span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <TentTree className="size-3.5" />
              <span>황금 연휴: <strong>12/21~1/3 크리스마스 방학 (14일)</strong></span>
            </div>
          </div>

          {/* 3 Main View Tabs */}
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="w-full sm:w-auto">
            <TabsList className="grid h-10 w-full grid-cols-3 border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900/80 sm:w-[420px]">
              <TabsTrigger
                value="calendar"
                className="gap-1.5 text-xs font-semibold text-zinc-700 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:text-zinc-300 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-indigo-400"
              >
                <CalendarDays className="size-3.5" />
                <span>월별 달력 & 로드맵</span>
              </TabsTrigger>
              <TabsTrigger
                value="board"
                className="gap-1.5 text-xs font-semibold text-zinc-700 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:text-zinc-300 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-indigo-400"
              >
                <Layers className="size-3.5" />
                <span>여행 보드</span>
              </TabsTrigger>
              <TabsTrigger
                value="timetable"
                className="gap-1.5 text-xs font-semibold text-zinc-700 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:text-zinc-300 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-indigo-400"
              >
                <GraduationCap className="size-3.5" />
                <span>학업 시간표</span>
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
            {/* Drop Simulation Active Banner (Visible when SciComp is OFF) */}
            {!showSciComp && (
              <div className="flex items-center justify-between rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-xs dark:border-amber-800/80 dark:from-amber-950/40 dark:to-orange-950/20">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-bold text-amber-900 dark:text-amber-200">
                      'Introduction to Scientific Computing' 드랍 시뮬레이션 적용 중
                    </p>
                    <p className="mt-0.5 text-amber-800/90 dark:text-amber-300">
                      11~12월 수업(총 20개 세션)과 <strong>2027년 1월 11일 기말시험</strong>이 달력 및 로드맵에서 제외되었습니다. 11월과 12월의 여행 가능 요일이 대폭 늘어납니다!
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleSciComp(true)}
                  className="border-amber-300 text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 font-semibold"
                >
                  수업 복원 (ON)
                </Button>
              </div>
            )}

            {/* Top Overview Roadmap Bar (Lane 1: Milestones, Lane 2: Trips) */}
            <Card className="border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-[#13161f]">
              <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/60">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      2026-2027 학기 전체 타임라인 (w39 ~ w2 / 17주차)
                    </CardTitle>
                    <Badge variant="outline" className="border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400 text-[10px]">
                      TimeEdit 연동
                    </Badge>
                    {!showSciComp && (
                      <Badge className="bg-amber-500 text-white text-[10px]">
                        SciComp 드랍 적용됨
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    주차를 클릭하면 해당 주의 실제 수업 및 마일스톤, 추천 여행 기간이 강조됩니다.
                  </p>
                </div>
                {/* Legend */}
                <div className="hidden items-center gap-3 text-[11px] text-zinc-600 dark:text-zinc-400 md:flex">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-500" />
                    <span>실습/발표/시험</span>
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
                    <span>확정 여행</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="overflow-x-auto p-4">
                <div className="min-w-[980px]">
                  {/* Grid of 17 weeks */}
                  <div className="grid grid-cols-[90px_repeat(17,minmax(50px,1fr))] gap-1">
                    {/* Header: Weeks */}
                    <div className="py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      주차 / 일자
                    </div>
                    {termWeeks.map((tw) => (
                      <button
                        key={tw.id}
                        onClick={() => setSelectedWeekId(tw.id)}
                        className={cn(
                          'group flex flex-col items-center rounded-lg py-2 text-center transition-all',
                          selectedWeekId === tw.id
                            ? 'bg-indigo-100/90 text-indigo-950 ring-2 ring-indigo-500 dark:bg-indigo-950/90 dark:text-indigo-200'
                            : 'hover:bg-zinc-100 text-zinc-600 dark:hover:bg-zinc-800/60 dark:text-zinc-400'
                        )}
                      >
                        <span className="text-[11px] font-bold">{tw.label}</span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500">{tw.dates.split('–')[0]}</span>
                      </button>
                    ))}

                    {/* Lane 1: Academic Milestones */}
                    <div className="flex items-center gap-1.5 border-t border-zinc-100 py-3 text-xs font-semibold text-zinc-700 dark:border-zinc-800/80 dark:text-zinc-300">
                      <GraduationCap className="size-3.5 text-rose-500" />
                      <span>학사 마일스톤</span>
                    </div>
                    {termWeeks.map((tw) => {
                      const miles = activeMilestones.filter((m) => m.week === tw.id)
                      const isHolidayWeek = tw.id === 'w52' || tw.id === 'w53'
                      const isSciCompDroppedWeek2 = tw.id === 'w2' && !showSciComp

                      return (
                        <div
                          key={`academic-${tw.id}`}
                          className={cn(
                            'relative min-h-[56px] border-l border-t border-zinc-100 p-1 transition-colors dark:border-zinc-800/60',
                            selectedWeekId === tw.id && 'bg-indigo-50/40 dark:bg-indigo-950/20',
                            isHolidayWeek && 'bg-emerald-50/25 dark:bg-emerald-950/15'
                          )}
                        >
                          {isSciCompDroppedWeek2 ? (
                            <div className="flex flex-col items-center justify-center rounded bg-emerald-100 p-1 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                              <span>시험 면제✨</span>
                            </div>
                          ) : (
                            miles.map((mile) => (
                              <div
                                key={mile.id}
                                title={`${mile.title} (${mile.date})`}
                                className={cn(
                                  'mb-1 flex flex-col items-center justify-center rounded px-1 py-1 text-[9px] font-bold leading-tight shadow-xs',
                                  mile.type === 'exam' || mile.type === 'presentation'
                                    ? 'bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/90 dark:text-rose-200 dark:border-rose-800'
                                    : mile.type === 'field'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/90 dark:text-amber-200 dark:border-amber-800'
                                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/90 dark:text-emerald-200 dark:border-emerald-800'
                                )}
                              >
                                <span className="truncate max-w-[50px]">{mile.title.split(' ')[0]}</span>
                              </div>
                            ))
                          )}
                        </div>
                      )
                    })}

                    {/* Lane 2: Travel Bars */}
                    <div className="flex items-center gap-1.5 border-t border-zinc-100 py-3 text-xs font-semibold text-zinc-700 dark:border-zinc-800/80 dark:text-zinc-300">
                      <Plane className="size-3.5 text-indigo-500" />
                      <span>여행 시뮬레이션</span>
                    </div>
                    {termWeeks.map((tw) => {
                      const weekTrips = trips.filter((t) => t.weeks.includes(tw.id))
                      return (
                        <div
                          key={`travel-${tw.id}`}
                          className={cn(
                            'relative min-h-[62px] border-l border-t border-zinc-100 p-1 transition-colors dark:border-zinc-800/60',
                            selectedWeekId === tw.id && 'bg-indigo-50/40 dark:bg-indigo-950/20'
                          )}
                        >
                          {weekTrips.map((trip) => (
                            <button
                              key={trip.id}
                              onClick={() => setSelectedTrip(trip)}
                              className={cn(
                                'w-full rounded border px-1.5 py-1 text-left text-[10px] font-semibold transition-all hover:scale-[1.03] shadow-xs truncate',
                                statusMeta[trip.status].className,
                                trip.status === 'idea' && 'border-dashed'
                              )}
                            >
                              <span>
                                {trip.emoji} {trip.title.split(' · ')[0].split(' ')[0]}
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

            {/* MONTHLY CALENDAR GRID & INSPECTOR (2026-09 ~ 2027-01) */}
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              {/* Left: Monthly Calendar */}
              <Card className="border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-[#13161f]">
                {/* Month Navigator Header */}
                <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/60">
                  <div className="flex items-center gap-2 sm:gap-3">
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
                      <span className="px-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {currentMonth.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={selectedMonthIndex === months2026_2027.length - 1}
                        onClick={() => setSelectedMonthIndex((prev) => Math.min(months2026_2027.length - 1, prev + 1))}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>

                    {/* 5 Month Direct Switch Buttons */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {months2026_2027.map((m, idx) => (
                        <Button
                          key={m.name}
                          variant={selectedMonthIndex === idx ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedMonthIndex(idx)}
                          className={cn(
                            'h-7 px-2 text-xs font-semibold',
                            selectedMonthIndex === idx
                              ? 'bg-indigo-600 text-white'
                              : 'text-zinc-600 dark:text-zinc-400'
                          )}
                        >
                          {m.year === 2027 ? `'27 1월` : `${m.month}월`}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <span className="hidden text-xs text-indigo-600 dark:text-indigo-400 font-medium sm:inline">
                    {currentMonth.quarter}
                  </span>
                </CardHeader>

                <CardContent className="p-3 sm:p-5">
                  {/* Days of week header (월 화 수 목 금 토 일) */}
                  <div className="grid grid-cols-7 gap-1 pb-2 text-center text-xs font-bold text-zinc-500 dark:text-zinc-400">
                    <div className="text-zinc-700 dark:text-zinc-300">월 (Mon)</div>
                    <div className="text-zinc-700 dark:text-zinc-300">화 (Tue)</div>
                    <div className="text-zinc-700 dark:text-zinc-300">수 (Wed)</div>
                    <div className="text-zinc-700 dark:text-zinc-300">목 (Thu)</div>
                    <div className="text-zinc-700 dark:text-zinc-300">금 (Fri)</div>
                    <div className="text-zinc-400 dark:text-zinc-500">토 (Sat)</div>
                    <div className="text-rose-500 dark:text-rose-400">일 (Sun)</div>
                  </div>

                  {/* Calendar Grid cells */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {/* Empty placeholder cells for previous month padding */}
                    {Array.from({ length: (currentMonth.startDay + 6) % 7 }).map((_, idx) => (
                      <div
                        key={`pad-${idx}`}
                        className="min-h-[96px] rounded-lg border border-dashed border-zinc-100 bg-zinc-50/30 p-1.5 opacity-40 dark:border-zinc-800/40 dark:bg-zinc-900/20"
                      />
                    ))}

                    {/* Actual Days of this month */}
                    {Array.from({ length: currentMonth.days }).map((_, idx) => {
                      const dayNumber = idx + 1
                      const dateStr = `${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
                      const dayOfWeekIndex = (currentMonth.startDay + idx) % 7 // 0=Sun, 1=Mon, ..., 6=Sat
                      const isSunday = dayOfWeekIndex === 0
                      const isSelected = selectedDate === dateStr

                      // Check Milestones on this date
                      const dayMilestone = activeMilestones.find((m) => {
                        if (m.endDate) {
                          return dateStr >= m.date && dateStr <= m.endDate
                        }
                        return m.date === dateStr
                      })

                      // Check Trips covering this date
                      const dayTrips = trips.filter((t) => dateStr >= t.startDate && dateStr <= t.endDate)

                      // Classes on this date (affected by SciComp toggle)
                      const dayClasses = activeScheduleEvents.filter((ev) => ev.date === dateStr)
                      const hasExamOrImportant = dayClasses.some((c) => c.isCrucial)

                      // Check if SciComp was dropped on this date
                      const hadSciCompDropped =
                        !showSciComp &&
                        realScheduleEvents.some(
                          (ev) => ev.date === dateStr && ev.course === 'Introduction to Scientific Computing'
                        )

                      return (
                        <div
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={cn(
                            'group relative min-h-[98px] cursor-pointer rounded-xl border p-1.5 transition-all sm:p-2 flex flex-col justify-between',
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/50'
                              : 'border-zinc-200/70 bg-white hover:border-zinc-300 hover:bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-850',
                            dayMilestone?.type === 'holiday' && 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/40'
                          )}
                        >
                          {/* Date Number & Indicator Dots */}
                          <div>
                            <div className="flex items-center justify-between">
                              <span
                                className={cn(
                                  'text-xs font-bold',
                                  isSunday && 'text-rose-500 dark:text-rose-400',
                                  !isSunday && 'text-zinc-800 dark:text-zinc-200'
                                )}
                              >
                                {dayNumber}
                              </span>

                              {/* Classes count badge */}
                              {dayClasses.length > 0 ? (
                                <span
                                  className={cn(
                                    'rounded px-1 text-[9px] font-bold',
                                    hasExamOrImportant
                                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                                  )}
                                >
                                  {hasExamOrImportant ? '🚨 실습/시험' : `${dayClasses.length}수업`}
                                </span>
                              ) : hadSciCompDropped ? (
                                <span className="rounded bg-amber-100 px-1 text-[8px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                  드랍(공강)
                                </span>
                              ) : null}
                            </div>

                            {/* Academic Milestone Badge on Date */}
                            {dayMilestone && (
                              <div
                                className={cn(
                                  'mt-1 truncate rounded px-1.5 py-0.5 text-[9px] font-bold leading-tight',
                                  dayMilestone.type === 'exam' || dayMilestone.type === 'presentation'
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                    : dayMilestone.type === 'field'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                )}
                                title={dayMilestone.title}
                              >
                                {dayMilestone.title.split(' ')[0]}
                              </div>
                            )}
                          </div>

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
                                  'truncate rounded border px-1.5 py-0.5 text-[10px] font-semibold transition-transform hover:scale-105',
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
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        선택 날짜 인스펙터
                      </span>
                      <Badge variant="outline" className="border-zinc-200 dark:border-zinc-700 font-semibold">
                        {inspectDateDetails?.dayOfWeek}요일
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {inspectDateDetails?.date}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 p-4 text-xs">
                    {/* Dropped SciComp Notice for this date */}
                    {!showSciComp && inspectDateDetails && inspectDateDetails.droppedSciCompClasses.length > 0 && (
                      <div className="rounded-lg border border-amber-300 bg-amber-50/90 p-2.5 text-amber-900 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-200">
                        <p className="font-bold flex items-center gap-1.5">
                          <span>🛑 SciComp 드랍 효과 반영됨</span>
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed">
                          오늘 배정되었던 <strong>Scientific Computing {inspectDateDetails.droppedSciCompClasses.length}개 세션</strong>이 드랍되어 자유 시간이 확보되었습니다.
                        </p>
                      </div>
                    )}

                    {/* Milestones on this day */}
                    {inspectDateDetails && inspectDateDetails.milestones.length > 0 && (
                      <div>
                        <span className="mb-1.5 block font-bold text-zinc-800 dark:text-zinc-200">
                          📌 학사 일정 / 마일스톤
                        </span>
                        {inspectDateDetails.milestones.map((m) => (
                          <div
                            key={m.id}
                            className={cn(
                              'rounded-lg border p-2.5 leading-relaxed',
                              m.type === 'holiday'
                                ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                                : 'border-rose-200 bg-rose-50/80 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
                            )}
                          >
                            <p className="font-bold">{m.title}</p>
                            <p className="mt-0.5 text-[11px] opacity-80">{m.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Classes on this day (Active events) */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                          📚 TimeEdit 수업 스케줄
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {inspectDateDetails?.classes.length || 0}건
                        </span>
                      </div>

                      {inspectDateDetails && inspectDateDetails.classes.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {inspectDateDetails.classes.map((cls) => (
                            <div
                              key={cls.id}
                              className={cn(
                                'rounded-lg border p-2.5 transition-all',
                                cls.isCrucial
                                  ? 'border-rose-300 bg-rose-50/80 dark:border-rose-800 dark:bg-rose-950/40'
                                  : 'border-zinc-200/80 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-850/60'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-[9px] font-bold',
                                    cls.isCrucial
                                      ? 'border-rose-400 bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                                      : 'border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300'
                                  )}
                                >
                                  {cls.reason}
                                </Badge>
                                <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                  {cls.time}
                                </span>
                              </div>

                              <p className="mt-1 font-bold text-zinc-900 dark:text-zinc-100">
                                {cls.course}
                              </p>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                📍 {cls.room} {cls.teacher && `· ${cls.teacher}`}
                              </p>
                              {cls.comment && (
                                <p className="mt-1 text-[11px] font-medium text-amber-800 dark:text-amber-300">
                                  💬 {cls.comment}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-zinc-200/80 bg-zinc-50 p-3 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-400">
                          {inspectDateDetails?.isWeekend ? '주말 (수업 없음)' : '수업이 배정되지 않은 날입니다.'}
                        </div>
                      )}
                    </div>

                    {/* Trips overlapping with this day */}
                    <div>
                      <span className="mb-1.5 block font-bold text-zinc-800 dark:text-zinc-200">
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
                                <span className="font-bold text-sm">
                                  {trip.emoji} {trip.title}
                                </span>
                                <Badge variant="outline" className="text-[10px]">
                                  {statusMeta[trip.status].label.split(' ')[0]}
                                </Badge>
                              </div>
                              <p className="mt-1 text-[11px] opacity-80">{trip.period}</p>
                              <p className="mt-2 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
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

                {/* Uppsala University Guidance Tip */}
                <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-4 text-xs text-indigo-950 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-200">
                  <p className="font-bold">🇸🇪 웁살라대 학기 여행 전략</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-indigo-800 dark:text-indigo-300">
                    • <strong>9/28~10/2</strong>(야외실습) 및 <strong>10/26~10/29</strong>(발표/시험) 기간은 결석 불가.<br />
                    • <strong>SciComp 드랍 시</strong> 11월과 12월 평일 및 1월 시험기간이 온전히 자유 여행 슬롯으로 전환됩니다!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TRAVEL KANBAN BOARD */}
        {view === 'board' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  여행 아이디어 칸반 보드 (Travel Kanban & Route Canvas)
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  아이디어 발굴부터 코스 구상, 확정까지 여행 계획을 단계별로 시뮬레이션합니다.
                </p>
              </div>

              <Button
                onClick={() => setNewOpen(true)}
                size="sm"
                className="gap-1.5 bg-indigo-600 font-semibold text-white hover:bg-indigo-500 self-start sm:self-auto"
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
                          className="h-5 px-1.5 text-[11px] bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-bold"
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
                          <span>등록된 여행이 없습니다.</span>
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
                            <div className="mb-2 flex items-start justify-between">
                              <span className="text-2xl">{trip.emoji}</span>
                              <Badge
                                variant="outline"
                                className={cn('text-[10px] font-bold', statusMeta[trip.status].className)}
                              >
                                {statusMeta[trip.status].label.split(' ')[0]}
                              </Badge>
                            </div>

                            <h4 className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
                              {trip.title}
                            </h4>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              📅 {trip.period}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                              <Badge
                                variant="secondary"
                                className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 text-[10px] font-medium"
                              >
                                #{trip.keyTheme}
                              </Badge>
                              {trip.checklist.length > 0 && (
                                <Badge
                                  variant="outline"
                                  className="border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400 text-[10px]"
                                >
                                  체크 {trip.checklist.filter((c) => c.done).length}/{trip.checklist.length}
                                </Badge>
                              )}
                            </div>

                            <div className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50/70 p-2 text-[11px] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                              <span className="font-bold">학업 영향:</span> {trip.academicOverlapNote}
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

        {/* VIEW 3: TIMEEDIT REAL SCHEDULE & TIMETABLE */}
        {view === 'timetable' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  2026-2027 TimeEdit 학업 일정 & 과목별 시간표
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Uppsala University 정규 수업 및 마일스톤 상세 분석 (현재 {activeScheduleEvents.length}개 세션 표시 중)
                </p>
              </div>

              {/* SciComp quick switch in timetable */}
              <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">SciComp 표시:</span>
                <Switch checked={showSciComp} onCheckedChange={toggleSciComp} />
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {showSciComp ? 'ON' : '드랍 (OFF)'}
                </span>
              </div>
            </div>

            {/* Courses Overview Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-[#13161f]">
                <Badge className="bg-violet-600 text-white text-[10px]">Period 1 (9~10월)</Badge>
                <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">Applied Geophysics</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Geocentrum · Alireza Malehmir</p>
                <div className="mt-3 rounded bg-zinc-50 p-2 text-[11px] text-zinc-700 dark:bg-zinc-850 dark:text-zinc-300">
                  ⚠️ <strong>9/28~10/2</strong> 종일 야외 실습<br />
                  📝 <strong>10/29 13:15</strong> 중간고사 시험
                </div>
              </Card>

              <Card className="border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-[#13161f]">
                <Badge className="bg-sky-600 text-white text-[10px]">Period 1 (9~10월)</Badge>
                <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">Project with XR</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Ångström & Zoom · Kaveh Amouzgar</p>
                <div className="mt-3 rounded bg-zinc-50 p-2 text-[11px] text-zinc-700 dark:bg-zinc-850 dark:text-zinc-300">
                  🎯 <strong>10/26 08:00~17:00</strong> 최종 발표<br />
                  💻 온라인 줌 슈퍼비전
                </div>
              </Card>

              {/* SciComp Card with drop badge */}
              <Card
                className={cn(
                  'p-4 shadow-sm transition-all',
                  showSciComp
                    ? 'border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-[#13161f]'
                    : 'border-dashed border-amber-300 bg-amber-50/40 opacity-70 dark:border-amber-900 dark:bg-amber-950/20'
                )}
              >
                <div className="flex items-center justify-between">
                  <Badge className="bg-amber-600 text-white text-[10px]">Period 2 (11~1월)</Badge>
                  {!showSciComp && (
                    <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                      드랍됨 (OFF)
                    </Badge>
                  )}
                </div>
                <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">Scientific Computing</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Ångström · Murtazo Nazarov</p>
                <div className="mt-3 rounded bg-zinc-50 p-2 text-[11px] text-zinc-700 dark:bg-zinc-850 dark:text-zinc-300">
                  {showSciComp ? (
                    <>
                      강의 L1~L12 + 프로젝트 슈퍼비전<br />
                      🎓 <strong>2027-01-11</strong> 최종 기말시험
                    </>
                  ) : (
                    <span className="text-amber-800 dark:text-amber-300 font-semibold">
                      드랍 적용 상태입니다. 수업 및 시험이 시간표에서 제외되었습니다.
                    </span>
                  )}
                </div>
              </Card>

              <Card className="border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-[#13161f]">
                <Badge className="bg-emerald-600 text-white text-[10px]">Period 2 (11~12월)</Badge>
                <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">HCI & Fails in Physics</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Edward White & Rebeca Gonzalez</p>
                <div className="mt-3 rounded bg-zinc-50 p-2 text-[11px] text-zinc-700 dark:bg-zinc-850 dark:text-zinc-300">
                  HCI 세션 F1~F11<br />
                  ⚠️ <strong>12/14~12/17</strong> 집중 세미나 주간
                </div>
              </Card>
            </div>

            {/* TimeEdit Event Log Table */}
            <Card className="border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#13161f]">
              <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/60">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    전체 수업 상세 타임라인 리스트 (TimeEdit Full Session Log)
                  </CardTitle>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {showSciComp ? '전체 55개 세션 표시 중' : 'Scientific Computing 제외 후 35개 세션 표시 중'}
                  </p>
                </div>

                {!showSciComp && (
                  <Badge variant="outline" className="border-amber-400 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                    SciComp 20개 세션 숨김 중
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-zinc-50 text-zinc-500 dark:bg-zinc-850 dark:text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-750">
                      <tr>
                        <th className="p-3">날짜 / 주차</th>
                        <th className="p-3">시간</th>
                        <th className="p-3">과목명</th>
                        <th className="p-3">강의실</th>
                        <th className="p-3">구분</th>
                        <th className="p-3">교수</th>
                        <th className="p-3">비고 / 내용</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {activeScheduleEvents.map((ev) => (
                        <tr
                          key={ev.id}
                          className={cn(
                            'hover:bg-zinc-50/80 dark:hover:bg-zinc-850/50 transition-colors',
                            ev.isCrucial && 'bg-rose-50/40 dark:bg-rose-950/20 font-semibold'
                          )}
                        >
                          <td className="p-3 font-mono">
                            {ev.date} <span className="text-[10px] text-zinc-400">({ev.week})</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {ev.time}
                          </td>
                          <td className="p-3 text-zinc-900 dark:text-zinc-100 font-medium">
                            {ev.course}
                          </td>
                          <td className="p-3 text-zinc-500 dark:text-zinc-400">
                            {ev.room}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px]',
                                ev.isCrucial
                                  ? 'border-rose-400 bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                                  : 'border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300'
                              )}
                            >
                              {ev.reason}
                            </Badge>
                          </td>
                          <td className="p-3 text-zinc-500 dark:text-zinc-400">
                            {ev.teacher}
                          </td>
                          <td className="p-3 text-zinc-600 dark:text-zinc-300">
                            {ev.comment || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* 4. TRIP DETAIL DRAWER / SHEET */}
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
                  <SelectTrigger className="border-zinc-300 bg-zinc-50 font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
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
                  <span>TimeEdit 학업 영향도 및 수업 충돌 분석</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-amber-800 dark:text-amber-300 font-medium">
                  {selectedTrip.academicOverlapNote}
                </p>
                {!showSciComp && (
                  <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    ✓ SciComp 드랍 시뮬레이션 적용 중: 해당 과목으로 인한 일정 부담이 완화됩니다.
                  </p>
                )}
              </div>

              {/* Route Options Comparison */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    루트 옵션 비교 (Route Options)
                  </h4>
                  <span className="text-[11px] text-zinc-400">교통수단 및 소요시간 대조</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedTrip.routeOptions.map((route) => (
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

export default SemesterDashboard
