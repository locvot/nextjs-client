import { NextRequest, NextResponse } from 'next/server'

const privatePaths = ['/manage']
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // User has not logged in -> dont let user enter private path
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // User logged in -> dont allow user acceess login page
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user logged in, but accessToken expired
  if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken && refreshToken) {
    const url = new URL('/logout', request.url)
    url.searchParams.set('refreshToken', refreshToken)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login']
}
