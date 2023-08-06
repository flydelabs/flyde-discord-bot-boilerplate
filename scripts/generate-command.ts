import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import prompts from "prompts";

import { fileURLToPath } from "url";
import { commands } from "./load-commands.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DiscordCommandData {
  name: string;
  description: string;
  options: DiscordCommandOption[];
}

export interface DiscordCommandOption {
  name: string;
  description?: string;
  type: DiscordCommandOptionType;
  required?: boolean;
}

export enum DiscordCommandOptionType {
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
}

async function promptCommandOption(
  existingOptions: DiscordCommandOption[]
): Promise<DiscordCommandOption> {
  const { name } = await prompts([
    {
      type: "text",
      name: "name",
      message: "What is the name of the option?",
    },
  ]);

  if (existingOptions.find((option) => option.name === name)) {
    throw new Error(`Option with name ${name} already exists`);
  }

  const { description, type, required } = await prompts([
    {
      type: "text",
      name: "description",
      message: "What is the description of the option?",
    },
    {
      type: "select",
      name: "type",
      message: "What is the type of the option?",
      choices: [
        { title: "String", value: DiscordCommandOptionType.STRING },
        { title: "Integer", value: DiscordCommandOptionType.INTEGER },
        { title: "Boolean", value: DiscordCommandOptionType.BOOLEAN },
      ],
    },
    {
      type: "confirm",
      name: "required",
      message: "Is the option required?",
    },
  ]);

  return {
    name,
    description,
    type,
    required,
  };
}

export async function promptCommandData(
  existingsCommands: DiscordCommandData[]
): Promise<DiscordCommandData> {
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "What is the name of the command?",
    validate: (name) => {
      if (!name) {
        return "Name cannot be empty";
      }
      if (name.includes(" ")) {
        return "Name cannot have spaces";
      }
      return true;
    },
  });

  if (existingsCommands.find((command) => command.name === name)) {
    throw new Error(`Command with name ${name} already exists`);
  }

  const { description } = await prompts({
    type: "text",
    name: "description",
    message: "What is the description of the command?",
  });

  // ask for options until the user stops
  const options: DiscordCommandOption[] = [];
  // while (true) {
  //   const { addOption } = await prompts({
  //     type: "confirm",
  //     name: "addOption",
  //     message: `Would you like to add ${
  //       options.length === 0 ? "an" : "another"
  //     } option?`,
  //   });
  //   if (!addOption) {
  //     break;
  //   }
  //   try {
  //     const optionData = await promptCommandOption(options);
  //     options.push(optionData);
  //     console.log(
  //       `Added option ${optionData.name}. There are a total of ${options.length} options.`
  //     );
  //   } catch (e) {
  //     console.error(`Error adding command: ${e}`);
  //   }
  // }

  return {
    name,
    description,
    options,
  };
}

export async function generateCommandFile(
  commandData: DiscordCommandData
): Promise<void> {
  const { name, options } = commandData;

  const commandDir = path.join(__dirname, "../commands", name);
  const configPath = path.join(commandDir, "config.json");
  const handlerPath = path.join(commandDir, "Handler.flyde");

  mkdirSync(commandDir, { recursive: true });

  const configJson = JSON.stringify({ name, options }, null, 2);
  writeFileSync(configPath, configJson, "utf-8");

  // copy the template handler
  const templateHandlerPath = path.join(
    __dirname,
    "command-template",
    "Handler.flyde"
  );
  copyFileSync(templateHandlerPath, handlerPath);

  console.log(
    `Command generated at ${commandDir}! You may restart the bot to use it.`
  );
}

try {
  const commandData = await promptCommandData(
    commands.map((cmd) => cmd.config)
  );

  await generateCommandFile(commandData);
} catch (e: any) {
  console.error(`Error generating command: ${e.message}`);
}
