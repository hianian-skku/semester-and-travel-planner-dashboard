// Types and initial datasets for Semester & Travel Planner

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
  isConfirmed?: boolean
  confirmedTagKo?: string
  confirmedTagEn?: string
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

export interface BlockedDateItem {
  labelKo: string
  labelEn: string
  noteKo: string
  noteEn: string
}

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
  targetMonthIdx?: number
  targetDate?: string
}

export interface ClassEvent {
  date: string // YYYY-MM-DD
  time: string
  course: string
  room: string
  isZoom: boolean
}

// 1. 이미 다녀온 여행 (빨간색)
// 2. 확정된 여행 (하늘색): 10/9~10/11 핀란드 헬싱키 (외국인 친구들이랑)
// 3. 고민 중인 여행 (보라색): 10/13~10/24 영국, 스코틀랜드, 프랑스
export const initialScheduledTrips: ScheduledTrip[] = [
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
    destination: '영국, 스코틀랜드, 프랑스',
    destinationEn: 'UK, Scotland & France',
    startDate: '2026-10-13',
    endDate: '2026-10-24',
    category: 'planned',
    badgeText: '영국·스코틀랜드·프랑스 (고민 중)',
    badgeTextEn: 'UK, Scotland & France (Considering)',
    note: '런던 가볍게 보기 / 축구 직관 / 스코틀랜드 대자연 / 파리 게임 위크 / 몽생미셸 당일 투어',
    noteEn: 'Light London tour, football match, Scotland nature, Paris Games Week, Mont Saint-Michel day tour',
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
export const initialBlockedGrayDates: Record<string, BlockedDateItem> = {
  '2027-01-26': { labelKo: '회색 처리', labelEn: 'Unavailable', noteKo: '개인 일정 (여행 불가)', noteEn: 'Personal Schedule (Unavailable)' },
  '2027-01-27': { labelKo: '회색 처리', labelEn: 'Unavailable', noteKo: '개인 일정 (여행 불가)', noteEn: 'Personal Schedule (Unavailable)' },
  '2027-01-29': { labelKo: '회색 처리', labelEn: 'Unavailable', noteKo: '개인 일정 (여행 불가)', noteEn: 'Personal Schedule (Unavailable)' },
  '2027-01-31': { labelKo: '회색 처리', labelEn: 'Unavailable', noteKo: '개인 일정 (여행 불가)', noteEn: 'Personal Schedule (Unavailable)' },
}

// ⭐️ 업데이트된 권역별 여행지 목록 (국문 & 영문)
export const initialTravelDestinations: TripDestination[] = [
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
    isConfirmed: true,
    confirmedTagKo: '확정됨 (10/9~10/11)',
    confirmedTagEn: 'Confirmed (Oct 9~11)',
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

  // 2. 영국 & 스코틀랜드 (프랑스 연계)
  {
    id: 'uk-scotland-france',
    region: 'uk',
    regionName: '2. 영국 & 스코틀랜드 / 프랑스',
    regionNameEn: '2. UK, Scotland & France',
    name: '영국, 스코틀랜드, 프랑스 종합 코스',
    nameEn: 'UK, Scotland & France Complete Route',
    duration: '11박 12일 (10/13~10/24)',
    durationEn: '11 nights 12 days (Oct 13~24)',
    description: '• 런던 가볍게 보기: 빅벤, 런던아이, 웨스트엔드 등 런던 시내 핵심 명소 가볍게 산책.\n• 축구 보기: 영국 프리미어리그(EPL) 현지 축구 경기 직관.\n• 스코틀랜드 대자연 구경하기: 에든버러 및 하이랜드/스카이섬 대자연 웅장한 풍경 탐방.\n• 파리 게임 위크 구경: 유로스타/항공으로 파리 이동 후 Paris Games Week(PGW) 관람.\n• 몽생미셸 당일 투어: 파리에서 출발하는 몽생미셸 수도원 당일치기 투어 연계.',
    descriptionEn: '• Light London sightseeing: Relaxed stroll around Big Ben, London Eye, and West End.\n• Watch football: Live Premier League match experience in London.\n• Scotland nature sightseeing: Edinburgh Castle, Royal Mile, and scenic Highlands / Isle of Skye tours.\n• Paris Games Week: Travel to Paris via Eurostar/flight to visit Paris Games Week (PGW).\n• Mont Saint-Michel day tour: Day excursion to the magical Mont Saint-Michel abbey from Paris.',
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
export const initialTravelIdeaRoutes: TravelIdeaRoute[] = [
  {
    id: 'route-uk',
    num: 1,
    emoji: '🇬🇧🇫🇷',
    titleKo: '영국 · 스코틀랜드 · 프랑스',
    titleEn: 'UK, Scotland & France',
    tagKo: '10/13 ~ 10/24 (11박 12일)',
    tagEn: 'Oct 13 - 24 (11N 12D)',
    summaryKo: '런던과 스코틀랜드 대자연을 둘러본 뒤 프랑스 파리로 이동하여 파리 게임 위크와 몽생미셸 당일 투어까지 완성하는 황금 코스.',
    summaryEn: 'Explore London and Scotland nature, then travel to Paris for Paris Games Week and a Mont Saint-Michel day tour.',
    detailsKo: [
      '런던 가볍게 보기 (시내 중심부 및 주요 랜드마크 산책)',
      '축구 보기 (영국 EPL 경기 현장 직관)',
      '스코틀랜드 대자연 구경하기 (에든버러 & 하이랜드/스카이섬)',
      '파리 게임 위크 구경 (10/22~ 프랑스 최대 게임쇼 PGW)',
      '몽생미셸 당일 투어 (파리 출발 노르망디 대표 명소 투어)',
    ],
    detailsEn: [
      'Light London walk (central landmarks and casual strolls)',
      'Watch football (live English Premier League match)',
      'Explore Scotland nature (Edinburgh & Highlands/Isle of Skye)',
      'Paris Games Week (Oct 22~ major gaming expo in Paris)',
      'Mont Saint-Michel day tour (Normandy iconic abbey from Paris)',
    ],
    targetMonthIdx: 1,
    targetDate: '2026-10-13',
  },
  {
    id: 'route-transit-north',
    num: 2,
    emoji: '🚂',
    titleKo: '북유럽 육로 종단 (네덜란드·벨기에)',
    titleEn: 'Nordic Rail & Transit (Netherlands & Belgium)',
    tagKo: '육로 기차 여행',
    tagEn: 'Rail Transit',
    summaryKo: '웁살라에서 코펜하겐, 함부르크를 거쳐 네덜란드와 벨기에로 이어지는 육로 기차 코스.',
    summaryEn: 'Train from Uppsala through Copenhagen, Hamburg, Netherlands, and Belgium.',
    detailsKo: [
      '웁살라 ➔ 코펜하겐 ➔ 함부르크 기차 이동',
      '네덜란드 (암스테르담 등) 경유',
      '벨기에 (브뤼셀, 브뤼허 등) 이동',
    ],
    detailsEn: [
      'Train route: Uppsala ➔ Copenhagen ➔ Hamburg',
      'Transit through the Netherlands (Amsterdam, etc.)',
      'Transit through Belgium (Brussels, Bruges, etc.)',
    ],
  },
  {
    id: 'route-east-europe',
    num: 3,
    emoji: '🏰',
    titleKo: '동유럽 (오스트리아·헝가리·체코·슬로바키아)',
    titleEn: 'Central & Eastern Europe',
    tagKo: '헝가리 친구 만남',
    tagEn: 'Meeting Friend in Hungary',
    summaryKo: '오스트리아, 헝가리, 체코, 슬로바키아. 헝가리에서 만날 친구 있음.',
    summaryEn: 'Austria, Hungary, Czechia, Slovakia. Planning to meet a friend in Hungary.',
    detailsKo: [
      '빈, 프라하, 브라티슬라바, 부다페스트 연계',
      '기차 이동 중심 동선',
      '헝가리에서 현지 친구 만나는 일정 포함',
    ],
    detailsEn: [
      'Connect Vienna, Prague, Bratislava, and Budapest by rail',
      'Standard rail travel itinerary',
      'Includes schedule to meet a friend in Hungary',
    ],
  },
  {
    id: 'route-germany',
    num: 4,
    emoji: '🇩🇪',
    titleKo: '독일 (도시 연계)',
    titleEn: 'Germany (City Connections)',
    tagKo: '경유 연계 가능',
    tagEn: 'Transit Option',
    summaryKo: '베를린, 드레스덴, 뮌헨 등. 벨기에 갈 때 서부 경유, 체코 갈 때 동부 경유 가능.',
    summaryEn: 'Berlin, Dresden, Munich, etc. Flexible linking with Belgium (West) or Czechia (East).',
    detailsKo: [
      '베를린, 드레스덴, 뮌헨 등 주요 도시',
      '벨기에 방향 이동 시 독일 서부(쾰른 등) 경유',
      '체코 방향 이동 시 독일 동부(드레스덴 등) 경유',
    ],
    detailsEn: [
      'Major cities like Berlin, Dresden, and Munich',
      'Route via Western Germany if traveling toward Belgium',
      'Route via Eastern Germany if traveling toward Czechia',
    ],
  },
  {
    id: 'route-ancient',
    num: 5,
    emoji: '🏺',
    titleKo: '터키, 그리스, 이집트',
    titleEn: 'Türkiye, Greece & Egypt',
    tagKo: '일정 조율 가능',
    tagEn: 'Flexible Schedule',
    summaryKo: '터키, 그리스, 이집트 중 일정 맞는 곳. 웁살라 친구든 한국에서 오는 친구든 가능.',
    summaryEn: 'Visit destinations that fit the schedule. Open to friends from Uppsala or Korea.',
    detailsKo: [
      '터키: 이스탄불, 카파도키아 등',
      '그리스: 아테네, 메테오라 등',
      '이집트: 카이로, 룩소르 등 (겨울 시즌)',
    ],
    detailsEn: [
      'Türkiye: Istanbul, Cappadocia, etc.',
      'Greece: Athens, Meteora, etc.',
      'Egypt: Cairo, Luxor, etc. (winter season)',
    ],
  },
  {
    id: 'route-musical',
    num: 6,
    emoji: '🎭',
    titleKo: '뮤지컬 관람',
    titleEn: 'Musicals & Shows',
    tagKo: '영국 / 미국',
    tagEn: 'UK / US',
    summaryKo: '영국이나 미국 쪽으로 갈 경우 현지에서 뮤지컬 관람.',
    summaryEn: 'Watch musicals if traveling to the UK or the US.',
    detailsKo: [
      '영국 방문 시 런던 웨스트엔드 공연 관람',
      '미국 방문 시 브로드웨이 뮤지컬 관람',
      '공연 일정에 맞춰 예매 진행',
    ],
    detailsEn: [
      'West End shows if visiting London',
      'Broadway shows if visiting New York',
      'Book according to performance schedules',
    ],
  },
  {
    id: 'route-pgw',
    num: 7,
    emoji: '🎮',
    titleKo: '파리게임위크 (Paris Games Week)',
    titleEn: 'Paris Games Week',
    tagKo: '10/22 ~ 10/25',
    tagEn: 'Oct 22 - 25',
    summaryKo: '10/22~10/25 기간에 열리는 파리게임위크 관람. (10/13~10/24 영국·스코틀랜드·프랑스 연계 일정에 포함)',
    summaryEn: 'Visit Paris Games Week held during Oct 22–25. (Included in the Oct 13-24 UK/Scotland/France combined route)',
    detailsKo: [
      '10/22(목) ~ 10/24(토) 파리 체류 중 전시장 관람',
      '파리게임위크 전시장(Paris Expo Porte de Versailles) 방문',
      '몽생미셸 당일 투어 및 파리 시내 일정 병행',
    ],
    detailsEn: [
      'Visit PGW expo during Paris stay between Oct 22-24',
      'Held at Paris Expo Porte de Versailles',
      'Combined with Mont Saint-Michel day tour and Paris sightseeing',
    ],
    targetMonthIdx: 1,
    targetDate: '2026-10-22',
  },
  {
    id: 'route-football',
    num: 8,
    emoji: '⚽',
    titleKo: '유럽 축구 경기 직관',
    titleEn: 'European Football Matches',
    tagKo: 'EPL / 분데스리가 / UCL',
    tagEn: 'EPL / Bundesliga / UCL',
    summaryKo: '유럽에 있는 동안 현지 축구 경기 직관. (10/13~10/24 영국 런던 일정 중 EPL 경기 관람 연계)',
    summaryEn: 'Watch a live football match while in Europe. (Linked with live EPL match during the London stay)',
    detailsKo: [
      '영국 런던 일정 중 프리미어리그(EPL) 홈 경기 직관',
      '경기 일정 및 티켓 상황에 맞춰 예매 진행',
      '챔피언스리그 또는 분데스리가 경기 추가 옵션',
    ],
    detailsEn: [
      'Watch live Premier League (EPL) home game in London',
      'Coordinate bookings based on match schedule and ticket availability',
      'Additional options for Champions League or Bundesliga matches',
    ],
  },
  {
    id: 'route-easygoing',
    num: 9,
    emoji: '🙋‍♂️',
    titleKo: '기타 일정',
    titleEn: 'Other Ideas',
    tagKo: '일정 조율 가능',
    tagEn: 'Flexible',
    summaryKo: '시간 맞으면 어디든 상관없이 같이 갈 수 있음.',
    summaryEn: 'Open to traveling anywhere if schedules align.',
    detailsKo: [
      '위 목록 외 다른 여행지 제안도 가능',
      '달력에서 수업 없는 날이나 줌 수업 날짜 맞춰서 조율',
    ],
    detailsEn: [
      'Open to destinations outside this list',
      'Coordinate based on free days or online Zoom days on calendar',
    ],
  },
]

// 9월 초 시간표를 포함한 전체 TimeEdit 수업 데이터 (2026.09.01 ~ 2027.01.17)
export const initialTimeEditClasses: ClassEvent[] = [
  // ⭐️ 9월 초 (추가 첨부 PDF 반영)
  // w36
  { date: '2026-09-01', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Stuffen, Geocentrum', isZoom: false },
  { date: '2026-09-01', time: '13:15 - 15:00', course: 'Project with XR', room: 'Ångström 11240', isZoom: false },
  { date: '2026-09-02', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Båthsalen, Geocentrum', isZoom: false },
  { date: '2026-09-02', time: '15:15 - 17:00', course: 'Project with XR', room: '101142, Ångström', isZoom: false },
  { date: '2026-09-03', time: '11:00 - 12:00', course: 'Project with XR', room: 'Via Zoom', isZoom: true },
  { date: '2026-09-04', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },

  // w37
  { date: '2026-09-07', time: '08:15 - 10:00', course: 'Applied Geophysics', room: 'Dk235, Geocentrum', isZoom: false },
  { date: '2026-09-07', time: '15:15 - 17:00', course: 'Applied Geophysics', room: 'Norrland II Gm116', isZoom: false },
  { date: '2026-09-08', time: '15:15 - 17:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },
  { date: '2026-09-10', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },
  { date: '2026-09-10', time: '10:30 - 12:00', course: 'Project with XR', room: 'Via Zoom', isZoom: true },
  { date: '2026-09-11', time: '10:15 - 12:00', course: 'Applied Geophysics', room: 'Skåne, Geocentrum', isZoom: false },

  // w38
  { date: '2026-09-14', time: '13:15 - 15:00', course: 'Applied Geophysics', room: 'Norrland I Gm118', isZoom: false },
  { date: '2026-09-15', time: '10:15 - 12:00', course: 'Project with XR', room: 'Via Zoom', isZoom: true },
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
  { date: '2026-10-05', time: '10:15 - 12:00', course: 'Project with XR', room: 'Online (Zoom)', isZoom: true },
  { date: '2026-10-06', time: '10:15 - 12:00', course: 'Project with XR', room: '101136 Ångström', isZoom: false },
  { date: '2026-10-16', time: '13:15 - 16:00', course: 'Project with XR', room: 'Via Zoom', isZoom: true },
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
export const calendarMonths = [
  { year: 2026, month: 9, nameKo: '2026년 9월', nameEn: 'September 2026', shortKo: '9월', shortEn: 'Sep', startDay: 2, days: 30 },
  { year: 2026, month: 10, nameKo: '2026년 10월', nameEn: 'October 2026', shortKo: '10월', shortEn: 'Oct', startDay: 4, days: 31 },
  { year: 2026, month: 11, nameKo: '2026년 11월', nameEn: 'November 2026', shortKo: '11월', shortEn: 'Nov', startDay: 0, days: 30 },
  { year: 2026, month: 12, nameKo: '2026년 12월', nameEn: 'December 2026', shortKo: '12월', shortEn: 'Dec', startDay: 2, days: 31 },
  { year: 2027, month: 1, nameKo: '2027년 1월', nameEn: 'January 2027', shortKo: "'27 1월", shortEn: "Jan '27", startDay: 5, days: 31 },
]

export const regionFilterTabs = [
  { key: 'all', labelKo: '전체 보기', labelEn: 'All' },
  { key: 'nordic', labelKo: '1. 북유럽/극지방', labelEn: '1. Nordic & Arctic' },
  { key: 'uk', labelKo: '2. 영국/스코틀랜드/프랑스', labelEn: '2. UK, Scotland & France' },
  { key: 'central_west', labelKo: '3. 중유럽/서유럽', labelEn: '3. Central & West' },
  { key: 'south_baltic', labelKo: '4. 남유럽/발트/폴란드', labelEn: '4. South & Baltic' },
  { key: 'med_nafrica', labelKo: '5. 지중해동부/북아프리카', labelEn: '5. E.Med & N.Africa' },
  { key: 'americas', labelKo: '6. 아메리카 대륙', labelEn: '6. Americas' },
]
