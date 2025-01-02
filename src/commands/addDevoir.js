import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fs from "fs/promises";
import path from "path";
import devoirService from "../services/devoir.js";

const filePath = path.resolve("src/data/devoir.json");

export default {
	data: new SlashCommandBuilder()
		.setName("adddevoir")
		.setDescription("Commande pour ajouter un devoir")
		.setDMPermission(false)
		.addStringOption((option) => option.setName("date").setDescription("format: jj/mm").setRequired(true))
		.addStringOption((option) =>
			option.setName("groupe").setDescription("format: Général / A / B / SLAM / SISR / Maths 2").setRequired(true),
		)
		.addStringOption((option) =>
			option.setName("matiere").setDescription("format: CBA, ABL, Maths, Anglais").setRequired(true),
		)
		.addStringOption((option) =>
			option.setName("description").setDescription("Description du devoir").setRequired(true),
		),

	async execute(interaction) {
		const date = interaction.options.getString("date");
		const groupe = interaction.options.getString("groupe");
		const matiere = interaction.options.getString("matiere");
		const description = interaction.options.getString("description");
		let devoirs = JSON.parse(await fs.readFile(filePath, "utf-8"));

		await add(date, groupe, { Matiere: matiere, Description: description });

		const embed = new EmbedBuilder()
			.setTitle("Devoir ajouté")
			.setDescription(`\`\`\`${description}\`\`\``)
			.setColor("#00FF00")
			.addFields(
				{ name: "Date", value: date, inline: true },
				{ name: "Groupe", value: groupe, inline: true },
				{ name: "Matière", value: matiere, inline: true },
			);

		await interaction.reply({ embeds: [embed] });
		await devoirService.execute(interaction.client, devoirs.some((d) => d.Date === date) ? date : null);
		setTimeout(async () => {
			await interaction.deleteReply();
		}, 5000);
	},
};

async function add(date, groupe, devoir) {
	let devoirs = JSON.parse(await fs.readFile(filePath, "utf-8"));

	let devoirDate = devoirs.find((d) => d.Date === date);

	if (!devoirDate) {
		devoirDate = { Date: date, Devoirs: {} };
		devoirs.push(devoirDate);
	}

	if (groupe === "A" || groupe === "B") {
		addToGroup(devoirDate, "Groupe " + groupe, devoir);
	} else {
		addToGroup(devoirDate, groupe, devoir);
	}

	devoirs = devoirs.sort((a, b) => {
		const dateA = new Date(a.Date.split("/").reverse().join("-"));
		const dateB = new Date(b.Date.split("/").reverse().join("-"));
		return dateA - dateB;
	});

	await fs.writeFile(filePath, JSON.stringify(devoirs, null, 2));
}

function addToGroup(devoirDate, group, devoir) {
	if (!devoirDate.Devoirs[group]) {
		devoirDate.Devoirs[group] = [];
	}
	devoirDate.Devoirs[group].push(devoir);
}
