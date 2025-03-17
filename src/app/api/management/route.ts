import { baseAccountUrl } from '@/api/config'

export async function POST(req: Request): Promise<Response> {
  try {
    const body: any = await req.json()
    const url = body.url
    const data = body.data
    const method = body.method
    const cookie = req.headers.get('token') || ''
    const resp = await fetch(`${baseAccountUrl}${url}`, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
        cookie,
      },
      // credentials: 'include',
    })
    const json = await resp.json()

    if (Object.keys(json).length > 0) {
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      return new Response(
        JSON.stringify({
          error: '请求失败，请联系客服',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  } catch (error) {
    console.log(error)
    return new Response(
      JSON.stringify({
        error: '请求失败，请联系客服',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
