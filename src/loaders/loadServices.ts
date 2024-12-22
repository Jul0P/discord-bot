import { readdir } from "fs/promises";
import path from "path";
import { ExtendedClient } from "../index.ts";

interface Service {
	name: string;
	execute: (client: ExtendedClient, ...args: any[]) => void;
}

export default async (client: ExtendedClient): Promise<void> => {
	const files = await readdir("./src/services");
	for (const file of files) {
		if (file.endsWith(".ts") || file.endsWith(".js")) {
			const filePath = path.resolve("./src/services", file);
			const { default: service } = (await import(`file://${filePath}`)) as { default: Service };
			client.on(service.name, service.execute.bind(null, client));
		}
	}
};
