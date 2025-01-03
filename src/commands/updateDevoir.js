import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fs from "fs/promises";
import path from "path";
import devoirService from "../services/devoir.js";

const filePath = path.resolve("src/data/devoir.json");

export default {
	data: new SlashCommandBuilder()
		.setName("updatedevoir")
		.setDescription("Mettre à jour un devoir")
		.setDMPermission(false)
		.addStringOption((option) => option.setName("date").setDescription("format: jj/mm").setRequired(true))
		.addStringOption((option) =>
			option.setName("groupe").setDescription("format: Général / A / B / SLAM / SISR / Maths 2").setRequired(true),
		)
		.addStringOption((option) =>
			option.setName("matiere").setDescription("format: CBA, ABL, Maths, Anglais").setRequired(true),
		)
		.addStringOption((option) =>
			option.setName("description").setDescription("Description du devoir").setRequired(false),
		)
		.addStringOption((option) =>
			option.setName("nouvelle_matiere").setDescription("Nouvelle matière").setRequired(false),
		),

	async execute(interaction) {
		const date = interaction.options.getString("date");
		const groupe = interaction.options.getString("groupe");
		const matiere = interaction.options.getString("matiere");
		const description = interaction.options.getString("description");
		const nouvelleMatiere = interaction.options.getString("nouvelle_matiere");

		const updated = await updateDevoir(date, groupe, matiere, description, nouvelleMatiere);

		const embed = new EmbedBuilder()
			.setTitle(updated ? "Devoir mis à jour" : "Devoir non trouvé")
			.setDescription(
				updated
					? `Le devoir du **${date}** pour le groupe **${groupe}** en **${nouvelleMatiere ? `${matiere} ➔ ${nouvelleMatiere}` : matiere}** a été mis à jour`
					: "Aucun devoir trouvé",
			)
			.setColor(updated ? "#00FF00" : "#FF0000");

		await interaction.reply({ embeds: [embed] });
		await devoirService.execute(interaction.client, date);
		setTimeout(async () => {
			await interaction.deleteReply();
		}, 5000);
	},
};

async function updateDevoir(date, groupe, matiere, description, nouvelleMatiere) {
	let devoirs = JSON.parse(await fs.readFile(filePath, "utf-8"));

	const devoirDate = devoirs.find((d) => d.Date === date);

	if (!devoirDate) {
		return false;
	}

	let updated = false;

	if (groupe === "A" || groupe === "B") {
		updated = updateGroup(devoirDate, "Groupe " + groupe, matiere, description, nouvelleMatiere);
	} else {
		updated = updateGroup(devoirDate, groupe, matiere, description, nouvelleMatiere);
	}

	if (updated) {
		await fs.writeFile(filePath, JSON.stringify(devoirs, null, 2));
	}

	return updated;
}

function updateGroup(devoirDate, groupe, matiere, description, nouvelleMatiere) {
	if (!devoirDate.Devoirs[groupe]) {
		return false;
	}

	const devoirToUpdate = devoirDate.Devoirs[groupe].find((d) => d.Matiere === matiere);

	if (!devoirToUpdate) {
		return false;
	}

	if (description) {
		devoirToUpdate.Description = description;
	}

	if (nouvelleMatiere) {
		devoirToUpdate.Matiere = nouvelleMatiere;
	}

	return true;
}