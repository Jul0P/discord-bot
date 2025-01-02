import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fs from "fs/promises";
import path from "path";
import devoirService from "../services/devoir.js";

const filePath = path.resolve("src/data/devoir.json");

export default {
	data: new SlashCommandBuilder()
		.setName("deletedevoir")
		.setDescription("Supprimer un devoir")
		.setDMPermission(false)
		.addStringOption((option) => option.setName("date").setDescription("format: jj/mm").setRequired(true))
		.addStringOption((option) =>
			option.setName("groupe").setDescription("format: Général / A / B / SLAM / SISR / Maths 2").setRequired(true),
		)
		.addStringOption((option) =>
			option.setName("matiere").setDescription("format: CBA, ABL, Maths, Anglais").setRequired(true),
		),

	async execute(interaction) {
		const date = interaction.options.getString("date");
		const groupe = interaction.options.getString("groupe");
		const matiere = interaction.options.getString("matiere");

		const deleted = await deleteDevoir(date, groupe, matiere, interaction.client);

		const embed = new EmbedBuilder()
			.setTitle(deleted ? "Devoir supprimé" : "Devoir non trouvé")
			.setDescription(
				deleted
					? `Le devoir du **${date}** pour le groupe **${groupe}** en **${matiere}** a été supprimé`
					: "Aucun devoir trouvé",
			)
			.setColor(deleted ? "#00FF00" : "#FF0000");

		await interaction.reply({ embeds: [embed] });
		await devoirService.execute(interaction.client, date);
		setTimeout(async () => {
			await interaction.deleteReply();
		}, 5000);
	},
};

async function deleteDevoir(date, groupe, matiere, client) {
	let devoirs = JSON.parse(await fs.readFile(filePath, "utf-8"));

	const devoirDate = devoirs.find((d) => d.Date === date);

	if (!devoirDate) {
		return false;
	}

	let removed = false;

	if (groupe === "A" || groupe === "B") {
		removed = deleteFromGroup(devoirDate, "Groupe " + groupe, matiere);
	} else {
		removed = deleteFromGroup(devoirDate, groupe, matiere);
	}

	if (Object.keys(devoirDate.Devoirs).length === 0) {
		devoirs = devoirs.filter((d) => d.Date !== date);
		const channel = await client.channels.fetch("1297313519825584179");
		const messages = await channel.messages.fetch();
		const messageToRemove = messages.find((m) => m.embeds.some((e) => e.title.includes(devoirDate.Date)));
		if (messageToRemove) {
			await messageToRemove.delete();
		}
	}

	if (removed) {
		await fs.writeFile(filePath, JSON.stringify(devoirs, null, 2));
	}

	return removed;
}

function deleteFromGroup(devoirDate, groupe, matiere) {
	if (!devoirDate.Devoirs[groupe]) {
		return false;
	}

	const devoirToRemove = devoirDate.Devoirs[groupe].find((d) => d.Matiere === matiere);

	if (!devoirToRemove) {
		return false;
	}

	devoirDate.Devoirs[groupe] = devoirDate.Devoirs[groupe].filter((d) => d.Matiere !== matiere);

	if (devoirDate.Devoirs[groupe].length === 0) {
		delete devoirDate.Devoirs[groupe];
	}

	return true;
}
