let firstCall = true

const initdb = async () => {
  if (firstCall) {
    switch (import.meta.env.DATABASE) {
      case 'lowdb': {
        console.log('------ init lowdb --------')
        await import('./lowdb')
        break
      }
      case 'supabase':
      default: {
        console.log('------ DASHBOARD init supabase --------')
        await import('./supabase')
        break
      }
    }
    firstCall = false
  }
}

export default initdb
