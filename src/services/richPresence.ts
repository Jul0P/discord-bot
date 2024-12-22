import { ActivityType } from "discord.js";
import { ExtendedClient } from "../index.ts";

export default {
	name: "ready",
	execute(client: ExtendedClient) {
		const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
		client.user?.setPresence({
			activities: [
				{
					name: `${memberCount} membres`,
					type: ActivityType.Streaming,
					url: "https://twitch.tv/xxxxxx",
					state: "Faites /doc pour voir les commandes disponibles",
				},
			],
			status: "online",
		});
	},
};
