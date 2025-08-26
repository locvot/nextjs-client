import { RoleValues } from '@/constants/type'
import z from 'zod'

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
  })
  .strict()

export const LoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.enum(RoleValues)
    })
  }),
  message: z.string()
})

export const LogoutBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  }),
  message: z.string()
})

export type LoginBodyType = z.TypeOf<typeof LoginBody>
export type LoginResType = z.TypeOf<typeof LoginRes>
export type LogoutBodyType = z.TypeOf<typeof LogoutBody>
export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>
export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>
