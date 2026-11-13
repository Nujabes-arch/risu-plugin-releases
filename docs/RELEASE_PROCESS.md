# 릴리스 절차

## 개발과 공개 파일 분리

개발은 비공개 workbench에서 수행하고, 공개 저장소에는 선택한 단일 JS·안내·메타데이터만 옮깁니다.
개인 채팅, 키, 테스트 fixture, 운영 설정은 게시하지 않습니다. Actions는 비공개 개발 저장소에 접근하지 않습니다.

## 게시와 검증 상태

2026-11-13 사용자는 업데이트 버튼으로 새 버전을 받기 위해 캐논 가이드 공개 파일 게시를 요청했습니다.
이 요청에 따른 첫 개발판은 아래 preview 조건으로 게시합니다. 미확인 사실을 true로 바꾸지 않습니다.

- `planned`: 실행 파일 없음, 버전 null, 게시/검증 확인값 false 또는 미설정.
- `published`, `releaseChannel: preview`: 명시적 사용자 게시 요청을 확인하고 `publicationApproved: true`를 기록합니다.
  실제 권리 확인·호스트 검증 상태는 각각 `thirdPartyRightsConfirmed`, `risuRuntimeVerified`에 사실대로 남깁니다.
  개발판이라는 점과 미검증 범위를 설치 안내 및 Release 본문에 씁니다. GitHub Release는 prerelease로 발행합니다.
- `published`, `releaseChannel: stable` 또는 채널 미설정: 기존 안정판 조건을 유지합니다.
  원본 수정·재배포 권한의 실제 근거 및 대상 RisuAI/PocketRisu에서 설치·후킹·저장·업데이트·복구·네트워크 권한 검증이 필요합니다.
  단순 mock은 실제 호스트 검증을 대체하지 않습니다.

게시 승인은 원저작자의 허락을 입증하지 않습니다. LICENSE 부재에 원저작자의 의도를 추정하거나 새 라이선스를 부여하지 않습니다.

## 수동 게시 순서

1. 개발 소스와 검사 결과를 확인합니다. 동일 설치 ID·저장 키를 보존하고 버전을 올립니다.
2. catalog에 파일·버전·채널·고정 Raw 주소와 실제 확인값을 기록합니다. 출처·미검증 범위를 문서에 반영합니다.
3. JS를 바이트 그대로 복사하고 문법 검사, Release validator, 회귀 테스트, diff 및 민감정보 포함 여부를 확인합니다.
4. 새 PR에서 `validate`가 통과한 정확한 head를 확인한 뒤 main으로 병합합니다. 보호 규칙을 우회하지 않습니다.
5. 병합된 main과 공개 Raw 파일의 SHA-256이 선택한 소스와 같은지 확인합니다. Range 요청으로 버전 헤더도 확인합니다.
6. main SHA를 대상으로 태그와 GitHub Release를 수동 발행하고 JS를 첨부합니다. 개발판은 prerelease로 표시합니다.

CI는 자동으로 Release를 만들거나 파일을 승격하지 않습니다. 새 게시 요청·검증 결과 없이 `publicationApproved`만 켜지 마세요.

## 업데이트 메타데이터

```javascript
//@name LoreQA-BG-Experimental
//@display-name 캐논 가이드 v0.3.1
//@version 0.3.1
//@api 3.0
//@update-url https://raw.githubusercontent.com/Nujabes-arch/risu-plugin-releases/main/plugins/loreqa-bg/LoreQA-BG.js
```

`//@version`은 파일 첫 500바이트 안에 둡니다. 공식 RisuAI는 업데이트 확인에 첫 512바이트를 요청하고,
가져오기에서는 버전 행 끝의 바이트 위치를 500과 비교합니다. 이름과 Raw 주소를 유지하며 매 업데이트의 버전을 올립니다.
공식 구현 확인: [RisuAI a438c097](https://github.com/kwaroran/RisuAI/blob/a438c0974ca9a09aa293d2907228a01418e8c9cc/src/ts/plugins/plugins.svelte.ts).
이 소스 확인은 사용자 설치본·PocketRisu의 실제 실행 검증이 아닙니다.

태그는 `loreqa-bg-v0.3.1`, 첨부 파일은 `LoreQA-BG.js` 형식을 사용합니다.
Release에는 변경점·설치/최초 교체 방법·검증 한계·복구 방법·SHA-256을 기록합니다.

## 복구와 보호

문제가 생기면 게시를 멈추고 원인을 확인합니다. 이전 코드로 돌아갈 때도 새 업데이트는 더 높은 패치 버전으로 내거나,
사용자가 보관한 이전 JS를 수동으로 교체합니다. 공개 이력·Release 자산을 무작정 삭제하지 않습니다.
main은 PR과 필수 validate를 통해 갱신하고, 강제 push·브랜치 삭제 금지 및 읽기 전용 Actions 권한을 유지합니다.
