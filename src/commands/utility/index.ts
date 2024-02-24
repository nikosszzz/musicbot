import type { Command } from "@common/types";
import serverinfo from "./serverinfo";
import userinfo from "./userinfo";

export const commands: Command[] = [
    serverinfo, 
    userinfo
]