import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder().setName("doc").setDescription("Documentation du bot"),

	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle("Documentation du Bot")
			.setDescription("Voici la liste des commandes disponibles et leurs descriptions")
			.setColor("#0099ff")
			.setFields(
				{
					name: "\u200B",
					value: "**Rôles nécessaires : <@&1280508888206282812> & <@&1280508888206282810>**",
					inline: false,
				},
				{
					name: "/adddevoir `date` `groupe` `matiere` `description`",
					value: "Ajouter un devoir",
					inline: false,
				},
				{
					name: "/deletedevoir `date` `groupe` `matiere`",
					value: "Supprimer un devoir",
					inline: false,
				},
				{
					name: "/updatedevoir `date` `groupe` `matiere` `[description]` `[nouvelle_matiere]`",
					value: "Mettre à jour un devoir",
					inline: false,
				},
				{
					name: "\u200B",
					value: "**Rôle nécessaire : <@&1280508888206282812>**",
					inline: false,
				},
				{
					name: "/clear `nombre` `[salon]` `[utilisateur]`",
					value: "Supprimer des messages",
					inline: false,
				},
				{
					name: "\u200B",
					value: "**Rôle nécessaire : @everyone**",
					inline: false,
				},
				{
					name: "/status",
					value: "Envoie un message de status",
					inline: false,
				},
				{
					name: "/doc",
					value: "Documentation du bot",
					inline: false,
				},
			);

		await interaction.reply({ embeds: [embed] });
	},
};
