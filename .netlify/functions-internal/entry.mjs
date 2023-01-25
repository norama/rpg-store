import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { escape as escape$1 } from 'html-escaper';
import PubSub from 'pubsub-js';
import { atom, map, computed } from 'nanostores';
import clsx from 'clsx';
import { useStore } from '@nanostores/solid';
/* empty css                                      *//* empty css                                 *//* empty css                                 *//* empty css                                 *//* empty css                                 *//* empty css                                *//* empty css                                 */import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

const ERROR = Symbol("error");
const BRANCH = Symbol("branch");
function castError(err) {
  if (err instanceof Error || typeof err === "string") return err;
  return new Error("Unknown error");
}
function handleError(err) {
  err = castError(err);
  const fns = lookup(Owner, ERROR);
  if (!fns) throw err;
  for (const f of fns) f(err);
}
const UNOWNED = {
  context: null,
  owner: null
};
let Owner = null;
function createRoot(fn, detachedOwner) {
  detachedOwner && (Owner = detachedOwner);
  const owner = Owner,
        root = fn.length === 0 ? UNOWNED : {
    context: null,
    owner
  };
  Owner = root;
  let result;
  try {
    result = fn(() => {});
  } catch (err) {
    handleError(err);
  } finally {
    Owner = owner;
  }
  return result;
}
function createSignal(value, options) {
  return [() => value, v => {
    return value = typeof v === "function" ? v(value) : v;
  }];
}
function createComputed(fn, value) {
  Owner = {
    owner: Owner,
    context: null
  };
  try {
    fn(value);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = Owner.owner;
  }
}
const createRenderEffect = createComputed;
function createEffect(fn, value) {}
function createMemo(fn, value) {
  Owner = {
    owner: Owner,
    context: null
  };
  let v;
  try {
    v = fn(value);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = Owner.owner;
  }
  return () => v;
}
function batch(fn) {
  return fn();
}
const untrack = batch;
function on(deps, fn, options = {}) {
  const isArray = Array.isArray(deps);
  const defer = options.defer;
  return () => {
    if (defer) return undefined;
    let value;
    if (isArray) {
      value = [];
      for (let i = 0; i < deps.length; i++) value.push(deps[i]());
    } else value = deps();
    return fn(value);
  };
}
function onCleanup(fn) {
  let node;
  if (Owner && (node = lookup(Owner, BRANCH))) {
    if (!node.cleanups) node.cleanups = [fn];else node.cleanups.push(fn);
  }
  return fn;
}
function createContext(defaultValue) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  let ctx;
  return (ctx = lookup(Owner, context.id)) !== undefined ? ctx : context.defaultValue;
}
function children(fn) {
  const memo = createMemo(() => resolveChildren(fn()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
function lookup(owner, key) {
  return owner ? owner.context && owner.context[key] !== undefined ? owner.context[key] : lookup(owner.owner, key) : undefined;
}
function resolveChildren(children) {
  if (typeof children === "function" && !children.length) return resolveChildren(children());
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}
function createProvider(id) {
  return function provider(props) {
    return createMemo(() => {
      Owner.context = {
        [id]: props.value
      };
      return children(() => props.children);
    });
  };
}
function mapArray(list, mapFn, options = {}) {
  const items = list();
  let s = [];
  if (items.length) {
    for (let i = 0, len = items.length; i < len; i++) s.push(mapFn(items[i], () => i));
  } else if (options.fallback) s = [options.fallback()];
  return () => s;
}
const sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}
function nextHydrateContext() {
  return sharedConfig.context ? { ...sharedConfig.context,
    id: `${sharedConfig.context.id}${sharedConfig.context.count++}-`,
    count: 0
  } : undefined;
}
function createComponent$1(Comp, props) {
  if (sharedConfig.context && !sharedConfig.context.noHydrate) {
    const c = sharedConfig.context;
    setHydrateContext(nextHydrateContext());
    const r = Comp(props || {});
    setHydrateContext(c);
    return r;
  }
  return Comp(props || {});
}
function mergeProps(...sources) {
  const target = {};
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    if (typeof source === "function") source = source();
    if (source) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
  }
  return target;
}
function splitProps(props, ...keys) {
  const descriptors = Object.getOwnPropertyDescriptors(props),
        split = k => {
    const clone = {};
    for (let i = 0; i < k.length; i++) {
      const key = k[i];
      if (descriptors[key]) {
        Object.defineProperty(clone, key, descriptors[key]);
        delete descriptors[key];
      }
    }
    return clone;
  };
  return keys.map(split).concat(split(Object.keys(descriptors)));
}
function simpleMap(props, wrap) {
  const list = props.each || [],
        len = list.length,
        fn = props.children;
  if (len) {
    let mapped = Array(len);
    for (let i = 0; i < len; i++) mapped[i] = wrap(fn, list[i], i);
    return mapped;
  }
  return props.fallback;
}
function For(props) {
  return simpleMap(props, (fn, item, i) => fn(item, () => i));
}
function Show(props) {
  let c;
  return props.when ? typeof (c = props.children) === "function" ? c(props.when) : c : props.fallback || "";
}
function Switch(props) {
  let conditions = props.children;
  Array.isArray(conditions) || (conditions = [conditions]);
  for (let i = 0; i < conditions.length; i++) {
    const w = conditions[i].when;
    if (w) {
      const c = conditions[i].children;
      return typeof c === "function" ? c(w) : c;
    }
  }
  return props.fallback || "";
}
function Match(props) {
  return props;
}

const booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
const BooleanAttributes = /*#__PURE__*/new Set(booleans);
/*#__PURE__*/new Set(["className", "value", "readOnly", "formNoValidate", "isMap", "noModule", "playsInline", ...booleans]);
const ChildProperties = /*#__PURE__*/new Set(["innerHTML", "textContent", "innerText", "children"]);
const Aliases = /*#__PURE__*/Object.assign(Object.create(null), {
  className: "class",
  htmlFor: "for"
});

const {
  hasOwnProperty
} = Object.prototype;
const REF_START_CHARS = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
const REF_START_CHARS_LEN = REF_START_CHARS.length;
const REF_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
const REF_CHARS_LEN = REF_CHARS.length;
const STACK = [];
const BUFFER = [""];
let ASSIGNMENTS = new Map();
let INDEX_OR_REF = new WeakMap();
let REF_COUNT = 0;
BUFFER.pop();
function stringify(root) {
  if (writeProp(root, "")) {
    let result = BUFFER[0];
    for (let i = 1, len = BUFFER.length; i < len; i++) {
      result += BUFFER[i];
    }
    if (REF_COUNT) {
      if (ASSIGNMENTS.size) {
        let ref = INDEX_OR_REF.get(root);
        if (typeof ref === "number") {
          ref = toRefParam(REF_COUNT++);
          result = ref + "=" + result;
        }
        for (const [assignmentRef, assignments] of ASSIGNMENTS) {
          result += ";" + assignments + assignmentRef;
        }
        result += ";return " + ref;
        ASSIGNMENTS = new Map();
      } else {
        result = "return " + result;
      }
      result = "(function(" + refParamsString() + "){" + result + "}())";
    } else if (root && root.constructor === Object) {
      result = "(" + result + ")";
    }
    BUFFER.length = 0;
    INDEX_OR_REF = new WeakMap();
    return result;
  }
  return "void 0";
}
function writeProp(cur, accessor) {
  switch (typeof cur) {
    case "string":
      BUFFER.push(quote(cur, 0));
      break;
    case "number":
      BUFFER.push(cur + "");
      break;
    case "boolean":
      BUFFER.push(cur ? "!0" : "!1");
      break;
    case "object":
      if (cur === null) {
        BUFFER.push("null");
      } else {
        const ref = getRef(cur, accessor);
        switch (ref) {
          case true:
            return false;
          case false:
            switch (cur.constructor) {
              case Object:
                writeObject(cur);
                break;
              case Array:
                writeArray(cur);
                break;
              case Date:
                BUFFER.push('new Date("' + cur.toISOString() + '")');
                break;
              case RegExp:
                BUFFER.push(cur + "");
                break;
              case Map:
                BUFFER.push("new Map(");
                writeArray(Array.from(cur));
                BUFFER.push(")");
                break;
              case Set:
                BUFFER.push("new Set(");
                writeArray(Array.from(cur));
                BUFFER.push(")");
                break;
              case undefined:
                BUFFER.push("Object.assign(Object.create(null),");
                writeObject(cur);
                BUFFER.push(")");
                break;
              default:
                return false;
            }
            break;
          default:
            BUFFER.push(ref);
            break;
        }
      }
      break;
    default:
      return false;
  }
  return true;
}
function writeObject(obj) {
  let sep = "{";
  STACK.push(obj);
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      const escapedKey = toObjectKey(key);
      BUFFER.push(sep + escapedKey + ":");
      if (writeProp(val, escapedKey)) {
        sep = ",";
      } else {
        BUFFER.pop();
      }
    }
  }
  if (sep === "{") {
    BUFFER.push("{}");
  } else {
    BUFFER.push("}");
  }
  STACK.pop();
}
function writeArray(arr) {
  BUFFER.push("[");
  STACK.push(arr);
  writeProp(arr[0], 0);
  for (let i = 1, len = arr.length; i < len; i++) {
    BUFFER.push(",");
    writeProp(arr[i], i);
  }
  STACK.pop();
  BUFFER.push("]");
}
function getRef(cur, accessor) {
  let ref = INDEX_OR_REF.get(cur);
  if (ref === undefined) {
    INDEX_OR_REF.set(cur, BUFFER.length);
    return false;
  }
  if (typeof ref === "number") {
    ref = insertAndGetRef(cur, ref);
  }
  if (STACK.includes(cur)) {
    const parent = STACK[STACK.length - 1];
    let parentRef = INDEX_OR_REF.get(parent);
    if (typeof parentRef === "number") {
      parentRef = insertAndGetRef(parent, parentRef);
    }
    ASSIGNMENTS.set(ref, (ASSIGNMENTS.get(ref) || "") + toAssignment(parentRef, accessor) + "=");
    return true;
  }
  return ref;
}
function toObjectKey(name) {
  const invalidIdentifierPos = getInvalidIdentifierPos(name);
  return invalidIdentifierPos === -1 ? name : quote(name, invalidIdentifierPos);
}
function toAssignment(parent, key) {
  return parent + (typeof key === "number" || key[0] === '"' ? "[" + key + "]" : "." + key);
}
function getInvalidIdentifierPos(name) {
  let char = name[0];
  if (!(char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char === "$" || char === "_")) {
    return 0;
  }
  for (let i = 1, len = name.length; i < len; i++) {
    char = name[i];
    if (!(char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char >= "0" && char <= "9" || char === "$" || char === "_")) {
      return i;
    }
  }
  return -1;
}
function quote(str, startPos) {
  let result = "";
  let lastPos = 0;
  for (let i = startPos, len = str.length; i < len; i++) {
    let replacement;
    switch (str[i]) {
      case '"':
        replacement = '\\"';
        break;
      case "\\":
        replacement = "\\\\";
        break;
      case "<":
        replacement = "\\x3C";
        break;
      case "\n":
        replacement = "\\n";
        break;
      case "\r":
        replacement = "\\r";
        break;
      case "\u2028":
        replacement = "\\u2028";
        break;
      case "\u2029":
        replacement = "\\u2029";
        break;
      default:
        continue;
    }
    result += str.slice(lastPos, i) + replacement;
    lastPos = i + 1;
  }
  if (lastPos === startPos) {
    result = str;
  } else {
    result += str.slice(lastPos);
  }
  return '"' + result + '"';
}
function insertAndGetRef(obj, pos) {
  const ref = toRefParam(REF_COUNT++);
  INDEX_OR_REF.set(obj, ref);
  if (pos) {
    BUFFER[pos - 1] += ref + "=";
  } else {
    BUFFER[pos] = ref + "=" + BUFFER[pos];
  }
  return ref;
}
function refParamsString() {
  let result = REF_START_CHARS[0];
  for (let i = 1; i < REF_COUNT; i++) {
    result += "," + toRefParam(i);
  }
  REF_COUNT = 0;
  return result;
}
function toRefParam(index) {
  let mod = index % REF_START_CHARS_LEN;
  let ref = REF_START_CHARS[mod];
  index = (index - mod) / REF_START_CHARS_LEN;
  while (index > 0) {
    mod = index % REF_CHARS_LEN;
    ref += REF_CHARS[mod];
    index = (index - mod) / REF_CHARS_LEN;
  }
  return ref;
}
function renderToString$1(code, options = {}) {
  let scripts = "";
  sharedConfig.context = {
    id: options.renderId || "",
    count: 0,
    suspense: {},
    assets: [],
    nonce: options.nonce,
    writeResource(id, p, error) {
      if (sharedConfig.context.noHydrate) return;
      if (error) return scripts += `_$HY.set("${id}", ${serializeError(p)});`;
      scripts += `_$HY.set("${id}", ${stringify(p)});`;
    }
  };
  let html = resolveSSRNode(escape(code()));
  sharedConfig.context.noHydrate = true;
  html = injectAssets(sharedConfig.context.assets, html);
  if (scripts.length) html = injectScripts(html, scripts, options.nonce);
  return html;
}
function ssr(t, ...nodes) {
  if (nodes.length) {
    let result = "";
    for (let i = 0; i < nodes.length; i++) {
      result += t[i];
      const node = nodes[i];
      if (node !== undefined) result += resolveSSRNode(node);
    }
    t = result + t[nodes.length];
  }
  return {
    t
  };
}
function ssrClassList(value) {
  if (!value) return "";
  let classKeys = Object.keys(value),
      result = "";
  for (let i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
          classValue = !!value[key];
    if (!key || key === "undefined" || !classValue) continue;
    i && (result += " ");
    result += key;
  }
  return result;
}
function ssrStyle(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  let result = "";
  const k = Object.keys(value);
  for (let i = 0; i < k.length; i++) {
    const s = k[i];
    const v = value[s];
    if (v != undefined) {
      if (i) result += ";";
      result += `${s}:${escape(v, true)}`;
    }
  }
  return result;
}
function ssrElement(tag, props, children, needsId) {
  let result = `<${tag}${needsId ? ssrHydrationKey() : ""} `;
  if (props == null) props = {};else if (typeof props === "function") props = props();
  const keys = Object.keys(props);
  let classResolved;
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (ChildProperties.has(prop)) {
      if (children === undefined) children = prop === "innerHTML" ? props[prop] : escape(props[prop]);
      continue;
    }
    const value = props[prop];
    if (prop === "style") {
      result += `style="${ssrStyle(value)}"`;
    } else if (prop === "class" || prop === "className" || prop === "classList") {
      if (classResolved) continue;
      let n;
      result += `class="${(n = props.class) ? n + " " : ""}${(n = props.className) ? n + " " : ""}${ssrClassList(props.classList)}"`;
      classResolved = true;
    } else if (BooleanAttributes.has(prop)) {
      if (value) result += prop;else continue;
    } else if (value == undefined || prop === "ref" || prop.slice(0, 2) === "on") {
      continue;
    } else {
      result += `${Aliases[prop] || prop}="${escape(value, true)}"`;
    }
    if (i !== keys.length - 1) result += " ";
  }
  return {
    t: result + `>${resolveSSRNode(children)}</${tag}>`
  };
}
function ssrAttribute(key, value, isBoolean) {
  return isBoolean ? value ? " " + key : "" : value != null ? ` ${key}="${value}"` : "";
}
function ssrHydrationKey() {
  const hk = getHydrationKey();
  return hk ? ` data-hk="${hk}"` : "";
}
function escape(s, attr) {
  const t = typeof s;
  if (t !== "string") {
    if (!attr && t === "function") return escape(s(), attr);
    if (!attr && Array.isArray(s)) {
      let r = "";
      for (let i = 0; i < s.length; i++) r += resolveSSRNode(escape(s[i], attr));
      return {
        t: r
      };
    }
    if (attr && t === "boolean") return String(s);
    return s;
  }
  const delim = attr ? '"' : "<";
  const escDelim = attr ? "&quot;" : "&lt;";
  let iDelim = s.indexOf(delim);
  let iAmp = s.indexOf("&");
  if (iDelim < 0 && iAmp < 0) return s;
  let left = 0,
      out = "";
  while (iDelim >= 0 && iAmp >= 0) {
    if (iDelim < iAmp) {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } else {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  }
  if (iDelim >= 0) {
    do {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } while (iDelim >= 0);
  } else while (iAmp >= 0) {
    if (left < iAmp) out += s.substring(left, iAmp);
    out += "&amp;";
    left = iAmp + 1;
    iAmp = s.indexOf("&", left);
  }
  return left < s.length ? out + s.substring(left) : out;
}
function resolveSSRNode(node) {
  const t = typeof node;
  if (t === "string") return node;
  if (node == null || t === "boolean") return "";
  if (Array.isArray(node)) {
    let mapped = "";
    for (let i = 0, len = node.length; i < len; i++) mapped += resolveSSRNode(node[i]);
    return mapped;
  }
  if (t === "object") return node.t;
  if (t === "function") return resolveSSRNode(node());
  return String(node);
}
function getHydrationKey() {
  const hydrate = sharedConfig.context;
  return hydrate && !hydrate.noHydrate && `${hydrate.id}${hydrate.count++}`;
}
function injectAssets(assets, html) {
  if (!assets || !assets.length) return html;
  let out = "";
  for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
  return html.replace(`</head>`, out + `</head>`);
}
function injectScripts(html, scripts, nonce) {
  const tag = `<script${nonce ? ` nonce="${nonce}"` : ""}>${scripts}</script>`;
  const index = html.indexOf("<!--xs-->");
  if (index > -1) {
    return html.slice(0, index) + tag + html.slice(index);
  }
  return html + tag;
}
function serializeError(error) {
  if (error.message) {
    const fields = {};
    const keys = Object.getOwnPropertyNames(error);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = error[key];
      if (!value || key !== "message" && typeof value !== "function") {
        fields[key] = value;
      }
    }
    return `Object.assign(new Error(${stringify(error.message)}), ${stringify(fields)})`;
  }
  return stringify(error);
}
function Dynamic$1(props) {
  const [p, others] = splitProps(props, ["component"]);
  const comp = p.component,
        t = typeof comp;
  if (comp) {
    if (t === "function") return comp(others);else if (t === "string") {
      return ssrElement(comp, others, undefined, true);
    }
  }
}

const contexts = /* @__PURE__ */ new WeakMap();
function getContext(result) {
  if (contexts.has(result)) {
    return contexts.get(result);
  }
  let ctx = {
    c: 0,
    get id() {
      return "s" + this.c.toString();
    }
  };
  contexts.set(result, ctx);
  return ctx;
}
function incrementId(ctx) {
  let id = ctx.id;
  ctx.c++;
  return id;
}

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
function check$1(Component, props, children) {
  if (typeof Component !== "function")
    return false;
  const { html } = renderToStaticMarkup$1.call(this, Component, props, children);
  return typeof html === "string";
}
function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
  const renderId = (metadata == null ? void 0 : metadata.hydrate) ? incrementId(getContext(this.result)) : "";
  const html = renderToString$1(
    () => {
      const slots = {};
      for (const [key, value] of Object.entries(slotted)) {
        const name = slotName$1(key);
        slots[name] = ssr(`<astro-slot name="${name}">${value}</astro-slot>`);
      }
      const newProps = {
        ...props,
        ...slots,
        children: children != null ? ssr(`<astro-slot>${children}</astro-slot>`) : children
      };
      return createComponent$1(Component, newProps);
    },
    {
      renderId
    }
  );
  return {
    attrs: {
      "data-solid-render-id": renderId
    },
    html
  };
}
var server_default$1 = {
  check: check$1,
  renderToStaticMarkup: renderToStaticMarkup$1
};

const ASTRO_VERSION = "1.6.11";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape$1;
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    title: "Unknown compiler error.",
    code: 1e3
  },
  StaticRedirectNotAvailable: {
    title: "`Astro.redirect` is not available in static mode.",
    code: 3001,
    message: "Redirects are only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  ClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in current adapter.",
    code: 3002,
    message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
  },
  StaticClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in static mode.",
    code: 3003,
    message: "`Astro.clientAddress` is only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  NoMatchingStaticPathFound: {
    title: "No static path found for requested path.",
    code: 3004,
    message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
    hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
  },
  OnlyResponseCanBeReturned: {
    title: "Invalid type returned by Astro page.",
    code: 3005,
    message: (route, returnedValue) => `Route ${route ? route : ""} returned a \`${returnedValue}\`. Only a Response can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
  },
  MissingMediaQueryDirective: {
    title: "Missing value for `client:media` directive.",
    code: 3006,
    message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
  },
  NoMatchingRenderer: {
    title: "No matching renderer found.",
    code: 3007,
    message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are." : "is."} ${validRenderersCount} renderer${plural ? "s." : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were." : "it was not."} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
    hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`
  },
  NoClientEntrypoint: {
    title: "No client entrypoint specified in renderer.",
    code: 3008,
    message: (componentName, clientDirective, rendererName) => `\`${componentName}\` component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by \`${rendererName}\`.`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
  },
  NoClientOnlyHint: {
    title: "Missing hint on client:only directive.",
    code: 3009,
    message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
  },
  InvalidGetStaticPathParam: {
    title: "Invalid value returned by a `getStaticPaths` path.",
    code: 3010,
    message: (paramType) => `Invalid params given to \`getStaticPaths\` path. Expected an \`object\`, got \`${paramType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  InvalidGetStaticPathsReturn: {
    title: "Invalid value returned by getStaticPaths.",
    code: 3011,
    message: (returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRemovedRSSHelper: {
    title: "getStaticPaths RSS helper is not available anymore.",
    code: 3012,
    message: "The RSS helper has been removed from `getStaticPaths`. Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information."
  },
  GetStaticPathsExpectedParams: {
    title: "Missing params property on `getStaticPaths` route.",
    code: 3013,
    message: "Missing or empty required `params` property on `getStaticPaths` route.",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsInvalidRouteParam: {
    title: "Invalid value for `getStaticPaths` route parameter.",
    code: 3014,
    message: (key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRequired: {
    title: "`getStaticPaths()` function required for dynamic routes.",
    code: 3015,
    message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
  },
  ReservedSlotName: {
    title: "Invalid slot name.",
    code: 3016,
    message: (slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`
  },
  NoAdapterInstalled: {
    title: "Cannot use Server-side Rendering without an adapter.",
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information."
  },
  NoMatchingImport: {
    title: "No import found for component.",
    code: 3018,
    message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
    hint: "Please make sure the component is properly imported."
  },
  UnknownViteError: {
    title: "Unknown Vite Error.",
    code: 4e3
  },
  FailedToLoadModuleSSR: {
    title: "Could not import file.",
    code: 4001,
    message: (importName) => `Could not import \`${importName}\`.`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists."
  },
  InvalidGlob: {
    title: "Invalid glob pattern.",
    code: 4002,
    message: (globPattern) => `Invalid glob pattern: \`${globPattern}\`. Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns."
  },
  UnknownCSSError: {
    title: "Unknown CSS Error.",
    code: 5e3
  },
  CSSSyntaxError: {
    title: "CSS Syntax Error.",
    code: 5001
  },
  UnknownMarkdownError: {
    title: "Unknown Markdown Error.",
    code: 6e3
  },
  MarkdownFrontmatterParseError: {
    title: "Failed to parse Markdown frontmatter.",
    code: 6001
  },
  UnknownConfigError: {
    title: "Unknown configuration error.",
    code: 7e3
  },
  ConfigNotFound: {
    title: "Specified configuration file not found.",
    code: 7001,
    message: (configFile) => `Unable to resolve \`--config "${configFile}"\`. Does the file exist?`
  },
  ConfigLegacyKey: {
    title: "Legacy configuration detected.",
    code: 7002,
    message: (legacyConfigKey) => `Legacy configuration detected: \`${legacyConfigKey}\`.`,
    hint: "Please update your configuration to the new format.\nSee https://astro.build/config for more information."
  },
  UnknownError: {
    title: "Unknown Error.",
    code: 99999
  }
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find((data) => data[1].code === code);
  if (entry) {
    return {
      name: entry[0],
      data: entry[1]
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, title, message, stack, location, hint, frame } = props;
    this.errorCode = code;
    if (name) {
      this.name = name;
    } else {
      this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
    }
    this.title = title;
    if (message)
      this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    var _a;
    this.errorCode = errorCode;
    this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err.type === "AstroError";
  }
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(AstroErrorData.MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"PUBLIC_RPG_API_URL":"/api/rpg","PUBLIC_BUILDER_API_URL":"/api/rpg/builder","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let parts = new HTMLParts();
  for await (const chunk of renderAstroComponent(Component)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}, route) {
  var _a, _b;
  Component = await Component ?? Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const { slotInstructions: slotInstructions2, children: children2 } = await renderSlots(result, slots);
      const html2 = Component.render({ slots: children2 });
      const hydrationHtml = slotInstructions2 ? slotInstructions2.map((instr) => stringifyChunk(result, instr)).join("") : "";
      return markHTMLString(hydrationHtml + html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null ? void 0 : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
function renderHead(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function __astro_tag_component__(Component, rendererName) {
  if (!Component)
    return;
  if (typeof Component !== "function")
    return;
  Object.defineProperty(Component, Renderer, {
    value: rendererName,
    enumerable: false,
    writable: false
  });
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$Astro$m = createAstro("C:/work/killman/rpg-store/src/pages/index.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Index$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$Index$2;
  return Astro2.redirect("/builder");
});

const $$file$6 = "C:/work/killman/rpg-store/src/pages/index.astro";
const $$url$6 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$2,
  file: $$file$6,
  url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const TOPIC = "rpg";
const API = "api";
const REQUEST = "request";
const RESPONSE = "response";
const SELECT = "select";
const UPDATE = "update";
const msg = (m) => TOPIC + "." + m;
const msgRequest = (t) => `${TOPIC}.${API}.${REQUEST}.${t}`;
const msgResponse = (t) => `${TOPIC}.${API}.${RESPONSE}.${t}`;
const apiSelect = (t) => `${SELECT}.${t}`;
const apiUpdate = (t) => `${UPDATE}.${t}`;
const T = {
  tiles: "tiles",
  rpgInfo: "rogInfo",
  rpgBlock: "rpgBlock",
  rpgProperties: "rpgProperties",
  rpgTarget: "rpgTarget",
  rpgTiles: "rpgTiles",
  uiTheme: "uiTheme"
};
const M = {
  tileIds: msg("tileIds"),
  lastActiveTileId: msg("lastActiveTileId"),
  initTiles: msg("initTiles"),
  rpgTarget: msg("rpgTarget"),
  rpgBlock: msg("rpgBlock"),
  rpgInfo: msg("rpgInfo"),
  uiString: msg("uiString"),
  uiNumber: msg("uiNumber"),
  uiStringArray: msg("uiStringArray"),
  uiNumberArray: msg("uiNumberArray"),
  uiBlockData: msg("uiBlockData"),
  uiBlockInfo: msg("uiBlockInfo"),
  uiTarget: msg("uiTarget"),
  uiProperties: msg("uiProperties"),
  uiReset: msg("uiReset"),
  uiSave: msg("uiSave"),
  uiSaveAction: msg("uiSaveAction"),
  uiSaveError: msg("uiSaveError"),
  uiDirty: msg("uiDirty"),
  uiBlockType: msg("uiBlockType"),
  uiTheme: msg("uiTheme"),
  uiThemeChanged: msg("uiThemeChanged"),
  uiThemeStored: msg("uiThemeStored")
};

class BusinessReady {
  atom = atom(false);
  resources = /* @__PURE__ */ new Set();
  resourceToLoad(resource) {
    this.resources.add(resource);
    console.log("TO LOAD", resource);
    console.log("this.resources.size", this.resources.size);
    console.trace();
  }
  resourceLoaded(resource) {
    this.resources.delete(resource);
    console.log("LOADED", resource);
    console.log("this.resources.size", this.resources.size);
    if (this.resources.size === 0) {
      this.atom.set(true);
    }
  }
}
const businessReady = new BusinessReady();

class ResourceAtom {
  atom = atom();
  constructor(resource) {
    businessReady.resourceToLoad(resource);
    PubSub.subscribe(resource, (_msg, target) => {
      this.atom.set(target);
      businessReady.resourceLoaded(resource);
    });
  }
}
class FormData {
  data;
  map = map();
  dirtyKeys = /* @__PURE__ */ new Set();
  constructor(resource) {
    businessReady.resourceToLoad(resource);
    PubSub.subscribe(resource, (_msg, data) => {
      this.data = data;
      this.map.set({ ...data });
      this.dirtyKeys.clear();
      PubSub.publish(M.uiDirty, false);
      console.log("resource loaded: " + resource, this.map.get());
      businessReady.resourceLoaded(resource);
    });
    this.map.listen((value, changedKey) => {
      const changed = JSON.stringify(this.data[changedKey]) !== JSON.stringify(value[changedKey]);
      if (changed) {
        const wasDirty = this.dirtyKeys.size > 0;
        this.dirtyKeys.add(changedKey);
        if (!wasDirty) {
          PubSub.publish(M.uiDirty, true);
        }
      } else {
        this.dirtyKeys.delete(changedKey);
        const isDirty = this.dirtyKeys.size > 0;
        if (!isDirty) {
          PubSub.publish(M.uiDirty, false);
        }
      }
    });
  }
}

const properties = new FormData(M.uiProperties);
const propertiesMap = properties.map;

const isFunction = (valOrFunction) => typeof valOrFunction === 'function';
const resolveValue = (valOrFunction, arg) => isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction;

var ActionType;
(function (ActionType) {
    ActionType[ActionType["ADD_TOAST"] = 0] = "ADD_TOAST";
    ActionType[ActionType["UPDATE_TOAST"] = 1] = "UPDATE_TOAST";
    ActionType[ActionType["UPSERT_TOAST"] = 2] = "UPSERT_TOAST";
    ActionType[ActionType["DISMISS_TOAST"] = 3] = "DISMISS_TOAST";
    ActionType[ActionType["REMOVE_TOAST"] = 4] = "REMOVE_TOAST";
    ActionType[ActionType["START_PAUSE"] = 5] = "START_PAUSE";
    ActionType[ActionType["END_PAUSE"] = 6] = "END_PAUSE";
})(ActionType || (ActionType = {}));

function isWrappable(obj) {
  return obj != null && typeof obj === "object" && (Object.getPrototypeOf(obj) === Object.prototype || Array.isArray(obj));
}
function setProperty(state, property, value, force) {
  if (!force && state[property] === value) return;
  if (value === undefined) {
    delete state[property];
  } else state[property] = value;
}
function mergeStoreNode(state, value, force) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key], force);
  }
}
function updateArray(current, next) {
  if (typeof next === "function") next = next(current);
  if (Array.isArray(next)) {
    if (current === next) return;
    let i = 0,
        len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value) setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part,
      next = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part,
          isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const {
        from = 0,
        to = current.length - 1,
        by = 1
      } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    next = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(next, traversed);
    if (value === next) return;
  }
  if (part === undefined && value == undefined) return;
  if (part === undefined || isWrappable(next) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(next, value);
  } else setProperty(current, part, value);
}
function createStore(state) {
  const isArray = Array.isArray(state);
  function setStore(...args) {
    isArray && args.length === 1 ? updateArray(state, args[0]) : updatePath(state, args);
  }
  return [state, setStore];
}
function createMutable(state) {
  return state;
}
function produce(fn) {
  return state => {
    if (isWrappable(state)) fn(state);
    return state;
  };
}

