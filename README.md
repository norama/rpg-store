# RPG Store

This is an experimental project for building RPG characters - or some other configurable objects - based on highly customizable forms
with corresponding documentation. The idea is that game masters / administrators could define configuration pages with embedded forms
without programming knowledge, while programmers would implement the specified widgets.

## Architecture

The application is written in the [Astro](https://astro.build/) framework making use of effective sever side rendering as configuration pages
are documentation oriented and client logic is fairly simple.

Pages are written in [MDX format](https://mdxjs.com/) whithout programming, including placeholders for interactive input widgets with business logic
specifications. Hence the structure and descriptive content can be maintained without programming.

Data is stored by [Nano Stores](https://github.com/nanostores/nanostores) and directly referenced by business widgets.
Business widgets are pure logical widgets delegating data to design widgets for display. Design widgets receive data in props and have
no reference to the store, data changes are propagated to their parent business widgets.

The form frame is responsible for the data synchronization with the server, sending data from the store to the API endpoints.
Commmunication between the store and the API proceeds through [PubSubJS](https://github.com/mroderick/PubSubJS), an event based messaging library.

This layered architecture enables business administrators, business logic programmers and UI component designers working together but
independently. Moreover, components are independently testable and replacable, even can be written / rewritten using different front-end frameworks
thanks to the [Astro](https://astro.build/) island architecture. Current widgets are written in [SolidJS](https://www.solidjs.com/).

Backend is currently [Supabase](https://supabase.com/) but my plan is to move to [Firestore](https://firebase.google.com/docs/firestore) because
its flexible NoSQL approach seems to be more suitable for this domain.

## Demo

The application is deployed on Vercel [here](https://rpg-store.vercel.app/builder).
Note that the app is in a work-in-progress state and this deployment currently serves for internal testing.

# Astro Starter Kit: Minimal

```
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from thoot of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
