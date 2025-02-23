import exerciseTypeList from '../assets/exerciseTypeList.json';
//import { workoutSessionData } from '../types/workoutSessionEntity';
import { WorkoutSessionRepository } from '../services/workoutSessionRepository';

export interface ExerciseSet {
  weight: number | string;
  reps: number | string;
}

export interface ExerciseSession {
  id: string;
  exerciseType: string;
  sets: ExerciseSet[];
  memo: string;
  status: '未実施' | '完了';
}

export interface WorkoutSessionData {
  workout: {
    name: string;
    exercises: ExerciseSession[];
  };
}

// ここでリポジトリのインスタンスを生成（DIコンテナを使って管理する方法もあるね）
const workoutSessionRepository = WorkoutSessionRepository.getInstance();

/**
 * ダミーのワークアウトセッションデータを返す関数
 */
export const fetchWorkoutSession = async (sessionId: string): Promise<WorkoutSessionData> => {
  const sessionData: WorkoutSessionData = {
    workout: {
      name: "ダミーワークアウト",
      exercises: [
        {
          id: "1",
          exerciseType: "Push-Ups",
          sets: [{ weight: 0, reps: 10 }],
          memo: "ダミーメモ",
          status: "未実施"
        },
        {
          id: "2",
          exerciseType: "Squats",
          sets: [{ weight: 0, reps: 15 }],
          memo: "ダミーメモ",
          status: "未実施"
        }
      ]
    }
  };

  if (!sessionData) {
    throw new Error('Workout session not found');
  }
  return sessionData;
};

/**
 * 指定されたエクササイズIDに対して、前回の実施データをダミーで返す関数
 * （今回は簡略化しているが、必要に応じて詳細なデータに拡張可能）
 */
export const fetchPreviousExerciseData = async (
  exerciseId: string
): Promise<Partial<ExerciseSession> | null> => {
  const dummyData: { [key: string]: Partial<ExerciseSession> } = {
    '1': { /* 前回のデータがあればここに記述 */ },
    '2': { /* 前回のデータがあればここに記述 */ },
    // 追加可能
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyData[exerciseId] || null);
    }, 500);
  });
};

/**
 * ワークアウトセッションのデータを保存する処理（モック実装）
 * 実際のDB保存は行わず、コンソール出力で代用
 */
export const saveWorkoutSessionData = async (
  sessionData: WorkoutSessionData
): Promise<void> => {
  console.log('Mock saving workout session data:', sessionData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

/**
 * ダミーのエクササイズタイプリストを返す関数
 * （src/assets/exerciseTypeList.json の内容を返却）
 */
export const fetchExerciseTypeList = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(exerciseTypeList);
    }, 300);
  });
};