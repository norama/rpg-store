import { createClient, SupabaseClient } from '@supabase/supabase-js'

import PubSub from 'pubsub-js'
import { T, msgRequest, msgResponse, apiSelect, apiUpdate } from 'pubsub/messages'

const blockValueTable = (type: IBlockType) => {
  switch (type) {
    case 'races':
      return 'rpgRaces'
    case 'advantages':
      return 'rpgAdvantages'
    case 'equipments':
      return 'rpgEquipments'
    default:
      throw new Error('unknown block type: ' + type)
  }
}

const blockInfoTable = (type: IBlockType) => {
  switch (type) {
    case 'races':
      return 'races'
    case 'advantages':
      return 'advantages'
    case 'equipments':
      return 'equipments'
    default:
      throw new Error('unknown block type: ' + type)
  }
}

const uiRpgCharacter = (c: any) =>
  ({
    id: c.id,
    properties: uiProperties(c),
    races: uiBlock(c.rpgRaces, 'races'),
    advantages: uiBlock(c.rpgAdvantages, 'advantages'),
    equipments: uiBlock(c.rpgEquipments, 'equipments'),
  } as IRpgCharacter)

const uiProperties = (c: any) =>
  ({
    name: c.name,
    points: c.points,
    money: c.money,
  } as IProperties)

const uiBlock = (c: any, block: IBlockType) =>
  ({
    [block]: c.map(({ value }) => value),
  } as IBlockRaces | IBlockAdvantages | IBlockEquipments)

const uiInfo = (c: any, block: IBlockType) =>
  c.reduce((acc, v) => {
    acc[v.id] = v
    return acc
  }, {}) as IInfoRaces | IInfoAdvantages | IInfoEquipments

class Database {
  db: SupabaseClient

  constructor() {
    this.init()
  }

  init() {
    if (!this.db) {
      const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = import.meta.env

      this.db = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY)

      this.subscribe()
    }
  }

  subscribe() {
    PubSub.subscribe(msgRequest(apiSelect(T.rpgCharacter)), async () => {
      const { data: rpgCharacter, error } = await this.db
        .from('rpgCharacter')
        .select(
          `
          id,
          name,
          points,
          money,
          rpgRaces(value, races(name)),
          rpgAdvantages(value, advantages(name, points)),
          rpgEquipments(value, equipments(name, price, weight))
        `
        )
        .eq('id', 1)
      if (error) {
        console.log('Error while reading rpgCharacter', error)
      }
      PubSub.publish(msgResponse(apiSelect(T.rpgCharacter)), uiRpgCharacter(rpgCharacter[0]))
    })

    PubSub.subscribe(
      msgRequest(apiUpdate(T.rpgCharacter)),
      async (msg, rpgCharacter: IRpgCharacter) => {
        const { error } = await this.db
          .from('rpgCharacter')
          .update({ ...rpgCharacter })
          .eq('id', 1)
        if (error) {
          console.log('Error while storing rpgCharacter', error)
        }
        PubSub.publish(msgResponse(apiUpdate(T.rpgCharacter)))
      }
    )

    PubSub.subscribe(msgRequest(apiSelect(T.rpgProperties)), async () => {
      const rpgProperties = await this.selectProperties()
      PubSub.publish(msgResponse(apiSelect(T.rpgProperties)), rpgProperties)
    })

    PubSub.subscribe(
      msgRequest(apiUpdate(T.rpgProperties)),
      async (_msg, rpgProperties: IProperties) => {
        await this.updateProperties(rpgProperties)
        PubSub.publish(msgResponse(apiUpdate(T.rpgProperties)))
      }
    )

    PubSub.subscribe(msgRequest(apiSelect(T.rpgBlock)), async (_msg, block: IBlockType) => {
      const rpgBlock = await this.selectBlock(block)
      PubSub.publish(msgResponse(apiSelect(T.rpgBlock)), rpgBlock)
    })

    PubSub.subscribe(msgRequest(apiUpdate(T.rpgBlock)), async (_msg, rpgBlock: IRpgBlock) => {
      await this.updateBlock(rpgBlock)
      PubSub.publish(msgResponse(apiUpdate(T.rpgBlock)))
    })

    PubSub.subscribe(msgRequest(apiSelect(T.rpgInfo)), async (_msg, block: IBlockType) => {
      const rpgInfo = await this.selectInfo(block)
      PubSub.publish(msgResponse(apiSelect(T.rpgInfo)), rpgInfo)
    })
  }

  async selectProperties() {
    const { data: rpgProperties, error } = await this.db
      .from('rpgCharacter')
      .select(
        `
          name,
          points,
          money
        `
      )
      .eq('id', 1)
    if (error) {
      console.log('Error while reading properties', error)
    }
    return uiProperties(rpgProperties[0])
  }

  async selectBlock(block: IBlockType) {
    const { data: rpgBlock, error } = await this.db
      .from(blockValueTable(block))
      .select(
        `
          value
        `
      )
      .eq('rpgId', 1)
    if (error) {
      console.log('Error while reading block: ' + block, error)
    }
    return uiBlock(rpgBlock, block)
  }

  async selectInfo(block: IBlockType) {
    const { data: rpgInfo, error } = await this.db.from(blockInfoTable(block)).select(
      `
          *
        `
    )
    if (error) {
      console.log('Error while reading block: ' + block, error)
    }
    return uiInfo(rpgInfo, block)
  }

  async updateProperties(rpgProperties: IProperties) {
    const { error } = await this.db.from('rpgCharacter').update(rpgProperties).eq('id', 1)
    if (error) {
      console.log('Error while storing properties', error)
    }
  }

  async updateBlock(block: IRpgBlock) {
    const blockTable = blockValueTable(block.type)

    let { error: deleteError } = await this.db.from(blockTable).delete().eq('rpgId', 1)
    if (deleteError) {
      console.log('Error while deleting from ' + blockTable, deleteError)
    }

    const values = block.data[block.type] as string[]
    let { error: insertError } = await this.db
      .from(blockTable)
      .insert(values.map((value) => ({ rpgId: 1, value })))
    if (insertError) {
      console.log('Error while inserting into ' + blockTable, insertError)
    }

    if (block.properties) {
      await this.updateProperties(block.properties as IProperties)
    }
  }
}

export const db = new Database()
