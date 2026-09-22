'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  Feather,
  GraduationCap,
  MapPin,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  Plane,
  Sparkles,
  Sun,
  TentTree,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type TripStatus = 'idea' | 'planning' | 'confirmed'
type Trip = { id: string; emoji: string; title: string; period: string; status: TripStatus; keyTheme: string; academicOverlapNote: string; routeOptions: { name: string; description: string; meta: string }[]; notes: string; weeks: number[] }

const courses = [
  { day: 'Mon', name: 'Design Systems', time: '10:00–11:30', room: 'Studio 2B', color: 'bg-violet-400' },
  { day: 'Mon', name: 'Research Methods', time: '14:00–15:30', room: 'Online', color: 'bg-sky-400' },
  { day: 'Tue', name: 'Data & Society', time: '09:00–10:30', room: 'Hall 104', color: 'bg-amber-400' },
  { day: 'Wed', name: 'Design Systems', time: '10:00–11:30', room: 'Studio 2B', color: 'bg-violet-400' },
  { day: 'Thu', name: 'Visual Culture', time: '13:00–15:00', room: 'Seminar 1', color: 'bg-rose-400' },
]

const initialTrips: Trip[] = [
  { id: 'iceland', emoji: '🇮🇸', title: 'Iceland · Northern Lights', period: 'Oct 17–20 · Thu–Sun', status: 'planning', keyTheme: 'Aurora', academicOverlapNote: 'Friday seminar overlaps once', routeOptions: [{ name: 'Route A', description: 'Reykjavik + Golden Circle', meta: '4 days · 2 stays' }, { name: 'Route B', description: 'South coast road trip', meta: '4 days · rental car' }], notes: '- Book Blue Lagoon\n- Check aurora forecast\n- Pack warm layers', weeks: [4] },
  { id: 'kyoto', emoji: '🇯🇵', title: 'Kyoto · Slow city walk', period: 'Nov 7–10 · Thu–Sun', status: 'idea', keyTheme: 'Autumn stroll', academicOverlapNote: 'Uses Friday open day', routeOptions: [{ name: 'Route A', description: 'Kyoto + Nara by rail', meta: '4 days · JR pass' }, { name: 'Route B', description: 'Osaka food weekend', meta: '3 days · city stays' }], notes: '- Visit Arashiyama\n- Find a tea house', weeks: [7] },
  { id: 'lisbon', emoji: '🇵🇹', title: 'Lisbon · Long weekend', period: 'Nov 28–Dec 1 · Thu–Sun', status: 'confirmed', keyTheme: 'Food & light', academicOverlapNote: 'Clear week — no conflicts', routeOptions: [{ name: 'Route A', description: 'Lisbon neighborhoods + Sintra', meta: '4 days · walkable' }, { name: 'Route B', description: 'Lisbon + coast', meta: '4 days · train' }], notes: '- Reserve dinner at Prado\n- Download offline map', weeks: [10] },
]

