import type { Exercise } from "../types/Exercise";

export function suggestNextExercise(input: any): Exercise {
    // function implementation
    return {
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
}
