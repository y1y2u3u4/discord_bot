const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping_1')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply("Pong!");
		await wait(1000);
	    await interaction.deleteReply();
	},
};
