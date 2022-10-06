import chalk from "chalk";

/**
 * @name Music Bot Logger
 * @description The Music Bot Logger System.
 * @methods error, log, info, debug
 */
export class Logger {
    /**
     * @name error
     * @description Error logger
     * @param type 
     * @param err 
     */
    public static error({ type, err }: { type: string; err: any; }): void {
        return console.error(chalk.red(`${chalk.red.bold(`[${type}]`)}      Error logged! ${err}`));
    }
    /**
     * @name log
     * @description Normal Logger
     * @param type 
     * @param msg 
     */
    public static log({ type, msg }: { type: string; msg: string; }): void {
        return console.log(chalk.green(`${chalk.green.bold(`[${type}]`)}      ${msg}`));
    }
    /**
     * @name info
     * @description Info Logger
     * @param type 
     * @param msg 
     */
    public static info({ type, msg }: { type: string; msg: string; }): void {
        console.log(chalk.blueBright(`${chalk.blueBright.bold(`[${type}]`)}      ${msg}`));
    }
    /**
     * @name debug
     * @description Debug Logger
     * @param type 
     * @param msg 
     */
    public static debug({ type, msg }: { type: string; msg: string; }): void {
        console.debug(chalk.blueBright(`${chalk.blueBright.bold(`[${type}]`)}      ${msg}`));
    }
}
