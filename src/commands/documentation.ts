import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder().setName("doc").setDescription("Documentation du bot").setDMPermission(false), // TODO: Allow the user to select a server they are a member of to display the /doc command in DM

	async execute(interaction: ChatInputCommandInteraction) {
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
					name: "/clear `nombre`",
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
				{
					name: "/avatar `utilisateur`",
					value: "Récupère l'avatar d'un utilisateur",
					inline: false,
				},
			);
		await interaction.reply({ embeds: [embed] });
	},
};
