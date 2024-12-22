import { Client, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import loadServices from "./loaders/loadServices.ts";

dotenv.config();

interface Command {
	name: string;
	execute: (...args: any[]) => void;
}

class ExtendedClient extends Client {
	commands: Collection<string, Command>;

	constructor() {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences],
		});
		this.commands = new Collection();
	}
}

const client = new ExtendedClient();

client.once("ready", () => {
	console.log(`${client.user?.tag} est en ligne !`);
});

loadServices(client);

client.login(process.env.TOKEN);

export { ExtendedClient };
