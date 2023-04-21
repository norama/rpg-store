import ThemeTransport from '@transport/theme'
import 'styles/theme'

const startup = async (page: string) => {
  if (import.meta.env.PUBLIC_LOGGING === 'true') {
    await import('pubsub/log')
  }

  await new ThemeTransport().init()

  await import('@business/store/target.ts')
  await import('@business/store/properties.ts')

  let transport: IBlockPage

  switch (page) {
    case 'races':
      await import('@business/blocks/races/store.ts')
      const { default: Races } = await import('@business/blocks/races/transport.ts')
      transport = new Races()
      console.log('=== > races')
      break
    case 'equipments':
      await import('@business/blocks/equipments/store.ts')
      const { default: Equipments } = await import('@business/blocks/equipments/transport.ts')
      transport = new Equipments()
      console.log('=== > equipments')
      break
    case 'advantages':
    case 'advantagesTransfer':
      await import('@business/blocks/advantages/store.ts')
      const { default: Advantages } = await import('@business/blocks/advantages/transport.ts')
      transport = new Advantages()
      console.log('=== > advantages')
      break
    case 'properties':
    default: {
      await import('@business/blocks/properties/store.ts')
      const { default: Properties } = await import('@transport/properties.ts')
      transport = new Properties()
      console.log('=== > properties')
    }
  }

  await import('@builder/ui/stores/blockAtom.ts')
  await transport.init()
  transport.publish()
}

export default startup
