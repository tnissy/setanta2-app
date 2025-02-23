import { z } from 'zod';

export const userSchema = z.object({
  userId: z.string(), // firebaseのユーザーID
  name: z.string().max(50),  // ユーザー名（最大50文字）
  weight: z.number()
    .min(20)
    .max(200)
    .multipleOf(0.1), // 体重（20kg〜200kg、小数点1桁まで）
  gender: z.enum(['male', 'female', 'other']), // 性別（英語表記）
});

export type Trainee = z.infer<typeof userSchema>;