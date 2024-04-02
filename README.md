## Fullstack Discord Clone: Next.js 13, React, Socket.io, tailwind, shadcn, zustand, tanstack/query, Mongoose, MongoDB, Clerk Auth, Uploadthing

### Live Website
> [https://discord-clone-next13.up.railway.app/](https://discord-clone-next13.up.railway.app/)

### Features:

- Real-time messaging using Socket.io
- Send attachments as messages using UploadThing
- Delete & Edit messages in real time for all users
- Create Text, Audio and Video call Channels
- 1:1 conversation between members
- 1:1 video calls between members
- Member management (Kick, Role change Guest / Moderator)
- Unique invite link generation & full working invite system
- Infinite loading for messages in batches of 10 (tanstack/query)
- Server creation and customization
- Real-time updates with tanstack/query
- Beautiful UI using TailwindCSS and ShadcnUI
- Full responsivity and mobile UI
- Light / Dark mode
- State management with zustand
- Websocket fallback: Polling with alerts
- ODM Mongoose
- MongoDB database
- Authentication with Clerk


### Requirements

**Node version ^18.3.x**

### Cloning the repository

```shell
git clone https://github.com/meetulr/discord-clone-Next13.git

# with ssh
git clone git@github.com:meetulr/discord-clone-Next13.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=


MONGODB_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=

WEBHOOK_SECRET=
```

### Start the app

In development mode:

```shell
npm run dev
```

In production mode:

```shell
# First, build the app
npm run build

# To run the app
node /.next/standalone/server.js
```

*Since we're using next [`standalone`](https://nextjs.org/docs/app/api-reference/next-config-js/output) config*

### Using Docker

In development mode:

```shell
# First, build the dev image
docker build -t next-app:dev --target dev .

# To run a container using this image
docker run -p 3000:3000 -v .:/app --env-file .env next-app:dev
# provide port mapping, volume mount, and env variables
```

In Production mode:

```shell
# First, build the prod image
docker build -t next-app:prod --target prod .

# To run a container using this image
docker run -p 3000:3000 --env-file .env next-app:prod
# provide port mapping, and env variables
```

### Using Docker Compose

In development mode:

```shell
# First, build the dev image
docker-compose -f docker-compose.dev.yml build

# To run a container using this image
docker-compose -f docker-compose.dev.yml up

# Or, build and run with a single command
docker-compose -f docker-compose.dev.yml up --build
```

In production mode:

```shell
# First, build the prod image
docker-compose build

# To run a container using this image
docker-compose up

# Or, build and run with a single command
docker-compose up --build
```
