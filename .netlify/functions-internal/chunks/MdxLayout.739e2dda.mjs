import { c as createAstro, b as createComponent, r as renderTemplate, m as maybeRenderHead, f as renderSlot } from '../entry.mjs';
/* empty css                           */import 'html-escaper';
import '@astrojs/netlify/netlify-functions.js';
import 'pubsub-js';
import 'nanostores';
import 'clsx';
import '@nanostores/solid';
/* empty css                               *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                         *//* empty css                          */import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import 'path-to-regexp';

const $$Astro = createAstro("C:/work/killman/rpg-store/src/projects/rpg/tiles/layouts/MdxLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$MdxLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MdxLayout;
  return renderTemplate`

${maybeRenderHead($$result)}<div class="tile astro-XX4WV6GN">
  ${renderSlot($$result, $$slots["default"])}
</div>

${maybeRenderHead($$result)}`;
});

const $$file = "C:/work/killman/rpg-store/src/projects/rpg/tiles/layouts/MdxLayout.astro";
const $$url = undefined;

export { $$MdxLayout as default, $$file as file, $$url as url };
