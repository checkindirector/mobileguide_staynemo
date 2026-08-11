# Source inventory

The final brand, content, privacy, language, image, and OTA decisions are frozen in
`docs/approved_spec.json`. The approved visual system uses warm cream `#F4F0E8`,
graphite `#42413E`, walnut `#6D4A34`, brass mustard `#B08A4A`, and deep ink
`#26231F`.

## Used

- Google Drive `스테이 네모_숙소정보`: 숙소명, 주소, 수용 인원, 침대·욕실 수, 체크인·체크아웃, 교통, 출입 동선, Wi-Fi, 숙소 규칙, 가전 모델 정보
- Google Drive `숙소사진` 43장: 홈 히어로, 공간 갤러리, 체크인·교통·가전 안내
- 사용자 지정 홈 이미지: `공용부_07.jpg`(메인), `공용부_04.jpg`(서브)
- Primary Master production repository: 모바일 정보 구조, 화면 전환, 다국어, 갤러리, PWA 패턴을 기준으로 대조

## Protected or intentionally omitted

- 1층 야간 출입 비밀번호: 공개 페이지에서 제외
- 개인 전화번호·이메일·메신저 ID: 공개 여부가 확정되지 않아 제외
- OTA URL: 등록 전이므로 설정값을 `null`로 유지
- 기기 모델이 확인되지 않은 항목: 제조사·모델을 임의로 추정하지 않음

## Asset treatment

- 원본 43장을 방향 정보에 맞게 회전하고 WebP로 최적화
- 다른 숙소의 사진·숙소명·주소·연락처·캐시 이름을 사용하지 않음