const weeks = ['Sep 15', 'Sep 22', 'Sep 29', 'Oct 6', 'Oct 13', 'Oct 20', 'Oct 27', 'Nov 3', 'Nov 10', 'Nov 17', 'Nov 24', 'Dec 1']
const statusMeta: Record<TripStatus, { label: string; className: string; dot: string }> = { idea: { label: 'Idea', className: 'border-indigo-400/25 bg-indigo-400/10 text-indigo-300', dot: 'bg-indigo-400' }, planning: { label: 'Planning', className: 'border-amber-400/25 bg-amber-400/10 text-amber-300', dot: 'bg-amber-400' }, confirmed: { label: 'Confirmed', className: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300', dot: 'bg-emerald-400' } }

function StatusBadge({ status }: { status: TripStatus }) {
  return <Badge variant="outline" className={cn('rounded-md border px-2 py-0.5 text-[10px] font-medium', statusMeta[status].className)}><span className={cn('mr-1.5 inline-block size-1.5 rounded-full', statusMeta[status].dot)} />{statusMeta[status].label}</Badge>
}

export function SemesterDashboard() {
  const [view, setView] = useState('roadmap')
  const [trips, setTrips] = useState<Trip[]>(initialTrips)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(4)
  const [showTimetable, setShowTimetable] = useState(false)
  const [dark, setDark] = useState(true)
  const [newOpen, setNewOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPeriod, setNewPeriod] = useState('')
  const [newTheme, setNewTheme] = useState('')
  const [newNotes, setNewNotes] = useState('')

  useEffect(() => { const saved = window.localStorage.getItem('semester-trips'); if (saved) setTrips(JSON.parse(saved)) }, [])
  useEffect(() => { window.localStorage.setItem('semester-trips', JSON.stringify(trips)) }, [trips])

  const selectedWeekTrips = useMemo(() => trips.filter((trip) => trip.weeks.includes(selectedWeek)), [trips, selectedWeek])
  const updateStatus = (status: TripStatus) => { if (!selectedTrip) return; const next = trips.map((trip) => trip.id === selectedTrip.id ? { ...trip, status } : trip); setTrips(next); setSelectedTrip({ ...selectedTrip, status }) }
  const addTrip = () => { if (!newTitle.trim()) return; const trip: Trip = { id: crypto.randomUUID(), emoji: '✈️', title: newTitle, period: newPeriod || 'Date to be decided', status: 'idea', keyTheme: newTheme || 'New idea', academicOverlapNote: 'Review academic overlap', routeOptions: [{ name: 'Route A', description: 'Add your first route option', meta: 'To explore' }, { name: 'Route B', description: 'Compare another way there', meta: 'To explore' }], notes: newNotes || '- Add notes here', weeks: [selectedWeek] }; setTrips((current) => [...current, trip]); setNewTitle(''); setNewPeriod(''); setNewTheme(''); setNewNotes(''); setNewOpen(false) }

  return (
    <div className={cn('min-h-screen bg-[#111318] text-[#f3f4f6] transition-colors', !dark && 'bg-[#f7f7f5] text-[#17191d]')}>
      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#111318]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 shadow-lg shadow-indigo-500/20"><Compass className="size-5 text-white" /></div><div><p className="text-[13px] font-semibold tracking-tight">semester / travel</p><p className="text-[11px] text-white/40">Fall 2025 · Seoul</p></div></div>
          <div className="flex items-center gap-2"><Button variant="ghost" size="icon" className="text-white/55 hover:bg-white/10 hover:text-white" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</Button><Button variant="outline" size="sm" className="hidden border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/10 sm:flex" onClick={() => setShowTimetable(true)}><CalendarDays data-icon="inline-start" /> Timetable</Button><Dialog open={newOpen} onOpenChange={setNewOpen}><DialogTrigger asChild><Button size="sm" className="bg-white text-black hover:bg-white/90"><Plus data-icon="inline-start" /> New trip</Button></DialogTrigger><DialogContent className="border-white/10 bg-[#191c22] text-white"><DialogHeader><DialogTitle>Add a travel idea</DialogTitle></DialogHeader><div className="flex flex-col gap-4"><Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Destination and title" className="border-white/10 bg-white/5" /><Input value={newPeriod} onChange={(e) => setNewPeriod(e.target.value)} placeholder="When? e.g. December 12–15" className="border-white/10 bg-white/5" /><Input value={newTheme} onChange={(e) => setNewTheme(e.target.value)} placeholder="Theme e.g. food, nature, museums" className="border-white/10 bg-white/5" /><Textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="A few notes or things to remember" className="border-white/10 bg-white/5" /><Button onClick={addTrip} className="bg-indigo-500 text-white hover:bg-indigo-400">Add to ideas</Button></div></DialogContent></Dialog></div>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-indigo-300/75"><Sparkles className="size-3.5" /> Semester companion</div><h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">Make space for <span className="text-white/40">somewhere else.</span></h1><p className="mt-2 max-w-lg text-sm leading-6 text-white/45">A calm view of your academic load and the places you want to go this semester.</p></div><Tabs value={view} onValueChange={setView} className="w-full md:w-auto"><TabsList className="grid h-10 w-full grid-cols-3 border border-white/10 bg-white/[0.04] md:w-[360px]"><TabsTrigger value="roadmap" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white">Roadmap</TabsTrigger><TabsTrigger value="board" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white">Trip board</TabsTrigger><TabsTrigger value="week" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white">This week</TabsTrigger></TabsList></Tabs></div>
        {view === 'roadmap' && <Roadmap trips={trips} selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} setSelectedTrip={setSelectedTrip} selectedWeekTrips={selectedWeekTrips} />}
        {view === 'board' && <Board trips={trips} setSelectedTrip={setSelectedTrip} />}
        {view === 'week' && <TimetableContent filter />}
        <div className="mt-8 grid gap-4 md:grid-cols-3"><Metric icon={<Feather />} label="Academic load" value="Light this week" detail="2 classes · 1 deadline" tone="indigo" /><Metric icon={<TentTree />} label="Open weekends" value="3 available" detail="Best window: Nov 7–10" tone="emerald" /><Metric icon={<Clock3 />} label="Next milestone" value="Design critique" detail="Oct 21 · 10:00" tone="rose" /></div>
      </main>
      <Sheet open={!!selectedTrip} onOpenChange={(open) => !open && setSelectedTrip(null)}><SheetContent className="w-full overflow-y-auto border-white/10 bg-[#171a20] text-white sm:max-w-[480px]"><SheetHeader><div className="mb-2 flex items-center justify-between"><StatusBadge status={selectedTrip?.status || 'idea'} /><span className="text-xs text-white/35">Trip details</span></div><SheetTitle className="text-left text-2xl tracking-tight">{selectedTrip?.emoji} {selectedTrip?.title}</SheetTitle><p className="text-left text-sm text-white/45">{selectedTrip?.period}</p></SheetHeader>{selectedTrip && <div className="flex flex-col gap-7 py-6"><div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-4"><p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-amber-300/80">Academic overlap</p><p className="text-sm text-amber-100/75">{selectedTrip.academicOverlapNote}</p></div><div><p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Change status</p><Select value={selectedTrip.status} onValueChange={(value) => updateStatus(value as TripStatus)}><SelectTrigger className="border-white/10 bg-white/5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="idea">Idea</SelectItem><SelectItem value="planning">Planning</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem></SelectContent></Select></div><Separator className="bg-white/10" /><div><div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-widest text-white/40">Route options</p><Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-300 hover:bg-white/5">Compare</Button></div><div className="grid gap-3">{selectedTrip.routeOptions.map((route) => <div key={route.name} className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-indigo-300">{route.name}</span><MoreHorizontal className="size-4 text-white/25" /></div><p className="text-sm text-white/80">{route.description}</p><p className="mt-2 text-xs text-white/35">{route.meta}</p></div>)}</div></div><div><p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Notes</p><Textarea defaultValue={selectedTrip.notes} className="min-h-[130px] border-white/10 bg-white/[0.035] text-sm leading-6 text-white/70" /></div></div>}</SheetContent></Sheet>
      <Sheet open={showTimetable} onOpenChange={setShowTimetable}><SheetContent className="w-full overflow-y-auto border-white/10 bg-[#171a20] text-white sm:max-w-[720px]"><SheetHeader><SheetTitle className="text-left">Weekly timetable</SheetTitle><p className="text-left text-sm text-white/45">Your recurring class rhythm, at a glance.</p></SheetHeader><div className="py-6"><TimetableContent /></div></SheetContent></Sheet>
    </div>
  )
}

