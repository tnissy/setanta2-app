import { BaseRepository } from '../services/baseRepository';

describe('firebase-baseRepository のテスト', () => {

    test('トレイニー情報を正しく取得できる', async () => {
        const repo = BaseRepository.getInstance();
        await repo.loginWithEmail(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);
        const traineeData = await repo.getTrainee();
        expect(traineeData).toBeDefined();
        console.log(traineeData);
    });

    // test('トレイニー情報を取得できない', async () => {
    //     const repo = BaseRepository.getInstance();
    //     try {
    //         await repo.loginWithEmail('test@example.com', 'password123');
    //     } catch (error) {
    //         // 無効な認証エラーをキャッチして無視する
    //     }
    //     const traineeData = await repo.getTrainee();
    //     expect(traineeData).toBeNull();
    // });
    afterAll(async () => {
        const repo = BaseRepository.getInstance();
        await repo.logout();  // logout メソッドが存在する場合は接続を終了
    });


});