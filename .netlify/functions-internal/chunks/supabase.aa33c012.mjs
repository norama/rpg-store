import { createClient } from '@supabase/supabase-js';
import PubSub from 'pubsub-js';
import { g as msgRequest, h as apiSelect, T, i as msgResponse, j as apiUpdate } from '../entry.mjs';
import '@astrojs/netlify/netlify-functions.js';
import 'html-escaper';
import '@nanostores/solid';
import 'nanostores';
import 'clsx';
/* empty css                               *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                         *//* empty css                          */import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import 'path-to-regexp';

const blockValueTable = (type) => {
  switch (type) {
    case "races":
      return "rpgRaces";
    case "advantages":
      return "rpgAdvantages";
    case "equipments":
      return "rpgEquipments";
    default:
      throw new Error("unknown block type: " + type);
  }
};
const blockInfoTable = (type) => {
  switch (type) {
    case "races":
      return "races";
    case "advantages":
      return "advantages";
    case "equipments":
      return "equipments";
    default:
      throw new Error("unknown block type: " + type);
  }
};
const uiRpgCharacter = (c) => ({
  id: c.id,
  properties: uiProperties(c),
  races: uiBlock(c.rpgRaces, "races"),
  advantages: uiBlock(c.rpgAdvantages, "advantages"),
  equipments: uiBlock(c.rpgEquipments, "equipments")
});
const uiProperties = (c) => ({
  name: c.name,
  points: c.points,
  money: c.money
});
const uiBlock = (c, block) => ({
  [block]: c.map(({ value }) => value)
});
const uiInfo = (c, block) => c.reduce((acc, v) => {
  acc[v.id] = v;
  return acc;
}, {});
class Database {
  db;
  constructor() {
    this.init();
  }
  init() {
    if (!this.db) {
      const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = Object.assign({"PUBLIC_RPG_API_URL":"/api/rpg","PUBLIC_BUILDER_API_URL":"/api/rpg/builder","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true}, { DATABASE: "supabase", DATABASE_URL: "https://fwquxyatrztkypzlvnmp.supabase.co", SUPABASE_SERVICE_API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cXV4eWF0cnp0a3lwemx2bm1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2OTM5ODA2NywiZXhwIjoxOTg0OTc0MDY3fQ.S2NQpdIsZLfKJcpw3zlvQHQTJK7jlT7m9jdxvp5Z9sY", BASE_URL: "/" });
      this.db = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);
      this.subscribe();
    }
  }
  subscribe() {
    PubSub.subscribe(msgRequest(apiSelect(T.rpgTarget)), async () => {
      const { data: rpgCharacter, error } = await this.db.from("rpgCharacter").select(
        `
          id,
          name,
          points,
          money,
          rpgRaces(value, races(name)),
          rpgAdvantages(value, advantages(name, points)),
          rpgEquipments(value, equipments(name, price, weight))
        `
      ).eq("id", 1);
      if (error) {
        console.log("Error while reading rpgCharacter", error);
      }
      PubSub.publish(msgResponse(apiSelect(T.rpgTarget)), uiRpgCharacter(rpgCharacter[0]));
    });
    PubSub.subscribe(
      msgRequest(apiUpdate(T.rpgTarget)),
      async (msg, rpgCharacter) => {
        const { error } = await this.db.from("rpgCharacter").update({ ...rpgCharacter }).eq("id", 1);
        if (error) {
          console.log("Error while storing rpgCharacter", error);
        }
        PubSub.publish(msgResponse(apiUpdate(T.rpgTarget)));
      }
    );
    PubSub.subscribe(msgRequest(apiSelect(T.rpgProperties)), async () => {
      const rpgProperties = await this.selectProperties();
      PubSub.publish(msgResponse(apiSelect(T.rpgProperties)), rpgProperties);
    });
    PubSub.subscribe(
      msgRequest(apiUpdate(T.rpgProperties)),
      async (_msg, rpgProperties) => {
        await this.updateProperties(rpgProperties);
        PubSub.publish(msgResponse(apiUpdate(T.rpgProperties)));
      }
    );
    PubSub.subscribe(msgRequest(apiSelect(T.rpgBlock)), async (_msg, block) => {
      const rpgBlock = await this.selectBlock(block);
      PubSub.publish(msgResponse(apiSelect(T.rpgBlock)), rpgBlock);
    });
    PubSub.subscribe(msgRequest(apiUpdate(T.rpgBlock)), async (_msg, rpgBlock) => {
      await this.updateBlock(rpgBlock);
      PubSub.publish(msgResponse(apiUpdate(T.rpgBlock)));
    });
    PubSub.subscribe(msgRequest(apiSelect(T.rpgInfo)), async (_msg, block) => {
      const rpgInfo = await this.selectInfo(block);
      PubSub.publish(msgResponse(apiSelect(T.rpgInfo)), rpgInfo);
    });
    PubSub.subscribe(msgRequest(apiSelect(T.uiTheme)), async () => {
      const { data: uiTheme, error } = await this.db.from("uiTheme").select(
        `
          id,
          theme
        `
      ).eq("id", 1);
      if (error) {
        console.log("Error while reading uiTheme", error);
      }
      PubSub.publish(msgResponse(apiSelect(T.uiTheme)), uiTheme[0].theme);
    });
    PubSub.subscribe(msgRequest(apiUpdate(T.uiTheme)), async (msg, theme) => {
      const { error } = await this.db.from("uiTheme").update({ theme }).eq("id", 1);
      if (error) {
        console.log("Error while storing uiTheme", error);
      }
      PubSub.publish(msgResponse(apiUpdate(T.uiTheme)));
    });
  }
  async selectProperties() {
    const { data: rpgProperties, error } = await this.db.from("rpgCharacter").select(
      `
          name,
          points,
          money
        `
    ).eq("id", 1);
    if (error) {
      console.log("Error while reading properties", error);
    }
    return uiProperties(rpgProperties[0]);
  }
  async selectBlock(block) {
    const { data: rpgBlock, error } = await this.db.from(blockValueTable(block)).select(
      `
          value
        `
    ).eq("rpgId", 1);
    if (error) {
      console.log("Error while reading block: " + block, error);
    }
    return uiBlock(rpgBlock, block);
  }
  async selectInfo(block) {
    const { data: rpgInfo, error } = await this.db.from(blockInfoTable(block)).select(
      `
          *
        `
    );
    if (error) {
      console.log("Error while reading block: " + block, error);
    }
    return uiInfo(rpgInfo);
  }
  async updateProperties(rpgProperties) {
    const { error } = await this.db.from("rpgCharacter").update(rpgProperties).eq("id", 1);
    if (error) {
      console.log("Error while storing properties", error);
    }
  }
  async updateBlock(block) {
    const blockTable = blockValueTable(block.type);
    let { error: deleteError } = await this.db.from(blockTable).delete().eq("rpgId", 1);
    if (deleteError) {
      console.log("Error while deleting from " + blockTable, deleteError);
    }
    const values = block.data[block.type];
    let { error: insertError } = await this.db.from(blockTable).insert(values.map((value) => ({ rpgId: 1, value })));
    if (insertError) {
      console.log("Error while inserting into " + blockTable, insertError);
    }
    if (block.properties) {
      await this.updateProperties(block.properties);
    }
  }
}
const db = new Database();

export { db };
