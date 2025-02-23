import firebaseApp from '../firebaseConfig';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Firestore
} from 'firebase/firestore';
import { WorkoutSession } from '../types/workoutSessionEntity';
import { BaseRepository } from './baseRepository';

export class WorkoutSessionRepository {
  private static instance: WorkoutSessionRepository;
  private db: Firestore;
  private uid: string;
  private displayName: string;

  private constructor() {
    this.db = getFirestore(firebaseApp);
    const { uid, displayName } = BaseRepository.getInstance().getUidAndDisplayName();
    this.uid = uid;
    this.displayName = displayName ?? '';
  }

  public static getInstance(): WorkoutSessionRepository {
    if (!WorkoutSessionRepository.instance) {
      WorkoutSessionRepository.instance = new WorkoutSessionRepository();
    }
    return WorkoutSessionRepository.instance;
  }

  /**
   * 現在認証されているユーザのワークアウトセッションを取得。
   * 存在しなければ、新規作成して返す。
   * ドキュメントIDを uid に固定することで、1ユーザ=1ドキュメントを実現。
   */
  public async getWorkoutSession(): Promise<WorkoutSession> {
    const docRef = doc(this.db, 'workoutSessions', this.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('既存のワークアウトセッションが見つかりました:', this.uid);
      return docSnap.data() as WorkoutSession;
    } else {
      console.log('ワークアウトセッションが存在しないため、新規作成します:', this.uid);
      const newSession: WorkoutSession = {
        workoutSessionData: [
          {
            name: 'main',
            exercises: [],
          },
        ],
      };

      await setDoc(docRef, newSession);
      return newSession;
    }
  }

  /**
   * 現在認証されているユーザのワークアウトセッションを部分更新する
   */
  public async updateWorkoutSession(updatedData: Partial<WorkoutSession>): Promise<void> {
    const docRef = doc(this.db, 'workoutSessions', this.uid);
    await updateDoc(docRef, updatedData);
    console.log('ワークアウトセッションを更新しました:', this.uid, updatedData);
  }
}
