import { z } from "zod";

export const exerciseSchema = z.object({
  exerciseId: z.string(), // エクササイズレコードのユニークID
  workoutId: z.string(), // workouts の workoutId
  exerciseTypeId: z.string(), // 種目 (スクワット等) を示すID
  order: z.number().int(), // ワークアウト内での並び順
  weight: z.number(), // 登録時の重量（float）
  reps: z.number().int(), // レップ数
  sets: z.number().int(), // セット数
  method: z.string(), // 実施方法 (standard, high_reps等)
  status: z.string(), // planned / completed / skippedなど
  work: z.number(), // 仕事をジュールで登録
  feedback: z.number().int().optional(), // 物足りない，いい感じ，普通 の3択（空欄可）
});

export type Exercise = z.infer<typeof exerciseSchema>;