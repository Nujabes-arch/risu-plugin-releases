# 배포 변경 기여 가이드

이 저장소는 개발 저장소가 아닙니다. 문서·CI 변경과 검증된 플러그인 단일 파일만 PR로 받습니다.
실험 JS 전체, 사적 테스트 fixture, 운영 서버 설정과 키를 포함하지 마세요.

1. 새 브랜치를 만들고 필요한 배포 파일 또는 설명서만 수정합니다.
2. 안정판은 재배포 권리 확인과 실제 호스트 검증 근거를 마련합니다. 사용자 요청에 따른 개발판은 [preview 조건](docs/RELEASE_PROCESS.md)을 따르며 미확인값을 임의로 켜지 않습니다.
3. `plugins/catalog.json`에서 `planned` 항목을 `published`로 바꾸는 작업은 승인된 릴리스 PR에서만 수행합니다.
4. JS 파일의 `//@name`, `//@version`, `//@api`, `//@update-url` 지시문을 CI가 검사합니다.
5. `node scripts/validate-release.mjs`와 `node --test scripts/validate-release.test.mjs`를 실행합니다.
6. PR 체크리스트에서 배포 여부·권리·검증·민감정보 확인을 기재하고, 검사가 통과해야 main에 병합합니다.

**중요:** `publicationApproved`는 개발판의 명시적 게시 요청을 기록합니다. `thirdPartyRightsConfirmed`와 `risuRuntimeVerified`는
별도의 사실 확인값입니다. 게시 승인을 권리 확인이나 실제 호스트 검증으로 바꾸지 마세요.

공개된 버전의 롤백 및 새 릴리스 발행은 [RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md)를 따릅니다.
