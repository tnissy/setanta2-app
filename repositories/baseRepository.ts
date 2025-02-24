import firebaseApp from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  updateDoc, 
  collection, 
  addDoc 
} from 'firebase/firestore';
import { TrainingPlan } from '../types/TrainingPlan';

export class BaseRepository {
  private static instance: BaseRepository;
  private auth = getAuth(firebaseApp);
  private db = getFirestore(firebaseApp);
  private user: User | null = this.auth.currentUser; // インスタンス生成時にキャッシュ

  // プライベートコンストラクタで new を禁止
  private constructor() {}

  // シングルトンインスタンスの取得
  static getInstance(): BaseRepository {
    if (!BaseRepository.instance) {
      BaseRepository.instance = new BaseRepository();
    }
    return BaseRepository.instance;
  }

  // 現在のユーザーを取得（キャッシュ済みのユーザーを返す）
  private getCurrentUser(): User {
    if (!this.user) throw new Error('認証ユーザーが見つかりません');
    return this.user;
  }

  // 認証処理: ログイン成功時にキャッシュを更新する
  async loginWithEmail(email: string, password: string) {
    if (!email) throw new Error('Email is required');
    try {
      console.log('Repository: signInWithEmailAndPassword 開始');
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.user = userCredential.user; // キャッシュを更新
      console.log('Repository: ログイン成功', userCredential.user.email);
      return userCredential;
    } catch (error) {
      console.error('Repository: ログイン失敗', error);
      throw error;
    }
  }

  // logout: firebaseからログアウトする
  async logout() {
    try {
      await signOut(this.auth);
      this.user = null;
      console.log('ログアウトしました');
    } catch (error) {
      console.error('ログアウトに失敗しました', error);
      throw error;
    }
  }

  // getTrainee: トレイニー文書を取得または作成する
  async getTrainee(): Promise<any> {
    const user = this.getCurrentUser();
    const traineeDocRef = doc(this.db, 'trainees', user.uid);
    const traineeSnap = await getDoc(traineeDocRef);
    
    if (traineeSnap.exists()) {
      console.log('トレイニーのドキュメントは既に存在します');
      return traineeSnap.data();
    }
    
    const traineeData = {
      name: user.displayName || '',
      email: user.email || '',
      weight: null,
      gender: 'other',
      createdAt: serverTimestamp(),
    };
    
    try {
      await setDoc(traineeDocRef, traineeData);
      console.log('トレイニーのドキュメントを作成しました:', traineeData);
      return traineeData;
    } catch (error) {
      console.error('トレイニーのドキュメント作成に失敗しました:', error);
      throw error;
    }
  }

  // updateTrainee: トレイニー情報の更新
  async updateTrainee(data: Partial<{ name: string; email: string; gender: string; weight: number }>): Promise<void> {
    const user = this.getCurrentUser();
    const traineeDocRef = doc(this.db, 'trainees', user.uid);
    await updateDoc(traineeDocRef, data);
  }

  // getTrainingPlan: トレーニングプラン文書を取得または作成する
  async getTrainingPlan(): Promise<TrainingPlan> {
    const user = this.getCurrentUser();
    const trainingPlanDocRef = doc(this.db, 'trainingPlans', user.uid);
    const trainingPlanSnap = await getDoc(trainingPlanDocRef);

    if (trainingPlanSnap.exists()) {
      console.log('トレーニングプランは既に存在します');
      return trainingPlanSnap.data() as TrainingPlan;
    }

    // スキーマに基づいたデフォルトのトレーニングプラン
    const defaultTrainingPlan: TrainingPlan = {
      planId: user.uid,
      userId: user.uid,
      targetDate: new Date(
        new Date().getFullYear() + 1, new Date().getMonth() + 1, 0
      ).toISOString().split('T')[0], // 1年後の月末日を"YYYY-MM-DD"形式に
      targetIncreaseRates: {
        chest: 10,
        shoulder: 0,
        back: 10,
        abs: 10,
        arm: 10,
        forearm: 0,
        leg: 10,
        calf: 0,
      },
      createdAt: new Date(),
    };

    try {
      await setDoc(trainingPlanDocRef, defaultTrainingPlan);
      console.log('トレーニングプランを作成しました:', defaultTrainingPlan);
      return defaultTrainingPlan;
    } catch (error) {
      console.error('トレーニングプラン作成に失敗しました:', error);
      throw error;
    }
  }

  // updateTrainingPlan: トレーニングプラン文書を更新する
  async updateTrainingPlan(updatedPlan: Partial<TrainingPlan>): Promise<void> {
    const user = this.getCurrentUser();
    const trainingPlanDocRef = doc(this.db, 'trainingPlans', user.uid);

    try {
      await updateDoc(trainingPlanDocRef, updatedPlan);
      console.log('トレーニングプランを更新しました:', updatedPlan);
    } catch (error) {
      console.error('トレーニングプラン更新に失敗しました:', error);
      throw error;
    }
  }

  // getUidAndDisplayName: 現在のユーザーのuidとdisplayNameを返す
  public getUidAndDisplayName(): { uid: string; displayName: string | null } {
    const user = this.getCurrentUser(); // 既に認証済みのUserオブジェクトを取得
    return { uid: user.uid, displayName: user.displayName };
  }
}