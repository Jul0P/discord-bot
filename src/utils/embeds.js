import { EmbedBuilder } from "discord.js";

export function errorEmbed(description) {
	return new EmbedBuilder().setTitle("Erreur").setDescription(description).setColor("#ff0000");
}

export function successEmbed(description) {
	return new EmbedBuilder().setTitle("Succès").setDescription(description).setColor("#00ff00");
}
