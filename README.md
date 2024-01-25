# Ambaic Realms

## this is an unfinished casino game prototype and testbed for mobile and web. [Ambaic.com](https://ambaic.com/)

## Explanation

It utilizes capacitorjs and connects to supabase on the backend directly (no api server aside from supabases REST api for postgres) interacting with postgres.  in order to properly spin the wheel you'll need to create an account with an email then refresh.  **emails aren't verified so just choose a fake one.**

There's a lot of unfinished stuff here, but there's also a lot of cool stuff.

### ./client

This is where you'll find everything pertaining to useful client side code.  you'll need a [client/src/.env](client/src/.env) that holds these lines:
```
VITE_PUBLIC_SUPABASE_URL=https://*****.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=*****
VITE_PUBLIC_DOMAIN=http://localhost:5173
VITE_PUBLIC_API_URL=http://localhost:3001
```

ask and I'll provide the public url and anon keys but since this repo is public I'm not putting the file in.  This project is unfinished so there're some inefficiencies in how assets are loaded.

The button texture is generated from HTML [index.html](client/src/index.html#L235) in Button.load [SlotScreen.ts](client/src/js/core/levels/SlotScreen.ts#L22).  The DOM holds the source of the texture of the button and allows us to get text onto a 3D model.  It's nice because we can do our designs in html + css.  It's bad because it takes time to process it client side.  there are obvious fixes but none I'll do right now.

The important logic is held in the Zustand based stores, one of them being the [User.ts](client/src/js/systems/User.ts).  combined with typescript this allows us to do a global async state management with multiple subscribers.


### ./server

Since the client hits the database (Supabase) directly the server directory is not used much anymore at this stage.  The main exception there is that it holds [sqlStuff](server/sqlStuff), all of the important sql commands are located there and they're used to set up the database.
