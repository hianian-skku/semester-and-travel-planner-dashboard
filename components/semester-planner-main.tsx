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
  Navigation,
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

export type TripCategory = 'visited' | 'confirmed' | 'planned'

export interface ScheduledTrip {
  id: string
  destination: string
  startDate: string
  endDate: string
  category: TripCategory
  badgeText: string
  note?: string
}

// 1. 이미 다녀온 여행 (빨간색)
// 2. 확정된 여행 (하늘색): 10/9~10/11 핀란드 헬싱키 (외국인 친구들이랑)
// 3. 고민 중인 여행 (보라색): 10/13~10/21 영국
export const scheduledTrips: ScheduledTrip[] = [
  {
    id: 'v-cph',
    destination: '코펜하겐',
    startDate: '2026-09-14',
    endDate: '2026-09-15',
    category: 'visited',
    badgeText: '코펜하겐 (다녀옴)',
    note: '다녀온 여행',
  },
  {
    id: 'v-munich',
    destination: '뮌헨',
    startDate: '2026-09-20',
    endDate: '2026-09-21',
    category: 'visited',
    badgeText: '뮌헨 (다녀옴)',
    note: '다녀온 여행',
  },
  {
    id: 'c-helsinki',
    destination: '핀란드 헬싱키',
    startDate: '2026-10-09',
    endDate: '2026-10-11',
    category: 'confirmed',
    badgeText: '헬싱키 (확정)',
    note: '외국인 친구들이랑 (확정된 여행)',
  },
  {
    id: 'p-uk',
    destination: '영국',
    startDate: '2026-10-13',
    endDate: '2026-10-21',
    category: 'planned',
    badgeText: '영국 (고민 중)',
    note: '갈까 고민 중인 여행',
  },
]

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

// 9월 초 시간표를 포함한 전체 TimeEdit 수업 데이터 (2026.09.01 ~ 2027.01.17)
interface ClassEvent {
  date: string // YYYY-MM-DD
  time: string
  course: string
  room: string
  isZoom: boolean
}

