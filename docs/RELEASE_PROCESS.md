# 릴리스 절차

## 환경 분리

1. 비공개 개발 저장소: 기능 구현, 상세 테스트, 테스트용 채팅/모델 설정 보관
2. 공개 배포 저장소: 배포가 허가된 단일 JS와 문서, 검증 가능한 메타데이터
3. 개인 RisuAI 런타임: UI, 데이터 보존, 최종 프롬프트와 업데이트 실제 작동 확인

공개 저장소의 GitHub Actions는 비공개 개발 저장소를 읽지 않습니다.
처음에는 검증된 아티팩트를 사람이 선택해 **새로운 PR로 옮기는 수동 승격**만 허용합니다.

## 출시 게이트

1. **저작권:** 제3자 원본 소스의 수정·재배포 권한을 실제 라이선스/권리자 허락으로 확인하고 THIRD_PARTY_NOTICES.md를 갱신합니다.
2. **런타임:** 대상 공식 RisuAI/PocketRisu 버전과 환경을 적고, 설치·후킹·저장·업데이트·롤백·네트워크 권한 테스트를 완료합니다. 별도 Node mock이나 LiteLLM 실호출만으로 대체하지 않습니다.
3. **격리:** 공개 JS에 키·채팅·사적 소스·디버그 데이터가 없어야 합니다.
4. **릴리스 후보:** catalog에 파일/원작 출처/버전을 기록하고 JS의 이름·버전·업데이트 URL을 고정합니다. catalog 상태를 planned에서 published로 변경하는 PR에서만 실행 파일을 추가합니다.
5. **자동 검증:** CI의 validate 체크가 통과하고, 사람이 diff를 검토한 뒤 main으로 병합합니다.
6. **수동 발행:** 병합된 main 커밋과 파일 SHA-256을 확인한 다음 GitHub Release에 변경 내역과 JS 파일을 첨부합니다.

## 배포 메타데이터

필수 헤더 예시는 아래와 같습니다. **설명용이며 아직 배포 파일을 뜻하지 않습니다.**

```javascript
//@name LoreQA-BG-Experimental
//@display-name 원작견 BG
//@version 0.2.0
//@api 3.0
//@update-url https://raw.githubusercontent.com/Nujabes-arch/risu-plugin-releases/main/plugins/loreqa-bg/LoreQA-BG.js
```

`//@version`은 파일 시작 512바이트 안에 있어야 합니다. 동일 `//@name` 및 Raw URL을 유지하고
버전 문자열을 이전 공개 버전보다 높게 올려야 RisuAI가 업데이트를 제안합니다.
Raw URL은 항상 main 파일을 가리키고, GitHub Release/태그는 변경되지 않는 기록을 제공합니다.

## 향후 릴리스 명명

- 태그: `loreqa-bg-v0.2.0` (플러그인 slug를 함께 적어 다른 플러그인과 구분)
- Release 제목: `LoreQA BG v0.2.0`
- 첨부: `LoreQA-BG.js`
- Release 본문: 변경점, 지원 RisuAI 버전, 알려진 문제, 이전 버전으로 복구하는 방법, JS SHA-256, 원본 라이선스 고지

이것은 **예상 태그 형식**이며 현재 실제 Release나 JS는 없습니다.

## 복구

회귀 문제가 생기면 원인 확인 전 자동 게시를 멈춥니다. 이미 배포한 JS의 버전을
낮추기만 하면 자동 업데이트 기능은 동작하지 않을 수 있으므로, 수정된 코드를
**더 높은 패치 버전**으로 내거나 사용자가 이전 GitHub Release의 JS를 수동 설치하도록 안내합니다.
공개 Git 이력·Release 자산을 무작정 삭제하지 않습니다.

## Repository 보호 권장값

- main으로 직접 push하지 않고 Pull Request 사용
- 강제 push / 브랜치 삭제 차단
- PR에 `validate` GitHub Actions 확인 필수
- Actions GITHUB_TOKEN은 읽기 전용(개별 workflow에서 permissions: contents: read)
- 자동 Release/게시 workflow는 추가하지 않음
