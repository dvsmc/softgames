# Softgames Assignment

## Running project

### Requirements

Node 22+ with corepack/yarn 4+ enabled.

`yarn` - install dependencies

### Local

`yarn dev` - start local dev server on `localhost:4000`

### Production

`yarn build` - build production server

`yarn preview` - preview production server

### Misc

`yarn lint` - show linting and type errors
`yarn lint:fix` - fix auto-fixable code styling issues
`yarn test` - run tests

## Tech stack

- TypeScript - type safety
- Pixi.js - 2d rendering
- Preact - UI library (Smaller alternative to React)
- gsap - animation library
- Vite - build tool
- Vitest - unit tests
- Oxlint, Oxfmt, Biome - fast code syntax checkers, formatters (Alternatives to Eslint + Prettier with ~90% compatibility)

## Intro

- Split the demos in their own folders for more modular approach.
- Added simple UI using TSX just to combine Pixi and React for demo purposes, that allows switching between demos.
- Added very simple unit test for UI just to initialize a testing library and show how it works.
- Linters, formatters, usual config and dot files for proper project setup.

## Coding standards

- Usually would prefer functional code, pure, stateless functions, no side-effects, but not necessarily, as in Pixi case its okay to have OOP, classes, scenes. Have also written a Pixi.js game with ECS, without a single class, preferring composition over inheritance.
- DRY (dont-repeat-yourself) + WET (write-everything-twice) - its okay to repeat things twice, to reduce small unnecessary abstractions, makes code easier to maintain, but writing 3+ times, would require thinking already about some abstraction, commonization.
- KISS (keep-it-simple,-stupid) + YAGNI (you-ain't-gonna-need-it) - keep code simple, dont do premature code optimizations, dont try to predict arbitrary requirements, speculate how things could evolve, keep only what you need, make it easy to refactor, throw out etc. This can reduce overall code overhead, and make it very simple to work with it.
- Linters, formatters, and strict types. Prevents type errors early on and catches common code smells, potential performance issues, race conditions, unreadable code.

## Future considerations

- If `main.ts` bootstrap file would grow significancy, would split it into multiple files, e.g. `src/core/createPixiApp.ts`, `src/core/loadPixiAssets.ts` or something similar.
- Similar thing would do to asset loading, if it gets repeated too much, more assets, background loading, etc., would create helper utils to handle assets. Also would consider bundling assets with Pixi assetpack.
- React vs Pixi for UI - Could use Pixi for UI, make fancy buttons with nine-slice sprites etc., if we want to have more fancy effects on UI, and make it responsive, introduce better global resizing and layouting utilities for nested UIs etc. For simpler UIs React/Preact with CSS layout could be sufficient, like in this demo.
- If UI state would grow more complex and would need to share state between components, Pixi, React, would use `Zustand` for state management (or `Mobx`).
- If demos would grow significancy in their size, would load them asynchronously as separate bundles, when clicking on opening demo, e.g. `() => (await import("src/demos/demo/createDemo.ts")).createDemo`, and then caching the created demo, to re-use, if switching between them.
- **Tests**
    - In real-life project would add few more tests for UI and a lot more for game (demos) logic. Have been used to get 100% code coverage in unit/integration tests + would add storybook + visual tests for a bigger project.
    - For current Ui test we could move initialization and destroy to `beforeEach`, `afterEach`, and reuse component, but didn't feel necessary.
    - Note oxlint `typeAware` is still a WIP and falsely reports vitest jsdom types as not found. As fallback `tsc` reports correctly, so we can safely assume its correct.
- **Ace of Shadows**:
    - Would definitely reduce the stack logic for card stacks, and try to get away without `.cardsLayer`, `.stacks`, could experiment more with zIndex and position, change zIndex very dynamically live, as a fake Z axis (like in 3d space).
    - Should handle card animation during resize better, but thought not necessary now.
- **Magic Words**:
    - Would add local fallback emojis to missing ones, as I saw in response texts some emojis were missing, so combining emojis from API and local assets. Same thing for avatars (Sheldon) as misconfigured url with port :82, we can try to fall back to local avatar, for now fall back to just initials (S).
    - Would revisit caching and optimizing, if lets say there are more participants, dialogues, emojis, in more real world usage. Currently we draw the chat instantly and textures load asynchronously. Also for now there is single richTextUtils instance per MagicWords scene, that has internal cache for texts/tokens and is prop drilled down to all RichText components, didn't want to make cache global/singleton.
- **Phoenix Flame**:
    - If amount of particles and particle data would increase a lot, would store all data in single `Float32Array` with indices for particle data. Objects are not that performant, and can cause GC spikes.
    - Would also try to do same or even better quality effect using just shaders - noise + displacement + color gradient.
    - If shaders or blend modes would hit performance on some devices, would fallback to colored sprite-sheets, maybe even just animated sprite-sheets.
