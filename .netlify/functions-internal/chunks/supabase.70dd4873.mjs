import { createClient } from '@supabase/supabase-js';
import PubSub from 'pubsub-js';
import { h as msgRequest, i as msgResponse, j as apiSelect, k as apiUpdate, a as T } from '../entry.mjs';
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
    PubSub.subscribe(msgRequest(apiSelect(T.tiles)), async () => {
      const { data: tiles, error } = await this.db.from("tiles").select("id, name, order");
      if (error) {
        console.log("Error while reading tiles", error);
      }
      PubSub.publish(
        msgResponse(apiSelect(T.tiles)),
        tiles.sort((tile1, tile2) => tile1.order - tile2.order)
      );
    });
    PubSub.subscribe(msgRequest(apiSelect(T.rpgTiles)), async () => {
      const { data: rpgCharacters, error } = await this.db.from("rpgCharacter").select("lastActiveTileId");
      if (error) {
        console.log("Error while reading rpgCharacter", error);
      }
      PubSub.publish(msgResponse(apiSelect(T.rpgTiles)), rpgCharacters[0]);
    });
    PubSub.subscribe(msgRequest(apiUpdate(T.rpgTarget)), async (msg, rpgCharacter) => {
      const { error } = await this.db.from("rpgCharacter").update({ ...rpgCharacter }).eq("id", 1);
      if (error) {
        console.log("Error while storing rpgCharacter", error);
      }
      PubSub.publish(msgResponse(apiUpdate(T.rpgTarget)));
    });
  }
}
const db = new Database();

export { db };