const [store, setStore] = createStore({
    toasts: [],
    pausedAt: undefined,
});
const removalQueue = new Map();
const scheduleRemoval = (toastId, unmountDelay) => {
    if (removalQueue.has(toastId))
        return;
    const timeout = setTimeout(() => {
        removalQueue.delete(toastId);
        dispatch({
            type: ActionType.REMOVE_TOAST,
            toastId,
        });
    }, unmountDelay);
    removalQueue.set(toastId, timeout);
};
const unscheduleRemoval = (toastId) => {
    const timeout = removalQueue.get(toastId);
    removalQueue.delete(toastId);
    if (timeout)
        clearTimeout(timeout);
};
const dispatch = (action) => {
    switch (action.type) {
        case ActionType.ADD_TOAST:
            setStore('toasts', (t) => {
                const toasts = t;
                return [action.toast, ...toasts];
            });
            break;
        case ActionType.DISMISS_TOAST:
            const { toastId } = action;
            const toasts = store.toasts;
            if (toastId) {
                const toastToRemove = toasts.find((t) => t.id === toastId);
                if (toastToRemove)
                    scheduleRemoval(toastId, toastToRemove.unmountDelay);
                setStore('toasts', (t) => t.id === toastId, produce((t) => (t.visible = false)));
            }
            else {
                toasts.forEach((t) => {
                    scheduleRemoval(t.id, t.unmountDelay);
                });
                setStore('toasts', (t) => t.id !== undefined, produce((t) => (t.visible = false)));
            }
            break;
        case ActionType.REMOVE_TOAST:
            if (!action.toastId) {
                setStore('toasts', []);
                break;
            }
            setStore('toasts', (t) => {
                const toasts = t;
                return toasts.filter((t) => t.id !== action.toastId);
            });
            break;
        case ActionType.UPDATE_TOAST:
            if (action.toast.id) {
                unscheduleRemoval(action.toast.id);
            }
            setStore('toasts', (t) => t.id === action.toast.id, (t) => {
                const toast = t;
                return {
                    ...toast,
                    ...action.toast,
                };
            });
            break;
        case ActionType.UPSERT_TOAST:
            store.toasts.find((t) => t.id === action.toast.id)
                ? dispatch({ type: ActionType.UPDATE_TOAST, toast: action.toast })
                : dispatch({ type: ActionType.ADD_TOAST, toast: action.toast });
            break;
        case ActionType.START_PAUSE:
            setStore(produce((s) => {
                s.pausedAt = Date.now();
                s.toasts.forEach((t) => {
                    t.paused = true;
                });
            }));
            break;
        case ActionType.END_PAUSE:
            const pauseInterval = action.time - (store.pausedAt || 0);
            setStore(produce((s) => {
                s.pausedAt = undefined;
                s.toasts.forEach((t) => {
                    t.pauseDuration += pauseInterval;
                    t.paused = false;
                });
            }));
            break;
    }
};

const defaultTimeouts = {
    blank: 4000,
    error: 4000,
    success: 2000,
    loading: Infinity,
    custom: 4000,
};
const defaultToastOptions = {
    id: '',
    icon: '',
    unmountDelay: 500,
    duration: 3000,
    ariaProps: {
        role: 'status',
        'aria-live': 'polite',
    },
    className: '',
    style: {},
    position: 'top-right',
    iconTheme: {},
};
const defaultToasterOptions = {
    position: 'top-right',
    toastOptions: defaultToastOptions,
    gutter: 8,
    containerStyle: {},
    containerClassName: '',
};
const defaultContainerPadding = '16px';
const defaultContainerStyle = {
    position: 'fixed',
    'z-index': 9999,
    top: defaultContainerPadding,
    bottom: defaultContainerPadding,
    left: defaultContainerPadding,
    right: defaultContainerPadding,
    'pointer-events': 'none',
};

const generateID = (() => {
    let count = 0;
    return () => String(++count);
})();
const getToastWrapperStyles = (position, offset) => {
    const top = position.includes('top');
    const verticalStyle = top
        ? { top: 0, 'margin-top': `${offset}px` }
        : { bottom: 0, 'margin-bottom': `${offset}px` };
    const horizontalStyle = position.includes('center')
        ? { 'justify-content': 'center' }
        : position.includes('right')
            ? { 'justify-content': 'flex-end' }
            : {};
    return {
        left: 0,
        right: 0,
        display: 'flex',
        position: 'absolute',
        transition: `all 230ms cubic-bezier(.21,1.02,.73,1)`,
        ...verticalStyle,
        ...horizontalStyle,
    };
};
const getWrapperYAxisOffset = (toast, position) => {
    const { toasts } = store;
    const gutter = defaultOpts().gutter || defaultToasterOptions.gutter || 8;
    const relevantToasts = toasts.filter((t) => (t.position || position) === position && t.height);
    const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id);
    const toastsBefore = relevantToasts.filter((toast, i) => i < toastIndex && toast.visible).length;
    const offset = relevantToasts.slice(0, toastsBefore).reduce((acc, t) => acc + gutter + (t.height || 0), 0);
    return offset;
};

const toastBarBase = {
    display: 'flex',
    'align-items': 'center',
    color: '#363636',
    background: 'white',
    'box-shadow': '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)',
    'max-width': '350px',
    'pointer-events': 'auto',
    padding: '8px 10px',
    'border-radius': '4px',
    'line-height': '1.3',
    'will-change': 'transform',
};
const messageContainer = {
    display: 'flex',
    'align-items': 'center',
    flex: '1 1 auto',
    margin: '4px 10px',
    'white-space': 'pre-line',
};
const iconContainer = {
    'flex-shrink': 0,
    'min-width': '20px',
    'min-height': '20px',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'text-align': 'center',
};
const genSVGCubicBezier = (keySplines) => ({
    calcMode: 'spline',
    keyTimes: '0; 1',
    keySplines: keySplines,
});

const [defaultOpts, setDefaultOpts] = createSignal(defaultToasterOptions);
const createToast = (message, type = 'blank', options) => ({
    ...defaultToastOptions,
    ...defaultOpts().toastOptions,
    ...options,
    type,
    message,
    pauseDuration: 0,
    createdAt: Date.now(),
    visible: true,
    id: options.id || generateID(),
    paused: false,
    style: {
        ...defaultToastOptions.style,
        ...defaultOpts().toastOptions?.style,
        ...options.style,
    },
    duration: options.duration || defaultOpts().toastOptions?.duration || defaultTimeouts[type],
    position: options.position || defaultOpts().toastOptions?.position || defaultOpts().position || defaultToastOptions.position,
});
const createToastCreator = (type) => (message, options = {}) => {
    return createRoot(() => {
        const existingToast = store.toasts.find((t) => t.id === options.id);
        const toast = createToast(message, type, { ...existingToast, duration: undefined, ...options });
        dispatch({ type: ActionType.UPSERT_TOAST, toast });
        return toast.id;
    });
};
const toast$1 = (message, opts) => createToastCreator('blank')(message, opts);
untrack(() => toast$1);
toast$1.error = createToastCreator('error');
toast$1.success = createToastCreator('success');
toast$1.loading = createToastCreator('loading');
toast$1.custom = createToastCreator('custom');
toast$1.dismiss = (toastId) => {
    dispatch({
        type: ActionType.DISMISS_TOAST,
        toastId,
    });
};
toast$1.promise = (promise, msgs, opts) => {
    const id = toast$1.loading(msgs.loading, { ...opts });
    promise
        .then((p) => {
        toast$1.success(resolveValue(msgs.success, p), {
            id,
            ...opts,
        });
        return p;
    })
        .catch((e) => {
        toast$1.error(resolveValue(msgs.error, e), {
            id,
            ...opts,
        });
    });
    return promise;
};
toast$1.remove = (toastId) => {
    dispatch({
        type: ActionType.REMOVE_TOAST,
        toastId,
    });
};

const _tmpl$$d = ["<div", " style=\"", "\"", "><style>.sldt-active{z-index:9999;}.sldt-active>*{pointer-events:auto;}</style><!--#-->", "<!--/--></div>"];
const Toaster = props => {
  return ssr(_tmpl$$d, ssrHydrationKey(), ssrStyle({
    ...defaultContainerStyle,
    ...props.containerStyle
  }), ssrAttribute("class", escape(props.containerClassName, true), false), escape(createComponent$1(For, {
    get each() {
      return store.toasts;
    },
    children: toast => createComponent$1(ToastContainer, {
      toast: toast
    })
  })));
};

__astro_tag_component__(Toaster, "@astrojs/solid-js");

const _tmpl$$c = ["<div", " style=\"", "\">", "</div>"],
  _tmpl$2$2 = ["<div", " style=\"", "\"><!--#-->", "<!--/-->", "</div>"];
const ToastBar = props => {
  return ssr(_tmpl$2$2, ssrHydrationKey() + ssrAttribute("class", escape(props.toast.className, true), false), ssrStyle({
    ...toastBarBase,
    ...props.toast.style
  }), escape(createComponent$1(Switch, {
    get children() {
      return [createComponent$1(Match, {
        get when() {
          return props.toast.icon;
        },
        get children() {
          return ssr(_tmpl$$c, ssrHydrationKey(), ssrStyle(iconContainer), escape(props.toast.icon));
        }
      }), createComponent$1(Match, {
        get when() {
          return props.toast.type === "loading";
        },
        get children() {
          return ssr(_tmpl$$c, ssrHydrationKey(), ssrStyle(iconContainer), escape(createComponent$1(Loader, mergeProps(() => props.toast.iconTheme))));
        }
      }), createComponent$1(Match, {
        get when() {
          return props.toast.type === "success";
        },
        get children() {
          return ssr(_tmpl$$c, ssrHydrationKey(), ssrStyle(iconContainer), escape(createComponent$1(Success, mergeProps(() => props.toast.iconTheme))));
        }
      }), createComponent$1(Match, {
        get when() {
          return props.toast.type === "error";
        },
        get children() {
          return ssr(_tmpl$$c, ssrHydrationKey(), ssrStyle(iconContainer), escape(createComponent$1(Error$1, mergeProps(() => props.toast.iconTheme))));
        }
      })];
    }
  })), ssrElement("div", () => ({
    "style": messageContainer,
    ...props.toast.ariaProps
  }), () => escape(resolveValue(props.toast.message, props.toast)), false));
};

__astro_tag_component__(ToastBar, "@astrojs/solid-js");

const _tmpl$$b = ["<div", " style=\"", "\"", ">", "</div>"];
const ToastContainer = props => {
  const calculatePosition = () => {
    const position = props.toast.position || defaultToastOptions.position;
    const offset = getWrapperYAxisOffset(props.toast, position);
    const positionStyle2 = getToastWrapperStyles(position, offset);
    return positionStyle2;
  };
  const positionStyle = createMemo(() => calculatePosition());
  return ssr(_tmpl$$b, ssrHydrationKey(), ssrStyle(positionStyle()), ssrAttribute("class", props.toast.visible ? "sldt-active" : "", false), props.toast.type === "custom" ? escape(resolveValue(props.toast.message, props.toast)) : escape(createComponent$1(ToastBar, {
    get toast() {
      return props.toast;
    },
    get position() {
      return props.toast.position || defaultToastOptions.position;
    }
  })));
};

__astro_tag_component__(ToastContainer, "@astrojs/solid-js");

const _tmpl$$a = ["<circle", " cx=\"16\" cy=\"16\" r=\"0\">", "", "</circle>"],
  _tmpl$2$1 = ["<circle", " cx=\"16\" cy=\"16\" r=\"12\" opacity=\"0\">", "", "</circle>"];
const MainCircle = props => {
  const publicProps = {
    dur: "0.35s",
    begin: "100ms",
    fill: "freeze",
    calcMode: "spline",
    keyTimes: "0; 0.6; 1",
    keySplines: "0.25 0.71 0.4 0.88; .59 .22 .87 .63"
  };
  return ssr(_tmpl$$a, ssrHydrationKey() + ssrAttribute("fill", escape(props.fill, true), false), ssrElement("animate", () => ({
    "attributeName": "opacity",
    "values": "0; 1; 1",
    ...publicProps
  }), undefined, false), ssrElement("animate", () => ({
    "attributeName": "r",
    "values": "0; 17.5; 16",
    ...publicProps
  }), undefined, false));
};
const SecondaryCircle = props => {
  const publicProps = {
    dur: "1s",
    begin: props.begin || "320ms",
    fill: "freeze",
    ...genSVGCubicBezier("0.0 0.0 0.2 1")
  };
  return ssr(_tmpl$2$1, ssrHydrationKey() + ssrAttribute("fill", escape(props.fill, true), false), ssrElement("animate", () => ({
    "attributeName": "opacity",
    "values": "1; 0",
    ...publicProps
  }), undefined, false), ssrElement("animate", () => ({
    "attributeName": "r",
    "values": "12; 26",
    ...publicProps
  }), undefined, false));
};

__astro_tag_component__(MainCircle, "@astrojs/solid-js");
__astro_tag_component__(SecondaryCircle, "@astrojs/solid-js");

const _tmpl$$9 = ["<svg", " style=\"", "\" viewBox=\"0 0 32 32\" width=\"1.25rem\" height=\"1.25rem\"><!--#-->", "<!--/--><!--#-->", "<!--/--><path fill=\"none\"", " stroke-width=\"4\" stroke-dasharray=\"22\" stroke-dashoffset=\"22\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" d=\"M9.8,17.2l3.8,3.6c0.1,0.1,0.3,0.1,0.4,0l9.6-9.7\">", "</path></svg>"];
const Success = props => {
  const fill = props.primary || "#34C759";
  return ssr(_tmpl$$9, ssrHydrationKey(), "overflow:" + "visible", escape(createComponent$1(MainCircle, {
    fill: fill
  })), escape(createComponent$1(SecondaryCircle, {
    fill: fill,
    begin: "350ms"
  })), ssrAttribute("stroke", escape(props.secondary, true) || "#FCFCFC", false), ssrElement("animate", () => ({
    "attributeName": "stroke-dashoffset",
    "values": "22;0",
    "dur": "0.25s",
    "begin": "250ms",
    "fill": "freeze",
    ...genSVGCubicBezier("0.0, 0.0, 0.58, 1.0")
  }), undefined, false));
};

__astro_tag_component__(Success, "@astrojs/solid-js");

const _tmpl$$8 = ["<svg", " style=\"", "\" viewBox=\"0 0 32 32\" width=\"1.25rem\" height=\"1.25rem\"><!--#-->", "<!--/--><!--#-->", "<!--/--><path fill=\"none\"", " stroke-width=\"4\" stroke-dasharray=\"9\" stroke-dashoffset=\"9\" stroke-linecap=\"round\" d=\"M16,7l0,9\">", "</path><circle", " cx=\"16\" cy=\"23\" r=\"2.5\" opacity=\"0\">", "</circle></svg>"];
const Error$1 = props => {
  const fill = props.primary || "#FF3B30";
  return ssr(_tmpl$$8, ssrHydrationKey(), "overflow:" + "visible", escape(createComponent$1(MainCircle, {
    fill: fill
  })), escape(createComponent$1(SecondaryCircle, {
    fill: fill
  })), ssrAttribute("stroke", escape(props.secondary, true) || "#FFFFFF", false), ssrElement("animate", () => ({
    "attributeName": "stroke-dashoffset",
    "values": "9;0",
    "dur": "0.2s",
    "begin": "250ms",
    "fill": "freeze",
    ...genSVGCubicBezier("0.0, 0.0, 0.58, 1.0")
  }), undefined, false), ssrAttribute("fill", escape(props.secondary, true) || "#FFFFFF", false), ssrElement("animate", () => ({
    "attributeName": "opacity",
    "values": "0;1",
    "dur": "0.25s",
    "begin": "350ms",
    "fill": "freeze",
    ...genSVGCubicBezier("0.0, 0.0, 0.58, 1.0")
  }), undefined, false));
};

__astro_tag_component__(Error$1, "@astrojs/solid-js");

const _tmpl$$7 = ["<svg", " style=\"", "\" viewBox=\"0 0 32 32\" width=\"1.25rem\" height=\"1.25rem\"><path fill=\"none\"", " stroke-width=\"4\" stroke-miterlimit=\"10\" d=\"M16,6c3,0,5.7,1.3,7.5,3.4c1.5,1.8,2.5,4,2.5,6.6c0,5.5-4.5,10-10,10S6,21.6,6,16S10.5,6,16,6z\"></path><path fill=\"none\"", " stroke-width=\"4\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" d=\"M16,6c3,0,5.7,1.3,7.5,3.4c0.6,0.7,1.1,1.4,1.5,2.2\"><animateTransform attributeName=\"transform\" type=\"rotate\" from=\"0 16 16\" to=\"360 16 16\" dur=\"0.75s\" repeatCount=\"indefinite\"></animateTransform></path></svg>"];
const Loader = props => ssr(_tmpl$$7, ssrHydrationKey(), "overflow:" + "visible", ssrAttribute("stroke", escape(props.primary, true) || "#E5E7EB", false), ssrAttribute("stroke", escape(props.secondary, true) || "#4b5563", false));

__astro_tag_component__(Loader, "@astrojs/solid-js");

const toast = toast$1;

__astro_tag_component__(toast$1, "@astrojs/solid-js");
__astro_tag_component__(Toaster, "@astrojs/solid-js");
__astro_tag_component__(toast$1, "@astrojs/solid-js");

const defaultStyles = {
  body: {
    color: "text",
    backgroundColor: "background",
    padding: 5,
    fontFamily: "body",
    lineHeight: "body",
    fontWeight: "body",
    minHeight: "100%"
  },
  h1: {
    color: "text",
    fontFamily: "heading",
    lineHeight: "heading",
    fontWeight: "heading",
    fontSize: 5
  },
  h2: {
    color: "text",
    fontFamily: "heading",
    lineHeight: "heading",
    fontWeight: "heading",
    fontSize: 4
  },
  h3: {
    color: "text",
    fontFamily: "heading",
    lineHeight: "heading",
    fontWeight: "heading",
    fontSize: 3
  },
  h4: {
    color: "text",
    fontFamily: "heading",
    lineHeight: "heading",
    fontWeight: "heading",
    fontSize: 2
  },
  h5: {
    color: "text",
    fontFamily: "heading",
    lineHeight: "heading",
    fontWeight: "heading",
    fontSize: 1
  },
  h6: {
    color: "text",
    fontFamily: "heading",
    lineHeight: "heading",
    fontWeight: "heading",
    fontSize: 0
  },
  p: {
    color: "text",
    fontFamily: "body",
    fontWeight: "body",
    lineHeight: "body"
  },
  a: {
    color: "link"
  },
  pre: {
    fontFamily: "monospace",
    overflowX: "auto",
    code: {
      color: "inherit"
    }
  },
  code: {
    fontFamily: "monospace",
    fontSize: "inherit"
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0
  },
  th: {
    textAlign: "left",
    borderBottomStyle: "solid"
  },
  td: {
    textAlign: "left",
    borderBottomStyle: "solid"
  },
  img: {
    maxWidth: "100%"
  },
  input: {
    color: "text",
    backgroundColor: "muted",
    padding: "5px",
    width: "400px"
  },
  text: {
    color: "text"
  },
  box: {
    color: "text"
  },
  chip: {
    color: "sharp",
    fontSize: 3
  },
  card: {
    color: "sharp",
    backgroundColor: "card",
    fontSize: 3
  },
  linkButton: {
    color: "linkButton",
    borderColor: "linkButton"
  },
  error: {
    background: "errorbg",
    color: "red"
  },
  colors: {
    race: "red",
    advantage: "orange",
    equipment: "#08cc00"
  }
};

const theme$3 = {
  spaces: ["0px", "4px", "8px", "16px", "32px", "64px", "128px", "256px", "512px"],
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: "inherit",
    monospace: "Menlo, monospace"
  },
  fontSizes: ["12px", "14px", "16px", "20px", "24px", "32px", "48px", "64px", "96px"],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
  colors: {
    text: "#000",
    background: "#fff",
    primary: "#07c",
    secondary: "#30c",
    muted: "#f6f6f6"
  },
  styles: { ...defaultStyles }
};

const theme$2 = {
  spaces: ["0px", "4px", "8px", "16px", "32px", "64px", "128px", "256px", "512px"],
  breakpoints: ["576px", "768px", "992px", "1200px"],
  colors: {
    white: "#fff",
    black: "#000",
    gray: [
      "#fff",
      "#f8f9fa",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#6c757d",
      "#495057",
      "#343a40",
      "#212529"
    ],
    blue: "#007bff",
    indigo: "#6610f2",
    purple: "#6f42c1",
    pink: "#e83e8c",
    red: "#dc3545",
    orange: "#fd7e14",
    yellow: "#ffc107",
    green: "#28a745",
    teal: "#20c997",
    cyan: "#17a2b8",
    grayDark: "#343a40",
    text: "#212529",
    background: "#fff",
    primary: "#007bff",
    secondary: "#6c757d",
    muted: "#dee2e6",
    success: "#28a745",
    info: "#17a2b8",
    warning: "#ffc107",
    danger: "#dc3545",
    light: "#f8f9fa",
    dark: "#343a40",
    textMuted: "#6c757d"
  },
  space: ["0rem", "0.25rem", "0.5rem", "1rem", "1.5rem", "3rem"],
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    heading: "inherit",
    monospace: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
  },
  fontSizes: [
    "0.75rem",
    "0.875rem",
    "1rem",
    "1.25rem",
    "1.5rem",
    "1.75rem",
    "2rem",
    "2.5rem",
    "3.5rem",
    "4.5rem",
    "5.5rem",
    "6rem"
  ],
  fontWeights: {
    body: 400,
    heading: 500,
    bold: 700,
    light: 300,
    normal: 400,
    display: 300
  },
  lineHeights: {
    body: 1.5,
    heading: 1.2
  },
  sizes: {
    sm: 540,
    md: 720,
    lg: 960,
    xl: 1140
  },
  shadows: {
    default: "0 .5rem 1rem rgba(0, 0, 0, .15)",
    sm: "0 .125rem .25rem rgba(0, 0, 0, .075)",
    lg: "0 1rem 3rem rgba(0, 0, 0, .175)"
  },
  radii: {
    default: "0.25rem",
    sm: "0.2rem",
    lg: "0.3rem",
    pill: "50rem"
  },
  text: {
    heading: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
      mt: 0,
      mb: 2
    },
    display: {
      fontWeight: "display",
      lineHeight: "heading"
    }
  },
  styles: { ...defaultStyles }
};

const theme$1 = {
  spaces: ["0px", "4px", "8px", "16px", "32px", "64px", "128px", "256px", "512px"],
  colors: {
    ...defaultStyles.colors,
    sharp: "white",
    card: "#ebdcb9",
    errorbg: "white",
    text: "#debe6f",
    background: "#202124",
    primary: "#3cf",
    secondary: "#e0f",
    muted: "#4a4a4a",
    highlight: "#e0f",
    gray: "#999",
    purple: "#c0f",
    link: "#65b0db",
    linkButton: "darkblue"
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: "inherit",
    monospace: "Menlo, monospace"
  },
  fontSizes: ["12px", "14px", "16px", "20px", "24px", "32px", "48px", "64px", "72px"],
  fontWeights: {
    body: 400,
    heading: 700,
    display: 900
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25
  },
  text: {
    heading: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading"
    },
    display: {
      variant: "text.heading",
      fontSize: [5, 6],
      fontWeight: "display",
      letterSpacing: "-0.03em",
      mt: 3
    }
  },
  styles: { ...defaultStyles },
  prism: {
    ".comment,.prolog,.doctype,.cdata,.punctuation,.operator,.entity,.url": {
      color: "gray"
    },
    ".comment": {
      fontStyle: "italic"
    },
    ".property,.tag,.boolean,.number,.constant,.symbol,.deleted,.function,.class-name,.regex,.important,.variable": {
      color: "purple"
    },
    ".atrule,.attr-value,.keyword": {
      color: "primary"
    },
    ".selector,.attr-name,.string,.char,.builtin,.inserted": {
      color: "secondary"
    }
  }
};

const theme = {
  spaces: ["0px", "4px", "8px", "16px", "32px", "64px", "128px", "256px", "512px"],
  fonts: {
    body: "Roboto, system-ui, sans-serif",
    heading: "Roboto, system-ui, sans-serif",
    monospace: '"Roboto Mono", monospace'
  },
  fontSizes: ["12px", "14px", "16px", "20px", "24px", "32px", "48px", "64px", "96px"],
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 600
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
  colors: {
    ...defaultStyles.colors,
    sharp: "black",
    card: "#2f3136",
    errorbg: "#d4d0c7",
    text: "#202124",
    background: "#debe6f",
    primary: "#1a73e8",
    secondary: "#9c27b0",
    muted: "#f1f3f4",
    highlight: "#6244db",
    link: "#0a6ba3",
    linkButton: "#1976d2"
  },
  styles: { ...defaultStyles }
};

class Theme {
  atom = atom();
  constructor() {
    this.subscribe();
  }
  subscribe() {
    PubSub.subscribe(M.uiTheme, async (_msg, theme) => {
      this.setTheme(theme);
    });
  }
  setTheme(newTheme) {
    if (this.atom.get() === newTheme) {
      return false;
    }
    this.atom.set(newTheme);
    return true;
  }
  getTheme() {
    switch (this.atom.get()) {
      case "base":
        return theme$3;
      case "bootstrap":
        return theme$2;
      case "dark":
        return theme$1;
      case "light":
        return theme;
      default:
        return void 0;
    }
  }
}
const Theme$1 = new Theme();

const themeKey = (attr) => {
  switch (attr) {
    case "fontFamily":
      return "fonts";
    case "background":
    case "backgroundColor":
    case "borderColor":
      return "colors";
    case "padding":
    case "paddingLeft":
    case "paddingRight":
    case "paddingTop":
    case "paddingBottom":
    case "margin":
    case "marginLeft":
    case "marginRight":
    case "marginTop":
    case "marginBottom":
    case "width":
    case "height":
    case "gap":
    case "rowGap":
    case "columnGap":
      return "spaces";
    default:
      return attr + "s";
  }
};
const style = (tag = "", customStyle = {}) => {
  const theme = Theme$1.getTheme();
  const themeStyle = theme.styles[tag] ?? {};
  const baseStyle = { ...themeStyle, ...customStyle };
  const derivedStyle = {};
  Object.keys(baseStyle).forEach((attr) => {
    const key = themeKey(attr);
    if (theme[key]) {
      derivedStyle[attr] = theme[key][baseStyle[attr]] ?? baseStyle[attr];
    }
  });
  return { ...baseStyle, ...derivedStyle };
};

const stateAtom = atom();
const errorAtom = atom(null);
PubSub.subscribe(M.uiDirty, (_msg, dirty) => stateAtom.set(dirty ? "dirty" : "idle"));
PubSub.subscribe(M.uiSaveAction, () => stateAtom.set("saving"));
PubSub.subscribe(M.uiSaveError, (_msg, error) => {
  stateAtom.set("dirty");
  errorAtom.set(error);
  setTimeout(() => {
    errorAtom.set(null);
  }, 5e3);
  toast.error("Chyba p\u0159i ulo\u017Een\xED!", { style: style("error") });
});

/**
 * @ignore - internal component.
 */
const FormControlContext = createContext();

function formControlState(data) {
    const compose = () => {
        return data.states.reduce((acc, state) => {
            acc[state] = data.props[state];
            if (data.muiFormControl) {
                if (typeof data.props[state] === "undefined") {
                    acc[state] = data.muiFormControl[state];
                }
            }
            return acc;
        }, {});
    };
    const object = createMutable({});
    createComputed(() => {
        const newObject = compose();
        batch(() => {
            for (const key in newObject) {
                if (object[key] !== newObject[key])
                    object[key] = newObject[key];
            }
            const newKeys = Object.keys(newObject);
            for (const key in object) {
                if (!newKeys.includes(key))
                    delete object[key];
            }
        });
    });
    return object;
}

function useFormControl() {
    return useContext(FormControlContext);
}

// https://github.com/mui/material-ui/blob/master/packages/mui-base/src/composeClasses/composeClasses.ts
function composeClasses(slots, getUtilityClass, classes) {
    const output = {};
    Object.keys(slots).forEach(
    // `Objet.keys(slots)` can't be wider than `T` because we infer `T` from `slots`.
    // @ts-expect-error https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
    (slot) => {
        output[slot] = slots[slot]
            .reduce((acc, key) => {
            if (key) {
                if (classes && classes[key]) {
                    acc.push(classes[key]);
                }
                acc.push(getUtilityClass(key));
            }
            return acc;
        }, [])
            .join(" ");
    });
    return output;
}

let ThemeContext;
if (process.env.NODE_ENV !== "production") {
  const global = globalThis;
  const suid = global.__suid || (global.__suid = {});
  ThemeContext = suid.systemThemeContext || (suid.systemThemeContext = createContext({}));
} else {
  ThemeContext = createContext({});
}
const ThemeContext$1 = ThemeContext;

__astro_tag_component__(ThemeContext, "@astrojs/solid-js");

function renderMediaQuery(comparator, width, units = "px") {
    let selector;
    if (comparator === "up") {
        selector = `(min-width:${width}${units})`;
    }
    else if (comparator === "down") {
        selector = `(max-width:${width}${units})`;
    }
    else if (comparator === "between") {
        const [maxW, minW] = width;
        selector = `(max-width:${maxW}${units}) and (min-width:${minW}${units})`;
    }
    else {
        throw new Error(`Invalid comparator: ${comparator}`);
    }
    return `@media ${selector}`;
}

const breakpointsDefault = createBreakpointsOptions({
    columns: 12,
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
    },
    unit: "px",
});
function createBreakpointsOptions(options) {
    return options;
}
function createBreakpoints(options) {
    const result = {
        ...breakpointsDefault,
        ...(options ?? {}),
        up: (value, css) => {
            const key = renderMediaQuery("up", result.resolve(value));
            return (css ? { [key]: css } : key);
        },
        down: (value, css) => {
            const key = renderMediaQuery("down", result.resolve(value));
            return (css ? { [key]: css } : key);
        },
        between: (value, css) => {
            const key = renderMediaQuery("between", [
                result.resolve(value[0]),
                result.resolve(value[1]),
            ]);
            return (css ? { [key]: css } : key);
        },
        resolve: (value) => typeof value === "number" ? value : result.values[value],
    };
    return result;
}

function createSpacing(options) {
    if (typeof options === "function")
        return options;
    const resolved = (...values) => {
        return values
            .map((v) => typeof v === "number" ? `${v * (options ?? 8)}px` : v)
            .join(" ");
    };
    return resolved;
}

function isPlainObject(item) {
    return (item !== null && typeof item === "object" && item.constructor === Object);
}
function sortKeys(object, keys) {
    for (const key of keys) {
        const value = object[key];
        delete object[key];
        object[key] = value;
    }
}
function deepmerge(target, source, options = { clone: true }) {
    const output = options.clone ? { ...target } : target;
    if (isPlainObject(target) && isPlainObject(source)) {
        Object.keys(source).forEach((key) => {
            // Avoid prototype pollution
            if (key === "__proto__") {
                return;
            }
            if (isPlainObject(source[key]) &&
                key in target &&
                isPlainObject(target[key])) {
                // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
                output[key] = deepmerge(target[key], source[key], options);
            }
            else {
                output[key] = source[key];
            }
        });
        if (options.sortKeys)
            sortKeys(output, Object.keys(source));
    }
    return output;
}

function cloneObject(target) {
    if (Array.isArray(target)) {
        const output = [];
        for (const value of target) {
            output.push(cloneObject(value));
        }
        return output;
    }
    else if (isPlainObject(target)) {
        const output = {};
        for (const key in target) {
            if (key === "__proto__") {
                continue;
            }
            output[key] = cloneObject(target[key]);
        }
        return output;
    }
    else {
        return target;
    }
}

function merge(target, ...sources) {
    for (const source of sources)
        deepmerge(target, cloneObject(source), {
            clone: false,
        });
    return target;
}

const shapeDefaults = createShapeOptions({
    borderRadius: 4,
});
function createShapeOptions(data) {
    return data;
}
function createShape(options) {
    const result = {
        ...merge({}, shapeDefaults, options),
    };
    return result;
}

function createThemeOptions$1(options) {
  return options;
}
function createTheme$1(data) {
  const result = {
    direction: "ltr",
    shadows: void 0,
    transitions: void 0,
    components: void 0,
    palette: void 0,
    typography: void 0,
    zIndex: void 0,
    mixins: void 0,
    ...data,
    breakpoints: createBreakpoints(data?.breakpoints),
    shape: createShape(data?.shape),
    spacing: createSpacing(data?.spacing)
  };
  return result;
}

