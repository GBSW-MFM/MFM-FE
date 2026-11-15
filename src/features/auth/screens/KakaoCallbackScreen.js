// 카카오 로그인 콜백 (웹 전용 경로 /oauth/kakao). 주소의 ?code= 를 서버에 넘겨 로그인한다.
// 앱(네이티브)은 WebView 에서 이 주소를 가로채므로 여기로 오지 않는다.
import { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppText, Screen } from '../../../shared/components';
import { colors } from '../../../shared/theme';
import { showAlert } from '../../../shared/utils/alert';
import { errorMessage } from '../../../shared/utils/errorMessage';
import { useAuth } from '../AuthContext';
import { OAUTH_STATE_KEY } from './oauthState';

function takeSavedState() {
  try {
    const v = globalThis.sessionStorage?.getItem(OAUTH_STATE_KEY) ?? null;
    globalThis.sessionStorage?.removeItem(OAUTH_STATE_KEY);
    return v;
  } catch {
    return null;
  }
}

export default function KakaoCallbackScreen() {
  const { code, state } = useLocalSearchParams();
  const { loginWithKakaoCode } = useAuth();
  const handled = useRef(false); // 인가 코드는 한 번만 쓸 수 있다

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    if (typeof code !== 'string' || !code) {
      // 동의 화면에서 취소한 경우 (?error=access_denied)
      router.replace('/login');
      return;
    }
    if (!state || state !== takeSavedState()) {
      showAlert('카카오 로그인 실패', '로그인 요청이 올바르지 않아요. 다시 시도해 주세요.');
      router.replace('/login');
      return;
    }
    loginWithKakaoCode(code)
      .then((status) => router.replace(status === 'LOGGED_IN' ? '/' : '/signup'))
      .catch((err) => {
        showAlert('카카오 로그인 실패', errorMessage(err));
        router.replace('/login');
      });
  }, [code, state, loginWithKakaoCode]);

  return (
    <Screen bg={colors.white}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <ActivityIndicator color={colors.violet} />
        <AppText>로그인하는 중…</AppText>
      </View>
    </Screen>
  );
}
