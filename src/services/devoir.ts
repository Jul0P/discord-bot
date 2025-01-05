import { EmbedBuilder, TextChannel } from "discord.js";
import fs from "fs/promises";
import path from "path";
import { ExtendedClient } from "../index.ts";

const filePath = path.resolve("src/data/devoir.json");

interface Devoir {
	Date: string;
	Devoirs: {
		[group: string]: Array<{
			Matiere: string;
			Description: string;
		}>;
	};
}

export default {
	name: "devoir",
	async execute(client: ExtendedClient, dateToProcess: string | null = null): Promise<void> {
		if (
			!(await fs
				.access(filePath)
				.then(() => true)
				.catch(() => false)) ||
			(await fs.stat(filePath)).size === 0
		) {
			await fs.writeFile(filePath, "[]");
		}

		const devoirs: Devoir[] = JSON.parse(await fs.readFile(filePath, "utf-8"));
		const channel = (await client.channels.fetch("1297313519825584179")) as TextChannel;
		let messages = await channel.messages.fetch();
		const currentDate = new Date();

		messages = messages.filter((m) => !m.embeds.some((e) => e.title?.includes("Devoir"))).reverse();

		let messageIndex = 0;
		let devoirsUpdated = false;
		const devoirsToRemove: Devoir[] = [];

		for (const devoirDate of devoirs) {
			if (!devoirDate.Devoirs || (dateToProcess && devoirDate.Date !== dateToProcess)) {
				continue;
			}

			const [day, month] = devoirDate.Date.split("/");
			const date = new Date(Date.UTC(currentDate.getFullYear(), parseInt(month) - 1, parseInt(day)));
			const dayOfWeek =
				date.toLocaleDateString("fr-FR", { weekday: "long" }).charAt(0).toUpperCase() +
				date.toLocaleDateString("fr-FR", { weekday: "long" }).slice(1);
			const dayDifference = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

			if (dayDifference > 4) {
				devoirsToRemove.push(devoirDate);
				devoirsUpdated = true;

				const messageToRemove = messages.find((m) =>
					m.embeds.some((e) => e.title === `${dayOfWeek} ${devoirDate.Date}`),
				);

				if (messageToRemove) {
					await messageToRemove.delete();
					messages = await channel.messages.fetch({ limit: 100 });
					messages = messages.filter((m) => !m.embeds.some((e) => e.title?.includes("Devoir"))).reverse();
				}

				continue;
			}

			const embed = new EmbedBuilder()
				.setTitle(`${dayOfWeek} ${devoirDate.Date}`)
				.setColor(dayDifference > 0 ? "#FFA500" : "#00FF00");

			for (const group of ["Général", "Groupe A", "Groupe B", "SLAM", "SISR", "Maths 2"]) {
				if (devoirDate.Devoirs[group]) {
					const groupContent = devoirDate.Devoirs[group].map((d) => `**${d.Matiere}** : ${d.Description}`).join("\n");
					embed.addFields({ name: `**${group}**`, value: groupContent });
				}
			}

			const existingMessage = messages.find((m) => m.embeds.some((e) => e.title === embed.data.title));

			if (existingMessage && dateToProcess) {
				await existingMessage.edit({ embeds: [embed] });
			} else if (messageIndex < messages.size && !dateToProcess) {
				const message = messages.at(messageIndex);

				if (!message) return;

				const existingEmbedTitle = message.embeds[0].title;

				if (existingEmbedTitle !== embed.data.title) {
					await message.edit({ embeds: [embed] });
				}
			} else {
				await channel.send({ embeds: [embed] });
			}

			messageIndex++;
		}

		for (const devoirDate of devoirsToRemove) {
			devoirs.splice(devoirs.indexOf(devoirDate), 1);
		}

		if (devoirsUpdated) {
			await fs.writeFile(filePath, JSON.stringify(devoirs, null, 2));
		}
	},
};
