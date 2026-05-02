import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname.startsWith('/login')

  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}