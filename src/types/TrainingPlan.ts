import { z } from "zod";

export const trainingPlanSchema = z.object({
    planId: z.string(), // FirestoreのドキュメントID
    userId: z.string(), // ユーザーID（Firebase AuthenticationのUID）
    targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // "YYYY-MM-DD" 形式
    targetIncreaseRates: z.object({
        chest: z.number().min(0).max(100),
        shoulder: z.number().min(0).max(100),
        back: z.number().min(0).max(100),
        abs: z.number().min(0).max(100),
        arm: z.number().min(0).max(100),
        forearm: z.number().min(0).max(100),
        leg: z.number().min(0).max(100),
        calf: z.number().min(0).max(100),
    }),
    createdAt: z.date(),
});

export type TrainingPlan = z.infer<typeof trainingPlanSchema>;