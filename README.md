# Jokes Discord Bot - Flyde Example

This is a simple Discord bot using [Flyde](https://www.flyde.dev) and [Discord.js](https://discord.js.org/).
It exposes a "/joke" command that will send a random joke (using https://jokeapi.dev/) to the channel where the command was sent.

This project implements a convention over configuration approach, where the bot will automatically load all the commands in the `commands` folder. Each command is a folder containing:

- a `config.json` file, conforming to Discord's slash command schema
- A Flyde based and a `Handler.flyde` file, containing the command's logic completely visual!

### Prerequisites

- Node 16+
- [pnpm](https://pnpm.io/) - `npm install -g pnpm`
- [Flyde VSCode extension](https://marketplace.visualstudio.com/items?itemName=flyde.flyde-vscode)
- A Discord bot token - [Discord Developer Portal](https://www.writebots.com/discord-bot-token/)

## Running locally

1. Rename `.env.example` to `.env` and fill in the `DISCORD_TOKEN` variable with your bot token
2. `pnpm install`
3. `pnpm run dev`
