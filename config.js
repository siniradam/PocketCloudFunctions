// # Configuration
export const config = {
  freeCpuSlots: 10,
  maxRestarts: 2,
  functionsPath: "/functions",
};

// ! Do Not Edit Below This Line !
import { fileURLToPath } from "url";
import { dirname } from "path";
export const __dirname = dirname(fileURLToPath(import.meta.url)) + config.functionsPath;
