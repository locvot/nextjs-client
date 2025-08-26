import authApiRequest from '@/apiRequests/auth'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  const cookieStores = await cookies()
  const refreshToken = cookieStores.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json(
      {
        message: 'Cannot find refreshToken'
      },
      {
        status: 401
      }
    )
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken })

    const decodedAccessToken = jwt.decode(payload.data.accessToken) as { exp: number }

    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number }

    cookieStores.set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000
    })

    cookieStores.set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000
    })
    return Response.json(payload)
  } catch (error: any) {
    return Response.json(
      {
        message: error.message ?? 'Error occured'
      },
      {
        status: 401
      }
    )
  }
}