__astro_tag_component__(createThemeOptions$1, "@astrojs/solid-js");
__astro_tag_component__(createTheme$1, "@astrojs/solid-js");
__astro_tag_component__(createTheme$1, "@astrojs/solid-js");

function makeGetDefaultTheme(createTheme) {
    let defaultTheme;
    return function getDefaultTheme() {
        if (!defaultTheme) {
            defaultTheme = createTheme();
        }
        return defaultTheme;
    };
}

const getDefaultTheme$1 = makeGetDefaultTheme(createTheme$1);

function isEmptyObject(object) {
    for (const _key in object)
        return false;
    return true;
}

function useTheme$2(defaultTheme = getDefaultTheme$1, Context = ThemeContext$1) {
    const theme = useContext(Context);
    if (isEmptyObject(theme) && defaultTheme) {
        if (typeof defaultTheme === "function")
            return defaultTheme();
        return defaultTheme;
    }
    if (!theme)
        throw new Error("Theme is not defined");
    return theme;
}

function useTheme$1(defaultTheme) {
    return useTheme$2(defaultTheme, ThemeContext$1);
}

function useThemeProps(options) {
    const theme = useTheme$1();
    const set = (v) => v;
    const propDefaults = typeof options.propDefaults === "function"
        ? options.propDefaults({
            set,
            inProps: options.props,
        })
        : options.propDefaults;
    return mergeProps(...[
        ...(propDefaults ? [propDefaults] : []),
        () => theme.components?.[options.name]?.defaultProps || {},
        options.props,
    ]);
}

function componentTrap(fn) {
    function Component(props) {
        return fn(props);
    }
    Object.defineProperty(Component, "name", {
        value: fn.name,
    });
    Component.toString = fn.toString;
    return Component;
}

function createComponentFactory() {
    return function (options) {
        function useClasses(ownerState) {
            const haveSlotClasses = !!options.slotClasses;
            const compose = () => {
                if (!options.slotClasses)
                    throw new Error(`'slotClasses' option is not defined`);
                if (!options.utilityClass)
                    throw new Error(`'utilityClass' option is not defined`);
                return composeClasses(options.slotClasses(ownerState), options.utilityClass, ownerState["classes"] ?? "");
            };
            const classes = createMutable({});
            if (haveSlotClasses)
                createComputed(() => {
                    const result = compose();
                    batch(() => {
                        for (const slot in result)
                            classes[slot] = result[slot];
                    });
                });
            return classes;
        }
        function splitInProps(allProps) {
            const [props, otherProps] = splitProps(allProps, options.selfPropNames);
            return { allProps, props, otherProps };
        }
        function useThemeProps$1(input) {
            return useThemeProps({
                propDefaults: options.propDefaults,
                ...input,
                name: options.name,
            });
        }
        function useProps(props) {
            const themeProps = useThemeProps$1({ props });
            return splitInProps(themeProps);
        }
        function defineComponent(cb) {
            cb.toString = () => `${options.name}-root`;
            return componentTrap(cb);
        }
        function component(cb) {
            const Component = defineComponent(function Component(inProps) {
                const { allProps, otherProps, props } = useProps(inProps);
                const classes = (options.autoCallUseClasses ?? true)
                    ? useClasses(allProps)
                    : {};
                return cb({
                    allProps,
                    otherProps,
                    props,
                    classes,
                });
            });
            Object.defineProperty(Component, "name", { value: cb.name });
            return Component;
        }
        return {
            name: options.name,
            selfPropNames: options.selfPropNames,
            component,
            defineComponent,
            useClasses,
            useThemeProps: useThemeProps$1,
            useProps,
            splitInProps,
        };
    };
}

const StyledEngineContext = createContext({});

__astro_tag_component__(StyledEngineContext, "@astrojs/solid-js");

function mergeStyleProps(values) {
    const result = values.reduce((result, value) => {
        if ("name" in value)
            result[`--${value.name}`] = "0";
        deepmerge(result, value, {
            clone: false,
            sortKeys: true,
        });
        return result;
    }, {});
    delete result.name;
    return result;
}

function isVar(value) {
    return value.startsWith("--");
}
function isPrivateVar(value) {
    return value.startsWith("__");
}
function isSelector(value) {
    return /[^a-z-]/i.test(value) && !isVar(value);
}
function isGlobalSelector(value) {
    return value.startsWith("@global");
}
function isMediaQuery(value) {
    return value.startsWith("@media");
}
function isKeyframes(value) {
    return value.startsWith("@keyframes");
}

function snakeCase(value) {
    return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function renderSelector(propKey, propValue, selectors = [], options = {}) {
    const subselectors = propKey.split(",").map((v) => {
        v = v.trim();
        return v.includes("&") ? v : `& ${v}`;
    });
    return render(propValue, (selectors.length ? selectors : [""]).flatMap((selector) => subselectors.map((v) => v.replace(/&/g, selector).trim())), {
        ...options,
    });
}
function render(css, selectors = [], options = {}) {
    const props = [];
    const rules = [];
    for (let propKey in css) {
        const propValue = css[propKey];
        if (isPrivateVar(propKey)) {
            continue;
        }
        else if (isGlobalSelector(propKey)) {
            for (const selector in propValue) {
                rules.push(...renderSelector(selector, propValue[selector], [], options));
            }
        }
        else if (isMediaQuery(propKey)) {
            rules.push(...render(propValue, selectors, {
                ...options,
                sublevel: true,
            }).map((v) => `${propKey} {\n${v}\n}`));
        }
        else if (isVar(propKey)) {
            if (propValue !== undefined && propValue !== null)
                props.push(`${propKey}: ${propValue};`);
        }
        else if (isKeyframes(propKey)) {
            const keyframes = [];
            for (const k in propValue) {
                keyframes.push(...render(propValue[k], [/^\d+$/.test(k) ? `${k}%` : k], {
                    ...options,
                    sublevel: true,
                }));
            }
            rules.push(`${propKey} {\n${keyframes.join("\n")}\n}`);
        }
        else if (isSelector(propKey)) {
            rules.push(...renderSelector(propKey, propValue, selectors, options));
        }
        else if (options.extraProperties && propKey in options.extraProperties) {
            const extraProps = options.extraProperties[propKey](propValue);
            for (const extraPropKey in extraProps) {
                const inValue = extraProps[extraPropKey];
                const value = options.onPropertyValue
                    ? options.onPropertyValue(extraPropKey, inValue)
                    : inValue;
                if (value !== undefined && value !== null)
                    props.push(`${snakeCase(extraPropKey)}: ${value};`);
            }
        }
        else {
            propKey = snakeCase(propKey);
            const value = options.onPropertyValue
                ? options.onPropertyValue(propKey, propValue)
                : propValue;
            if (value !== undefined && value !== null)
                props.push(`${propKey}: ${value};`);
        }
    }
    const renderProps = (level) => {
        const pad = "\t".repeat(level);
        return `${pad}${props.join(`\n${pad}`)}`;
    };
    if (selectors.length) {
        const pad = options.sublevel ? `\t` : ``;
        const selectorStr = pad + selectors.join(`,\n${pad}`);
        return [
            ...(props.length
                ? [
                    `${selectorStr} {\n${renderProps(options.sublevel ? 2 : 1)}\n${pad}}`,
                ]
                : []),
            ...rules,
        ];
    }
    else {
        return [...(props.length ? [renderProps(0)] : []), ...rules];
    }
}

function randomString() {
    return Math.random().toString(36).substring(2, 15).slice(0, 8);
}

function resolveFunction(value, args) {
    if (typeof value === "function")
        value = value(...(args || []));
    return value;
}

function toArray(value) {
    return value ? (Array.isArray(value) ? value : [value]) : [];
}

function create(name, rules) {
    const id = randomString().slice(0, 6);
    return {
        id,
        name: name,
        className: `${name}-${id}`,
        rules: rules.replaceAll(`$id`, `${id}`),
    };
}
function createStyleObject(options) {
    const className = `${options.name}-$id`;
    const propsValues = toArray(resolveFunction(options.props));
    const rules = propsValues
        .map((v) => typeof v === "string"
        ? `.${className} {\n${v}\n}`
        : render(v, [`.${className}`], {
            extraProperties: options.extraProperties,
        }).join("\n"))
        .join("\n");
    const styleObject = options.cache?.get(rules) || create(options.name, rules);
    if (options.cache)
        options.cache.set(rules, styleObject);
    return styleObject;
}

function setStyleElementText(element, text) {
    if ("styleSheet" in element) {
        element["styleSheet"].cssText = text;
    }
    else {
        element.innerText = "";
        element.appendChild(document.createTextNode(text));
    }
}

function setAttributes(element, attributes) {
    for (const name in attributes) {
        const value = attributes[name];
        if (value !== undefined) {
            if (value === null) {
                element.removeAttribute(name);
            }
            else {
                element.setAttribute(name, value);
            }
        }
    }
}
function createStyleElement(css, attributes) {
    const element = document.createElement("style");
    element.type = "text/css";
    if (attributes)
        setAttributes(element, attributes);
    setStyleElementText(element, css);
    return element;
}

function registerStyleElementUsage(style) {
    let uses = Number(style.getAttribute("data-uses"));
    uses++;
    style.setAttribute("data-uses", uses.toString());
}

function appendStyleElement(css, attributes) {
    if (Array.isArray(css))
        css = css.join("\n");
    const id = attributes?.["id"];
    const head = document.head || document.getElementsByTagName("head")[0];
    const prevElement = id && document.getElementById(id);
    if (prevElement && prevElement instanceof HTMLStyleElement) {
        setStyleElementText(prevElement, css);
        registerStyleElementUsage(prevElement);
        return prevElement;
    }
    else {
        if (prevElement)
            prevElement.remove();
        const element = createStyleElement(css, attributes);
        registerStyleElementUsage(element);
        head.appendChild(element);
        return element;
    }
}

function findStyleElement(id) {
    return document.getElementById(id);
}

function unregisterStyleElementUsage(style) {
    let uses = Number(style.getAttribute("data-uses"));
    uses--;
    if (uses <= 0) {
        style.remove();
    }
    else {
        style.setAttribute("data-uses", uses.toString());
    }
}

const styleObjectCache = new Map();
function normalizeStyleProps(props) {
    if (!props)
        return [];
    return (Array.isArray(props) ? props : [props])
        // https://github.com/microsoft/TypeScript/issues/44408
        .flat(Infinity)
        .filter((v) => !!v);
}
function createStyle(value) {
    const context = useContext(StyledEngineContext);
    const [name, setName] = createSignal("");
    let styleElement;
    createRenderEffect((prevResult) => {
        const propsValue = value();
        let styleObject;
        if (propsValue) {
            styleObject = createStyleObject({
                name: "css",
                props: mergeStyleProps(normalizeStyleProps(propsValue)),
                cache: styleObjectCache,
            });
            styleElement = findStyleElement(styleObject.id);
            if (styleElement) {
                registerStyleElementUsage(styleElement);
            }
            else {
                styleElement = appendStyleElement(styleObject.rules, {
                    id: styleObject.id,
                    nonce: context.cache?.nonce,
                });
            }
        }
        if (prevResult?.styleElement) {
            unregisterStyleElementUsage(prevResult.styleElement);
        }
        if (typeof styleObject?.className === "string") {
            setName(styleObject.className);
        }
        else {
            setName("");
        }
        return {
            className: styleObject?.className,
            styleElement,
        };
    }, undefined);
    onCleanup(() => {
        if (styleElement)
            unregisterStyleElementUsage(styleElement);
    });
    return name;
}

const resolvedPropKey = "__resolved";

const $$b = createComponentFactory()({
  name: "MuiGlobalStyles",
  selfPropNames: ["styles"]
});
const GlobalStyles = $$b.component(function GlobalStyles2({
  props
}) {
  createStyle(() => ({
    "@global": props.styles || {}
  }));
  return [];
});

__astro_tag_component__(GlobalStyles, "@astrojs/solid-js");

/**
 * Returns a number whose value is limited to the given range.
 * @param {number} value The value to be clamped
 * @param {number} min The lower boundary of the output range
 * @param {number} max The upper boundary of the output range
 * @returns {number} A number in the range [min, max]
 */
function clamp(value, min = 0, max = 1) {
    if (process.env.NODE_ENV !== "production") {
        if (value < min || value > max) {
            console.error(`MUI: The value provided ${value} is out of range [${min}, ${max}].`);
        }
    }
    return Math.min(Math.max(min, value), max);
}
/**
 * Converts a color from CSS hex format to CSS rgb format.
 * @param {string} color - Hex color, i.e. #nnn or #nnnnnn
 * @returns {string} A CSS rgb color string
 */
function hexToRgb(color) {
    color = color.substr(1);
    const re = new RegExp(`.{1,${color.length >= 6 ? 2 : 1}}`, "g");
    let colors = color.match(re);
    if (colors && colors[0].length === 1) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        colors = colors.map((n) => n + n);
    }
    return colors
        ? `rgb${colors.length === 4 ? "a" : ""}(${colors
            .map((n, index) => {
            return index < 3
                ? parseInt(n, 16)
                : Math.round((parseInt(n, 16) / 255) * 1000) / 1000;
        })
            .join(", ")})`
        : "";
}
/**
 * Returns an object with the type and values of a color.
 *
 * Note: Does not support rgb % values.
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @returns {object} - A MUI color object: {type: string, values: number[]}
 */
function decomposeColor(color) {
    // Idempotent
    if (typeof color !== "string") {
        return color;
    }
    if (color.charAt(0) === "#") {
        return decomposeColor(hexToRgb(color));
    }
    const marker = color.indexOf("(");
    const type = color.substring(0, marker);
    if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(type) === -1) {
        throw new Error("MUI: Unsupported `%s` color.\n" +
            "The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color(). " +
            color);
    }
    const valuesInput = color.substring(marker + 1, color.length - 1);
    let values;
    let colorSpace;
    if (type === "color") {
        values = valuesInput.split(" ");
        colorSpace = values.shift();
        if (values.length === 4 && values[3].charAt(0) === "/") {
            values[3] = values[3].substr(1);
        }
        if (["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        colorSpace) === -1) {
            throw new Error("MUI: unsupported `%s` color space.\n" +
                "The following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020. " +
                colorSpace);
        }
    }
    else {
        values = valuesInput.split(",");
    }
    return { type, values: values.map((value) => parseFloat(value)), colorSpace };
}
/**
 * Converts a color object with type and values to a string.
 * @param {object} color - Decomposed color
 * @param {string} color.type - One of: 'rgb', 'rgba', 'hsl', 'hsla'
 * @param {array} color.values - [n,n,n] or [n,n,n,n]
 * @returns {string} A CSS color string
 */
function recomposeColor(color) {
    const { type, colorSpace } = color;
    const { values } = color;
    let newValues;
    if (type.indexOf("rgb") !== -1) {
        // Only convert the first 3 values to int (i.e. not alpha)
        newValues = values
            .map((n, i) => (i < 3 ? parseInt(n.toString(), 10) : n))
            .join(",");
    }
    else if (type.indexOf("hsl") !== -1) {
        newValues = values
            .map((n, i) => (i === 1 || i === 2 ? `${n}%` : n))
            .join(",");
    }
    if (type.indexOf("color") !== -1) {
        newValues = `${colorSpace} ${values.join(" ")}`;
    }
    else {
        newValues = `${values.join(", ")}`;
    }
    return `${type}(${newValues})`;
}
/**
 * Converts a color from hsl format to rgb format.
 * @param {string} color - HSL color values
 * @returns {string} rgb color values
 */
function hslToRgb(color) {
    const c = decomposeColor(color);
    const { values } = c;
    const h = values[0];
    const s = values[1] / 100;
    const l = values[2] / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    let type = "rgb";
    const rgb = [
        Math.round(f(0) * 255),
        Math.round(f(8) * 255),
        Math.round(f(4) * 255),
    ];
    if (c.type === "hsla") {
        type += "a";
        rgb.push(values[3]);
    }
    return recomposeColor({ type, values: rgb });
}
/**
 * The relative brightness of any point in a color space,
 * normalized to 0 for darkest black and 1 for lightest white.
 *
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
 * @returns {number} The relative brightness of the color in the range 0 - 1
 */
function getLuminance(color) {
    const { type, values } = decomposeColor(color);
    let rgb = type === "hsl" ? decomposeColor(hslToRgb(color)).values : values;
    rgb = rgb.map((val) => {
        if (type !== "color") {
            val /= 255; // normalized
        }
        return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
    });
    // Truncate at 3 digits
    return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
}
/**
 * Calculates the contrast ratio between two colors.
 *
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 * @param {string} foreground - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {string} background - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @returns {number} A contrast ratio value in the range 0 - 21.
 */
function getContrastRatio(foreground, background) {
    const lumA = getLuminance(foreground);
    const lumB = getLuminance(background);
    return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}
/**
 * Sets the absolute transparency of a color.
 * Any existing alpha values are overwritten.
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
 * @param {number} value - value to set the alpha channel to in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */
function alpha(color, value) {
    // eslint-disable-next-line prefer-const
    let { type, values } = decomposeColor(color);
    value = clamp(value);
    if (type === "rgb" || type === "hsl") {
        type += "a";
    }
    if (type === "color") {
        values[3] = `/${value}`;
    }
    else {
        values[3] = value;
    }
    return recomposeColor({ type, values });
}
/**
 * Darkens a color.
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
 * @param {number} coefficient - multiplier in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */
function darken(inputColor, coefficient) {
    const color = decomposeColor(inputColor);
    coefficient = clamp(coefficient);
    if (color.type.indexOf("hsl") !== -1) {
        color.values[2] *= 1 - coefficient;
    }
    else if (color.type.indexOf("rgb") !== -1 ||
        color.type.indexOf("color") !== -1) {
        for (let i = 0; i < 3; i += 1) {
            color.values[i] *= 1 - coefficient;
        }
    }
    return recomposeColor(color);
}
/**
 * Lightens a color.
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
 * @param {number} coefficient - multiplier in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */
function lighten(inputColor, coefficient) {
    const color = decomposeColor(inputColor);
    coefficient = clamp(coefficient);
    if (color.type.indexOf("hsl") !== -1) {
        color.values[2] += (100 - color.values[2]) * coefficient;
    }
    else if (color.type.indexOf("rgb") !== -1) {
        for (let i = 0; i < 3; i += 1) {
            color.values[i] += (255 - color.values[i]) * coefficient;
        }
    }
    else if (color.type.indexOf("color") !== -1) {
        for (let i = 0; i < 3; i += 1) {
            color.values[i] += (1 - color.values[i]) * coefficient;
        }
    }
    return recomposeColor(color);
}

function StyledEngineProvider(inProps) {
  return createComponent$1(StyledEngineContext.Provider, {
    get value() {
      return inProps.value || {};
    },
    get children() {
      return inProps.children;
    }
  });
}

__astro_tag_component__(StyledEngineProvider, "@astrojs/solid-js");

const componentsDefault = createComponentsOptions({});
function createComponentsOptions(options) {
  return options;
}
function createComponents(data) {
  const result = {
    ...merge({}, componentsDefault, data ?? {})
  };
  return result;
}

__astro_tag_component__(createComponentsOptions, "@astrojs/solid-js");
__astro_tag_component__(createComponents, "@astrojs/solid-js");

function createMixins(breakpoints, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
spacing = undefined, mixins = {}) {
    return {
        toolbar: {
            minHeight: 56,
            [`${breakpoints.up("xs")} and (orientation: landscape)`]: {
                minHeight: 48,
            },
            [breakpoints.up("sm")]: {
                minHeight: 64,
            },
        },
        ...mixins,
    };
}

const common = {
    black: "#000",
    white: "#fff",
};

const red = {
    50: "#ffebee",
    100: "#ffcdd2",
    200: "#ef9a9a",
    300: "#e57373",
    400: "#ef5350",
    500: "#f44336",
    600: "#e53935",
    700: "#d32f2f",
    800: "#c62828",
    900: "#b71c1c",
    A100: "#ff8a80",
    A200: "#ff5252",
    A400: "#ff1744",
    A700: "#d50000",
};

const purple = {
    50: "#f3e5f5",
    100: "#e1bee7",
    200: "#ce93d8",
    300: "#ba68c8",
    400: "#ab47bc",
    500: "#9c27b0",
    600: "#8e24aa",
    700: "#7b1fa2",
    800: "#6a1b9a",
    900: "#4a148c",
    A100: "#ea80fc",
    A200: "#e040fb",
    A400: "#d500f9",
    A700: "#aa00ff",
};

const blue = {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3",
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
    A100: "#82b1ff",
    A200: "#448aff",
    A400: "#2979ff",
    A700: "#2962ff",
};

const lightBlue = {
    50: "#e1f5fe",
    100: "#b3e5fc",
    200: "#81d4fa",
    300: "#4fc3f7",
    400: "#29b6f6",
    500: "#03a9f4",
    600: "#039be5",
    700: "#0288d1",
    800: "#0277bd",
    900: "#01579b",
    A100: "#80d8ff",
    A200: "#40c4ff",
    A400: "#00b0ff",
    A700: "#0091ea",
};

const green = {
    50: "#e8f5e9",
    100: "#c8e6c9",
    200: "#a5d6a7",
    300: "#81c784",
    400: "#66bb6a",
    500: "#4caf50",
    600: "#43a047",
    700: "#388e3c",
    800: "#2e7d32",
    900: "#1b5e20",
    A100: "#b9f6ca",
    A200: "#69f0ae",
    A400: "#00e676",
    A700: "#00c853",
};

const orange = {
    50: "#fff3e0",
    100: "#ffe0b2",
    200: "#ffcc80",
    300: "#ffb74d",
    400: "#ffa726",
    500: "#ff9800",
    600: "#fb8c00",
    700: "#f57c00",
    800: "#ef6c00",
    900: "#e65100",
    A100: "#ffd180",
    A200: "#ffab40",
    A400: "#ff9100",
    A700: "#ff6d00",
};

const grey = {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    A100: "#f5f5f5",
    A200: "#eeeeee",
    A400: "#bdbdbd",
    A700: "#616161",
};

const useLightOptions = () => ({
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.6)",
    disabled: "rgba(0, 0, 0, 0.38)"
  },
  divider: "rgba(0, 0, 0, 0.12)",
  background: {
    paper: common.white,
    default: common.white
  },
  action: {
    active: "rgba(0, 0, 0, 0.54)",
    hover: "rgba(0, 0, 0, 0.04)",
    hoverOpacity: 0.04,
    selected: "rgba(0, 0, 0, 0.08)",
    selectedOpacity: 0.08,
    disabled: "rgba(0, 0, 0, 0.26)",
    disabledBackground: "rgba(0, 0, 0, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(0, 0, 0, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.12
  }
});
const lightColors = {
  primary: {
    main: blue[700],
    light: blue[400],
    dark: blue[800]
  },
  secondary: {
    main: purple[500],
    light: purple[300],
    dark: purple[700]
  },
  error: {
    main: red[700],
    light: red[400],
    dark: red[800]
  },
  info: {
    main: lightBlue[700],
    light: lightBlue[800],
    dark: lightBlue[900]
  },
  success: {
    main: green[800],
    light: green[500],
    dark: green[900]
  },
  warning: {
    main: "#ED6C02",
    light: orange[500],
    dark: orange[900]
  }
};
const useDarkOptions = () => ({
  text: {
    primary: common.white,
    secondary: "rgba(255, 255, 255, 0.7)",
    disabled: "rgba(255, 255, 255, 0.5)"
  },
  divider: "rgba(255, 255, 255, 0.12)",
  background: {
    paper: "#121212",
    default: "#121212"
  },
  action: {
    active: common.white,
    hover: "rgba(255, 255, 255, 0.08)",
    hoverOpacity: 0.08,
    selected: "rgba(255, 255, 255, 0.16)",
    selectedOpacity: 0.16,
    disabled: "rgba(255, 255, 255, 0.3)",
    disabledBackground: "rgba(255, 255, 255, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(255, 255, 255, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.24
  }
});
const darkColors = {
  primary: {
    main: blue[200],
    light: blue[50],
    dark: blue[400]
  },
  secondary: {
    main: purple[200],
    light: purple[50],
    dark: purple[400]
  },
  error: {
    main: red[500],
    light: red[300],
    dark: red[700]
  },
  info: {
    main: lightBlue[400],
    light: lightBlue[300],
    dark: lightBlue[700]
  },
  success: {
    main: green[400],
    light: green[300],
    dark: green[700]
  },
  warning: {
    main: orange[400],
    light: orange[300],
    dark: orange[700]
  }
};
const modes = {
  light: useLightOptions,
  dark: useDarkOptions
};
function getContrastText(background, contrastThreshold) {
  return getContrastRatio(background, common.white) >= contrastThreshold ? common.white : "rgba(0, 0, 0, 0.87)";
}
function addLightOrDark(intent, direction, shade, tonalOffset) {
  const tonalOffsetLight = typeof tonalOffset === "number" ? tonalOffset : tonalOffset.light;
  const tonalOffsetDark = typeof tonalOffset === "number" ? tonalOffset * 1.5 : tonalOffset.dark;
  if (!intent[direction]) {
    if (intent.hasOwnProperty(shade)) {
      intent[direction] = intent[shade];
    } else if (direction === "light") {
      intent.light = lighten(intent.main, tonalOffsetLight);
    } else if (direction === "dark") {
      intent.dark = darken(intent.main, tonalOffsetDark);
    }
  }
}
function augmentColor(data) {
  const color = {
    ...data.color
  };
  const mainShade = data.mainShade ?? 500;
  if (!data.color.main && data.color[mainShade]) color.main = data.color[mainShade];
  addLightOrDark(color, "light", data.lightShade ?? 300, data.tonalOffset);
  addLightOrDark(color, "dark", data.darkShade ?? 700, data.tonalOffset);
  if (!color.contrastText) color.contrastText = getContrastText(color.main, data.contrastThreshold);
  return color;
}
const usePalleteDefaults = () => createPaletteOptions({
  mode: "light",
  tonalOffset: 0.2,
  contrastThreshold: 3,
  grey,
  common
});
function createPaletteOptions(data) {
  return data;
}
function createPalette(options) {
  const colorNames = ["error", "info", "primary", "secondary", "success", "warning"];
  const palleteDefaults = usePalleteDefaults();
  const result = {
    ...merge({}, palleteDefaults, modes[options?.mode ?? palleteDefaults.mode](), options),
    isColorName(name) {
      return colorNames.includes(name);
    },
    getColorObject(color) {
      return result[color];
    },
    getColor(color) {
      return result.mode === "light" ? result[color].light : result[color].dark;
    },
    augmentColor(data) {
      return augmentColor({
        ...data,
        tonalOffset: result.tonalOffset,
        contrastThreshold: result.contrastThreshold
      });
    },
    getContrastText(background) {
      return getContrastText(background, result.contrastThreshold);
    }
  };
  const getDefaultColor = color => result.mode === "light" ? lightColors[color] : darkColors[color];
  result.primary = result.augmentColor({
    color: result.primary || getDefaultColor("primary")
  });
  result.secondary = result.augmentColor({
    color: result.secondary || getDefaultColor("secondary"),
    mainShade: "A400",
    lightShade: "A200",
    darkShade: "A700"
  });
  result.error = result.augmentColor({
    color: result.error || getDefaultColor("error")
  });
  result.warning = result.augmentColor({
    color: result.warning || getDefaultColor("warning")
  });
  result.info = result.augmentColor({
    color: result.info || getDefaultColor("info")
  });
  result.success = result.augmentColor({
    color: result.success || getDefaultColor("success")
  });
  return result;
}

__astro_tag_component__(useLightOptions, "@astrojs/solid-js");
__astro_tag_component__(useDarkOptions, "@astrojs/solid-js");
__astro_tag_component__(usePalleteDefaults, "@astrojs/solid-js");
__astro_tag_component__(createPaletteOptions, "@astrojs/solid-js");
__astro_tag_component__(createPalette, "@astrojs/solid-js");

const cache = {};
const shadowKeyUmbraOpacity = 0.2;
const shadowKeyPenumbraOpacity = 0.14;
const shadowAmbientShadowOpacity = 0.12;
function createCssShadow(...px) {
  return [`${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`, `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`, `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`].join(",");
}
const shadows = [() => "none", () => createCssShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), () => createCssShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), () => createCssShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), () => createCssShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), () => createCssShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), () => createCssShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), () => createCssShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), () => createCssShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), () => createCssShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), () => createCssShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), () => createCssShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), () => createCssShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), () => createCssShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), () => createCssShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), () => createCssShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), () => createCssShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), () => createCssShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), () => createCssShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), () => createCssShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), () => createCssShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), () => createCssShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), () => createCssShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), () => createCssShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), () => createCssShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];
function createShadows() {
  return new Proxy([], {
    get: (target, p) => {
      if (typeof p !== "string" || isNaN(Number(p))) return target[p];
      if (p in cache) return cache[p];
      return cache[p] = shadows[p]();
    }
  });
}

__astro_tag_component__(createShadows, "@astrojs/solid-js");

const easing = {
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
};
const duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  complex: 375,
  enteringScreen: 225,
  leavingScreen: 195
};
function formatMs(milliseconds) {
  return `${Math.round(milliseconds)}ms`;
}
function getAutoHeightDuration(height) {
  if (!height) {
    return 0;
  }
  const constant = height / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
function createTransitions(inputTransitions) {
  const mergedEasing = {
    ...easing,
    ...inputTransitions.easing
  };
  const mergedDuration = {
    ...duration,
    ...inputTransitions.duration
  };
  const create = (props = ["all"], options = {}) => {
    const {
      duration: durationOption = mergedDuration.standard,
      easing: easingOption = mergedEasing.easeInOut,
      delay = 0,
      ...other
    } = options;
    if (process.env.NODE_ENV !== "production") {
      const isString = value => typeof value === "string";
      const isNumber = value => !isNaN(parseFloat(value));
      if (!isString(props) && !Array.isArray(props)) {
        console.error('MUI: Argument "props" must be a string or Array.');
      }
      if (!isNumber(durationOption) && !isString(durationOption)) {
        console.error(`MUI: Argument "duration" must be a number or a string but found ${durationOption}.`);
      }
      if (!isString(easingOption)) {
        console.error('MUI: Argument "easing" must be a string.');
      }
      if (!isNumber(delay) && !isString(delay)) {
        console.error('MUI: Argument "delay" must be a number or a string.');
      }
      if (Object.keys(other).length !== 0) {
        console.error(`MUI: Unrecognized argument(s) [${Object.keys(other).join(",")}].`);
      }
    }
    return (Array.isArray(props) ? props : [props]).map(animatedProp => `${animatedProp} ${typeof durationOption === "string" ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === "string" ? delay : formatMs(delay)}`).join(",");
  };
  return {
    getAutoHeightDuration,
    create,
    ...inputTransitions,
    easing: mergedEasing,
    duration: mergedDuration
  };
}

__astro_tag_component__(createTransitions, "@astrojs/solid-js");

const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700
};
const typographyDefaults = createTypographyOptions({
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  htmlFontSize: 16,
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  h6: {},
  subtitle1: {},
  subtitle2: {},
  body1: {},
  body2: {},
  button: {},
  caption: {},
  overline: {},
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700
});
function createTypographyOptions(options) {
  return options;
}
function round(value) {
  return Math.round(value * 1e5) / 1e5;
}
function makeVariant(base, fontWeight2, size, lineHeight, letterSpacing, casing) {
  return {
    fontFamily: base.fontFamily,
    fontWeight: fontWeight2,
    fontSize: base.pxToRem(size),
    lineHeight: `${lineHeight}`,
    letterSpacing: `${round(letterSpacing / size)}em`,
    ...(casing ? {
      textTransform: "uppercase"
    } : {})
  };
}
function createTypography(options = {}) {
  const base = {
    fontFamily: options.fontFamily ?? typographyDefaults.fontFamily,
    fontSize: options.fontSize ?? typographyDefaults.fontSize,
    htmlFontSize: options?.htmlFontSize ?? typographyDefaults.htmlFontSize,
    pxToRem: size => {
      const coef = base.fontSize / 14;
      return `${size / base.htmlFontSize * coef}rem`;
    }
  };
  return merge(base, {
    h1: makeVariant(base, fontWeight.light, 96, 1.167, -1.5),
    h2: makeVariant(base, fontWeight.light, 60, 1.2, -0.5),
    h3: makeVariant(base, fontWeight.regular, 48, 1.167, 0),
    h4: makeVariant(base, fontWeight.regular, 34, 1.235, 0.25),
    h5: makeVariant(base, fontWeight.regular, 24, 1.334, 0),
    h6: makeVariant(base, fontWeight.medium, 20, 1.6, 0.15),
    subtitle1: makeVariant(base, fontWeight.regular, 16, 1.75, 0.15),
    subtitle2: makeVariant(base, fontWeight.medium, 14, 1.57, 0.1),
    body1: makeVariant(base, fontWeight.regular, 16, 1.5, 0.15),
    body2: makeVariant(base, fontWeight.regular, 14, 1.43, 0.15),
    button: makeVariant(base, fontWeight.medium, 14, 1.75, 0.4, true),
    caption: makeVariant(base, fontWeight.regular, 12, 1.66, 0.4),
    overline: makeVariant(base, fontWeight.regular, 12, 2.66, 1, true)
  }, typographyDefaults, options);
}