function Roadmap({ trips, selectedWeek, setSelectedWeek, setSelectedTrip, selectedWeekTrips }: { trips: Trip[]; selectedWeek: number; setSelectedWeek: (n: number) => void; setSelectedTrip: (t: Trip) => void; selectedWeekTrips: Trip[] }) {
  return <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"><div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4"><div><h2 className="text-sm font-semibold">Overview roadmap</h2><p className="mt-1 text-xs text-white/35">Click a week to inspect the collision course.</p></div><div className="hidden items-center gap-4 text-[10px] text-white/40 sm:flex"><span><i className="mr-1.5 inline-block size-1.5 rounded-full bg-rose-400" />deadline</span><span><i className="mr-1.5 inline-block size-1.5 rounded-full bg-indigo-400" />idea</span><span><i className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-400" />confirmed</span></div></div><div className="overflow-x-auto"><div className="min-w-[880px] p-5"><div className="grid grid-cols-[112px_repeat(12,minmax(68px,1fr))] gap-1"><div className="pb-4 text-[10px] font-medium uppercase tracking-wider text-white/30">Fall semester</div>{weeks.map((week, i) => <button key={week} onClick={() => setSelectedWeek(i)} className={cn('rounded-t-lg pb-4 text-center text-[10px] text-white/35 transition-colors hover:text-white', selectedWeek === i && 'bg-indigo-400/[0.07] text-indigo-200')}><span className="block">W{i + 1}</span><span>{week}</span></button>)}<div className="flex items-center gap-2 border-t border-white/[0.06] py-5 text-xs font-medium text-white/45"><GraduationCap className="size-3.5" /> Academic</div>{weeks.map((_, i) => <div key={i} className={cn('relative min-h-16 border-l border-t border-white/[0.06]', selectedWeek === i && 'bg-indigo-400/[0.06]')}><div className="absolute left-1/2 top-3 size-2 -translate-x-1/2 rounded-full bg-rose-400 shadow-[0_0_0_4px_rgba(251,113,133,0.12)]" />{[2, 6, 9].includes(i) && <div className="absolute bottom-3 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-white/15" />}</div>)}<div className="flex items-center gap-2 border-t border-white/[0.06] py-5 text-xs font-medium text-white/45"><Plane className="size-3.5" /> Travel</div>{weeks.map((_, i) => <div key={i} className={cn('relative min-h-[78px] border-l border-t border-white/[0.06]', selectedWeek === i && 'bg-indigo-400/[0.06]')}>{trips.filter((trip) => trip.weeks.includes(i)).map((trip) => <button key={trip.id} onClick={() => setSelectedTrip(trip)} className={cn('absolute inset-x-1 top-3 rounded-md border px-2 py-2 text-left text-[10px] transition-transform hover:-translate-y-0.5', statusMeta[trip.status].className, trip.status === 'idea' && 'border-dashed opacity-80')}><span className="block truncate">{trip.emoji} {trip.title.split(' · ')[0]}</span><span className="mt-1 block text-[9px] opacity-60">{statusMeta[trip.status].label}</span></button>)}</div>)}</div></div></div><div className="border-t border-white/[0.07] bg-indigo-400/[0.04] px-5 py-4"><p className="text-[10px] uppercase tracking-widest text-indigo-200/50">Selected week · W{selectedWeek + 1}</p><div className="mt-2 flex flex-wrap items-center gap-3"><p className="text-sm text-white/75">{selectedWeekTrips.length ? `${selectedWeekTrips.length} travel ${selectedWeekTrips.length === 1 ? 'idea' : 'ideas'} in view` : 'No travel plans yet'}</p>{selectedWeekTrips.map((trip) => <Button key={trip.id} variant="outline" size="sm" onClick={() => setSelectedTrip(trip)} className="h-7 border-white/10 bg-white/5 text-xs text-white/70">{trip.emoji} {trip.title.split(' · ')[0]}</Button>)}</div></div></div>
}

