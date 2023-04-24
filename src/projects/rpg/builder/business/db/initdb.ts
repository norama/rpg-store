let firstCall = true

const initdb = async () => {
  if (firstCall) {
    switch (import.meta.env.DATABASE) {
      case 'lowdb': {
        await import('./lowdb')
        break
      }
      case 'supabase':
      default: {
        await import('./supabase')
        break
      }
    }
    firstCall = false
  }
}

export default initdb
