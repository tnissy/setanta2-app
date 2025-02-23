import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // ← あなたのdb設定をimport
import { StackNavigationProp } from '@react-navigation/stack';

interface TrainingRecord {
  id: string;
  createdAt: Date;
  exerciseName: string;
  notes: string;
  reps: number;
  sets: number;
  weight: number;
}

type RootStackParamList = {
  TrainingHistory: undefined;
  Record: undefined;
};

type TrainingHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TrainingHistory'
>;

const TrainingHistoryScreen: React.FC = () => {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<TrainingHistoryScreenNavigationProp>();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // Firestoreのコレクション名を確認
        const recordsRef = collection(db, 'trainingRecords');

        // createdAt でソートしたい場合
        // 注意: Firestore のセキュリティルールによっては index が必要
        const q = query(recordsRef, orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(q);
        const recs: TrainingRecord[] = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();
          recs.push({
            id: doc.id,
            // createdAt が Firestore の Timestamp の場合は toDate() でJSのDate型に変換
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            exerciseName: data.exerciseName ?? '',
            notes: data.notes ?? '',
            reps: data.reps ?? 0,
            sets: data.sets ?? 0,
            weight: data.weight ?? 0,
          });
        });

        setRecords(recs);
      } catch (error) {
        console.error('Error fetching training records: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const renderItem = ({ item }: { item: TrainingRecord }) => (
    <View style={styles.itemContainer}>
      {/* createdAtをローカルタイムの文字列にしたいなら toLocaleString() など */}
      <Text style={styles.itemDate}>{item.createdAt.toLocaleString()}</Text>
      <Text style={styles.itemText}>種目: {item.exerciseName}</Text>
      <Text style={styles.itemText}>重量: {item.weight} kg</Text>
      <Text style={styles.itemText}>レップ: {item.reps}</Text>
      <Text style={styles.itemText}>セット: {item.sets}</Text>
      {item.notes ? <Text style={styles.itemText}>メモ: {item.notes}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>トレーニング履歴</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>トレーニング履歴がありません</Text>}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Record')}>
        <Text style={styles.buttonText}>記録画面へ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default TrainingHistoryScreen;