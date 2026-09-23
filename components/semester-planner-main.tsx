'use client'

import { useEffect, useMemo, useState } from 'react'
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
export type TripRegionKey = 'nordic' | 'uk' | 'central_west' | 'south_baltic' | 'med_nafrica' | 'americas'

export interface TripDestination {
  id: string
  region: TripRegionKey
  regionName: string
  regionNameEn: string
  name: string
  nameEn: string
  duration: string // 권장 박수 (한국어)
  durationEn: string // Recommended stay (English)
  description: string
  descriptionEn: string
}

export type TripCategory = 'visited' | 'confirmed' | 'planned'

export interface ScheduledTrip {
  id: string
  destination: string
  destinationEn: string
  startDate: string
  endDate: string
  category: TripCategory
  badgeText: string
  badgeTextEn: string
  note?: string
  noteEn?: string
}

// 1. 이미 다녀온 여행 (빨간색)
// 2. 확정된 여행 (하늘색): 10/9~10/11 핀란드 헬싱키 (외국인 친구들이랑)
// 3. 고민 중인 여행 (보라색): 10/13~10/21 영국
export const scheduledTrips: ScheduledTrip[] = [
  {
    id: 'v-cph',
    destination: '코펜하겐',
    destinationEn: 'Copenhagen',
    startDate: '2026-09-14',
    endDate: '2026-09-15',
    category: 'visited',
    badgeText: '코펜하겐 (다녀옴)',
    badgeTextEn: 'Copenhagen (Visited)',
    note: '다녀온 여행',
    noteEn: 'Completed trip',
  },
  {
    id: 'v-munich',
    destination: '뮌헨',
    destinationEn: 'Munich',
    startDate: '2026-09-20',
    endDate: '2026-09-21',
    category: 'visited',
    badgeText: '뮌헨 (다녀옴)',
    badgeTextEn: 'Munich (Visited)',
    note: '다녀온 여행',
    noteEn: 'Completed trip',
  },
  {
    id: 'c-helsinki',
    destination: '핀란드 헬싱키',
    destinationEn: 'Helsinki, Finland',
    startDate: '2026-10-09',
    endDate: '2026-10-11',
    category: 'confirmed',
    badgeText: '헬싱키 (확정)',
    badgeTextEn: 'Helsinki (Confirmed)',
    note: '외국인 친구들이랑 (확정된 여행)',
    noteEn: 'Confirmed trip with international friends',
  },
  {
    id: 'p-uk',
    destination: '영국',
    destinationEn: 'United Kingdom',
    startDate: '2026-10-13',
    endDate: '2026-10-21',
    category: 'planned',
    badgeText: '영국 (고민 중)',
    badgeTextEn: 'UK (Considering)',
    note: '갈까 고민 중인 여행 (대면 수업 없음)',
    noteEn: 'Considering this trip (no on-campus classes)',
  },
  // ⭐️ 2027년 1월 확정 여정
  {
    id: 'c-sweden-exit',
    destination: '스웨덴 출국',
    destinationEn: 'Depart Sweden',
    startDate: '2027-01-22',
    endDate: '2027-01-22',
    category: 'confirmed',
    badgeText: '스웨덴 출국',
    badgeTextEn: 'Depart Sweden',
    note: '기숙사 체크아웃 & 스웨덴 출국 (폴란드 이동)',
    noteEn: 'Dorm checkout & departure from Sweden to Poland',
  },
  {
    id: 'c-poland-transit',
    destination: '폴란드 체류',
    destinationEn: 'In Poland',
    startDate: '2027-01-23',
    endDate: '2027-01-23',
    category: 'confirmed',
    badgeText: '폴란드 체류',
    badgeTextEn: 'In Poland',
    note: '폴란드 경유 체류 (그단스크/바르샤바)',
    noteEn: 'Transit stay in Poland (Gdańsk / Warsaw)',
  },
  {
    id: 'c-poland-exit',
    destination: '폴란드 출국',
    destinationEn: 'Depart Poland',
    startDate: '2027-01-24',
    endDate: '2027-01-24',
    category: 'confirmed',
    badgeText: '폴란드 출국',
    badgeTextEn: 'Depart Poland',
    note: '폴란드 출국 (한국행 비행기 탑승)',
    noteEn: 'Departure from Poland (Flight to Korea)',
  },
  {
    id: 'c-korea-arrive',
    destination: '한국 도착',
    destinationEn: 'Arrive Korea',
    startDate: '2027-01-25',
    endDate: '2027-01-25',
    category: 'confirmed',
    badgeText: '한국 도착',
    badgeTextEn: 'Arrive Korea',
    note: '한국 인천공항 도착 (귀국 완료)',
    noteEn: 'Arrival at Incheon Airport, Korea (Homecoming)',
  },
  {
    id: 'c-korea-band',
    destination: '밴드 공연',
    destinationEn: 'Band Concert',
    startDate: '2027-01-30',
    endDate: '2027-01-30',
    category: 'confirmed',
    badgeText: '밴드 공연',
    badgeTextEn: 'Band Concert',
    note: '한국 친구들 밴드 공연 구경',
    noteEn: 'Watching Korean friends\' band live concert',
  },
  {
    id: 'p-clair-obscur',
    destination: '클레르 옵스퀴르 콘서트',
    destinationEn: 'Clair Obscur Concert',
    startDate: '2027-01-28',
    endDate: '2027-01-28',
    category: 'planned',
    badgeText: '클레르 옵스퀴르 (고민 중)',
    badgeTextEn: 'Clair Obscur (Considering)',
    note: '토요일 친구들 공연 취소 시',
    noteEn: 'Only if Saturday friends\' band concert is cancelled',
  },
]