__astro_tag_component__(createTypographyOptions, "@astrojs/solid-js");
__astro_tag_component__(makeVariant, "@astrojs/solid-js");
__astro_tag_component__(createTypography, "@astrojs/solid-js");

const zIndexDefaults = createZIndexOptions({
  mobileStepper: 1e3,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
});
function createZIndexOptions(data) {
  return data;
}
function createZIndex(data) {
  const result = {
    ...merge({}, zIndexDefaults, data)
  };
  return result;
}

__astro_tag_component__(createZIndexOptions, "@astrojs/solid-js");
__astro_tag_component__(createZIndex, "@astrojs/solid-js");

function createThemeOptions(options) {
  return options;
}
function createTheme(input = {}) {
  const theme = {
    direction: "ltr",
    ...input
  };
  function def(key, defaults) {
    const inputValue = input[key];
    Object.defineProperty(theme, key, {
      configurable: true,
      enumerable: true,
      ...(typeof inputValue === "function" ? {
        get: inputValue
      } : {
        value: defaults({
          [key]: inputValue
        })
      })
    });
  }
  def("breakpoints", input2 => createBreakpoints(input2.breakpoints));
  def("components", input2 => createComponents(input2.components));
  def("palette", input2 => createPalette(input2.palette));
  def("shape", input2 => createShape(input2.shape));
  def("spacing", input2 => createSpacing(input2.spacing));
  def("typography", input2 => createTypography(input2.typography));
  def("shadows", () => createShadows());
  def("transitions", () => createTransitions({}));
  def("zIndex", input2 => createZIndex(input2.zIndex));
  def("mixins", () => createMixins(theme.breakpoints));
  return theme;
}

__astro_tag_component__(createThemeOptions, "@astrojs/solid-js");
__astro_tag_component__(createTheme, "@astrojs/solid-js");
__astro_tag_component__(createTheme, "@astrojs/solid-js");

const getDefaultTheme = makeGetDefaultTheme(createTheme);

function useTheme(defaultTheme = getDefaultTheme) {
    return useTheme$2(defaultTheme, ThemeContext$1);
}

function ThemeProvider(props) {
  return createComponent$1(ThemeContext$1.Provider, {
    get value() {
      return props.theme;
    },
    get children() {
      return props.children;
    }
  });
}

__astro_tag_component__(ThemeProvider, "@astrojs/solid-js");

function defineComponent(cb) {
    return cb;
}

const Dynamic = defineComponent(function Dynamic2(props) {
  if (!props.component) throw new Error(`Component prop is empty`);
  return createComponent$1(Dynamic$1, props);
});

__astro_tag_component__(Dynamic, "@astrojs/solid-js");

function resolve(css, onProp, cssTarget = {}) {
    for (const name in css) {
        const value = css[name];
        if (isGlobalSelector(name)) {
            cssTarget[name] = resolve(value, onProp);
        }
        else if (isMediaQuery(name)) {
            cssTarget[name] = resolve(value, onProp);
        }
        else if (isKeyframes(name)) {
            cssTarget[name] = {};
            for (const v in value) {
                cssTarget[name][v] = resolve(value[v], onProp);
            }
        }
        else if (isSelector(name)) {
            cssTarget[name] = resolve(value, onProp);
        }
        else {
            const result = onProp(name, value);
            if (result) {
                Object.assign(cssTarget, result);
            }
            else {
                cssTarget[name] = value;
            }
        }
    }
    return cssTarget;
}

/**
 * @link https://github.com/emotion-js/emotion/blob/main/packages/unitless/src/index.js
 */
const unitLess = new Set([
    "animationIterationCount",
    "borderImageOutset",
    "borderImageSlice",
    "borderImageWidth",
    "boxFlex",
    "boxFlexGroup",
    "boxOrdinalGroup",
    "columnCount",
    "columns",
    "flex",
    "flexGrow",
    "flexPositive",
    "flexShrink",
    "flexNegative",
    "flexOrder",
    "gridRow",
    "gridRowEnd",
    "gridRowSpan",
    "gridRowStart",
    "gridColumn",
    "gridColumnEnd",
    "gridColumnSpan",
    "gridColumnStart",
    "msGridRow",
    "msGridRowSpan",
    "msGridColumn",
    "msGridColumnSpan",
    "fontWeight",
    "lineHeight",
    "opacity",
    "order",
    "orphans",
    "tabSize",
    "widows",
    "zIndex",
    "zoom",
    "WebkitLineClamp",
    "fillOpacity",
    "floodOpacity",
    "stopOpacity",
    "strokeDasharray",
    "strokeDashoffset",
    "strokeMiterlimit",
    "strokeOpacity",
    "strokeWidth",
]);
function resolveStyledPropsValue(name, value) {
    if (typeof value === "number") {
        return { [name]: unitLess.has(name) ? value.toString() : `${value}px` };
    }
}
function resolveStyledProps(v) {
    return resolve(v, resolveStyledPropsValue, { [resolvedPropKey]: true });
}

function getThemeValue(theme, key, value) {
    if (typeof value !== "string")
        return value;
    const names = value.split(".");
    let ref = theme[key];
    for (let i = 0; i < names.length; i++) {
        ref = ref?.[names[i]];
        if (!ref)
            break;
    }
    return ref ?? value;
}

function getPath(obj, path) {
    if (!path || typeof path !== "string") {
        return null;
    }
    return path
        .split(".")
        .reduce((acc, item) => (acc && acc[item] ? acc[item] : null), obj);
}
function createUnaryUnit(theme, themeKey, defaultValue, propName) {
    const themeSpacing = getPath(theme, themeKey) || defaultValue;
    if (typeof themeSpacing === "number") {
        return (abs) => {
            if (typeof abs === "string") {
                return abs;
            }
            if (process.env.NODE_ENV !== "production") {
                if (typeof abs !== "number") {
                    console.error(`MUI: Expected ${propName} argument to be a number or a string, got ${abs}.`);
                }
            }
            return themeSpacing * abs;
        };
    }
    if (Array.isArray(themeSpacing)) {
        return (abs) => {
            if (typeof abs === "string") {
                return abs;
            }
            if (process.env.NODE_ENV !== "production") {
                if (!Number.isInteger(abs)) {
                    console.error([
                        `MUI: The \`theme.${themeKey}\` array type cannot be combined with non integer values.` +
                            `You should either use an integer value that can be used as index, or define the \`theme.${themeKey}\` as a number.`,
                    ].join("\n"));
                }
                else if (abs > themeSpacing.length - 1) {
                    console.error([
                        `MUI: The value provided (${abs}) overflows.`,
                        `The supported values are: ${JSON.stringify(themeSpacing)}.`,
                        `${abs} > ${themeSpacing.length - 1}, you need to add the missing values.`,
                    ].join("\n"));
                }
            }
            return themeSpacing[abs];
        };
    }
    if (typeof themeSpacing === "function") {
        return themeSpacing;
    }
    if (process.env.NODE_ENV !== "production") {
        console.error([
            `MUI: The \`theme.${themeKey}\` value (${themeSpacing}) is invalid.`,
            "It should be a number, an array or a function.",
        ].join("\n"));
    }
    return () => undefined;
}

const dirMap = {
    x: ["Left", "Right"],
    y: ["Top", "Bottom"],
};
function asPx(value) {
    return typeof value === "number" ? `${value}px` : value;
}
function customProp(name, onValue) {
    return (value, theme) => onValue(name, value, theme);
}
function prop(name, onValue) {
    return onValue
        ? (value, theme) => ({
            [name]: onValue(name, value, theme),
        })
        : (value) => ({ [name]: value });
}
function pxProp(name) {
    return prop(name, (name, value) => asPx(value));
}
function mProp(name, suffix, onValue) {
    const names = suffix.map((v) => `${name}${v}`);
    return onValue
        ? (value, theme) => names.reduce((result, name) => {
            result[name] = onValue(name, value, theme);
            return result;
        }, {})
        : (value) => names.reduce((result, name) => {
            result[name] = value;
            return result;
        }, {});
}
function createSystemProps() {
    return {
        ...createSystemDisplayProps(),
        ...createSystemFlexboxProps(),
        ...createSystemGridProps(),
        ...createSystemPositionProps(),
        ...createSystemPaletteProps(),
        ...createSystemSizingProps(),
        ...createSystemBorderProps(),
        ...createSystemSpacingProps(),
        ...createSystemTypographyProps(),
    };
}
function createSystemDisplayProps() {
    return {
        displayPrint: customProp("displayPrint", (name, display) => ({
            "@media print": {
                display,
            },
        })),
        displayRaw: prop("display"),
        overflow: prop("overflow"),
        textOverflow: prop("textOverflow"),
        visibility: prop("visibility"),
        whiteSpace: prop("whiteSpace"),
    };
}
function createSystemFlexboxProps() {
    return {
        flexBasis: prop("flexBasis"),
        flexDirection: prop("flexDirection"),
        flexWrap: prop("flexWrap"),
        justifyContent: prop("justifyContent"),
        alignItems: prop("alignItems"),
        alignContent: prop("alignContent"),
        order: prop("order"),
        flex: prop("flex"),
        flexGrow: prop("flexGrow"),
        flexShrink: prop("flexShrink"),
        alignSelf: prop("alignSelf"),
        justifyItems: prop("justifyItems"),
        justifySelf: prop("justifySelf"),
    };
}
function createSystemGridProps() {
    const spacing = (name, value, theme) => createUnaryUnit(theme, "spacing", 8, name)(value);
    return {
        gap: prop("gap", spacing),
        columnGap: prop("columnGap", spacing),
        rowGap: prop("rowGap", spacing),
        gridColumn: prop("gridColumn"),
        gridRow: prop("gridRow"),
        gridAutoFlow: prop("gridAutoFlow"),
        gridAutoColumns: prop("gridAutoColumns"),
        gridAutoRows: prop("gridAutoRows"),
        gridTemplateColumns: prop("gridTemplateColumns"),
        gridTemplateRows: prop("gridTemplateRows"),
        gridTemplateAreas: prop("gridTemplateAreas"),
        gridArea: prop("gridArea"),
    };
}
function createSystemPositionProps() {
    return {
        position: prop("position"),
        zIndex: prop("zIndex", (name, value, theme) => theme.zIndex?.[name] ?? value),
        top: pxProp("top"),
        right: pxProp("right"),
        bottom: pxProp("bottom"),
        left: pxProp("left"),
    };
}
function createSystemPaletteProps() {
    const paletteValue = (name, value, theme) => getThemeValue(theme, "palette", value);
    return {
        color: prop("color", paletteValue),
        bgcolor: prop("backgroundColor", paletteValue),
        backgroundColor: prop("backgroundColor", paletteValue),
    };
}
function createSystemSizingProps() {
    const onValue = (name, value, theme) => {
        if (name === "maxWidth") {
            value = theme.breakpoints.values[name] ?? value;
        }
        if (typeof value === "number") {
            value = value > 0 && value <= 1 ? `${value * 100}%` : `${value}px`;
        }
        return value;
    };
    return {
        width: prop("width", onValue),
        maxWidth: prop("maxWidth", onValue),
        minWidth: prop("minWidth", onValue),
        height: prop("height", onValue),
        maxHeight: prop("maxHeight", onValue),
        minHeight: prop("minHeight", onValue),
        boxSizing: prop("boxSizing", onValue),
    };
}
function createSystemBorderProps() {
    const borderValue = (name, value) => typeof value === "number" ? `${value}px solid` : value;
    const paletteValue = (name, value, theme) => getThemeValue(theme, "palette", value);
    return {
        border: prop("border", borderValue),
        borderTop: prop("borderTop", borderValue),
        borderRight: prop("borderRight", borderValue),
        borderBottom: prop("borderBottom", borderValue),
        borderLeft: prop("borderLeft", borderValue),
        borderColor: prop("borderColor", paletteValue),
        borderTopColor: prop("borderTopColor", paletteValue),
        borderRightColor: prop("borderRightColor", paletteValue),
        borderBottomColor: prop("borderBottomColor", paletteValue),
        borderLeftColor: prop("borderLeftColor", paletteValue),
        borderRadius: prop("borderRadius", (name, value, theme) => typeof value === "number"
            ? `${theme.shape.borderRadius * value}px`
            : value),
    };
}
function createSystemTypographyProps() {
    const typographyValue = (name, value, theme) => getThemeValue(theme, "typography", value);
    return {
        typography: customProp("typography", (name, value, theme) => getThemeValue(theme, "typography", value)),
        fontFamily: prop("fontFamily", typographyValue),
        fontSize: prop("fontSize", (name, value, theme) => asPx(typographyValue(name, value, theme))),
        fontStyle: prop("fontStyle", typographyValue),
        fontWeight: prop("fontWeight", typographyValue),
        letterSpacing: pxProp("letterSpacing"),
        lineHeight: prop("lineHeight"),
        textAlign: prop("textAlign"),
        textTransform: prop("textTransform"),
    };
}
function createSystemSpacingProps() {
    const spacing = (name, value, theme) => theme.spacing(value);
    const m = "margin";
    const p = "padding";
    return {
        m: prop(m, spacing),
        mt: prop("marginTop", spacing),
        mr: prop("marginRight", spacing),
        mb: prop("marginBottom", spacing),
        ml: prop("marginLeft", spacing),
        mx: mProp(m, dirMap["x"], spacing),
        my: mProp(m, dirMap["y"], spacing),
        margin: prop(m, spacing),
        marginTop: prop("marginTop", spacing),
        marginRight: prop("marginRight", spacing),
        marginBottom: prop("marginBottom", spacing),
        marginLeft: prop("marginLeft", spacing),
        marginX: mProp(m, dirMap["x"], spacing),
        marginY: mProp(m, dirMap["y"], spacing),
        marginInline: mProp(m, ["Inline", "InlineStart"], spacing),
        marginInlineStart: prop("marginInlineStart", spacing),
        marginInlineEnd: prop("marginInlineEnd", spacing),
        marginBlock: mProp(m, ["BlockStart", "BlockEnd"], spacing),
        marginBlockStart: prop("marginBlockStart", spacing),
        marginBlockEnd: prop("marginBlockEnd", spacing),
        p: prop(p, spacing),
        pt: prop("paddingTop", spacing),
        pr: prop("paddingRight", spacing),
        pb: prop("paddingBottom", spacing),
        pl: prop("paddingLeft", spacing),
        px: mProp(p, dirMap["x"], spacing),
        py: mProp(p, dirMap["y"], spacing),
        padding: prop(p, spacing),
        paddingTop: prop("paddingTop", spacing),
        paddingRight: prop("paddingRight", spacing),
        paddingBottom: prop("paddingBottom", spacing),
        paddingLeft: prop("paddingLeft", spacing),
        paddingX: mProp(p, dirMap["x"], spacing),
        paddingY: mProp(p, dirMap["y"], spacing),
        paddingInline: mProp(p, ["Inline", "InlineStart"], spacing),
        paddingInlineStart: prop("paddingInlineStart", spacing),
        paddingInlineEnd: prop("paddingInlineEnd", spacing),
        paddingBlock: mProp(p, ["BlockStart", "BlockEnd"], spacing),
        paddingBlockStart: prop("paddingBlockStart", spacing),
        paddingBlockEnd: prop("paddingBlockEnd", spacing),
    };
}

const systemProps = createSystemProps();
const systemPropNames = Object.keys(systemProps);

function resolveSystemPropsValue(name, value, theme) {
    return systemProps[name](value, theme);
}
function reslveSxPropsValue(name, value, theme) {
    return name in systemProps
        ? resolveSystemPropsValue(name, value, theme)
        : resolveStyledPropsValue(name, value);
}
function resolveSxProps(v, theme) {
    return resolve(v, (name, value) => reslveSxPropsValue(name, value, theme), {
        [resolvedPropKey]: true,
    });
}

function extendSxProp(props) {
  const [systemProps, otherProps] = splitProps(props, systemPropNames);
  const sx = () => {
    const sx2 = props.sx;
    if (sx2) {
      if (Array.isArray(sx2)) {
        return [systemProps, ...sx2];
      } else {
        return mergeProps(systemProps, sx2);
      }
    } else {
      return systemProps;
    }
  };
  return mergeProps(otherProps, {
    get sx() {
      return sx();
    }
  });
}

__astro_tag_component__(extendSxProp, "@astrojs/solid-js");

const disableSystemPropsKey = "__disableSystemProps";
const boxSelfProps = ["sx", "theme", disableSystemPropsKey];
const Box$1 = defineComponent(function Box2(inProps) {
  const disableSystemProps = inProps[disableSystemPropsKey];
  if (!disableSystemProps) inProps = extendSxProp(inProps);
  const [props, otherProps] = splitProps(inProps, boxSelfProps);
  const useInTheme = () => inProps.theme || useTheme$2();
  const forwardSx = () => !!inProps.component && typeof inProps.component !== "string";
  const dynamicProps = mergeProps(otherProps, {
    get component() {
      return otherProps.component || "div";
    },
    get sx() {
      return forwardSx() ? inProps.sx : void 0;
    }
  });
  const style = createStyle(() => {
    const theme = useInTheme();
    const haveStyles = !disableSystemProps || !!props.sx;
    if (!haveStyles || forwardSx()) return [];
    return toArray(props.sx).map(object => object[resolvedPropKey] ? object : resolveSxProps(object, theme));
  });
  const className = () => {
    const className2 = otherProps.class;
    const styleValue = style();
    if (styleValue?.length) {
      return className2 ? `${className2} ${styleValue}` : styleValue;
    } else {
      return className2;
    }
  };
  return createComponent$1(Dynamic, mergeProps(dynamicProps, {
    get ["class"]() {
      return className();
    }
  }));
});

__astro_tag_component__(Box$1, "@astrojs/solid-js");

const skipProps = ["ownerState", "theme", "sx", "as"];
function resolveStyles(theme, className, styles, inProps) {
  return createMemo(() => styles.reduce((result, style) => {
    let styledProps;
    if (typeof style === "function") {
      styledProps = style({
        ownerState: inProps.ownerState,
        theme,
        sx: inProps.sx,
        as: inProps.as,
        props: inProps
      });
    } else if (style) {
      styledProps = style;
    }
    if (styledProps) result.push({
      ["name"]: className,
      ...resolveStyledProps(styledProps)
    });
    return result;
  }, []));
}
function createStyled(config) {
  return function styled(Component, options = {}) {
    let className;
    if (options.name) {
      const slot = options.slot || "Root";
      className = `${options.name}-${slot.slice(0, 1).toLowerCase() + slot.slice(1)}`;
    }
    return function (...styles) {
      return function (inProps) {
        const theme = config?.onUseTheme ? config.onUseTheme() : useTheme$2();
        const [, otherProps] = splitProps(inProps, options.skipProps ?? skipProps);
        const inStyles = resolveStyles(theme, className || "css", styles, inProps);
        const inSx = createMemo(() => !options.skipSx && inProps.sx ? Array.isArray(inProps.sx) ? inProps.sx : [inProps.sx] : []);
        const sx = () => [...inStyles(), ...inSx()];
        if (typeof Component === "string") {
          return createComponent$1(Box$1, mergeProps(otherProps, {
            get component() {
              return inProps.as || inProps.component || Component;
            },
            get sx() {
              return sx();
            },
            theme: theme,
            get ["class"]() {
              return clsx([inProps.class, className]);
            }
          }, {
            [disableSystemPropsKey]: true
          }));
        }
        return createComponent$1(Component, mergeProps(otherProps, {
          get component() {
            return inProps.as;
          },
          get sx() {
            return sx();
          },
          theme: theme,
          get ["class"]() {
            return clsx([inProps.class, className]);
          },
          get ownerState() {
            return inProps.ownerState;
          }
        }));
      };
    };
  };
}

__astro_tag_component__(createStyled, "@astrojs/solid-js");

const skipRootProps = [...skipProps, "classes"];
const _hoc_function$2 = createStyled({
  onUseTheme: () => useTheme()
});

__astro_tag_component__(_hoc_function$2, "@astrojs/solid-js");

// It should to be noted that this function isn't equivalent to `text-transform: capitalize`.
//
// A strict capitalization should uppercase the first letter of each word in the sentence.
// We only handle the first word.
function capitalize(string) {
    if (typeof string !== "string") {
        throw new Error("MUI: `capitalize(string)` expects a string argument.");
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function useControlled(props) {
    // isControlled is ignored in the hook dependency lists as it should never change.
    const isControlled = props.controlled() !== undefined;
    const [valueState, setValue] = createSignal(props.default());
    const value = createMemo(() => isControlled ? props.controlled() : valueState());
    if (process.env.NODE_ENV !== "production") {
        let first = true;
        createEffect(on(() => props.default(), () => {
            if (first) {
                first = false;
                return;
            }
            else if (!isControlled) {
                console.error([
                    `MUI: A component is changing the default ${props.state ?? "value"} state of an uncontrolled ${props.name} after being initialized. ` +
                        `To suppress this warning opt to use a controlled ${props.name}.`,
                ].join("\n"));
            }
        }));
    }
    const setValueIfUncontrolled = (newValue) => {
        if (!isControlled) {
            setValue(newValue);
        }
    };
    return [value, setValueIfUncontrolled];
}

const defaultGenerator = (componentName) => componentName;
const createClassNameGenerator = () => {
    let generate = defaultGenerator;
    return {
        configure(generator) {
            generate = generator;
        },
        generate(componentName) {
            return generate(componentName);
        },
        reset() {
            generate = defaultGenerator;
        },
    };
};
const ClassNameGenerator = createClassNameGenerator();
const globalStateClassesMapping = {
    active: "Mui-active",
    checked: "Mui-checked",
    completed: "Mui-completed",
    disabled: "Mui-disabled",
    error: "Mui-error",
    expanded: "Mui-expanded",
    focused: "Mui-focused",
    focusVisible: "Mui-focusVisible",
    required: "Mui-required",
    selected: "Mui-selected",
};
function generateUtilityClass(componentName, slot) {
    const globalStateClass = globalStateClassesMapping[slot];
    return (globalStateClass || `${ClassNameGenerator.generate(componentName)}-${slot}`);
}

function generateUtilityClasses(componentName, slots) {
    const result = {};
    slots.forEach((slot) => {
        result[slot] = generateUtilityClass(componentName, slot);
    });
    return result;
}

__astro_tag_component__(generateUtilityClasses, "@astrojs/solid-js");
__astro_tag_component__(generateUtilityClass, "@astrojs/solid-js");

function getInputBaseUtilityClass(slot) {
    return generateUtilityClass("MuiInputBase", slot);
}
const inputBaseClasses = generateUtilityClasses("MuiInputBase", [
    "root",
    "formControl",
    "focused",
    "disabled",
    "adornedStart",
    "adornedEnd",
    "error",
    "sizeSmall",
    "multiline",
    "colorSecondary",
    "fullWidth",
    "hiddenLabel",
    "input",
    "inputSizeSmall",
    "inputMultiline",
    "inputTypeSearch",
    "inputAdornedStart",
    "inputAdornedEnd",
    "inputHiddenLabel",
]);

// Supports determination of isControlled().
// Controlled input accepts its current value as a prop.
//
// @see https://facebook.github.io/react/docs/forms.html#controlled-components
// @param value
// @returns {boolean} true if string (including '') or number (including zero)
function hasValue(value) {
    return value != null && !(Array.isArray(value) && value.length === 0);
}
// Determine if field is empty or filled.
// Response determines if label is presented above field or as placeholder.
//
// @param obj
// @param SSR
// @returns {boolean} False when not present or empty string.
//                    True when any number or string with length.
function isFilled(obj, SSR = false) {
    return (obj &&
        ((hasValue(obj.value) && obj.value !== "") ||
            (SSR && hasValue(obj.defaultValue) && obj.defaultValue !== "")));
}

/**
 * Determines if a given element is a DOM element name (i.e. not a React component).
 */
function isHostComponent(element) {
    return typeof element === "string";
}

function createRef(input) {
    const cb = (e) => {
        cb.ref = cb.current = e;
        if (typeof input === "function") {
            const inputResult = input();
            if (typeof inputResult === "function") {
                inputResult(e);
            }
        }
        else if (typeof input?.ref === "function") {
            input.ref(e);
        }
    };
    return cb;
}

const $$a = createComponentFactory()({
  name: "MuiInputBase",
  propDefaults: ({
    set
  }) => set({
    components: {},
    componentsProps: {},
    fullWidth: false,
    inputComponent: "input",
    inputProps: {},
    multiline: false,
    type: "text",
    disableInjectingGlobalStyles: false
  }),
  selfPropNames: ["aria-describedby", "autoComplete", "autoFocus", "classes", "color", "components", "componentsProps", "defaultValue", "disableInjectingGlobalStyles", "disabled", "endAdornment", "error", "fullWidth", "id", "inputComponent", "inputProps", "inputProps", "inputRef", "margin", "maxRows", "minRows", "multiline", "name", "onBlur", "onChange", "onFocus", "onKeyDown", "onKeyUp", "placeholder", "readOnly", "renderSuffix", "required", "rows", "size", "startAdornment", "type", "value"],
  utilityClass: getInputBaseUtilityClass,
  autoCallUseClasses: false,
  slotClasses: ownerState => ({
    root: ["root", `color${capitalize(ownerState.color)}`, !!ownerState.disabled && "disabled", !!ownerState.error && "error", !!ownerState.fullWidth && "fullWidth", ownerState.focused && "focused", !!ownerState.formControl && "formControl", ownerState.size === "small" && "sizeSmall", ownerState.multiline && "multiline", !!ownerState.startAdornment && "adornedStart", !!ownerState.endAdornment && "adornedEnd", !!ownerState.hiddenLabel && "hiddenLabel"],
    input: ["input", !!ownerState.disabled && "disabled", ownerState.type === "search" && "inputTypeSearch", ownerState.multiline && "inputMultiline", ownerState.size === "small" && "inputSizeSmall", !!ownerState.hiddenLabel && "inputHiddenLabel", !!ownerState.startAdornment && "inputAdornedStart", !!ownerState.endAdornment && "inputAdornedEnd"]
  })
});
const rootOverridesResolver = (props, styles) => {
  const ownerState = props.ownerState;
  return [styles.root, !!ownerState.formControl && styles.formControl, !!ownerState.startAdornment && styles.adornedStart, !!ownerState.endAdornment && styles.adornedEnd, !!ownerState.error && styles.error, ownerState.size === "small" && styles.sizeSmall, ownerState.multiline && styles.multiline, ownerState.color && styles[`color${capitalize(ownerState.color)}`], !!ownerState.fullWidth && styles.fullWidth, !!ownerState.hiddenLabel && styles.hiddenLabel];
};
const inputOverridesResolver = (props, styles) => {
  const ownerState = props.ownerState;
  return [styles.input, ownerState.size === "small" && styles.inputSizeSmall, ownerState.multiline && styles.inputMultiline, ownerState.type === "search" && styles.inputTypeSearch, !!ownerState.startAdornment && styles.inputAdornedStart, !!ownerState.endAdornment && styles.inputAdornedEnd, !!ownerState.hiddenLabel && styles.inputHiddenLabel];
};
const InputBaseRoot = _hoc_function$2("div", {
  name: "MuiInputBase",
  slot: "Root",
  overridesResolver: rootOverridesResolver
})(({
  theme,
  ownerState
}) => ({
  ...theme.typography.body1,
  color: theme.palette.text.primary,
  lineHeight: "1.4375em",
  boxSizing: "border-box",
  position: "relative",
  cursor: "text",
  display: "inline-flex",
  alignItems: "center",
  [`&.${inputBaseClasses.disabled}`]: {
    color: theme.palette.text.disabled,
    cursor: "default"
  },
  ...(ownerState.multiline && {
    padding: "4px 0 5px",
    ...(ownerState.size === "small" && {
      paddingTop: 1
    })
  }),
  ...(ownerState.fullWidth && {
    width: "100%"
  })
}));
const InputBaseComponent = _hoc_function$2("input", {
  name: "MuiInputBase",
  slot: "Input",
  overridesResolver: inputOverridesResolver
})(({
  theme,
  ownerState
}) => {
  const light = theme.palette.mode === "light";
  const placeholder = {
    color: "currentColor",
    opacity: light ? 0.42 : 0.5,
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shorter
    })
  };
  const placeholderHidden = {
    opacity: "0 !important"
  };
  const placeholderVisible = {
    opacity: light ? 0.42 : 0.5
  };
  return {
    font: "inherit",
    letterSpacing: "inherit",
    color: "currentColor",
    padding: "4px 0 5px",
    border: 0,
    boxSizing: "content-box",
    background: "none",
    height: "1.4375em",
    margin: 0,
    WebkitTapHighlightColor: "transparent",
    display: "block",
    minWidth: 0,
    width: "100%",
    animationName: "mui-auto-fill-cancel",
    animationDuration: "10ms",
    "&::-webkit-input-placeholder": placeholder,
    "&::-moz-placeholder": placeholder,
    "&:-ms-input-placeholder": placeholder,
    "&::-ms-input-placeholder": placeholder,
    "&:focus": {
      outline: 0
    },
    "&:invalid": {
      boxShadow: "none"
    },
    "&::-webkit-search-decoration": {
      WebkitAppearance: "none"
    },
    [`label[data-shrink=false] + .${inputBaseClasses.formControl} &`]: {
      "&::-webkit-input-placeholder": placeholderHidden,
      "&::-moz-placeholder": placeholderHidden,
      "&:-ms-input-placeholder": placeholderHidden,
      "&::-ms-input-placeholder": placeholderHidden,
      "&:focus::-webkit-input-placeholder": placeholderVisible,
      "&:focus::-moz-placeholder": placeholderVisible,
      "&:focus:-ms-input-placeholder": placeholderVisible,
      "&:focus::-ms-input-placeholder": placeholderVisible
    },
    [`&.${inputBaseClasses.disabled}`]: {
      opacity: 1,
      WebkitTextFillColor: theme.palette.text.disabled
    },
    "&:-webkit-autofill": {
      animationDuration: "5000s",
      animationName: "mui-auto-fill"
    },
    ...(ownerState.size === "small" && {
      paddingTop: 1
    }),
    ...(ownerState.multiline && {
      height: "auto",
      resize: "none",
      padding: 0,
      paddingTop: 0
    }),
    ...(ownerState.type === "search" && {
      MozAppearance: "textfield"
    })
  };
});
const inputGlobalStyles = () => createComponent$1(GlobalStyles, {
  styles: {
    "@keyframes mui-auto-fill": {
      from: {
        display: "block"
      }
    },
    "@keyframes mui-auto-fill-cancel": {
      from: {
        display: "block"
      }
    }
  }
});
const InputBase = $$a.component(function InputBase2({
  allProps,
  otherProps,
  props
}) {
  const inputValue = () => props.inputProps.value != null ? props.inputProps.value : props.value;
  const isControlled = (inputValue() ?? null) !== null;
  const [value, setValue] = useControlled({
    controlled: () => inputValue(),
    default: () => props.defaultValue,
    name: "InputBase"
  });
  const inputRef = createRef({
    ref: instance => {
      if (process.env.NODE_ENV !== "production") {
        if (instance && instance.nodeName !== "INPUT" && !instance.focus) {
          console.error(["MUI: You have provided a `inputComponent` to the input component", "that does not correctly handle the `ref` prop.", "Make sure the `ref` prop is called with a HTMLInputElement."].join("\n"));
        }
      }
      if (typeof props.inputRef === "function") props.inputRef(instance);
    }
  });
  const [focused, setFocused] = createSignal(false);
  const muiFormControl = useFormControl();
  if (process.env.NODE_ENV !== "production") ;
  const partialFcs = formControlState({
    props: allProps,
    muiFormControl,
    states: ["color", "disabled", "error", "hiddenLabel", "size", "required", "filled"]
  });
  const fcs = mergeProps(partialFcs, {
    get focused() {
      return muiFormControl ? muiFormControl.focused : focused();
    }
  });
  const onFilled = () => muiFormControl && muiFormControl.onFilled;
  const onEmpty = () => muiFormControl && muiFormControl.onEmpty;
  const checkDirty = obj => {
    if (isFilled(obj)) {
      onFilled()?.();
    } else {
      onEmpty()?.();
    }
  };
  createRenderEffect(() => {
    if (isControlled) {
      checkDirty({
        value: value()
      });
    }
  });
  const isMultilineInput = () => props.multiline && props.inputComponent === "input";
  const InputComponent = () => {
    const InputComponent2 = props.inputComponent;
    if (isMultilineInput()) ;
    return InputComponent2;
  };
  const inputProps = createMemo(() => {
    let inputProps2 = props.inputProps;
    if (isMultilineInput()) {
      if (props.rows) {
        if (process.env.NODE_ENV !== "production") {
          if (props.minRows || props.maxRows) {
            console.warn("MUI: You can not use the `minRows` or `maxRows` props when the input `rows` prop is set.");
          }
        }
        inputProps2 = {
          type: void 0,
          ["minRows"]: props.rows,
          ["maxRows"]: props.rows,
          ...inputProps2
        };
      } else {
        inputProps2 = {
          type: void 0,
          ["maxRows"]: props.maxRows,
          ["minRows"]: props.minRows,
          ...inputProps2
        };
      }
    }
    return mergeProps(inputProps2, () => props.componentsProps.input || {});
  });
  const ownerState = mergeProps(allProps, {
    get color() {
      return fcs.color || "primary";
    },
    get disabled() {
      return fcs.disabled;
    },
    get error() {
      return fcs.error;
    },
    get focused() {
      return fcs.focused;
    },
    get formControl() {
      return muiFormControl;
    },
    get hiddenLabel() {
      return fcs.hiddenLabel;
    },
    get size() {
      return fcs.size;
    }
  });
  const classes = $$a.useClasses(ownerState);
  const Root = () => props.components.Root || InputBaseRoot;
  const rootProps = () => props.componentsProps.root || {};
  const Input = () => props.components.Input || InputBaseComponent;
  const rootOwnerState = mergeProps(ownerState, () => rootProps()["ownerState"] || {});
  const inputOwnerState = mergeProps(ownerState, () => inputProps()["ownerState"] || {});
  const renderSuffixProps = mergeProps(fcs, {
    get startAdornment() {
      return props.startAdornment;
    }
  });
  const suffix = createMemo(() => props.renderSuffix?.(renderSuffixProps));
  return [!props.disableInjectingGlobalStyles && inputGlobalStyles(), createComponent$1(Dynamic, mergeProps(rootProps, otherProps, {
    get component() {
      return Root();
    }
  }, () => !isHostComponent(Root()) && {
    ownerState: rootOwnerState
  }, {
    onClick: event => {
      if (inputRef.ref && event.currentTarget === event.target) {
        inputRef.ref.focus();
      }
      if (typeof otherProps.onClick === "function") {
        otherProps.onClick(event);
      }
    },
    get ["class"]() {
      return clsx(classes.root, rootProps().class, otherProps.class);
    },
    get children() {
      return [props.startAdornment, createComponent$1(FormControlContext.Provider, {
        value: void 0,
        get children() {
          return createComponent$1(Dynamic, mergeProps({
            get component() {
              return Input();
            },
            ownerState: ownerState,
            get ["aria-invalid"]() {
              return fcs.error;
            },
            get ["aria-describedby"]() {
              return props["aria-describedby"];
            },
            get autocomplete() {
              return props.autoComplete;
            },
            get autofocus() {
              return props.autoFocus;
            },
            get disabled() {
              return fcs.disabled;
            },
            get id() {
              return props.id;
            },
            onAnimationStart: event => {
              checkDirty(event.animationName === "mui-auto-fill-cancel" ? inputRef.ref : {
                value: "x"
              });
            },
            get name() {
              return props.name;
            },
            get placeholder() {
              return props.placeholder;
            },
            get readOnly() {
              return props.readOnly;
            },
            get required() {
              return fcs.required;
            }
          }, () => ({
            rows: props.rows
          }), {
            get onKeyDown() {
              return props.onKeyDown;
            },
            get onKeyUp() {
              return props.onKeyUp;
            },
            get type() {
              return props.type;
            }
          }, inputProps, () => !isHostComponent(Input()) && {
            as: InputComponent(),
            ownerState: inputOwnerState
          }, {
            get ["class"]() {
              return clsx(classes.input, inputProps().class);
            },
            onBlur: event => {
              props.onBlur?.(event);
              if (typeof props.inputProps.onBlur === "function") {
                props.inputProps.onBlur(event);
              }
              if (muiFormControl && muiFormControl.onBlur) {
                muiFormControl.onBlur();
              } else {
                setFocused(false);
              }
            },
            onInput: event => {
              if (!isControlled) {
                const element = event.target || inputRef.ref;
                if (element == null) {
                  throw new Error("MUI: Expected valid input target. Did you use a custom `inputComponent` and forget to forward refs? See https://mui.com/r/input-component-ref-interface for more info.");
                }
                checkDirty({
                  value: element.value
                });
              }
            },
            onFocus: event => {
              if (fcs.disabled) {
                event.stopPropagation();
                return;
              }
              if (typeof props.onFocus === "function") {
                props.onFocus(event);
              }
              if (typeof props.inputProps.onFocus === "function") {
                props.inputProps.onFocus(event);
              }
              if (muiFormControl && muiFormControl.onFocus) {
                muiFormControl.onFocus();
              } else {
                setFocused(true);
              }
            }
          }));
        }
      }), props.endAdornment, suffix()];
    }
  }))];
});