const timeEditClasses: ClassEvent[] = [
  // ⭐️ 9월 초 (추가 첨부 PDF 반영)
  // w36
  { date: '2026-09-01', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Stuffen, Geocentrum', isZoom: false },
  { date: '2026-09-01', time: '13:15 - 15:00', course: 'Project with XR', room: 'Ångström 11240', isZoom: false },
  { date: '2026-09-02', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Båthsalen, Geocentrum', isZoom: false },
  { date: '2026-09-02', time: '15:15 - 17:00', course: 'Project with XR', room: '101142, Ångström', isZoom: false },
  { date: '2026-09-03', time: '11:00 - 12:00', course: 'Project with XR', room: 'Via Zoom', isZoom: true }, // 줌 수업만!
  { date: '2026-09-04', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },

  // w37
  { date: '2026-09-07', time: '08:15 - 10:00', course: 'Applied Geophysics', room: 'Dk235, Geocentrum', isZoom: false },
  { date: '2026-09-07', time: '15:15 - 17:00', course: 'Applied Geophysics', room: 'Norrland II Gm116', isZoom: false },
  { date: '2026-09-08', time: '15:15 - 17:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },
  // 9/9 (수) 수업 없음
  { date: '2026-09-10', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },
  { date: '2026-09-10', time: '10:30 - 12:00', course: 'Project with XR', room: 'Via Zoom', isZoom: true },
  { date: '2026-09-11', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },

  // w38
  { date: '2026-09-14', time: '13:15 - 15:00', course: 'Applied Geophysics', room: 'Norrland I Gm118', isZoom: false },
  { date: '2026-09-15', time: '10:15 - 12:00', course: 'Project with XR', room: 'Via Zoom', isZoom: true }, // 줌 수업만!
  { date: '2026-09-16', time: '08:30 - 10:00', course: 'Project with XR', room: 'Via Zoom', isZoom: true },
  { date: '2026-09-16', time: '13:15 - 15:00', course: 'Applied Geophysics', room: 'Båthsalen, Geocentrum', isZoom: false },
  { date: '2026-09-16', time: '13:15 - 15:00', course: 'Project with XR (Seminar)', room: '11134, Ångström', isZoom: false },
  { date: '2026-09-16', time: '15:15 - 17:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },
  { date: '2026-09-17', time: '13:15 - 15:00', course: 'Applied Geophysics', room: 'Dk235, Geocentrum', isZoom: false },
  { date: '2026-09-17', time: '15:15 - 17:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },
  { date: '2026-09-18', time: '13:15 - 15:00', course: 'Applied Geophysics', room: 'Norrland I Gm118', isZoom: false },

  // w39
  { date: '2026-09-21', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },
  { date: '2026-09-22', time: '13:15 - 15:00', course: 'Applied Geophysics', room: 'Småland, Geocentrum', isZoom: false },
  { date: '2026-09-23', time: '08:30 - 10:00', course: 'Project with XR', room: 'Zoom', isZoom: true },
  { date: '2026-09-23', time: '15:15 - 17:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },
  { date: '2026-09-24', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Båthsalen, Geocentrum', isZoom: false },
  { date: '2026-09-25', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },

  // w40 (야외 실습)
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

const regionFilterTabs = [
  { key: 'all', label: '전체 보기' },
  { key: 'nordic', label: '1. 북유럽/극지방' },
  { key: 'uk', label: '2. 영국/아일랜드' },
  { key: 'central', label: '3. 중유럽/독일' },
  { key: 'west', label: '4. 서유럽' },
  { key: 'south', label: '5. 남유럽/발트' },
  { key: 'longhaul', label: '6. 대형 장거리' },
]

export function SemesterPlannerMain() {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0) // 9월 기본으로 시작
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-14')
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

  // Helper: 날짜별 수업 상태 및 여행 상태 판정
  const getDateStatus = (dateStr: string) => {
    // 여행 상태 판정 (우선순위: visited 빨강, confirmed 하늘, planned 보라)
    const trip = scheduledTrips.find((t) => dateStr >= t.startDate && dateStr <= t.endDate)

    const classes = timeEditClasses.filter((c) => {
      if (c.date !== dateStr) return false
      if (!showSciComp && c.course.includes('Scientific Computing')) return false
      return true
    })

    if (trip) {
      if (trip.category === 'visited') {
        // 이미 다녀온 여행: 빨간색
        return {
          type: 'visited' as const,
          label: '다녀온 여행',
          trip,
          bgClass: 'bg-red-50 text-red-950 border-2 border-red-500 shadow-xs dark:bg-red-950/40 dark:text-red-200 dark:border-red-600',
          badgeClass: 'bg-red-600 text-white font-bold dark:bg-red-600 dark:text-white',
          classes,
        }
      } else if (trip.category === 'confirmed') {
        // 확정된 여행: 하늘색
        return {
          type: 'confirmed' as const,
          label: '확정된 여행',
          trip,
          bgClass: 'bg-sky-50 text-sky-950 border-2 border-sky-400 shadow-xs dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-500',
          badgeClass: 'bg-sky-500 text-white font-bold dark:bg-sky-500 dark:text-white',
          classes,
        }
      } else {
        // 고민 중인 여행: 보라색
        return {
          type: 'planned' as const,
          label: '고민 중인 여행',
          trip,
          bgClass: 'bg-purple-50 text-purple-950 border-2 border-purple-400 shadow-xs dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-500',
          badgeClass: 'bg-purple-600 text-white font-bold dark:bg-purple-600 dark:text-white',
          classes,
        }
      }
    }

    if (classes.length === 0) {
      return {
        type: 'free' as const,
        label: '수업 없음',
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
        label: '줌(온라인) 수업',
        trip: null,
        bgClass: 'bg-amber-50 text-amber-900 border-amber-200/80 hover:bg-amber-100/70 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900/60',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200',
        classes,
      }
    }

    return {
      type: 'class' as const,
      label: '대면 수업/실습',
      trip: null,
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
              여행계획 아이디어보드
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
              여행계획 아이디어보드
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
              녹색(수업 없음)과 주황색(온라인 줌) 날짜를 참고하여 여행 일정을 조율할 수 있음. 확정된 여행은 하늘색, 고민 중인 여행은 보라색이야. 여행 같이 가면 좋으니 겹치면 같이 가자!!!
            </p>
          </div>

          {/* Scientific Computing ON/OFF Toggle (기본 OFF: 드랍 모드) */}
          <div className="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-850 self-start sm:self-auto">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Scientific Computing 표시:
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
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          {/* LEFT: CALENDAR (달력) */}
          <div className="flex flex-col gap-4">
            <Card className="border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-[#13161f]">
              {/* Calendar Header with Month Selector */}
              <CardHeader className="p-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* 월 선택 박스: 가로 폭을 넉넉히 하고 whitespace-nowrap 적용하여 '2027년 1월' 줄바꿈 방지 */}
                  <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-850">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0"
                      disabled={selectedMonthIdx === 0}
                      onClick={() => setSelectedMonthIdx((p) => Math.max(0, p - 1))}
                    >
                      <ChevronLeft className="size-3.5" />
                    </Button>
                    <span className="px-3 text-xs font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap min-w-[96px] text-center shrink-0">
                      {curMonth.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0"
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

                {/* Color Legend (수업 상태 + 다녀온/확정/고민중 여행) */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
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
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">수업/실습 (회색)</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                    <span className="size-2.5 rounded border-2 border-red-500 bg-red-100" />
                    <span>다녀옴 (빨강)</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400">
                    <span className="size-2.5 rounded border-2 border-sky-400 bg-sky-100" />
                    <span>확정 여행 (하늘)</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                    <span className="size-2.5 rounded border-2 border-purple-400 bg-purple-100" />
                    <span>고민 중 (보라)</span>
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
                    const trip = status.trip

                    return (
                      <div
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          'h-20 rounded border p-1.5 text-xs transition-all cursor-pointer flex flex-col justify-between relative',
                          status.bgClass,
                          isSelected && 'ring-2 ring-indigo-600 shadow-md'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'font-bold',
                              dayOfWeek === 0 && 'text-rose-600 dark:text-rose-400',
                              trip?.category === 'visited' && 'text-red-700 font-extrabold',
                              trip?.category === 'confirmed' && 'text-sky-800 dark:text-sky-200 font-extrabold',
                              trip?.category === 'planned' && 'text-purple-800 dark:text-purple-200 font-extrabold'
                            )}
                          >
                            {dayNum}
                          </span>

                          {/* Badge based on trip type or class status */}
                          {trip ? (
                            <span className={cn('text-[9px] font-bold px-1 py-0.2 rounded shadow-2xs', status.badgeClass)}>
                              {trip.destination}
                            </span>
                          ) : (
                            <span className={cn('text-[9px] font-bold px-1 rounded', status.badgeClass)}>
                              {status.label}
                            </span>
                          )}
                        </div>

                        {/* Trip label or Class preview */}
                        <div className="overflow-hidden">
                          {trip ? (
                            <div className="text-[10px] font-bold leading-tight truncate">
                              {trip.category === 'visited' && (
                                <span className="text-red-700 dark:text-red-300">✓ 다녀옴 ({trip.destination})</span>
                              )}
                              {trip.category === 'confirmed' && (
                                <span className="text-sky-700 dark:text-sky-300">✈️ 확정 ({trip.destination})</span>
                              )}
                              {trip.category === 'planned' && (
                                <span className="text-purple-700 dark:text-purple-300">💡 고민 중 ({trip.destination})</span>
                              )}
                              {status.classes.length > 0 && (
                                <span className="block text-[9px] font-normal opacity-85">
                                  수업: {status.classes[0].course.split(' ')[0]}
                                </span>
                              )}
                            </div>
                          ) : status.classes.length > 0 ? (
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {dateInfo.date} ({dateInfo.dayOfWeek})
                  </span>

                  {dateInfo.trip && dateInfo.trip.category === 'visited' && (
                    <Badge className="bg-red-600 text-white font-bold text-[10px]">
                      🚩 {dateInfo.trip.destination} (다녀온 여행)
                    </Badge>
                  )}

                  {dateInfo.trip && dateInfo.trip.category === 'confirmed' && (
                    <Badge className="bg-sky-500 text-white font-bold text-[10px]">
                      ✈️ {dateInfo.trip.destination} (확정: {dateInfo.trip.note})
                    </Badge>
                  )}

                  {dateInfo.trip && dateInfo.trip.category === 'planned' && (
                    <Badge className="bg-purple-600 text-white font-bold text-[10px]">
                      💡 {dateInfo.trip.destination} (고민 중: {dateInfo.trip.note})
                    </Badge>
                  )}

                  <Badge variant="outline" className={cn('text-[10px] font-bold', dateInfo.badgeClass)}>
                    {dateInfo.label}
                  </Badge>

                  {dateInfo.classes.length > 0 && (
                    <span className="text-zinc-600 dark:text-zinc-400">
                      수업: {dateInfo.classes.map((c) => `${c.course} (${c.time})`).join(', ')}
                    </span>
                  )}

                  {dateInfo.classes.length === 0 && !dateInfo.trip && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      수업 없는 날 (여행 일정 편성 가능)
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400 hidden sm:inline">날짜 클릭 시 갱신</span>
              </div>
            )}
          </div>

          {/* RIGHT: TRAVEL DESTINATIONS LIST (우측 여행지 리스트 - 글자 겹침 버그 완벽 수정!) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Compass className="size-4 text-indigo-600" />
                  <span>가려는 여행지 리스트</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  목적지와 권장 체류 박수 목록입니다. (클릭 시 세부 메모 확인)
                </p>
              </div>

              <span className="text-xs text-zinc-400 font-semibold">
                {filteredDestinations.length}곳
              </span>
            </div>

            {/* Region Filter Buttons (겹침 버그를 완전히 방지하는 깔끔한 칩 버튼 그룹) */}
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
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Clean List Items (독립된 높이와 스크롤 컨테이너로 글자 겹침 원천 차단) */}
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
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
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {dest.regionName}
                    </span>
                    <span className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400 mt-0.5">
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
