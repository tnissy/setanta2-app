import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, Button } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
  const router = useRouter();
  // ここでは定数で認証状態を管理。実際はグローバルな認証管理に置き換える想定。
  const isAuthenticated = false;

  useEffect(() => {
    if (isAuthenticated) {
      // 認証済みなら (tabs) に遷移
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);
  return (
    <>
      <Stack.Screen options={{ title: 'Setanta!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">認証がないのでログイン画面にきたよ</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">宅トレずんずん</ThemedText>
        </Link>
      </ThemedView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
      {/* ログイン処理があれば、ボタンで認証状態を更新するなど */}
      <Button title="ログインする" onPress={() => { /* ログイン処理 */ }} />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
