import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { successEmbed } from "../utils/embeds.js";

export default {
	data: new SlashCommandBuilder().setName("status").setDescription("Commande pour envoyer un message de status"),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({ embeds: [successEmbed("Le bot est en ligne !")] });
	},
};
