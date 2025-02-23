import { z } from "zod";

export const workoutSessionSchema = z.object({
  workoutSessionData: z.array(
    z.object({
      name: z.string(), // ワークアウト名
      exercises: z.array(z.string()), // 文字列の配列
    })
  ),
});

export type WorkoutSession = z.infer<typeof workoutSessionSchema>;