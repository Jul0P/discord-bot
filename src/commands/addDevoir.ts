import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fs from "fs/promises";
import path from "path";
import { ExtendedClient } from "../index.js";
import devoirService from "../services/devoir.js";
import { errorEmbed } from "../utils/embeds.js";

const filePath = path.resolve("src/data/devoir.json");

interface Devoir {
	Matiere: string;
	Description: string;
}

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

	async execute(interaction: ChatInputCommandInteraction) {
		const date = interaction.options.getString("date");
		const groupe = interaction.options.getString("groupe");
		const matiere = interaction.options.getString("matiere");
		const description = interaction.options.getString("description");

		if (!date || !groupe || !matiere || !description) {
			await interaction.reply({
				embeds: [errorEmbed("Tous les champs sont requis.")],
				ephemeral: true,
			});
			return;
		}

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
		await devoirService.execute(
			interaction.client as ExtendedClient,
			devoirs.some((d: any) => d.Date === date) ? date : null,
		);

		setTimeout(async () => {
			await interaction.deleteReply();
		}, 5000);
	},
};

async function add(date: string, groupe: string, devoir: Devoir): Promise<void> {
	let devoirs = JSON.parse(await fs.readFile(filePath, "utf-8"));
	let devoirDate = devoirs.find((d: any) => d.Date === date);

	if (!devoirDate) {
		devoirDate = { Date: date, Devoirs: {} };
		devoirs.push(devoirDate);
	}

	if (groupe === "A" || groupe === "B") {
		addToGroup(devoirDate, "Groupe " + groupe, devoir);
	} else {
		addToGroup(devoirDate, groupe, devoir);
	}

	devoirs = devoirs.sort((a: any, b: any) => {
		const dateA = new Date(a.Date.split("/").reverse().join("-"));
		const dateB = new Date(b.Date.split("/").reverse().join("-"));
		return dateA.getTime() - dateB.getTime();
	});

	await fs.writeFile(filePath, JSON.stringify(devoirs, null, 2));
}

function addToGroup(devoirDate: any, group: string, devoir: Devoir): void {
	if (!devoirDate.Devoirs[group]) {
		devoirDate.Devoirs[group] = [];
	}

	devoirDate.Devoirs[group].push(devoir);
}
