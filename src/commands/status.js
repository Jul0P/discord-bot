import { SlashCommandBuilder } from "discord.js";
import { successEmbed } from "../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("Commande pour envoyer un message de status")
		.setDMPermission(true),

	async execute(interaction) {
		await interaction.reply({ embeds: [successEmbed("Le bot est en ligne !")] });
	},
};
