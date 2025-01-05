import { readdir } from "fs/promises";
import path from "path";

export default async (client) => {
	const files = await readdir("./src/services");

	for (const file of files) {
		if (file.endsWith(".js")) {
			const filePath = path.resolve("./src/services", file);
			const { default: service } = await import(`file://${filePath}`);
			service.execute(client);
		}
	}
};
