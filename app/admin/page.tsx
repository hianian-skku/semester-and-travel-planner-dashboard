'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Edit3,
  GraduationCap,
  KeyRound,
  LogOut,
  MapPin,
  Plane,
  Plus,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  ScheduledTrip,
  TripCategory,
  BlockedDateItem,
  ClassEvent,
  TripDestination,
  TripRegionKey,
  regionFilterTabs,
} from '@/lib/planner-data'
import {
  getStoredTrips,
  saveStoredTrips,
  getStoredBlockedDates,
  saveStoredBlockedDates,
  getStoredClasses,
  saveStoredClasses,
  getStoredDestinations,
  saveStoredDestinations,
  getAdminPin,
  saveAdminPin,
  verifyAdminPin,
  isAdminLoggedIn,
  setAdminLoggedIn,
  exportAllPlannerData,
  importAllPlannerData,
  resetAllPlannerDataToDefault,
} from '@/lib/storage'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  // Data states
  const [trips, setTrips] = useState<ScheduledTrip[]>([])
  const [blockedDates, setBlockedDates] = useState<Record<string, BlockedDateItem>>({})
  const [classes, setClasses] = useState<ClassEvent[]>([])
  const [destinations, setDestinations] = useState<TripDestination[]>([])

  // Active Tab
  const [activeTab, setActiveTab] = useState<'trips' | 'blocked' | 'classes' | 'destinations' | 'backup'>('trips')

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Load data function
  const reloadData = () => {
    setTrips(getStoredTrips())
    setBlockedDates(getStoredBlockedDates())
    setClasses(getStoredClasses())
    setDestinations(getStoredDestinations())
  }

  useEffect(() => {
    if (isAdminLoggedIn()) {
      setIsAuthenticated(true)
      reloadData()
    }
  }, [])

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyAdminPin(pinInput)) {
      setAdminLoggedIn(true)
      setIsAuthenticated(true)
      setPinError(false)
      reloadData()
      showToast('관리자 인증에 성공했습니다.')
    } else {
      setPinError(true)
      setTimeout(() => setPinError(false), 2500)
    }
  }

  const handleLogout = () => {
    setAdminLoggedIn(false)
    setIsAuthenticated(false)
    setPinInput('')
  }

  // ==========================================
  // 1. Trip Form State & Handlers
  // ==========================================
  const [tripEditingId, setTripEditingId] = useState<string | null>(null)
  const [tripDestKo, setTripDestKo] = useState('')
  const [tripDestEn, setTripDestEn] = useState('')
  const [tripStartDate, setTripStartDate] = useState('')
  const [tripEndDate, setTripEndDate] = useState('')
  const [tripCategory, setTripCategory] = useState<TripCategory>('confirmed')
  const [tripBadgeKo, setTripBadgeKo] = useState('')
  const [tripBadgeEn, setTripBadgeEn] = useState('')
  const [tripNoteKo, setTripNoteKo] = useState('')
  const [tripNoteEn, setTripNoteEn] = useState('')
  const [tripFilter, setTripFilter] = useState<'all' | 'confirmed' | 'planned' | 'visited'>('all')

  const resetTripForm = () => {
    setTripEditingId(null)
    setTripDestKo('')
    setTripDestEn('')
    setTripStartDate('')
    setTripEndDate('')
    setTripCategory('confirmed')
    setTripBadgeKo('')
    setTripBadgeEn('')
    setTripNoteKo('')
    setTripNoteEn('')
  }

  const autoGenerateBadges = (destKo: string, destEn: string, cat: TripCategory) => {
    const catLabelKo = cat === 'confirmed' ? '(확정)' : cat === 'planned' ? '(고민 중)' : '(다녀옴)'
    const catLabelEn = cat === 'confirmed' ? '(Confirmed)' : cat === 'planned' ? '(Considering)' : '(Visited)'
    const cleanKo = destKo.trim() ? `${destKo.trim()} ${catLabelKo}` : ''
    const cleanEn = destEn.trim() ? `${destEn.trim()} ${catLabelEn}` : ''
    setTripBadgeKo(cleanKo)
    setTripBadgeEn(cleanEn)
  }

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tripDestKo.trim() || !tripStartDate || !tripEndDate) {
      alert('여행지명과 시작일, 종료일을 모두 입력해주세요.')
      return
    }

    if (tripStartDate > tripEndDate) {
      alert('시작일은 종료일보다 이전이어야 합니다.')
      return
    }

    const newTrip: ScheduledTrip = {
      id: tripEditingId || `trip-${Date.now()}`,
      destination: tripDestKo.trim(),
      destinationEn: tripDestEn.trim() || tripDestKo.trim(),
      startDate: tripStartDate,
      endDate: tripEndDate,
      category: tripCategory,
      badgeText: tripBadgeKo.trim() || tripDestKo.trim(),
      badgeTextEn: tripBadgeEn.trim() || tripDestEn.trim() || tripDestKo.trim(),
      note: tripNoteKo.trim() || undefined,
      noteEn: tripNoteEn.trim() || undefined,
    }

    let updated: ScheduledTrip[]
    if (tripEditingId) {
      updated = trips.map((t) => (t.id === tripEditingId ? newTrip : t))
      showToast(`'${newTrip.destination}' 여행 일정이 수정되었습니다.`)
    } else {
      updated = [...trips, newTrip]
      showToast(`'${newTrip.destination}' 새 여행 일정이 추가되었습니다.`)
    }

    // Sort by start date ascending
    updated.sort((a, b) => a.startDate.localeCompare(b.startDate))
    saveStoredTrips(updated)
    setTrips(updated)
    resetTripForm()
  }

  const handleEditTrip = (trip: ScheduledTrip) => {
    setTripEditingId(trip.id)
    setTripDestKo(trip.destination)
    setTripDestEn(trip.destinationEn)
    setTripStartDate(trip.startDate)
    setTripEndDate(trip.endDate)
    setTripCategory(trip.category)
    setTripBadgeKo(trip.badgeText)
    setTripBadgeEn(trip.badgeTextEn)
    setTripNoteKo(trip.note || '')
    setTripNoteEn(trip.noteEn || '')
    window.scrollTo({ top: 180, behavior: 'smooth' })
  }

  const handleDeleteTrip = (id: string, name: string) => {
    if (confirm(`'${name}' 여행 일정을 삭제하시겠습니까?`)) {
      const updated = trips.filter((t) => t.id !== id)
      saveStoredTrips(updated)
      setTrips(updated)
      if (tripEditingId === id) resetTripForm()
      showToast(`'${name}' 여행 일정이 삭제되었습니다.`)
    }
  }

  // ==========================================
  // 2. Blocked Date Form & Handlers
  // ==========================================
  const [blockDateStr, setBlockDateStr] = useState('')
  const [blockLabelKo, setBlockLabelKo] = useState('회색 처리')
  const [blockLabelEn, setBlockLabelEn] = useState('Unavailable')
  const [blockNoteKo, setBlockNoteKo] = useState('개인 일정 (여행 불가)')
  const [blockNoteEn, setBlockNoteEn] = useState('Personal Schedule (Unavailable)')

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!blockDateStr) {
      alert('차단할 날짜를 선택해주세요.')
      return
    }

    const updated = {
      ...blockedDates,
      [blockDateStr]: {
        labelKo: blockLabelKo.trim() || '회색 처리',
        labelEn: blockLabelEn.trim() || 'Unavailable',
        noteKo: blockNoteKo.trim() || '개인 일정 (여행 불가)',
        noteEn: blockNoteEn.trim() || 'Personal Schedule (Unavailable)',
      },
    }
    saveStoredBlockedDates(updated)
    setBlockedDates(updated)
    setBlockDateStr('')
    showToast(`${blockDateStr} 날짜가 여행 불가 일정으로 등록되었습니다.`)
  }

  const handleDeleteBlockedDate = (dateKey: string) => {
    if (confirm(`${dateKey} 날짜 차단을 해제하시겠습니까?`)) {
      const updated = { ...blockedDates }
      delete updated[dateKey]
      saveStoredBlockedDates(updated)
      setBlockedDates(updated)
      showToast(`${dateKey} 차단이 해제되었습니다.`)
    }
  }

  // ==========================================
  // 3. Classes Form & Handlers
  // ==========================================
  const [classDate, setClassDate] = useState('')
  const [classTime, setClassTime] = useState('10:15 - 12:00')
  const [classCourse, setClassCourse] = useState('')
  const [classRoom, setClassRoom] = useState('')
  const [classIsZoom, setClassIsZoom] = useState(false)
  const [classSearch, setClassSearch] = useState('')

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault()
    if (!classDate || !classCourse.trim()) {
      alert('날짜와 과목명을 입력해주세요.')
      return
    }

    const newClass: ClassEvent = {
      date: classDate,
      time: classTime.trim(),
      course: classCourse.trim(),
      room: classIsZoom ? 'Via Zoom' : classRoom.trim() || 'Ångström',
      isZoom: classIsZoom,
    }

    const updated = [...classes, newClass].sort((a, b) => {
      const cmp = a.date.localeCompare(b.date)
      if (cmp !== 0) return cmp
      return a.time.localeCompare(b.time)
    })

    saveStoredClasses(updated)
    setClasses(updated)
    setClassCourse('')
    showToast(`${classDate}에 새로운 수업/일정이 추가되었습니다.`)
  }

  const handleDeleteClass = (index: number, courseName: string, date: string) => {
    if (confirm(`${date}의 '${courseName}' 일정을 삭제하시겠습니까?`)) {
      const updated = classes.filter((_, i) => i !== index)
      saveStoredClasses(updated)
      setClasses(updated)
      showToast('수업 일정이 삭제되었습니다.')
    }
  }

  // ==========================================
  // 4. Destinations Form & Handlers
  // ==========================================
  const [destRegion, setDestRegion] = useState<TripRegionKey>('nordic')
  const [destNameKo, setDestNameKo] = useState('')
  const [destNameEn, setDestNameEn] = useState('')
  const [destDurationKo, setDestDurationKo] = useState('2박 3일')
  const [destDurationEn, setDestDurationEn] = useState('2 nights 3 days')
  const [destDescKo, setDestDescKo] = useState('')
  const [destDescEn, setDestDescEn] = useState('')

  const handleAddDestination = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destNameKo.trim()) {
      alert('여행지 이름을 입력해주세요.')
      return
    }

    const regionMap: Record<TripRegionKey, { ko: string; en: string }> = {
      nordic: { ko: '1. 북유럽 & 극지방', en: '1. Nordic & Arctic' },
      uk: { ko: '2. 영국 & 스코틀랜드 / 프랑스', en: '2. UK, Scotland & France' },
      central_west: { ko: '3. 중유럽 & 서유럽', en: '3. Central & Western Europe' },
      south_baltic: { ko: '4. 남유럽 & 발트해/폴란드', en: '4. Southern Europe, Baltics & Poland' },
      med_nafrica: { ko: '5. 지중해 동부 & 북아프리카', en: '5. Eastern Med & North Africa' },
      americas: { ko: '6. 아메리카 대륙', en: '6. Americas' },
    }

    const newDest: TripDestination = {
      id: `dest-${Date.now()}`,
      region: destRegion,
      regionName: regionMap[destRegion].ko,
      regionNameEn: regionMap[destRegion].en,
      name: destNameKo.trim(),
      nameEn: destNameEn.trim() || destNameKo.trim(),
      duration: destDurationKo.trim(),
      durationEn: destDurationEn.trim(),
      description: destDescKo.trim(),
      descriptionEn: destDescEn.trim() || destDescKo.trim(),
    }

    const updated = [...destinations, newDest]
    saveStoredDestinations(updated)
    setDestinations(updated)
    setDestNameKo('')
    setDestNameEn('')
    setDestDescKo('')
    setDestDescEn('')
    showToast(`'${newDest.name}' 여행지가 위시리스트에 추가되었습니다.`)
  }

  const handleDeleteDestination = (id: string, name: string) => {
    if (confirm(`'${name}' 여행지를 위시리스트에서 삭제하시겠습니까?`)) {
      const updated = destinations.filter((d) => d.id !== id)
      saveStoredDestinations(updated)
      setDestinations(updated)
      showToast(`'${name}' 여행지가 삭제되었습니다.`)
    }
  }

  // ==========================================
  // 5. Backup / Restore / PIN Settings
  // ==========================================
  const [jsonText, setJsonText] = useState('')
  const [copiedBackup, setCopiedBackup] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [pinChangeMsg, setPinChangeMsg] = useState('')

  const handleCopyJSON = () => {
    const jsonStr = exportAllPlannerData()
    navigator.clipboard.writeText(jsonStr)
    setCopiedBackup(true)
    setTimeout(() => setCopiedBackup(false), 2000)
    showToast('전체 일정이 클립보드에 JSON 형식으로 복사되었습니다!')
  }

  const handleDownloadJSON = () => {
    const jsonStr = exportAllPlannerData()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `travel_planner_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('백업 파일이 다운로드되었습니다.')
  }

  const handleImportJSON = () => {
    if (!jsonText.trim()) {
      alert('붙여넣을 JSON 내용을 입력해주세요.')
      return
    }

    if (confirm('현재 저장된 일정 위에 덮어씌워집니다. 진행하시겠습니까?')) {
      const res = importAllPlannerData(jsonText)
      if (res.success) {
        reloadData()
        setJsonText('')
        showToast('성공적으로 데이터를 불러왔습니다!')
      } else {
        alert(`불러오기 실패: ${res.error}`)
      }
    }
  }

  const handleResetToDefault = () => {
    if (confirm('경고: 직접 추가/수정한 모든 일정이 초기 원본 데이터로 되돌아갑니다. 계속하시겠습니까?')) {
      resetAllPlannerDataToDefault()
      reloadData()
      showToast('초기 기본 일정으로 리셋되었습니다.')
    }
  }

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPin.trim() || newPin.trim().length < 4) {
      setPinChangeMsg('PIN 번호는 4자리 이상이어야 합니다.')
      return
    }
    saveAdminPin(newPin.trim())
    setNewPin('')
    setPinChangeMsg('관리자 PIN 번호가 성공적으로 변경되었습니다!')
    setTimeout(() => setPinChangeMsg(''), 3000)
  }

  // ==========================================
  // Render PIN Gate Screen
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-[#0b0d13] dark:to-[#13161f] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back to Site Link */}
          <div className="mb-6 flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              대시보드 메인으로 돌아가기
            </Link>
          </div>

          <Card className="border-zinc-200/80 shadow-lg dark:border-zinc-800 dark:bg-[#12151d]">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-100 dark:border-indigo-900">
                <Shield className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                플래너 관리자 인증
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                사이트에서 직접 여행 일정과 계획을 추가/수정하려면 관리자 비밀번호(PIN)를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      관리자 PIN 번호
                    </label>
                    <span className="text-[11px] text-zinc-400">PIN 6자리</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="PIN 6자리 입력"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className={cn(
                        'pr-10 text-center tracking-widest text-lg font-mono',
                        pinError && 'border-red-500 ring-2 ring-red-400/20'
                      )}
                      autoFocus
                    />
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {pinError && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      PIN 번호가 일치하지 않습니다. 다시 입력해주세요.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  로그인 및 관리자 모드 시작
                </Button>
              </form>

              <div className="mt-6 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3 border border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                💡 <span className="font-semibold text-zinc-700 dark:text-zinc-300">팁:</span> 관리자 페이지에서
                새로운 여행이나 수업을 등록하면, 메인 달력과 친구 초대 페이지에 즉시 실시간으로 반영됩니다.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ==========================================
  // Render Authenticated Admin Dashboard
  // ==========================================
  const filteredTrips = trips.filter((t) => {
    if (tripFilter === 'all') return true
    return t.category === tripFilter
  })

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0e14] text-zinc-900 dark:text-zinc-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-zinc-900 text-white px-4 py-3 shadow-xl dark:bg-white dark:text-zinc-900 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-[#0d1017]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>대시보드로 돌아가기</span>
            </Link>

            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                플래너 관리자 센터
              </span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold">
                Admin Mode
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyJSON}
              className="gap-1.5 text-xs font-semibold border-zinc-300 dark:border-zinc-700"
              title="데이터 백업 복사"
            >
              {copiedBackup ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">JSON 백업</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1 text-xs text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
            <CardContent className="p-3.5">
              <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">등록된 여행 일정</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">{trips.length}</span>
                <span className="text-xs text-zinc-400">개</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
            <CardContent className="p-3.5">
              <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">확정된 여행</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400">
                  {trips.filter((t) => t.category === 'confirmed').length}
                </span>
                <span className="text-xs text-zinc-400">개</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
            <CardContent className="p-3.5">
              <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">고민 중인 여행</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                  {trips.filter((t) => t.category === 'planned').length}
                </span>
                <span className="text-xs text-zinc-400">개</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
            <CardContent className="p-3.5">
              <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">차단 날짜 (여행 불가)</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-zinc-700 dark:text-zinc-300">
                  {Object.keys(blockedDates).length}
                </span>
                <span className="text-xs text-zinc-400">일</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('trips')}
            className={cn(
              'px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5',
              activeTab === 'trips'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
            )}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>여행 일정 관리 ({trips.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blocked')}
            className={cn(
              'px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5',
              activeTab === 'blocked'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>차단 날짜 ({Object.keys(blockedDates).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={cn(
              'px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5',
              activeTab === 'classes'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
            )}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>수업 & 시험 ({classes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('destinations')}
            className={cn(
              'px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5',
              activeTab === 'destinations'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
            )}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>추천 여행지 위시리스트 ({destinations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={cn(
              'px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ml-auto',
              activeTab === 'backup'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
            )}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>백업 & 복원 & 설정</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 여행 일정 관리 (Trips) */}
        {/* ========================================================================= */}
        {activeTab === 'trips' && (
          <div className="space-y-6">
            {/* Trip Form Card */}
            <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      {tripEditingId ? '여행 일정 수정' : '새 여행 일정 추가'}
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      여행지, 날짜, 카테고리를 설정하면 달력에 즉시 반영됩니다.
                    </CardDescription>
                  </div>
                  {tripEditingId && (
                    <Button variant="ghost" size="sm" onClick={resetTripForm} className="text-xs gap-1">
                      <X className="w-3.5 h-3.5" />
                      수정 취소
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleSaveTrip} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Destination (KO) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        여행지 이름 (한국어) *
                      </label>
                      <Input
                        placeholder="예: 핀란드 헬싱키, 영국 런던"
                        value={tripDestKo}
                        onChange={(e) => {
                          setTripDestKo(e.target.value)
                          if (!tripBadgeKo) autoGenerateBadges(e.target.value, tripDestEn, tripCategory)
                        }}
                        required
                      />
                    </div>

                    {/* Destination (EN) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        여행지 이름 (English)
                      </label>
                      <Input
                        placeholder="e.g. Helsinki, Finland"
                        value={tripDestEn}
                        onChange={(e) => {
                          setTripDestEn(e.target.value)
                          if (!tripBadgeEn) autoGenerateBadges(tripDestKo, e.target.value, tripCategory)
                        }}
                      />
                    </div>
                  </div>

                  {/* Dates & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Start Date */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        시작일 *
                      </label>
                      <Input
                        type="date"
                        value={tripStartDate}
                        onChange={(e) => {
                          setTripStartDate(e.target.value)
                          if (!tripEndDate || tripEndDate < e.target.value) {
                            setTripEndDate(e.target.value)
                          }
                        }}
                        required
                      />
                    </div>

                    {/* End Date */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        종료일 *
                      </label>
                      <Input
                        type="date"
                        value={tripEndDate}
                        onChange={(e) => setTripEndDate(e.target.value)}
                        required
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        여행 상태 (색상 구분) *
                      </label>
                      <select
                        value={tripCategory}
                        onChange={(e) => {
                          const cat = e.target.value as TripCategory
                          setTripCategory(cat)
                          autoGenerateBadges(tripDestKo, tripDestEn, cat)
                        }}
                        className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs font-medium text-zinc-900 dark:text-zinc-100"
                      >
                        <option value="confirmed">✈️ 확정된 여행 (하늘색)</option>
                        <option value="planned">💡 고민 중인 여행 (보라색)</option>
                        <option value="visited">✓ 이미 다녀온 여행 (빨간색)</option>
                      </select>
                    </div>
                  </div>

                  {/* Badge Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          달력 배지 표시 문구 (한국어)
                        </label>
                        <button
                          type="button"
                          onClick={() => autoGenerateBadges(tripDestKo, tripDestEn, tripCategory)}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                          자동 생성
                        </button>
                      </div>
                      <Input
                        placeholder="예: 헬싱키 (확정)"
                        value={tripBadgeKo}
                        onChange={(e) => setTripBadgeKo(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        달력 배지 표시 문구 (English)
                      </label>
                      <Input
                        placeholder="e.g. Helsinki (Confirmed)"
                        value={tripBadgeEn}
                        onChange={(e) => setTripBadgeEn(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Notes / Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        세부 일정 및 메모 (한국어)
                      </label>
                      <Textarea
                        placeholder="예: 외국인 친구들과 함께 가는 일정, 축구 직관, 몽생미셸 투어 등"
                        rows={2}
                        value={tripNoteKo}
                        onChange={(e) => setTripNoteKo(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        세부 일정 및 메모 (English)
                      </label>
                      <Textarea
                        placeholder="e.g. Trip with international friends, football match, etc."
                        rows={2}
                        value={tripNoteEn}
                        onChange={(e) => setTripNoteEn(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    {tripEditingId && (
                      <Button type="button" variant="outline" size="sm" onClick={resetTripForm}>
                        취소
                      </Button>
                    )}
                    <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                      {tripEditingId ? '수정 완료 및 저장' : '새 여행 일정 추가'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Trip List Filter & Cards */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>현재 등록된 여행 목록</span>
                  <Badge variant="secondary" className="text-xs">{filteredTrips.length}개</Badge>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850 p-0.5">
                  <button
                    onClick={() => setTripFilter('all')}
                    className={cn('px-2.5 py-1 text-xs font-semibold rounded-md transition-all', tripFilter === 'all' && 'bg-white dark:bg-zinc-800 shadow-xs')}
                  >
                    전체
                  </button>
                  <button
                    onClick={() => setTripFilter('confirmed')}
                    className={cn('px-2.5 py-1 text-xs font-semibold rounded-md transition-all', tripFilter === 'confirmed' && 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-xs')}
                  >
                    ✈️ 확정됨
                  </button>
                  <button
                    onClick={() => setTripFilter('planned')}
                    className={cn('px-2.5 py-1 text-xs font-semibold rounded-md transition-all', tripFilter === 'planned' && 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 shadow-xs')}
                  >
                    💡 고민 중
                  </button>
                  <button
                    onClick={() => setTripFilter('visited')}
                    className={cn('px-2.5 py-1 text-xs font-semibold rounded-md transition-all', tripFilter === 'visited' && 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 shadow-xs')}
                  >
                    ✓ 다녀옴
                  </button>
                </div>
              </div>

              {filteredTrips.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center text-xs text-zinc-500">
                  해당 카테고리에 등록된 여행 일정이 없습니다.
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredTrips.map((trip) => {
                    const isVisited = trip.category === 'visited'
                    const isConfirmed = trip.category === 'confirmed'

                    return (
                      <div
                        key={trip.id}
                        className={cn(
                          'p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs',
                          isVisited && 'bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/40',
                          isConfirmed && 'bg-sky-50/50 border-sky-200 dark:bg-sky-950/20 dark:border-sky-900/40',
                          !isVisited && !isConfirmed && 'bg-purple-50/50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/40'
                        )}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              className={cn(
                                'text-[11px] font-bold',
                                isVisited && 'bg-red-600 text-white',
                                isConfirmed && 'bg-sky-500 text-white',
                                !isVisited && !isConfirmed && 'bg-purple-600 text-white'
                              )}
                            >
                              {isVisited ? '✓ 다녀옴' : isConfirmed ? '✈️ 확정된 여행' : '💡 고민 중인 여행'}
                            </Badge>
                            <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                              {trip.destination}
                            </span>
                            {trip.destinationEn && trip.destinationEn !== trip.destination && (
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                ({trip.destinationEn})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                            <div className="flex items-center gap-1 font-mono font-medium">
                              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{trip.startDate} ~ {trip.endDate}</span>
                            </div>
                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                            <span className="text-[11px] font-medium text-zinc-500">배지: {trip.badgeText}</span>
                          </div>

                          {trip.note && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-0.5 line-clamp-2">
                              {trip.note}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTrip(trip)}
                            className="h-8 px-2.5 text-xs gap-1 border-zinc-300 dark:border-zinc-700"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>수정</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTrip(trip.id, trip.destination)}
                            className="h-8 px-2.5 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>삭제</span>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 차단 날짜 관리 (Blocked Dates) */}
        {/* ========================================================================= */}
        {activeTab === 'blocked' && (
          <div className="space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  여행 불가 / 개인 일정 날짜 차단 등록
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  해당 날짜를 달력에서 회색으로 처리하고 개인 일정(여행 불가)으로 표시합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleAddBlockedDate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">차단할 날짜 *</label>
                      <Input
                        type="date"
                        value={blockDateStr}
                        onChange={(e) => setBlockDateStr(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">표시 라벨 (한국어)</label>
                      <Input
                        value={blockLabelKo}
                        onChange={(e) => setBlockLabelKo(e.target.value)}
                        placeholder="회색 처리 / 개인 일정"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">표시 라벨 (English)</label>
                      <Input
                        value={blockLabelEn}
                        onChange={(e) => setBlockLabelEn(e.target.value)}
                        placeholder="Unavailable"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">사유 메모 (한국어)</label>
                      <Input
                        value={blockNoteKo}
                        onChange={(e) => setBlockNoteKo(e.target.value)}
                        placeholder="예: 개인 일정 (여행 불가), 기숙사 퇴소 준비 등"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">사유 메모 (English)</label>
                      <Input
                        value={blockNoteEn}
                        onChange={(e) => setBlockNoteEn(e.target.value)}
                        placeholder="Personal Schedule (Unavailable)"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="bg-zinc-800 hover:bg-zinc-900 text-white font-semibold">
                      차단 날짜 추가하기
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* List of Blocked Dates */}
            <div className="space-y-3">
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>차단된 날짜 목록</span>
                <Badge variant="secondary" className="text-xs">{Object.keys(blockedDates).length}일</Badge>
              </div>

              {Object.keys(blockedDates).length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center text-xs text-zinc-500">
                  차단된 날짜가 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(blockedDates).sort(([a], [b]) => a.localeCompare(b)).map(([dateKey, item]) => (
                    <div
                      key={dateKey}
                      className="p-3 rounded-lg border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                          {dateKey}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                          {item.labelKo} • {item.noteKo}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteBlockedDate(dateKey)}
                        className="size-7 text-zinc-400 hover:text-red-600 shrink-0"
                        title="차단 해제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 수업 및 시험 일정 (Classes & Exams) */}
        {/* ========================================================================= */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  새 수업 / 시험 / 과제 마감 일정 추가
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  수업이나 시험을 등록하면 달력 날짜에 수업 시간표와 함께 반영됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleAddClass} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">날짜 *</label>
                      <Input
                        type="date"
                        value={classDate}
                        onChange={(e) => setClassDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">시간 범위 *</label>
                      <Input
                        value={classTime}
                        onChange={(e) => setClassTime(e.target.value)}
                        placeholder="예: 10:15 - 12:00"
                        required
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">과목명 / 일정명 *</label>
                      <Input
                        value={classCourse}
                        onChange={(e) => setClassCourse(e.target.value)}
                        placeholder="예: Applied Geophysics, XR Final Presentation"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">강의실 / 장소</label>
                      <Input
                        value={classRoom}
                        onChange={(e) => setClassRoom(e.target.value)}
                        placeholder="예: Ångström 101136, Geocentrum"
                        disabled={classIsZoom}
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <Switch
                        checked={classIsZoom}
                        onCheckedChange={(checked) => {
                          setClassIsZoom(checked)
                          if (checked) setClassRoom('Via Zoom')
                        }}
                      />
                      <label className="text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer">
                        온라인 줌(Zoom) 수업 여부 (달력에 주황색 표시)
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                      수업 일정 추가하기
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Class List & Search */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>등록된 수업 목록</span>
                  <Badge variant="secondary" className="text-xs">{classes.length}개</Badge>
                </div>

                <div className="relative w-full sm:w-64">
                  <Input
                    placeholder="과목명 또는 날짜 검색..."
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    className="h-8 text-xs pl-8"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="max-h-[460px] overflow-y-auto space-y-2 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 bg-white dark:bg-[#12151d]">
                {classes
                  .filter((c) => {
                    if (!classSearch.trim()) return true
                    const q = classSearch.toLowerCase()
                    return c.course.toLowerCase().includes(q) || c.date.includes(q) || c.room.toLowerCase().includes(q)
                  })
                  .map((cls, idx) => (
                    <div
                      key={`${cls.date}-${cls.time}-${idx}`}
                      className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-850 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                        <Badge variant="outline" className="font-mono text-[11px] font-semibold">
                          {cls.date}
                        </Badge>
                        <span className="text-zinc-500 font-mono text-[11px]">{cls.time}</span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{cls.course}</span>
                        {cls.isZoom ? (
                          <Badge className="bg-amber-500 text-white text-[10px]">Zoom</Badge>
                        ) : (
                          <span className="text-zinc-400 text-[11px]">({cls.room})</span>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClass(idx, cls.course, cls.date)}
                        className="size-7 text-zinc-400 hover:text-red-600 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: 추천 여행지 위시리스트 관리 (Destinations) */}
        {/* ========================================================================= */}
        {activeTab === 'destinations' && (
          <div className="space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  새 추천 여행지 위시리스트 추가
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  메인 화면 우측 '가려는 여행지 리스트'에 표시될 추천 도시를 추가합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleAddDestination} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">권역 선택 *</label>
                      <select
                        value={destRegion}
                        onChange={(e) => setDestRegion(e.target.value as TripRegionKey)}
                        className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs font-medium"
                      >
                        <option value="nordic">1. 북유럽 & 극지방</option>
                        <option value="uk">2. 영국 & 스코틀랜드 / 프랑스</option>
                        <option value="central_west">3. 중유럽 & 서유럽</option>
                        <option value="south_baltic">4. 남유럽 & 발트해/폴란드</option>
                        <option value="med_nafrica">5. 지중해 동부 & 북아프리카</option>
                        <option value="americas">6. 아메리카 대륙</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">도시 / 국가명 (한국어) *</label>
                      <Input
                        value={destNameKo}
                        onChange={(e) => setDestNameKo(e.target.value)}
                        placeholder="예: 스위스 인터라켄"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">도시 / 국가명 (English)</label>
                      <Input
                        value={destNameEn}
                        onChange={(e) => setDestNameEn(e.target.value)}
                        placeholder="Interlaken, Switzerland"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">권장 박수 (한국어)</label>
                      <Input
                        value={destDurationKo}
                        onChange={(e) => setDestDurationKo(e.target.value)}
                        placeholder="예: 3박 4일"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">권장 박수 (English)</label>
                      <Input
                        value={destDurationEn}
                        onChange={(e) => setDestDurationEn(e.target.value)}
                        placeholder="3 nights 4 days"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">설명 및 추천 코스 (한국어)</label>
                      <Textarea
                        value={destDescKo}
                        onChange={(e) => setDestDescKo(e.target.value)}
                        placeholder="융프라우요흐 등반, 패러글라이딩, 호수 유람선 투어 등"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">설명 및 추천 코스 (English)</label>
                      <Textarea
                        value={destDescEn}
                        onChange={(e) => setDestDescEn(e.target.value)}
                        placeholder="Jungfraujoch excursion, paragliding, lake cruises, etc."
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                      여행지 추가하기
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Destination List */}
            <div className="space-y-3">
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>현재 등록된 위시리스트 여행지</span>
                <Badge variant="secondary" className="text-xs">{destinations.length}곳</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {destinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#12151d] shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          {dest.regionName}
                        </Badge>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {dest.duration}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDestination(dest.id, dest.name)}
                        className="h-7 text-xs text-red-500 hover:text-red-700 gap-1 px-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>삭제</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: 백업, 복원 및 PIN 설정 (Backup, Restore & Settings) */}
        {/* ========================================================================= */}
        {activeTab === 'backup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup & Export */}
            <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-600" />
                  전체 데이터 내보내기 (백업)
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  내가 추가/수정한 여행 일정, 차단 날짜, 수업 일정을 모두 JSON 파일로 저장하거나 복사합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  스마트폰이나 다른 컴퓨터 브라우저로 접속할 때, 이 JSON을 복사하여 붙여넣으면 즉시 똑같은 일정을 볼 수 있습니다.
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopyJSON}
                    className="flex-1 text-xs font-semibold gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    클립보드로 JSON 복사
                  </Button>
                  <Button
                    onClick={handleDownloadJSON}
                    variant="outline"
                    className="flex-1 text-xs font-semibold gap-1.5 border-zinc-300 dark:border-zinc-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    .json 파일 다운로드
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Restore & Import */}
            <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  백업 데이터 불러오기 (복원 / 기기 동기화)
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  복사해둔 백업 JSON 문자열을 아래에 붙여넣고 적용할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <Textarea
                  placeholder="여기에 백업된 JSON 내용을 붙여넣으세요..."
                  rows={4}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="font-mono text-xs"
                />

                <Button
                  onClick={handleImportJSON}
                  size="sm"
                  className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  데이터 불러오기 및 적용
                </Button>
              </CardContent>
            </Card>

            {/* Change Admin PIN */}
            <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-[#12151d] shadow-xs">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  관리자 PIN 번호 변경
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  기본 관리자 비밀번호를 나만의 새로운 비밀번호로 변경할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleChangePin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">새로운 PIN 번호</label>
                    <Input
                      type="password"
                      placeholder="새 4자리 이상 PIN 입력"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>

                  {pinChangeMsg && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      {pinChangeMsg}
                    </p>
                  )}

                  <Button type="submit" size="sm" className="w-full bg-zinc-800 hover:bg-zinc-900 text-white font-semibold">
                    PIN 변경 저장
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Factory Reset */}
            <Card className="border-red-200 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10 shadow-xs">
              <CardHeader className="pb-3 border-b border-red-100 dark:border-red-900/40">
                <CardTitle className="text-base font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  초기 데이터로 되돌리기 (Reset)
                </CardTitle>
                <CardDescription className="text-xs text-red-600/80 dark:text-red-400/80">
                  직접 추가하거나 수정한 모든 내용을 지우고 처음의 기본 일정으로 초기화합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  초기 상태(헬싱키 확정, 영국/스코틀랜드/프랑스 고민 중, 1월 귀국 여정 등)로 언제든지 되돌릴 수 있습니다.
                </p>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleResetToDefault}
                  className="w-full text-xs font-semibold gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  기본 일정으로 초기화하기
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
