import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/apiRequests/auth'

const UNAUTHENICATED_PATH = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()
  useEffect(() => {
    if (UNAUTHENICATED_PATH.includes(pathname)) return
    let interval: any = null
    const checkAndRefreshToken = async () => {
      // Do not put AT and RT out of this function 'checkAndRefreshToken'
      // Because every time checkAndRefreshToken function call -> we will have new AT and RT
      // Avoid bug of getting old AT and RT at first time then call function next time
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
        } catch (error) {
          clearInterval(interval)
        }
      }
    }
    checkAndRefreshToken()
    const TIMEOUT = 1000
    interval = setInterval(checkAndRefreshToken, TIMEOUT)
    return () => {
      clearInterval(interval)
    }
  }, [pathname])
  return null
}
