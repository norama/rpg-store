import getRandomInt from 'projects/board/api/util/getRandomInt'

const fetchCount = async () => {
  console.log('server fetchCount SSR', import.meta.env.SSR)
  return getRandomInt(10)
}

export default fetchCount
