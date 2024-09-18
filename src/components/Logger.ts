import chalk from "chalk";

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
        const errorMessage = typeof err === "string" ? err : (err as Error).stack || String(err);
        console.error(chalk.red(`${chalk.bold(`[${type}]`)} Error logged! ${errorMessage}`));
    },
    /**
     * @name log
     * @description Normal Logger
     * @param type 
     * @param msg 
     */
    log({ type, msg }: { type: string; msg: string }): void {
        console.log(chalk.yellowBright(`${chalk.bold(`[${type}]`)} ${msg}`));
    },
    /**
     * @name info
     * @description Info Logger
     * @param type 
     * @param msg 
     */
    info({ type, msg }: { type: string; msg: string }): void {
        console.log(chalk.hex('#FFA500')(`${chalk.bold(`[${type}]`)} ${msg}`));
    },
    /**
     * @name debug
     * @description Debug Logger
     * @param type 
     * @param msg 
     */
    debug({ type, msg }: { type: string; msg: string; }): void {
        console.debug(chalk.blueBright(`${chalk.bold(`[${type}]`)} ${msg}`));
    }
};