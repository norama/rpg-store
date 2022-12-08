const startup = async (page: string) => {
  if (import.meta.env.PUBLIC_LOGGING === 'true') {
    await import('pubsub/log')
  }

  let transport: IBlockPage

  switch (page) {
    case 'properties':
    default: {
      const { default: Properties } = await import('@transport/properties')
      transport = new Properties()
      console.log('=== > properties')
    }
  }

  await import('@stores/store')
  await import('@stores/target')
  await transport.init()
}

export default startup
