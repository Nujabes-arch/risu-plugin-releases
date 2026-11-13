# 캐논 가이드 0.3.1

RisuAI/PocketRisu용 원작 설정 참고 및 백그라운드 분석 플러그인입니다. 예전 표시 이름은 원작견 BG입니다.

**개발판(preview):** 사용자 요청으로 공개합니다. 실제 사용자 호스트 및 LiteLLM/Exa 연결은 아직 검증하지 않았습니다.

## 설치·업데이트

1. [LoreQA-BG.js 다운로드](https://raw.githubusercontent.com/Nujabes-arch/risu-plugin-releases/main/plugins/loreqa-bg/LoreQA-BG.js) 또는 [Releases](https://github.com/Nujabes-arch/risu-plugin-releases/releases)에서 JS를 저장합니다.
2. RisuAI 플러그인 설정에서 파일을 가져옵니다. 같은 `LoreQA-BG-Experimental` 플러그인이 발견되면 교체/업데이트를 확인합니다.
3. 표시 이름이 **캐논 가이드 v0.3.1**인지 확인합니다.
4. 이 버전부터 업데이트 주소가 포함됩니다. 다음 버전은 RisuAI 플러그인 업데이트 버튼으로 받을 수 있습니다.

기존 개발판에 업데이트 주소가 없다면 첫 교체 설치가 필요합니다. 기존 플러그인을 먼저 삭제하지 마세요.
내부 이름 `LoreQA-BG-Experimental`과 저장 키 `loreqa_bg_v1:`은 유지합니다. 중요한 설정은 먼저 내보내 보관하세요.
공식 RisuAI의 동일 이름 교체 동작을 소스에서 확인했으며, 사용자 설치본·PocketRisu에서의 실제 보존은 미검증입니다.

## 주요 설정

- 모델·검색: 기본·검증·모드별 모델과 추론 강도. Custom(OpenAI 호환)에 LiteLLM 주소·키를 넣고 모델 목록을 불러옵니다.
- Vertex 모델: LiteLLM 서버에 등록된 모델을 사용합니다. 해당 경로에서는 플러그인에 Vertex 인증정보를 따로 넣지 않습니다.
- 검색: 필요할 때 LiteLLM Exa만 켭니다. 기본 Custom 프로필의 주소·키를 재사용하며 그 키에 Exa 권한이 있어야 합니다. 기본 꺼짐입니다.
- 추론 강도: 모델 기본값 또는 low/medium/high/xhigh/max 등. 선택값을 서버·모델이 지원해야 합니다.
- PDF: BG 요청은 일반 텍스트로 보냅니다.
- 프리셋·고급: 선택한 프리셋을 이름 재입력 없이 덮어쓸 수 있습니다.
- 호출·자료: 최근 60건의 모델 호출과 자료 사용 내역, 실패 기록의 수동 재시도. 기록은 세션 메모리에만 남습니다.

API 키·요청 전문은 디버그 기록에 저장하지 않습니다. 결과 요약과 검색어에는 채팅에서 파생된 내용이 있을 수 있으니 공유 전 확인하세요.
검색과 모델 호출에는 비용이 생길 수 있습니다. 타임아웃 후 재시도는 서버에서 중복 처리될 수 있습니다.

## 복구

문제가 생기면 플러그인을 비활성화하고, 보관한 이전 JS를 같은 이름으로 교체합니다. 저장 데이터를 지우지 마세요.
이미 내보낸 캐릭터 로어는 비활성화로 제거되지 않습니다. 실제 사용자 설치본에서의 복구는 미실행입니다.

기반 프로젝트: [akmoonge/LoreQAcustom](https://github.com/akmoonge/LoreQAcustom). [출처 및 확인 상태](../../THIRD_PARTY_NOTICES.md).
