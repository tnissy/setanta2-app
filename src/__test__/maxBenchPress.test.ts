import { maxBenchPress } from '../services/maxBenchPress';

describe('maxBenchPress', () => {
  test('55歳, 男性, 中級者, 体重55kg の場合、最大ベンチプレス重量が約47.19kgになる', () => {
    const result = maxBenchPress(55, 55, 'male', 'intermediate');
    expect(result).toBeCloseTo(47.19, 2);
  });
});
