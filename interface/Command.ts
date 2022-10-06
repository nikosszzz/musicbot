import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export interface Command {
  data: SlashCommandSubcommandsOnlyBuilder | SlashCommandBuilder;
  execute(...args: any): any;
}
