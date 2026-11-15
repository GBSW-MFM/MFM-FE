import test from 'node:test';
import assert from 'node:assert/strict';

const R = 'http://localhost:5173/oauth/kakao';
const { isKakaoRedirect, isAllowedKakaoPage, createOAuthState } = await import('./oauth.js');

test('redirect 는 출처·경로가 정확히 같아야 한다', () => {
  assert.ok(isKakaoRedirect('http://localhost:5173/oauth/kakao?code=a&state=b', R));
  assert.ok(!isKakaoRedirect('http://localhost:5173/oauth/kakaoEvil?code=a', R));
  assert.ok(!isKakaoRedirect('http://localhost:51730/oauth/kakao', R));
});

test('WebView 는 카카오 https 주소만 허용', () => {
  assert.ok(isAllowedKakaoPage('https://accounts.kakao.com/login'));
  assert.ok(!isAllowedKakaoPage('https://evil.com/?kakao.com'));
  assert.ok(!isAllowedKakaoPage('intent://x'));
  assert.ok(!isAllowedKakaoPage('http://kauth.kakao.com'));
});

test('state 는 매번 다르다', () => {
  assert.notEqual(createOAuthState(), createOAuthState());
});
