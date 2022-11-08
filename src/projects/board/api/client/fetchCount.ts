const fetchCount = async () => {
  console.log('client fetchCount SSR', import.meta.env.SSR)
  const response = await fetch('/api/board/tiles.json')
  const data = await response.json()
  return data.count
}

export default fetchCount
