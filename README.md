# Jokes Discord Bot - Flyde Example

This is a simple Discord bot using [Flyde](https://www.flyde.dev) and [Discord.js](https://discord.js.org/).
It exposes a "/joke" command that will send a random joke (using https://jokeapi.dev/) to the channel where the command was sent.

This project implements a convention over configuration approach, where the bot will automatically load all the commands in the `commands` folder. Each command is a folder containing:

- a `config.json` file, conforming to Discord's slash command schema
- A Flyde based and a `Handler.flyde` file, containing the command's logic completely visual!

This example comes with 2 commands:

1. `/joke` - Sends a random joke to the channel where the command was sent
2. `/ping` - Sends a "pong" message to the channel where the command was sent

## Running locally

### Prerequisites

- Node 16+
- [pnpm](https://pnpm.io/) - `npm install -g pnpm`
- The [Flyde VSCode extension](https://marketplace.visualstudio.com/items?itemName=flyde.flyde-vscode)
- A Discord bot token - [See guide](https://www.writebots.com/discord-bot-token/)

### Steps

1. Rename `.env.example` to `.env`
2. Set your discord bot token and client ID in the `.env` file. [See this guide](https://www.writebots.com/discord-bot-token/)
3. `pnpm install`
4. `pnpm run dev`

## Adding a new command

1. run `pnpm run new-command`
2. Follow the instructions
3. Once the command folder is created, edit the `Handler.flyde` flow using the Flyde VSCode extension as you wish. [See the Flyde docs](https://www.flyde.dev/docs) for more info.
4. Restart the bot
5. Done!

## Deployment

As this is a regular Node.js project, you can deploy it to any Node.js hosting service. We've tested it on [Railway](https://railway.app) and it works great!
