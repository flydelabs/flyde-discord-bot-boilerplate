import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DiscordCommandData } from "./generate-command.ts";

const __filename = fileURLToPath(import.meta.url);

export interface CommandData {
  handlerPath: string;
  config: DiscordCommandData;
}

const commandsDir = path.join(__filename, "../../commands");
export const commands = fs
  .readdirSync(commandsDir)
  .filter((file) => fs.statSync(path.join(commandsDir, file)).isDirectory())
  .map((dir) => {
    const files = fs.readdirSync(path.join(commandsDir, dir));
    const configFileName = files.find((file) => file === "config.json");
    const handlerFileName = files.find((file) => file === "Handler.flyde");
    if (!configFileName || !handlerFileName) {
      throw new Error(`Missing config or handler for ${dir}`);
    }
    try {
      const configJson = JSON.parse(
        fs.readFileSync(path.join(commandsDir, dir, configFileName), "utf-8")
      );
      if (configJson.name !== dir) {
        console.warn(`Config name does not match directory name for ${dir}`);
      }
      return {
        config: configJson,
        handlerPath: path.join("commands", dir, handlerFileName),
      };
    } catch (e) {
      throw new Error(`Error parsing config for ${dir}: ${e}`);
    }
  });
