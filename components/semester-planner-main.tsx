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
  Globe,
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
]

// 사용자가 제공한 6개 권역, 27개 여행지 목록 (국문 & 영문)
export const travelDestinations: TripDestination[] = [
  // 1. 북유럽 & 극지방 (오로라/겨울)
  {
    id: 'helsinki',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '핀란드 헬싱키',
    nameEn: 'Helsinki, Finland',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '템펠리아우키오 암석교회, 수오멘린나 요새, 사우나 체험, 카페/디자인 투어. 도시가 아담해 2박이면 충분.',
    descriptionEn: 'Rock Church (Temppeliaukio), Suomenlinna fortress, traditional sauna experience, design district & cafes. Compact city ideal for 2 nights.',
  },
  {
    id: 'rovaniemi',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '핀란드 로바니에미 (산타마을)',
    nameEn: 'Rovaniemi, Finland (Santa Village)',
    duration: '2박 ~ 3박',
    durationEn: '2 ~ 3 nights',
    description: '산타클로스 빌리지, 순록/허스키 썰매, 북극권 경계선 통과. 12월 크리스마스 시즌 정취 만끽.',
    descriptionEn: 'Santa Claus Village, reindeer and husky sled rides, crossing the Arctic Circle. Best during December Christmas season.',
  },
  {
    id: 'tromso',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '노르웨이 트롬쇠 (오로라 헌팅)',
    nameEn: 'Tromsø, Norway (Aurora Hunting)',
    duration: '3박 4일',
    durationEn: '3 nights 4 days',
    description: '날씨 변수를 고려해 오로라 투어 기회를 최소 2~3회 확보하기 위한 기본 체류 기간. 피오르 투어 병행.',
    descriptionEn: 'Essential 3 nights to secure at least 2-3 aurora hunting chances despite weather fluctuations. Includes fjord excursions.',
  },
  {
    id: 'abisko-kiruna',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '스웨덴 아비스코/키루나',
    nameEn: 'Abisko & Kiruna, Sweden',
    duration: '2박 ~ 3박',
    durationEn: '2 ~ 3 nights',
    description: '웁살라발 야간열차 활용. 아비스코 국립공원 "블루 홀" 오로라 관측 및 키루나 아이스호텔.',
    descriptionEn: 'Convenient overnight sleeper train from Uppsala. Legendary Abisko "Blue Hole" aurora viewing and Kiruna Icehotel.',
  },
  {
    id: 'iceland',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '아이슬란드 (링로드 남부)',
    nameEn: 'Iceland (South Coast & Ring Road)',
    duration: '5박 ~ 6박',
    durationEn: '5 ~ 6 nights',
    description: '레이캬비크, 골든서클, 남부 빙하 호수(요쿨살론), 검은 모래 해변, 겨울 블루아이스케이브(얼음동굴) 탐험.',
    descriptionEn: 'Reykjavik, Golden Circle, Jökulsárlón glacier lagoon, black sand beaches, and winter blue ice cave exploration.',
  },

  // 2. 영국 & 아일랜드
  {
    id: 'london',
    region: 'uk',
    regionName: '2. 영국 & 아일랜드',
    regionNameEn: '2. UK & Ireland',
    name: '영국 런던 & 근교',
    nameEn: 'London & Surroundings, UK',
    duration: '2박 ~ 3박',
    durationEn: '2 ~ 3 nights',
    description: '시내 산책, 펍 투어, 세븐시스터즈 또는 바스/옥스퍼드 근교 당일치기 중심.',
    descriptionEn: 'City walks, British pub culture, day trips to Seven Sisters cliffs or Bath/Oxford universities.',
  },
  {
    id: 'manchester-liverpool',
    region: 'uk',
    regionName: '2. 영국 & 아일랜드',
    regionNameEn: '2. UK & Ireland',
    name: '영국 맨체스터 / 리버풀',
    nameEn: 'Manchester & Liverpool, UK',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '국립 축구 박물관, 구단 스타디움 투어(올드 트래퍼드/안필드/에티하드), 락/비틀즈 역사 및 로컬 펍 문화 체험.',
    descriptionEn: 'National Football Museum, stadium tours (Old Trafford/Anfield/Etihad), rock/Beatles heritage, and lively local pubs.',
  },
  {
    id: 'york',
    region: 'uk',
    regionName: '2. 영국 & 아일랜드',
    regionNameEn: '2. UK & Ireland',
    name: '영국 요크 (잉글랜드 중부)',
    nameEn: 'York, England',
    duration: '1박 2일',
    durationEn: '1 night 2 days',
    description: '런던-에든버러 기차 이동 중간 기착지. 요크 민스터 대성당, 샴블즈 골목, 로마 성벽 야경.',
    descriptionEn: 'Scenic stopover on the London-Edinburgh railway. York Minster, The Shambles medieval alleys, and Roman walls.',
  },
  {
    id: 'edinburgh',
    region: 'uk',
    regionName: '2. 영국 & 아일랜드',
    regionNameEn: '2. UK & Ireland',
    name: '스코틀랜드 에든버러',
    nameEn: 'Edinburgh, Scotland',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '에든버러 성, 로열 마일, 칼튼 힐 일몰, 아서스 시트 트레킹, 스코치 위스키 체험.',
    descriptionEn: 'Edinburgh Castle, the Royal Mile, Calton Hill sunset, Arthur\'s Seat panoramic hike, and Scotch whisky tasting.',
  },
  {
    id: 'highland-skye',
    region: 'uk',
    regionName: '2. 영국 & 아일랜드',
    regionNameEn: '2. UK & Ireland',
    name: '스코틀랜드 스카이섬 & 하이랜드',
    nameEn: 'Isle of Skye & Highlands, Scotland',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '글렌코 협곡, 네스호, 스카이섬 핵심 트레킹(Old Man of Storr, Quiraing, Cuillin Hills, Neist Point 등).',
    descriptionEn: 'Glencoe valley, Loch Ness, and dramatic Isle of Skye hikes (Old Man of Storr, Quiraing, Neist Point lighthouse).',
  },

  // 3. 중유럽 & 독일
  {
    id: 'prague',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    regionNameEn: '3. Central Europe & Germany',
    name: '체코 프라하',
    nameEn: 'Prague, Czechia',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '프라하 성, 카를교, 구시가 광장 천문시계, 체코 맥주 양조장 투어.',
    descriptionEn: 'Prague Castle, Charles Bridge, Old Town astronomical clock, and authentic Czech beer breweries.',
  },
  {
    id: 'vienna',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    regionNameEn: '3. Central Europe & Germany',
    name: '오스트리아 빈 (비엔나)',
    nameEn: 'Vienna, Austria',
    duration: '2박 ~ 3박',
    durationEn: '2 ~ 3 nights',
    description: '쇤브룬 궁전, 벨베데레 궁전(클림트 키스), 카페 자허/센트럴, 빈 미술사 박물관, 슈테판 대성당.',
    descriptionEn: 'Schönbrunn Palace, Belvedere (Klimt\'s The Kiss), historic cafes (Sacher/Central), and St. Stephen\'s Cathedral.',
  },
  {
    id: 'budapest',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    regionNameEn: '3. Central Europe & Germany',
    name: '헝가리 부다페스트',
    nameEn: 'Budapest, Hungary',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '국회의사당 야경(크루즈), 세체니 온천, 어부의 요새, 루인 펍(Ruin Bar) 문화.',
    descriptionEn: 'Danube Parliament night cruise, Széchenyi Thermal Baths, Fisherman\'s Bastion, and vibrant Ruin Bar scene.',
  },
  {
    id: 'bratislava',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    regionNameEn: '3. Central Europe & Germany',
    name: '슬로바키아 브라티슬라바',
    nameEn: 'Bratislava, Slovakia',
    duration: '당일치기 ~ 1박',
    durationEn: 'Day trip ~ 1 night',
    description: '빈에서 버스/기차로 1시간 거리. 브라티슬라바 성과 구시가지를 반나절에서 1박으로 가볍게 관람.',
    descriptionEn: 'Just 1 hour by train/bus from Vienna. Walkable Old Town and hilltop castle overlooking the Danube.',
  },
  {
    id: 'berlin-dresden',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    regionNameEn: '3. Central Europe & Germany',
    name: '독일 (베를린 / 드레스덴)',
    nameEn: 'Berlin & Dresden, Germany',
    duration: '3박 4일',
    durationEn: '3 nights 4 days',
    description: '베를린 장벽/박물관 섬(2박) + "독일의 피렌체" 드레스덴 구시가지 및 크리스마스 마켓(1박).',
    descriptionEn: 'Berlin Wall & Museum Island (2 nights) + Dresden baroque old town and classic Christmas market (1 night).',
  },
  {
    id: 'munich-bavaria',
    region: 'central',
    regionName: '3. 중유럽 & 독일',
    regionNameEn: '3. Central Europe & Germany',
    name: '독일 (뮌헨 & 바이에른)',
    nameEn: 'Munich & Bavaria, Germany',
    duration: '2박 ~ 3박',
    durationEn: '2 ~ 3 nights',
    description: '마리엔 광장, 영국정원, BMW 박물관, 님펜부르크 궁전. (근교 퓌센 노이슈반슈타인 성 포함 시 3박).',
    descriptionEn: 'Marienplatz, English Garden, BMW Welt, and day trip to fairytale Neuschwanstein Castle in Füssen.',
  },

  // 4. 서유럽 (육로 코스 & 프랑스/스위스)
  {
    id: 'cph-city',
    region: 'west',
    regionName: '4. 서유럽',
    regionNameEn: '4. Western Europe',
    name: '덴마크 코펜하겐',
    nameEn: 'Copenhagen, Denmark',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '뉘하운 운하, 티볼리 공원, 디자인 뮤지엄. (육로 종단 시 함부르크행 기차 환승 거점).',
    descriptionEn: 'Nyhavn waterfront, Tivoli Gardens, Danish design museums, and railway hub toward Hamburg.',
  },
  {
    id: 'hamburg',
    region: 'west',
    regionName: '4. 서유럽',
    regionNameEn: '4. Western Europe',
    name: '독일 함부르크',
    nameEn: 'Hamburg, Germany',
    duration: '1박 2일',
    durationEn: '1 night 2 days',
    description: '슈파이허슈타트(붉은 벽돌 창고군), 엘프필하모니 전망대, 항구 야경.',
    descriptionEn: 'UNESCO Speicherstadt red-brick warehouse district, Elbphilharmonie plaza, and lively port nights.',
  },
  {
    id: 'amsterdam',
    region: 'west',
    regionName: '4. 서유럽',
    regionNameEn: '4. Western Europe',
    name: '네덜란드 암스테르담',
    nameEn: 'Amsterdam, Netherlands',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '운하 크루즈, 반 고흐 미술관, 라익스뮈제움, 요르단 지구 자전거 산책.',
    descriptionEn: 'Canal cruises, Van Gogh Museum, Rijksmuseum, and scenic bike rides through the Jordaan neighborhood.',
  },
  {
    id: 'belgium',
    region: 'west',
    regionName: '4. 서유럽',
    regionNameEn: '4. Western Europe',
    name: '벨기에 (브뤼셀 & 브뤼허)',
    nameEn: 'Brussels & Bruges, Belgium',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '브뤼셀 그랑플라스 야경, 와플/초콜릿, 그리고 동화 같은 중세 운하 도시 브뤼허(Brugge) 당일치기.',
    descriptionEn: 'Grand Place illuminated at night, gourmet waffles & chocolates, plus a day trip to medieval Bruges canals.',
  },
  {
    id: 'mont-saint-michel',
    region: 'west',
    regionName: '4. 서유럽',
    regionNameEn: '4. Western Europe',
    name: '프랑스 몽생미셸 (+파리 근교)',
    nameEn: 'Mont Saint-Michel & Paris Region, France',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '파리 경유 노르망디 이동. 해질녘 물 차오르는 몽생미셸 수도원 갯벌 걷기 및 야경 감상.',
    descriptionEn: 'Normandy coast via Paris. Sunset tidal abbey walk across the bay and magical nocturnal illuminations.',
  },
  {
    id: 'nice-monaco',
    region: 'west',
    regionName: '4. 서유럽',
    regionNameEn: '4. Western Europe',
    name: '프랑스 니스 & 모나코',
    nameEn: 'Nice & Monaco, French Riviera',
    duration: '3박 4일',
    durationEn: '3 nights 4 days',
    description: '니스 해변 프로메나드, 에즈(Èze) 요새 마을, 기차 20분 거리의 카지노와 요트 항구 모나코 당일치기.',
    descriptionEn: 'Promenade des Anglais along the Mediterranean, Èze cliff village, and quick train to glamorous Monaco.',
  },
  {
    id: 'swiss-alps',
    region: 'west',
    regionName: '4. 서유럽',
    regionNameEn: '4. Western Europe',
    name: '스위스 (바젤·루체른·베른·인터라켄)',
    nameEn: 'Switzerland (Basel, Lucerne, Bern, Interlaken)',
    duration: '4박 ~ 5박',
    durationEn: '4 ~ 5 nights',
    description: '바젤 미술관(1박), 루체른 리기 산(1박), 베른 구시가지 및 알프스 멘리헨 하이킹/설경(2박).',
    descriptionEn: 'Basel art scene, Lucerne Mt. Rigi excursion, UNESCO Bern old town, and Jungfrau snowy alpine wonderland.',
  },

  // 5. 남유럽 & 발트해 / 폴란드
  {
    id: 'poland',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    regionNameEn: '5. Southern Europe & Baltic',
    name: '폴란드 그단스크 & 바르샤바',
    nameEn: 'Gdańsk & Warsaw, Poland',
    duration: '3박 4일',
    durationEn: '3 nights 4 days',
    description: '1/22 귀국길 활용. 그단스크 모틀라바 강변/구시가지(2박) + 고속기차 이동 후 바르샤바 왕궁/쇼팽 거리(1박).',
    descriptionEn: 'Gdańsk Motława riverside old town (2 nights) + high-speed train to Warsaw Royal Castle and Chopin walk (1 night).',
  },
  {
    id: 'baltic',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    regionNameEn: '5. Southern Europe & Baltic',
    name: '발트 3국 (탈린/에스토니아 or 리가)',
    nameEn: 'Baltics (Tallinn, Estonia or Riga)',
    duration: '2박 3일',
    durationEn: '2 nights 3 days',
    description: '스톡홀름 밤 페리(탈링크)로 선내 숙박하며 중세 성벽이 그대로 남은 탈린 올드타운 집중 투어.',
    descriptionEn: 'Overnight ferry cruise (Tallink) from Stockholm, exploring the fairy-tale UNESCO medieval walled town of Tallinn.',
  },
  {
    id: 'san-sebastian-bilbao',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    regionNameEn: '5. Southern Europe & Baltic',
    name: '스페인 북부 (산세바스티안 & 빌바오)',
    nameEn: 'Northern Spain (San Sebastián & Bilbao)',
    duration: '3박 4일',
    durationEn: '3 nights 4 days',
    description: '미식의 수도 산세바스티안 핀초스 바 호핑, 콘차 해변, 빌바오 구겐하임 미술관.',
    descriptionEn: 'World-renowned gastronomic pintxos bar hopping in San Sebastián, La Concha bay, and Bilbao Guggenheim Museum.',
  },
  {
    id: 'tenerife',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    regionNameEn: '5. Southern Europe & Baltic',
    name: '스페인 테네리페',
    nameEn: 'Tenerife, Canary Islands',
    duration: '4박 ~ 5박',
    durationEn: '4 ~ 5 nights',
    description: '카나리아 제도의 온화한 섬. 테이데 화산 국립공원, 자연 천연 수영장, 돌고래 투어 및 휴양.',
    descriptionEn: 'Warm subtropical winter getaway. Mt. Teide volcano national park, natural rock ocean pools, and dolphin watching.',
  },
  {
    id: 'greece',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    regionNameEn: '5. Southern Europe & Baltic',
    name: '그리스 (아테네 & 메테오라)',
    nameEn: 'Greece (Athens & Meteora)',
    duration: '4박 ~ 5박',
    durationEn: '4 ~ 5 nights',
    description: '아테네 아크로폴리스, 수니온 곶 일몰, 기암괴석 위 공중 수도원 메테오라.',
    descriptionEn: 'Acropolis of Athens, Cape Sounion sunset, and the surreal cliff-top monasteries of Meteora.',
  },
  {
    id: 'turkey',
    region: 'south',
    regionName: '5. 남유럽 & 발트/폴란드',
    regionNameEn: '5. Southern Europe & Baltic',
    name: '튀르키예 (이스탄불 & 카파도키아)',
    nameEn: 'Türkiye (Istanbul & Cappadocia)',
    duration: '5박 ~ 6박',
    durationEn: '5 ~ 6 nights',
    description: '이스탄불 보스포루스 해협/모스크(3박) + 카파도키아 기암괴석 및 열기구 투어(2박).',
    descriptionEn: 'Historic mosques and Bosphorus Strait in Istanbul (3 nights) + Cappadocia hot air balloon flight over valleys (2 nights).',
  },

  // 6. 대형 장거리 (연말연시 단독 후보)
  {
    id: 'nyc',
    region: 'longhaul',
    regionName: '6. 연말연시 대형장거리',
    regionNameEn: '6. Long-haul (Holiday Season)',
    name: '미국 뉴욕 (동부)',
    nameEn: 'New York City, USA',
    duration: '7박 ~ 9박',
    durationEn: '7 ~ 9 nights',
    description: '록펠러센터 크리스마스트리, 센트럴 파크, 메트로폴리탄 미술관, 브로드웨이 뮤지컬, 타임스스퀘어 새해 카운트다운.',
    descriptionEn: 'Rockefeller Christmas tree, snowy Central Park, The Met, Broadway musicals, and Times Square New Year countdown.',
  },
  {
    id: 'egypt',
    region: 'longhaul',
    regionName: '6. 연말연시 대형장거리',
    regionNameEn: '6. Long-haul (Holiday Season)',
    name: '이집트 (카이로 & 룩소르/아스완)',
    nameEn: 'Egypt (Cairo, Luxor & Aswan)',
    duration: '7박 ~ 9박',
    durationEn: '7 ~ 9 nights',
    description: '카이로 기자 피라미드, 이집트 문명 박물관, 룩소르 왕가의 계곡/카르나크 신전, 나일강 크루즈. 연말연시 쾌적한 겨울 건기 배낭여행.',
    descriptionEn: 'Great Pyramids of Giza, Grand Egyptian Museum, Valley of the Kings, Karnak Temple, and scenic Nile River cruise.',
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
  { key: 'nordic', labelKo: '1. 북유럽/극지방', labelEn: '1. Nordic/Arctic' },
  { key: 'uk', labelKo: '2. 영국/아일랜드', labelEn: '2. UK & Ireland' },
  { key: 'central', labelKo: '3. 중유럽/독일', labelEn: '3. Central Europe' },
  { key: 'west', labelKo: '4. 서유럽', labelEn: '4. Western Europe' },
  { key: 'south', labelKo: '5. 남유럽/발트', labelEn: '5. Southern/Baltic' },
  { key: 'longhaul', labelKo: '6. 대형 장거리', labelEn: '6. Long-haul' },
]

export function SemesterPlannerMain() {
  const [lang, setLang] = useState<Language>('ko')
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0) // 9월 기본으로 시작
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-23')
  const [todayStr, setTodayStr] = useState<string>('2026-09-23')
  const [selectedDestination, setSelectedDestination] = useState<TripDestination | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

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
            <Card className="border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-[#13161f]">
              {/* Calendar Header with Month Selector */}
              <CardHeader className="p-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* 월 선택 박스: 가로 폭을 넉넉히 하고 whitespace-nowrap 적용 */}
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
                    <span className="px-3 text-xs font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap min-w-[110px] text-center shrink-0">
                      {lang === 'en' ? curMonth.nameEn : curMonth.nameKo}
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
                        key={m.year + '-' + m.month}
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
                        {lang === 'en' ? m.shortEn : m.shortKo}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Legend (수업 상태 + 다녀온/확정/고민중 여행) */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded bg-emerald-100 border border-emerald-300" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">{curT.legendFree}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded bg-amber-100 border border-amber-300" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">{curT.legendZoom}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded bg-zinc-200 border border-zinc-300" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">{curT.legendClass}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                    <span className="size-2.5 rounded border-2 border-red-500 bg-red-100" />
                    <span>{curT.legendVisited}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400">
                    <span className="size-2.5 rounded border-2 border-sky-400 bg-sky-100" />
                    <span>{curT.legendConfirmed}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                    <span className="size-2.5 rounded border-2 border-purple-400 bg-purple-100" />
                    <span>{curT.legendPlanned}</span>
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-3">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 pb-1.5 text-center text-xs font-bold text-zinc-500">
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
                    <div key={`empty-${idx}`} className="h-20 rounded border border-transparent bg-zinc-50/20 opacity-30" />
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
                          'h-20 rounded border p-1.5 text-xs transition-all cursor-pointer flex flex-col justify-between relative',
                          status.bgClass,
                          // ⭐️ 오늘 날짜 박스 강조 표시 (선명한 파란색 박스만 적용)
                          isToday && 'border-2 !border-blue-600 shadow-md ring-2 ring-blue-500/40 z-10',
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
                              trip?.category === 'planned' && 'text-purple-800 dark:text-purple-200 font-extrabold',
                              isToday && 'text-blue-700 dark:text-blue-300 font-black'
                            )}
                          >
                            {dayNum}
                          </span>

                          {/* Badge based on trip type or class status */}
                          {trip ? (
                            <span className={cn('text-[9px] font-bold px-1 py-0.2 rounded shadow-2xs truncate max-w-[85px]', status.badgeClass)}>
                              {destName}
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
                                <span className="text-red-700 dark:text-red-300">{curT.tagVisited} ({destName})</span>
                              )}
                              {trip.category === 'confirmed' && (
                                <span className="text-sky-700 dark:text-sky-300">{curT.tagConfirmed} ({destName})</span>
                              )}
                              {trip.category === 'planned' && (
                                <span className="text-purple-700 dark:text-purple-300">{curT.tagPlanned} ({destName})</span>
                              )}
                              {status.classes.length > 0 && (
                                <span className="block text-[9px] font-normal opacity-85">
                                  {curT.classPrefix}{status.classes[0].course.split(' ')[0]}
                                </span>
                              )}
                            </div>
                          ) : status.classes.length > 0 ? (
                            <div className="text-[10px] leading-tight opacity-90 truncate font-medium">
                              {status.classes[0].course.split(' ')[0]} {status.classes.length > 1 && `+${status.classes.length - 1}`}
                            </div>
                          ) : (
                            <div className="text-[10px] text-emerald-700/70 dark:text-emerald-300/70">
                              {dayOfWeek === 0 || dayOfWeek === 6 ? curT.weekend : curT.freeDay}
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
                      🚩 {lang === 'en' ? dateInfo.trip.destinationEn : dateInfo.trip.destination} ({lang === 'en' ? dateInfo.trip.noteEn || 'Visited' : dateInfo.trip.note})
                    </Badge>
                  )}

                  {dateInfo.trip && dateInfo.trip.category === 'confirmed' && (
                    <Badge className="bg-sky-500 text-white font-bold text-[10px]">
                      ✈️ {lang === 'en' ? dateInfo.trip.destinationEn : dateInfo.trip.destination} ({lang === 'en' ? dateInfo.trip.noteEn : dateInfo.trip.note})
                    </Badge>
                  )}

                  {dateInfo.trip && dateInfo.trip.category === 'planned' && (
                    <Badge className="bg-purple-600 text-white font-bold text-[10px]">
                      💡 {lang === 'en' ? dateInfo.trip.destinationEn : dateInfo.trip.destination} ({lang === 'en' ? dateInfo.trip.noteEn : dateInfo.trip.note})
                    </Badge>
                  )}

                  <Badge variant="outline" className={cn('text-[10px] font-bold', dateInfo.badgeClass)}>
                    {dateInfo.label}
                  </Badge>

                  {dateInfo.classes.length > 0 && (
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {curT.classPrefix}{dateInfo.classes.map((c) => `${c.course} (${c.time})`).join(', ')}
                    </span>
                  )}

                  {dateInfo.classes.length === 0 && !dateInfo.trip && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      {curT.inspectorFree}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400 hidden sm:inline">{curT.inspectorClickHelp}</span>
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
