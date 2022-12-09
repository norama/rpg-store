const startup = async (page: string) => {
  if (import.meta.env.PUBLIC_LOGGING === 'true') {
    await import('pubsub/log')
  }

  let transport: IBlockPage

  switch (page) {
    case 'races':
      const { default: Races } = await import('@transport/blocks/races')
      transport = new Races()
      console.log('=== > races')
      break
    case 'equipments':
      const { default: Equipments } = await import('@transport/blocks/equipments')
      transport = new Equipments()
      console.log('=== > equipments')
      break
    case 'advantages':
      const { default: Advantages } = await import('@transport/blocks/advantages')
      transport = new Advantages()
      console.log('=== > advantages')
      break
    case 'properties':
    default: {
      const { default: Properties } = await import('@transport/properties')
      transport = new Properties()
      console.log('=== > properties')
    }
  }

  await import('@stores/store')
  await import('@stores/business/rpgTarget')
  await import('@stores/business/rpgInfo')
  await transport.init()
}

export default startup
