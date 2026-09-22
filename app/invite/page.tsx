'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Filter,
  Info,
  MapPin,
  Moon,
  Navigation,
  Send,
  Share2,
  Sun,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface DestinationPlan {
  id: string
  region: 'nordic' | 'uk' | 'central' | 'west' | 'south' | 'longhaul'
  regionName: string
  destination: string
  stayDuration: string // 권장 박수
  recommendedPeriod: string // 추천 시기
  timingType: 'weekend' | 'break' | 'post-term' | 'flexible'
  transportFromUppsala: string // 웁살라 출발 이동 방식
  coreReasons: string // 핵심 일정 및 체류 이유
  routeSummary: string // 대략적인 이동 경로
  detailedRouteStops: { step: string; title: string; desc: string }[]
}

// 6개 권역 27개 여행지 데이터 전체 수록
export const travelDestinations: DestinationPlan[] = [
  // 1. 북유럽 & 극지방 (오로라/겨울)
  {
    id: 'helsinki',
    region: 'nordic',
    regionName: '북유럽 & 극지방',
    destination: '핀란드 헬싱키',
    stayDuration: '2박 3일',
    recommendedPeriod: '10월 중순 또는 11월 롱위켄드 (금~일)',
    timingType: 'weekend',
    transportFromUppsala: '스톡홀름 아를란다 ➔ 헬싱키 항공 1시간 또는 바이킹라인 실야라인 밤 페리(16시간)',
    coreReasons: '템펠리아우키오 암석교회, 수오멘린나 요새, 사우나 체험, 카페/디자인 투어. 도시가 아담해 2박이면 충분.',
    routeSummary: '스톡홀름(페리 또는 항공) ➔ 헬싱키 시내 ➔ 수오멘린나 요새 ➔ 사우나 및 디자인 디스트릭트 ➔ 복귀',
    detailedRouteStops: [
      { step: '1일차', title: '헬싱키 도착 & 시내 중심', desc: '중앙역 도착 후 헬싱키 대성당, 우스펜스키 성당, 에스플라나디 공원 산책' },
      { step: '2일차', title: '수오멘린나 & 정통 사우나', desc: '페리 탑승 후 요새 섬 탐방, 로욜라(Löyly) 공공 사우나 체험 및 발트해 입수' },
      { step: '3일차', title: '암석교회 & 디자인 투어 후 복귀', desc: '템펠리아우키오 교회 및 알바 알토 디자인 가구점 투어 후 스톡홀름 복귀' },
    ],
  },
  {
    id: 'rovaniemi',
    region: 'nordic',
    regionName: '북유럽 & 극지방',
    destination: '핀란드 로바니에미 (산타마을)',
    stayDuration: '2박 ~ 3박',
    recommendedPeriod: '12월 초~중순 (크리스마스 시즌 정취)',
    timingType: 'weekend',
    transportFromUppsala: '헬싱키 경유 산타클로스 익스프레스 야간열차 또는 항공 환승',
    coreReasons: '산타클로스 빌리지, 순록/허스키 썰매, 북극권 경계선 통과. 12월 크리스마스 시즌 정취 만끽.',
    routeSummary: '헬싱키 ➔ 로바니에미 야간열차 ➔ 산타마을 ➔ 북극권 액티비티 ➔ 복귀',
    detailedRouteStops: [
      { step: '1일차', title: '북극권 진입 & 산타마을', desc: '로바니에미 도착, 산타클로스 오피스 방문 및 북극권(Arctic Circle) 통과 인증' },
      { step: '2일차', title: '순록·허스키 썰매 & 설원', desc: '숲속 허스키 농장 사파리, 스노모빌 체험 및 밤 오로라 관측' },
      { step: '3일차', title: '아르크티쿰 박물관 후 복귀', desc: '북극권 자연·사미 문화 박물관 관람 후 야간열차 또는 항공편 복귀' },
    ],
  },
  {
    id: 'tromso',
    region: 'nordic',
    regionName: '북유럽 & 극지방',
    destination: '노르웨이 트롬쇠 (오로라 헌팅)',
    stayDuration: '3박 4일',
    recommendedPeriod: '10월 말 ~ 11월 중순 (오로라 시즌)',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 공항 ➔ 트롬쇠 직항/경유 항공 (약 2시간 30분)',
    coreReasons: '날씨 변수를 고려해 오로라 투어 기회를 최소 2~3회 확보하기 위한 기본 체류 기간. 피오르 투어 병행.',
    routeSummary: '트롬쇠 시내 거점 ➔ 야간 오로라 체이싱 투어(2~3회) ➔ 주간 피오르 크루즈/케이블카',
    detailedRouteStops: [
      { step: '1일차', title: '트롬쇠 도착 & 북극 대성당', desc: '공항 도착, 케이블카(Fjellheisen) 탑승하여 트롬쇠 전경 감상 및 1차 오로라 헌팅' },
      { step: '2일차', title: '피오르 보트 투어 & 2차 체이싱', desc: '주간 노르웨이 북부 피오르 절경 탐방, 야간 전문 가이드 오로라 체이싱 투어' },
      { step: '3일차', title: '순록 농장 & 3차 오로라 헌팅', desc: '사미족 순록 먹이주기 체험, 날씨에 따른 마지막 오로라 관측 기회 확보' },
      { step: '4일차', title: '시내 정리 및 스웨덴 복귀', desc: '북극 박물관 관람 및 오후 항공편으로 복귀' },
    ],
  },
  {
    id: 'abisko-kiruna',
    region: 'nordic',
    regionName: '북유럽 & 극지방',
    destination: '스웨덴 아비스코/키루나',
    stayDuration: '2박 ~ 3박',
    recommendedPeriod: '10월 셋째 주 또는 11월 중순',
    timingType: 'weekend',
    transportFromUppsala: '웁살라 중앙역 ➔ 아비스코/키루나 SJ 야간침대열차 직통 (약 15~16시간) 또는 항공 1.5시간',
    coreReasons: '웁살라발 야간열차 활용. 아비스코 국립공원 "블루 홀" 오로라 관측 및 키루나 아이스호텔.',
    routeSummary: '웁살라역 야간열차 탑승 ➔ 아비스코 국립공원 오로라 ➔ 키루나 아이스호텔 ➔ 복귀',
    detailedRouteStops: [
      { step: '1일차', title: '야간열차 탑승', desc: '저녁 웁살라역에서 SJ 침대열차 탑승, 북극권으로 이동' },
      { step: '2일차', title: '아비스코 오로라 스카이스테이션', desc: '아침 도착 후 체크인, 국립공원 하이킹 및 밤 Sky Station 오로라 관측' },
      { step: '3일차', title: '키루나 아이스호텔', desc: '키루나로 이동하여 세계 최초 아이스호텔 투어 및 설산 사우나' },
      { step: '4일차', title: '키루나 공항 항공 복귀', desc: '키루나 공항에서 아를란다행 항공편으로 1시간 40분 만에 복귀' },
    ],
  },
  {
    id: 'iceland',
    region: 'nordic',
    regionName: '북유럽 & 극지방',
    destination: '아이슬란드 (링로드 남부)',
    stayDuration: '5박 ~ 6박',
    recommendedPeriod: '10월 중순 또는 11월 초 (일정 여유 시)',
    timingType: 'break',
    transportFromUppsala: '아를란다 ➔ 레이캬비크(케플라비크) 직항 항공 (약 3시간 15분)',
    coreReasons: '레이캬비크, 골든서클, 남부 빙하 호수(요쿨살론), 검은 모래 해변, 겨울 블루아이스케이브(얼음동굴) 탐험.',
    routeSummary: '케플라비크 공항 렌터카 픽업 ➔ 골든서클 ➔ 비크(남부) ➔ 요쿨살론 빙하 ➔ 블루라군 온천',
    detailedRouteStops: [
      { step: '1~2일차', title: '골든서클 & 남부 폭포', desc: '싱벨리르 국립공원, 게이시르 간헐천, 굴포스 폭포, 셀랸즈포스 탐방' },
      { step: '3~4일차', title: '비크 & 요쿨살론 빙하동굴', desc: '블랙샌드비치, 요쿨살론 빙하호수 유빙 감상, 천연 얼음동굴(Ice Cave) 투어' },
      { step: '5~6일차', title: '레이캬비크 & 블루라군 온천', desc: '수도 레이캬비크 시내 산책, 블루라군 온천 휴식 후 귀국 항공편 탑승' },
    ],
  },

  // 2. 영국 & 아일랜드
  {
    id: 'london',
    region: 'uk',
    regionName: '영국 & 아일랜드',
    destination: '영국 런던 & 근교',
    stayDuration: '2박 ~ 3박',
    recommendedPeriod: '학기 중 금~일 주말 활용',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 런던(LHR/LGW/STN) 직항 항공 2시간 30분 (저비용 항공 다수)',
    coreReasons: '런던 방문 경험이 있는 경우 가벼운 시내 산책, 펍 투어, 세븐시스터즈 또는 바스/옥스퍼드 근교 당일치기 중심.',
    routeSummary: '런던 시내 거점 ➔ 소호/쇼디치 펍 & 미술관 ➔ 옥스퍼드 또는 세븐시스터즈 당일치기',
    detailedRouteStops: [
      { step: '1일차', title: '런던 도심 산책 & 펍', desc: '템스강변, 테이트 모던, 버러마켓, 로컬 브리티시 펍 투어' },
      { step: '2일차', title: '근교 당일치기 (세븐시스터즈/옥스퍼드)', desc: '기차로 1시간 이동하여 하얀 백악절벽 세븐시스터즈 또는 대학도시 옥스퍼드 방문' },
      { step: '3일차', title: '웨스트엔드 뮤지컬 또는 박물관 후 복귀', desc: '문화예술 공연 관람 및 저녁 항공편으로 스웨덴 복귀' },
    ],
  },
  {
    id: 'manchester-liverpool',
    region: 'uk',
    regionName: '영국 & 아일랜드',
    destination: '영국 맨체스터 / 리버풀',
    stayDuration: '2박 3일',
    recommendedPeriod: '주말 프리미어리그(EPL) 경기 일정 연계',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 맨체스터 직항 또는 런던 경유 기차(2시간)',
    coreReasons: '국립 축구 박물관, 구단 스타디움 투어(올드 트래퍼드/안필드/에티하드), 락/비틀즈 역사 및 로컬 펍 문화 체험.',
    routeSummary: '맨체스터 축구 스타디움 ➔ 기차 40분 ➔ 리버풀 앨버트 독 & 비틀즈 스토리 ➔ 펍 투어',
    detailedRouteStops: [
      { step: '1일차', title: '맨체스터 축구 성지순례', desc: '올드 트래퍼드 또는 에티하드 스타디움 투어, 국립 축구 박물관 관람' },
      { step: '2일차', title: '리버풀 당일 또는 1박', desc: '비틀즈 캐번 클럽, 앨버트 독 해양 박물관, 테이트 리버풀 투어' },
      { step: '3일차', title: '북부 로컬 펍 체험 후 복귀', desc: '노던 쿼터 레코드샵 투어 후 맨체스터 공항 출발' },
    ],
  },
  {
    id: 'york',
    region: 'uk',
    regionName: '영국 & 아일랜드',
    destination: '영국 요크 (잉글랜드 중부)',
    stayDuration: '1박 2일',
    recommendedPeriod: '런던-에든버러 기차 이동 중간 경유',
    timingType: 'weekend',
    transportFromUppsala: '런던 킹스크로스역 ➔ 요크 기차 1시간 50분 (에든버러행 노선 중간 위치)',
    coreReasons: '런던-에든버러 기차 이동 중간 기착지. 요크 민스터 대성당, 샴블즈 골목, 로마 성벽 야경.',
    routeSummary: '런던 ➔ 요크역 하차 ➔ 샴블즈 골목 & 요크 민스터 ➔ 성벽 산책 ➔ 에든버러행 기차 환승',
    detailedRouteStops: [
      { step: '1일차', title: '중세 골목 샴블즈 & 요크 민스터', desc: '해리포터 다이애건 앨리 모티브가 된 샴블즈 골목, 영국 최대 고딕 대성당 관람' },
      { step: '2일차', title: '로마 성벽 걷기 & 기차 이동', desc: '보존 상태가 우수한 중세 성벽 한 바퀴 트레킹 후 에든버러 또는 런던행 탑승' },
    ],
  },
  {
    id: 'edinburgh',
    region: 'uk',
    regionName: '영국 & 아일랜드',
    destination: '스코틀랜드 에든버러',
    stayDuration: '2박 3일',
    recommendedPeriod: '10월 중순 또는 11월 주말',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 에든버러 직항 또는 런던 경유 고속기차 LNER (4시간)',
    coreReasons: '에든버러 성, 로열 마일, 칼튼 힐 일몰, 아서스 시트 트레킹, 스코치 위스키 체험.',
    routeSummary: '구시가지 로열 마일 ➔ 에든버러 성 ➔ 칼튼 힐 전망 ➔ 아서스 시트 ➔ 위스키 바',
    detailedRouteStops: [
      { step: '1일차', title: '로열 마일 & 칼튼 힐 일몰', desc: '중세 고딕 감성의 올드타운 산책, 칼튼 힐에 올라 에든버러 전경과 일몰 감상' },
      { step: '2일차', title: '에든버러 성 & 스코치 위스키', desc: '에든버러 성 내부 투어, 정통 스코치 위스키 익스피리언스 시음' },
      { step: '3일차', title: '아서스 시트 언덕 트레킹 후 복귀', desc: '사화산 아서스 시트 정상 트레킹으로 바다와 도시 조망 후 복귀' },
    ],
  },
  {
    id: 'highland-skye',
    region: 'uk',
    regionName: '영국 & 아일랜드',
    destination: '스코틀랜드 스카이섬 & 하이랜드',
    stayDuration: '2박 3일',
    recommendedPeriod: '학기 초(10월) 또는 연휴 기간 권장 (겨울엔 해가 짧음)',
    timingType: 'break',
    transportFromUppsala: '에든버러/인버네스 기점 렌터카 또는 현지 소그룹 3일 투어',
    coreReasons: '글렌코 협곡, 네스호, 스카이섬 핵심 트레킹(Old Man of Storr, Quiraing, Cuillin Hills, Neist Point 등). 이동 거리가 길어 최소 2박 필수.',
    routeSummary: '에든버러 출발 ➔ 글렌코 협곡 ➔ 아일린 도난 성 ➔ 스카이섬 2박(스토르/퀴랑) ➔ 복귀',
    detailedRouteStops: [
      { step: '1일차', title: '하이랜드 진입 & 글렌코', desc: '스카이폴 촬영지 글렌코 웅장한 협곡 통과, 아일린 도난 성 경유하여 스카이섬 입도' },
      { step: '2일차', title: '스카이섬 핵심 트레킹', desc: 'Old Man of Storr 기암괴석 하이킹, 퀴랑(Quiraing) 고원 절경, 네이스트 포인트 등대' },
      { step: '3일차', title: '네스호 경유 에든버러 복귀', desc: '요정의 웅덩이(Fairy Pools) 가벼운 산책 후 네스호를 거쳐 에든버러 복귀' },
    ],
  },

  // 3. 중유럽 & 독일
  {
    id: 'prague',
    region: 'central',
    regionName: '중유럽 & 독일',
    destination: '체코 프라하',
    stayDuration: '2박 3일',
    recommendedPeriod: '10월 가을 또는 12월 크리스마스 마켓',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 프라하 직항 항공 (약 2시간 10분, 유로윙스/노르웨이지안)',
    coreReasons: '프라하 성, 카를교, 구시가 광장 천문시계, 체코 맥주 양조장 투어.',
    routeSummary: '구시가 광장 ➔ 카를교 ➔ 프라하 성 지구 ➔ 말라 스트라나 ➔ 로컬 필스너 양조장',
    detailedRouteStops: [
      { step: '1일차', title: '구시가 광장 & 카를교 야경', desc: '천문시계탑, 틴 성당 관람 후 카를교 위에서 프라하 성 야경 감상' },
      { step: '2일차', title: '프라하 성 & 성 비투스 대성당', desc: '세계 최대 규모 고성 투어, 황금소로 걷기 및 정통 체코 굴라쉬 & 흑맥주' },
      { step: '3일차', title: '스트라호프 수도원 도서관 후 복귀', desc: '수도원 양조장 맥주 시음 및 구시가지 카페 휴식 후 공항 이동' },
    ],
  },
  {
    id: 'vienna',
    region: 'central',
    regionName: '중유럽 & 독일',
    destination: '오스트리아 빈 (비엔나)',
    stayDuration: '2박 ~ 3박',
    recommendedPeriod: '11월~12월 (유럽 최고 수준의 크리스마스 마켓)',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 빈 직항 항공 (약 2시간 20분, 라이언에어/오스트리아항공)',
    coreReasons: '쇤브룬 궁전, 벨베데레 궁전(클림트 키스), 카페 자허/센트럴, 빈 미술사 박물관, 슈테판 대성당.',
    routeSummary: '링슈트라세 구시가 ➔ 슈테판 대성당 ➔ 벨베데레 궁전 ➔ 쇤브룬 궁전 ➔ 아인슈페너 카페',
    detailedRouteStops: [
      { step: '1일차', title: '슈테판 대성당 & 비엔나 커피', desc: '도심 슈테판 성당, 카페 자허 원조 자허토르테, 호프부르크 왕궁 야경' },
      { step: '2일차', title: '벨베데레 & 미술사 박물관', desc: '클림트 <키스> 원작 감상, 세계 3대 미술관 빈 미술사 박물관 관람' },
      { step: '3일차', title: '쇤브룬 궁전 정원 후 복귀', desc: '합스부르크 여름 궁전 투어 및 시청사 광장 산책 후 복귀' },
    ],
  },
  {
    id: 'budapest',
    region: 'central',
    regionName: '중유럽 & 독일',
    destination: '헝가리 부다페스트',
    stayDuration: '2박 3일',
    recommendedPeriod: '11월 또는 12월 (야경 및 온천 최고 시즌)',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 부다페스트 직항 항공 (약 2시간 15분, 위즈에어/라이언에어)',
    coreReasons: '국회의사당 야경(크루즈), 세체니 온천, 어부의 요새, 루인 펍(Ruin Bar) 문화.',
    routeSummary: '어부의 요새 ➔ 부다 왕궁 ➔ 도나우강 야경 크루즈 ➔ 세체니 온천 ➔ 심플라 켑트(루인펍)',
    detailedRouteStops: [
      { step: '1일차', title: '국회의사당 전경 & 유람선 야경', desc: '강변 산책 후 밤 도나우강 크루즈에서 황금빛 국회의사당 야경 감상' },
      { step: '2일차', title: '어부의 요새 & 세체니 온천', desc: '부다 지구 언덕 조망, 오후 세체니 야외 대형 온천에서 피로 회복' },
      { step: '3일차', title: '중앙시장 & 루인 펍 투어 후 복귀', desc: '폐건물을 개조한 독특한 루인 펍 문화 체험 및 로컬 미식 후 복귀' },
    ],
  },
  {
    id: 'bratislava',
    region: 'central',
    regionName: '중유럽 & 독일',
    destination: '슬로바키아 브라티슬라바',
    stayDuration: '당일치기 ~ 1박',
    recommendedPeriod: '빈(Vienna) 여행 시 당일 연계 코스',
    timingType: 'weekend',
    transportFromUppsala: '오스트리아 빈 중앙역에서 버스 또는 기차로 편도 1시간',
    coreReasons: '빈에서 버스/기차로 1시간 거리. 브라티슬라바 성과 구시가지를 반나절에서 1박으로 가볍게 관람.',
    routeSummary: '빈 ➔ 브라티슬라바 성 ➔ 미카엘 문 구시가지 ➔ UFO 다리 전망대 ➔ 빈 복귀',
    detailedRouteStops: [
      { step: '반나절 코스', title: '브라티슬라바 성 & 구시가지', desc: '언덕 위 테이블 거꾸로 놓은 모양의 성 관람, 아기자기한 동상들이 있는 올드타운 산책' },
    ],
  },
  {
    id: 'berlin-dresden',
    region: 'central',
    regionName: '중유럽 & 독일',
    destination: '독일 (베를린 / 드레스덴)',
    stayDuration: '3박 4일',
    recommendedPeriod: '11월 말 ~ 12월 (드레스덴 세계 최고(最古) 크리스마스 마켓)',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 베를린 직항 항공 (1시간 30분) + 베를린-드레스덴 기차 (2시간)',
    coreReasons: '베를린 장벽/박물관 섬(2박) + "독일의 피렌체" 드레스덴 구시가지 및 크리스마스 마켓(1박).',
    routeSummary: '베를린 2박 (역사/클럽/미술관) ➔ 기차 2시간 ➔ 드레스덴 1박 (성모교회/군주의행렬)',
    detailedRouteStops: [
      { step: '1~2일차', title: '베를린 역사 & 현대 문화', desc: '이스트사이드 갤러리 장벽, 브란덴부르크 문, 박물관 섬, 크로이츠베르크 카페' },
      { step: '3일차', title: '드레스덴 바로크 건축 & 마켓', desc: '츠빙거 궁전, 프라우엔교회, 1434년부터 이어진 슈트리첼마르크트 크리스마스 마켓' },
      { step: '4일차', title: '엘베강 산책 후 베를린 복귀', desc: '브륄의 테라스 조망 후 베를린 공항 경유 스웨덴 복귀' },
    ],
  },
  {
    id: 'munich-bavaria',
    region: 'central',
    regionName: '중유럽 & 독일',
    destination: '독일 (뮌헨 & 바이에른)',
    stayDuration: '2박 ~ 3박',
    recommendedPeriod: '10월 또는 12월 겨울 설경',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 뮌헨 직항 항공 (약 2시간 15분)',
    coreReasons: '마리엔 광장, 영국정원, BMW 박물관, 님펜부르크 궁전. (근교 퓌센 노이슈반슈타인 성 포함 시 3박).',
    routeSummary: '뮌헨 시내 (학센 & 1리터 맥주) ➔ 당일치기 퓌센 노이슈반슈타인 성 ➔ BMW 벨트',
    detailedRouteStops: [
      { step: '1일차', title: '마리엔 광장 & 호프브로이하우스', desc: '신시청사 인형 시계, 영국정원 산책, 유서 깊은 독일 바이에른 맥주홀' },
      { step: '2일차', title: '퓌센 디즈니 성(노이슈반슈타인)', desc: '기차로 2시간 이동하여 알프스 산자락 아래 눈 덮인 백조의 성 관람' },
      { step: '3일차', title: 'BMW 박물관 & 님펜부르크 궁전', desc: '독일 자동차 공학의 정수 BMW 벨트 투어 후 공항 이동' },
    ],
  },

  // 4. 서유럽 (육로 코스 & 프랑스/스위스)
  {
    id: 'cph-city',
    region: 'west',
    regionName: '서유럽 (육로/프랑스/스위스)',
    destination: '덴마크 코펜하겐',
    stayDuration: '2박 3일',
    recommendedPeriod: '11월 롱위켄드 (금~일)',
    timingType: 'weekend',
    transportFromUppsala: '스톡홀름 ➔ 코펜하겐 SJ 고속열차 직통 5시간 또는 항공 1시간 10분',
    coreReasons: '뉘하운 운하, 티볼리 공원, 디자인 뮤지엄. (육로 종단 시 함부르크행 기차 환승 거점).',
    routeSummary: '뉘하운 운하 ➔ 루이지애나 미술관 ➔ 티볼리 가든 ➔ 디자인 뮤지엄',
    detailedRouteStops: [
      { step: '1일차', title: '뉘하운 & 스트뢰에 거리', desc: '컬러풀한 뉘하운 운하 산책, 덴마크 왕립 도서관(블랙 다이아몬드)' },
      { step: '2일차', title: '루이지애나 현대미술관', desc: '바다가 보이는 세계적인 현대미술관 방문 및 티볼리 가든 야경' },
      { step: '3일차', title: '베이커리 카페 투어 후 복귀', desc: '하트 베이커리 등 정통 데니쉬 페이스트리 투어 후 기차/항공 복귀' },
    ],
  },
  {
    id: 'hamburg',
    region: 'west',
    regionName: '서유럽 (육로/프랑스/스위스)',
    destination: '독일 함부르크',
    stayDuration: '1박 2일',
    recommendedPeriod: '코펜하겐-독일 육로 이동 중간 경유지',
    timingType: 'weekend',
    transportFromUppsala: '코펜하겐에서 유레일/ICE 기차로 4시간 30분',
    coreReasons: '슈파이허슈타트(붉은 벽돌 창고군), 엘프필하모니 전망대, 항구 야경.',
    routeSummary: '유네스코 슈파이허슈타트 창고군 ➔ 엘프필하모니 콘서트홀 ➔ 항구 유람선',
    detailedRouteStops: [
      { step: '1박 2일 코스', title: '항구 도시 건축 기행', desc: '세계 최대 창고 지구 붉은 벽돌길 야경, 파도 모양의 현대 건축 엘프필하모니 플라자 조망' },
    ],
  },
  {
    id: 'amsterdam',
    region: 'west',
    regionName: '서유럽 (육로/프랑스/스위스)',
    destination: '네덜란드 암스테르담',
    stayDuration: '2박 3일',
    recommendedPeriod: '10월 또는 11월 주말',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 암스테르담 스키폴 직항 항공 (약 2시간 10분)',
    coreReasons: '운하 크루즈, 반 고흐 미술관, 라익스뮈제움, 요르단 지구 자전거 산책.',
    routeSummary: '암스테르담 중앙역 ➔ 운하 보트 ➔ 미술관 지구(고흐/국립) ➔ 요르단 지구 카페',
    detailedRouteStops: [
      { step: '1일차', title: '운하 크루즈 & 도심 산책', desc: '운하를 따라 펼쳐지는 17세기 네덜란드 건축 감상 및 담 광장' },
      { step: '2일차', title: '반 고흐 미술관 & 라익스뮈제움', desc: '고흐 걸작 원작 관람, 렘브란트 <야경> 관람 및 자전거 라이딩' },
      { step: '3일차', title: '요르단 지구 & 꽃 시장 후 복귀', desc: '감성 골목 요르단 지구 플랫화이트 카페 투어 후 공항 이동' },
    ],
  },
  {
    id: 'belgium',
    region: 'west',
    regionName: '서유럽 (육로/프랑스/스위스)',
    destination: '벨기에 (브뤼셀 & 브뤼허)',
    stayDuration: '2박 3일',
    recommendedPeriod: '11월 또는 12월',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 브뤼셀 직항 항공 (약 2시간 15분)',
    coreReasons: '브뤼셀 그랑플라스 야경, 와플/초콜릿, 그리고 동화 같은 중세 운하 도시 브뤼허(Brugge) 당일치기.',
    routeSummary: '브뤼셀 1박 (그랑플라스/와플) ➔ 기차 1시간 ➔ 브뤼허 1박 (중세 운하 & 벨기에 맥주)',
    detailedRouteStops: [
      { step: '1일차', title: '브뤼셀 그랑플라스 & 미식', desc: '빅토르 위고가 격찬한 황금빛 광장 야경, 벨기에 와플 & 감자튀김 & 수도원 맥주' },
      { step: '2일차', title: '동화 마을 브뤼허(Brugge)', desc: '기차로 1시간 이동, 중세 백조 운하 보트 투어, 레이스 상점가 및 종탑' },
      { step: '3일차', title: '초콜릿 공방 투어 후 복귀', desc: '고급 수제 초콜릿 숍 쇼핑 후 브뤼셀 공항에서 복귀' },
    ],
  },
  {
    id: 'mont-saint-michel',
    region: 'west',
    regionName: '서유럽 (육로/프랑스/스위스)',
    destination: '프랑스 몽생미셸 (+파리 근교)',
    stayDuration: '2박 3일',
    recommendedPeriod: '10월 또는 11월',
    timingType: 'weekend',
    transportFromUppsala: '파리(CDG/ORY) 항공 ➔ 몽파르나스역 TGV + 전용 셔틀버스 (약 3시간)',
    coreReasons: '파리 경유 노르망디 이동. 해질녘 물 차오르는 몽생미셸 수도원 갯벌 걷기 및 야경 감상.',
    routeSummary: '파리 도착 ➔ TGV 렌(Rennes) 경유 ➔ 몽생미셸 섬 내 숙박(야경) ➔ 파리 경유 복귀',
    detailedRouteStops: [
      { step: '1일차', title: '파리 경유 몽생미셸 이동', desc: '기차와 셔틀을 이용해 노르망디 해안 도착, 일몰 시 물이 차오르는 수도원 감상' },
      { step: '2일차', title: '천년의 수도원 내부 탐방', desc: '조수 간만의 차가 만들어내는 신비로운 바위섬 수도원 골목과 성당 투어' },
      { step: '3일차', title: '파리 시내 잠깐 산책 후 복귀', desc: '파리로 복귀하여 센강변 산책 후 저녁 항공편 복귀' },
    ],
  },
  {
    id: 'nice-monaco',
    region: 'west',
    regionName: '서유럽 (육로/프랑스/스위스)',
    destination: '프랑스 니스 & 모나코',
    stayDuration: '3박 4일',
    recommendedPeriod: '10월 중순 (지중해의 따뜻한 가을 날씨)',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 니스 코트다쥐르 직항 항공 (약 3시간 10분, 노르웨이지안/SAS)',
    coreReasons: '니스 해변 프로메나드, 에즈(Èze) 요새 마을, 기차 20분 거리의 카지노와 요트 항구 모나코 당일치기.',
    routeSummary: '니스 해변 거점 ➔ 에즈(Èze) 절벽 마을 ➔ 모나코 당일치기 ➔ 니스 샤갈 미술관',
    detailedRouteStops: [
      { step: '1일차', title: '니스 영국인 산책로(Promenade)', desc: '지중해 에메랄드빛 바다 산책, 살레야 광장 꽃시장, 니스 전망대' },
      { step: '2일차', title: '중세 절벽 마을 에즈(Èze)', desc: '절벽 위 선인장 정원에서 바라보는 환상적인 지중해 파노라마' },
      { step: '3일차', title: '부국 모나코 당일치기', desc: '기차로 20분 이동, 몬테카를로 카지노 광장, 호화 요트 항구 투어' },
      { step: '4일차', title: '샤갈 미술관 후 복귀', desc: '마티스/샤갈 미술관 관람 후 니스 공항 출발' },
    ],
  },
  {
    id: 'swiss-alps',
    region: 'west',
    regionName: '서유럽 (육로/프랑스/스위스)',
    destination: '스위스 (바젤·루체른·베른·인터라켄)',
    stayDuration: '4박 ~ 5박',
    recommendedPeriod: '12월 말 크리스마스 방학 또는 10월 초',
    timingType: 'break',
    transportFromUppsala: '아를란다 ➔ 취리히/제네바/바젤 직항 항공 (2시간 30분) + 스위스패스 기차',
    coreReasons: '바젤 미술관(1박), 루체른 리기 산(1박), 베른 구시가지 및 알프스 멘리헨 하이킹/설경(2박).',
    routeSummary: '바젤 도착 ➔ 루체른 카펠교 & 리기산 ➔ 인터라켄 융프라우요흐 설경 ➔ 수도 베른',
    detailedRouteStops: [
      { step: '1일차', title: '바젤 예술 기행', desc: '라인강변 바젤 미술관 투어 후 스위스 기차 타고 루체른 이동' },
      { step: '2일차', title: '루체른 & 리기산(산들의 여왕)', desc: '유람선과 산악열차로 리기쿨룸 정상 등정 후 알프스 파노라마 감상' },
      { step: '3~4일차', title: '인터라켄 & 융프라우/그린델발트', desc: '설산 마을 그린델발트, 융프라우요흐 만년설 빙하 관람 및 썰매 체험' },
      { step: '5일차', title: '스위스 수도 베른 경유 복귀', desc: '유네스코 구시가지 곰 공원 산책 후 취리히 공항 출발' },
    ],
  },

  // 5. 남유럽 & 발트해 / 폴란드
  {
    id: 'poland',
    region: 'south',
    regionName: '남유럽 & 발트해 / 폴란드',
    destination: '폴란드 그단스크 & 바르샤바',
    stayDuration: '3박 4일',
    recommendedPeriod: '1/22 귀국길 활용 (학기 종강 직후 최적)',
    timingType: 'post-term',
    transportFromUppsala: '스톡홀름 ➔ 그단스크 초저가 항공(1시간) 또는 페리 ➔ 바르샤바 고속열차(2시간)',
    coreReasons: '1/22 귀국길 활용. 그단스크 모틀라바 강변/구시가지(2박) + 고속기차 이동 후 바르샤바 왕궁/쇼팽 거리(1박).',
    routeSummary: '스톡홀름 ➔ 그단스크 2박 (호박 거리 & 모틀라바 강) ➔ 기차 ➔ 바르샤바 1박 (쇼팽 & 귀국)',
    detailedRouteStops: [
      { step: '1~2일차', title: '발트해 항구 도시 그단스크', desc: '모틀라바 강변 구시가지, 아름다운 마리아츠카 호박 보석 거리, 가성비 뛰어난 폴란드 미식' },
      { step: '3~4일차', title: '수도 바르샤바 & 쇼팽 거리', desc: '펜돌리노 고속기차로 2시간 이동, 복원된 바르샤바 구시가지 왕궁 광장 투어 후 인천행 귀국편 연계' },
    ],
  },
  {
    id: 'baltic',
    region: 'south',
    regionName: '남유럽 & 발트해 / 폴란드',
    destination: '발트 3국 (탈린/에스토니아 or 리가)',
    stayDuration: '2박 3일',
    recommendedPeriod: '학기 중 가벼운 주말 여행 (금~일)',
    timingType: 'weekend',
    transportFromUppsala: '스톡홀름 선착장 ➔ 탈린 탈링크 실야(Tallink Silja) 야간 크루즈 페리 (선내 1박)',
    coreReasons: '스톡홀름 밤 페리(탈링크)로 선내 숙박하며 중세 성벽이 그대로 남은 탈린 올드타운 집중 투어.',
    routeSummary: '스톡홀름 페리 승선 ➔ 선내 뷔페 & 숙박 ➔ 아침 탈린 입항 ➔ 올드타운 투어 ➔ 복귀 페리/항공',
    detailedRouteStops: [
      { step: '1일차', title: '탈링크 야간 크루즈 탑승', desc: '저녁 스톡홀름 페리 터미널에서 탑승. 발트해 크루즈 선내 면세점 및 숙박' },
      { step: '2일차', title: '탈린 중세 올드타운', desc: '아침 탈린 항구 도착, 알렉산더 넵스키 대성당, 톰페아 언덕 전망대, 중세 펍 올데 한사' },
      { step: '3일차', title: '카드리오르그 궁전 후 복귀', desc: '러시아 황실 궁전 정원 산책 후 헬싱키행 고속페리(2시간) 또는 항공 복귀' },
    ],
  },
  {
    id: 'san-sebastian-bilbao',
    region: 'south',
    regionName: '남유럽 & 발트해 / 폴란드',
    destination: '스페인 북부 (산세바스티안 & 빌바오)',
    stayDuration: '3박 4일',
    recommendedPeriod: '10월 중순 또는 11월',
    timingType: 'weekend',
    transportFromUppsala: '아를란다 ➔ 빌바오 공항 경유 항공 + 전용 버스 1시간',
    coreReasons: '미식의 수도 산세바스티안 핀초스 바 호핑, 콘차 해변, 빌바오 구겐하임 미술관.',
    routeSummary: '빌바오 구겐하임 1박 ➔ 버스 1시간 ➔ 산세바스티안 2박 (핀초스 골목 & 콘차 해변)',
    detailedRouteStops: [
      { step: '1일차', title: '빌바오 구겐하임 미술관', desc: '프랭크 게리가 설계한 티타늄 외관의 현대 미술관 투어 및 바스크 타파스' },
      { step: '2~3일차', title: '산세바스티안 핀초스 호핑', desc: '세계 최고 밀도의 미슐랭 및 바 골목 탐방, 콘차 조개껍질 해변 산책' },
      { step: '4일차', title: '빌바오 공항 복귀', desc: '스페인 북부 미식 기념품 쇼핑 후 공항 이동' },
    ],
  },
  {
    id: 'tenerife',
    region: 'south',
    regionName: '남유럽 & 발트해 / 폴란드',
    destination: '스페인 테네리페',
    stayDuration: '4박 ~ 5박',
    recommendedPeriod: '11월 말 또는 12월 (연중 22도의 봄 날씨)',
    timingType: 'break',
    transportFromUppsala: '아를란다 ➔ 테네리페 남부(TFS) 직항/경유 항공 (약 5시간 30분, 겨울철 인기)',
    coreReasons: '카나리아 제도의 온화한 섬. 테이데 화산 국립공원, 자연 천연 수영장, 돌고래 투어 및 휴양.',
    routeSummary: '테네리페 공항 렌터카 ➔ 테이데 화산 분화구 ➔ 로스히간테스 절벽 ➔ 천연 해수풀',
    detailedRouteStops: [
      { step: '1~2일차', title: '테이데 화산 국립공원', desc: '스페인 최고봉(3,718m) 화산 지대 케이블카 등정 및 화성 같은 풍경 감상' },
      { step: '3~4일차', title: '해양 돌고래 사파리 & 휴양', desc: '대서양 야생 돌고래 요트 투어, 가라치코 천연 용암 수영장' },
      { step: '5일차', title: '따뜻한 온천욕 후 복귀', desc: '겨울 추위를 잊게 하는 온화한 섬 휴양 후 스웨덴 복귀' },
    ],
  },
  {
    id: 'greece',
    region: 'south',
    regionName: '남유럽 & 발트해 / 폴란드',
    destination: '그리스 (아테네 & 메테오라)',
    stayDuration: '4박 ~ 5박',
    recommendedPeriod: '10월 가을 (쾌적한 기온과 파란 하늘)',
    timingType: 'break',
    transportFromUppsala: '아를란다 ➔ 아테네 직항 항공 (약 3시간 40분)',
    coreReasons: '아테네 아크로폴리스, 수니온 곶 일몰, 기암괴석 위 공중 수도원 메테오라.',
    routeSummary: '아테네 2박 ➔ 기차 4시간 ➔ 칼람바카(메테오라) 2박 ➔ 아테네 복귀',
    detailedRouteStops: [
      { step: '1~2일차', title: '고대 문명의 요람 아테네', desc: '파르테논 신전, 아크로폴리스 박물관, 플라카 지구 골목길' },
      { step: '3~4일차', title: '공중 수도원 메테오라', desc: '깎아지른 바위산 꼭대기에 세워진 6대 그리스 정교회 수도원 경이로운 풍경' },
      { step: '5일차', title: '수니온 곶 포세이돈 신전 후 복귀', desc: '에게해를 내려다보는 신전 일몰 조망 후 아테네 공항 출발' },
    ],
  },
  {
    id: 'turkey',
    region: 'south',
    regionName: '남유럽 & 발트해 / 폴란드',
    destination: '튀르키예 (이스탄불 & 카파도키아)',
    stayDuration: '5박 ~ 6박',
    recommendedPeriod: '10월 중순 또는 11월',
    timingType: 'break',
    transportFromUppsala: '아를란다 ➔ 이스탄불 직항 항공 (약 3시간 30분, 터키항공/페가수스)',
    coreReasons: '이스탄불 보스포루스 해협/모스크(3박) + 카파도키아 기암괴석 및 열기구 투어(2박).',
    routeSummary: '이스탄불 3박 (술탄아흐멧 & 보스포루스) ➔ 국내선 1시간 ➔ 카파도키아 2박 (열기구 & 괴레메)',
    detailedRouteStops: [
      { step: '1~2일차', title: '이스탄불 동서양의 교차로', desc: '아야 소피아, 블루 모스크, 톱카프 궁전, 그랜드 바자르 시장' },
      { step: '3일차', title: '보스포루스 크루즈 & 카파도키아 이동', desc: '유럽과 아시아 경계 해협 유람 후 카이세리 공항으로 국내선 이동' },
      { step: '4~5일차', title: '카파도키아 열기구 & 지하도시', desc: '일출 열기구 탑승하여 기암괴석 파노라마 조망, 데린쿠유 지하도시 탐험' },
      { step: '6일차', title: '동굴 호텔 체크아웃 후 귀환', desc: '이스탄불 경유 스웨덴 복귀' },
    ],
  },

  // 6. 대형 장거리 (연말연시 단독 후보)
  {
    id: 'nyc',
    region: 'longhaul',
    regionName: '대형 장거리 (연말연시 단독)',
    destination: '미국 뉴욕 (동부)',
    stayDuration: '7박 ~ 9박',
    recommendedPeriod: '12월 22일 ~ 1월 3일 (겨울방학 골든타임)',
    timingType: 'break',
    transportFromUppsala: '아를란다 ➔ 뉴욕(JFK/EWR) 직항 항공 (약 8시간 30분, SAS/유나이티드)',
    coreReasons: '록펠러센터 크리스마스트리, 센트럴 파크, 메트로폴리탄 미술관, 브로드웨이 뮤지컬, 타임스스퀘어 새해 카운트다운. 시차와 비행시간 감안 최소 7박 이상 권장.',
    routeSummary: '맨해튼 중심 거점 ➔ 미드타운 & 록펠러 ➔ 브루클린 브릿지 ➔ 메트/모마 ➔ 카운트다운',
    detailedRouteStops: [
      { step: '1~2일차', title: '미드타운 크리스마스 정취', desc: '록펠러센터 대형 트리, 5번가 백화점 홀리데이 쇼윈도, 센트럴 파크 눈 산책' },
      { step: '3~4일차', title: '세계적인 미술관 & 브로드웨이', desc: '메트로폴리탄 박물관, MoMA 현대미술관, 브로드웨이 라이온킹/위키드 관람' },
      { step: '5~6일차', title: '다운타운 & 브루클린', desc: '월스트리트, 원월드 전망대, 브루클린 브릿지 도보 횡단 및 덤보 포토존' },
      { step: '7~8일차', title: '타임스스퀘어 새해 맞이 & 쇼핑', desc: '뉴욕의 새해 카운트다운 열기, 소호 쇼핑 후 JFK 공항 출발' },
    ],
  },
  {
    id: 'egypt',
    region: 'longhaul',
    regionName: '대형 장거리 (연말연시 단독)',
    destination: '이집트 (카이로 & 룩소르/아스완)',
    stayDuration: '7박 ~ 9박',
    recommendedPeriod: '12월 21일 ~ 1월 3일 (겨울 건기 배낭여행 최적)',
    timingType: 'break',
    transportFromUppsala: '아를란다 ➔ 카이로 직항/경유 항공 (약 5~6시간)',
    coreReasons: '카이로 기자 피라미드, 이집트 문명 박물관, 룩소르 왕가의 계곡/카르나크 신전, 나일강 크루즈. 연말연시 쾌적한 겨울 건기 배낭여행.',
    routeSummary: '카이로 피라미드 2박 ➔ 나일강 크루즈 또는 침대열차 ➔ 룩소르 신전군 3박 ➔ 아스완/아부심벨',
    detailedRouteStops: [
      { step: '1~2일차', title: '기자 피라미드 & 스핑크스', desc: '인류 최대의 불가사의 쿠푸왕 피라미드, 이집트 문명 대박물관(NMEC) 미라 관람' },
      { step: '3~5일차', title: '룩소르 왕가의 계곡 & 신전군', desc: '투탕카멘 무덤, 카르나크 신전 거대 열주실, 룩소르 신전 야경 투어' },
      { step: '6~7일차', title: '아부심벨 신전 & 펠루카', desc: '람세스 2세의 거대한 암굴 신전 아부심벨, 나일강 전통 돛단배 펠루카 체험' },
      { step: '8~9일차', title: '카이로 올드바자르 후 복귀', desc: '칸 엘 칼릴리 전통 시장 투어 후 카이로 공항 출발' },
    ],
  },
]

