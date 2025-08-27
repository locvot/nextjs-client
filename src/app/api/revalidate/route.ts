import revalidateApiRequest from '@/apiRequests/revalidate'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateApiRequest(tag!)
  return Response.json({ revalidated: true, now: Date.now() })
}
