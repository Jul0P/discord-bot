import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Récupère l'avatar d'un utilisateur.")
		.addUserOption((option) =>
			option
				.setName("utilisateur")
				.setDescription("L'utilisateur dont vous voulez récupérer l'avatar.")
				.setRequired(true),
		),

	async execute(interaction) {
		const user = interaction.options.getUser("utilisateur");

		const avatarEmbed = new EmbedBuilder()
			.setDescription(`**Avatar de <@${user.id}>**`)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setColor("#0099ff");

		await interaction.reply({ embeds: [avatarEmbed] });
	},
};
