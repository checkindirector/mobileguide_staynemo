# STAY NEMO Mobile Guide

을지로3가의 프라이빗 숙소 **STAY NEMO**를 위한 모바일 우선 홈페이지 겸 게스트 가이드입니다.

## 로컬 실행

```powershell
npm start
```

터미널에 표시되는 로컬 주소를 모바일 브라우저 또는 데스크톱 브라우저에서 엽니다.

## 검증

```powershell
npm test
npm run build
```

## OTA 링크 연결

`assets/data.js` 상단의 `STAY_NEMO_CONFIG.otaLinks`에서 예약 URL을 관리합니다. 현재 Airbnb, Booking.com, Trip.com 3개 플랫폼이 연결되어 있으며 Agoda는 표시하지 않습니다.

```js
otaLinks: {
  airbnb: 'https://...',
  booking: 'https://...',
  trip: 'https://...'
}
```

## 주요 구성

- 한국어·영어·일본어·중국어 간체·중국어 번체(대만) 전환
- 홈, 객실 둘러보기, 찾아오는 길, 체크인·체크아웃, Wi-Fi, 가전·시설, 숙소 규칙, 주변 맛집, 근교 추천 투어
- 사진 라이트박스와 터치 스와이프
- 지도 연결과 Wi-Fi 비밀번호 복사
- 설치형 웹앱(PWA) 및 오프라인 기본 화면
- OTA 예약 링크 및 호스트 전화번호 확인 팝업
- AI 챗봇 및 OpenAI 연동 없음

## 최종본 백업 및 재배포

- 2026-10-19 백업 기준: 운영 버전 v80. 실제 사이트 자산은 `assets/`에 포함되어 있습니다.
- 정적 HTML/CSS/JavaScript 사이트입니다. `npm test`와 `npm run build`로 검증합니다.
- Vercel에 이 저장소를 가져오고 빌드 명령 `npm run build`, 출력 폴더 `.`를 사용합니다. 기존 `vercel.json`에 배포 설정이 있습니다.
- 다른 정적 호스팅에서도 사용할 수 있지만, 서비스 워커·캐시·리라이트 설정과 사이트 주소 관련 메타데이터를 확인해야 합니다.
- `.env*`와 `.vercel/`은 비밀정보 및 계정별 설정이므로 백업에서 제외합니다. 현재 정적 사이트에는 OpenAI 키가 필요하지 않습니다.
- 이 백업은 현재 최종본입니다. 이후 다른 업체가 변경한 내용은 별도로 동기화해야 반영됩니다.
- 소유주 Vercel 계정으로의 이전은 아직 진행하지 않았습니다. 현재 운영 주소: https://staynemo-guide.vercel.app/
