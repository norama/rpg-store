const fetchCount = async () => {
  console.log('client fetchCount SSR', import.meta.env.SSR)
  const response = await fetch('/api/board/count.json')
  const data = await response.json()
  return data.count
}

export default fetchCount
