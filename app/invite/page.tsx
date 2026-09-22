'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Heart,
  MapPin,
  MessageCircle,
  Moon,
  Navigation,
  PartyPopper,
  Plane,
  Send,
  Share2,
  Sparkles,
  Sun,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface RouteStop {
  day: string
  title: string
  desc: string
  transport?: string
  highlight?: string
}

interface ProposalTrip {
  id: string
  emoji: string
  destination: string
  title: string
  timing: string
  exactDates: string
  duration: string
  academicVibe: string
  academicBadge: string
  themeTags: string[]
  pitch: string
  routes: {
    main: {
      name: string
      summary: string
      transport: string
      stops: RouteStop[]
    }
    alternative?: {
      name: string
      summary: string
      transport: string
      stops: RouteStop[]
    }
  }
  estimatedBudget: string
  vibeScore: string
}

const proposalTrips: ProposalTrip[] = [
  {
    id: 'kiruna-aurora',
    emoji: '🌌',
    destination: '스웨덴 키루나 & 아비스코 (Kiruna & Abisko)',
    title: '북극권 설산 & 오로라 헌팅 로드트립',
    timing: '10월 중순 (가을의 끝자락, 첫눈과 오로라)',
    exactDates: '2026. 10. 15(목) ~ 10. 18(일)',
    duration: '3박 4일',
    academicVibe: '10/16(금) 온라인 줌 수업 1회 외 수업 없음 (이동 중 수강 가능)',
    academicBadge: '금요 수업 줌 1회 / 여행 최적',
    themeTags: ['오로라 스테이션', '야간침대열차', '아이스호텔', '설산 트레킹'],
    pitch: '유럽에서 오로라를 가장 선명하게 볼 수 있는 아비스코 국립공원! 낭만 있는 SJ 나이트 트레인 침대칸을 타고 설산을 가로질러 북극권으로 떠납니다.',
    routes: {
      main: {
        name: '루트 A: SJ 나이트 트레인 낭만 코스 (강추)',
        transport: 'SJ 야간침대열차 + 도보/현지 투어',
        summary: '스톡홀름에서 밤 기차를 타고 설산 풍경을 보며 아침에 도착하는 감성 코스',
        stops: [
          { day: 'Day 1 (목)', title: '스톡홀름 중앙역 출발', desc: '저녁 18시경 야간열차 침대칸 탑승. 맥주 한 캔 마시며 북극권으로 출발!', transport: 'SJ Night Train' },
          { day: 'Day 2 (금)', title: '아비스코 도착 & 오로라 헌팅', desc: '아침 아비스코 국립공원 도착 후 체크인. 밤에는 Sky Station에서 오로라 관측!', highlight: '🌌 오로라 헌팅 피크' },
          { day: 'Day 3 (토)', title: '키루나 아이스호텔 & 스노모빌', desc: '얼음으로 만든 세계 최초 아이스호텔 투어 & 툰드라 순록 썰매/스노모빌 체험', highlight: '❄️ 얼음 호텔 칵테일' },
          { day: 'Day 4 (일)', title: '웁살라/스톡홀름 복귀', desc: '키루나 공항에서 국내선 항공편으로 1시간 40분 만에 아를란다 공항 도착 복귀', transport: 'SAS 항공' },
        ],
      },
      alternative: {
        name: '루트 B: 왕복 항공 직행 코스 (체력 아끼기)',
        transport: 'SAS / Norwegian 항공 왕복',
        summary: '기차 대신 왕복 비행기를 타서 이동 피로도를 최소화하고 현지 액티비티에 올인하는 코스',
        stops: [
          { day: 'Day 1 (목)', title: '아를란다 ➔ 키루나 직항', desc: '목요일 오후 비행기로 키루나 도착 후 사우나 힐링', transport: '항공 1시간 40분' },
          { day: 'Day 2 (금)', title: '아비스코 오로라 나이트', desc: '온라인 수업 후 저녁 오로라 체이싱 전용 버스 투어', highlight: '오로라 가이드 동행' },
          { day: 'Day 3 (토)', title: '사미족 문화 & 순록 농장', desc: '북극 원주민 사미 문화 체험 및 숲속 캠프파이어' },
          { day: 'Day 4 (일)', title: '키루나 ➔ 스톡홀름 복귀', desc: '일요일 오후 항공편으로 여유롭게 복귀', transport: '항공' },
        ],
      },
    },
    estimatedBudget: '약 40~60만원 (열차/항공 학생할인 기준)',
    vibeScore: '별 5개 만점에 5개 (평생 잊지 못할 인생 여행)',
  },
  {
    id: 'cph-malmo',
    emoji: '🇩🇰',
    destination: '덴마크 코펜하겐 & 스웨덴 말뫼 (Copenhagen & Malmö)',
    title: '북유럽 디자인 뮤지엄 & 늦가을 카페 산책',
    timing: '11월 하순 (크리스마스 마켓 오픈 시즌)',
    exactDates: '2026. 11. 20(금) ~ 11. 23(월)',
    duration: '3박 4일',
    academicVibe: 'SciComp 드랍 시 금요일 전면 공강 & 월요일 수업 없음!',
    academicBadge: '수업 결손 제로 (완벽한 롱위켄드)',
    themeTags: ['뉘하운 운하', '루이지애나 미술관', '페이스트리 미식', '크리스마스 마켓'],
    pitch: '스톡홀름에서 기차로 외레순 해협을 건너 덴마크로! 아름다운 운하와 북유럽 감성 베이커리, 세계에서 가장 아름다운 루이지애나 현대미술관을 여유롭게 산책해요.',
    routes: {
      main: {
        name: '루트 A: 코펜하겐 예술 & 카페 정복 (도보/자전거)',
        transport: 'SJ 고속철도 X2000 (직통 5시간)',
        summary: '스톡홀름에서 기차로 코펜하겐 시내 직행, 자전거와 도보로 감성 카페와 미술관 투어',
        stops: [
          { day: 'Day 1 (금)', title: '코펜하겐 도착 & 뉘하운 노을', desc: '오전 기차 출발 ➔ 오후 코펜하겐 도착. 알록달록 뉘하운 운하 산책과 덴마크 맥주!', transport: 'SJ 고속철도' },
          { day: 'Day 2 (토)', title: '루이지애나 현대미술관 당일', desc: '바다가 한눈에 내려다보이는 해변 미술관에서 인생샷 & 조용한 티타임', highlight: '🖼️ 세계 최고의 미술관' },
          { day: 'Day 3 (일)', title: '티볼리 가든 크리스마스 마켓', desc: '1843년 개장한 동화 같은 티볼리 놀이공원의 화려한 크리스마스 라이트업 & 글뢰그(뱅쇼)', highlight: '🎄 크리스마스 마켓' },
          { day: 'Day 4 (월)', title: '말뫼 경유 후 복귀', desc: '외레순 다리를 건너 스웨덴 말뫼 시내 잠깐 구경 후 기차 타고 복귀', transport: 'Öresundståg + SJ' },
        ],
      },
    },
    estimatedBudget: '약 35~50만원 (기차 및 호스텔/에어비앤비)',
    vibeScore: '따뜻한 감성과 맛있는 빵, 세련된 인테리어 디자인',
  },
  {
    id: 'spain-portugal',
    emoji: '🎄',
    destination: '스페인 바르셀로나 & 포르투갈 리스본/포르투',
    title: '크리스마스 & 신년 황금방학 지중해 햇살 탈출',
    timing: '12월 말 ~ 1월 초 (크리스마스 & 새해 연휴)',
    exactDates: '2026. 12. 21(월) ~ 2027. 01. 03(일)',
    duration: '13박 14일 (일정 부분 동행 가능!)',
    academicVibe: '스웨덴 공식 겨울방학 기간! (수업 및 과제 부담 0% 완전 자유)',
    academicBadge: '겨울방학 골든타임 / 학업 부담 제로',
    themeTags: ['가우디 건축', '타파스 & 와인', '신년 카운트다운', '대서양 선셋'],
    pitch: '추운 북유럽 겨울을 벗어나 따뜻한 남유럽 햇살 아래서 와인 한잔! 사그라다 파밀리아 성당과 리스본의 노란 트램, 포르투 도루강 야경을 함께 즐겨요. 전체 일정 또는 4~5일만 부분 동행도 완전 환영!',
    routes: {
      main: {
        name: '루트 A: 바르셀로나 ➔ 세비야 ➔ 리스본 ➔ 포르투',
        transport: '유럽 저가항공 + 렌페(Renfe) 고속철도',
        summary: '지중해 바르셀로나에서 크리스마스를 보내고, 리스본과 포르투에서 새해를 맞이하는 대장정',
        stops: [
          { day: '12/21 ~ 12/24', title: '바르셀로나의 크리스마스', desc: '사그라다 파밀리아, 구엘공원, 보케리아 시장 타파스 투어 & 크리스마스 전야제', highlight: '⛪ 가우디 걸작 투어' },
          { day: '12/25 ~ 12/28', title: '안달루시아 세비야 & 론다', desc: '플라멩코 공연 관람, 따뜻한 남부 스페인의 오렌지 나무 거리 걷기', transport: '스페인 고속열차' },
          { day: '12/29 ~ 01/01', title: '리스본 새해 카운트다운', desc: '코메르시우 광장 새해 불꽃놀이, 알파마 언덕 노란 28번 트램, 에그타르트 성지순례', highlight: '🎆 신년 불꽃놀이' },
          { day: '01/02 ~ 01/03', title: '포르투 와이너리 & 스웨덴 복귀', desc: '동루이스 다리 일몰 감상 후 포르투 와인 시음. 아를란다 공항으로 복귀', transport: '항공편' },
        ],
      },
    },
    estimatedBudget: '일정에 따라 조율 (부분 동행 시 50~80만원 선)',
    vibeScore: '북유럽 유학 생활 중 가장 화려하고 따뜻한 최고의 추억',
  },
]

