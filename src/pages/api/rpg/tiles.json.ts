export const tiles = [
  { id: 'Race', name: 'My Race' },
  { id: 'Occupation', name: 'My Occupation' },
  { id: 'Abilities', name: 'My Abilities' },
  { id: 'Symbols', name: 'My Symbols' },
]

export async function get() {
  console.log('get tiles.json SSR', import.meta.env.SSR)

  return new Response(JSON.stringify({ tiles }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
