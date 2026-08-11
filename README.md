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

`assets/data.js` 상단의 `STAY_NEMO_CONFIG.otaLinks`에서 `null`을 실제 예약 URL로 바꾸면 해당 버튼이 자동으로 활성화됩니다.

```js
otaLinks: {
  airbnb: 'https://...',
  booking: 'https://...',
  agoda: 'https://...',
  trip: 'https://...'
}
```

## 주요 구성

- 한국어·영어·일본어·중국어 전환
- 홈, 공간 갤러리, 체크인·체크아웃, Wi-Fi, 교통, 숙소 규칙, 가전·시설, 문의
- 사진 라이트박스와 터치 스와이프
- 지도 연결과 Wi-Fi 비밀번호 복사
- 설치형 웹앱(PWA) 및 오프라인 기본 화면
- OTA 링크 준비 상태 UI
