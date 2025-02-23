import { TrainingPlan, trainingPlanSchema } from '../types/TrainingPlan';

describe('TrainingPlan Structure', () => {
  it('should create a valid TrainingPlan object', () => {
    const plan: TrainingPlan = {
      planId: 'plan-001', // FirestoreのドキュメントID
      userId: 'user-123', // ユーザーID
      targetDate: '2025-06-01', // "YYYY-MM-DD"形式
      targetIncreaseRates: {
        chest: 10,
        shoulder: 8,
        back: 12,
        abs: 5,
        arm: 10,
        forearm: 7,
        leg: 20,
        calf: 5,
      },
      createdAt: new Date('2025-01-01'),
    };

    expect(plan.planId).toBe('plan-001');
    expect(plan.userId).toBe('user-123');
    expect(plan.targetDate).toBe('2025-06-01');
    expect(plan.targetIncreaseRates.chest).toBe(10);
    expect(plan.createdAt.toISOString()).toBe(new Date('2025-01-01').toISOString());
  });
});

describe('TrainingPlan Schema Validation', () => {
  it('should validate a correct TrainingPlan object', () => {
    const validPlan = {
      planId: 'plan-001',
      userId: 'user-123',
      targetDate: '2025-06-01',
      targetIncreaseRates: {
        chest: 10,
        shoulder: 8,
        back: 12,
        abs: 5,
        arm: 10,
        forearm: 7,
        leg: 20,
        calf: 5,
      },
      createdAt: new Date('2025-01-01'),
    };

    const result = trainingPlanSchema.safeParse(validPlan);
    expect(result.success).toBe(true);
  });

  it('should invalidate an incorrect TrainingPlan object', () => {
    const invalidPlan = {
      planId: 'plan-001',
      userId: 'user-123',
      targetDate: '2025/06/01', // 日付形式が不正 ("YYYY/MM/DD")
      targetIncreaseRates: {
        chest: "ten", // 数値ではなく文字列になっている
        shoulder: 8,
        back: 12,
        abs: 5,
        arm: 10,
        forearm: 7,
        leg: 20,
        calf: 5,
      },
      createdAt: new Date('2025-01-01'),
    };

    const result = trainingPlanSchema.safeParse(invalidPlan);
    expect(result.success).toBe(false);
  });
});