import ThemeTransport from '@transport/theme'
import 'styles/theme'

const startup = async (page: string) => {
  if (import.meta.env.PUBLIC_LOGGING === 'true') {
    await import('pubsub/log')
  }

  await new ThemeTransport().init()

  await import('@business/store/target')
  await import('@business/store/properties')

  let transport: IBlockPage

  switch (page) {
    case 'races':
      await import('@business/blocks/races/store')
      const { default: Races } = await import('@business/blocks/races/transport')
      transport = new Races()
      console.log('=== > races')
      break
    case 'equipments':
      await import('@business/blocks/equipments/store')
      const { default: Equipments } = await import('@business/blocks/equipments/transport')
      transport = new Equipments()
      console.log('=== > equipments')
      break
    case 'advantages':
      await import('@business/blocks/advantages/store')
      const { default: Advantages } = await import('@business/blocks/advantages/transport')
      transport = new Advantages()
      console.log('=== > advantages')
      break
    case 'properties':
    default: {
      await import('@business/blocks/properties/store')
      const { default: Properties } = await import('@transport/properties')
      transport = new Properties()
      console.log('=== > properties')
    }
  }

  await import('@builder/ui/stores/blockAtom')
  await transport.init()
}

export default startup
