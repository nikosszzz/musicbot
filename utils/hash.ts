import { execSync } from "node:child_process";

/**
 * @name hash
 * @description Returns the latest Git Hash of Music Bot branch that is used.
 */
export function hash(): string {
    try {
        return execSync("git rev-parse --short HEAD").toString().trim();
    } catch (e: any) {
        return "null";
    }
}
