import getRandomInt from 'projects/board/api/util/getRandomInt'

export async function get() {
  console.log('get count.json SSR', import.meta.env.SSR)
  const count = getRandomInt(10)

  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