function Board({ trips, setSelectedTrip }: { trips: Trip[]; setSelectedTrip: (t: Trip) => void }) { return <div className="grid gap-4 lg:grid-cols-3">{(['idea', 'planning', 'confirmed'] as TripStatus[]).map((status) => <div key={status} className="min-h-[400px] rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><span className={cn('size-2 rounded-full', statusMeta[status].dot)} /><h2 className="text-sm font-semibold">{statusMeta[status].label}</h2><span className="text-xs text-white/25">{trips.filter((trip) => trip.status === status).length}</span></div><Button variant="ghost" size="icon" className="size-7 text-white/35 hover:bg-white/10 hover:text-white"><Plus /></Button></div><div className="flex flex-col gap-3">{trips.filter((trip) => trip.status === status).map((trip) => <button key={trip.id} onClick={() => setSelectedTrip(trip)} className="rounded-xl border border-white/[0.08] bg-[#191c22] p-4 text-left transition-colors hover:border-white/20"><div className="mb-3 flex items-start justify-between"><span className="text-lg">{trip.emoji}</span><MoreHorizontal className="size-4 text-white/25" /></div><p className="text-sm font-medium text-white/90">{trip.title}</p><p className="mt-1 text-xs text-white/40">{trip.period}</p><div className="mt-4 flex flex-wrap gap-1.5"><Badge variant="outline" className="border-white/10 bg-white/[0.04] text-[10px] font-normal text-white/50">{trip.keyTheme}</Badge><Badge variant="outline" className="border-amber-400/15 bg-amber-400/[0.06] text-[10px] font-normal text-amber-300/80">{trip.academicOverlapNote.split(' ').slice(0, 3).join(' ')}…</Badge></div></button>)}</div></div>)}</div> }

function TimetableContent({ filter = false }: { filter?: boolean }) { const [onlyTravel, setOnlyTravel] = useState(false); return <div><div className="mb-5 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] p-4"><div><p className="text-sm font-medium">Check travel conflicts</p><p className="mt-1 text-xs text-white/40">Highlight classes that need a plan.</p></div><Switch checked={onlyTravel} onCheckedChange={setOnlyTravel} /></div><div className="grid gap-3 sm:grid-cols-5">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => { const dayCourses = courses.filter((course) => course.day === day); return <div key={day} className={cn('rounded-xl border p-3', dayCourses.length ? 'border-white/[0.08] bg-white/[0.025]' : 'border-emerald-400/20 bg-emerald-400/[0.04]')}><div className="mb-4 flex items-center justify-between"><span className="text-xs font-semibold">{day}</span>{!dayCourses.length && <Check className="size-3.5 text-emerald-300" />}</div>{dayCourses.length ? <div className="flex flex-col gap-3">{dayCourses.filter((course) => !onlyTravel || course.name === 'Visual Culture').map((course) => <div key={course.time} className="border-l-2 border-white/10 pl-2.5"><div className={cn('mb-1 size-1.5 rounded-full', course.color)} /><p className="text-[11px] font-medium text-white/80">{course.name}</p><p className="mt-1 text-[10px] text-white/35">{course.time}</p><p className="text-[10px] text-white/35">{course.room}</p></div>)}</div> : <div className="flex min-h-24 flex-col items-center justify-center gap-2 text-center"><span className="text-2xl">✦</span><p className="text-[11px] text-emerald-200/70">Open day</p><p className="text-[10px] text-white/30">Long weekend potential</p></div>}</div>})}</div></div> }

function Metric({ icon, label, value, detail, tone }: { icon: React.ReactNode; label: string; value: string; detail: string; tone: string }) { return <Card className="border-white/[0.08] bg-white/[0.025] shadow-none"><CardContent className="flex items-center gap-4 p-5"><div className={cn('flex size-10 items-center justify-center rounded-xl', tone === 'indigo' && 'bg-indigo-400/10 text-indigo-300', tone === 'emerald' && 'bg-emerald-400/10 text-emerald-300', tone === 'rose' && 'bg-rose-400/10 text-rose-300')}>{icon}</div><div><p className="text-[11px] text-white/40">{label}</p><p className="mt-1 text-sm font-medium">{value}</p><p className="mt-1 text-[11px] text-white/35">{detail}</p></div></CardContent></Card> }

export default SemesterDashboard
