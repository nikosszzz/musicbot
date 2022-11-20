import { GuildMember } from "discord.js";

export function canModifyQueue({ member }: { member: GuildMember; }): boolean {
    return member.voice.channelId === member.guild.members?.me?.voice.channelId;
}
