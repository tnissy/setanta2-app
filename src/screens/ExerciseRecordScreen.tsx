// src/screens/TrainingRecordScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { exerciseSchema, Exercise } from '../types/Exercise';
import { v4 as uuidv4 } from 'uuid';

const TrainingRecordScreen: React.FC = () => {
  const [exerciseId] = useState(uuidv4());
  const [workoutId] = useState('workout_1');
  const [exerciseTypeId, setExerciseTypeId] = useState('');
  const [order] = useState(1);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [method, setMethod] = useState('standard');
  const [status] = useState('planned');
  const [work, setWork] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSaveRecord = async () => {
    try {
      const newExercise: Exercise = {
        exerciseId,
        workoutId,
        exerciseTypeId,
        order,
        weight: Number(weight),
        reps: Number(reps),
        sets: Number(sets),
        method,
        status: 'planned',
        work: Number(work),
        feedback: feedback ? Number(feedback) : undefined,
      };

      const parsedExercise = exerciseSchema.parse(newExercise);
      await addDoc(collection(db, 'exercises'), parsedExercise);

      Alert.alert('成功', 'エクササイズ記録が保存されたよ！');
      
      setExerciseTypeId('');
      setWeight('');
      setReps('');
      setSets('');
      setMethod('standard');
      setWork('');
      setFeedback('');
    } catch (error: any) {
      console.error(error);
      Alert.alert('エラー', `データの保存に失敗: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>エクササイズ記録</Text>
      
      <TextInput
        style={styles.input}
        placeholder="種目ID（例: bench_press）"
        value={exerciseTypeId}
        onChangeText={setExerciseTypeId}
      />
      
      <TextInput
        style={styles.input}
        placeholder="重量 (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="レップ数"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="セット数"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="実施方法 (例: standard)"
        value={method}
        onChangeText={setMethod}
      />
      
      <TextInput
        style={styles.input}
        placeholder="仕事 (Joule)"
        value={work}
        onChangeText={setWork}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="フィードバック (1:物足りない, 2:いい感じ, 3:普通)"
        value={feedback}
        onChangeText={setFeedback}
        keyboardType="numeric"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSaveRecord}>
        <Text style={styles.buttonText}>記録を保存</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TrainingRecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});