// ⭐️ 회색 처리 날짜 목록 (1/26, 1/27, 1/29, 1/31)
export const blockedGrayDates: Record<string, { labelKo: string; labelEn: string; noteKo: string; noteEn: string }> = {
  '2027-01-26': { labelKo: '회색 처리', labelEn: 'Unavailable', noteKo: '개인 일정 (여행 불가)', noteEn: 'Personal Schedule (Unavailable)' },
  '2027-01-27': { labelKo: '회색 처리', labelEn: 'Unavailable', noteKo: '개인 일정 (여행 불가)', noteEn: 'Personal Schedule (Unavailable)' },
  '2027-01-29': { labelKo: '회색 처리', labelEn: 'Unavailable', noteKo: '개인 일정 (여행 불가)', noteEn: 'Personal Schedule (Unavailable)' },
  '2027-01-31': { labelKo: '회색 처리', labelEn: 'Unavailable', noteKo: '개인 일정 (여행 불가)', noteEn: 'Personal Schedule (Unavailable)' },
}

// ⭐️ 업데이트된 권역별 여행지 목록 (국문 & 영문)
export const travelDestinations: TripDestination[] = [
  // 1. 북유럽 & 극지방 (오로라 / 겨울)
  {
    id: 'helsinki',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '핀란드 헬싱키',
    nameEn: 'Helsinki, Finland',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '수오멘린나 요새, 템펠리아우키오 암석교회, 헬싱키 대성당, 로컬 사우나 체험. 도시 규모가 작아 2박이면 시내를 충분히 둘러봅니다.',
    descriptionEn: 'Suomenlinna fortress, Temppeliaukio Rock Church, Helsinki Cathedral, and authentic local sauna experience. Compact city ideal for 2 nights.',
  },
  {
    id: 'rovaniemi',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '핀란드 로바니에미',
    nameEn: 'Rovaniemi, Finland',
    duration: '2박 ~ 3박',
    durationEn: '2 ~ 3 nights',
    description: '산타클로스 빌리지 방문, 북극권 통과 인증, 허스키·순록 썰매, 스노모빌 투어. 크리스마스 시즌(12월)에 분위기가 가장 좋습니다.',
    descriptionEn: 'Santa Claus Village, Arctic Circle crossing certificate, husky & reindeer sledding, snowmobile tours. Best during the December Christmas season.',
  },
  {
    id: 'tromso',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '노르웨이 트롬쇠',
    nameEn: 'Tromsø, Norway',
    duration: '3박 4일',
    durationEn: '3 nights 4 days',
    description: '북극권 대도시 특유의 탄탄한 투어 인프라. 오로라 관측률을 높이기 위해 최소 2~3회의 야간 투어 기회를 확보하는 3박이 안전합니다.',
    descriptionEn: 'Robust arctic tour infrastructure. 3 nights recommended to secure at least 2-3 night tour chances for higher aurora viewing probability.',
  },
  {
    id: 'abisko-kiruna',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '스웨덴 아비스코 / 키루나',
    nameEn: 'Abisko & Kiruna, Sweden',
    duration: '2박 ~ 3박',
    durationEn: '2 ~ 3 nights',
    description: '웁살라에서 야간열차(SJ Night Train)로 접근 가능. 구름이 적은 아비스코 국립공원 "블루 홀" 오로라 관측과 키루나 아이스호텔 탐방.',
    descriptionEn: 'Directly accessible from Uppsala via SJ Night Train. Aurora viewing at Abisko National Park "Blue Hole" and tour of the Kiruna Icehotel.',
  },
  {
    id: 'iceland',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '아이슬란드',
    nameEn: 'Iceland',
    duration: '5박 ~ 6박',
    durationEn: '5 ~ 6 nights',
    description: '레이캬비크, 골든서클, 남부 해안(블랙샌드 비치, 요쿨살론 빙하 호수), 겨울 한정 블루아이스케이브(얼음동굴) 탐험 및 로드트립.',
    descriptionEn: 'Reykjavik, Golden Circle, South Coast (Black Sand Beach, Jökulsárlón glacier lagoon), winter-exclusive blue ice cave exploration and road trip.',
  },

  // 2. 영국 & 스코틀랜드
  {
    id: 'uk-scotland',
    region: 'uk',
    regionName: '2. 영국 & 스코틀랜드',
    regionNameEn: '2. UK & Scotland',
    name: '영국 / 스코틀랜드 종합 코스',
    nameEn: 'UK & Scotland Complete Route',
    duration: '7박 ~ 8박',
    durationEn: '7 ~ 8 nights',
    description: '• 런던 & 요크 (2박): 런던 입국 후 가벼운 시내 산책, 중세 성곽 도시 요크(대성당, 샴블즈 골목) 경유.\n• 에든버러 (2박): 에든버러 성, 로열 마일, 칼튼 힐, 아서스 시트 트레킹.\n• 스카이섬 & 하이랜드 (3박): 글렌코 협곡, 네스호, 스카이섬 핵심 트레킹(Old Man of Storr, Quiraing, Neist Point 등).',
    descriptionEn: '• London & York (2 nights): City stroll in London, scenic stop in medieval walled city York (Minster, Shambles).\n• Edinburgh (2 nights): Edinburgh Castle, Royal Mile, Calton Hill, Arthur\'s Seat hike.\n• Isle of Skye & Highlands (3 nights): Glencoe Valley, Loch Ness, and dramatic Skye hikes (Old Man of Storr, Quiraing, Neist Point).',
  },

  // 3. 중유럽 & 서유럽
  {
    id: 'central-europe',
    region: 'central_west',
    regionName: '3. 중유럽 & 서유럽',
    regionNameEn: '3. Central & Western Europe',
    name: '체코, 오스트리아, 헝가리, 슬로바키아',
    nameEn: 'Czechia, Austria, Hungary, Slovakia',
    duration: '6박 ~ 8박',
    durationEn: '6 ~ 8 nights',
    description: '기차(ÖBB/RegioJet)로 직결되는 황금 동선. 프라하(2박) ➔ 빈(2~3박, 궁전 및 미술관) ➔ 브라티슬라바(당일치기 또는 1박) ➔ 부다페스트(2박, 야경 및 온천).',
    descriptionEn: 'Classic rail corridor via ÖBB/RegioJet. Prague (2 nights) ➔ Vienna (2-3 nights, palaces & museums) ➔ Bratislava (day trip or 1 night) ➔ Budapest (2 nights, thermal baths & night views).',
  },
  {
    id: 'germany',
    region: 'central_west',
    regionName: '3. 중유럽 & 서유럽',
    regionNameEn: '3. Central & Western Europe',
    name: '독일 (베를린, 드레스덴, 함부르크 등)',
    nameEn: 'Germany (Berlin, Dresden, Hamburg, etc.)',
    duration: '4박 ~ 5박',
    durationEn: '4 ~ 5 nights',
    description: '베를린(2박, 현대사/문화) + 드레스덴(1박, 고전 건축 및 크리스마스 마켓) + 함부르크(1~2박, 유네스코 창고군 및 항구 야경).',
    descriptionEn: 'Berlin (2 nights, modern history & culture) + Dresden (1 night, baroque architecture & Christmas markets) + Hamburg (1-2 nights, Speicherstadt warehouse district & harbor night view).',
  },
  {
    id: 'netherlands-belgium',
    region: 'central_west',
    regionName: '3. 중유럽 & 서유럽',
    regionNameEn: '3. Central & Western Europe',
    name: '네덜란드, 벨기에',
    nameEn: 'Netherlands & Belgium',
    duration: '4박 ~ 5박',
    durationEn: '4 ~ 5 nights',
    description: '암스테르담(2박, 운하 및 미술관) ➔ 기차 이동 ➔ 브뤼셀 & 브뤼허(2~3박, 그랑플라스 야경, 중세 운하 마을 브뤼허).',
    descriptionEn: 'Amsterdam (2 nights, canal belt & art museums) ➔ train journey ➔ Brussels & Bruges (2-3 nights, Grand Place illuminations & medieval canals of Bruges).',
  },
  {
    id: 'france',
    region: 'central_west',
    regionName: '3. 중유럽 & 서유럽',
    regionNameEn: '3. Central & Western Europe',
    name: '프랑스 (몽생미셸, 니스, 모나코 등)',
    nameEn: 'France (Mont Saint-Michel, Nice, Monaco, etc.)',
    duration: '권역별 2~3박',
    durationEn: '2 ~ 3 nights per region',
    description: '• 북부/노르망디: 몽생미셸 + 파리 근교 (2박 3일).\n• 남부/지중해: 니스 & 모나코 당일치기 (3박 4일, 온화한 해안 휴양).',
    descriptionEn: '• Northern/Normandy: Mont Saint-Michel + Paris surroundings (2 nights 3 days).\n• Southern/Riviera: Nice & Monaco day trip (3 nights 4 days, mild Mediterranean coastal retreat).',
  },

  // 4. 남유럽 & 발트해 / 폴란드
  {
    id: 'poland-gdansk',
    region: 'south_baltic',
    regionName: '4. 남유럽 & 발트해/폴란드',
    regionNameEn: '4. Southern Europe, Baltics & Poland',
    name: '폴란드 그단스크',
    nameEn: 'Gdańsk, Poland',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '모틀라바 강변 크레인, 롱 마켓, 2차 세계대전 박물관. (1/22 기숙사 체크아웃 후 바르샤바 경유 귀국길 루트에 연결하기 최적).',
    descriptionEn: 'Motława river crane, Long Market, Museum of the Second World War. (Ideal connection on the way home via Warsaw after dorm checkout on Jan 22).',
  },
  {
    id: 'baltic-states',
    region: 'south_baltic',
    regionName: '4. 남유럽 & 발트해/폴란드',
    regionNameEn: '4. Southern Europe, Baltics & Poland',
    name: '발트 3국 (에스토니아, 라트비아, 리투아니아)',
    nameEn: 'Baltic States (Estonia, Latvia, Lithuania)',
    duration: '2박 ~ 4박',
    durationEn: '2 ~ 4 nights',
    description: '• 탈린 단독: 스톡홀름 밤 페리(탈링크)로 주말 2박 3일 컷.\n• 탈린 + 리가: 비행기/버스 연계 3박 4일 코스.',
    descriptionEn: '• Tallinn standalone: Weekend 2 nights 3 days via Stockholm overnight ferry (Tallink).\n• Tallinn + Riga: 3 nights 4 days combining flights and buses.',
  },
  {
    id: 'spain-basque',
    region: 'south_baltic',
    regionName: '4. 남유럽 & 발트해/폴란드',
    regionNameEn: '4. Southern Europe, Baltics & Poland',
    name: '스페인 북부',
    nameEn: 'Northern Spain (Basque Country)',
    duration: '3박 4일',
    durationEn: '3 nights 4 days',
    description: '바스크 지방의 산세바스티안(미식/핀초스 투어, 콘차 해변)과 빌바오(구겐하임 미술관).',
    descriptionEn: 'Basque Country highlights: gastronomic pintxos bar tour & La Concha beach in San Sebastián, plus Bilbao Guggenheim Museum.',
  },
  {
    id: 'spain-tenerife',
    region: 'south_baltic',
    regionName: '4. 남유럽 & 발트해/폴란드',
    regionNameEn: '4. Southern Europe, Baltics & Poland',
    name: '스페인 테네리페',
    nameEn: 'Tenerife, Spain',
    duration: '4박 ~ 5박',
    durationEn: '4 ~ 5 nights',
    description: '카나리아 제도의 화산섬. 테이데 국립공원 하이킹, 천연 해수 수영장, 돌고래 투어 등 온화한 겨울 휴양.',
    descriptionEn: 'Canary Islands volcanic jewel: Mt. Teide national park hike, natural sea rock pools, dolphin boat tours, and warm winter getaway.',
  },

  // 5. 지중해 동부 & 북아프리카
  {
    id: 'greece',
    region: 'med_nafrica',
    regionName: '5. 지중해 동부 & 북아프리카',
    regionNameEn: '5. Eastern Med & North Africa',
    name: '그리스',
    nameEn: 'Greece',
    duration: '4박 ~ 5박',
    durationEn: '4 ~ 5 nights',
    description: '아테네(아크로폴리스) + 기암괴석 위 공중 수도원 메테오라 + 델피/수니온 곶.',
    descriptionEn: 'Athens (Acropolis) + surreal cliff-top monasteries of Meteora + Delphi & Cape Sounion.',
  },
  {
    id: 'turkey',
    region: 'med_nafrica',
    regionName: '5. 지중해 동부 & 북아프리카',
    regionNameEn: '5. Eastern Med & North Africa',
    name: '터키 (튀르키예)',
    nameEn: 'Türkiye (Turkey)',
    duration: '5박 ~ 6박',
    durationEn: '5 ~ 6 nights',
    description: '이스탄불(3박, 성 소피아 대성당, 보스포루스 해협) + 카파도키아(2~3박, 괴레메 계곡 및 열기구 투어).',
    descriptionEn: 'Istanbul (3 nights, Hagia Sophia, Bosphorus Strait) + Cappadocia (2-3 nights, Göreme valley & sunrise hot air balloon flight).',
  },
  {
    id: 'egypt',
    region: 'med_nafrica',
    regionName: '5. 지중해 동부 & 북아프리카',
    regionNameEn: '5. Eastern Med & North Africa',
    name: '이집트',
    nameEn: 'Egypt',
    duration: '7박 ~ 9박',
    durationEn: '7 ~ 9 nights',
    description: '카이로(기자 피라미드, 박물관) + 룩소르(왕가의 계곡, 카르나크 신전) + 아스완. (12~1월이 1년 중 가장 쾌적한 여행 적기).',
    descriptionEn: 'Cairo (Pyramids of Giza, Egyptian Museum) + Luxor (Valley of the Kings, Karnak Temple) + Aswan. (Dec~Jan is the most pleasant winter season).',
  },
  {
    id: 'morocco',
    region: 'med_nafrica',
    regionName: '5. 지중해 동부 & 북아프리카',
    regionNameEn: '5. Eastern Med & North Africa',
    name: '모로코',
    nameEn: 'Morocco',
    duration: '6박 ~ 8박',
    durationEn: '6 ~ 8 nights',
    description: '마라케시(야시장, 메디나) + 사하라 사막 2박 3일 투어(메르주가) + 페스 or 셰프샤우엔(파란 마을).',
    descriptionEn: 'Marrakech (night market, Medina) + 2 nights 3 days Sahara Desert tour (Merzouga) + Fes or Chefchaouen (the blue pearl).',
  },

  // 6. 아메리카 대륙
  {
    id: 'usa-east',
    region: 'americas',
    regionName: '6. 아메리카 대륙',
    regionNameEn: '6. Americas',
    name: '미국 (뉴욕 중심 동부)',
    nameEn: 'USA (East Coast / New York)',
    duration: '7박 ~ 9박',
    durationEn: '7 ~ 9 nights',
    description: '맨해튼(타임스스퀘어, 센트럴 파크, 메트로폴리탄 미술관, 브로드웨이), 브루클린, 자유의 여신상.\n비행시간(8~9시간)과 시차 적응을 고려해 최소 7박 이상 권장. (12/18 종강 후 연말 시즌에 적합).',
    descriptionEn: 'Manhattan (Times Square, Central Park, The Met, Broadway), Brooklyn, Statue of Liberty.\n7+ nights recommended considering flight time (8-9h) and jet lag. (Ideal for year-end holidays after finals on Dec 18).',
  },
]

