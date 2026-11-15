// 카카오 OAuth 보조 함수 (React Native 모듈 없이 Node 에서도 테스트 가능)
/** 로그인 요청마다 새로 만드는 임의 문자열 (OAuth state, CSRF 방지) */
export function createOAuthState() {
  const bytes = new Uint8Array(16);
  const c = globalThis.crypto;
  if (c?.getRandomValues) c.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** url 이 등록된 redirect_uri 와 정확히 같은 출처·경로인가 (startsWith 는 접두사만 맞춰도 통과해서 쓰지 않는다) */
export function isKakaoRedirect(url, redirectUri) {
  try {
    const a = new URL(url);
    const b = new URL(redirectUri);
    return a.origin === b.origin && a.pathname.replace(/\/$/, '') === b.pathname.replace(/\/$/, '');
  } catch {
    return false;
  }
}

/** 카카오 로그인 페이지에서 벗어나도 되는 주소인가 (https + 카카오 도메인만) */
export function isAllowedKakaoPage(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && /(^|\.)kakao(cdn)?\.(com|net)$/.test(u.hostname);
  } catch {
    return false;
  }
}
