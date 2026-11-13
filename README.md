# RisuAI Plugin Releases

RisuAI/PocketRisu 플러그인의 공개 배포 파일을 보관합니다. 개발용 채팅·키·테스트 fixture는 포함하지 않습니다.

| 플러그인 | 버전 | 채널 | 다운로드 |
| --- | --- | --- | --- |
| 캐논 가이드 (`LoreQA-BG-Experimental`) | 0.3.2 | 개발판 (preview) | [LoreQA-BG.js](https://raw.githubusercontent.com/Nujabes-arch/risu-plugin-releases/main/plugins/loreqa-bg/LoreQA-BG.js) |

캐논 가이드는 원작 설정 참고와 답변 뒤 BG 분석을 제공하는 플러그인입니다.
설치·모델·검색 설정은 [플러그인 안내](plugins/loreqa-bg/README.md), 변경점은 [변경 기록](plugins/loreqa-bg/CHANGELOG.md)을 참고하세요.

## 설치와 업데이트

업데이트 주소가 없는 기존 개발판은 **한 번만** 위 JS를 내려받아 RisuAI 플러그인 설정에서 가져오고,
동일 플러그인이 발견되면 교체/업데이트를 확인합니다. 기존 플러그인을 먼저 삭제하지 마세요.
이후에는 RisuAI의 플러그인 업데이트 버튼으로 같은 Raw 주소의 더 높은 버전을 받을 수 있습니다.
설치 ID와 플러그인 저장 키는 유지합니다. 실제 사용자 호스트에서의 설정 보존·업데이트 확인은 아직 남아 있습니다.

개발판은 사용자 요청으로 게시되며, 로컬 회귀 검사와 가짜 API를 사용한 브라우저 검증을 거쳤습니다.
실제 RisuAI/PocketRisu 설치본, LiteLLM/Exa 실서버 및 모든 모델의 추론 강도 지원이 검증됐다는 뜻은 아닙니다.

## 배포 관리

- `plugins/catalog.json`: 파일·버전·고정 업데이트 주소와 게시/검증 상태
- `scripts/validate-release.mjs`: 메타데이터·경로·비밀정보 패턴 검사
- [릴리스 절차](docs/RELEASE_PROCESS.md): 개발판과 안정판 조건, PR 검증, 수동 Release 발행
- [제3자 출처](THIRD_PARTY_NOTICES.md): 기반 프로젝트와 실제 확인한 고지

Node.js 22 이상에서 별도 패키지 설치 없이 검사합니다.

```sh
node scripts/validate-release.mjs
node --test scripts/validate-release.test.mjs
```

이 저장소에는 일괄 적용하는 LICENSE 파일을 두지 않습니다. 원본의 LICENSE 부재로 원저작자의 허용·금지 의도를 추정하지 않습니다.
