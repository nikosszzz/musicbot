import type { Command } from "@common/types";
import loop from "./loop";
import lyrics from "./lyrics";
import move from "./move";
import nowplaying from "./nowplaying";
import pause from "./pause";
import play from "./play";
import playlist from "./playlist";
import pruning from "./pruning";
import queue from "./queue";
import remove from "./remove";
import resume from "./resume";
import shuffle from "./shuffle";
import skip from "./skip";
import skipto from "./skipto";
import stop from "./stop";
import volume from "./volume";

export const commands: Command[] = [
    loop,
    lyrics,
    move,
    nowplaying,
    play,
    playlist,
    pause,
    pruning,
    queue,
    remove,
    resume,
    shuffle,
    skip,
    skipto,
    stop,
    volume
];