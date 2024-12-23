export default {
	name: "interactionCreate",
	async execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName);
		await command.execute(interaction);
	},
};
