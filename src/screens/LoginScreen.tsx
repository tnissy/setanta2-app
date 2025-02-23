import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BaseRepository } from '../services/baseRepository';

type RootStackParamList = {
  Login: undefined;
  HomeTabs: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  baseRepository: BaseRepository;
};

const LoginScreen: React.FC<Props> = ({ baseRepository }) => {
  const [email, setEmail] = useState<string>('mo2.ayase@gmail.com');
  const [password, setPassword] = useState<string>('test4545');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async (): Promise<void> => {
    try {
      const userCredential = await baseRepository.loginWithEmail(email, password);
      Alert.alert('ログイン成功', `ようこそ ${userCredential.user.email} さん！`);
      navigation.navigate('HomeTabs');
    } catch (error: any) {
      Alert.alert('ログインエラー', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>セタンタ トレアプリ ログイン</Text>
      <TextInput
        style={styles.input}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ログイン</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeTabs')}>
        <Text style={styles.buttonText}>ホーム画面へ</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

// BaseRepository のインスタンスを生成して注入
const repository = BaseRepository.getInstance();
export default () => <LoginScreen baseRepository={repository} />;