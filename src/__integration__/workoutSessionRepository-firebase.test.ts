import { WorkoutSessionRepository } from '../services/workoutSessionRepository';
import { BaseRepository } from '../services/baseRepository';
import { WorkoutSession } from '../types/workoutSessionEntity';

describe('firebase-workoutSessionRepository integration tests', () => {
  let repo: WorkoutSessionRepository;
  let baseRepo: BaseRepository;
  const testUserId = 'testUserFirebase'; // テスト用のFirebase認証UID

  // サンプルデータ: workoutSessionDataはnameとexercises（文字列の配列）で構成
  const sampleWorkoutSession: WorkoutSession = {
    workoutSessionData: [
      {
        name: 'main',
        exercises: ['Push-up', 'Squat'],
      },
    ],
  };

  beforeAll(async () => {
    // BaseRepositoryのシングルトンインスタンスを取得して初期化
    baseRepo = BaseRepository.getInstance();
//    await baseRepo.initialize();

    // テスト用ユーザーでログインする前に、正しい認証情報が設定されているか確認してね！
    await baseRepo.loginWithEmail(
      process.env.TEST_EMAIL,
      process.env.TEST_PASSWORD
    );

    // 初期化とログインが完了したら WorkoutSessionRepository のインスタンスを取得
    repo = WorkoutSessionRepository.getInstance();
  });

  beforeEach(async () => {
    // テスト前に既存のセッションをリセットするなど、必要な前処理を記述
    // 例: await repo.deleteWorkoutSession();
  });

  test('ワークアウトセッションを取得または作成できる', async () => {
    const session = await repo.getWorkoutSession();
    console.log(session);
    expect(session).toBeDefined();
    // workoutSessionDataが存在し、少なくとも1件あることを確認
    expect(session.workoutSessionData).toBeDefined();
    expect(session.workoutSessionData.length).toBeGreaterThanOrEqual(1);
  });

  test('ワークアウトセッションを部分更新できる', async () => {
    // 事前にワークアウトセッションを取得（または作成）しておく
    await repo.getWorkoutSession();
  
    const updateData: Partial<WorkoutSession> = {
      workoutSessionData: [
        {
          name: 'main',
          exercises: ['Push-up', 'Squat'], // 文字列の配列に更新
        },
      ],
    };
  
    await repo.updateWorkoutSession(updateData);
    const updatedSession = await repo.getWorkoutSession();
    console.log(updatedSession);
    // 更新後のデータ検証
    expect(updatedSession.workoutSessionData[0].exercises).toEqual(
      updateData.workoutSessionData![0].exercises
    );
  });

  afterAll(async () => {
    // テスト終了後、クリーンアップとしてログアウト
    await baseRepo.logout();
  });
});
