import { Client, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import loadServices from "./Loaders/loadServices.js";

dotenv.config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences],
});

client.commands = new Collection();

client.once("ready", () => {
	console.log(`${client.user.tag} est en ligne !`);
});

loadServices(client);

client.login(process.env.TOKEN);
