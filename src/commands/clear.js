import { ChannelType, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { errorEmbed, successEmbed } from "../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("Commande pour supprimer des messages")
		.setDMPermission(false)
		.addIntegerOption((option) =>
			option
				.setName("nombre")
				.setDescription("Nombre de messages à supprimer")
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100),
		)
		.addChannelOption((option) =>
			option
				.setName("salon")
				.setDescription("Salon dans lequel les messages doivent être supprimés")
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(false),
		)
		.addUserOption((option) =>
			option
				.setName("utilisateur")
				.setDescription("Utilisateur dont les messages doivent être supprimés")
				.setRequired(false),
		),
	userPermissions: [PermissionsBitField.Flags.ManageMessages],
	botPermissions: [PermissionsBitField.Flags.ManageMessages],

	async execute(interaction) {
		const { options } = interaction;
		let count = options.getInteger("nombre");
		const channel = options.getChannel("salon") || interaction.channel;
		const target = options.getUser("utilisateur");

		try {
			const channelMessages = await channel.messages.fetch(target ? {} : { limit: count });

			if (channelMessages.size === 0) {
				await interaction.reply({
					embeds: [errorEmbed("Aucun message à supprimer")],
					ephemeral: true,
				});
				return;
			}

			await interaction.deferReply({
				ephemeral: true,
			});

			const oldMessages = [];
			const recentMessages = [];

			let i = 0;
			channelMessages.forEach((message) => {
				if (i >= count) return;

				if (target && message.author.id !== target.id) {
					return;
				}

				if (Date.now() - message.createdTimestamp > 14 * 24 * 60 * 60 * 1000) {
					oldMessages.push(message);
				} else {
					recentMessages.push(message);
				}

				i++;
			});

			if (recentMessages.length > 0) {
				await channel.bulkDelete(recentMessages);
			}

			for (const message of oldMessages) {
				await message.delete();
			}

			await interaction.editReply({
				embeds: [
					successEmbed(
						`Suppression de ${i} messages ${target ? `de <@${target.id}>` : ""} ${channel ? `dans <#${channel.id}>` : ""}`,
					),
				],
			});
		} catch (error) {
			console.error(error);
			await interaction.followUp({
				embeds: [errorEmbed("Erreur lors de la suppression des messages")],
				ephemeral: true,
			});
		}
	},
};
