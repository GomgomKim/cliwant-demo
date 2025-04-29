## App 실행 가이드

1. 프로젝트 클론
   ```bash
   git clone https://github.com/GomgomKim/cliwant-demo.git
   cd cliwant-demo
   ```
2. 의존성 설치
   ```bash
   pnpm install
   ```
3. 개발 서버 실행

   ```bash
   pnpm dev
   ```

   브라우저에서 http://localhost:3000 에 접속합니다.

## 사용한 디자인 패턴 설명 (FSD)

이 프로젝트는 Feature-Sliced Design (FSD) 아키텍처 패턴을 기반으로 구조화되었습니다.

- Slices (기능 계층)
  - app: Next.js App Router 페이지 및 레이아웃
  - widgets: 재사용 가능한 UI 컴포넌트 조합
  - features: 사용자 시나리오 및 도메인 로직 단위
  - entities: 핵심 비즈니스 엔티티 (예: 유저, 제품)
  - shared: 공통 모듈 (API, 유틸리티, 타입 등)
- Segments (세분화)
  각 Slice 내에서 기능별로 폴더를 구분하여 관심사를 분리합니다.
- Public API
  index 파일을 통해 외부로 내보낼 인터페이스만 노출하여 캡슐화를 유지합니다.
- Unidirectional Dependency
  상위 계층만 하위 계층을 참조하도록 의존성 방향을 단방향으로 유지합니다.

이러한 구조는 코드의 가독성, 재사용성, 유지보수성을 향상시키며, 프로젝트 확장에 유리합니다.