__astro_tag_component__(rootOverridesResolver, "@astrojs/solid-js");
__astro_tag_component__(inputOverridesResolver, "@astrojs/solid-js");
__astro_tag_component__(InputBase, "@astrojs/solid-js");

function getInputUtilityClass(slot) {
    return generateUtilityClass("MuiInput", slot);
}
const inputClasses = {
    ...inputBaseClasses,
    ...generateUtilityClasses("MuiInput", ["root", "underline", "input"]),
};

const $$9 = createComponentFactory()({
  name: "MuiInput",
  propDefaults: ({
    set
  }) => set({
    components: {},
    fullWidth: false,
    inputComponent: "input",
    multiline: false,
    type: "text"
  }),
  selfPropNames: ["classes", "disableUnderline"],
  utilityClass: getInputUtilityClass,
  slotClasses: ownerState => ({
    root: ["root", !ownerState.disableUnderline && "underline"],
    input: ["input"]
  })
});
const InputRoot = _hoc_function$2(InputBaseRoot, {
  skipProps: skipRootProps.filter(v => v !== "classes"),
  name: "MuiInput",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [...rootOverridesResolver(props, styles), !ownerState.disableUnderline && styles.underline];
  }
})(({
  theme,
  ownerState
}) => {
  const light = theme.palette.mode === "light";
  const bottomLineColor = light ? "rgba(0, 0, 0, 0.42)" : "rgba(255, 255, 255, 0.7)";
  return {
    position: "relative",
    ...(ownerState.formControl && {
      "label + &": {
        marginTop: 16
      }
    }),
    ...(!ownerState.disableUnderline && {
      "&:after": {
        borderBottom: `2px solid ${theme.palette[ownerState.color].main}`,
        left: 0,
        bottom: 0,
        content: '""',
        position: "absolute",
        right: 0,
        transform: "scaleX(0)",
        transition: theme.transitions.create("transform", {
          duration: theme.transitions.duration.shorter,
          easing: theme.transitions.easing.easeOut
        }),
        pointerEvents: "none"
      },
      [`&.${inputClasses.focused}:after`]: {
        transform: "scaleX(1)"
      },
      [`&.${inputClasses.error}:after`]: {
        borderBottomColor: theme.palette.error.main,
        transform: "scaleX(1)"
      },
      "&:before": {
        borderBottom: `1px solid ${bottomLineColor}`,
        left: 0,
        bottom: 0,
        content: '"\\00a0"',
        position: "absolute",
        right: 0,
        transition: theme.transitions.create("border-bottom-color", {
          duration: theme.transitions.duration.shorter
        }),
        pointerEvents: "none"
      },
      [`&:hover:not(.${inputClasses.disabled}):before`]: {
        borderBottom: `2px solid ${theme.palette.text.primary}`,
        "@media (hover: none)": {
          borderBottom: `1px solid ${bottomLineColor}`
        }
      },
      [`&.${inputClasses.disabled}:before`]: {
        borderBottomStyle: "dotted"
      }
    })
  };
});
const InputInput = _hoc_function$2(InputBaseComponent, {
  name: "MuiInput",
  slot: "Input",
  overridesResolver: inputOverridesResolver
})({});
const Input = $$9.component(function Input2({
  classes,
  otherProps,
  props
}) {
  const componentsProps = createMemo(() => {
    const ownerState = {
      disableUnderline: props.disableUnderline
    };
    const inputComponentsProps = {
      root: {
        ownerState
      }
    };
    return otherProps.componentsProps ? deepmerge(otherProps.componentsProps, inputComponentsProps) : inputComponentsProps;
  });
  const allClasses = mergeProps(classes, () => props.classes || {});
  return createComponent$1(InputBase, mergeProps(otherProps, {
    get components() {
      return {
        Root: InputRoot,
        Input: InputInput,
        ...(otherProps.components || {})
      };
    },
    get componentsProps() {
      return componentsProps();
    },
    classes: allClasses
  }));
});

__astro_tag_component__(Input, "@astrojs/solid-js");

function getFormLabelUtilityClasses(slot) {
    return generateUtilityClass("MuiFormLabel", slot);
}
const formLabelClasses = generateUtilityClasses("MuiFormLabel", [
    "root",
    "colorSecondary",
    "focused",
    "disabled",
    "error",
    "filled",
    "required",
    "asterisk",
]);

const $$8 = createComponentFactory()({
  name: "MuiFormLabel",
  propDefaults: ({
    set
  }) => set({
    component: "label"
  }),
  selfPropNames: ["children", "classes", "color", "disabled", "error", "filled", "focused", "required"],
  autoCallUseClasses: false,
  utilityClass: getFormLabelUtilityClasses,
  slotClasses: ownerState => ({
    root: ["root", `color${capitalize(ownerState.color)}`, !!ownerState.disabled && "disabled", !!ownerState.error && "error", !!ownerState.filled && "filled", !!ownerState.focused && "focused", !!ownerState.required && "required"],
    asterisk: ["asterisk", !!ownerState.error && "error"]
  })
});
const FormLabelRoot = _hoc_function$2("label", {
  name: "MuiFormLabel",
  slot: "Root",
  overridesResolver: ({
    ownerState
  }, styles) => {
    return {
      ...styles.root,
      ...(ownerState.color === "secondary" && styles.colorSecondary),
      ...(ownerState.filled && styles.filled)
    };
  }
})(({
  theme,
  ownerState
}) => ({
  color: theme.palette.text.secondary,
  ...theme.typography.body1,
  lineHeight: "1.4375em",
  padding: 0,
  position: "relative",
  [`&.${formLabelClasses.focused}`]: {
    color: theme.palette[ownerState.color].main
  },
  [`&.${formLabelClasses.disabled}`]: {
    color: theme.palette.text.disabled
  },
  [`&.${formLabelClasses.error}`]: {
    color: theme.palette.error.main
  }
}));
const AsteriskComponent = _hoc_function$2("span", {
  name: "MuiFormLabel",
  slot: "Asterisk",
  overridesResolver: (props, styles) => styles.asterisk
})(({
  theme
}) => ({
  [`&.${formLabelClasses.error}`]: {
    color: theme.palette.error.main
  }
}));
const FormLabel = $$8.component(function FormLabel2({
  allProps,
  otherProps,
  props
}) {
  const muiFormControl = useFormControl();
  const fcs = formControlState({
    props: allProps,
    muiFormControl,
    states: ["color", "required", "focused", "disabled", "error", "filled"]
  });
  const ownerState = mergeProps(allProps, {
    get color() {
      return fcs.color || "primary";
    },
    get disabled() {
      return fcs.disabled;
    },
    get error() {
      return fcs.error;
    },
    get filled() {
      return fcs.filled;
    },
    get focused() {
      return fcs.focused;
    },
    get required() {
      return fcs.required;
    }
  });
  const classes = $$8.useClasses(ownerState);
  return createComponent$1(FormLabelRoot, mergeProps(otherProps, {
    get as() {
      return otherProps.component;
    },
    ownerState: ownerState,
    get ["class"]() {
      return clsx(classes.root, otherProps.class);
    },
    get children() {
      return [props.children, createComponent$1(Show, {
        get when() {
          return fcs.required;
        },
        get children() {
          return createComponent$1(AsteriskComponent, {
            ownerState: ownerState,
            "aria-hidden": true,
            get ["class"]() {
              return classes.asterisk;
            },
            get children() {
              return ["\u2009", "*"];
            }
          });
        }
      })];
    }
  }));
});

__astro_tag_component__(FormLabel, "@astrojs/solid-js");

function getInputLabelUtilityClasses(slot) {
    return generateUtilityClass("MuiInputLabel", slot);
}
generateUtilityClasses("MuiInputLabel", [
    "root",
    "focused",
    "disabled",
    "error",
    "required",
    "asterisk",
    "formControl",
    "sizeSmall",
    "shrink",
    "animated",
    "standard",
    "filled",
    "outlined",
]);

const $$7 = createComponentFactory()({
  name: "MuiInputLabel",
  propDefaults: ({
    set
  }) => set({
    disableAnimation: false
  }),
  selfPropNames: ["children", "classes", "color", "disableAnimation", "disabled", "error", "focused", "margin", "required", "shrink", "variant"],
  autoCallUseClasses: false,
  utilityClass: getInputLabelUtilityClasses,
  slotClasses: ownerState => ({
    root: ["root", !!ownerState.formControl && "formControl", !ownerState.disableAnimation && "animated", !!ownerState.shrink && "shrink", ownerState.size === "small" && "sizeSmall", !!ownerState.variant && ownerState.variant],
    asterisk: [!!ownerState.required && "asterisk"]
  })
});
const InputLabelRoot = _hoc_function$2(FormLabel, {
  skipProps: skipRootProps.filter(v => v !== "classes"),
  name: "MuiInputLabel",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [{
      [`& .${formLabelClasses.asterisk}`]: styles.asterisk
    }, styles.root, ownerState.formControl && styles.formControl, ownerState.size === "small" && styles.sizeSmall, ownerState.shrink && styles.shrink, !ownerState.disableAnimation && styles.animated, styles[ownerState.variant]];
  }
})(({
  theme,
  ownerState
}) => ({
  display: "block",
  transformOrigin: "top left",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100%",
  ...(ownerState.formControl && {
    position: "absolute",
    left: 0,
    top: 0,
    transform: "translate(0, 20px) scale(1)"
  }),
  ...(ownerState.size === "small" && {
    transform: "translate(0, 17px) scale(1)"
  }),
  ...(ownerState.shrink && {
    transform: "translate(0, -1.5px) scale(0.75)",
    transformOrigin: "top left",
    maxWidth: "133%"
  }),
  ...(!ownerState.disableAnimation && {
    transition: theme.transitions.create(["color", "transform", "max-width"], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut
    })
  }),
  ...(ownerState.variant === "filled" && {
    zIndex: 1,
    pointerEvents: "none",
    transform: "translate(12px, 16px) scale(1)",
    maxWidth: "calc(100% - 24px)",
    ...(ownerState.size === "small" && {
      transform: "translate(12px, 13px) scale(1)"
    }),
    ...(ownerState.shrink && {
      userSelect: "none",
      pointerEvents: "auto",
      transform: "translate(12px, 7px) scale(0.75)",
      maxWidth: "calc(133% - 24px)",
      ...(ownerState.size === "small" && {
        transform: "translate(12px, 4px) scale(0.75)"
      })
    })
  }),
  ...(ownerState.variant === "outlined" && {
    zIndex: 1,
    pointerEvents: "none",
    transform: "translate(14px, 16px) scale(1)",
    maxWidth: "calc(100% - 24px)",
    ...(ownerState.size === "small" && {
      transform: "translate(14px, 9px) scale(1)"
    }),
    ...(ownerState.shrink && {
      userSelect: "none",
      pointerEvents: "auto",
      maxWidth: "calc(133% - 24px)",
      transform: "translate(14px, -9px) scale(0.75)"
    })
  })
}));
const InputLabel = $$7.component(function InputLabel2({
  allProps,
  props
}) {
  const muiFormControl = useFormControl();
  const [, baseProps] = splitProps(allProps, ["disableAnimation", "margin", "shrink", "variant"]);
  const shrink = () => {
    let shrink2 = props.shrink;
    if (typeof shrink2 === "undefined" && muiFormControl) {
      shrink2 = muiFormControl.filled || muiFormControl.focused || muiFormControl.adornedStart;
    }
    return shrink2;
  };
  const fcs = formControlState({
    props: allProps,
    muiFormControl,
    states: ["size", "variant", "required"]
  });
  const ownerState = mergeProps(allProps, {
    get formControl() {
      return muiFormControl;
    },
    get shrink() {
      return shrink();
    },
    get size() {
      return fcs.size;
    },
    get variant() {
      return fcs.variant;
    },
    get required() {
      return fcs.required;
    }
  });
  const classes = $$7.useClasses(ownerState);
  const allClasses = mergeProps(classes, () => props.classes || {});
  return createComponent$1(InputLabelRoot, mergeProps(baseProps, {
    get ["data-shrink"]() {
      return shrink();
    },
    ownerState: ownerState,
    classes: allClasses
  }));
});

__astro_tag_component__(InputLabel, "@astrojs/solid-js");

const _tmpl$$6 = ["<p", "><!--#-->", "<!--/--><!--#-->", "<!--/--></p>"];
const StringInput = ({
  disabled,
  label,
  value,
  onChange,
  inputProps = {},
  customStyle = {}
}) => {
  return ssr(_tmpl$$6, ssrHydrationKey(), label && escape(createComponent$1(InputLabel, {
    get sx() {
      return style("text");
    },
    children: label
  })), escape(createComponent$1(Input, mergeProps(inputProps, {
    get value() {
      return value();
    },
    onChange: (_e, value2) => {
      onChange(value2);
    },
    required: true,
    disabled: disabled,
    get sx() {
      return style("input", customStyle);
    }
  }))));
};

__astro_tag_component__(StringInput, "@astrojs/solid-js");

const readyAtom = computed([businessReady.atom, Theme$1.atom], (ready, theme) => ready && theme);

const NameInput = () => {
  const properties = useStore(propertiesMap);
  const state = useStore(stateAtom);
  const ready = useStore(readyAtom);
  return createComponent$1(Show, {
    get when() {
      return ready();
    },
    get children() {
      return createComponent$1(StringInput, {
        label: "Jm\xE9no",
        value: () => {
          console.log("properties().name", properties().name);
          return properties().name;
        },
        get disabled() {
          return state() === "saving";
        },
        onChange: name => propertiesMap.setKey("name", name),
        inputProps: {
          placeholder: "Zadejte n\xE1zev postavy"
        },
        customStyle: {
          width: "100%"
        }
      });
    }
  });
};

__astro_tag_component__(NameInput, "@astrojs/solid-js");

const $$6 = createComponentFactory()({
  name: "MuiBox",
  selfPropNames: [],
  utilityClass: slot => `MuiBox-${slot}`,
  slotClasses: () => ({
    root: ["root"]
  })
});
const Box = $$6.component(function Box2({
  otherProps,
  classes
}) {
  const theme = useTheme();
  return createComponent$1(Box$1, mergeProps({
    theme: theme
  }, otherProps, {
    get ["class"]() {
      return clsx(classes.root, otherProps.class);
    }
  }));
});

__astro_tag_component__(Box, "@astrojs/solid-js");

const _tmpl$$5 = ["<span", "></span>"];
const $$5 = createComponentFactory()({
  name: "MuiRipple",
  selfPropNames: ["class", "classes", "pulsate", "rippleX", "rippleY", "rippleSize", "in", "onExited", "timeout"],
  propDefaults: ({
    set
  }) => set({
    pulsate: false,
    classes: {}
  })
});
const Ripple = $$5.component(function Ripple2({
  props,
  otherProps
}) {
  const [leaving, setLeaving] = createSignal(false);
  const rippleClassName = createMemo(() => clsx(props.class, props.classes.ripple, props.classes.rippleVisible, props.classes.ripplePulsate && {
    [props.classes.ripplePulsate]: props.pulsate
  }));
  const rippleStyles = createMemo(() => ({
    width: `${props.rippleSize}px`,
    height: `${props.rippleSize}px`,
    top: `${-(props.rippleSize / 2) + props.rippleY}px`,
    left: `${-(props.rippleSize / 2) + props.rippleX}px`
  }));
  const childClassName = createMemo(() => clsx(props.classes.child, props.classes.childLeaving && {
    [props.classes.childLeaving]: leaving()
  }, props.classes.childPulsate && {
    [props.classes.childPulsate]: props.pulsate
  }));
  let timeoutId;
  onCleanup(() => clearTimeout(timeoutId));
  return createComponent$1(Box, {
    component: "span",
    get ["class"]() {
      return rippleClassName();
    },
    get style() {
      return rippleStyles();
    },
    get sx() {
      return otherProps.sx;
    },
    get children() {
      return ssr(_tmpl$$5, ssrHydrationKey() + ssrAttribute("class", escape(childClassName(), true), false));
    }
  });
});

__astro_tag_component__(Ripple, "@astrojs/solid-js");

const touchRippleClasses = generateUtilityClasses("MuiTouchRipple", [
    "root",
    "ripple",
    "rippleVisible",
    "ripplePulsate",
    "child",
    "childLeaving",
    "childPulsate",
]);

function createElementRef(props) {
    return createRef(props);
}

const $$4 = createComponentFactory()({
  name: "MuiTouchRipple",
  selfPropNames: ["center", "classes", "ref"],
  propDefaults: ({
    set
  }) => set({
    center: false,
    classes: {}
  })
});
const DURATION = 550;
const DELAY_RIPPLE = 80;
const TouchRippleRoot = _hoc_function$2("span", {
  name: "MuiTouchRipple",
  slot: "Root"
})({
  overflow: "hidden",
  pointerEvents: "none",
  position: "absolute",
  zIndex: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  borderRadius: "inherit"
});
const TouchRippleRipple = _hoc_function$2(Ripple, {
  name: "MuiTouchRipple",
  slot: "Ripple"
})(({
  theme
}) => ({
  position: "absolute",
  "@keyframes animation-enter-$id": {
    0: {
      transform: "scale(0)",
      opacity: 0.1
    },
    100: {
      transform: "scale(1)",
      opacity: 0.3
    }
  },
  "@keyframes animation-exit-$id": {
    0: {
      opacity: 1
    },
    100: {
      opacity: 0
    }
  },
  "@keyframes animation-pulsate-$id": {
    0: {
      transform: "scale(1)"
    },
    50: {
      transform: "scale(0.92)"
    },
    100: {
      transform: "scale(1)"
    }
  },
  [`&.${touchRippleClasses.rippleVisible}`]: {
    opacity: "0.3",
    transform: "scale(1)",
    animationName: `animation-enter-$id`,
    animationDuration: `${DURATION}ms`,
    animationTimingFunction: theme.transitions.easing.easeInOut
  },
  [`&.${touchRippleClasses.ripplePulsate}`]: {
    animationDuration: `${theme.transitions.duration.shorter}ms`
  },
  [`& .${touchRippleClasses.child}`]: {
    opacity: 1,
    display: "block",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "currentColor"
  },
  [`& .${touchRippleClasses.childLeaving}`]: {
    opacity: 0,
    animationName: `animation-exit-$id`,
    animationDuration: `${DURATION}ms`,
    animationTimingFunction: `${theme.transitions.easing.easeInOut}`
  },
  [`& .${touchRippleClasses.childPulsate}`]: {
    position: "absolute",
    left: "0px",
    top: 0,
    animationName: `animation-pulsate-$id`,
    animationDuration: "2500ms",
    animationTimingFunction: `${theme.transitions.easing.easeInOut}`,
    animationIterationCount: "infinite",
    animationDelay: "200ms"
  }
}));
const TouchRipple = $$4.component(function TouchRipple2({
  props,
  otherProps
}) {
  let counter = 0;
  const [ripples, setRipples] = createSignal([]);
  const inProps = createMutable({});
  let ignoringMouseDown = false;
  let startTimer;
  let startTimerCommit;
  const container = createElementRef(otherProps);
  onCleanup(() => {
    if (startTimer) clearTimeout(startTimer);
  });
  const startCommit = params => {
    const id = counter++;
    inProps[id] = true;
    setRipples(oldRipples => [...oldRipples, {
      id,
      params
    }]);
    params.cb;
  };
  const start = (event, options = {
    pulsate: false,
    center: props.center
  }, cb) => {
    options = mergeProps(options, {
      center: options.center || options.pulsate
    });
    if (event.type === "mousedown" && ignoringMouseDown) {
      ignoringMouseDown = false;
      return;
    }
    if (event.type === "touchstart") {
      ignoringMouseDown = true;
    }
    const rect = container.ref ? container.ref.getBoundingClientRect() : {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    };
    let rippleX;
    let rippleY;
    let rippleSize;
    if (options.center || event.clientX === 0 && event.clientY === 0 || !event.clientX && !event.touches) {
      rippleX = Math.round(rect.width / 2);
      rippleY = Math.round(rect.height / 2);
    } else {
      const {
        clientX,
        clientY
      } = event.touches ? event.touches[0] : event;
      rippleX = Math.round(clientX - rect.left);
      rippleY = Math.round(clientY - rect.top);
    }
    if (options.center) {
      rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);
      if (rippleSize % 2 === 0) {
        rippleSize += 1;
      }
    } else {
      const sizeX = Math.max(Math.abs((container.ref ? container.ref.clientWidth : 0) - rippleX), rippleX) * 2 + 2;
      const sizeY = Math.max(Math.abs((container.ref ? container.ref.clientHeight : 0) - rippleY), rippleY) * 2 + 2;
      rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
    }
    if (event.touches) {
      if (!startTimerCommit) {
        startTimerCommit = () => {
          startCommit({
            pulsate: options.pulsate,
            rippleX,
            rippleY,
            rippleSize,
            cb
          });
        };
        startTimer = setTimeout(() => {
          if (startTimerCommit) {
            startTimerCommit();
            startTimerCommit = void 0;
          }
        }, DELAY_RIPPLE);
      }
    } else {
      startCommit({
        pulsate: options.pulsate,
        rippleX,
        rippleY,
        rippleSize,
        cb
      });
    }
  };
  const pulsate = () => start({}, {
    pulsate: true
  });
  const stop = (event, cb) => {
    clearTimeout(startTimer);
    if (event.type === "touchend" && startTimerCommit) {
      startTimerCommit();
      startTimerCommit = void 0;
      startTimer = setTimeout(() => {
        stop(event);
      });
      return;
    }
    for (const id in inProps) inProps[id] = false;
    startTimerCommit = void 0;
  };
  const actions = {
    pulsate,
    start,
    stop
  };
  if (typeof props.ref === "function") {
    props.ref(actions);
  }
  return createComponent$1(TouchRippleRoot, mergeProps({
    get ["class"]() {
      return clsx(props.classes.root, touchRippleClasses.root, otherProps.class);
    }
  }, otherProps, {
    get children() {
      return mapArray(ripples, data => createComponent$1(TouchRippleRipple, {
        get ["in"]() {
          return inProps[data.id];
        },
        onExited: () => {
          setRipples(oldRipples => oldRipples.filter(v => v.id !== data.id));
          delete inProps[data.id];
        },
        get classes() {
          return {
            ripple: clsx(props.classes.ripple, touchRippleClasses.ripple),
            rippleVisible: clsx(props.classes.rippleVisible, touchRippleClasses.rippleVisible),
            ripplePulsate: clsx(props.classes.ripplePulsate, touchRippleClasses.ripplePulsate),
            child: clsx(props.classes.child, touchRippleClasses.child),
            childLeaving: clsx(props.classes.childLeaving, touchRippleClasses.childLeaving),
            childPulsate: clsx(props.classes.childPulsate, touchRippleClasses.childPulsate)
          };
        },
        timeout: DURATION,
        get pulsate() {
          return data.params.pulsate;
        },
        get rippleX() {
          return data.params.rippleX;
        },
        get rippleY() {
          return data.params.rippleY;
        },
        get rippleSize() {
          return data.params.rippleSize;
        }
      }));
    }
  }));
});

__astro_tag_component__(TouchRipple, "@astrojs/solid-js");

function getButtonBaseUtilityClass(slot) {
    return generateUtilityClass("MuiButtonBase", slot);
}
const buttonBaseClasses = generateUtilityClasses("MuiButtonBase", ["root", "disabled", "focusVisible"]);

let hadKeyboardEvent = true;
let hadFocusVisibleRecently = false;
let hadFocusVisibleRecentlyTimeout;
const inputTypesWhitelist = {
    text: true,
    search: true,
    url: true,
    tel: true,
    email: true,
    password: true,
    number: true,
    date: true,
    month: true,
    week: true,
    time: true,
    datetime: true,
    "datetime-local": true,
};
/**
 * Computes whether the given element should automatically trigger the
 * `focus-visible` class being added, i.e. whether it should always match
 * `:focus-visible` when focused.
 * @param {Element} node
 * @returns {boolean}
 */
function focusTriggersKeyboardModality(node) {
    const { type, tagName } = node;
    if (tagName === "INPUT" &&
        inputTypesWhitelist[type] &&
        !node.readOnly) {
        return true;
    }
    if (tagName === "TEXTAREA" && !node.readOnly) {
        return true;
    }
    if (node.isContentEditable) {
        return true;
    }
    return false;
}
/**
 * Keep track of our keyboard modality state with `hadKeyboardEvent`.
 * If the most recent user interaction was via the keyboard;
 * and the key press did not include a meta, alt/option, or control key;
 * then the modality is keyboard. Otherwise, the modality is not keyboard.
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
    if (event.metaKey || event.altKey || event.ctrlKey) {
        return;
    }
    hadKeyboardEvent = true;
}
/**
 * If at any point a user clicks with a pointing device, ensure that we change
 * the modality away from keyboard.
 * This avoids the situation where a user presses a key on an already focused
 * element, and then clicks on a different element, focusing it with a
 * pointing device, while we still think we're in keyboard modality.
 */