// 5 Months Calendar for the Trip Planner Page
const calendarMonths = [
  { year: 2026, month: 9, name: '2026년 9월', startDay: 2, days: 30 },
  { year: 2026, month: 10, name: '2026년 10월', startDay: 4, days: 31 },
  { year: 2026, month: 11, name: '2026년 11월', startDay: 0, days: 30 },
  { year: 2026, month: 12, name: '2026년 12월', startDay: 2, days: 31 },
  { year: 2027, month: 1, name: '2027년 1월', startDay: 5, days: 31 },
]

export default function TravelInvitePage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedPlan, setSelectedPlan] = useState<DestinationPlan | null>(null)
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(1) // 10월
  const [selectedCalDate, setSelectedCalDate] = useState<string>('2026-10-16')
  const [dark, setDark] = useState<boolean>(false) // ⭐️ 라이트 모드 기본!
  const [copySuccess, setCopySuccess] = useState(false)

  // Coordination Form
  const [coordModalOpen, setCoordModalOpen] = useState(false)
  const [targetDestination, setTargetDestination] = useState<string>('')
  const [friendName, setFriendName] = useState('')
  const [friendContact, setFriendContact] = useState('')
  const [friendDates, setFriendDates] = useState('')
  const [friendNotes, setFriendNotes] = useState('')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Theme Sync (Default: Light Mode)
  useEffect(() => {
    const saved = window.localStorage.getItem('semester-theme-pref')
    if (saved === 'dark') {
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
      window.localStorage.setItem('semester-theme-pref', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      window.localStorage.setItem('semester-theme-pref', 'light')
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleOpenCoordModal = (destName?: string) => {
    setTargetDestination(destName || (selectedPlan ? selectedPlan.destination : ''))
    setCoordModalOpen(true)
  }

  const handleSubmitCoord = () => {
    if (!friendName.trim()) return

    const record = {
      destination: targetDestination,
      name: friendName.trim(),
      contact: friendContact.trim(),
      dates: friendDates.trim(),
      notes: friendNotes.trim(),
      createdAt: new Date().toISOString(),
    }

    const prev = JSON.parse(window.localStorage.getItem('travel-coordinations') || '[]')
    window.localStorage.setItem('travel-coordinations', JSON.stringify([record, ...prev]))

    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      setCoordModalOpen(false)
      setFriendName('')
      setFriendContact('')
      setFriendDates('')
      setFriendNotes('')
    }, 1800)
  }

  // Filtered destinations
  const filteredList = useMemo(() => {
    if (selectedRegion === 'all') return travelDestinations
    return travelDestinations.filter((d) => d.region === selectedRegion)
  }, [selectedRegion])

  const curMonth = calendarMonths[selectedMonthIdx]

  return (
    <div className={cn('min-h-screen transition-colors duration-150', dark ? 'dark bg-[#0e1117] text-zinc-100' : 'bg-[#fbfbfb] text-zinc-900')}>
      {/* 1. Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-[#0e1117]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <ArrowLeft className="size-4" />
            <span>학기 전체 시간표 대시보드로 이동</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {copySuccess ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              <span>{copySuccess ? '링크 복사 완료' : '페이지 주소 복사'}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              title={dark ? '라이트 모드' : '다크 모드'}
            >
              {dark ? <Sun className="size-3.5 text-amber-400" /> : <Moon className="size-3.5 text-indigo-600" />}
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Top Title & Overview */}
      <div className="border-b border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-[#12151d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300">
                2026-2027 학기
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                웁살라 출발 기준 · 일정 및 코스 가이드
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
              학기 중 여행 일정 계획 및 후보 코스 안내
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
              학업 일정(시험, 발표, 야외실습)과 이동 시간을 고려해 선별한 권역별 여행 후보지입니다.<br />
              각 여행지의 권장 박수와 대략적인 이동 경로를 확인하고, 일정이 맞는 기간이 있다면 함께 조율할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex flex-col gap-10">
        {/* 3. CALENDAR SECTION (2026.09 ~ 2027.01) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Calendar className="size-4 text-indigo-600" />
                <span>학기 달력 및 주요 학사 일정 (2026.09 ~ 2027.01)</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                날짜별 수업 유무와 시험·실습 기간을 확인하여 여행 가능 시기를 파악할 수 있습니다.
              </p>
            </div>

            {/* Month selector */}
            <div className="flex items-center gap-1">
              {calendarMonths.map((m, idx) => (
                <Button
                  key={m.name}
                  variant={selectedMonthIdx === idx ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMonthIdx(idx)}
                  className={cn(
                    'h-7 px-2 text-xs font-semibold',
                    selectedMonthIdx === idx
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300'
                  )}
                >
                  {m.year === 2027 ? `'27 1월` : `${m.month}월`}
                </Button>
              ))}
            </div>
          </div>

          {/* Month Calendar Grid */}
          <Card className="border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-[#13161f]">
            <CardHeader className="py-3 px-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{curMonth.name}</span>
              <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-rose-500" />
                  <span>시험/실습/발표 (여행 불가)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>공강/연휴/방학 (여행 추천)</span>
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-3">
              {/* Day header */}
              <div className="grid grid-cols-7 gap-1 pb-1 text-center text-xs font-semibold text-zinc-500">
                <div>월 (Mon)</div>
                <div>화 (Tue)</div>
                <div>수 (Wed)</div>
                <div>목 (Thu)</div>
                <div>금 (Fri)</div>
                <div className="text-zinc-400">토 (Sat)</div>
                <div className="text-rose-500">일 (Sun)</div>
              </div>

              {/* Grid cells */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: (curMonth.startDay + 6) % 7 }).map((_, idx) => (
                  <div key={`pad-${idx}`} className="h-16 rounded border border-transparent bg-zinc-50/40 opacity-40 dark:bg-zinc-900/20" />
                ))}

                {Array.from({ length: curMonth.days }).map((_, idx) => {
                  const dayNum = idx + 1
                  const dateStr = `${curMonth.year}-${String(curMonth.month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                  const dayOfWeek = (curMonth.startDay + idx) % 7 // 0=Sun, 1=Mon, ..., 5=Fri

                  // Academic markers
                  const isFieldWeek = curMonth.month === 9 && dayNum >= 28 || curMonth.month === 10 && dayNum <= 2
                  const isPresentation = curMonth.month === 10 && dayNum === 26
                  const isMidExam = curMonth.month === 10 && dayNum === 29
                  const isPhysicsSem = curMonth.month === 12 && dayNum >= 14 && dayNum <= 17
                  const isWinterBreak = (curMonth.month === 12 && dayNum >= 21) || (curMonth.year === 2027 && curMonth.month === 1 && dayNum <= 6)
                  const isFinalExam = curMonth.year === 2027 && curMonth.month === 1 && dayNum === 11

                  const isBlocked = isFieldWeek || isPresentation || isMidExam || isPhysicsSem
                  const isGoodForTravel = isWinterBreak || dayOfWeek === 5

                  return (
                    <div
                      key={dateStr}
                      onClick={() => setSelectedCalDate(dateStr)}
                      className={cn(
                        'h-16 rounded border p-1 text-xs transition-colors flex flex-col justify-between cursor-pointer',
                        selectedCalDate === dateStr
                          ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/40'
                          : 'border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60',
                        isBlocked && 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900',
                        isWinterBreak && !selectedCalDate && 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn('font-bold', dayOfWeek === 0 && 'text-rose-500', isBlocked && 'text-rose-700 dark:text-rose-300')}>
                          {dayNum}
                        </span>
                        {isWinterBreak && (
                          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">방학</span>
                        )}
                        {dayOfWeek === 5 && !isWinterBreak && !isBlocked && (
                          <span className="text-[9px] font-semibold text-emerald-600">금요공강</span>
                        )}
                      </div>

                      {/* Small badge */}
                      {isFieldWeek && dayNum === 28 && (
                        <div className="text-[9px] font-bold text-rose-700 truncate">야외실습시작</div>
                      )}
                      {isPresentation && (
                        <div className="text-[9px] font-bold text-rose-700 truncate">XR발표</div>
                      )}
                      {isMidExam && (
                        <div className="text-[9px] font-bold text-rose-700 truncate">중간시험</div>
                      )}
                      {isPhysicsSem && dayNum === 14 && (
                        <div className="text-[9px] font-bold text-rose-700 truncate">세미나주간</div>
                      )}
                      {isFinalExam && (
                        <div className="text-[9px] font-bold text-rose-700 truncate">기말시험</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 4. DESTINATIONS SECTION (권역별 목록) */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Compass className="size-4 text-indigo-600" />
                <span>권역별 여행지 목록 및 권장 체류 일정 ({travelDestinations.length}곳)</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                목적지를 클릭하면 <strong>대략적인 이동 동선 및 세부 추천 일정</strong>을 확인할 수 있습니다.
              </p>
            </div>

            <Button
              onClick={() => handleOpenCoordModal()}
              className="gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 font-semibold text-xs self-start sm:self-auto"
            >
              <span>일정 조율 의견 남기기</span>
            </Button>
          </div>

          {/* Region Tabs */}
          <Tabs value={selectedRegion} onValueChange={setSelectedRegion} className="w-full">
            <TabsList className="flex flex-wrap h-auto border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900 w-full justify-start gap-1">
              <TabsTrigger value="all" className="text-xs font-semibold">전체 보기 ({travelDestinations.length})</TabsTrigger>
              <TabsTrigger value="nordic" className="text-xs font-semibold">1. 북유럽 & 극지방 (5)</TabsTrigger>
              <TabsTrigger value="uk" className="text-xs font-semibold">2. 영국 & 아일랜드 (5)</TabsTrigger>
              <TabsTrigger value="central" className="text-xs font-semibold">3. 중유럽 & 독일 (6)</TabsTrigger>
              <TabsTrigger value="west" className="text-xs font-semibold">4. 서유럽 (7)</TabsTrigger>
              <TabsTrigger value="south" className="text-xs font-semibold">5. 남유럽 & 발트/폴란드 (6)</TabsTrigger>
              <TabsTrigger value="longhaul" className="text-xs font-semibold">6. 연말연시 대형장거리 (2)</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Cards Table / Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredList.map((plan) => (
              <Card
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={cn(
                  'cursor-pointer border transition-all duration-150 flex flex-col justify-between hover:shadow-md',
                  'border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-[#13161f] dark:hover:border-zinc-600'
                )}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {plan.regionName}
                    </span>
                    <Badge variant="outline" className="border-zinc-300 font-bold text-zinc-800 dark:border-zinc-700 dark:text-zinc-200 text-xs">
                      {plan.stayDuration}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                    {plan.destination}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex flex-col gap-3 text-xs">
                  {/* Recommended period */}
                  <div className="rounded bg-zinc-50 p-2 text-zinc-700 dark:bg-zinc-850 dark:text-zinc-300">
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400 block text-[11px]">권장 방문 시기</span>
                    <span className="font-medium">{plan.recommendedPeriod}</span>
                  </div>

                  {/* Core Reason */}
                  <div>
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400 block text-[11px]">핵심 일정 및 체류 이유</span>
                    <p className="mt-0.5 text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-3">
                      {plan.coreReasons}
                    </p>
                  </div>

                  {/* Transport */}
                  <div className="border-t border-zinc-100 pt-2 text-[11px] text-zinc-500 dark:border-zinc-800">
                    <span className="font-semibold">이동:</span> {plan.transportFromUppsala}
                  </div>

                  {/* Action Link */}
                  <div className="flex items-center justify-between font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
                    <span>추천 동선 및 일정 보기</span>
                    <Navigation className="size-3.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* 5. ROUTE DETAIL MODAL (클릭 시 이동 경로 확인) */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-zinc-300 bg-white text-zinc-900 shadow-xl dark:border-zinc-700 dark:bg-[#141721] dark:text-zinc-100 sm:max-w-[600px] p-6">
          {selectedPlan && (
            <div className="flex flex-col gap-4">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedPlan.regionName}
                  </span>
                  <Badge variant="outline" className="border-zinc-300 font-bold text-xs">
                    권장 체류: {selectedPlan.stayDuration}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {selectedPlan.destination}
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  추천 시기: {selectedPlan.recommendedPeriod}
                </DialogDescription>
              </DialogHeader>

              {/* Core reasons */}
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3 text-xs leading-relaxed text-zinc-700 dark:bg-zinc-850 dark:border-zinc-750 dark:text-zinc-300">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-0.5">핵심 일정 및 체류 이유:</span>
                {selectedPlan.coreReasons}
              </div>

              {/* Transport summary */}
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">웁살라 출발 이동 방식: </span>
                {selectedPlan.transportFromUppsala}
              </div>

              {/* Step-by-Step Route */}
              <div className="border-t border-zinc-200 pt-3 dark:border-zinc-750">
                <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 block mb-3">
                  대략적인 이동 경로 및 일정 구성:
                </span>

                <div className="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-700">
                  {selectedPlan.detailedRouteStops.map((stop, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-5 top-1 size-2 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-[#141721]" />
                      <div className="rounded border border-zinc-200 bg-white p-2.5 text-xs shadow-2xs dark:border-zinc-750 dark:bg-zinc-850">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{stop.step}: {stop.title}</span>
                        <p className="mt-0.5 text-zinc-600 dark:text-zinc-300 leading-normal">{stop.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-750">
                <Button
                  onClick={() => {
                    handleOpenCoordModal(selectedPlan.destination)
                  }}
                  className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 font-semibold text-xs"
                >
                  <span>이 여행 일정 함께 조율하기</span>
                </Button>
                <Button variant="outline" onClick={() => setSelectedPlan(null)} className="text-xs">
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 6. CLEAN COORDINATION FORM MODAL */}
      <Dialog open={coordModalOpen} onOpenChange={setCoordModalOpen}>
        <DialogContent className="border-zinc-300 bg-white text-zinc-900 shadow-xl dark:border-zinc-700 dark:bg-[#151821] dark:text-zinc-100 sm:max-w-[460px] p-5">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              여행 일정 조율 및 동행 의사 등록
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              관심 있는 여행지와 본인이 가능한 일정을 남겨주시면 맞춰서 확인하겠습니다.
            </DialogDescription>
          </DialogHeader>

          {savedSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="size-10 text-emerald-600 mb-2" />
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">의견이 등록되었습니다.</p>
              <p className="text-xs text-zinc-500 mt-1">확인 후 개별 연락드리겠습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-2 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">관심 여행지</label>
                <Input
                  value={targetDestination}
                  onChange={(e) => setTargetDestination(e.target.value)}
                  placeholder="예: 핀란드 헬싱키 / 스웨덴 아비스코 등"
                  className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">이름 / 닉네임 *</label>
                <Input
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="이름 입력"
                  className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">연락처 (인스타그램 ID / 카카오톡 ID 등)</label>
                <Input
                  value={friendContact}
                  onChange={(e) => setFriendContact(e.target.value)}
                  placeholder="연락받을 ID 또는 번호"
                  className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">가능한 일정 / 날짜</label>
                <Input
                  value={friendDates}
                  onChange={(e) => setFriendDates(e.target.value)}
                  placeholder="예: 10월 둘째 주 주말 가능 / 12월 방학 전체 가능 등"
                  className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-zinc-700 dark:text-zinc-300">메모 / 의견 (선택)</label>
                <Textarea
                  value={friendNotes}
                  onChange={(e) => setFriendNotes(e.target.value)}
                  placeholder="코스나 선호하는 이동 수단 등에 대해 자유롭게 남겨주세요."
                  rows={3}
                  className="border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <Button variant="outline" onClick={() => setCoordModalOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSubmitCoord} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 font-semibold">
                  등록
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
