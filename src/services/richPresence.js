import { ActivityType } from "discord.js";

export default {
	name: "ready",
	execute(client) {
		const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
		client.user.setPresence({
			activities: [
				{
					name: `${memberCount} membres`,
					type: ActivityType.Watching,
					url: "https://twitch.tv/xxxxxx",
					state: "Faites /doc pour voir les commandes disponibles",
					details: `Date: ${new Date().toLocaleDateString()}`,
					timestamps: { start: Date.now() },
					assets: {
						largeImage: "logo",
						largeText: "Bot Discord",
						smallImage: "small_logo",
						smallText: "Petit logo",
					},
					buttons: [
						{ label: "Voir le site", url: "https://google.com" },
						{ label: "Rejoindre le serveur", url: "https://discord.gg/xxxxxx" },
					],
				},
			],
			status: "online",
		});
	},
};