function handlePointerDown() {
    hadKeyboardEvent = false;
}
function handleVisibilityChange() {
    if (this.visibilityState === "hidden") {
        // If the tab becomes active again, the browser will handle calling focus
        // on the element (Safari actually calls it twice).
        // If this tab change caused a blur on an element with focus-visible,
        // re-apply the class when the user switches back to the tab.
        if (hadFocusVisibleRecently) {
            hadKeyboardEvent = true;
        }
    }
}
function prepare(doc) {
    doc.addEventListener("keydown", handleKeyDown, true);
    doc.addEventListener("mousedown", handlePointerDown, true);
    doc.addEventListener("pointerdown", handlePointerDown, true);
    doc.addEventListener("touchstart", handlePointerDown, true);
    doc.addEventListener("visibilitychange", handleVisibilityChange, true);
}
function isFocusVisible(event) {
    const { target } = event;
    try {
        return target.matches(":focus-visible");
    }
    catch (error) {
        // Browsers not implementing :focus-visible will throw a SyntaxError.
        // We use our own heuristic for those browsers.
        // Rethrow might be better if it's not the expected error but do we really
        // want to crash if focus-visible malfunctioned?
    }
    // No need for validFocusTarget check. The user does that by attaching it to
    // focusable events only.
    return hadKeyboardEvent || focusTriggersKeyboardModality(target);
}
function useIsFocusVisible() {
    const ref = (node) => {
        if (node != null) {
            prepare(node.ownerDocument);
        }
    };
    const [isFocusVisibleRef, setFocusVisibleRef] = createSignal(false);
    /**
     * Should be called if a blur event is fired
     */
    function handleBlurVisible() {
        // checking against potential state variable does not suffice if we focus and blur synchronously.
        // React wouldn't have time to trigger a re-render so `focusVisible` would be stale.
        // Ideally we would adjust `isFocusVisible(event)` to look at `relatedTarget` for blur events.
        // This doesn't work in IE11 due to https://github.com/facebook/react/issues/3751
        // TODO: check again if React releases their internal changes to focus event handling (https://github.com/facebook/react/pull/19186).
        if (isFocusVisibleRef()) {
            // To detect a tab/window switch, we look for a blur event followed
            // rapidly by a visibility change.
            // If we don't see a visibility change within 100ms, it's probably a
            // regular focus change.
            hadFocusVisibleRecently = true;
            window.clearTimeout(hadFocusVisibleRecentlyTimeout);
            hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
                hadFocusVisibleRecently = false;
            }, 100);
            setFocusVisibleRef(false);
            return true;
        }
        return false;
    }
    /**
     * Should be called if a blur event is fired
     */
    function handleFocusVisible(event) {
        if (isFocusVisible(event)) {
            setFocusVisibleRef(true);
            return true;
        }
        return false;
    }
    return {
        isFocusVisibleRef: {
            get current() {
                return isFocusVisibleRef();
            },
        },
        onFocus: handleFocusVisible,
        onBlur: handleBlurVisible,
        ref,
    };
}

const $$3 = createComponentFactory()({
  name: "MuiButtonBase",
  selfPropNames: ["LinkComponent", "TouchRippleProps", "action", "centerRipple", "children", "classes", "disableRipple", "disableRipple", "disableTouchRipple", "disabled", "focusRipple", "focusVisibleClassName", "onFocusVisible", "tabIndex", "touchRippleRef"],
  propDefaults: ({
    set
  }) => set({
    component: "button",
    disabled: false,
    disableRipple: false,
    disableTouchRipple: false,
    focusRipple: false,
    LinkComponent: "a",
    centerRipple: false,
    tabIndex: 0
  }),
  autoCallUseClasses: false,
  utilityClass: getButtonBaseUtilityClass,
  slotClasses: ownerState => ({
    root: ["root", ownerState.disabled && "disabled", ownerState.focusVisible && "focusVisible"]
  })
});
const ButtonBaseRoot = _hoc_function$2("button", {
  name: "MuiButtonBase",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  boxSizing: "border-box",
  ["WebkitTapHighlightColor"]: "transparent",
  backgroundColor: "transparent",
  outline: 0,
  border: 0,
  margin: 0,
  borderRadius: 0,
  padding: 0,
  cursor: "pointer",
  userSelect: "none",
  verticalAlign: "middle",
  ["MozAppearance"]: "none",
  ["WebkitAppearance"]: "none",
  textDecoration: "none",
  color: "inherit",
  "&::-moz-focus-inner": {
    borderStyle: "none"
  },
  [`&.${buttonBaseClasses.disabled}`]: {
    pointerEvents: "none",
    cursor: "default"
  },
  "@media print": {
    colorAdjust: "exact"
  }
});
const ButtonBase = $$3.component(function ButtonBase2({
  allProps,
  props,
  otherProps
}) {
  const button = createRef(otherProps);
  const ripple = createRef(() => props.touchRippleRef);
  const focus = useIsFocusVisible();
  let keydown = false;
  const [focusVisible, setFocusVisible] = createSignal(false);
  const [mountedState, setMountedState] = createSignal(false);
  const ownerState = mergeProps(allProps, {
    get focusVisible() {
      return focusVisible();
    }
  });
  const classes = $$3.useClasses(ownerState);
  function useRippleHandler(rippleAction, eventCallback, skipRippleAction = props.disableTouchRipple) {
    return event => {
      if (typeof eventCallback === "function") {
        eventCallback(event);
      }
      const ignore = skipRippleAction;
      if (!ignore && ripple.ref) {
        ripple.ref[rippleAction](event);
      }
      return true;
    };
  }
  const handleMouseDown = useRippleHandler("start", otherProps.onMouseDown);
  const handleContextMenu = useRippleHandler("stop", otherProps.onContextMenu);
  const handleDragLeave = useRippleHandler("stop", otherProps.onDragLeave);
  const handleMouseUp = useRippleHandler("stop", otherProps.onMouseUp);
  const handleMouseLeave = useRippleHandler("stop", event => {
    if (focusVisible()) {
      event.preventDefault();
    }
    if (typeof otherProps.onMouseLeave === "function") {
      otherProps.onMouseLeave(event);
    }
  });
  const handleTouchStart = useRippleHandler("start", otherProps.onTouchStart);
  const handleTouchEnd = useRippleHandler("stop", otherProps.onTouchEnd);
  const handleTouchMove = useRippleHandler("stop", otherProps.onTouchMove);
  const handleBlur = useRippleHandler("stop", event => {
    focus.onBlur(event);
    if (focus.isFocusVisibleRef.current === false) {
      setFocusVisible(false);
    }
    if (typeof otherProps.onFocusOut === "function") {
      otherProps.onFocusOut(event);
    }
  }, false);
  const handleFocus = event => {
    if (!button.ref) {
      button.ref = event.currentTarget;
    }
    focus.onFocus(event);
    if (focus.isFocusVisibleRef.current === true) {
      setFocusVisible(true);
      if (props.onFocusVisible) {
        props.onFocusVisible(event);
      }
    }
    if (typeof otherProps.onFocusIn === "function") {
      otherProps.onFocusIn(event);
    }
  };
  const isNonNativeButton = () => {
    return otherProps.component && otherProps.component !== "button" && !(button.ref.tagName === "A" && button.ref.hasAttribute("href"));
  };
  const handleKeyDown = event => {
    if (props.focusRipple && !keydown && focusVisible() && ripple.ref && event.key === " ") {
      keydown = true;
      ripple.ref.stop(event, () => {
        ripple.ref.start(event);
      });
    }
    if (event.target === event.currentTarget && isNonNativeButton() && event.key === " ") {
      event.preventDefault();
    }
    if (typeof otherProps.onKeyDown === "function") {
      otherProps.onKeyDown(event);
    }
    if (event.target === event.currentTarget && isNonNativeButton() && event.key === "Enter" && !props.disabled) {
      event.preventDefault();
      if (typeof otherProps.onClick === "function") {
        otherProps.onClick(event);
      }
    }
  };
  const handleKeyUp = event => {
    if (props.focusRipple && event.key === " " && ripple.ref && focusVisible() && !event.defaultPrevented) {
      keydown = false;
      ripple.ref.stop(event, () => {
        ripple.ref.pulsate(event);
      });
    }
    if (typeof otherProps.onKeyUp === "function") {
      otherProps.onKeyUp(event);
    }
    if (typeof otherProps.onClick === "function" && event.target === event.currentTarget && isNonNativeButton() && event.key === " " && !event.defaultPrevented) {
      otherProps.onClick(event);
    }
  };
  const ComponentProp = createMemo(() => {
    let result = otherProps.component;
    if (result === "button" && (otherProps.href || otherProps.to)) {
      result = props.LinkComponent;
    }
    return result;
  });
  const buttonProps = createMemo(() => {
    const buttonProps2 = {};
    if (ComponentProp() === "button") {
      buttonProps2.type = otherProps.type === void 0 ? "button" : otherProps.type;
      buttonProps2.disabled = props.disabled;
    } else {
      if (!otherProps.href && !otherProps.to) {
        buttonProps2.role = "button";
      }
      if (props.disabled) {
        buttonProps2["aria-disabled"] = props.disabled;
      }
    }
    return buttonProps2;
  });
  const enableTouchRipple = () => mountedState() && !props.disableRipple && !props.disabled;
  return createComponent$1(ButtonBaseRoot, mergeProps(buttonProps, otherProps, {
    get ["class"]() {
      return clsx(classes.root, otherProps.class);
    },
    ownerState: ownerState,
    onFocusOut: handleBlur,
    get onClick() {
      return otherProps.onClick;
    },
    onContextMenu: handleContextMenu,
    onFocusIn: handleFocus,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onMouseDown: handleMouseDown,
    onMouseLeave: handleMouseLeave,
    onMouseUp: handleMouseUp,
    onDragLeave: handleDragLeave,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onTouchStart: handleTouchStart,
    get tabIndex() {
      return props.disabled ? -1 : props.tabIndex;
    },
    get type() {
      return otherProps.type;
    },
    get component() {
      return ComponentProp();
    },
    get children() {
      return [props.children, createComponent$1(Show, {
        get when() {
          return enableTouchRipple();
        },
        get children() {
          return createComponent$1(TouchRipple, mergeProps({
            get center() {
              return props.centerRipple;
            }
          }, () => props.TouchRippleProps || {}));
        }
      })];
    }
  }));
});

__astro_tag_component__(ButtonBase, "@astrojs/solid-js");

const SvgIconContext = createContext();

__astro_tag_component__(SvgIconContext, "@astrojs/solid-js");

function getSvgIconUtilityClass(slot) {
    return generateUtilityClass("MuiSvgIcon", slot);
}
generateUtilityClasses("MuiSvgIcon", [
    "root",
    "colorPrimary",
    "colorSecondary",
    "colorAction",
    "colorError",
    "colorDisabled",
    "fontSizeInherit",
    "fontSizeSmall",
    "fontSizeMedium",
    "fontSizeLarge",
]);

const _tmpl$$4 = ["<title", ">", "</title>"];
const $$2 = createComponentFactory()({
  name: "MuiSvgIcon",
  selfPropNames: ["children", "classes", "color", "fontSize", "htmlColor", "inheritViewBox", "shapeRendering", "titleAccess", "viewBox"],
  propDefaults: ({
    set
  }) => {
    const context = useContext(SvgIconContext);
    return set({
      component: "svg",
      color: "inherit",
      get fontSize() {
        return context?.fontSize ?? "medium";
      },
      inheritViewBox: false,
      viewBox: "0 0 24 24"
    });
  },
  utilityClass: getSvgIconUtilityClass,
  slotClasses: o => ({
    root: ["root", o.color !== "inherit" && `color${capitalize(o.color)}`, `fontSize${capitalize(o.fontSize)}`]
  })
});
const SvgIconRoot = _hoc_function$2("svg", {
  name: "MuiSvgIcon",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.color !== "inherit" && styles[`color${capitalize(ownerState.color)}`], styles[`fontSize${capitalize(ownerState.fontSize)}`]];
  }
})(({
  theme,
  ownerState
}) => ({
  userSelect: "none",
  width: "1em",
  height: "1em",
  display: "inline-block",
  fill: "currentColor",
  flexShrink: 0,
  transition: theme.transitions?.create?.("fill", {
    duration: theme.transitions?.duration?.shorter
  }),
  fontSize: {
    inherit: "inherit",
    small: theme.typography?.pxToRem?.(20) || "1.25rem",
    medium: theme.typography?.pxToRem?.(24) || "1.5rem",
    large: theme.typography?.pxToRem?.(35) || "2.1875"
  }[ownerState.fontSize],
  color: theme.palette?.[ownerState.color]?.main ?? {
    action: theme.palette?.action?.active,
    disabled: theme.palette?.action?.disabled,
    inherit: void 0
  }[ownerState.color]
}));
const SvgIcon = $$2.component(function SvgIcon2({
  allProps,
  props,
  otherProps,
  classes
}) {
  return createComponent$1(SvgIconRoot, mergeProps({
    get ["aria-hidden"]() {
      return props.titleAccess ? void 0 : true;
    },
    get role() {
      return props.titleAccess ? "img" : void 0;
    },
    get viewBox() {
      return !props.inheritViewBox ? props.viewBox : void 0;
    }
  }, {
    ["focusable"]: "false"
  }, {
    get color() {
      return props.htmlColor;
    }
  }, otherProps, {
    get ["class"]() {
      return clsx(classes.root, otherProps.class);
    },
    ownerState: allProps,
    get children() {
      return [props.children, createComponent$1(Show, {
        get when() {
          return !!props.titleAccess;
        },
        get children() {
          return ssr(_tmpl$$4, ssrHydrationKey(), escape(props.titleAccess));
        }
      })];
    }
  }));
});

__astro_tag_component__(SvgIcon, "@astrojs/solid-js");

function createSvgIcon(path, displayName) {
  const Component = props => createComponent$1(SvgIcon, mergeProps({
    "data-testid": `${displayName}Icon`
  }, props, {
    children: path
  }));
  return Component;
}

__astro_tag_component__(createSvgIcon, "@astrojs/solid-js");

const _tmpl$$3 = ["<path", " d=\"M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z\"></path>"];
const _hoc_function$1 = createSvgIcon(() => ssr(_tmpl$$3, ssrHydrationKey()), "Cancel");

__astro_tag_component__(_hoc_function$1, "@astrojs/solid-js");

function getChipUtilityClass(slot) {
    return generateUtilityClass("MuiChip", slot);
}
const chipClasses = generateUtilityClasses("MuiChip", [
    "root",
    "sizeSmall",
    "sizeMedium",
    "colorPrimary",
    "colorSecondary",
    "disabled",
    "clickable",
    "clickableColorPrimary",
    "clickableColorSecondary",
    "deletable",
    "deletableColorPrimary",
    "deletableColorSecondary",
    "outlined",
    "filled",
    "outlinedPrimary",
    "outlinedSecondary",
    "avatar",
    "avatarSmall",
    "avatarMedium",
    "avatarColorPrimary",
    "avatarColorSecondary",
    "icon",
    "iconSmall",
    "iconMedium",
    "iconColorPrimary",
    "iconColorSecondary",
    "label",
    "labelSmall",
    "labelMedium",
    "deleteIcon",
    "deleteIconSmall",
    "deleteIconMedium",
    "deleteIconColorPrimary",
    "deleteIconColorSecondary",
    "deleteIconOutlinedColorPrimary",
    "deleteIconOutlinedColorSecondary",
    "focusVisible",
]);

const $$1 = createComponentFactory()({
  name: "MuiChip",
  propDefaults: ({
    set
  }) => set({
    color: "default",
    disabled: false,
    size: "medium",
    variant: "filled"
  }),
  selfPropNames: ["avatar", "children", "classes", "clickable", "color", "deleteIcon", "disabled", "icon", "label", "onDelete", "size", "variant"],
  utilityClass: getChipUtilityClass,
  slotClasses: ownerState => ({
    root: ["root", ownerState.variant, ownerState.disabled && "disabled", `size${capitalize(ownerState.size)}`, `color${capitalize(ownerState.color)}`, !!ownerState.clickable && "clickable", !!ownerState.clickable && `clickableColor${capitalize(ownerState.color)}`, !!ownerState.onDelete && "deletable", !!ownerState.onDelete && `deletableColor${capitalize(ownerState.color)}`, `${ownerState.variant}${capitalize(ownerState.color)}`],
    label: ["label", `label${capitalize(ownerState.size)}`],
    avatar: ["avatar", `avatar${capitalize(ownerState.size)}`, `avatarColor${capitalize(ownerState.color)}`],
    icon: ["icon", `icon${capitalize(ownerState.size)}`, `iconColor${capitalize(ownerState.color)}`],
    deleteIcon: ["deleteIcon", `deleteIcon${capitalize(ownerState.size)}`, `deleteIconColor${capitalize(ownerState.color)}`, `deleteIconOutlinedColor${capitalize(ownerState.color)}`]
  })
});
const ChipRoot = _hoc_function$2("div", {
  name: "MuiChip",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    const {
      color,
      clickable,
      onDelete,
      size,
      variant
    } = ownerState;
    return [{
      [`& .${chipClasses.avatar}`]: styles.avatar
    }, {
      [`& .${chipClasses.avatar}`]: styles[`avatar${capitalize(size)}`]
    }, {
      [`& .${chipClasses.avatar}`]: styles[`avatarColor${capitalize(color)}`]
    }, {
      [`& .${chipClasses.icon}`]: styles.icon
    }, {
      [`& .${chipClasses.icon}`]: styles[`icon${capitalize(size)}`]
    }, {
      [`& .${chipClasses.icon}`]: styles[`iconColor${capitalize(color)}`]
    }, {
      [`& .${chipClasses.deleteIcon}`]: styles.deleteIcon
    }, {
      [`& .${chipClasses.deleteIcon}`]: styles[`deleteIcon${capitalize(size)}`]
    }, {
      [`& .${chipClasses.deleteIcon}`]: styles[`deleteIconColor${capitalize(color)}`]
    }, {
      [`& .${chipClasses.deleteIcon}`]: styles[`deleteIconOutlinedColor${capitalize(color)}`]
    }, styles.root, styles[`size${capitalize(size)}`], styles[`color${capitalize(color)}`], clickable && styles.clickable, clickable && color !== "default" && styles[`clickableColor${capitalize(color)})`], onDelete && styles.deletable, onDelete && color !== "default" && styles[`deletableColor${capitalize(color)}`], styles[variant], variant === "outlined" && styles[`outlined${capitalize(color)}`]];
  }
})(({
  theme,
  ownerState
}) => {
  const deleteIconColor = alpha(theme.palette.text.primary, 0.26);
  return {
    maxWidth: "100%",
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(13),
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.selected,
    borderRadius: 32 / 2,
    whiteSpace: "nowrap",
    transition: theme.transitions.create(["background-color", "box-shadow"]),
    cursor: "default",
    outline: 0,
    textDecoration: "none",
    border: 0,
    padding: 0,
    verticalAlign: "middle",
    boxSizing: "border-box",
    [`&.${chipClasses.disabled}`]: {
      opacity: theme.palette.action.disabledOpacity,
      pointerEvents: "none"
    },
    [`& .${chipClasses.avatar}`]: {
      marginLeft: 5,
      marginRight: -6,
      width: 24,
      height: 24,
      color: theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[300],
      fontSize: theme.typography.pxToRem(12)
    },
    [`& .${chipClasses.avatarColorPrimary}`]: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.dark
    },
    [`& .${chipClasses.avatarColorSecondary}`]: {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.secondary.dark
    },
    [`& .${chipClasses.avatarSmall}`]: {
      marginLeft: 4,
      marginRight: -4,
      width: 18,
      height: 18,
      fontSize: theme.typography.pxToRem(10)
    },
    [`& .${chipClasses.icon}`]: {
      color: theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[300],
      marginLeft: 5,
      marginRight: -6,
      ...(ownerState.size === "small" && {
        fontSize: 18,
        marginLeft: 4,
        marginRight: -4
      }),
      ...(ownerState.color !== "default" && {
        color: "inherit"
      })
    },
    [`& .${chipClasses.deleteIcon}`]: {
      WebkitTapHighlightColor: "transparent",
      color: deleteIconColor,
      fontSize: 22,
      cursor: "pointer",
      margin: "0 5px 0 -6px",
      "&:hover": {
        color: alpha(deleteIconColor, 0.4)
      },
      ...(ownerState.size === "small" && {
        fontSize: 16,
        marginRight: 4,
        marginLeft: -4
      }),
      ...(ownerState.color !== "default" && {
        color: alpha(theme.palette[ownerState.color].contrastText, 0.7),
        "&:hover, &:active": {
          color: theme.palette[ownerState.color].contrastText
        }
      })
    },
    ...(ownerState.size === "small" && {
      height: 24
    }),
    ...(ownerState.color !== "default" && {
      backgroundColor: theme.palette[ownerState.color].main,
      color: theme.palette[ownerState.color].contrastText
    }),
    ...(ownerState.onDelete && {
      [`&.${chipClasses.focusVisible}`]: {
        backgroundColor: alpha(theme.palette.action.selected, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity)
      }
    }),
    ...(ownerState.onDelete && ownerState.color !== "default" && {
      [`&.${chipClasses.focusVisible}`]: {
        backgroundColor: theme.palette[ownerState.color].dark
      }
    })
  };
}, ({
  theme,
  ownerState
}) => ({
  ...(ownerState.clickable && {
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: alpha(theme.palette.action.selected, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity)
    },
    [`&.${chipClasses.focusVisible}`]: {
      backgroundColor: alpha(theme.palette.action.selected, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity)
    },
    "&:active": {
      boxShadow: theme.shadows[1]
    }
  }),
  ...(ownerState.clickable && ownerState.color !== "default" && {
    [`&:hover, &.${chipClasses.focusVisible}`]: {
      backgroundColor: theme.palette[ownerState.color].dark
    }
  })
}), ({
  theme,
  ownerState
}) => ({
  ...(ownerState.variant === "outlined" && {
    backgroundColor: "transparent",
    border: `1px solid ${theme.palette.mode === "light" ? theme.palette.grey[400] : theme.palette.grey[700]}`,
    [`&.${chipClasses.clickable}:hover`]: {
      backgroundColor: theme.palette.action.hover
    },
    [`&.${chipClasses.focusVisible}`]: {
      backgroundColor: theme.palette.action.focus
    },
    [`& .${chipClasses.avatar}`]: {
      marginLeft: 4
    },
    [`& .${chipClasses.avatarSmall}`]: {
      marginLeft: 2
    },
    [`& .${chipClasses.icon}`]: {
      marginLeft: 4
    },
    [`& .${chipClasses.iconSmall}`]: {
      marginLeft: 2
    },
    [`& .${chipClasses.deleteIcon}`]: {
      marginRight: 5
    },
    [`& .${chipClasses.deleteIconSmall}`]: {
      marginRight: 3
    }
  }),
  ...(ownerState.variant === "outlined" && ownerState.color !== "default" && {
    color: theme.palette[ownerState.color].main,
    border: `1px solid ${alpha(theme.palette[ownerState.color].main, 0.7)}`,
    [`&.${chipClasses.clickable}:hover`]: {
      backgroundColor: alpha(theme.palette[ownerState.color].main, theme.palette.action.hoverOpacity)
    },
    [`&.${chipClasses.focusVisible}`]: {
      backgroundColor: alpha(theme.palette[ownerState.color].main, theme.palette.action.focusOpacity)
    },
    [`& .${chipClasses.deleteIcon}`]: {
      color: alpha(theme.palette[ownerState.color].main, 0.7),
      "&:hover, &:active": {
        color: theme.palette[ownerState.color].main
      }
    }
  })
}));
const ChipLabel = _hoc_function$2("span", {
  name: "MuiChip",
  slot: "Label",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    const {
      size
    } = ownerState;
    return [styles.label, styles[`label${capitalize(size)}`]];
  }
})(({
  ownerState
}) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  paddingLeft: 12,
  paddingRight: 12,
  whiteSpace: "nowrap",
  ...(ownerState.size === "small" && {
    paddingLeft: 8,
    paddingRight: 8
  })
}));
function isDeleteKeyboardEvent(keyboardEvent) {
  return keyboardEvent.key === "Backspace" || keyboardEvent.key === "Delete";
}
const Chip = $$1.component(function Chip2({
  allProps,
  classes,
  otherProps,
  props
}) {
  const element = createElementRef(otherProps);
  const handleDeleteIconClick = event => {
    event.stopPropagation();
    props.onDelete?.();
  };
  const handleKeyDown = event => {
    if (event.currentTarget === event.target && isDeleteKeyboardEvent(event)) {
      event.preventDefault();
    }
    if (typeof otherProps.onKeyDown === "function") otherProps.onKeyDown(event);
  };
  const handleKeyUp = event => {
    if (event.currentTarget === event.target) {
      if (props.onDelete && isDeleteKeyboardEvent(event)) {
        props.onDelete();
      } else if (event.key === "Escape" && element.ref) {
        element.ref.blur();
      }
    }
    if (typeof otherProps.onKeyUp === "function") otherProps.onKeyUp(event);
  };
  const clickable = () => props.clickable !== false && otherProps.onClick ? true : props.clickable;
  const component = () => clickable() || props.onDelete ? ButtonBase : otherProps.component || "div";
  const moreProps = createMemo(() => component() === ButtonBase ? {
    component: otherProps.component || "div",
    ...(props.onDelete && {
      disableRipple: true
    })
  } : {});
  const deleteIcon = createMemo(() => {
    if (!props.onDelete) return void 0;
    const node = children(() => props.deleteIcon)();
    if (node && node instanceof Element) {
      node.setAttribute("class", clsx(node.getAttribute("class"), classes.deleteIcon));
      if (node instanceof SVGElement || node instanceof HTMLElement) node.onclick = handleDeleteIconClick;
    } else {
      return createComponent$1(_hoc_function$1, {
        get ["class"]() {
          return classes.deleteIcon;
        },
        onClick: handleDeleteIconClick
      });
    }
  });
  const avatar = createMemo(() => {
    const node = children(() => props.avatar)();
    if (node && node instanceof Element) {
      node.setAttribute("class", clsx(node.getAttribute("class"), classes.avatar));
    }
    return node;
  });
  const icon = createMemo(() => {
    const node = children(() => props.icon)();
    if (node && node instanceof Element) {
      node.setAttribute("class", clsx(node.getAttribute("class"), classes.icon));
    }
    return node;
  });
  if (process.env.NODE_ENV !== "production") {
    if (avatar() && icon()) {
      console.error("MUI: The Chip component can not handle the avatar and the icon prop at the same time. Pick one.");
    }
  }
  return createComponent$1(ChipRoot, mergeProps({
    get as() {
      return component();
    },
    get ["class"]() {
      return clsx(classes.root, otherProps.class);
    },
    get disabled() {
      return clickable() && props.disabled ? true : void 0;
    },
    get onClick() {
      return otherProps.onClick;
    },
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    ownerState: allProps
  }, moreProps, otherProps, {
    get children() {
      return [avatar() || icon(), createComponent$1(ChipLabel, {
        get ["class"]() {
          return clsx(classes.label);
        },
        ownerState: allProps,
        get children() {
          return props.label;
        }
      }), deleteIcon];
    }
  }));
});

__astro_tag_component__(Chip, "@astrojs/solid-js");

const _tmpl$$2 = ["<path", " d=\"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\"></path>"];
const _hoc_function = createSvgIcon(() => ssr(_tmpl$$2, ssrHydrationKey()), "Person");

__astro_tag_component__(_hoc_function, "@astrojs/solid-js");

function getAvatarUtilityClass(slot) {
    return generateUtilityClass("MuiAvatar", slot);
}
generateUtilityClasses("MuiAvatar", [
    "root",
    "colorDefault",
    "circular",
    "rounded",
    "square",
    "img",
    "fallback",
]);

const $ = createComponentFactory()({
  name: "MuiAvatar",
  selfPropNames: ["alt", "children", "classes", "imgProps", "sizes", "src", "srcSet", "variant"],
  utilityClass: getAvatarUtilityClass,
  slotClasses: ownerState => ({
    root: ["root", ownerState.variant, ownerState.colorDefault && "colorDefault"],
    img: ["img"],
    fallback: ["fallback"]
  })
});
const AvatarRoot = _hoc_function$2("div", {
  name: "MuiAvatar",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[ownerState.variant], ownerState.colorDefault && styles.colorDefault];
  }
})(({
  theme,
  ownerState
}) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 40,
  height: 40,
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.pxToRem(20),
  lineHeight: 1,
  borderRadius: "50%",
  overflow: "hidden",
  userSelect: "none",
  ...(ownerState.variant === "rounded" && {
    borderRadius: theme.shape.borderRadius
  }),
  ...(ownerState.variant === "square" && {
    borderRadius: 0
  }),
  ...(ownerState.colorDefault && {
    color: theme.palette.background.default,
    backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[400] : theme.palette.grey[600]
  })
}));
const AvatarImg = _hoc_function$2("img", {
  name: "MuiAvatar",
  slot: "Img",
  overridesResolver: (props, styles) => styles.img
})({
  width: "100%",
  height: "100%",
  textAlign: "center",
  objectFit: "cover",
  color: "transparent",
  textIndent: "10000"
});
const AvatarFallback = _hoc_function$2(_hoc_function, {
  name: "MuiAvatar",
  slot: "Fallback",
  overridesResolver: (props, styles) => styles.fallback
})({
  width: "75%",
  height: "75%"
});
function useLoaded(props) {
  let active = true;
  const [loaded, setLoaded] = createSignal(false);
  onCleanup(() => {
    active = false;
  });
  createEffect(on(() => [props.crossOrigin, props.referrerPolicy, props.src, props.srcSet], () => {
    if (!props.src && !props.srcSet) {
      return void 0;
    }
    setLoaded(false);
    const image = new Image();
    image.onload = () => {
      if (!active) {
        return;
      }
      setLoaded("loaded");
    };
    image.onerror = () => {
      if (!active) {
        return;
      }
      setLoaded("error");
    };
    image.crossOrigin = props.crossOrigin;
    image.referrerPolicy = props.referrerPolicy;
    image.src = props.src;
    if (props.srcSet) {
      image.srcset = props.srcSet;
    }
  }));
  return loaded;
}
const Avatar = $.defineComponent(function Avatar2(inProps) {
  const props = $.useThemeProps({
    props: inProps
  });
  const [, other] = splitProps(props, ["alt", "children", "class", "component", "imgProps", "sizes", "src", "srcSet", "variant"]);
  const baseProps = mergeProps({
    component: "div",
    variant: "circular"
  }, props);
  const loaded = useLoaded(mergeProps(() => props.imgProps || {}, {
    get src() {
      return props.src;
    },
    get srcSet() {
      return props.srcSet;
    }
  }));
  const hasImg = () => props.src || props.srcSet;
  const hasImgNotFailing = () => hasImg() && loaded() !== "error";
  const ownerState = mergeProps(props, {
    get colorDefault() {
      return !hasImgNotFailing();
    },
    get component() {
      return baseProps.component;
    },
    get variant() {
      return baseProps.variant;
    }
  });
  const classes = $.useClasses(ownerState);
  const children = () => {
    if (hasImgNotFailing()) {
      return createComponent$1(AvatarImg, mergeProps({
        get alt() {
          return props.alt;
        },
        get src() {
          return props.src;
        },
        get srcSet() {
          return props.srcSet;
        },
        get sizes() {
          return props.sizes;
        },
        ownerState: ownerState,
        get ["class"]() {
          return classes.img;
        }
      }, () => props.imgProps || {}));
    }
    const children2 = props.children;
    if (children2 !== null && children2 !== void 0) {
      return children2;
    } else if (hasImg() && props.alt) {
      return props.alt[0];
    } else {
      return createComponent$1(AvatarFallback, {
        get ["class"]() {
          return classes.fallback;
        }
      });
    }
  };
  return createComponent$1(AvatarRoot, mergeProps({
    get component() {
      return baseProps.component;
    },
    ownerState: ownerState,
    get ["class"]() {
      return clsx(classes.root, props.class);
    }
  }, other, {
    children: children
  }));
});

__astro_tag_component__(Avatar, "@astrojs/solid-js");

const ChipDisplay = ({
  label = "",
  title = "",
  value,
  chipProps = {},
  customStyle = {}
}) => {
  return value() !== void 0 && createComponent$1(Chip, mergeProps(chipProps, {
    title: title,
    get label() {
      return value();
    },
    get avatar() {
      return label ?? createComponent$1(Avatar, {
        children: label
      });
    },
    get sx() {
      return {
        ...style("chip", customStyle),
        paddingLeft: label ? "10px" : "0"
      };
    }
  }));
};
const SmallChipDisplay = props => createComponent$1(ChipDisplay, mergeProps(props, {
  get chipProps() {
    return {
      ...props.chipProps,
      size: "small"
    };
  },
  get customStyle() {
    return {
      ...props.customStyle,
      fontSize: 1
    };
  }
}));

