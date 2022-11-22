import { belongsTo, createServer, Model, Server } from 'miragejs'
import { ModelInstance, ModelDefinition, Registry } from 'miragejs/-types'
import Schema from 'miragejs/orm/schema'

const TileModel: ModelDefinition<ITile> = Model.extend({})

type AppRegistry = Registry<{ tile: typeof TileModel }, {}>
type AppSchema = Schema<AppRegistry>

// @ts-ignore
const API_URL = import.meta.env.PUBLIC_RPG_URL
console.log('MIRAGE API_URL', API_URL)

const tiles = [
  { id: 'Race', name: 'My Race' },
  { id: 'Occupation', name: 'My Occupation' },
  { id: 'Abilities', name: 'My Abilities' },
  { id: 'Symbols', name: 'My Symbols' },
]

export const server = function () {
  console.log('MIRAGE SERVER SETUP')
  createServer({
    models: {
      tile: TileModel,
    },
    routes() {
      this.urlPrefix = API_URL
      this.get('/tiles', async (schema: AppSchema, request) => {
        console.log('------------------- MIRAGE: /tiles')
        return {
          tiles,
        }
      })
    },
  })
}
