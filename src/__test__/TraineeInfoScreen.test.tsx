import React from 'react';
import { Dimensions } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TraineeInfoScreen from '../screens/TraineeInfoScreen';

// iPhone環境をシミュレーション（例: iPhone 8の解像度）
Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });

// モックの baseRepository を作成
const mockBaseRepository = {
  getTrainee: jest.fn(),
  updateTrainee: jest.fn(),
};

describe('TraineeInfoScreen (iPhone表示テスト)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('iPhone環境でトレイニー情報が正しく表示される', async () => {
    // 初回の getTrainee 呼び出しで返すデータをセット
    mockBaseRepository.getTrainee.mockResolvedValueOnce({
      name: 'Tatsuya',
      email: 'tatsuya@example.com',
      weight: 70,
    });

    const { getByText, getByDisplayValue } = render(
      <TraineeInfoScreen baseRepository={mockBaseRepository} />
    );

    // 読み込みが終わるまで待つ
    await waitFor(() => {
      expect(getByText('名前: Tatsuya')).toBeTruthy();
    });

    // 表示内容の検証
    expect(getByText('メール: tatsuya@example.com')).toBeTruthy();
    expect(getByDisplayValue('70')).toBeTruthy();
  });

  it('体重更新処理が正しく動作する', async () => {
    // 初回の getTrainee 呼び出し
    mockBaseRepository.getTrainee.mockResolvedValueOnce({
      name: 'Tatsuya',
      email: 'tatsuya@example.com',
      weight: 70,
    });
    // updateTrainee 呼び出し
    mockBaseRepository.updateTrainee.mockResolvedValueOnce(undefined);
    // 更新後の getTrainee 呼び出し（体重が変更された状態）
    mockBaseRepository.getTrainee.mockResolvedValueOnce({
      name: 'Tatsuya',
      email: 'tatsuya@example.com',
      weight: 75,
    });

    const { getByText, getByDisplayValue } = render(
      <TraineeInfoScreen baseRepository={mockBaseRepository} />
    );

    // 初回の読み込み完了を待つ
    await waitFor(() => {
      expect(getByText('名前: Tatsuya')).toBeTruthy();
    });

    // TextInput の値が '70' であることを確認して、'75' に変更
    const input = getByDisplayValue('70');
    fireEvent.changeText(input, '75');

    // 更新ボタンを押す
    const updateButton = getByText('更新');
    fireEvent.press(updateButton);

    // 更新後の表示を確認
    await waitFor(() => {
      expect(getByDisplayValue('75')).toBeTruthy();
    });
  });
});
