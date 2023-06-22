import assert from "assert";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands } from "./load-commands.js";

import { loadFlow } from "@flyde/runtime";

const __filename = fileURLToPath(import.meta.url);

const currDir = join(__filename, "..");

import "dotenv/config";
import { fileURLToPath } from "url";
import { join } from "path";

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } = process.env;

assert(DISCORD_BOT_TOKEN, "Missing DISCORD_BOT_TOKEN env var");
assert(DISCORD_CLIENT_ID, "Missing DISCORD_CLIENT_ID env var");

console.log({ handerPath: commands[0].handlerPath });
const execute = await loadFlow(commands[0].handlerPath, currDir);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
    body: commands.map((command) => command.config),
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}

client.on("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find(
    (command) => command.config.name === interaction.commandName
  );

  if (!command) {
    console.error(`Command not found: ${interaction.commandName}`);
    await interaction.reply(
      "Oops, something went wrong. The command you tried to run doesn't exist."
    );
    return;
  }

  const execute = await loadFlow(command.handlerPath, currDir);

  const result = await execute({}, { extraContext: { interaction } }).result;
});

client.login(DISCORD_BOT_TOKEN);
