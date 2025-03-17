import { fetchNewLogin } from '@/api'

export async function POST(req: Request): Promise<Response> {
  try {
    const body: any = await req.json()
    const result = await fetchNewLogin(body)
    
    if (Object.keys(result).length > 0) {
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      return new Response(
        JSON.stringify({
          error:
            '登录失败，请联系客服',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: '登录失败，请联系客服',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