export default function TravelInvitePage() {
  const [selectedTrip, setSelectedTrip] = useState<ProposalTrip | null>(null)
  const [activeRouteTab, setActiveRouteTab] = useState<'main' | 'alt'>('main')
  const [dark, setDark] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  // Response Form state
  const [responseModalOpen, setResponseModalOpen] = useState(false)
  const [responderName, setResponderName] = useState('')
  const [responderContact, setResponderContact] = useState('')
  const [responderDates, setResponderDates] = useState('')
  const [responderMessage, setResponderMessage] = useState('')
  const [submittedMessage, setSubmittedMessage] = useState(false)

  // Theme Sync
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('semester-theme-2026')
    if (savedTheme === 'light') {
      setDark(false)
      document.documentElement.classList.remove('dark')
    } else {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      window.localStorage.setItem('semester-theme-2026', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      window.localStorage.setItem('semester-theme-2026', 'light')
    }
  }

  // Copy share URL
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2500)
    }
  }

  // Submit RSVP
  const handleSubmitResponse = () => {
    if (!responderName.trim()) return

    const newResponse = {
      tripId: selectedTrip?.id,
      tripTitle: selectedTrip?.title,
      name: responderName,
      contact: responderContact,
      availableDates: responderDates,
      message: responderMessage,
      createdAt: new Date().toISOString(),
    }

    // Save to local storage for organizer to review
    const existing = JSON.parse(window.localStorage.getItem('travel-responses') || '[]')
    window.localStorage.setItem('travel-responses', JSON.stringify([newResponse, ...existing]))

    setSubmittedMessage(true)
    setTimeout(() => {
      setSubmittedMessage(false)
      setResponseModalOpen(false)
      setResponderName('')
      setResponderContact('')
      setResponderDates('')
      setResponderMessage('')
    }, 2000)
  }

  return (
    <div className={cn('min-h-screen transition-colors duration-200', dark ? 'dark bg-[#0c0e14] text-zinc-100' : 'bg-[#fcfcfd] text-zinc-900')}>
      {/* 1. Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-[#0c0e14]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>학기 대시보드로 돌아가기</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {copySuccess ? <CheckCircle2 className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              <span>{copySuccess ? '링크 복사됨!' : '친구에게 링크 공유'}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              title={dark ? '라이트 모드' : '다크 모드'}
            >
              {dark ? <Sun className="size-3.5 text-amber-400" /> : <Moon className="size-3.5 text-indigo-600" />}
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <div className="relative border-b border-zinc-200/70 bg-gradient-to-b from-indigo-50/60 via-white to-transparent py-12 dark:border-zinc-800/70 dark:from-indigo-950/20 dark:via-[#0c0e14] dark:to-[#0c0e14]">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-900/80 dark:bg-indigo-950/60 dark:text-indigo-300 mb-4 shadow-xs">
            <Sparkles className="size-3.5 text-indigo-500" />
            <span>2026-2027 Semester Travel Proposal</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-zinc-900 dark:text-zinc-50">
            이번 학기, 나랑 <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">여행 갈 사람?</span> ✈️
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            학기 중 시험과 발표 일정을 꼼꼼히 체크해서 <strong>가장 수업 부담이 없고 여행하기 좋은 황금 타이밍</strong>만 골라봤어.<br />
            아래 카드에서 마음에 드는 여행지를 누르면 <strong>대략적인 이동 루트와 일정</strong>을 볼 수 있어! 시간 맞으면 같이 가자!
          </p>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>수업 결손 최소화 일정</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-indigo-500" />
              <span>루트 및 일정 협의 가능</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>부분 일정 동행 환영</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Trip Cards Grid */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              구상 중인 여행 플랜 리스트
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              카드를 클릭하면 상세 경로와 날짜별 코스를 확인할 수 있습니다.
            </p>
          </div>
          <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs">
            총 {proposalTrips.length}개 후보
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {proposalTrips.map((trip) => (
            <Card
              key={trip.id}
              onClick={() => {
                setSelectedTrip(trip)
                setActiveRouteTab('main')
              }}
              className={cn(
                'group cursor-pointer border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between',
                'border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-[#13161f]',
                'hover:border-indigo-400 dark:hover:border-indigo-500'
              )}
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between">
                  <span className="text-4xl transition-transform group-hover:scale-110">{trip.emoji}</span>
                  <Badge className="bg-indigo-600 text-white text-[10px] font-bold">
                    {trip.duration}
                  </Badge>
                </div>

                <div className="mt-3">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {trip.destination}
                  </span>
                  <CardTitle className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400 mt-0.5">
                    {trip.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-4 p-5 pt-0">
                {/* Timing & Dates */}
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 text-xs dark:border-zinc-800/80 dark:bg-zinc-850/60">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200">
                    <Calendar className="size-3.5 text-indigo-500" />
                    <span>{trip.exactDates}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                    {trip.timing}
                  </p>
                </div>

                {/* Pitch preview */}
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 line-clamp-2">
                  {trip.pitch}
                </p>

                {/* Theme tags */}
                <div className="flex flex-wrap gap-1">
                  {trip.themeTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                  {trip.themeTags.length > 3 && (
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:bg-zinc-800">
                      +{trip.themeTags.length - 3}
                    </span>
                  )}
                </div>

                {/* Academic Safety Badge */}
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-2 text-[11px] font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{trip.academicBadge}</span>
                </div>

                {/* Click action indicator */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                  <span>경로 및 세부 일정 보기</span>
                  <Navigation className="size-3.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* 4. DETAIL ROUTE MODAL (경로 상세 모달) */}
      <Dialog open={!!selectedTrip} onOpenChange={(open) => !open && setSelectedTrip(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-200 bg-white text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-[#141721] dark:text-zinc-100 sm:max-w-[650px] p-6">
          {selectedTrip && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{selectedTrip.emoji}</span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {selectedTrip.destination}
                    </span>
                    <DialogTitle className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                      {selectedTrip.title}
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  📅 희망 시기: <strong>{selectedTrip.exactDates}</strong> ({selectedTrip.duration}) · {selectedTrip.timing}
                </DialogDescription>
              </DialogHeader>

              {/* Pitch Box */}
              <div className="my-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-xs text-indigo-950 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200 leading-relaxed font-medium">
                "{selectedTrip.pitch}"
              </div>

              {/* Academic burden check */}
              <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-850">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">🎓 학업 부담 및 출결 상황:</span>
                <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">{selectedTrip.academicVibe}</p>
              </div>

              {/* Route Tabs (루트 A vs 루트 B) */}
              <div className="mb-4">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Navigation className="size-4 text-indigo-500" />
                    <span>대략적인 이동 경로 & 코스 계획</span>
                  </span>

                  {selectedTrip.routes.alternative && (
                    <div className="flex gap-1">
                      <Button
                        variant={activeRouteTab === 'main' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveRouteTab('main')}
                        className={cn('h-6 px-2 text-[11px] font-bold', activeRouteTab === 'main' && 'bg-indigo-600 text-white')}
                      >
                        루트 A
                      </Button>
                      <Button
                        variant={activeRouteTab === 'alt' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveRouteTab('alt')}
                        className={cn('h-6 px-2 text-[11px] font-bold', activeRouteTab === 'alt' && 'bg-indigo-600 text-white')}
                      >
                        루트 B
                      </Button>
                    </div>
                  )}
                </div>

                {/* Route Content */}
                {(() => {
                  const currentRoute = activeRouteTab === 'main' ? selectedTrip.routes.main : (selectedTrip.routes.alternative || selectedTrip.routes.main)
                  return (
                    <div className="flex flex-col gap-3">
                      <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {currentRoute.name}
                          </span>
                          <Badge variant="outline" className="text-[10px] border-zinc-300 dark:border-zinc-700">
                            교통: {currentRoute.transport}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{currentRoute.summary}</p>
                      </div>

                      {/* Day by Day Stops */}
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-900">
                        {currentRoute.stops.map((stop, idx) => (
                          <div key={idx} className="relative">
                            <span className="absolute -left-6 top-1 flex size-3.5 items-center justify-center rounded-full bg-indigo-600 text-white ring-4 ring-white dark:ring-[#141721]" />
                            <div className="rounded-lg border border-zinc-200/80 bg-white p-3 text-xs shadow-2xs dark:border-zinc-800 dark:bg-[#181c28]">
                              <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100">
                                <span>{stop.day} · {stop.title}</span>
                                {stop.transport && (
                                  <span className="font-normal text-[10px] text-zinc-400">({stop.transport})</span>
                                )}
                              </div>
                              <p className="mt-1 text-zinc-600 dark:text-zinc-300 leading-relaxed">{stop.desc}</p>
                              {stop.highlight && (
                                <p className="mt-1.5 font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                                  ✨ {stop.highlight}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Budget & Details */}
              <div className="grid grid-cols-2 gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-3 text-xs">
                <div className="rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-850">
                  <span className="text-[11px] text-zinc-400 block font-semibold">예상 경비대</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedTrip.estimatedBudget}</span>
                </div>
                <div className="rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-850">
                  <span className="text-[11px] text-zinc-400 block font-semibold">동행 스타일</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedTrip.vibeScore}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => setResponseModalOpen(true)}
                  className="flex-1 gap-2 bg-indigo-600 font-bold text-white hover:bg-indigo-500 shadow-md"
                >
                  <MessageCircle className="size-4" />
                  <span>나 이때 시간 돼! / 같이 갈래 🙋‍♂️</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="border-zinc-300 dark:border-zinc-700"
                >
                  <Share2 className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 5. RSVP / RESPONSE MODAL (친구의 응답 입력 폼) */}
      <Dialog open={responseModalOpen} onOpenChange={setResponseModalOpen}>
        <DialogContent className="border-zinc-200 bg-white text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-[#161922] dark:text-zinc-100 sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <span>✈️ 여행 동행 의사 보내기</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              {selectedTrip?.title} 여행에 대한 나의 일정 가능 여부나 의견을 남겨주세요!
            </DialogDescription>
          </DialogHeader>

          {submittedMessage ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <PartyPopper className="size-12 text-indigo-500 animate-bounce" />
              <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
                메시지가 성공적으로 전달되었어요! 🎉
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                확인 후 카톡/인스타로 바로 연락드릴게요!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-2 text-xs">
              <div>
                <label className="mb-1 block font-bold text-zinc-700 dark:text-zinc-300">내 이름 (또는 닉네임) *</label>
                <Input
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                  placeholder="예: 민수 / John"
                  className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-zinc-700 dark:text-zinc-300">연락처 (인스타ID / 카카오톡ID / 전화번호)</label>
                <Input
                  value={responderContact}
                  onChange={(e) => setResponderContact(e.target.value)}
                  placeholder="예: @my_insta / kakao_id"
                  className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-zinc-700 dark:text-zinc-300">시간 되는 일정 (언제 가능해?)</label>
                <Input
                  value={responderDates}
                  onChange={(e) => setResponderDates(e.target.value)}
                  placeholder="예: 제안한 날짜 그대로 가능 / 금요일 저녁부터 가능 / 2박만 동행 가능"
                  className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-zinc-700 dark:text-zinc-300">하고 싶은 말이나 코스 의견</label>
                <Textarea
                  value={responderMessage}
                  onChange={(e) => setResponderMessage(e.target.value)}
                  placeholder="예: 나 오로라 무조건 보고 싶었어! 루트 A 야간열차 진짜 낭만 있을 듯. 같이 가자!"
                  rows={3}
                  className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setResponseModalOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSubmitResponse} className="bg-indigo-600 font-bold text-white hover:bg-indigo-500">
                  <Send className="size-3.5 mr-1.5" />
                  보내기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
