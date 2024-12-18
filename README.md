# discord-bot

`discord-bot` is a Discord bot written in JavaScript using the Discord.js library. It helps manage assignments, delete messages, and much more.

## Features

- Add an assignment
- Delete an assignment
- Update an assignment
- Delete messages
- Display bot status
- Command documentation

## Prerequisites

- [Node.js](https://nodejs.org/en)
- [Discord Developer Portal](https://discord.com/developers/applications) to obtain a bot token

## Installation

1. Clone the repository :

```sh
git clone https://github.com/Jul0P/discord-bot.git
cd discord-bot
```

2. Install dependencies :

```sh
npm install
pnpm install
yarn install
bun install
```

3. Rename the `.env.example` file to `.env` :

```sh
cp .env.example .env
```

4. Open the `.env` file and add your bot token :

```properties
TOKEN=your-discord-bot-token
```

## Usage

1. Invite the bot to your Discord server using the invitation link generated from the [Discord Developer Portal](https://discord.com/developers/applications)

2. Run the project in development mode with `nodemon` :

```sh
npm run dev
pnpm run dev
yarn dev
bun dev
```

3. Build the project:

```sh
npm run build
pnpm run build
yarn build
bun build
```

4. Run the project in production mode :

```sh
npm start
pnpm start
yarn start
bun start
```

## Dependencies

- `discord.js` : A powerful library for interacting with the Discord API
- `dotenv` : Loads environment variables from a `.env` file
- `nodemon` : Automatically restart the server when changes are detected
