import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { readdir } from "fs/promises";
import path from "path";

dotenv.config();

export default async (client) => {
	const files = await readdir("./src/commands");
	let commands = [];

	for (const file of files) {
		if (file.endsWith(".js")) {
			const filePath = path.resolve("./src/commands", file);
			const { default: command } = await import(`file://${filePath}`);
			client.commands.set(command.data.name, command);
			commands.push(command.data.toJSON());
		}
	}

	const rest = new REST().setToken(process.env.TOKEN);
	await rest.put(Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
};
