import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, d as style, f as renderComponent, e as renderSlot } from '../entry.mjs';
/* empty css                          *//* empty css                               */import 'html-escaper';
import Path from 'path';
import '@astrojs/netlify/netlify-functions.js';
import 'pubsub-js';
import '@nanostores/solid';
import 'nanostores';
import 'clsx';
/* empty css                               *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                          *//* empty css                         *//* empty css                          */import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import 'path-to-regexp';

const $$Astro$2 = createAstro("C:/work/killman/rpg-store/src/projects/rpg/builder/layouts/Home.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Home = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Home;
  const { block } = Astro2.props;
  return renderTemplate`${block !== "properties" ? renderTemplate`${maybeRenderHead($$result)}<a href="/"${addAttribute(style("home"), "style")}>
      🔙
    </a>` : renderTemplate`<div${addAttribute(style("home"), "style")}>㉽</div>`}`;
});

const $$Astro$1 = createAstro("C:/work/killman/rpg-store/src/projects/rpg/builder/layouts/Header.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Header;
  const { block } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(style("header"), "style")}>
  ${renderComponent($$result, "Home", $$Home, { "block": block })}
  <div${addAttribute(style("theme"), "style")}>${renderComponent($$result, "ThemeSelector", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "@builder/ui/widgets/form/ThemeSelector", "client:component-export": "default" })}</div>
</div>`;
});

const $$Astro = createAstro("C:/work/killman/rpg-store/src/projects/rpg/builder/layouts/FormLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$FormLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FormLayout;
  const { frontmatter } = Astro2.props;
  const basename = Path.basename(frontmatter.url);
  const block = Path.parse(basename).name;
  return renderTemplate`${renderComponent($$result, "Header", $$Header, { "block": block })}

${maybeRenderHead($$result)}<div id="form"${addAttribute(block, "data-block")}>
  ${renderSlot($$result, $$slots["default"])}
</div>

${maybeRenderHead($$result)}`;
});

const $$file = "C:/work/killman/rpg-store/src/projects/rpg/builder/layouts/FormLayout.astro";
const $$url = undefined;

export { $$FormLayout as default, $$file as file, $$url as url };
