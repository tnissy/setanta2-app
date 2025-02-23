import { 

// Language: typescript
  fetchWorkoutSession, 
  fetchPreviousExerciseData, 
  saveWorkoutSessionData, 
  fetchExerciseTypeList 
} from '../services/workoutService';
import { ExerciseRepository } from '../services/ExerciseRepository';

const exerciseRepository = new ExerciseRepository(); //

describe('WorkoutService tests', () => {
  describe('fetchWorkoutSession', () => {
    test('should return dummy workout session data with correct structure', async () => {
      const sessionData = await fetchWorkoutSession('test-session');
      expect(sessionData.workout.name).toBe("ダミーワークアウト");
      expect(Array.isArray(sessionData.workout.exercises)).toBe(true);
      expect(sessionData.workout.exercises.length).toBe(2);
    });
  });

  describe('fetchPreviousExerciseData', () => {
    test('should return an empty object for exercise id "1"', async () => {
      const data = await fetchPreviousExerciseData("1");
      expect(data).toEqual({});
    });
  
    test('should return null for an unknown exercise id', async () => {
      const data = await fetchPreviousExerciseData("999");
      expect(data).toBeNull();
    });
  });

  describe('saveWorkoutSessionData', () => {
    test('should log workout session data when saving', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const dummySession = {
        workout: {
          name: 'テストワークアウト',
          exercises: []
        }
      };
      await saveWorkoutSessionData(dummySession);
      expect(consoleSpy).toHaveBeenCalledWith('Mock saving workout session data:', dummySession);
      consoleSpy.mockRestore();
    });
  });

  describe('fetchExerciseTypeList', () => {
    test('should return an array from exercise type list', async () => {
      const list = await fetchExerciseTypeList();
      expect(Array.isArray(list)).toBe(true);
    });
  });
});