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
  isMandatory?: boolean // ⭐️ 필수 참석 여부
}

// 1. 이미 다녀온 여행 (빨간색)
// 2. 확정된 여행 (하늘색)
// 3. 고민 중인 여행 (보라색)
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
    id: 'v-helsinki',
    destination: '핀란드 헬싱키',
    destinationEn: 'Helsinki, Finland',
    startDate: '2026-10-09',
    endDate: '2026-10-11',
    category: 'visited',
    badgeText: '헬싱키 (다녀옴)',
    badgeTextEn: 'Helsinki (Visited)',
    note: '외국인 친구들이랑 (다녀온 여행)',
    noteEn: 'Completed trip with international friends',
  },
  {
    id: 'v-uk-scotland-ireland',
    destination: '영국, 스코틀랜드, 아일랜드',
    destinationEn: 'UK, Scotland & Ireland',
    startDate: '2026-10-14',
    endDate: '2026-10-22',
    category: 'visited',
    badgeText: '영국·스코틀랜드·아일랜드 (다녀옴)',
    badgeTextEn: 'UK, Scotland & Ireland (Visited)',
    note: '런던 시내 및 축구 직관 / 스코틀랜드 대자연 / 아일랜드 더블린 (다녀온 여행)',
    noteEn: 'London & live football, Scotland nature, Ireland Dublin (Completed trip)',
  },
  {
    id: 'v-stockholm-halloween',
    destination: '스톡홀름',
    destinationEn: 'Stockholm',
    startDate: '2026-10-31',
    endDate: '2026-11-01',
    category: 'visited',
    badgeText: '스톡홀름 (다녀옴)',
    badgeTextEn: 'Stockholm (Visited)',
    note: '스톡홀름 할로윈 KPOP 파티 참여 (다녀온 여행)',
    noteEn: 'Stockholm Halloween K-POP party (Completed trip)',
  },
  {
    id: 'v-aurora-trip',
    destination: '트롬쇠, 아비스코, 키루나',
    destinationEn: 'Tromsø, Abisko & Kiruna',
    startDate: '2026-11-05',
    endDate: '2026-11-09',
    category: 'visited',
    badgeText: '트롬쇠·아비스코·키루나 (다녀옴)',
    badgeTextEn: 'Tromsø, Abisko & Kiruna (Visited)',
    note: '트롬쇠, 아비스코, 키루나 오로라 여행 (다녀온 여행)',
    noteEn: 'Northern lights aurora trip: Tromsø, Abisko & Kiruna (Completed trip)',
  },
  {
    id: 'c-gothenburg',
    destination: '예테보리',
    destinationEn: 'Gothenburg',
    startDate: '2026-11-14',
    endDate: '2026-11-15',
    category: 'confirmed',
    badgeText: '예테보리 (확정)',
    badgeTextEn: 'Gothenburg (Confirmed)',
    note: '스웨덴 제2의 도시 예테보리 여행 (확정된 여행)',
    noteEn: 'Weekend trip to Gothenburg, Sweden (Confirmed trip)',
  },
  {
    id: 'c-rovaniemi',
    destination: '핀란드 로바니에미',
    destinationEn: 'Rovaniemi, Finland',
    startDate: '2026-11-19',
    endDate: '2026-11-22',
    category: 'confirmed',
    badgeText: '로바니에미 (확정)',
    badgeTextEn: 'Rovaniemi (Confirmed)',
    note: '한국 친구들과 같이 (확정된 여행)',
    noteEn: 'Trip with Korean friends (Confirmed trip)',
  },
  {
    id: 'c-stockholm-friend',
    destination: '스톡홀름',
    destinationEn: 'Stockholm',
    startDate: '2026-11-26',
    endDate: '2026-11-29',
    category: 'confirmed',
    badgeText: '스톡홀름 (확정)',
    badgeTextEn: 'Stockholm (Confirmed)',
    note: '친구가 스웨덴으로 놀러옴 (확정된 여행)',
    noteEn: 'Friend visiting Sweden (Confirmed trip)',
  },
  // ⭐️ 12월 ~ 1월 고려 중인 여행 (신규 추가)
  {
    id: 'p-xmas-market',
    destination: '크리스마스 마켓',
    destinationEn: 'Christmas Markets',
    startDate: '2026-12-01',
    endDate: '2026-12-09',
    category: 'planned',
    badgeText: '크리스마스 마켓 (고려 중)',
    badgeTextEn: 'Christmas Markets (Considering)',
    note: '유럽 크리스마스 마켓 여행 (고려 중)',
    noteEn: 'European Christmas markets trip (Considering)',
  },
  {
    id: 'p-germany',
    destination: '독일',
    destinationEn: 'Germany',
    startDate: '2026-12-20',
    endDate: '2026-12-23',
    category: 'planned',
    badgeText: '독일 (고려 중)',
    badgeTextEn: 'Germany (Considering)',
    note: '독일 여행 (베를린, 드레스덴, 뮌헨 등 고려 중)',
    noteEn: 'Germany trip (Berlin, Dresden, Munich, etc. Considering)',
  },
  {
    id: 'p-belgium-netherlands',
    destination: '벨기에 + 네덜란드',
    destinationEn: 'Belgium & Netherlands',
    startDate: '2026-12-27',
    endDate: '2026-12-30',
    category: 'planned',
    badgeText: '벨기에·네덜란드 (고려 중)',
    badgeTextEn: 'Belgium & Netherlands (Considering)',
    note: '벨기에 + 네덜란드 연계 여행 (고려 중)',
    noteEn: 'Belgium & Netherlands combined trip (Considering)',
  },
  {
    id: 'p-morocco',
    destination: '모로코',
    destinationEn: 'Morocco',
    startDate: '2027-01-04',
    endDate: '2027-01-09',
    category: 'planned',
    badgeText: '모로코 (고려 중)',
    badgeTextEn: 'Morocco (Considering)',
    note: '모로코 여행 (사하라 사막 및 마라케시, 고려 중)',
    noteEn: 'Morocco trip (Sahara desert & Marrakech, Considering)',
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

// ⭐️ 특별 일정 및 회색 처리 날짜 목록 (12/13 노벨상 강연, 1/26, 1/27, 1/29, 1/31)
export const initialBlockedGrayDates: Record<string, BlockedDateItem> = {
  '2026-12-13': {
    labelKo: '노벨상 강연',
    labelEn: 'Nobel Lecture',
    noteKo: '웁살라 대학교 노벨상 수상자 강연',
    noteEn: 'Nobel Laureate Lectures at Uppsala University',
  },
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
    duration: '2박 3일 (10/9~10/11)',
    durationEn: '2 nights 3 days (Oct 9~11)',
    isConfirmed: true,
    confirmedTagKo: '다녀옴 (10/9~10/11)',
    confirmedTagEn: 'Visited (Oct 9~11)',
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
    duration: '3박 4일 (11/19~11/22)',
    durationEn: '3 nights 4 days (Nov 19~22)',
    isConfirmed: true,
    confirmedTagKo: '확정됨 (11/19~11/22)',
    confirmedTagEn: 'Confirmed (Nov 19~22)',
    description: '산타클로스 빌리지 방문, 북극권 통과 인증, 허스키·순록 썰매, 스노모빌 투어. 크리스마스 시즌(11~12월)에 분위기가 가장 좋습니다.',
    descriptionEn: 'Santa Claus Village, Arctic Circle crossing certificate, husky & reindeer sledding, snowmobile tours. Best during the festive winter season.',
  },
  {
    id: 'tromso',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '노르웨이 트롬쇠',
    nameEn: 'Tromsø, Norway',
    duration: '3박 4일 (11/5~11/9)',
    durationEn: '3 nights 4 days (Nov 5~9)',
    isConfirmed: true,
    confirmedTagKo: '다녀옴 (11/5~11/9 오로라)',
    confirmedTagEn: 'Visited (Nov 5~9 Aurora)',
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
    duration: '2박 ~ 3박 (11/5~11/9)',
    durationEn: '2 ~ 3 nights (Nov 5~9)',
    isConfirmed: true,
    confirmedTagKo: '다녀옴 (11/5~11/9 오로라)',
    confirmedTagEn: 'Visited (Nov 5~9 Aurora)',
    description: '웁살라에서 야간열차(SJ Night Train)로 접근 가능. 구름이 적은 아비스코 국립공원 "블루 홀" 오로라 관측과 키루나 아이스호텔 탐방.',
    descriptionEn: 'Directly accessible from Uppsala via SJ Night Train. Aurora viewing at Abisko National Park "Blue Hole" and tour of the Kiruna Icehotel.',
  },
  {
    id: 'stockholm',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '스웨덴 스톡홀름',
    nameEn: 'Stockholm, Sweden',
    duration: '주말 / 3박 4일 (11/26~11/29)',
    durationEn: 'Weekend / 3N 4D (Nov 26~29)',
    isConfirmed: true,
    confirmedTagKo: '다녀옴(할로윈) / 확정(11/26~11/29)',
    confirmedTagEn: 'Visited(Halloween) / Confirmed(Nov 26~29)',
    description: '감라스탄 구시가지, 바사 박물관, 시청사 및 야경. 할로윈 KPOP 파티(10/31~11/1 다녀옴) 및 한국 친구 방문(11/26~11/29 확정).',
    descriptionEn: 'Gamla Stan, Vasa Museum, City Hall. Halloween K-POP party (Oct 31~Nov 1 visited) and friend visiting Sweden (Nov 26~29 confirmed).',
  },
  {
    id: 'gothenburg',
    region: 'nordic',
    regionName: '1. 북유럽 & 극지방',
    regionNameEn: '1. Nordic & Arctic',
    name: '스웨덴 예테보리',
    nameEn: 'Gothenburg, Sweden',
    duration: '1박 2일 (11/14~11/15)',
    durationEn: '1 night 2 days (Nov 14~15)',
    isConfirmed: true,
    confirmedTagKo: '확정됨 (11/14~11/15)',
    confirmedTagEn: 'Confirmed (Nov 14~15)',
    description: '스웨덴 제2의 항구 도시. 하가(Haga) 역사 지구, 리세베리 놀이공원, 피스케치르카 어시장 등 주말 여행.',
    descriptionEn: 'Sweden\'s vibrant second city. Historic Haga district, Liseberg, Feskekôrka, and scenic canal strolls.',
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

  // 2. 영국 & 스코틀랜드 / 아일랜드
  {
    id: 'uk-scotland-ireland',
    region: 'uk',
    regionName: '2. 영국 & 스코틀랜드 / 아일랜드',
    regionNameEn: '2. UK, Scotland & Ireland',
    name: '영국, 스코틀랜드, 아일랜드 종합 코스',
    nameEn: 'UK, Scotland & Ireland Complete Route',
    duration: '8박 9일 (10/14~10/22)',
    durationEn: '8 nights 9 days (Oct 14~22)',
    isConfirmed: true,
    confirmedTagKo: '다녀옴 (10/14~10/22)',
    confirmedTagEn: 'Visited (Oct 14~22)',
    description: '• 런던 가볍게 보기: 빅벤, 런던아이, 웨스트엔드 등 런던 시내 핵심 명소 산책.\n• 축구 보기: 영국 프리미어리그(EPL) 현지 축구 경기 직관.\n• 스코틀랜드 대자연 구경하기: 에든버러 및 하이랜드/스카이섬 대자연 웅장한 풍경 탐방.\n• 아일랜드 더블린: 아일랜드 문화 및 더블린 시내 탐방.',
    descriptionEn: '• Light London sightseeing: Relaxed stroll around Big Ben, London Eye, and West End.\n• Watch football: Live Premier League match experience in London.\n• Scotland nature sightseeing: Edinburgh Castle, Royal Mile, and scenic Highlands / Isle of Skye tours.\n• Ireland Dublin: Irish culture and Dublin city exploration.',
  },

  // 3. 중유럽 & 서유럽
  {
    id: 'christmas-market',
    region: 'central_west',
    regionName: '3. 중유럽 & 서유럽',
    regionNameEn: '3. Central & Western Europe',
    name: '유럽 크리스마스 마켓 (독일·오스트리아 등)',
    nameEn: 'European Christmas Markets (Germany, Austria, etc.)',
    duration: '8박 9일 (12/1~12/9)',
    durationEn: '8 nights 9 days (Dec 1~9)',
    confirmedTagKo: '고려 중 (12/1~12/9)',
    confirmedTagEn: 'Considering (Dec 1~9)',
    description: '드레스덴, 뉘른베르크, 빈 등 유럽의 환상적인 크리스마스 마켓 투어. 12/10 세미나 시작 전 황금 일정.',
    descriptionEn: 'Enchanting Christmas markets in Dresden, Nuremberg, Vienna, etc. Perfect timing before Dec 10 seminars.',
  },
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
    duration: '3박 4일 (12/20~12/23)',
    durationEn: '3 nights 4 days (Dec 20~23)',
    confirmedTagKo: '고려 중 (12/20~12/23)',
    confirmedTagEn: 'Considering (Dec 20~23)',
    description: '베를린(현대사/문화) + 드레스덴(고전 건축 및 크리스마스 마켓) + 함부르크. 12/18 종강 직후 크리스마스 연휴 전 일정.',
    descriptionEn: 'Berlin (modern history & culture) + Dresden (baroque architecture & Christmas markets) + Hamburg. Right after finals before Christmas.',
  },
  {
    id: 'netherlands-belgium',
    region: 'central_west',
    regionName: '3. 중유럽 & 서유럽',
    regionNameEn: '3. Central & Western Europe',
    name: '네덜란드, 벨기에',
    nameEn: 'Netherlands & Belgium',
    duration: '3박 4일 (12/27~12/30)',
    durationEn: '3 nights 4 days (Dec 27~30)',
    confirmedTagKo: '고려 중 (12/27~12/30)',
    confirmedTagEn: 'Considering (Dec 27~30)',
    description: '암스테르담(운하 및 미술관) ➔ 기차 이동 ➔ 브뤼셀 & 브뤼허(그랑플라스 야경, 중세 운하 마을 브뤼허). 연말 황금 시즌.',
    descriptionEn: 'Amsterdam (canal belt & art museums) ➔ train journey ➔ Brussels & Bruges (Grand Place illuminations & medieval canals). Year-end holiday season.',
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
    duration: '5박 6일 (1/4~1/9)',
    durationEn: '5 nights 6 days (Jan 4~9)',
    confirmedTagKo: '고려 중 (1/4~1/9)',
    confirmedTagEn: 'Considering (Jan 4~9)',
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
    emoji: '🇬🇧🇮🇪',
    titleKo: '영국 · 스코틀랜드 · 아일랜드',
    titleEn: 'UK, Scotland & Ireland',
    tagKo: '10/14 ~ 10/22 (다녀옴)',
    tagEn: 'Oct 14 - 22 (Visited)',
    summaryKo: '런던과 스코틀랜드 대자연을 둘러본 뒤 아일랜드 더블린까지 완주한 코스 (다녀온 여행).',
    summaryEn: 'Explored London and Scottish nature, then completed with Dublin, Ireland (Completed trip).',
    detailsKo: [
      '런던 가볍게 보기 (시내 중심부 및 주요 랜드마크 산책)',
      '축구 보기 (영국 EPL 경기 현장 직관)',
      '스코틀랜드 대자연 구경하기 (에든버러 & 하이랜드/스카이섬)',
      '아일랜드 더블린 탐방 (아일랜드 전통 문화 및 시내 투어)',
    ],
    detailsEn: [
      'Light London walk (central landmarks and casual strolls)',
      'Watch football (live English Premier League match)',
      'Explore Scotland nature (Edinburgh & Highlands/Isle of Skye)',
      'Ireland Dublin exploration (Irish culture & city tour)',
    ],
    targetMonthIdx: 1,
    targetDate: '2026-10-14',
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
    summaryKo: '유럽에 있는 동안 현지 축구 경기 직관. (10/14~10/22 영국 런던 일정 중 EPL 경기 관람 완료)',
    summaryEn: 'Watch a live football match while in Europe. (Completed live EPL match during the London stay)',
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

  // 11월 ~ 12월: TimeEdit 업데이트 (HCI & Fails in Physics)
  { date: '2026-11-04', time: '08:15 - 10:00', course: 'Human-Computer Interaction', room: '80127 Ångström', isZoom: false },
  // w46
  { date: '2026-11-09', time: '08:15 - 10:00', course: 'Human-Computer Interaction', room: '80101, Ångström', isZoom: false },
  { date: '2026-11-09', time: '10:15 - 12:00', course: 'Fails in Physics', room: '80115, Ångström', isZoom: false },
  { date: '2026-11-13', time: '08:15 - 10:00', course: 'Human-Computer Interaction (필수)', room: '4101, Ångström', isZoom: false, isMandatory: true },
  { date: '2026-11-13', time: '15:15 - 17:00', course: 'Human-Computer Interaction', room: '80127, Ångström', isZoom: false },

  // w47
  { date: '2026-11-17', time: '08:15 - 10:00', course: 'Human-Computer Interaction', room: '80127, Ångström', isZoom: false },

  // w48
  { date: '2026-11-24', time: '13:15 - 15:00', course: 'Human-Computer Interaction (필수)', room: '10134, Polhemsalen, Ångström', isZoom: false, isMandatory: true },
  { date: '2026-11-25', time: '08:15 - 10:00', course: 'Human-Computer Interaction', room: '2005, Ångström', isZoom: false },
  { date: '2026-11-27', time: '08:15 - 10:00', course: 'Human-Computer Interaction (필수)', room: '2001, Ångström', isZoom: false, isMandatory: true },

  // w50
  { date: '2026-12-10', time: '13:15 - 15:00', course: 'Human-Computer Interaction (세미나 S1)', room: '2001, Ångström', isZoom: false },
  { date: '2026-12-11', time: '15:15 - 17:00', course: 'Human-Computer Interaction (필수 세미나 S2)', room: '80121, Ångström', isZoom: false, isMandatory: true },

  // 12/13 노벨상 강연
  { date: '2026-12-13', time: '10:00 - 15:00', course: '노벨상 강연 (Nobel Lectures)', room: 'Universitetshuset', isZoom: false, isMandatory: true },

  // w51: Fails in Physics 세미나 (필수 참석)
  { date: '2026-12-14', time: '08:15 - 17:00', course: 'Fails in Physics (필수 세미나)', room: '4006, Ångström', isZoom: false, isMandatory: true },
  { date: '2026-12-15', time: '08:15 - 17:00', course: 'Fails in Physics (필수 세미나)', room: '4006, Ångström', isZoom: false, isMandatory: true },
  { date: '2026-12-16', time: '08:15 - 17:00', course: 'Fails in Physics (필수 세미나)', room: '80115, Ångström', isZoom: false, isMandatory: true },
  { date: '2026-12-17', time: '08:15 - 17:00', course: 'Fails in Physics (필수 세미나)', room: '80115, Ångström', isZoom: false, isMandatory: true },

  // w51: HCI 세미나
  { date: '2026-12-18', time: '08:15 - 10:00', course: 'Human-Computer Interaction (세미나 S3)', room: '2005, Ångström', isZoom: false },
  { date: '2026-12-18', time: '13:15 - 15:00', course: 'Human-Computer Interaction (세미나 S4 · 종강)', room: '80101, Ångström', isZoom: false },

  // ⭐️ 스웨덴 공휴일 (TimeEdit 반영)
  { date: '2026-12-24', time: '종일', course: '크리스마스 이브 (Julafton)', room: '공휴일', isZoom: false },
  { date: '2026-12-25', time: '종일', course: '크리스마스 (Juldagen)', room: '공휴일', isZoom: false },
  { date: '2026-12-26', time: '종일', course: '성 스테파노의 날 (Annandag jul)', room: '공휴일', isZoom: false },
  { date: '2026-12-31', time: '종일', course: '새해 전야 (Nyårsafton)', room: '공휴일', isZoom: false },
  { date: '2027-01-01', time: '종일', course: '신정 (Nyårsdagen)', room: '공휴일', isZoom: false },
  { date: '2027-01-06', time: '종일', course: '주현절 (Trettondedag jul)', room: '공휴일', isZoom: false },
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
  { key: 'uk', labelKo: '2. 영국/스코틀랜드/아일랜드', labelEn: '2. UK, Scotland & Ireland' },
  { key: 'central_west', labelKo: '3. 중유럽/서유럽', labelEn: '3. Central & West' },
  { key: 'south_baltic', labelKo: '4. 남유럽/발트/폴란드', labelEn: '4. South & Baltic' },
  { key: 'med_nafrica', labelKo: '5. 지중해동부/북아프리카', labelEn: '5. E.Med & N.Africa' },
  { key: 'americas', labelKo: '6. 아메리카 대륙', labelEn: '6. Americas' },
]