// ⭐️ 친구들에게 제안하는 9가지 테마/코스 아이디어
export interface TravelIdeaRoute {
  id: string
  num: number
  emoji: string
  titleKo: string
  titleEn: string
  tagKo: string
  tagEn: string
  summaryKo: string
  summaryEn: string
  detailsKo: string[]
  detailsEn: string[]
  targetMonthIdx?: number // 연계 추천 월 (0=9월, 1=10월, ...)
  targetDate?: string // 포커스 날짜
}

export const travelIdeaRoutes: TravelIdeaRoute[] = [
  {
    id: 'route-uk',
    num: 1,
    emoji: '🇬🇧',
    titleKo: '영국 & 스코틀랜드 (런던 IN, OUT)',
    titleEn: 'UK & Scotland (London IN/OUT)',
    tagKo: '축구 직관 + 대자연',
    tagEn: 'EPL & Highlands',
    summaryKo: '런던 들어가고 축구 보고 스코틀랜드 구경, 이후 돌아오기',
    summaryEn: 'Fly into London, watch a match, explore Scotland, and return via London',
    detailsKo: [
      '런던 입국 ➔ EPL 축구 경기 직관 & 시내 투어',
      '중세 성곽 도시 요크 경유 ➔ 스코틀랜드 에든버러 성 & 아서스 시트',
      '스카이섬 & 하이랜드(글렌코, 네스호) 대자연 탐방 후 런던 OUT 복귀',
    ],
    detailsEn: [
      'Fly into London ➔ Premier League match & city stroll',
      'Medieval walled city York ➔ Edinburgh Castle & Arthur\'s Seat hike',
      'Isle of Skye & Scottish Highlands epic road trip, then return via London',
    ],
    targetMonthIdx: 1,
    targetDate: '2026-10-13',
  },
  {
    id: 'route-train',
    num: 2,
    emoji: '🚆',
    titleKo: '기차 낭만 여행 (레일로드 횡단)',
    titleEn: 'Continental Scenic Train Journey',
    tagKo: '유레일 / 북유럽➔서유럽',
    tagEn: 'Eurail Corridor',
    summaryKo: '웁살라에서 기차 타고 코펜하겐 -> 함부르크 -> 네덜란드 -> 벨기에',
    summaryEn: 'Train from Uppsala to Copenhagen ➔ Hamburg ➔ Netherlands ➔ Belgium',
    detailsKo: [
      '비행기 대신 유럽 기차(SJ, DSB, DB)로 유럽 대륙을 횡단하는 낭만 코스!',
      '스웨덴 웁살라 출발 ➔ 덴마크 코펜하겐 ➔ 독일 함부르크 항구 야경',
      '암스테르담 운하 및 미술관 ➔ 벨기에 브뤼셀 & 중세 운하 마을 브뤼허',
    ],
    detailsEn: [
      'Scenic overland continental train odyssey without flight hassles!',
      'Uppsala ➔ Copenhagen ➔ Hamburg historic harbor & Speicherstadt',
      'Amsterdam canal belt ➔ Brussels Grand Place & fairy-tale Bruges',
    ],
  },
  {
    id: 'route-east-europe',
    num: 3,
    emoji: '🏰',
    titleKo: '동유럽 여행 (오스트리아·헝가리·체코·슬로바키아)',
    titleEn: 'Central & Eastern Europe Classic',
    tagKo: '★헝가리 친구 접선 예정!',
    tagEn: '★Meet Friend in Hungary!',
    summaryKo: '오스트리아, 헝가리, 체코, 슬로바키아. 이때 헝가리에서는 만나야 하는 친구 있음.',
    summaryEn: 'Austria, Hungary, Czechia, Slovakia. Meeting a good friend in Hungary!',
    detailsKo: [
      '기차(ÖBB/RegioJet)로 직결되는 중동유럽 골든 동선',
      '프라하 카를교 야경 ➔ 빈 합스부르크 궁전 & 미술관 ➔ 브라티슬라바',
      '부다페스트 국회의사당 야경 & 온천 (★헝가리에서 현지 친구와 만날 예정!)',
    ],
    detailsEn: [
      'Direct rail links across four imperial central European capitals',
      'Prague Charles Bridge ➔ Vienna palaces ➔ Bratislava Old Town',
      'Budapest Parliament illuminations & baths (★Meeting a friend in Hungary!)',
    ],
  },
  {
    id: 'route-germany',
    num: 4,
    emoji: '🇩🇪',
    titleKo: '독일 여행 (다양한 도시 & 유연한 연계)',
    titleEn: 'Germany Multi-City Exploration',
    tagKo: '벨기에/체코 이동 시 연계',
    tagEn: 'Flexible Route Links',
    summaryKo: '베를린, 드레스덴, 뮌헨 등 여러 도시를 갈 건데, 벨기에를 갈 때 독일 서부를, 체코를 갈 때 독일 동부를 갈 생각도 있음.',
    summaryEn: 'Berlin, Dresden, Munich, etc. Flexible linking: West Germany with Belgium, East Germany with Czechia.',
    detailsKo: [
      '베를린 현대사/문화, 드레스덴 고전 건축 & 겨울 크리스마스 마켓, 뮌헨 전통',
      '벨기에 갈 때: 쾰른/뒤셀도르프 등 독일 서부를 묶어서 이동',
      '체코 갈 때: 드레스덴/라이프치히 등 독일 동부를 묶어서 이동',
    ],
    detailsEn: [
      'Berlin modern history & culture, Dresden Christmas market, Munich beer halls',
      'When heading to Belgium: link with Western Germany (Cologne/Düsseldorf)',
      'When heading to Czechia: link with Eastern Germany (Dresden/Leipzig)',
    ],
  },
  {
    id: 'route-ancient',
    num: 5,
    emoji: '🏺',
    titleKo: '터키, 그리스, 이집트 (신화와 고대 문명)',
    titleEn: 'Türkiye, Greece & Egypt (Ancient Civilizations)',
    tagKo: '누구든 대환영! (한국/유럽 친구)',
    tagEn: 'All Friends Welcome!',
    summaryKo: '웁살라에서 친해진 친구여도 좋고 한국에서 오는 친구여도 좋음.',
    summaryEn: 'Great with international friends made in Uppsala or friends flying from Korea!',
    detailsKo: [
      '이스탄불 성 소피아/보스포루스 해협 + 카파도키아 일출 열기구 투어',
      '아테네 아크로폴리스 + 기암괴석 위 공중 수도원 메테오라',
      '카이로 기자 피라미드 + 룩소르 왕가의 계곡 (12~1월이 1년 중 가장 쾌적한 여행 적기!)',
      '웁살라에서 사귄 교환학생 친구든, 한국에서 날아올 친구든 누구든 환영!',
    ],
    detailsEn: [
      'Hagia Sophia & Bosphorus in Istanbul + Cappadocia hot air balloon flight',
      'Athens Acropolis + surreal cliff-top monasteries of Meteora',
      'Cairo Great Pyramids + Luxor Valley of the Kings (pleasant winter season)',
      'Open to any friends from Uppsala or friends flying in from Korea!',
    ],
  },
  {
    id: 'route-musical',
    num: 6,
    emoji: '🎭',
    titleKo: '뮤지컬 & 콘서트 문화 투어',
    titleEn: 'World-Class Musicals & Shows',
    tagKo: '런던 / 뉴욕 필수 관람',
    tagEn: 'West End & Broadway',
    summaryKo: '영국이나 미국을 간다면 뮤지컬을 볼 생각이 있음.',
    summaryEn: 'Definitely planning to watch world-class musicals if visiting the UK or US.',
    detailsKo: [
      '영국 런던 웨스트엔드: 오페라의 유령, 레미제라블, 위키드 등 오리지널 시어터 관람',
      '미국 뉴욕 방문 시: 타임스스퀘어 브로드웨이 뮤지컬 및 콘서트 직관',
      '공연/음악을 좋아하는 친구들과 함께 현지 예매 후 문화 예술 투어 즐기기',
    ],
    detailsEn: [
      'London West End: legendary productions of Phantom, Les Misérables, Wicked',
      'New York Broadway: world-famous theater district in Times Square',
      'A memorable experience to share with fellow arts & music lovers',
    ],
  },
  {
    id: 'route-pgw',
    num: 7,
    emoji: '🎮',
    titleKo: '파리게임위크 (Paris Games Week 2026)',
    titleEn: 'Paris Games Week 2026',
    tagKo: '★10/22 ~ 10/25 (수업 없음!)',
    tagEn: '★Oct 22-25 (Zero Classes!)',
    summaryKo: '10/22~10/25까지 진행되는 파리게임위크 구경 갈 생각이 있음.',
    summaryEn: 'Planning to visit Paris Games Week happening between Oct 22 and Oct 25.',
    detailsKo: [
      '유럽 최대 규모의 비디오 게임 박람회 Paris Games Week 참관!',
      '★황금 타이밍: 10/22(목)부터 10/25(일)까지 4일 연속 수업이 전혀 없는 일정!',
      '신작 게임 체험 + 가을 파리 시내(에펠탑, 루브르, 센강) 산책 병행 코스',
    ],
    detailsEn: [
      'One of Europe’s premier video game expos held in Paris!',
      '★Perfect timing: Oct 22 (Thu) to Oct 25 (Sun) has ZERO classes scheduled!',
      'Combine gaming expo excitement with romantic autumn Paris strolls',
    ],
    targetMonthIdx: 1,
    targetDate: '2026-10-22',
  },
  {
    id: 'route-football',
    num: 8,
    emoji: '⚽',
    titleKo: '각종 유럽 축구 경기 직관',
    titleEn: 'Live European Football Matches',
    tagKo: 'EPL / 분데스리가 / UCL',
    tagEn: 'Stadium Passion',
    summaryKo: '유럽에 온 이상 축구 경기 직관을 하고 가고 싶음.',
    summaryEn: 'Since I am in Europe, experiencing live European football in a packed stadium is a must.',
    detailsKo: [
      '영국 프리미어리그(EPL): 런던, 맨체스터, 리버풀 구단 홈경기 직관',
      '독일 분데스리가(바이에른 뮌헨, 도르트문트) 또는 UEFA 챔피언스리그 경기',
      '현지 서포터들의 압도적인 응원 열기와 스타디움 투어 체감하기',
    ],
    detailsEn: [
      'English Premier League (EPL): electric atmospheres in London or Manchester',
      'German Bundesliga or UEFA Champions League evening fixtures',
      'Chanting with local fans and taking historic club stadium tours',
    ],
  },
  {
    id: 'route-easygoing',
    num: 9,
    emoji: '🙋‍♂️',
    titleKo: '기타 등등 (★가면감맨 모드★)',
    titleEn: 'Anything Goes (★"If You Go, I Go!" Mode★)',
    tagKo: '무조건 콜! / 시간만 되면 감',
    tagEn: '100% Down to Travel!',
    summaryKo: '사실 친구랑 가기만 하면 뭘 하든지 좋아하는 가면감맨이라서 시간만 된다면 무조건 감.',
    summaryEn: 'Honestly, I love doing whatever as long as I go with friends! If time aligns, I am 100% in.',
    detailsKo: [
      '어디든 좋은 친구들과 함께라면 200% 즐길 준비 완료!',
      '위 리스트 외에도 "나 이때 여기 갈 건데 같이 갈래?" 제안 대환영!',
      '달력에서 초록색(수업 없음)이나 주황색(온라인 줌) 날짜 보이면 편하게 찔러봐줘!',
    ],
    detailsEn: [
      'Always ready to have a blast anywhere as long as the company is great!',
      'Have another destination in mind? Just invite me: "Want to join me for this?"',
      'Spot green (no class) or orange (Zoom only) days on my calendar? Reach out anytime!',
    ],
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
    routesSectionBadge: '💡 함께 떠날 친구 구함 🙌',
    routesSectionTitle: '이런 코스를 생각 중이야! (여행 코스 & 테마 아이디어보드)',
    routesSectionSubtitle: '친구들에게 나 이때 이런 여행을 갈 생각이 있다고 안내하기 위한 코스들입니다. 일정이 맞거나 관심 있는 코스가 있다면 언제든 편하게 말해줘!',
    routesActionJoin: '이 코스 같이 갈래?',
    routesActionCopied: '공유 링크 복사 완료!',
    routesActionViewCalendar: '달력에서 일정 확인',
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
    routesSectionBadge: '💡 Looking for Travel Buddies 🙌',
    routesSectionTitle: 'Travel Routes & Themes I\'m Considering',
    routesSectionSubtitle: 'Here are the potential trip routes I have in mind to coordinate with friends. If your timing aligns or you\'re interested, let me know anytime!',
    routesActionJoin: 'Want to join this trip?',
    routesActionCopied: 'Share link copied!',
    routesActionViewCalendar: 'View on Calendar',
  },
}

