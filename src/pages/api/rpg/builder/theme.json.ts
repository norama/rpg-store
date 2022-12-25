import { jsonResponse } from 'http/util/response'
import { setTheme } from 'styles/theme'

export async function post({ request }) {
  if (request.headers.get('Content-Type') === 'application/json') {
    const { theme } = await request.json()

    console.log('setting theme', theme)

    setTheme(theme)

    return jsonResponse({ theme })
  } else {
    return new Response(null, { status: 400 })
  }
}
