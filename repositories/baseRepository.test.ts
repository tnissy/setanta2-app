import { BaseRepository } from './baseRepository';
import { TrainingPlan } from '../src/types/TrainingPlan';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Language: typescript

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: () => new Date(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getFirestore: jest.fn(),
}));

describe('BaseRepository - getOrCreateTrainingPlan', () => {
  let repository: BaseRepository;
  const dummyUser = {
    uid: 'test-uid',
    displayName: 'Test User',
    email: 'test@example.com'
  };

  // Dummy doc reference returned by doc()
  const dummyDocRef = { id: 'dummy-doc' };
  (doc as jest.Mock).mockReturnValue(dummyDocRef);

  beforeEach(() => {
    repository = BaseRepository.getInstance();
    // Override the private getCurrentUser method to return dummyUser
    jest.spyOn<any, any>(repository, 'getCurrentUser').mockReturnValue(dummyUser);
    jest.clearAllMocks();
  });

  test('should return existing training plan if it exists', async () => {
    const existingPlan: TrainingPlan = {
      planId: dummyUser.uid,
      userId: dummyUser.uid,
      targetDate: '2023-12-31',
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

    // Mock getDoc to simulate that document exists
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => existingPlan,
    });

    const result = await repository.getOrCreateTrainingPlan();
    expect(getDoc).toHaveBeenCalledWith(dummyDocRef);
    expect(result).toEqual(existingPlan);
  });

  test('should create and return default training plan if none exists', async () => {
    // Mock getDoc to simulate that document does not exist
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });

    // Mock setDoc to resolve successfully
    (setDoc as jest.Mock).mockResolvedValue(undefined);

    const result = await repository.getOrCreateTrainingPlan();

    expect(getDoc).toHaveBeenCalledWith(dummyDocRef);
    expect(setDoc).toHaveBeenCalledTimes(1);
    // Verify that the default training plan has expected properties
    const defaultPlanArg = (setDoc as jest.Mock).mock.calls[0][1] as TrainingPlan;
    expect(defaultPlanArg.planId).toEqual(dummyUser.uid);
    expect(defaultPlanArg.userId).toEqual(dummyUser.uid);
    // targetDate should be a string in YYYY-MM-DD format
    expect(typeof defaultPlanArg.targetDate).toBe('string');
    expect(defaultPlanArg.targetIncreaseRates).toEqual({
      chest: 10,
      shoulder: 0,
      back: 10,
      abs: 10,
      arm: 10,
      forearm: 0,
      leg: 10,
      calf: 0,
    });
    expect(result).toEqual(defaultPlanArg);
  });

  // test('should throw error when setDoc fails during training plan creation', async () => {
  //   console.log('テスト開始: setDoc が失敗した場合のエラーハンドリング');
  
  //   // getDoc が false を返す（つまり、既存のトレーニングプランがない）
  //   const mockedGetDoc = getDoc as unknown as jest.Mock;
  //   mockedGetDoc.mockResolvedValue({
  //     exists: () => false,
  //   });
  //   console.log('getDoc モックのセット完了: getDoc は既存データなしを返す');
  
  //   const errorMsg = 'トレーニングプラン作成に失敗しました:';
  //   const mockedSetDoc = setDoc as unknown as jest.Mock;
  //   mockedSetDoc.mockRejectedValue(new Error(errorMsg));
  //   console.log(`setDoc モックのセット完了: setDoc 実行時にエラーをスローする (${errorMsg})`);
  
  //   // 一度 getOrCreateTrainingPlan を呼んでエラーをキャッチしてログ出力
  //   try {
  //     await repository.getOrCreateTrainingPlan();
  //   } catch (error) {
  //     console.log('エラーキャッチ:', error);
  //   }
  
  //   console.log('getDoc の呼び出し回数:', mockedGetDoc.mock.calls.length);
  //   console.log('setDoc の呼び出し回数:', mockedSetDoc.mock.calls.length);
  //   if (mockedSetDoc.mock.calls.length > 0) {
  //     console.log('setDoc の引数:', JSON.stringify(mockedSetDoc.mock.calls[0], null, 2));
  //   }
  
  //   // ここで再度エラーがスローされることを確認
  //   await expect(repository.getOrCreateTrainingPlan()).rejects.toThrow(errorMsg);
  //   expect(mockedGetDoc).toHaveBeenCalledWith(dummyDocRef);
  //   console.log('getDoc が呼ばれたか:', mockedGetDoc.mock.calls.length > 0);
  //   expect(mockedSetDoc).toHaveBeenCalled();
  //   console.log('setDoc が呼ばれたか:', mockedSetDoc.mock.calls.length > 0);
  
  //   console.log('テスト終了: setDoc が失敗した場合のエラーハンドリング');
  // });
});