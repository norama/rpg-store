import { s as select, t as themeHolder, T, c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, d as style, e as renderSlot } from '../entry.mjs';
import 'html-escaper';
import '@astrojs/netlify/netlify-functions.js';
import 'pubsub-js';
import '@nanostores/solid';
import 'nanostores';
import 'clsx';
/* empty css                               *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                         *//* empty css                          */import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import 'path-to-regexp';

let firstCall = true;
const initdb = async () => {
  if (firstCall) {
    switch ("supabase") {
      case "lowdb": {
        console.log("------ init lowdb --------");
        await import('./lowdb.5d789001.mjs');
        break;
      }
      case "supabase":
      default: {
        console.log("------ DASHBOARD init supabase --------");
        await import('./supabase.aa33c012.mjs');
        break;
      }
    }
    firstCall = false;
  }
};

const initTheme = async () => {
  const theme = await select(T.uiTheme);
  themeHolder.setTheme(theme);
};

const $$Astro = createAstro("C:/work/killman/rpg-store/src/projects/rpg/builder/layouts/BuilderLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$BuilderLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BuilderLayout;
  await initdb();
  await initTheme();
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(style("body"), "style")}>
  ${renderSlot($$result, $$slots["default"])}
</div>`;
});

const $$file = "C:/work/killman/rpg-store/src/projects/rpg/builder/layouts/BuilderLayout.astro";
const $$url = undefined;

export { $$BuilderLayout as default, $$file as file, $$url as url };
