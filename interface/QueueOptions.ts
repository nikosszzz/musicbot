import { VoiceConnection } from "@discordjs/voice";
import { CommandInteraction } from "discord.js";

export interface QueueOptions {
  connection: VoiceConnection;
  interaction: CommandInteraction;
}
