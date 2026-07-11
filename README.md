# Pokegachi

A gacha-style virtual pet game where you roll for Pokémon, raise them, and battle. Built with React, TypeScript, and Vite, using Supabase for auth/storage and the [PokeAPI](https://pokeapi.co/) for Pokémon data.

## Gameplay

- **Register / Login** — create an account (Supabase Auth) and get a starting currency balance.
- **First Pokémon** — roll for your starter right after registering.
- **Home** — view your party (up to 6 Pokémon) and navigate to other screens.
- **Pokémon** — inspect a Pokémon, pet it, feed it, sell it, or send it to battle.
- **Food** — feed berries to a Pokémon to gain 10 EXP; reaching 100 EXP evolves it into its next form (via PokeAPI's evolution chain).
- **Battle** — answer a trivia question (from [Open Trivia DB](https://opentdb.com/)) against a random opposing Pokémon; a correct answer wins coins.
- **Store** — spend coins on berries or roll for a new random Pokémon.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) for client-side routing
- [Supabase](https://supabase.com/) for authentication and the Postgres database
- [nes.css](https://nostalgic-css.github.io/NES.css/) for the retro 8-bit UI styling
- [PokeAPI](https://pokeapi.co/) for Pokémon names, sprites, and evolutions
- [Open Trivia DB](https://opentdb.com/) for battle trivia questions
- [Vitest](https://vitest.dev/) for tests

## Getting started

### Prerequisites

- Node.js
- A [Supabase](https://supabase.com/) project

### Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root with your Supabase project credentials:

   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Set up the database tables in Supabase (see `src/lib/supabase/README.md` for schema notes). The app expects:
   - `user` — `auth_id`, `email`, `currency`
   - `pokemon` — `pokemonid`, `auth_id`, `name`, `sprite`, `experience`
   - `food` — `auth_id`, `name`, `amount`

4. Run the dev server:

   ```sh
   npm run dev
   ```

## Scripts

| Command           | Description                       |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start the Vite dev server          |
| `npm run build`    | Type-check and build for production|
| `npm run preview`  | Preview the production build       |
| `npm run lint`     | Run ESLint                         |
| `npm run test`     | Run tests with Vitest              |

## Project structure

```
src/
  components/   Shared UI components (Button, etc.)
  lib/          Supabase client, PokeAPI/trivia/food helpers
  pages/        Route-level screens (Login, Home, Battle, Food, Store, ...)
  router.tsx    React Router route definitions
```