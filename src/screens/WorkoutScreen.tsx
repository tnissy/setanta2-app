import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { 
  fetchWorkoutSession, 
  saveWorkoutSessionData, 
  fetchExerciseTypeList, 
  ExerciseSet, 
  WorkoutSessionData 
} from '../services/workoutService';

const WorkoutSessionScreen2: React.FC = () => {
  const [sessionData, setSessionData] = useState<WorkoutSessionData | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sets, setSets] = useState<ExerciseSet[]>([]);
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<'未実施' | '完了'>('未実施');
  const [exerciseTypeList, setExerciseTypeList] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // ワークアウトセッションのデータ取得（ダミーデータ）
        const session = await fetchWorkoutSession('dummySessionId');
        setSessionData(session);
        // 初期状態として現在のエクササイズのセット情報等を設定
        if (session.workout.exercises.length > 0) {
          const current = session.workout.exercises[0];
          setSets(current.sets);
          setMemo(current.memo);
          setStatus(current.status);
        }
        // エクササイズタイプリストの取得
        const types = await fetchExerciseTypeList();
        setExerciseTypeList(types);
      } catch (error: any) {
        Alert.alert("Error", error.message);
      }
    };
    loadData();
  }, []);

  const currentExercise = sessionData ? sessionData.workout.exercises[currentExerciseIndex] : null;

  // セット情報の変更ハンドラ
  const handleSetChange = (index: number, field: 'weight' | 'reps', value: string) => {
    const updated = sets.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setSets(updated);
  };

  // 完了ボタン押下時の処理
  const handleCompleteExercise = async () => {
    if (!sessionData) return;
    // 現在のエクササイズのデータを更新
    const updatedExercises = [...sessionData.workout.exercises];
    updatedExercises[currentExerciseIndex] = {
      ...updatedExercises[currentExerciseIndex],
      sets,
      memo,
      status: '完了',
    };
    const updatedSession: WorkoutSessionData = {
      workout: {
        ...sessionData.workout,
        exercises: updatedExercises,
      },
    };
    try {
      await saveWorkoutSessionData(updatedSession);
      setSessionData(updatedSession);
      setStatus('完了');
      Alert.alert("成功", "エクササイズが完了しました！");
    } catch (error: any) {
      Alert.alert("エラー", error.message);
    }
  };

  // 未完了のエクササイズ数
  const remainingExercises = sessionData
    ? sessionData.workout.exercises.filter(ex => ex.status !== '完了').length
    : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sessionData?.workout.name || "ワークアウト名"}</Text>
      {currentExercise && (
        <Text style={styles.subtitle}>
          エクササイズ {currentExerciseIndex + 1} / {sessionData!.workout.exercises.length} : {currentExercise.exerciseType}
        </Text>
      )}

      <FlatList
        data={sets}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.setRow}>
            <Text>セット {index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="重量 (kg)"
              keyboardType="numeric"
              value={String(item.weight)}
              onChangeText={value => handleSetChange(index, 'weight', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="回数"
              keyboardType="numeric"
              value={String(item.reps)}
              onChangeText={value => handleSetChange(index, 'reps', value)}
            />
          </View>
        )}
      />

      <TextInput
        style={styles.memoInput}
        placeholder="メモ"
        value={memo}
        onChangeText={setMemo}
      />

      <Text style={styles.statusText}>ステータス: {status}</Text>
      <Text style={styles.remainingText}>未実施のエクササイズ: {remainingExercises}個</Text>

      <TouchableOpacity style={styles.completeButton} onPress={handleCompleteExercise}>
        <Text style={styles.buttonText}>完了</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutSessionScreen2;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 16 },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, width: 80, textAlign: 'center' },
  memoInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  statusText: { fontSize: 16, textAlign: 'center', marginVertical: 8 },
  remainingText: { fontSize: 16, textAlign: 'center', marginBottom: 16 },
  completeButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});