// 5 Months Calendar Config (2026.09 ~ 2027.01)
const calendarMonths = [
  { year: 2026, month: 9, nameKo: '2026년 9월', nameEn: 'September 2026', shortKo: '9월', shortEn: 'Sep', startDay: 2, days: 30 },
  { year: 2026, month: 10, nameKo: '2026년 10월', nameEn: 'October 2026', shortKo: '10월', shortEn: 'Oct', startDay: 4, days: 31 },
  { year: 2026, month: 11, nameKo: '2026년 11월', nameEn: 'November 2026', shortKo: '11월', shortEn: 'Nov', startDay: 0, days: 30 },
  { year: 2026, month: 12, nameKo: '2026년 12월', nameEn: 'December 2026', shortKo: '12월', shortEn: 'Dec', startDay: 2, days: 31 },
  { year: 2027, month: 1, nameKo: '2027년 1월', nameEn: 'January 2027', shortKo: "'27 1월", shortEn: "Jan '27", startDay: 5, days: 31 },
]

const regionFilterTabs = [
  { key: 'all', labelKo: '전체 보기', labelEn: 'All' },
  { key: 'nordic', labelKo: '1. 북유럽/극지방', labelEn: '1. Nordic & Arctic' },
  { key: 'uk', labelKo: '2. 영국/스코틀랜드', labelEn: '2. UK & Scotland' },
  { key: 'central_west', labelKo: '3. 중유럽/서유럽', labelEn: '3. Central & West' },
  { key: 'south_baltic', labelKo: '4. 남유럽/발트/폴란드', labelEn: '4. South & Baltic' },
  { key: 'med_nafrica', labelKo: '5. 지중해동부/북아프리카', labelEn: '5. E.Med & N.Africa' },
  { key: 'americas', labelKo: '6. 아메리카 대륙', labelEn: '6. Americas' },
]

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

  const curT = translations[lang]

  useEffect(() => {
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
    const textToCopy = `[${title}]\n${summary}\n\n👉 여행 일정 보드 확인하기: ${window.location.href}`
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
          label: curT.labelVisited,
          trip,
          bgClass: 'bg-red-50 text-red-950 border-2 border-red-500 shadow-xs dark:bg-red-950/40 dark:text-red-200 dark:border-red-600',
          badgeClass: 'bg-red-600 text-white font-bold dark:bg-red-600 dark:text-white',
          classes,
        }
      } else if (trip.category === 'confirmed') {
        // 확정된 여행: 하늘색
        return {
          type: 'confirmed' as const,
          label: curT.labelConfirmed,
          trip,
          bgClass: 'bg-sky-50 text-sky-950 border-2 border-sky-400 shadow-xs dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-500',
          badgeClass: 'bg-sky-500 text-white font-bold dark:bg-sky-500 dark:text-white',
          classes,
        }
      } else {
        // 고민 중인 여행: 보라색
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

  // Selected date status for inspector
  const dateInfo = useMemo(() => {
    if (!selectedDate) return null
    const dateObj = new Date(selectedDate)
    const dayOfWeek = curT.dayOfWeekNames[dateObj.getDay()]
    const status = getDateStatus(selectedDate)
    return {
      date: selectedDate,
      dayOfWeek,
      ...status,
    }
  }, [selectedDate, showSciComp, lang])

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
                      {Array.from({ length: curMonth.days }).map((_, idx) => {
                        const dayNum = idx + 1
                        const dateStr = `${curMonth.year}-${String(curMonth.month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                        const dayOfWeek = (curMonth.startDay + idx) % 7 // 0=Sun, 1=Mon, ..., 6=Sat
                        const status = getDateStatus(dateStr)
                        const isSelected = selectedDate === dateStr
                        const isToday = dateStr === todayStr
                        const trip = status.trip

                        const destName = trip ? (lang === 'en' ? trip.destinationEn : trip.destination) : ''

                        return (
                          <div
                            key={dateStr}
                            onClick={() => setSelectedDate(dateStr)}
                            className={cn(
                              'h-14 sm:h-20 rounded border p-1 sm:p-1.5 text-xs transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden select-none',
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
                      {(() => {
                        const monthPrefix = `${curMonth.year}-${String(curMonth.month).padStart(2, '0')}`
                        const monthTrips = scheduledTrips.filter(
                          (t) => (t.startDate <= `${monthPrefix}-31` && t.endDate >= `${monthPrefix}-01`)
                        )
                        if (monthTrips.length === 0) {
                          return <div className="text-xs text-zinc-400 py-1">{curT.noTripsThisMonth}</div>
                        }
                        return (
                          <div className="flex flex-col gap-1.5">
                            {monthTrips.map((t) => {
                              const dest = lang === 'en' ? t.destinationEn : t.destination
                              const note = lang === 'en' ? t.noteEn : t.note
                              const isVisited = t.category === 'visited'
                              const isConfirmed = t.category === 'confirmed'
                              return (
                                <div
                                  key={t.id}
                                  onClick={() => setSelectedDate(t.startDate)}
                                  className={cn(
                                    'p-2 rounded-md border text-xs cursor-pointer flex items-center justify-between',
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
                        )
                      })()}
                    </div>

                    {/* 일자별 전체 타임라인 */}
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1 mb-0.5">
                      {curT.agendaClasses} ({curMonth.year}.{curMonth.month})
                    </div>
                    {Array.from({ length: curMonth.days }).map((_, idx) => {
                      const dayNum = idx + 1
                      const dateStr = `${curMonth.year}-${String(curMonth.month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                      const dayOfWeek = (curMonth.startDay + idx) % 7
                      const status = getDateStatus(dateStr)
                      const isSelected = selectedDate === dateStr
                      const isToday = dateStr === todayStr
                      const trip = status.trip

                      return (
                        <div
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={cn(
                            'p-2 rounded-md border text-xs cursor-pointer flex items-center justify-between transition-all',
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
                    'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50/80',
                    'dark:border-zinc-800 dark:bg-[#13161f] dark:hover:border-zinc-700 dark:hover:bg-zinc-850'
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {lang === 'en' ? dest.regionNameEn : dest.regionName}
                    </span>
                    <span className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400 mt-0.5">
                      {lang === 'en' ? dest.nameEn : dest.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
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

        {/* 4. PROPOSED TRAVEL ROUTES & THEMES (이런 코스를 생각 중이야! 박스) */}
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-xs dark:border-zinc-800 dark:bg-[#13161f]">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 mb-2">
                <Sparkles className="size-3.5" />
                <span>{curT.routesSectionBadge}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {curT.routesSectionTitle}
              </h2>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                {curT.routesSectionSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                {travelIdeaRoutes.length} {lang === 'en' ? 'Themes' : '개 테마 코스'}
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
                    'group relative rounded-xl border p-4 transition-all flex flex-col justify-between',
                    'border-zinc-200 bg-zinc-50/50 hover:border-indigo-400 hover:bg-white hover:shadow-md',
                    'dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-500/60 dark:hover:bg-zinc-850/80',
                    route.num === 9 && 'border-amber-300/80 bg-amber-50/40 dark:border-amber-800/60 dark:bg-amber-950/20'
                  )}
                >
                  <div>
                    {/* Top Row: Emoji, Tag Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-2xl leading-none select-none">{route.emoji}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full',
                          route.num === 9
                            ? 'bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-100 font-black'
                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                        )}
                      >
                        {tag}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {title}
                    </h3>

                    {/* Summary Quote */}
                    <div className="mt-2 rounded-md bg-white/90 dark:bg-zinc-800/90 p-2.5 border border-zinc-200/80 dark:border-zinc-700/60 text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-snug">
                      "{summary}"
                    </div>

                    {/* Detail Bullets */}
                    <ul className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5">
                          <span className="text-indigo-500 dark:text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
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
                        className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
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

                    {/* 같이 갈래? 복사 버튼 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyRoute(route)}
                      className={cn(
                        'h-7 px-2 text-[11px] font-bold gap-1 rounded transition-colors',
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
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">
                    {lang === 'en' ? selectedDestination.regionNameEn : selectedDestination.regionName}
                  </span>
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
