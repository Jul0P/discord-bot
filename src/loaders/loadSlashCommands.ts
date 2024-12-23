import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { readdir } from "fs/promises";
import path from "path";
import { ExtendedClient } from "../index.ts";

dotenv.config();

interface Command {
	name: string;
	data: {
		name: string;
		toJSON: () => any;
	};
	execute: (client: ExtendedClient, ...args: any[]) => void;
}

export default async (client: ExtendedClient): Promise<void> => {
	const files = await readdir("./src/commands");
	let commands = [];

	for (const file of files) {
		if (file.endsWith(".ts") || file.endsWith(".js")) {
			const filePath = path.resolve("./src/commands", file);
			const { default: command } = (await import(`file://${filePath}`)) as { default: Command };
			client.commands.set(command.data.name, command);
			commands.push(command.data.toJSON());
		}
	}

	const token = process.env.TOKEN;
	const clientId = process.env.CLIENT_ID;
	const guildId = process.env.GUILD_ID;

	if (!token || !clientId || !guildId) return;

	const rest = new REST().setToken(token);
	await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
};
