export const videoPattern = /^(https?:\/\/)?(www\.)?(m\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/;
export const playlistCheck = /^.*(list=)([^#\\?]*).*/;
export const playlistPattern = /^.*(youtu.be\/|list=)([^#&\\?]*).*/i;
export const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
export const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
export const spotifyPattern = /^.*(https:\/\/open\.spotify\.com\/track)([^#\\?]*).*/;
export const userReg = /<@!?(\d+)>/;
export const msRegex = /(\d+(s|m|h|w))/;
