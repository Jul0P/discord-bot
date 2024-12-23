import { Interaction } from "discord.js";
import { ExtendedClient } from "../index.ts";

export default {
	name: "interactionCreate",
	async execute(interaction: Interaction) {
		if (!interaction.isCommand()) return;

		const command = (interaction.client as ExtendedClient).commands.get(interaction.commandName);

		if (!command) return;

		await command.execute(interaction);
	},
};
