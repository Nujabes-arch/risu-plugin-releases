# RisuAI Plugin Releases

RisuAI/PocketRisu 관련 플러그인의 **공개 배포 파일만** 보관하는 저장소입니다.
개발 중인 코드, 개인 채팅 기록, API 키, 실험용 로그와 사적인 테스트 자료는 이곳에 게시하지 않습니다.

## 현재 배포 상태

| 플러그인 | 상태 | 실행 파일 |
| --- | --- | --- |
| 원작견 BG (`LoreQA-BG-Experimental`) | **배포 준비 중 · 미공개** | 없음 |

원작견 BG 개발판은 현재 RisuAI 실사용 검증 및 원저작자 코드의 재배포 권한 확인을 기다리고 있습니다.
GitHub Release나 설치 가능한 JS가 아직 없으므로, 이 저장소의 파일을 플러그인으로 설치하지 마세요.

## 배포 후 사용할 구조

| 경로 | 역할 |
| --- | --- |
| `plugins/catalog.json` | 배포 상태, 파일 경로, 업데이트 URL 등록 |
| `plugins/<slug>/*.js` | 검증을 마친 실제 플러그인 파일 (**공개 승인 전에는 없음**) |
| `plugins/<slug>/README.md` | 기능·설치·설정 안내 |
| `plugins/<slug>/CHANGELOG.md` | 버전별 변경 사항 |
| `THIRD_PARTY_NOTICES.md` | 원본 프로젝트의 출처와 재배포 권리 확인 상태 |
| `scripts/validate-release.mjs` | 배포 아티팩트 및 공개 안전 검사 |
| `.github/workflows/validate.yml` | PR과 main 변경 검증 |

## 배포·업데이트 정책

- 개발은 별도 **비공개 workbench**에서 진행하고, 완성된 **단일 JS**만 이 저장소에 복사합니다.
- 배포 전에 원본 코드의 라이선스/재배포 허락, 사용자 RisuAI 런타임 동작, 소스 이력 및 민감정보 포함 여부를 확인합니다.
- 설치 파일의 `//@name` 및 Raw URL은 같은 플러그인의 업데이트가 계속 동작하도록 유지하고, `//@version`을 올립니다.
- GitHub Release는 검증 완료 이후 별도의 **수동 작업**으로 발행합니다. CI가 자동 게시하지 않습니다.
- RisuAI에서 `//@update-url`을 통한 업데이트 감지는 지원하지만, 이 저장소에 파일이 실제 공개되기 전에는 URL이 작동하지 않습니다.

예정된 원작견 BG 업데이트 URL (**아직 사용 불가**):

```text
https://raw.githubusercontent.com/Nujabes-arch/risu-plugin-releases/main/plugins/loreqa-bg/LoreQA-BG.js
```

## 로컬 검증

Node.js 22 이상이 필요합니다. 별도 npm 패키지 설치는 필요하지 않습니다.

```bash
node scripts/validate-release.mjs
node --test scripts/validate-release.test.mjs
```

배포 제안·운영 순서는 [릴리스 절차](docs/RELEASE_PROCESS.md), 공개 기여 요건은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.

## 라이선스와 출처

이 저장소에는 일괄 적용하는 LICENSE 파일을 두지 않습니다.
기반 프로젝트의 출처와 확인된 고지는 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)에 기록합니다.
원본에 LICENSE 파일이 없다는 사실만으로 원저작자의 허용·금지 의도를 추정하지 않습니다.
