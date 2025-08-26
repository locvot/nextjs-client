import authApiRequest from '@/apiRequests/auth'
import { EntityError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Remove first character `/` of path
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast.error(error?.payload?.message ?? 'Unknown Error', {
      duration: duration ?? 5000,
      position: 'top-right'
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('accessToken') : null)

export const getRefreshTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('refreshToken') : null)

export const setAccessTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('accessToken', value)

export const setRefreshTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('refreshToken', value)

// export const checkAndRefreshToken = async (param?: { onError?: () => void; onSuccess?: () => void }) => {
//   // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
//   // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
//   // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
//   const accessToken = getAccessTokenFromLocalStorage()
//   const refreshToken = getRefreshTokenFromLocalStorage()
//   // Chưa đăng nhập thì cũng không cho chạy
//   if (!accessToken || !refreshToken) return
//   const decodedAccessToken = jwt.decode(accessToken) as {
//     exp: number
//     iat: number
//   }
//   const decodedRefreshToken = jwt.decode(refreshToken) as {
//     exp: number
//     iat: number
//   }
//   // Thời điểm hết hạn của token là tính theo epoch time (s)
//   // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
//   const now = Math.round(new Date().getTime() / 1000)
//   // trường hợp refresh token hết hạn thì không xử lý nữa
//   if (decodedRefreshToken.exp <= now) return
//   // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
//   // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
//   // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
//   // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
//   if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
//     // Gọi API refresh token
//     try {
//       const res = await authApiRequest.refreshToken()
//       setAccessTokenToLocalStorage(res.payload.data.accessToken)
//       setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
//       param?.onSuccess && param.onSuccess()
//     } catch (error) {
//       param?.onError && param.onError()
//     }
//   }
// }

export const checkAndRefreshToken = async (param?: { onError?: () => void; onSuccess?: () => void }) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  // If user has not logged in -> dont run this func
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = jwt.decode(accessToken) as { exp: number; iat: number }
  const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number }
  // Exp of token (second), new Date().getTime() (ms)
  const now = Math.round(new Date().getTime() / 1000)
  // RT expired => return
  if (decodedRefreshToken.exp <= now) return
  // Assume Exp of AT is 10s
  // Check 1/3 time -> get RT
  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    try {
      const res = await authApiRequest.refreshToken()
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      param?.onError && param.onError()
    }
  }
}
