import { ActivityType } from "discord.js";
import { ExtendedClient } from "../index.ts";

export default {
	name: "ready",
	execute(client: ExtendedClient): void {
		const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

		if (!client.user) return;

		client.user.setPresence({
			activities: [
				{
					name: `${memberCount} membres ss`,
					type: ActivityType.Watching,
					url: "https://twitch.tv/xxxxxx",
					state: "Faites /doc pour voir les commandes disponibles",
				},
			],
			status: "online",
		});
	},
};
