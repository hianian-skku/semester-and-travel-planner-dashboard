'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Info,
  MapPin,
  Moon,
  Plane,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Types
export interface TripDestination {
  id: string
  region: 'nordic' | 'uk' | 'central' | 'west' | 'south' | 'longhaul'
  regionName: string
  name: string
  duration: string // 권장 박수
  description: string
}

// 사용자가 제공한 6개 권역, 27개 여행지 목록
export const travelDestinations: TripDestination[] = [
  // 1. 북유럽 & 극지방 (오로라/겨울)
  {
    id: 'helsinki',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    name: '핀란드 헬싱키',
    duration: '2박 3일',
    description: '템펠리아우키오 암석교회, 수오멘린나 요새, 사우나 체험, 카페/디자인 투어. 도시가 아담해 2박이면 충분.',
  },
  {
    id: 'rovaniemi',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    name: '핀란드 로바니에미 (산타마을)',
    duration: '2박 ~ 3박',
    description: '산타클로스 빌리지, 순록/허스키 썰매, 북극권 경계선 통과. 12월 크리스마스 시즌 정취 만끽.',
  },
  {
    id: 'tromso',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    name: '노르웨이 트롬쇠 (오로라 헌팅)',
    duration: '3박 4일',
    description: '날씨 변수를 고려해 오로라 투어 기회를 최소 2~3회 확보하기 위한 기본 체류 기간. 피오르 투어 병행.',
  },
  {
    id: 'abisko-kiruna',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    name: '스웨덴 아비스코/키루나',
    duration: '2박 ~ 3박',
    description: '웁살라발 야간열차 활용. 아비스코 국립공원 "블루 홀" 오로라 관측 및 키루나 아이스호텔.',
  },
  {
    id: 'iceland',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    name: '아이슬란드 (링로드 남부)',
    duration: '5박 ~ 6박',
    description: '레이캬비크, 골든서클, 남부 빙하 호수(요쿨살론), 검은 모래 해변, 겨울 블루아이스케이브(얼음동굴) 탐험.',
  },

  // 2. 영국 & 아일랜드
  {
    id: 'london',
    region: 'uk',
    regionName: '2. 영국 & 아일랜드',
    name: '영국 런던 & 근교',
    duration: '2박 ~ 3박',
    description: '런던은 이미 방문 경험이 있으므로 가벼운 시내 산책, 펍 투어, 세븐시스터즈 또는 바스/옥스퍼드 근교 당일치기 중심.',
  },
  {
    id: 'manchester-liverpool',
    region: 'uk',
    regionName: '2. 영국 & 아일랜드',
    name: '영국 맨체스터 / 리버풀',
    duration: '2박 3일',
    description: '국립 축구 박물관, 구단 스타디움 투어(올드 트래퍼드/안필드/에티하드), 락/비틀즈 역사 및 로컬 펍 문화 체험.',
  },
  {
    id: 'york',
    region: 'uk',
    regionName: '2. 영국 & 아일랜드',
    name: '영국 요크 (잉글랜드 중부)',
    duration: '1박 2일',
    description: '런던-에든버러 기차 이동 중간 기착지. 요크 민스터 대성당, 샴블즈 골목, 로마 성벽 야경.',
  },
  {
    id: 'edinburgh',
    region: 'uk',
    regionName: '2. 영국 & 아일랜드',
    name: '스코틀랜드 에든버러',
    duration: '2박 3일',
    description: '에든버러 성, 로열 마일, 칼튼 힐 일몰, 아서스 시트 트레킹, 스코치 위스키 체험.',
  },
  {
    id: 'highland-skye',
    region: 'uk',
    regionName: '2. 영국 & 아일랜드',
    name: '스코틀랜드 스카이섬 & 하이랜드',
    duration: '2박 3일',
    description: '글렌코 협곡, 네스호, 스카이섬 핵심 트레킹(Old Man of Storr, Quiraing, Cuillin Hills, Neist Point 등). 이동 거리가 길어 최소 2박 필수.',
  },

  // 3. 중유럽 & 독일
  {
    id: 'prague',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    name: '체코 프라하',
    duration: '2박 3일',
    description: '프라하 성, 카를교, 구시가 광장 천문시계, 체코 맥주 양조장 투어.',
  },
  {
    id: 'vienna',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    name: '오스트리아 빈 (비엔나)',
    duration: '2박 ~ 3박',
    description: '쇤브룬 궁전, 벨베데레 궁전(클림트 키스), 카페 자허/센트럴, 빈 미술사 박물관, 슈테판 대성당.',
  },
  {
    id: 'budapest',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    name: '헝가리 부다페스트',
    duration: '2박 3일',
    description: '국회의사당 야경(크루즈), 세체니 온천, 어부의 요새, 루인 펍(Ruin Bar) 문화.',
  },
  {
    id: 'bratislava',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    name: '슬로바키아 브라티슬라바',
    duration: '당일치기 ~ 1박',
    description: '빈에서 버스/기차로 1시간 거리. 브라티슬라바 성과 구시가지를 반나절에서 1박으로 가볍게 관람.',
  },
  {
    id: 'berlin-dresden',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    name: '독일 (베를린 / 드레스덴)',
    duration: '3박 4일',
    description: '베를린 장벽/박물관 섬(2박) + "독일의 피렌체" 드레스덴 구시가지 및 크리스마스 마켓(1박).',
  },
  {
    id: 'munich-bavaria',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    name: '독일 (뮌헨 & 바이에른)',
    duration: '2박 ~ 3박',
    description: '마리엔 광장, 영국정원, BMW 박물관, 님펜부르크 궁전. (근교 퓌센 노이슈반슈타인 성 포함 시 3박).',
  },

  // 4. 서유럽 (육로 코스 & 프랑스/스위스)
  {
    id: 'cph-city',
    region: 'west',
    regionName: '4. 서유럽',
    name: '덴마크 코펜하겐',
    duration: '2박 3일',
    description: '뉘하운 운하, 티볼리 공원, 디자인 뮤지엄. (육로 종단 시 함부르크행 기차 환승 거점).',
  },
  {
    id: 'hamburg',
    region: 'west',
    regionName: '4. 서유럽',
    name: '독일 함부르크',
    duration: '1박 2일',
    description: '슈파이허슈타트(붉은 벽돌 창고군), 엘프필하모니 전망대, 항구 야경.',
  },
  {
    id: 'amsterdam',
    region: 'west',
    regionName: '4. 서유럽',
    name: '네덜란드 암스테르담',
    duration: '2박 3일',
    description: '운하 크루즈, 반 고흐 미술관, 라익스뮈제움, 요르단 지구 자전거 산책.',
  },
  {
    id: 'belgium',
    region: 'west',
    regionName: '4. 서유럽',
    name: '벨기에 (브뤼셀 & 브뤼허)',
    duration: '2박 3일',
    description: '브뤼셀 그랑플라스 야경, 와플/초콜릿, 그리고 동화 같은 중세 운하 도시 브뤼허(Brugge) 당일치기.',
  },
  {
    id: 'mont-saint-michel',
    region: 'west',
    regionName: '4. 서유럽',
    name: '프랑스 몽생미셸 (+파리 근교)',
    duration: '2박 3일',
    description: '파리 경유 노르망디 이동. 해질녘 물 차오르는 몽생미셸 수도원 갯벌 걷기 및 야경 감상.',
  },
  {
    id: 'nice-monaco',
    region: 'west',
    regionName: '4. 서유럽',
    name: '프랑스 니스 & 모나코',
    duration: '3박 4일',
    description: '니스 해변 프로메나드, 에즈(Èze) 요새 마을, 기차 20분 거리의 카지노와 요트 항구 모나코 당일치기.',
  },
  {
    id: 'swiss-alps',
    region: 'west',
    regionName: '4. 서유럽',
    name: '스위스 (바젤·루체른·베른·인터라켄)',
    duration: '4박 ~ 5박',
    description: '바젤 미술관(1박), 루체른 리기 산(1박), 베른 구시가지 및 알프스 멘리헨 하이킹/설경(2박).',
  },

  // 5. 남유럽 & 발트해 / 폴란드
  {
    id: 'poland',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    name: '폴란드 그단스크 & 바르샤바',
    duration: '3박 4일',
    description: '1/22 귀국길 활용. 그단스크 모틀라바 강변/구시가지(2박) + 고속기차 이동 후 바르샤바 왕궁/쇼팽 거리(1박).',
  },
  {
    id: 'baltic',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    name: '발트 3국 (탈린/에스토니아 or 리가)',
    duration: '2박 3일',
    description: '스톡홀름 밤 페리(탈링크)로 선내 숙박하며 중세 성벽이 그대로 남은 탈린 올드타운 집중 투어.',
  },
  {
    id: 'san-sebastian-bilbao',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    name: '스페인 북부 (산세바스티안 & 빌바오)',
    duration: '3박 4일',
    description: '미식의 수도 산세바스티안 핀초스 바 호핑, 콘차 해변, 빌바오 구겐하임 미술관.',
  },
  {
    id: 'tenerife',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    name: '스페인 테네리페',
    duration: '4박 ~ 5박',
    description: '카나리아 제도의 온화한 섬. 테이데 화산 국립공원, 자연 천연 수영장, 돌고래 투어 및 휴양.',
  },
  {
    id: 'greece',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    name: '그리스 (아테네 & 메테오라)',
    duration: '4박 ~ 5박',
    description: '아테네 아크로폴리스, 수니온 곶 일몰, 기암괴석 위 공중 수도원 메테오라.',
  },
  {
    id: 'turkey',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    name: '튀르키예 (이스탄불 & 카파도키아)',
    duration: '5박 ~ 6박',
    description: '이스탄불 보스포루스 해협/모스크(3박) + 카파도키아 기암괴석 및 열기구 투어(2박).',
  },

  // 6. 대형 장거리 (연말연시 단독 후보)
  {
    id: 'nyc',
    region: 'longhaul',
    regionName: '6. 연말연시 대형장거리',
    name: '미국 뉴욕 (동부)',
    duration: '7박 ~ 9박',
    description: '록펠러센터 크리스마스트리, 센트럴 파크, 메트로폴리탄 미술관, 브로드웨이 뮤지컬, 타임스스퀘어 새해 카운트다운. 시차와 비행시간 감안 최소 7박 이상 권장.',
  },
  {
    id: 'egypt',
    region: 'longhaul',
    regionName: '6. 연말연시 대형장거리',
    name: '이집트 (카이로 & 룩소르/아스완)',
    duration: '7박 ~ 9박',
    description: '카이로 기자 피라미드, 이집트 문명 박물관, 룩소르 왕가의 계곡/카르나크 신전, 나일강 크루즈. 연말연시 쾌적한 겨울 건기 배낭여행.',
  },
]

