# 배포 변경 기여 가이드

이 저장소는 개발 저장소가 아닙니다. 문서·CI 변경과 검증된 플러그인 단일 파일만 PR로 받습니다.
실험 JS 전체, 사적 테스트 fixture, 운영 서버 설정과 키를 포함하지 마세요.

1. 새 브랜치를 만들고 필요한 배포 파일 또는 설명서만 수정합니다.
2. JS를 공개하려면 원저작자 재배포 권리 확인과 실제 RisuAI/PocketRisu 테스트 근거를 먼저 마련합니다.
3. `plugins/catalog.json`에서 `planned` 항목을 `published`로 바꾸는 작업은 승인된 릴리스 PR에서만 수행합니다.
4. JS 파일의 `//@name`, `//@version`, `//@api`, `//@update-url` 지시문을 CI가 검사합니다.
5. `node scripts/validate-release.mjs`와 `node --test scripts/validate-release.test.mjs`를 실행합니다.
6. PR 체크리스트에서 배포 여부·권리·검증·민감정보 확인을 기재하고, 검사가 통과해야 main에 병합합니다.

**중요:** `thirdPartyRightsConfirmed`와 `risuRuntimeVerified`는 자동 입증이 아니라
관리자가 실제 근거를 확인했다는 수동 기록입니다. 체크를 통과시키기 위해 값을 임의로 켜지 마세요.

공개된 버전의 롤백 및 새 릴리스 발행은 [RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md)를 따릅니다.
