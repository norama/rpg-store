import { jsonResponse } from 'http/util/response'
import { select, update } from 'projects/rpg/api/proxy'
import { T } from 'pubsub/messages'
import { ITheme } from 'styles/theme'

export async function get() {
  const theme = await select<ITheme>(T.uiTheme)

  return jsonResponse({ theme })
}

export async function post({ request }) {
  if (request.headers.get('Content-Type') === 'application/json') {
    const { theme } = await request.json()

    await update<ITheme>(T.uiTheme, theme)

    return await get()
  } else {
    return new Response(null, { status: 400 })
  }
}
