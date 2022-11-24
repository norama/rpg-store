let firstCall = true

const initdb = async () => {
  if (firstCall) {
    if (import.meta.env.PUBLIC_DB === 'lowdb') {
      console.log('------ initdb --------')
      await import('projects/rpg/db/lowdb')
    }
    firstCall = false
  }
}

export default initdb
