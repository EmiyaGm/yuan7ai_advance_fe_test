export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl: any = searchParams.get("imageUrl");
    const response = await fetch(decodeURIComponent(imageUrl))
    const blob = await response.blob()

    if (blob) {
      return new Response(blob, {
        status: 200,
        headers: {
          'Content-Disposition': `attachment`,
          'Content-Type': 'multipart/form-data',
        },
      })
    } else {
      return new Response(
        JSON.stringify({
          error: '失败',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(error)
    return new Response(
      JSON.stringify({
        error: '发起任务失败，请检查工作空间目录下的文件结构是否符合要求',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
