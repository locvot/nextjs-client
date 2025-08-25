import { Role } from '@/constants/type'
import z from 'zod'

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum([Role.Owner, Role.Employee]),
  avatar: z.string().nullable()
})

export const AccountRes = z
  .object({
    data: AccountSchema,
    message: z.string()
  })
  .strict()

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới không khớp',
        path: ['confirmPassword']
      })
    }
  })

export const UpdateMeBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    avatar: z.string().url().optional()
  })
  .strict()

export type AccountType = z.TypeOf<typeof AccountSchema>
export type AccountResType = z.TypeOf<typeof AccountRes>
export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>
export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>
