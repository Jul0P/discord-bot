import { readdir } from "fs/promises";
import path from "path";
import { ExtendedClient } from "../index.ts";

interface Event {
	name: string;
	execute: (client: ExtendedClient, ...args: any[]) => void;
}

export default async (client: ExtendedClient): Promise<void> => {
	const files = await readdir("./src/events");
	for (const file of files) {
		if (file.endsWith(".ts") || file.endsWith(".js")) {
			const filePath = path.resolve("./src/events", file);
			const { default: event } = (await import(`file://${filePath}`)) as { default: Event };
			client.on(event.name, event.execute.bind(client));
		}
	}
};
