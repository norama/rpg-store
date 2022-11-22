const loadMirage = async () => {
  console.log('import.meta.env.PUBLIC_MIRAGE', import.meta.env.PUBLIC_MIRAGE)
  if (import.meta.env.PUBLIC_MIRAGE === 'true') {
    console.log('---> MIRAGE START', import.meta.env.SSR)
    const loadMockServer = async () => {
      const { server } = await import('projects/rpg/mirage/server')
      console.log('---> MIRAGE IMPORTED', import.meta.env.SSR)
      server()
      console.info('running mock server with miragejs')
    }
    await loadMockServer()
  }
}

export default loadMirage
