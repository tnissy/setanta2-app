import { suggestNextExercise } from '../services/exerciseService';
import { Exercise } from '../types/Exercise';

describe('suggestNextExercise', () => {
  const expected: Exercise = {
    exerciseId: "exerciseId",
    workoutId: "work1",
    exerciseTypeId: "bench_press",
    order: 1,
    weight: 100.5,
    reps: 10,
    sets: 3,
    method: "standard",
    status: "planned",
    work: 200,
    feedback: 2,
  };

  test('前回のエクササイズがある場合の提案', () => {
    const previousExercise: Exercise = {
      exerciseId: "ex1",
      workoutId: "w1",
      exerciseTypeId: "bench_press",
      order: 1,
      weight: 50,
      reps: 8,
      sets: 3,
      method: "standard",
      status: "completed",
      work: 500,
      feedback: 2,
    };
    const input = {
      bodyWeight: 70,
      chestSetting: 55,
      previousExercise: previousExercise,
    };

    const result: Exercise = suggestNextExercise(input);
    expect(result).toEqual(expected);
  });

  test('hypertrophy プラン（前回エクササイズあり）の場合', () => {
    const previousExercise: Exercise = {
      exerciseId: "ex2",
      workoutId: "w2",
      exerciseTypeId: "deadlift",
      order: 1,
      weight: 100,
      reps: 5,
      sets: 3,
      method: "standard",
      status: "completed",
      work: 800,
      feedback: 3,
    };
    const input = {
      bodyWeight: 80,
      chestSetting: 60,
      previousExercise: previousExercise,
    };

    const result: Exercise = suggestNextExercise(input);
    expect(result).toEqual(expected);
  });

  test('未対応のトレーニングプランの場合のデフォルト提案', () => {
    const previousExercise: Exercise = {
      exerciseId: "ex3",
      workoutId: "w3",
      exerciseTypeId: "yoga",
      order: 1,
      weight: 0,
      reps: 10,
      sets: 1,
      method: "standard",
      status: "completed",
      work: 0,
      feedback: 1,
    };
    const input = {
      bodyWeight: 65,
      chestSetting: 50,
      previousExercise: previousExercise,
    };

    const result: Exercise = suggestNextExercise(input);
    expect(result).toEqual(expected);
  });
});