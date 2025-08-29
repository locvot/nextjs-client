'use client'

import socket from '@/lib/socket'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENICATED_PATH = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (UNAUTHENICATED_PATH.includes(pathname)) return
    let interval: any = null

    const onRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval)
          router.push('/login')
        },
        force
      })
    }

    onRefreshToken()
    const TIMEOUT = 1000
    interval = setInterval(onRefreshToken, TIMEOUT)

    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true)
    }
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('refresh-token', onRefreshTokenSocket)
    return () => {
      clearInterval(interval)
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('refresh-token', onRefreshTokenSocket)
    }
  }, [pathname, router])
  return null
}