__astro_tag_component__(SmallChipDisplay, "@astrojs/solid-js");
__astro_tag_component__(ChipDisplay, "@astrojs/solid-js");

const PointDisplay = ({
  title = "Body"
}) => {
  const properties = useStore(propertiesMap);
  return createComponent$1(ChipDisplay, {
    label: "\u2B24",
    title: title,
    value: () => properties().points,
    chipProps: {
      color: "info"
    }
  });
};

__astro_tag_component__(PointDisplay, "@astrojs/solid-js");

const MoneyDisplay = ({
  title = "Prachy"
}) => {
  const properties = useStore(propertiesMap);
  return createComponent$1(ChipDisplay, {
    label: "\u{1F4B0}",
    title: title,
    value: () => properties().money,
    customStyle: {
      backgroundColor: "highlight"
    }
  });
};

__astro_tag_component__(MoneyDisplay, "@astrojs/solid-js");

const MDXLayout$6 = async function ({
  children
}) {
  const Layout = (await import('./chunks/FormLayout.901608f8.mjs')).default;
  const {
    layout,
    ...content
  } = frontmatter$9;
  content.file = file$8;
  content.url = url$8;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$8,
    url: url$8,
    content,
    frontmatter: content,
    headings: getHeadings$9(),
    "server:root": true,
    children
  });
};
const frontmatter$9 = {
  "layout": "@layouts/FormLayout.astro",
  "title": "Character Properties"
};
function getHeadings$9() {
  return [{
    "depth": 2,
    "slug": "vlastnosti",
    "text": "Vlastnosti"
  }];
}
function _createMdxContent$9(props) {
  const _components = Object.assign({
      h2: "h2"
    }, props.components),
    {
      Row
    } = _components;
  if (!Row) _missingMdxReference$3("Row", true);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "vlastnosti",
      children: "Vlastnosti"
    }), "\n", "\n", createVNode(Row, {
      justifyContent: "flex-end",
      children: [createVNode("astro-client-only", {
        "client:only": "solid-js",
        "client:display-name": "PointDisplay",
        "client:component-path": "@portal/components/PointDisplay",
        "client:component-export": "default",
        "client:component-hydration": true
      }), createVNode("astro-client-only", {
        "client:only": "solid-js",
        "client:display-name": "MoneyDisplay",
        "client:component-path": "@portal/components/MoneyDisplay",
        "client:component-export": "default",
        "client:component-hydration": true
      })]
    }), "\n", createVNode("astro-client-only", {
      "client:only": "solid-js",
      "client:display-name": "NameInput",
      "client:component-path": "@portal/components/properties/NameInput",
      "client:component-export": "default",
      "client:component-hydration": true
    })]
  });
}
function MDXContent$9(props = {}) {
  return createVNode(MDXLayout$6, {
    ...props,
    children: createVNode(_createMdxContent$9, {
      ...props
    })
  });
}
function _missingMdxReference$3(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
__astro_tag_component__(getHeadings$9, "astro:jsx");
__astro_tag_component__(MDXContent$9, "astro:jsx");
MDXContent$9[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$9.layout);
const url$8 = "src/projects/rpg/builder/ui/portal/blocks/properties.mdx";
const file$8 = "C:/work/killman/rpg-store/src/projects/rpg/builder/ui/portal/blocks/properties.mdx";
const Content$8 = MDXContent$9;

const $$Astro$l = createAstro("C:/work/killman/rpg-store/src/styles/components/custom/box.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Box = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$Box;
  const props = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(style("box", props), "style")}>
  ${renderSlot($$result, $$slots["default"])}
</div>`;
});

const $$Astro$k = createAstro("C:/work/killman/rpg-store/src/styles/components/custom/row.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Row = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$Row;
  const { display = "flex", flexWrap = "wrap", rowGap = 3, columnGap = 3, ...props } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Box", $$Box, { "display": display, "flexWrap": flexWrap, "rowGap": rowGap, "columnGap": columnGap, ...props }, { "default": () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}`;
});

const $$Astro$j = createAstro("C:/work/killman/rpg-store/src/pages/builder/BlockList.astro", "", "file:///C:/work/killman/rpg-store/");
const $$BlockList = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$BlockList;
  const blocks = [
    { url: "/builder/blocks/races", header: "Races", action: "Set races", type: "races" },
    {
      url: "/builder/blocks/equipments",
      header: "Equipments",
      action: "Set equipments",
      type: "equipments"
    },
    {
      url: "/builder/blocks/advantages",
      header: "Advantages",
      action: "Set advantages",
      type: "advantages"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Row", $$Row, { "marginTop": 4 }, { "default": () => renderTemplate`${blocks.map((block) => renderTemplate`${renderComponent($$result, "CardLink", null, { "href": block.url, "header": block.header, "action": block.action, "customStyle": { minWidth: "300px", color: "background" }, "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "@widgets/CardLink", "client:component-export": "default" }, { "default": () => renderTemplate`${renderComponent($$result, "Row", $$Row, { "marginTop": 3 }, { "default": () => renderTemplate`${renderComponent($$result, "BlockDisplay", null, { "type": block.type, "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "@components/BlockDisplay", "client:component-export": "default" })}` })}` })}`)}` })}`;
});

const $$file$5 = "C:/work/killman/rpg-store/src/pages/builder/BlockList.astro";
const $$url$5 = "/builder/BlockList";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BlockList,
  file: $$file$5,
  url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$i = createAstro("C:/work/killman/rpg-store/src/styles/components/html/h1.astro", "", "file:///C:/work/killman/rpg-store/");
const $$H1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$H1;
  const props = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<h1${addAttribute(style("h1", props), "style")}>
  ${renderSlot($$result, $$slots["default"])}
</h1>`;
});

const $$Astro$h = createAstro("C:/work/killman/rpg-store/src/styles/components/html/h2.astro", "", "file:///C:/work/killman/rpg-store/");
const $$H2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$H2;
  const props = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<h2${addAttribute(style("h2", props), "style")}>
  ${renderSlot($$result, $$slots["default"])}
</h2>`;
});

const $$Astro$g = createAstro("C:/work/killman/rpg-store/src/styles/components/html/p.astro", "", "file:///C:/work/killman/rpg-store/");
const $$P = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$P;
  const props = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<p${addAttribute(style("p", props), "style")}>
  ${renderSlot($$result, $$slots["default"])}
</p>`;
});

const $$Astro$f = createAstro("C:/work/killman/rpg-store/src/styles/components/html/a.astro", "", "file:///C:/work/killman/rpg-store/");
const $$A = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$A;
  const { href, ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute(style("a", props), "style")}>
  ${renderSlot($$result, $$slots["default"])}
</a>`;
});

const $$Astro$e = createAstro("C:/work/killman/rpg-store/src/styles/components/custom/quote.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Quote = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Quote;
  const { isRed } = Astro2.props;
  return renderTemplate`

${maybeRenderHead($$result)}<div${addAttribute([["box", { red: isRed }], "astro-EW4G6WVL"], "class:list")}>
  ${renderComponent($$result, "Box", $$Box, { "padding": Theme$1.getTheme().spaces[5], "class": "astro-EW4G6WVL" }, { "default": () => renderTemplate`<div class="astro-EW4G6WVL">QUOTE START</div><pre class="astro-EW4G6WVL">${renderSlot($$result, $$slots["default"])}</pre><div class="astro-EW4G6WVL">QUOTE END</div>` })}
</div>`;
});

const frontmatter$8 = {};
function getHeadings$8() {
  return [];
}
const components = {
  h1: $$H1,
  h2: $$H2,
  p: $$P,
  a: $$A,
  Box: $$Box,
  Row: $$Row,
  Quote: $$Quote
};
function _createMdxContent$8(props) {
  return createVNode(Fragment, {});
}
function MDXContent$8(props = {}) {
  const {
    wrapper: MDXLayout
  } = props.components || {};
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent$8, {
      ...props
    })
  }) : _createMdxContent$8();
}
__astro_tag_component__(getHeadings$8, "astro:jsx");
__astro_tag_component__(MDXContent$8, "astro:jsx");
MDXContent$8[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$8.layout);

const MDXLayout$5 = async function ({
  children
}) {
  const Layout = (await import('./chunks/BuilderLayout.97769b25.mjs')).default;
  const {
    layout,
    ...content
  } = frontmatter$7;
  content.file = file$7;
  content.url = url$7;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$7,
    url: url$7,
    content,
    frontmatter: content,
    headings: getHeadings$7(),
    "server:root": true,
    children
  });
};
const frontmatter$7 = {
  "layout": "@layouts/BuilderLayout.astro"
};
function getHeadings$7() {
  return [{
    "depth": 1,
    "slug": "tvorba-postavy",
    "text": "Tvorba Postavy"
  }];
}
function _createMdxContent$7(props) {
  const _components = Object.assign({
    h1: "h1",
    p: "p",
    a: "a"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h1, {
      id: "tvorba-postavy",
      children: "Tvorba Postavy"
    }), "\n", createVNode(_components.p, {
      children: ["Vytvo\u0159en\xED postavy je asi nejd\u016Fle\u017Eit\u011Bj\u0161\xED funkc\xED pravidel.", createVNode("br", {}), "\r\nObecn\u011B vzato, nejlep\u0161\xED zp\u016Fsob jak vytvo\u0159it postavu, je v sou\u010Dinnosti s P\xE1nem jeskyn\u011B.", createVNode("br", {}), "\r\nZku\u0161en\u011Bj\u0161\xED hr\xE1\u010D RPG\u010Dek by nem\u011Bl m\xEDt probl\xE9m vytvo\u0159it podle t\u011Bchto pravidel postavu (a\u017E to bude kompletn\xED), ale k\xE1men \xFArazu je v tom, \u017Ee pravidla nejsou to jedin\xE9, co je t\u0159eba p\u0159i tvorb\u011B postavy zohlednit.", createVNode("br", {}), "\r\nNejd\u0159\xEDve je dobr\xE9 se zamyslet nad t\xEDm, jak postava zapadne do zam\xFD\u0161len\xE9ho ", createVNode(_components.a, {
        href: "http://www.odria.eu/wiki/index.php/Kategorie:Settingy",
        children: "settingu"
      }), " a stylu hry, a mo\u017En\xE1 i vz\xEDt v \xFAvahu jak\xE9 postavy budou ve h\u0159e stran ostatn\xEDch hr\xE1\u010D\u016F.", createVNode("br", {}), "\r\nDal\u0161\xED v\u011Bc\xED na zv\xE1\u017Een\xED je z\xE1bavnost a zvl\xE1dnutelnost hran\xED zam\xFD\u0161len\xE9 postavy. Hr\xE1\u010D by si m\u011Bl dob\u0159e rozmyslet, jestli dok\xE1\u017Ee zahr\xE1t zejm\xE9na opa\u010Dn\xE9 pohlav\xED \u010Di nelidskou rasu, a jestli jej to bude bavit hr\xE1t t\u0159eba i za p\u016Fl roku - pokud je pl\xE1nov\xE1na kampa\u0148."]
    }), "\n", createVNode(_components.p, {
      children: ["V\xEDce informac\xED: ", createVNode(_components.a, {
        href: "http://www.odria.eu/wiki/index.php/Tvorba_postavy",
        children: "Odria wiki: Tvorba postavy"
      })]
    }), "\n", createVNode(Content$8, {
      components: components
    }), "\n", createVNode($$BlockList, {})]
  });
}
function MDXContent$7(props = {}) {
  return createVNode(MDXLayout$5, {
    ...props,
    children: createVNode(_createMdxContent$7, {
      ...props
    })
  });
}
__astro_tag_component__(getHeadings$7, "astro:jsx");
__astro_tag_component__(components, "astro:jsx");
__astro_tag_component__(MDXContent$7, "astro:jsx");
MDXContent$7[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$7.layout);
const url$7 = "/builder";
const file$7 = "C:/work/killman/rpg-store/src/pages/builder/index.mdx";
function rawContent$4() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$4() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$7 = MDXContent$7;

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$7,
  getHeadings: getHeadings$7,
  components,
  default: MDXContent$7,
  url: url$7,
  file: file$7,
  rawContent: rawContent$4,
  compiledContent: compiledContent$4,
  Content: Content$7
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$4 = async function ({
  children
}) {
  const Layout = (await import('./chunks/FormLayout.901608f8.mjs')).default;
  const {
    layout,
    ...content
  } = frontmatter$6;
  content.file = file$6;
  content.url = url$6;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$6,
    url: url$6,
    content,
    frontmatter: content,
    headings: getHeadings$6(),
    "server:root": true,
    children
  });
};
const frontmatter$6 = {
  "layout": "@layouts/FormLayout.astro",
  "title": "Advantages"
};
function getHeadings$6() {
  return [{
    "depth": 2,
    "slug": "this-is-h2",
    "text": "This is H2"
  }];
}
function _createMdxContent$6(props) {
  const _components = Object.assign({
      p: "p",
      h2: "h2"
    }, props.components),
    {
      Quote
    } = _components;
  if (!Quote) _missingMdxReference$2("Quote", true);
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "Bla Bla Bla\r\nInfo text advantages / disadvantages"
    }), "\n", createVNode(Quote, {
      isRed: true,
      children: "This is a quote"
    }), "\n", createVNode(_components.h2, {
      id: "this-is-h2",
      children: "This is H2"
    }), "\n", "\n", createVNode("astro-client-only", {
      name: "name",
      "client:only": "solid-js",
      "client:display-name": "StringInput",
      "client:component-path": "@input/StringInput",
      "client:component-export": "default",
      "client:component-hydration": true
    })]
  });
}
function MDXContent$6(props = {}) {
  return createVNode(MDXLayout$4, {
    ...props,
    children: createVNode(_createMdxContent$6, {
      ...props
    })
  });
}
function _missingMdxReference$2(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
__astro_tag_component__(getHeadings$6, "astro:jsx");
__astro_tag_component__(MDXContent$6, "astro:jsx");
MDXContent$6[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$6.layout);
const url$6 = "src/projects/rpg/builder/ui/portal/blocks/advantages.mdx";
const file$6 = "C:/work/killman/rpg-store/src/projects/rpg/builder/ui/portal/blocks/advantages.mdx";
const Content$6 = MDXContent$6;

const frontmatter$5 = {
  "title": "Advantages"
};
function getHeadings$5() {
  return [];
}
function _createMdxContent$5(props) {
  return createVNode(Content$6, {
    components: components
  });
}
function MDXContent$5(props = {}) {
  const {
    wrapper: MDXLayout
  } = props.components || {};
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent$5, {
      ...props
    })
  }) : _createMdxContent$5();
}
__astro_tag_component__(getHeadings$5, "astro:jsx");
__astro_tag_component__(components, "astro:jsx");
__astro_tag_component__(MDXContent$5, "astro:jsx");
MDXContent$5[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$5.layout);
const url$5 = "/builder/blocks/advantages";
const file$5 = "C:/work/killman/rpg-store/src/pages/builder/blocks/advantages.mdx";
function rawContent$3() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$3() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$5 = MDXContent$5;

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$5,
  getHeadings: getHeadings$5,
  components,
  default: MDXContent$5,
  url: url$5,
  file: file$5,
  rawContent: rawContent$3,
  compiledContent: compiledContent$3,
  Content: Content$5
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$3 = async function ({
  children
}) {
  const Layout = (await import('./chunks/FormLayout.901608f8.mjs')).default;
  const {
    layout,
    ...content
  } = frontmatter$4;
  content.file = file$4;
  content.url = url$4;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$4,
    url: url$4,
    content,
    frontmatter: content,
    headings: getHeadings$4(),
    "server:root": true,
    children
  });
};
const frontmatter$4 = {
  "layout": "@layouts/FormLayout.astro",
  "title": "Equipments"
};
function getHeadings$4() {
  return [{
    "depth": 2,
    "slug": "this-is-h2",
    "text": "This is H2"
  }];
}
function _createMdxContent$4(props) {
  const _components = Object.assign({
      p: "p",
      h2: "h2"
    }, props.components),
    {
      Quote
    } = _components;
  if (!Quote) _missingMdxReference$1("Quote", true);
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "Bla Bla Bla\r\nInfo text equipments"
    }), "\n", createVNode(Quote, {
      isRed: true,
      children: "This is a quote"
    }), "\n", createVNode(_components.h2, {
      id: "this-is-h2",
      children: "This is H2"
    }), "\n", "\n", createVNode("astro-client-only", {
      name: "name",
      "client:only": "solid-js",
      "client:display-name": "StringInput",
      "client:component-path": "@input/StringInput",
      "client:component-export": "default",
      "client:component-hydration": true
    })]
  });
}
function MDXContent$4(props = {}) {
  return createVNode(MDXLayout$3, {
    ...props,
    children: createVNode(_createMdxContent$4, {
      ...props
    })
  });
}
function _missingMdxReference$1(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
__astro_tag_component__(getHeadings$4, "astro:jsx");
__astro_tag_component__(MDXContent$4, "astro:jsx");
MDXContent$4[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$4.layout);
const url$4 = "src/projects/rpg/builder/ui/portal/blocks/equipments.mdx";
const file$4 = "C:/work/killman/rpg-store/src/projects/rpg/builder/ui/portal/blocks/equipments.mdx";
const Content$4 = MDXContent$4;

const frontmatter$3 = {
  "title": "Equipments"
};
function getHeadings$3() {
  return [];
}
function _createMdxContent$3(props) {
  return createVNode(Content$4, {
    components: components
  });
}
function MDXContent$3(props = {}) {
  const {
    wrapper: MDXLayout
  } = props.components || {};
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent$3, {
      ...props
    })
  }) : _createMdxContent$3();
}
__astro_tag_component__(getHeadings$3, "astro:jsx");
__astro_tag_component__(components, "astro:jsx");
__astro_tag_component__(MDXContent$3, "astro:jsx");
MDXContent$3[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$3.layout);
const url$3 = "/builder/blocks/equipments";
const file$3 = "C:/work/killman/rpg-store/src/pages/builder/blocks/equipments.mdx";
function rawContent$2() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$2() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$3 = MDXContent$3;

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$3,
  getHeadings: getHeadings$3,
  components,
  default: MDXContent$3,
  url: url$3,
  file: file$3,
  rawContent: rawContent$2,
  compiledContent: compiledContent$2,
  Content: Content$3
}, Symbol.toStringTag, { value: 'Module' }));

const target = new ResourceAtom(M.uiTarget);
const targetAtom = target.atom;

const blockData = new FormData(M.uiBlockData);
const blockMap = blockData.map;
const blockInfo = new ResourceAtom(M.uiBlockInfo);
const infoAtom = blockInfo.atom;
PubSub.subscribe(M.uiSaveAction, () => {
  PubSub.publish(M.uiSave, { block: blockMap.get(), properties: propertiesMap.get() });
});

const _tmpl$$1 = ["<p", " style=\"", "\">", "</p>"],
  _tmpl$2 = ["<select", " multiple", " size=\"8\"", ">", "</select>"],
  _tmpl$3 = ["<option", "", "", ">", "</option>"];
const MultiSelect = ({
  mode = "write",
  name,
  options,
  values,
  texts = option => option,
  disabled = () => false,
  onChange
}) => {
  return values() && options() && ssr(_tmpl$$1, ssrHydrationKey(), "color:" + escape("red" , true) + (";font-weight:" + 700) + (";font-size:" + "1.5rem"), mode === "read" ? escape(JSON.stringify(values) ?? "") : escape([name, ":", " ", ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("id", escape(name, true), false) + ssrAttribute("name", escape(name, true), false), ssrAttribute("disabled", mode === "disabled", true), escape(options().map(option => ssr(_tmpl$3, ssrHydrationKey() + ssrAttribute("value", escape(option, true), false), ssrAttribute("selected", values().includes(option), true), ssrAttribute("disabled", disabled(option), true), escape(texts(option))))))]));
};

__astro_tag_component__(MultiSelect, "@astrojs/solid-js");

const RaceSelector = () => {
  const properties = useStore(propertiesMap);
  const block = useStore(blockMap);
  const info = useStore(infoAtom);
  const text = race => info()[race].name + " (" + info()[race].points + ")";
  const points = races => races.reduce((sum, race) => sum + info()[race].points, 0);
  const updateRaces = races => {
    const newPoints = properties().points - points(block().races) + points(races);
    blockMap.setKey("races", races);
    propertiesMap.setKey("points", newPoints);
  };
  const disabled = race => !block().races.includes(race) && properties().points + info()[race].points < 0;
  return createComponent$1(MultiSelect, {
    name: "races",
    options: () => Object.keys(info()).sort(),
    values: () => block().races,
    texts: race => info() ? text(race) : "",
    disabled: disabled,
    onChange: updateRaces
  });
};

__astro_tag_component__(RaceSelector, "@astrojs/solid-js");

const _tmpl$ = ["<div", ">", "</div>"];
const TargetDisplay = () => {
  const target = useStore(targetAtom);
  return ssr(_tmpl$, ssrHydrationKey(), escape(JSON.stringify(target())));
};

__astro_tag_component__(TargetDisplay, "@astrojs/solid-js");

const MDXLayout$2 = async function ({
  children
}) {
  const Layout = (await import('./chunks/FormLayout.901608f8.mjs')).default;
  const {
    layout,
    ...content
  } = frontmatter$2;
  content.file = file$2;
  content.url = url$2;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$2,
    url: url$2,
    content,
    frontmatter: content,
    headings: getHeadings$2(),
    "server:root": true,
    children
  });
};
const frontmatter$2 = {
  "layout": "@layouts/FormLayout.astro",
  "title": "Races"
};
function getHeadings$2() {
  return [{
    "depth": 2,
    "slug": "h2-h2",
    "text": "H2 H2"
  }];
}
function _createMdxContent$2(props) {
  const _components = Object.assign({
      h2: "h2",
      p: "p"
    }, props.components),
    {
      Quote
    } = _components;
  if (!Quote) _missingMdxReference("Quote", true);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "h2-h2",
      children: "H2 H2"
    }), "\n", createVNode(_components.p, {
      children: "Bla Bla Bla\r\nInfo text races"
    }), "\n", createVNode(Quote, {
      isRed: true,
      children: "This is a quote"
    }), "\n", "\n", createVNode("astro-client-only", {
      "client:only": "solid-js",
      "client:display-name": "PointDisplay",
      "client:component-path": "@portal/components/PointDisplay",
      "client:component-export": "default",
      "client:component-hydration": true
    }), "\n", createVNode("astro-client-only", {
      "client:only": "solid-js",
      "client:display-name": "RaceSelector",
      "client:component-path": "@portal/components/races/RaceSelector",
      "client:component-export": "default",
      "client:component-hydration": true
    })]
  });
}
function MDXContent$2(props = {}) {
  return createVNode(MDXLayout$2, {
    ...props,
    children: createVNode(_createMdxContent$2, {
      ...props
    })
  });
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
__astro_tag_component__(getHeadings$2, "astro:jsx");
__astro_tag_component__(MDXContent$2, "astro:jsx");
MDXContent$2[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$2.layout);
const url$2 = "src/projects/rpg/builder/ui/portal/blocks/races.mdx";
const file$2 = "C:/work/killman/rpg-store/src/projects/rpg/builder/ui/portal/blocks/races.mdx";
const Content$2 = MDXContent$2;

const MDXLayout$1 = async function ({
  children
}) {
  const Layout = (await import('./chunks/BuilderLayout.97769b25.mjs')).default;
  const {
    layout,
    ...content
  } = frontmatter$1;
  content.file = file$1;
  content.url = url$1;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$1,
    url: url$1,
    content,
    frontmatter: content,
    headings: getHeadings$1(),
    "server:root": true,
    children
  });
};
const frontmatter$1 = {
  "layout": "@layouts/BuilderLayout.astro",
  "title": "Races"
};
function getHeadings$1() {
  return [];
}
function _createMdxContent$1(props) {
  return createVNode(Content$2, {
    components: components
  });
}
function MDXContent$1(props = {}) {
  return createVNode(MDXLayout$1, {
    ...props,
    children: createVNode(_createMdxContent$1, {
      ...props
    })
  });
}
__astro_tag_component__(getHeadings$1, "astro:jsx");
__astro_tag_component__(components, "astro:jsx");
__astro_tag_component__(MDXContent$1, "astro:jsx");
MDXContent$1[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$1.layout);
const url$1 = "/builder/blocks/races";
const file$1 = "C:/work/killman/rpg-store/src/pages/builder/blocks/races.mdx";
function rawContent$1() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$1() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$1 = MDXContent$1;

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$1,
  getHeadings: getHeadings$1,
  components,
  default: MDXContent$1,
  url: url$1,
  file: file$1,
  rawContent: rawContent$1,
  compiledContent: compiledContent$1,
  Content: Content$1
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout = async function ({
  children
}) {
  const Layout = (await import('./chunks/MdxLayout.739e2dda.mjs')).default;
  const {
    layout,
    ...content
  } = frontmatter;
  content.file = file;
  content.url = url;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file,
    url,
    content,
    frontmatter: content,
    headings: getHeadings(),
    "server:root": true,
    children
  });
};
const frontmatter = {
  "layout": "projects/rpg/tiles/layouts/MdxLayout.astro"
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "gfm",
    "text": "GFM"
  }, {
    "depth": 2,
    "slug": "autolink-literals",
    "text": "Autolink literals"
  }, {
    "depth": 2,
    "slug": "footnote",
    "text": "Footnote"
  }, {
    "depth": 2,
    "slug": "strikethrough",
    "text": "Strikethrough"
  }, {
    "depth": 2,
    "slug": "table",
    "text": "Table"
  }, {
    "depth": 2,
    "slug": "tasklist",
    "text": "Tasklist"
  }, {
    "depth": 2,
    "slug": "footnote-label",
    "text": "Footnotes"
  }];
}
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: "h1",
    h2: "h2",
    p: "p",
    a: "a",
    sup: "sup",
    del: "del",
    table: "table",
    thead: "thead",
    tr: "tr",
    th: "th",
    ul: "ul",
    li: "li",
    input: "input",
    section: "section",
    ol: "ol"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h1, {
      id: "gfm",
      children: "GFM"
    }), "\n", createVNode(_components.h2, {
      id: "autolink-literals",
      children: "Autolink literals"
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.a, {
        href: "http://www.example.com",
        children: "www.example.com"
      }), ", ", createVNode(_components.a, {
        href: "https://example.com",
        children: "https://example.com"
      }), ", and ", createVNode(_components.a, {
        href: "mailto:contact@example.com",
        children: "contact@example.com"
      }), "."]
    }), "\n", createVNode(_components.h2, {
      id: "footnote",
      children: "Footnote"
    }), "\n", createVNode(_components.p, {
      children: ["A note", createVNode(_components.sup, {
        children: createVNode(_components.a, {
          href: "#user-content-fn-1",
          id: "user-content-fnref-1",
          "data-footnote-ref": "",
          "aria-describedby": "footnote-label",
          children: "1"
        })
      })]
    }), "\n", createVNode(_components.h2, {
      id: "strikethrough",
      children: "Strikethrough"
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.del, {
        children: "one"
      }), " or ", createVNode(_components.del, {
        children: "two"
      }), " tildes."]
    }), "\n", createVNode(_components.h2, {
      id: "table",
      children: "Table"
    }), "\n\n\n\n\n\n\n\n\n\n", createVNode(_components.table, {
      children: createVNode(_components.thead, {
        children: createVNode(_components.tr, {
          children: [createVNode(_components.th, {
            children: "a"
          }), createVNode(_components.th, {
            align: "left",
            children: "b"
          }), createVNode(_components.th, {
            align: "right",
            children: "c"
          }), createVNode(_components.th, {
            align: "center",
            children: "d"
          })]
        })
      })
    }), "\n", createVNode(_components.h2, {
      id: "tasklist",
      children: "Tasklist"
    }), "\n", createVNode(_components.ul, {
      className: "contains-task-list",
      children: ["\n", createVNode(_components.li, {
        className: "task-list-item",
        children: [createVNode(_components.input, {
          type: "checkbox",
          disabled: true
        }), " to do"]
      }), "\n", createVNode(_components.li, {
        className: "task-list-item",
        children: [createVNode(_components.input, {
          type: "checkbox",
          checked: true,
          disabled: true
        }), " done"]
      }), "\n"]
    }), "\n", createVNode(_components.section, {
      "data-footnotes": "",
      className: "footnotes",
      children: [createVNode(_components.h2, {
        className: "sr-only",
        id: "footnote-label",
        children: "Footnotes"
      }), "\n", createVNode(_components.ol, {
        children: ["\n", createVNode(_components.li, {
          id: "user-content-fn-1",
          children: ["\n", createVNode(_components.p, {
            children: ["Big note. ", createVNode(_components.a, {
              href: "#user-content-fnref-1",
              "data-footnote-backref": "",
              className: "data-footnote-backref",
              "aria-label": "Back to content",
              children: "\u21A9"
            })]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    })]
  });
}
function MDXContent(props = {}) {
  return createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  });
}
__astro_tag_component__(getHeadings, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
MDXContent[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
const url = "/sample";
const file = "C:/work/killman/rpg-store/src/pages/sample.mdx";
function rawContent() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content = MDXContent;

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter,
  getHeadings,
  default: MDXContent,
  url,
  file,
  rawContent,
  compiledContent,
  Content
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$d = createAstro("C:/work/killman/rpg-store/src/projects/board/components/GridSideLength.astro", "", "file:///C:/work/killman/rpg-store/");
const $$GridSideLength = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$GridSideLength;
  return renderTemplate`${maybeRenderHead($$result)}<div>
  <label>Grid Side Length:</label>
  <input id="GridSideLength" type="number"${addAttribute(0, "min")}${addAttribute(21, "max")}${addAttribute(8, "value")}>
  ${maybeRenderHead($$result)}
</div>`;
});

const $$Astro$c = createAstro("C:/work/killman/rpg-store/src/projects/board/layouts/BoardLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$BoardLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$BoardLayout;
  const { pageTitle } = Astro2.props;
  return renderTemplate`


  
    <meta charset="utf-8">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="viewport" content="width=device-width">
    <meta name="generator"${addAttribute(Astro2.generator, "content")}>
    <title>${pageTitle}</title>
  
  ${maybeRenderHead($$result)}<body class="astro-EVXPFODD">
    <div class="header astro-EVXPFODD">
      ${renderSlot($$result, $$slots["header"])}
    </div>
    <div class="content astro-EVXPFODD">
      ${renderSlot($$result, $$slots["content"])}
    </div>
  </body>`;
});

const $$Astro$b = createAstro("C:/work/killman/rpg-store/src/pages/board/index.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Index$1;
  return renderTemplate`${renderComponent($$result, "BoardLayout", $$BoardLayout, { "pageTitle": "RPG Store" }, { "content": () => renderTemplate`${maybeRenderHead($$result)}<div>${renderComponent($$result, "Board", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "projects/board/components/Board", "client:component-export": "default" })}</div>`, "header": () => renderTemplate`<div>${renderComponent($$result, "GridSideLength", $$GridSideLength, {})}</div>` })}
${maybeRenderHead($$result)}`;
});

const $$file$4 = "C:/work/killman/rpg-store/src/pages/board/index.astro";
const $$url$4 = "/board";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$1,
  file: $$file$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$a = createAstro("C:/work/killman/rpg-store/src/tests/layouts/MainTestLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$MainTestLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$MainTestLayout;
  const { pageTitle } = Astro2.props;
  return renderTemplate`


  
    <meta charset="utf-8">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="viewport" content="width=device-width">
    <meta name="generator"${addAttribute(Astro2.generator, "content")}>
    <title>${pageTitle}</title>
  
  ${maybeRenderHead($$result)}<body class="astro-N5HO4OQV">
    <div class="header astro-N5HO4OQV">
      <h1 class="astro-N5HO4OQV">${pageTitle}</h1>
    </div>
    <div class="content astro-N5HO4OQV">
      ${renderSlot($$result, $$slots["default"])}
    </div>
  </body>`;
});

