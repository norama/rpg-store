let firstCall = true

const initdb = async () => {
  if (firstCall) {
    switch (import.meta.env.DATABASE) {
      case 'lowdb': {
        console.log('------ init lowdb --------')
        await import('projects/rpg/db/lowdb')
        break
      }
      case 'supabase': {
        console.log('------ init supabase --------')
        await import('projects/rpg/db/supabase')
        break
      }
    }
    firstCall = false
  }
}

export default initdb