// TimeEdit 스케줄 데이터 (수업 구분)
interface ClassEvent {
  date: string // YYYY-MM-DD
  time: string
  course: string
  room: string
  isZoom: boolean
}

const timeEditClasses: ClassEvent[] = [
  // 9월
  { date: '2026-09-21', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Geocentrum', isZoom: false },
  { date: '2026-09-22', time: '13:15 - 15:00', course: 'Applied Geophysics', room: 'Geocentrum', isZoom: false },
  { date: '2026-09-23', time: '08:30 - 10:00', course: 'Project with XR', room: 'Zoom', isZoom: true },
  { date: '2026-09-23', time: '15:15 - 17:00', course: 'Applied Geophysics', room: 'Geocentrum', isZoom: false },
  { date: '2026-09-24', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Geocentrum', isZoom: false },
  { date: '2026-09-25', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Geocentrum', isZoom: false },
  { date: '2026-09-28', time: '08:15 - 17:00', course: 'Geophysics Field studies', room: 'Field', isZoom: false },
  { date: '2026-09-29', time: '08:15 - 17:00', course: 'Geophysics Field studies', room: 'Field', isZoom: false },
  { date: '2026-09-30', time: '08:15 - 17:00', course: 'Geophysics Field studies', room: 'Field', isZoom: false },
  { date: '2026-09-30', time: '08:30 - 10:00', course: 'Project with XR', room: 'Online', isZoom: true },

  // 10월
  { date: '2026-10-01', time: '08:15 - 17:00', course: 'Geophysics Field studies', room: 'Field', isZoom: false },
  { date: '2026-10-02', time: '08:15 - 17:00', course: 'Geophysics Field studies', room: 'Field', isZoom: false },
  { date: '2026-10-05', time: '10:15 - 12:00', course: 'Project with XR', room: 'Online (Zoom)', isZoom: true }, // 줌 수업만!
  { date: '2026-10-06', time: '10:15 - 12:00', course: 'Project with XR', room: '101136 Ångström', isZoom: false },
  { date: '2026-10-16', time: '13:15 - 16:00', course: 'Project with XR', room: 'Via Zoom', isZoom: true }, // 줌 수업만!
  { date: '2026-10-26', time: '08:00 - 17:00', course: 'XR Final Presentation', room: 'Ångström', isZoom: false },
  { date: '2026-10-29', time: '13:15 - 15:00', course: 'Geophysics Exam', room: 'Hall', isZoom: false },

  // 11월 ~ 1월: Scientific Computing (기본 OFF 대상)
  { date: '2026-11-02', time: '08:15 - 15:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-03', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-04', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-06', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-10', time: '15:15 - 17:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-11', time: '10:15 - 17:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-12', time: '08:15 - 10:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-16', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-17', time: '13:15 - 15:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-19', time: '13:15 - 15:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-20', time: '08:15 - 10:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-24', time: '08:15 - 10:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-26', time: '15:15 - 17:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-11-30', time: '15:15 - 17:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-12-01', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-12-08', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-12-09', time: '10:15 - 12:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2026-12-16', time: '08:15 - 10:00', course: 'Introduction to Scientific Computing', room: 'Ångström', isZoom: false },
  { date: '2027-01-11', time: '08:00 - 17:00', course: 'Introduction to Scientific Computing Exam', room: 'Ladok', isZoom: false },

  // 11월 ~ 12월: HCI & Fails in Physics (고정)
  { date: '2026-11-04', time: '08:15 - 10:00', course: 'Human-Computer Interaction', room: '80127 Ångström', isZoom: false },
  { date: '2026-11-09', time: '08:15 - 10:00', course: 'Human-Computer Interaction', room: '80101 Ångström', isZoom: false },
  { date: '2026-11-09', time: '10:15 - 12:00', course: 'Fails in Physics', room: '80115 Ångström', isZoom: false },
  { date: '2026-11-10', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80121 Ångström', isZoom: false },
  { date: '2026-11-13', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80127 Ångström', isZoom: false },
  { date: '2026-11-17', time: '08:15 - 10:00', course: 'Human-Computer Interaction', room: '80127 Ångström', isZoom: false },
  { date: '2026-11-18', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80121 Ångström', isZoom: false },
  { date: '2026-11-25', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80121 Ångström', isZoom: false },
  { date: '2026-12-09', time: '10:15 - 12:00', course: 'Human-Computer Interaction', room: '80121 Ångström', isZoom: false },
  { date: '2026-12-11', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80121 Ångström', isZoom: false },
  { date: '2026-12-14', time: '08:15 - 17:00', course: 'Fails in Physics (세미나)', room: 'Ångström', isZoom: false },
  { date: '2026-12-14', time: '13:15 - 15:00', course: 'Human-Computer Interaction', room: 'Ångström', isZoom: false },
  { date: '2026-12-15', time: '08:15 - 17:00', course: 'Fails in Physics (세미나)', room: 'Ångström', isZoom: false },
  { date: '2026-12-16', time: '08:15 - 17:00', course: 'Fails in Physics (세미나)', room: 'Ångström', isZoom: false },
  { date: '2026-12-17', time: '08:15 - 17:00', course: 'Fails in Physics (세미나)', room: 'Ångström', isZoom: false },
  { date: '2026-12-18', time: '13:15 - 15:00', course: 'Human-Computer Interaction (종강)', room: 'Ångström', isZoom: false },
]

// 5 Months Calendar Config (2026.09 ~ 2027.01)
const calendarMonths = [
  { year: 2026, month: 9, name: '2026년 9월', startDay: 2, days: 30 },
  { year: 2026, month: 10, name: '2026년 10월', startDay: 4, days: 31 },
  { year: 2026, month: 11, name: '2026년 11월', startDay: 0, days: 30 },
  { year: 2026, month: 12, name: '2026년 12월', startDay: 2, days: 31 },
  { year: 2027, month: 1, name: '2027년 1월', startDay: 5, days: 31 },
]

export function SemesterPlannerMain() {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(1) // 10월 기본
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-16')
  const [selectedDestination, setSelectedDestination] = useState<TripDestination | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  // ⭐️ Introduction to Scientific Computing: 기본적으로 드랍(OFF)하는 것으로 전제!
  const [showSciComp, setShowSciComp] = useState<boolean>(false)

  // ⭐️ 기본 라이트 모드 (dark = false)
  const [dark, setDark] = useState<boolean>(false)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('planner-theme-v3')
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
      window.localStorage.setItem('planner-theme-v3', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      window.localStorage.setItem('planner-theme-v3', 'light')
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  // Filtered Destinations
  const filteredDestinations = useMemo(() => {
    if (selectedRegion === 'all') return travelDestinations
    return travelDestinations.filter((d) => d.region === selectedRegion)
  }, [selectedRegion])

  // Helper: 날짜별 수업 상태 판정
  // 1. 수업 없는 날 -> 연한 초록색
  // 2. 줌 수업만 있는 날 -> 연한 주황색
  // 3. 그 외 대면 수업/실습/시험 -> 연한 회색
  const getDateStatus = (dateStr: string) => {
    const classes = timeEditClasses.filter((c) => {
      if (c.date !== dateStr) return false
      if (!showSciComp && c.course.includes('Scientific Computing')) return false
      return true
    })

    if (classes.length === 0) {
      return {
        type: 'free',
        label: '수업 없음',
        bgClass: 'bg-emerald-50 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100/70 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900/60',
        badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200',
        classes,
      }
    }

    const isAllZoom = classes.every((c) => c.isZoom)
    if (isAllZoom) {
      return {
        type: 'zoom',
        label: '줌(온라인) 수업',
        bgClass: 'bg-amber-50 text-amber-900 border-amber-200/80 hover:bg-amber-100/70 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900/60',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200',
        classes,
      }
    }

    return {
      type: 'class',
      label: '대면 수업/실습',
      bgClass: 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200/70 dark:bg-zinc-850 dark:text-zinc-200 dark:border-zinc-750',
      badgeClass: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-750 dark:text-zinc-300',
      classes,
    }
  }

  const curMonth = calendarMonths[selectedMonthIdx]

  // Selected date status for inspector
  const dateInfo = useMemo(() => {
    if (!selectedDate) return null
    const dateObj = new Date(selectedDate)
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()]
    const status = getDateStatus(selectedDate)
    return {
      date: selectedDate,
      dayOfWeek,
      ...status,
    }
  }, [selectedDate, showSciComp])

  return (
    <div className={cn('min-h-screen transition-colors duration-150', dark ? 'dark bg-[#0d1017] text-zinc-100' : 'bg-[#fafafa] text-zinc-900')}>
      {/* 1. Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-[#0d1017]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              학기 일정 & 여행 플래너
            </span>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 font-medium">
              2026.09 ~ 2027.01
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {copySuccess ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              <span>{copySuccess ? '복사 완료' : '공유 링크 복사'}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              title={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
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
              수업 없는 날 확인 및 관심 여행지 리스트
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              달력의 녹색(수업 없음)과 주황색(온라인 수업) 날짜를 참고하여 여행 일정을 조율할 수 있습니다.
            </p>
          </div>

          {/* Scientific Computing ON/OFF Toggle (기본 OFF: 드랍 모드) */}
          <div className="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-850">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Scientific Computing 수업 표시:
            </span>
            <Switch checked={showSciComp} onCheckedChange={setShowSciComp} />
            <span className={cn('text-xs font-bold', showSciComp ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-700 dark:text-amber-400')}>
              {showSciComp ? 'ON' : 'OFF (드랍 모드)'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Left (Calendar) + Right (Travel Destinations List) */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT: CALENDAR (달력) */}
          <div className="flex flex-col gap-4">
            <Card className="border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-[#13161f]">
              {/* Calendar Header with Month Selector */}
              <CardHeader className="p-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-850">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      disabled={selectedMonthIdx === 0}
                      onClick={() => setSelectedMonthIdx((p) => Math.max(0, p - 1))}
                    >
                      <ChevronLeft className="size-3.5" />
                    </Button>
                    <span className="px-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {curMonth.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      disabled={selectedMonthIdx === calendarMonths.length - 1}
                      onClick={() => setSelectedMonthIdx((p) => Math.min(calendarMonths.length - 1, p + 1))}
                    >
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>

                  {/* 5 Month buttons */}
                  <div className="flex items-center gap-1">
                    {calendarMonths.map((m, idx) => (
                      <Button
                        key={m.name}
                        variant={selectedMonthIdx === idx ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedMonthIdx(idx)}
                        className={cn(
                          'h-6 px-1.5 text-xs font-semibold',
                          selectedMonthIdx === idx
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                            : 'text-zinc-600 dark:text-zinc-400'
                        )}
                      >
                        {m.year === 2027 ? `'27 1월` : `${m.month}월`}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Legend (사용자가 요청한 색상 규칙) */}
                <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded bg-emerald-100 border border-emerald-300" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">수업 없음 (초록)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded bg-amber-100 border border-amber-300" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">줌 수업 (주황)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded bg-zinc-200 border border-zinc-300" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">수업/시험 (회색)</span>
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-3">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 pb-1.5 text-center text-xs font-bold text-zinc-500">
                  <div>월</div>
                  <div>화</div>
                  <div>수</div>
                  <div>목</div>
                  <div>금</div>
                  <div className="text-zinc-400">토</div>
                  <div className="text-rose-500">일</div>
                </div>

                {/* Grid days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Padding previous month */}
                  {Array.from({ length: (curMonth.startDay + 6) % 7 }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="h-20 rounded border border-transparent bg-zinc-50/20 opacity-30" />
                  ))}

                  {/* Month days */}
                  {Array.from({ length: curMonth.days }).map((_, idx) => {
                    const dayNum = idx + 1
                    const dateStr = `${curMonth.year}-${String(curMonth.month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                    const dayOfWeek = (curMonth.startDay + idx) % 7 // 0=Sun, 1=Mon, ..., 6=Sat
                    const status = getDateStatus(dateStr)
                    const isSelected = selectedDate === dateStr

                    return (
                      <div
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          'h-20 rounded border p-1.5 text-xs transition-all cursor-pointer flex flex-col justify-between',
                          status.bgClass,
                          isSelected && 'ring-2 ring-indigo-600 shadow-xs'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn('font-bold', dayOfWeek === 0 && 'text-rose-600 dark:text-rose-400')}>
                            {dayNum}
                          </span>
                          <span className={cn('text-[9px] font-bold px-1 rounded', status.badgeClass)}>
                            {status.label}
                          </span>
                        </div>

                        {/* Class preview */}
                        <div className="overflow-hidden">
                          {status.classes.length > 0 ? (
                            <div className="text-[10px] leading-tight opacity-90 truncate font-medium">
                              {status.classes[0].course.split(' ')[0]} {status.classes.length > 1 && `+${status.classes.length - 1}`}
                            </div>
                          ) : (
                            <div className="text-[10px] text-emerald-700/70 dark:text-emerald-300/70">
                              {dayOfWeek === 0 || dayOfWeek === 6 ? '주말' : '자유 일정'}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Inspector (간단한 날짜 상태 정보) */}
            {dateInfo && (
              <div className="rounded-lg border border-zinc-200 bg-white p-3.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-[#13161f] dark:text-zinc-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {dateInfo.date} ({dateInfo.dayOfWeek})
                  </span>
                  <Badge variant="outline" className={cn('text-[10px] font-bold', dateInfo.badgeClass)}>
                    {dateInfo.label}
                  </Badge>
                  {dateInfo.classes.length > 0 && (
                    <span className="text-zinc-500">
                      {dateInfo.classes.map((c) => `${c.course} (${c.time})`).join(', ')}
                    </span>
                  )}
                  {dateInfo.classes.length === 0 && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      수업 없는 날 (여행하기 좋은 일정입니다)
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400">날짜를 클릭해 상세 확인</span>
              </div>
            )}
          </div>

          {/* RIGHT: TRAVEL DESTINATIONS LIST (우측 여행지 리스트) */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Compass className="size-4 text-indigo-600" />
                  <span>가려는 여행지 리스트</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  목적지와 권장 체류 박수 목록입니다. (클릭 시 세부 메모 확인)
                </p>
              </div>

              <span className="text-xs text-zinc-400 font-medium">
                {filteredDestinations.length}곳
              </span>
            </div>

            {/* Region Tabs */}
            <Tabs value={selectedRegion} onValueChange={setSelectedRegion} className="w-full">
              <TabsList className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-1 h-auto p-1 bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 w-full text-xs">
                <TabsTrigger value="all" className="text-xs py-1">전체 보기</TabsTrigger>
                <TabsTrigger value="nordic" className="text-xs py-1">북유럽/극지방</TabsTrigger>
                <TabsTrigger value="uk" className="text-xs py-1">영국/아일랜드</TabsTrigger>
                <TabsTrigger value="central" className="text-xs py-1">중유럽/독일</TabsTrigger>
                <TabsTrigger value="west" className="text-xs py-1">서유럽</TabsTrigger>
                <TabsTrigger value="south" className="text-xs py-1">남유럽/발트</TabsTrigger>
                <TabsTrigger value="longhaul" className="text-xs py-1">대형 장거리</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Clean List Items */}
            <div className="flex flex-col gap-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest)}
                  className={cn(
                    'group cursor-pointer rounded-lg border p-3 transition-colors flex items-center justify-between',
                    'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50/80',
                    'dark:border-zinc-800 dark:bg-[#13161f] dark:hover:border-zinc-700 dark:hover:bg-zinc-850'
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 font-medium">
                      {dest.regionName}
                    </span>
                    <span className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
                      {dest.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-zinc-300 bg-zinc-50 font-bold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 text-xs px-2.5 py-1"
                    >
                      {dest.duration}
                    </Badge>
                    <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 4. DETAIL MODAL (목적지 클릭 시 나타나는 메모 및 박수 안내) */}
      <Dialog open={!!selectedDestination} onOpenChange={(open) => !open && setSelectedDestination(null)}>
        <DialogContent className="border-zinc-300 bg-white text-zinc-900 shadow-xl dark:border-zinc-700 dark:bg-[#141721] dark:text-zinc-100 sm:max-w-[480px] p-5">
          {selectedDestination && (
            <div className="flex flex-col gap-3">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">{selectedDestination.regionName}</span>
                  <Badge className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold">
                    권장 체류: {selectedDestination.duration}
                  </Badge>
                </div>
                <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {selectedDestination.name}
                </DialogTitle>
              </DialogHeader>

              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3 text-xs leading-relaxed text-zinc-700 dark:bg-zinc-850 dark:border-zinc-750 dark:text-zinc-300">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">핵심 일정 및 체류 이유:</span>
                {selectedDestination.description}
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedDestination(null)} className="text-xs">
                  닫기
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
