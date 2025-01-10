import { red, yellowBright, blueBright, bold, redBright } from "yoctocolors";
import { config } from "./config.js";

/**
 * @name Music Bot Logger
 * @description The Music Bot Logger System.
 * @methods error, log, info, debug
 */
export const Logger = {
    /**
     * @name error
     * @description Error logger
     * @param type 
     * @param err 
     */
    error({ type, err }: { type: string; err: Error | string }): void {
        const errorMessage = typeof err == "string" ? err : (err as Error).stack || String(err);
        console.error(red(`${bold(`[${type}]`)} Error logged! ${errorMessage}`));
    },
    /**
     * @name log
     * @description Normal Logger
     * @param type 
     * @param msg 
     */
    log({ type, msg }: { type: string; msg: string }): void {
        console.log(yellowBright(`${bold(`[${type}]`)} ${msg}`));
    },
    /**
     * @name info
     * @description Info Logger
     * @param type 
     * @param msg 
     */
    info({ type, msg }: { type: string; msg: string }): void {
        console.log(blueBright(`${bold(`[${type}]`)} ${msg}`));
    },
    /**
     * @name debug
     * @description Debug Logger
     * @param type 
     * @param msg 
     */
    debug({ type, msg }: { type: string; msg: string; }): void {
        if (config.DEBUG) console.debug(redBright(`${bold(`[${type}]`)} ${msg}`));
    }
};