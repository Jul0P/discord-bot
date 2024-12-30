import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Récupère l'avatar d'un utilisateur.")
		.setDMPermission(true)
		.addUserOption((option) =>
			option
				.setName("utilisateur")
				.setDescription("L'utilisateur dont vous voulez récupérer l'avatar.")
				.setRequired(true),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser("utilisateur");

		if (!user) return;

		const avatarURL = user.avatar
			? user.displayAvatarURL({ extension: "gif", size: 4096 })
			: user.displayAvatarURL({ extension: "png", size: 4096 });

		const avatarEmbed = new EmbedBuilder()
			.setDescription(`**Avatar de <@${user.id}>**`)
			.setImage(avatarURL)
			.setColor("#0099ff");
		await interaction.reply({ embeds: [avatarEmbed] });
	},
};
