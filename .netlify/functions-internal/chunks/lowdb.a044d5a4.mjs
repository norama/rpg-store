import { Low, Memory } from 'lowdb';
import PubSub from 'pubsub-js';
import { h as msgRequest, j as apiSelect, i as msgResponse, k as apiUpdate, a as T } from '../entry.mjs';
import '@astrojs/netlify/netlify-functions.js';
import 'html-escaper';
import 'nanostores';
import 'clsx';
import '@nanostores/solid';
/* empty css                               *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                         *//* empty css                          */import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import 'path-to-regexp';

const tiles = [
  { id: "Race", name: "My Race" },
  { id: "Occupation", name: "My Occupation" },
  { id: "Abilities", name: "My Abilities" },
  { id: "Symbols", name: "My Symbols" }
];
const rpgCharacter = { lastActiveTileId: "Race" };
class Database {
  db;
  constructor() {
    this.init();
    this.subscribe();
  }
  init() {
    if (!this.db) {
      this.db = new Low(new Memory());
      this.db.data = { tiles, rpgCharacter };
      console.log("DATA", this.db.data);
    }
  }
  subscribe() {
    PubSub.subscribe(msgRequest(apiSelect(T.tiles)), () => {
      PubSub.publish(msgResponse(apiSelect(T.tiles)), [...this.db.data.tiles]);
    });
    PubSub.subscribe(msgRequest(apiSelect(T.rpgTiles)), () => {
      PubSub.publish(msgResponse(apiSelect(T.rpgTiles)), { ...this.db.data.rpgCharacter });
    });
    PubSub.subscribe(msgRequest(apiUpdate(T.rpgTarget)), async (msg, rpgCharacter2) => {
      console.log("lowdb rpgCharacter", rpgCharacter2);
      this.db.data.rpgCharacter = { ...rpgCharacter2 };
      PubSub.publish(msgResponse(apiUpdate(T.rpgTarget)));
    });
  }
  subscribeCharacter() {
  }
}
const db = new Database();

export { db };
