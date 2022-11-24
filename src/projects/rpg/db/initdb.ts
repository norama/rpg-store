let firstCall = true

const initdb = async () => {
  if (firstCall) {
    if (import.meta.env.PUBLIC_DB === 'lowdb') {
      console.log('------ initdb --------')
      const { default: db } = await import('projects/rpg/db/lowdb')
      await db.init()
    }
    firstCall = false
  }
}

export default initdb
