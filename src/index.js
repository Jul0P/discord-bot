import { Client, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import loadEvents from "./loaders/loadEvents.js";
import loadServices from "./loaders/loadServices.js";
import loadSlashCommands from "./loaders/loadSlashCommands.js";

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	],
});

client.commands = new Collection();

client.once("ready", () => {
	console.log(`${client.user.tag} est en ligne !`);
	loadServices(client);
});

loadEvents(client);
loadSlashCommands(client);

client.login(process.env.TOKEN);
