import { db } from 'projects/rpg/db/supabase'

let firstCall = true

const initdb = async () => {
  if (firstCall) {
    switch (import.meta.env.DATABASE) {
      case 'lowdb': {
        console.log('------ init lowdb --------')
        await import('projects/rpg/db/lowdb')
        break
      }
      case 'supabase':
      default: {
        console.log('------ init supabase --------')
        db.init()
        //await import('projects/rpg/db/supabase')
        break
      }
    }
    firstCall = false
  }
}

export default initdb
