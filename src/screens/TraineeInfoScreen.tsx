import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { BaseRepository } from '../services/baseRepository';

// Trainee型の定義（必要に応じてFirebaseのTimestamp型などに変更してね）
interface Trainee {
  weight: number | string;
  name: string;
  email: string;
  gender: string;
  createdAt: any; // 編集不可なので表示のみで使う
}

// // BaseRepository の型定義
// type BaseRepository = {
//   getTrainee: () => Promise<Trainee>;
//   updateTrainee: (data: Trainee) => Promise<void>;
// };

// コンポーネントの props 型定義
type Props = {
  baseRepository: BaseRepository;
};

const TraineeInfoScreen: React.FC<Props> = ({ baseRepository }) => {
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [loading, setLoading] = useState(true);

  // トレイニー情報を取得する関数
  const fetchTraineeData = async () => {
    try {
      const data = await baseRepository.getTrainee();
      setTrainee(data);
    } catch (error: any) {
      Alert.alert('エラー', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraineeData();
  }, []);

  // 更新処理：入力された全フィールドを更新する
  const handleUpdate = async () => {
    if (!trainee) return;
    // 体重は数値としてバリデート
    const parsedWeight = parseFloat(String(trainee.weight));
    if (isNaN(parsedWeight)) {
      Alert.alert('エラー', '体重は数値で入力してください');
      return;
    }
    // 更新対象のフィールドだけをまとめる（createdAtは更新対象外）
    const updatedTrainee = {
      name: trainee.name,
      email: trainee.email,
      gender: trainee.gender,
      weight: parsedWeight,
    };
    try {
      await baseRepository.updateTrainee(updatedTrainee);
      Alert.alert('成功', '情報を更新しました');
      // 更新後に最新の情報を再取得
      fetchTraineeData();
    } catch (error: any) {
      Alert.alert('エラー', error.message);
    }
  };




  if (loading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 名前 */}
      <Text style={styles.label}>名前:</Text>
      <TextInput
        style={styles.input}
        value={trainee?.name}
        onChangeText={(text) => setTrainee({ ...trainee!, name: text })}
      />

      {/* メール */}
      <Text style={styles.label}>メール:</Text>
      <TextInput
        style={styles.input}
        value={trainee?.email}
        onChangeText={(text) => setTrainee({ ...trainee!, email: text })}
      />

      {/* 性別 */}
      <Text style={styles.label}>性別:</Text>
      <TextInput
        style={styles.input}
        value={trainee?.gender}
        onChangeText={(text) => setTrainee({ ...trainee!, gender: text })}
      />

      {/* 体重 */}
      <Text style={styles.label}>体重 (kg):</Text>
      <TextInput
        style={styles.input}
        value={trainee?.weight ? String(trainee.weight) : ''}
        onChangeText={(text) => setTrainee({ ...trainee!, weight: text })}
        keyboardType="decimal-pad"
      />

      {/* 登録日時は編集不可 */}
      <Text style={styles.label}>
        登録日時: {trainee?.createdAt?.toDate ? trainee.createdAt.toDate().toLocaleString() : '不明'}
      </Text>

      <Button title="更新" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 10 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 4, 
    padding: 10, 
    marginBottom: 15 
  },
});

const repository = BaseRepository.getInstance();
export default () => <TraineeInfoScreen baseRepository={repository} />;