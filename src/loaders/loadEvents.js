import { readdir } from "fs/promises";
import path from "path";

export default async (client) => {
	const files = await readdir("./src/events");

	for (const file of files) {
		if (file.endsWith(".js")) {
			const filePath = path.resolve("./src/events", file);
			const { default: event } = await import(`file://${filePath}`);
			client.on(event.name, event.execute.bind(client));
		}
	}
};
