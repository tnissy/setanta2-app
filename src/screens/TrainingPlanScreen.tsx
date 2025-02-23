import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { BaseRepository } from '../services/baseRepository';
import { TrainingPlan } from '../types/TrainingPlan';

const baseRepository = BaseRepository.getInstance();

const TrainingPlanInputForm: React.FC = () => {
  const [chest, setChest] = React.useState('');
  const [shoulder, setShoulder] = React.useState('');
  const [back, setBack] = React.useState('');
  const [abs, setAbs] = React.useState('');
  const [arm, setArm] = React.useState('');
  const [forearm, setForearm] = React.useState('');
  const [leg, setLeg] = React.useState('');
  const [calf, setCalf] = React.useState('');
  const [targetDate, setTargetDate] = React.useState(new Date().toISOString().slice(0, 10));

  // 初期データ取得
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plan = await baseRepository.getTrainingPlan();
        if (plan) {
          // 取得したプランでフォームを初期化
          setChest(String(plan.targetIncreaseRates.chest));
          setShoulder(String(plan.targetIncreaseRates.shoulder));
          setBack(String(plan.targetIncreaseRates.back));
          setAbs(String(plan.targetIncreaseRates.abs));
          setArm(String(plan.targetIncreaseRates.arm));
          setForearm(String(plan.targetIncreaseRates.forearm));
          setLeg(String(plan.targetIncreaseRates.leg));
          setCalf(String(plan.targetIncreaseRates.calf));
          setTargetDate(plan.targetDate);
        }
      } catch (error) {
        console.error("Error fetching training plan:", error);
      }
    };
    fetchPlan();
  }, []);

  const handleSubmit = async () => {
    const trainingPlan: TrainingPlan = {
      planId: "", // 必要ならIDをセット
      userId: "dummyUser", // 実際のユーザーIDに変更
      targetDate,
      targetIncreaseRates: {
        chest: Number(chest),
        shoulder: Number(shoulder),
        back: Number(back),
        abs: Number(abs),
        arm: Number(arm),
        forearm: Number(forearm),
        leg: Number(leg),
        calf: Number(calf),
      },
      createdAt: new Date(),
    };

    try {
      // 更新メソッドを呼ぶ
      await baseRepository.updateTrainingPlan(trainingPlan);
      Alert.alert("成功", "トレーニング計画が更新されました！");
    } catch (error) {
      console.error("Error updating training plan:", error);
      Alert.alert("エラー", "トレーニング計画の更新に失敗しました。");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.form}>
      <Text style={styles.subtitle}>目標日</Text>
      <TextInput
        style={styles.input}
        value={targetDate}
        onChangeText={setTargetDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.subtitle}>部位ごとの目標増加率 (%)</Text>

      <Text>胸</Text>
      <TextInput
        style={styles.input}
        value={chest}
        onChangeText={setChest}
        placeholder="例: 8"
        keyboardType="numeric"
      />

      <Text>肩</Text>
      <TextInput
        style={styles.input}
        value={shoulder}
        onChangeText={setShoulder}
        placeholder="例: 7"
        keyboardType="numeric"
      />

      <Text>背中</Text>
      <TextInput
        style={styles.input}
        value={back}
        onChangeText={setBack}
        placeholder="例: 9"
        keyboardType="numeric"
      />

      <Text>腹筋</Text>
      <TextInput
        style={styles.input}
        value={abs}
        onChangeText={setAbs}
        placeholder="例: 6"
        keyboardType="numeric"
      />

      <Text>上腕</Text>
      <TextInput
        style={styles.input}
        value={arm}
        onChangeText={setArm}
        placeholder="例: 8"
        keyboardType="numeric"
      />

      <Text>前腕</Text>
      <TextInput
        style={styles.input}
        value={forearm}
        onChangeText={setForearm}
        placeholder="例: 5"
        keyboardType="numeric"
      />

      <Text>大腿</Text>
      <TextInput
        style={styles.input}
        value={leg}
        onChangeText={setLeg}
        placeholder="例: 10"
        keyboardType="numeric"
      />

      <Text>下腿</Text>
      <TextInput
        style={styles.input}
        value={calf}
        onChangeText={setCalf}
        placeholder="例: 4"
        keyboardType="numeric"
      />

      <Button title="保存" onPress={handleSubmit} />
    </ScrollView>
  );
};

const TrainingPlanScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <TrainingPlanInputForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
});

export default TrainingPlanScreen;