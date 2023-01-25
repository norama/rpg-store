import { c as createAstro, b as createComponent, r as renderTemplate, m as maybeRenderHead, g as renderComponent, d as addAttribute, f as renderSlot } from '../entry.mjs';
/* empty css                          */import Path from 'path';
/* empty css                               */import 'html-escaper';
import '@astrojs/netlify/netlify-functions.js';
import 'pubsub-js';
import 'nanostores';
import 'clsx';
import '@nanostores/solid';
/* empty css                               *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                         *//* empty css                          */import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import 'path-to-regexp';

const $$Astro = createAstro("C:/work/killman/rpg-store/src/projects/rpg/builder/layouts/FormLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$FormLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FormLayout;
  const { frontmatter } = Astro2.props;
  const basename = Path.basename(frontmatter.url);
  const block = Path.parse(basename).name;
  return renderTemplate`

${maybeRenderHead($$result)}<div class="themeSelector astro-7M7P7UYK">
  ${renderComponent($$result, "ThemeSelector", null, { "client:only": "solid-js", "client:component-hydration": "only", "class": "astro-7M7P7UYK", "client:component-path": "@widgets/form/ThemeSelector", "client:component-export": "default" })}
</div>

<div id="form"${addAttribute(block, "data-block")} class="astro-7M7P7UYK">
  ${renderSlot($$result, $$slots["default"])}
</div>
${renderComponent($$result, "FormControls", null, { "client:only": "solid-js", "client:component-hydration": "only", "class": "astro-7M7P7UYK", "client:component-path": "@widgets/form/FormControls", "client:component-export": "default" })}

${maybeRenderHead($$result)}`;
});

const $$file = "C:/work/killman/rpg-store/src/projects/rpg/builder/layouts/FormLayout.astro";
const $$url = undefined;

export { $$FormLayout as default, $$file as file, $$url as url };