const $$Astro$9 = createAstro("C:/work/killman/rpg-store/src/pages/tests/index.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`

${renderComponent($$result, "MainTestLayout", $$MainTestLayout, { "pageTitle": "Unit tests", "class": "astro-ZC2BGLHS" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="content astro-ZC2BGLHS">
    <ul class="astro-ZC2BGLHS">
      <li class="astro-ZC2BGLHS"><a href="/tests/projects/rpg/tiles/stores/tiles" class="astro-ZC2BGLHS">Tiles store</a></li>
      <li class="astro-ZC2BGLHS"><a href="/tests/projects/rpg/tiles/business/data" class="astro-ZC2BGLHS">Business data</a></li>
    </ul>
  </div>` })}
`;
});

const $$file$3 = "C:/work/killman/rpg-store/src/pages/tests/index.astro";
const $$url$3 = "/tests";

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const ALL = "__ALL__";

const $$Astro$8 = createAstro("C:/work/killman/rpg-store/src/tests/layouts/TestLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$TestLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$TestLayout;
  const { label, name, description } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(name, "data-testid")}${addAttribute(name === ALL || name === "" ? "test-all" : "test-item", "data-test")} class="test">
  <div class="label"><h2>${label}</h2></div>
  <div class="name">${name === ALL ? "All" : name}</div>
  <div class="description">${description}</div>
  ${renderSlot($$result, $$slots["action"])}
  ${renderSlot($$result, $$slots["result"])}
</div>`;
});

const $$Astro$7 = createAstro("C:/work/killman/rpg-store/src/tests/layouts/TestInLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$TestInLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$TestInLayout;
  const { label, name, description } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "TestLayout", $$TestLayout, { "label": label, "name": name, "description": description }, { "action": () => renderTemplate`${maybeRenderHead($$result)}<div>
    ${renderComponent($$result, "TestAction", null, { "name": name, "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "tests/components/TestAction", "client:component-export": "default" })}
  </div>`, "default": () => renderTemplate`${" "}`, "result": () => renderTemplate`<div>
    ${renderComponent($$result, "TestResult", null, { "name": name, "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "tests/components/TestResult", "client:component-export": "default" })}
  </div>` })}`;
});

const $$Astro$6 = createAstro("C:/work/killman/rpg-store/src/tests/layouts/ProgressInLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$ProgressInLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$ProgressInLayout;
  return renderTemplate`${renderComponent($$result, "TestLayout", $$TestLayout, { "label": "", "name": "", "description": "" }, { "action": () => renderTemplate`${maybeRenderHead($$result)}<div>
    ${renderComponent($$result, "ProgressBar", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "tests/components/ProgressBar", "client:component-export": "default" })}
  </div>`, "default": () => renderTemplate`${" "}`, "result": () => renderTemplate`<div>
    ${renderComponent($$result, "ProgressResultText", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "tests/components/ProgressResultText", "client:component-export": "default" })}
  </div>` })}`;
});

const $$Astro$5 = createAstro("C:/work/killman/rpg-store/src/tests/layouts/TestPageLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$TestPageLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$TestPageLayout;
  const { pageTitle, pageSuite, suite } = Astro2.props;
  return renderTemplate`

${renderComponent($$result, "MainTestLayout", $$MainTestLayout, { "pageTitle": pageTitle, "class": "astro-AF3OJE2C" }, { "default": () => renderTemplate`${renderComponent($$result, "TestSuite", null, { "pageSuite": pageSuite, "client:only": "solid-js", "client:component-hydration": "only", "class": "astro-AF3OJE2C", "client:component-path": "tests/components/TestSuite", "client:component-export": "default" })}${maybeRenderHead($$result)}<div class="tests astro-AF3OJE2C">
    ${suite.tests.map((test, index) => renderTemplate`${renderComponent($$result, "TestInLayout", $$TestInLayout, { "label": String(index + 1), "name": test.name, "description": test.description, "class": "astro-AF3OJE2C" })}`)}
  </div><hr class="astro-AF3OJE2C">${renderComponent($$result, "TestInLayout", $$TestInLayout, { "label": "ALL", "name": ALL, "description": "Run All Tests", "class": "astro-AF3OJE2C" })}${renderComponent($$result, "ProgressInLayout", $$ProgressInLayout, { "class": "astro-AF3OJE2C" })}` })}
`;
});

const select = (target, params) => new Promise((resolve) => {
  PubSub.subscribeOnce(msgResponse(apiSelect(target)), (msg, data) => {
    resolve(data);
  });
  PubSub.publish(msgRequest(apiSelect(target)), params);
});
const update = (target, data) => new Promise((resolve) => {
  PubSub.subscribeOnce(msgResponse(apiUpdate(target)), () => {
    resolve();
  });
  PubSub.publish(msgRequest(apiUpdate(target)), data);
});

const API_URL = "/api/rpg" + "/tiles";
class Data {
  tiles;
  rpgTiles;
  async init() {
    {
      this.tiles = await select(T.tiles);
    }
    this.subscribe();
  }
  tileIds() {
    return this.tiles.map((tile) => tile.id);
  }
  subscribe() {
    PubSub.subscribe(M.lastActiveTileId, async (_msg, lastActiveTileId) => {
      if (this.rpgTiles.lastActiveTileId !== lastActiveTileId) {
        this.rpgTiles.lastActiveTileId = lastActiveTileId;
        await fetch(`${API_URL}/rpgTiles.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.rpgTiles)
        });
      }
    });
  }
  publish() {
    PubSub.publish(M.initTiles, this.tiles);
    PubSub.publish(M.lastActiveTileId, this.rpgTiles.lastActiveTileId);
  }
}
const data = new Data();

const dataSuite = {
  tests: [
    {
      name: "lastActiveTileId",
      description: "Last active tile ID",
      run: async () => {
        PubSub.publish(M.lastActiveTileId, "Occupation");
      },
      expect: () => data.rpgTiles.lastActiveTileId === "Occupation"
    }
  ],
  beforeAll: async () => {
    await data.init();
  },
  before: async () => {
    data.rpgTiles = { lastActiveTileId: "Race" };
  }
};

const $$Astro$4 = createAstro("C:/work/killman/rpg-store/src/pages/tests/projects/rpg/tiles/business/data.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Data = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Data;
  return renderTemplate`${renderComponent($$result, "TestPageLayout", $$TestPageLayout, { "pageTitle": "Unit tests: business.data", "pageSuite": "tests/projects/rpg/tiles/business/data", "suite": dataSuite })}`;
});

const $$file$2 = "C:/work/killman/rpg-store/src/pages/tests/projects/rpg/tiles/business/data.astro";
const $$url$2 = "/tests/projects/rpg/tiles/business/data";

const _page9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Data,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const tileIdsAtom = atom([]);
const tilesMap = map();
const lastActiveTileIdAtom = atom();
const activeTileIdsAtom = computed(
  [tileIdsAtom, lastActiveTileIdAtom],
  (tileIds, lastActiveTileId) => tileIds.slice(0, tileIds.indexOf(lastActiveTileId) + 1)
);
const setLastActive = (id) => lastActiveTileIdAtom.set(id);
PubSub.subscribeOnce(M.initTiles, (_msg, tiles) => {
  tiles.forEach((tile) => {
    tilesMap.setKey(tile.id, tile);
  });
  tileIdsAtom.set(tiles.map((tile) => tile.id));
  setLastActive(tiles[0].id);
  lastActiveTileIdAtom.listen((lastActiveTileId) => {
    PubSub.publish(M.lastActiveTileId, lastActiveTileId);
  });
});
PubSub.subscribe(M.lastActiveTileId, (_msg, lastActiveTileId) => {
  if (lastActiveTileIdAtom.get() !== lastActiveTileId) {
    lastActiveTileIdAtom.set(lastActiveTileId);
  }
});

const tilesSuite = {
  tests: [
    {
      name: "lastActiveTileId",
      description: "Last active tile ID",
      run: async () => {
        PubSub.publish(M.lastActiveTileId, "Occupation");
      },
      expect: () => lastActiveTileIdAtom.get() === "Occupation"
    },
    {
      name: "activeTileIds",
      description: "Active tile IDs sdfsd f sdf sd fsd fsd f sd fsd f sd fsd fsd fsd fsd f sdf sd fsd f sd fsd fsd fsd f dfgd aaaaaaaaaaa bbbbbbbbbbbbb cccccccccc ddddddd ww eeeeeeeeeeeeeee ffffffffffffffff",
      run: async () => {
        PubSub.publish(M.lastActiveTileId, "Abilities");
      },
      expect: () => activeTileIdsAtom.get().length === 3
    }
  ],
  beforeAll: async () => {
    const tiles = [
      { id: "Race", name: "My Race" },
      { id: "Occupation", name: "My Occupation" },
      { id: "Abilities", name: "My Abilities" },
      { id: "Symbols", name: "My Symbols" }
    ];
    PubSub.publishSync(M.initTiles, tiles);
    PubSub.publishSync(M.lastActiveTileId, "Race");
  },
  before: async () => {
    PubSub.publishSync(M.lastActiveTileId, "Race");
  }
};

const $$Astro$3 = createAstro("C:/work/killman/rpg-store/src/pages/tests/projects/rpg/tiles/stores/tiles.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Tiles$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Tiles$1;
  return renderTemplate`${renderComponent($$result, "TestPageLayout", $$TestPageLayout, { "pageTitle": "Unit tests: stores.tiles", "pageSuite": "tests/projects/rpg/tiles/stores/tiles", "suite": tilesSuite })}`;
});

const $$file$1 = "C:/work/killman/rpg-store/src/pages/tests/projects/rpg/tiles/stores/tiles.astro";
const $$url$1 = "/tests/projects/rpg/tiles/stores/tiles";

const _page10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tiles$1,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro("C:/work/killman/rpg-store/src/projects/rpg/tiles/layouts/MainLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$MainLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { pageTitle } = Astro2.props;
  return renderTemplate`


  
    <meta charset="utf-8">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="viewport" content="width=device-width">
    <meta name="generator"${addAttribute(Astro2.generator, "content")}>
    <title>${pageTitle}</title>
  
  ${maybeRenderHead($$result)}<body class="astro-EVXPFODD">
    <div class="header astro-EVXPFODD">
      ${renderSlot($$result, $$slots["header"])}
    </div>
    <div class="content astro-EVXPFODD">
      ${renderSlot($$result, $$slots["content"])}
    </div>
  </body>`;
});

const $$Astro$1 = createAstro("C:/work/killman/rpg-store/src/projects/rpg/tiles/layouts/TileLayout.astro", "", "file:///C:/work/killman/rpg-store/");
const $$TileLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$TileLayout;
  return renderTemplate`

${maybeRenderHead($$result)}<div class="tile astro-4I5XZRAF">
  ${renderSlot($$result, $$slots["default"])}
</div>`;
});

let firstCall = true;
const initdb = async () => {
  if (firstCall) {
    switch ("supabase") {
      case "lowdb": {
        console.log("------ init lowdb --------");
        await import('./chunks/lowdb.e2d5f4b6.mjs');
        break;
      }
      case "supabase":
      default: {
        console.log("------ TILES init supabase --------");
        await import('./chunks/supabase.70dd4873.mjs');
        break;
      }
    }
    firstCall = false;
  }
};

const $$Astro = createAstro("C:/work/killman/rpg-store/src/pages/tiles.astro", "", "file:///C:/work/killman/rpg-store/");
const $$Tiles = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Tiles;
  await initdb();
  await data.init();
  const tileIds = data.tileIds();
  return renderTemplate`

${renderComponent($$result, "MainLayout", $$MainLayout, { "pageTitle": "RPG Store", "class": "astro-ZEHXUK5R" }, { "content": () => renderTemplate`${maybeRenderHead($$result)}<div class="astro-ZEHXUK5R">
    <div class="content astro-ZEHXUK5R">
      ${tileIds.map((id) => renderTemplate`${renderComponent($$result, "TileLayout", $$TileLayout, { "class": "astro-ZEHXUK5R" }, { "default": () => renderTemplate`${renderComponent($$result, "Tile", null, { "id": id, "client:only": "solid-js", "client:component-hydration": "only", "class": "astro-ZEHXUK5R", "client:component-path": "projects/rpg/tiles/components/Tile", "client:component-export": "default" }, { "default": () => renderTemplate`<div${addAttribute(("server" ) + " astro-ZEHXUK5R", "class")}></div>` })}` })}`)}
    </div>
  </div>`, "header": () => renderTemplate`<h1 class="astro-ZEHXUK5R">RPG Store</h1>` })}

${maybeRenderHead($$result)}
`;
});

const $$file = "C:/work/killman/rpg-store/src/pages/tiles.astro";
const $$url = "/tiles";

const _page11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tiles,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const getRandomInt = (max) => Math.floor(Math.random() * max);

async function get$7() {
  console.log("get count.json SSR", true);
  const count = getRandomInt(10);
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const _page12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$7
}, Symbol.toStringTag, { value: 'Module' }));

const jsonResponse = (body) => new Response(JSON.stringify(body), {
  status: 200,
  headers: {
    "Content-Type": "application/json"
  }
});

async function get$6() {
  const rpgCharacter = await select(T.rpgTarget);
  return jsonResponse(rpgCharacter);
}
async function post$4({ request }) {
  if (request.headers.get("Content-Type") === "application/json") {
    const rpgCharacter = await request.json();
    await update(T.rpgTarget, rpgCharacter);
    return await get$6();
  } else {
    return new Response(null, { status: 400 });
  }
}

const _page13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$6,
  post: post$4
}, Symbol.toStringTag, { value: 'Module' }));

async function get$5() {
  const properties = await select(T.rpgProperties);
  return new Response(JSON.stringify(properties), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
async function post$3({ request }) {
  if (request.headers.get("Content-Type") === "application/json") {
    const properties = await request.json();
    await update(T.rpgProperties, properties);
    const rpgCharacter = await select(T.rpgTarget);
    return jsonResponse(rpgCharacter);
  } else {
    return new Response(null, { status: 400 });
  }
}

const _page14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$5,
  post: post$3
}, Symbol.toStringTag, { value: 'Module' }));

async function get$4() {
  const theme = await select(T.uiTheme);
  return jsonResponse({ theme });
}
async function post$2({ request }) {
  if (request.headers.get("Content-Type") === "application/json") {
    const { theme } = await request.json();
    await update(T.uiTheme, theme);
    return await get$4();
  } else {
    return new Response(null, { status: 400 });
  }
}

const _page15 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$4,
  post: post$2
}, Symbol.toStringTag, { value: 'Module' }));

async function get$3({ params }) {
  const block = params.block;
  const rpgBlock = await select(
    T.rpgBlock,
    block
  );
  return jsonResponse(rpgBlock);
}
async function post$1({ params, request }) {
  const block = params.block;
  if (request.headers.get("Content-Type") === "application/json") {
    const data = await request.json();
    await update(T.rpgBlock, { type: block, ...data });
    const rpgCharacter = await select(T.rpgTarget);
    return jsonResponse(rpgCharacter);
  } else {
    return new Response(null, { status: 400 });
  }
}

const _page16 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$3,
  post: post$1
}, Symbol.toStringTag, { value: 'Module' }));

async function get$2({ params }) {
  const block = params.block;
  const rpgInfo = await select(T.rpgInfo, block);
  return jsonResponse(rpgInfo);
}

const _page17 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$2
}, Symbol.toStringTag, { value: 'Module' }));

async function get$1() {
  const rpgTiles = await select(T.rpgTiles);
  return new Response(JSON.stringify(rpgTiles), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
async function post({ request }) {
  if (request.headers.get("Content-Type") === "application/json") {
    const rpgCharacter = await request.json();
    await update(T.rpgTarget, rpgCharacter);
    return new Response("", {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } else {
    return new Response(null, { status: 400 });
  }
}

const _page18 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$1,
  post
}, Symbol.toStringTag, { value: 'Module' }));

async function get() {
  const tiles = await select(T.tiles);
  return new Response(JSON.stringify(tiles), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const _page19 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/builder/index.mdx', _page1],['src/pages/builder/BlockList.astro', _page2],['src/pages/builder/blocks/advantages.mdx', _page3],['src/pages/builder/blocks/equipments.mdx', _page4],['src/pages/builder/blocks/races.mdx', _page5],['src/pages/sample.mdx', _page6],['src/pages/board/index.astro', _page7],['src/pages/tests/index.astro', _page8],['src/pages/tests/projects/rpg/tiles/business/data.astro', _page9],['src/pages/tests/projects/rpg/tiles/stores/tiles.astro', _page10],['src/pages/tiles.astro', _page11],['src/pages/api/board/count.json.ts', _page12],['src/pages/api/rpg/builder/rpgCharacter.json.ts', _page13],['src/pages/api/rpg/builder/properties.json.ts', _page14],['src/pages/api/rpg/builder/theme.json.ts', _page15],['src/pages/api/rpg/builder/[block]Block.json.ts', _page16],['src/pages/api/rpg/builder/[block]Info.json.ts', _page17],['src/pages/api/rpg/tiles/rpgTiles.json.ts', _page18],['src/pages/api/rpg/tiles/tiles.json.ts', _page19],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/solid-js","clientEntrypoint":"@astrojs/solid-js/client.js","serverEntrypoint":"@astrojs/solid-js/server.js","jsxImportSource":"solid-js"}, { ssr: server_default$1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":[],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.a59dd997.css","assets/advantages.556af67d.css","assets/advantages.ad56316c.css","assets/index.f29b7ee6.css"],"scripts":[{"type":"external","value":"hoisted.eabb78d0.js"}],"routeData":{"route":"/builder","type":"page","pattern":"^\\/builder\\/?$","segments":[[{"content":"builder","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/builder/index.mdx","pathname":"/builder","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/builder/blocklist","type":"page","pattern":"^\\/builder\\/BlockList\\/?$","segments":[[{"content":"builder","dynamic":false,"spread":false}],[{"content":"BlockList","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/builder/BlockList.astro","pathname":"/builder/BlockList","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/advantages.ad56316c.css","assets/index.a59dd997.css","assets/advantages.556af67d.css","assets/index.f29b7ee6.css"],"scripts":[{"type":"external","value":"hoisted.eabb78d0.js"}],"routeData":{"route":"/builder/blocks/advantages","type":"page","pattern":"^\\/builder\\/blocks\\/advantages\\/?$","segments":[[{"content":"builder","dynamic":false,"spread":false}],[{"content":"blocks","dynamic":false,"spread":false}],[{"content":"advantages","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/builder/blocks/advantages.mdx","pathname":"/builder/blocks/advantages","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/advantages.ad56316c.css","assets/index.a59dd997.css","assets/advantages.556af67d.css","assets/index.f29b7ee6.css"],"scripts":[{"type":"external","value":"hoisted.eabb78d0.js"}],"routeData":{"route":"/builder/blocks/equipments","type":"page","pattern":"^\\/builder\\/blocks\\/equipments\\/?$","segments":[[{"content":"builder","dynamic":false,"spread":false}],[{"content":"blocks","dynamic":false,"spread":false}],[{"content":"equipments","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/builder/blocks/equipments.mdx","pathname":"/builder/blocks/equipments","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/advantages.ad56316c.css","assets/index.a59dd997.css","assets/advantages.556af67d.css","assets/index.f29b7ee6.css"],"scripts":[{"type":"external","value":"hoisted.eabb78d0.js"}],"routeData":{"route":"/builder/blocks/races","type":"page","pattern":"^\\/builder\\/blocks\\/races\\/?$","segments":[[{"content":"builder","dynamic":false,"spread":false}],[{"content":"blocks","dynamic":false,"spread":false}],[{"content":"races","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/builder/blocks/races.mdx","pathname":"/builder/blocks/races","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/sample.c40bc159.css"],"scripts":[{"type":"external","value":"hoisted.331e226a2.js"}],"routeData":{"route":"/sample","type":"page","pattern":"^\\/sample\\/?$","segments":[[{"content":"sample","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sample.mdx","pathname":"/sample","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.2b5f5430.css","assets/index.a59dd997.css","assets/index.f29b7ee6.css"],"scripts":[{"type":"external","value":"hoisted.fb0428a2.js"}],"routeData":{"route":"/board","type":"page","pattern":"^\\/board\\/?$","segments":[[{"content":"board","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/board/index.astro","pathname":"/board","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.a59dd997.css","assets/index.4c4b1a6a.css","assets/index.9299a98a.css"],"scripts":[],"routeData":{"route":"/tests","type":"page","pattern":"^\\/tests\\/?$","segments":[[{"content":"tests","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tests/index.astro","pathname":"/tests","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.a59dd997.css","assets/index.4c4b1a6a.css","assets/data.4c3d58e1.css","assets/index.f29b7ee6.css"],"scripts":[],"routeData":{"route":"/tests/projects/rpg/tiles/business/data","type":"page","pattern":"^\\/tests\\/projects\\/rpg\\/tiles\\/business\\/data\\/?$","segments":[[{"content":"tests","dynamic":false,"spread":false}],[{"content":"projects","dynamic":false,"spread":false}],[{"content":"rpg","dynamic":false,"spread":false}],[{"content":"tiles","dynamic":false,"spread":false}],[{"content":"business","dynamic":false,"spread":false}],[{"content":"data","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tests/projects/rpg/tiles/business/data.astro","pathname":"/tests/projects/rpg/tiles/business/data","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.a59dd997.css","assets/index.4c4b1a6a.css","assets/data.4c3d58e1.css","assets/index.f29b7ee6.css"],"scripts":[],"routeData":{"route":"/tests/projects/rpg/tiles/stores/tiles","type":"page","pattern":"^\\/tests\\/projects\\/rpg\\/tiles\\/stores\\/tiles\\/?$","segments":[[{"content":"tests","dynamic":false,"spread":false}],[{"content":"projects","dynamic":false,"spread":false}],[{"content":"rpg","dynamic":false,"spread":false}],[{"content":"tiles","dynamic":false,"spread":false}],[{"content":"stores","dynamic":false,"spread":false}],[{"content":"tiles","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tests/projects/rpg/tiles/stores/tiles.astro","pathname":"/tests/projects/rpg/tiles/stores/tiles","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.a59dd997.css","assets/tiles.db41faf9.css","assets/index.f29b7ee6.css"],"scripts":[{"type":"external","value":"hoisted.331e226a.js"}],"routeData":{"route":"/tiles","type":"page","pattern":"^\\/tiles\\/?$","segments":[[{"content":"tiles","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tiles.astro","pathname":"/tiles","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/board/count.json","type":"endpoint","pattern":"^\\/api\\/board\\/count\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"board","dynamic":false,"spread":false}],[{"content":"count.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/board/count.json.ts","pathname":"/api/board/count.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/rpg/builder/rpgcharacter.json","type":"endpoint","pattern":"^\\/api\\/rpg\\/builder\\/rpgCharacter\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"rpg","dynamic":false,"spread":false}],[{"content":"builder","dynamic":false,"spread":false}],[{"content":"rpgCharacter.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/rpg/builder/rpgCharacter.json.ts","pathname":"/api/rpg/builder/rpgCharacter.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/rpg/builder/properties.json","type":"endpoint","pattern":"^\\/api\\/rpg\\/builder\\/properties\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"rpg","dynamic":false,"spread":false}],[{"content":"builder","dynamic":false,"spread":false}],[{"content":"properties.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/rpg/builder/properties.json.ts","pathname":"/api/rpg/builder/properties.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/rpg/builder/theme.json","type":"endpoint","pattern":"^\\/api\\/rpg\\/builder\\/theme\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"rpg","dynamic":false,"spread":false}],[{"content":"builder","dynamic":false,"spread":false}],[{"content":"theme.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/rpg/builder/theme.json.ts","pathname":"/api/rpg/builder/theme.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/rpg/builder/[block]","type":"endpoint","pattern":"^\\/api\\/rpg\\/builder\\/([^/]+?)Block\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"rpg","dynamic":false,"spread":false}],[{"content":"builder","dynamic":false,"spread":false}],[{"content":"block","dynamic":true,"spread":false},{"content":"Block.json","dynamic":false,"spread":false}]],"params":["block"],"component":"src/pages/api/rpg/builder/[block]Block.json.ts","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/rpg/builder/[block]","type":"endpoint","pattern":"^\\/api\\/rpg\\/builder\\/([^/]+?)Info\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"rpg","dynamic":false,"spread":false}],[{"content":"builder","dynamic":false,"spread":false}],[{"content":"block","dynamic":true,"spread":false},{"content":"Info.json","dynamic":false,"spread":false}]],"params":["block"],"component":"src/pages/api/rpg/builder/[block]Info.json.ts","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/rpg/tiles/rpgtiles.json","type":"endpoint","pattern":"^\\/api\\/rpg\\/tiles\\/rpgTiles\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"rpg","dynamic":false,"spread":false}],[{"content":"tiles","dynamic":false,"spread":false}],[{"content":"rpgTiles.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/rpg/tiles/rpgTiles.json.ts","pathname":"/api/rpg/tiles/rpgTiles.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/rpg/tiles/tiles.json","type":"endpoint","pattern":"^\\/api\\/rpg\\/tiles\\/tiles\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"rpg","dynamic":false,"spread":false}],[{"content":"tiles","dynamic":false,"spread":false}],[{"content":"tiles.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/rpg/tiles/tiles.json.ts","pathname":"/api/rpg/tiles/tiles.json","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","C:/work/killman/rpg-store/src/projects/rpg/builder/layouts/BuilderLayout.astro":"chunks/BuilderLayout.97769b25.mjs","C:/work/killman/rpg-store/src/projects/rpg/tiles/layouts/MdxLayout.astro":"chunks/MdxLayout.739e2dda.mjs","C:/work/killman/rpg-store/src/projects/rpg/builder/layouts/FormLayout.astro":"chunks/FormLayout.901608f8.mjs","C:/work/killman/rpg-store/src/projects/rpg/tiles/db/lowdb.ts":"chunks/lowdb.e2d5f4b6.mjs","C:/work/killman/rpg-store/src/projects/rpg/tiles/db/supabase.ts":"chunks/supabase.70dd4873.mjs","C:/work/killman/rpg-store/src/projects/rpg/builder/business/db/lowdb.ts":"chunks/lowdb.a044d5a4.mjs","C:/work/killman/rpg-store/src/projects/rpg/builder/business/db/supabase.ts":"chunks/supabase.500af40d.mjs","@widgets/CardLink":"CardLink.a023025b.js","@components/BlockDisplay":"BlockDisplay.60c6820f.js","projects/board/components/Board":"Board.2222d1b5.js","projects/rpg/tiles/components/Tile":"Tile.1217e201.js","@input/StringInput":"StringInput.5d928b91.js","@portal/components/PointDisplay":"PointDisplay.bb5209db.js","@portal/components/races/RaceSelector":"RaceSelector.f8782104.js","@portal/components/MoneyDisplay":"MoneyDisplay.5f8c622b.js","@portal/components/properties/NameInput":"NameInput.b75d7f1d.js","@widgets/form/ThemeSelector":"ThemeSelector.edce2734.js","@widgets/form/FormControls":"FormControls.1a31eb7a.js","tests/components/TestSuite":"TestSuite.1bd76e64.js","tests/components/TestAction":"TestAction.68c22c57.js","tests/components/TestResult":"TestResult.249de5b6.js","tests/components/ProgressBar":"ProgressBar.9de0a997.js","tests/components/ProgressResultText":"ProgressResultText.75ca46be.js","@astrojs/solid-js/client.js":"client.bbf3da8f.js","/astro/hoisted.js?q=0":"hoisted.fb0428a2.js","/astro/hoisted.js?q=1":"hoisted.331e226a.js","/astro/hoisted.js?q=2":"hoisted.331e226a2.js","/astro/hoisted.js?q=3":"hoisted.eabb78d0.js","C:/work/killman/rpg-store/src/projects/rpg/builder/business/blocks/properties/store.ts":"chunks/store.711ffaa4.js","C:/work/killman/rpg-store/src/projects/rpg/builder/business/store/target.ts":"chunks/target.62526ec1.js","C:/work/killman/rpg-store/src/projects/rpg/builder/business/store/properties.ts":"chunks/properties.9f5dff7b.js","C:/work/killman/rpg-store/src/projects/rpg/builder/business/blocks/races/store.ts":"chunks/store.aafa45f5.js","C:/work/killman/rpg-store/src/pubsub/log.ts":"chunks/log.7c671722.js","C:/work/killman/rpg-store/src/projects/rpg/builder/business/blocks/races/transport.ts":"chunks/transport.06034d7c.js","C:/work/killman/rpg-store/src/projects/rpg/builder/business/blocks/equipments/store.ts":"chunks/store.3cd49487.js","C:/work/killman/rpg-store/src/projects/rpg/builder/business/blocks/equipments/transport.ts":"chunks/transport.76f54bc1.js","C:/work/killman/rpg-store/src/projects/rpg/builder/business/blocks/advantages/store.ts":"chunks/store.ee8afe48.js","C:/work/killman/rpg-store/src/projects/rpg/builder/business/blocks/advantages/transport.ts":"chunks/transport.b3a39c99.js","C:/work/killman/rpg-store/src/projects/rpg/builder/business/transport/properties.ts":"chunks/properties.7f29abb6.js","C:/work/killman/rpg-store/src/projects/rpg/builder/ui/stores/blockAtom.ts":"chunks/blockAtom.f2b00dc8.js","astro:scripts/before-hydration.js":""},"assets":["/assets/advantages.556af67d.css","/assets/advantages.ad56316c.css","/assets/data.4c3d58e1.css","/assets/index.9299a98a.css","/assets/index.4c4b1a6a.css","/assets/index.2b5f5430.css","/assets/sample.c40bc159.css","/assets/tiles.db41faf9.css","/assets/index.a59dd997.css","/BlockDisplay.60c6820f.js","/Board.2222d1b5.js","/CardLink.a023025b.js","/client.bbf3da8f.js","/favicon.svg","/FormControls.1a31eb7a.js","/hoisted.331e226a.js","/hoisted.331e226a2.js","/hoisted.eabb78d0.js","/hoisted.fb0428a2.js","/MoneyDisplay.5f8c622b.js","/NameInput.b75d7f1d.js","/PointDisplay.bb5209db.js","/ProgressBar.9de0a997.js","/ProgressResultText.75ca46be.js","/RaceSelector.f8782104.js","/StringInput.5d928b91.js","/TestAction.68c22c57.js","/TestResult.249de5b6.js","/TestSuite.1bd76e64.js","/ThemeSelector.edce2734.js","/Tile.1217e201.js","/assets/index.f29b7ee6.css","/chunks/block.6d382636.js","/chunks/blockAtom.f2b00dc8.js","/chunks/businessStore.48b35e1d.js","/chunks/Button.2795326a.js","/chunks/ButtonBase.d1edc7cf.js","/chunks/ChipDisplay.a9069ccb.js","/chunks/data.54d6c0b9.js","/chunks/gridSideLength.52159dfa.js","/chunks/index.3254e3ac.js","/chunks/index.341d0d08.js","/chunks/index.5ce26aac.js","/chunks/index.69c0b923.js","/chunks/index.a734dd66.js","/chunks/index.e3b0c442.50a188a4.js","/chunks/info.c6491951.js","/chunks/log.7c671722.js","/chunks/preload-helper.1de719f8.js","/chunks/properties.7f29abb6.js","/chunks/properties.9f5dff7b.js","/chunks/pubsub.e9085963.js","/chunks/sign.7336ae09.js","/chunks/solid.9c01704e.js","/chunks/startup.c105fbd4.js","/chunks/stateAtom.e5f42f76.js","/chunks/store.39ac366f.js","/chunks/store.3cd49487.js","/chunks/store.711ffaa4.js","/chunks/store.aafa45f5.js","/chunks/store.ee8afe48.js","/chunks/style.c765070e.js","/chunks/target.62526ec1.js","/chunks/tests.76ac8d03.js","/chunks/theme.fdd64ba5.js","/chunks/tiles.ac5985dc.js","/chunks/transport.06034d7c.js","/chunks/transport.76f54bc1.js","/chunks/transport.b3a39c99.js","/chunks/web.0627afa2.js"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { Theme$1 as T, T as a, createComponent as b, createAstro as c, addAttribute as d, style as e, renderSlot as f, renderComponent as g, msgRequest as h, handler, msgResponse as i, apiSelect as j, apiUpdate as k, maybeRenderHead as m, renderTemplate as r, select as s };
