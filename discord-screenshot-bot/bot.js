
const Discord = require('discord.js');
const fetch = require('node-fetch');
const client = new Discord.Client();

import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';



const AWS_SERVICE_URL = 'https://5p8r2lrq2k.execute-api.us-east-1.amazonaws.com/dev/capture';  // 更换为你的服务 URL

client.once('ready', () => {
    console.log('Bot is Ready!');
});

client.on('message', async message => {
    if (message.content.startsWith('!screenshot')) {
        const urlToCapture = message.content.split(' ')[1];

        try {
            const response = await fetch(`${AWS_SERVICE_URL}?url=${encodeURIComponent(urlToCapture)}`);
            const imageBuffer = await response.buffer();

            message.channel.send({
                files: [{
                    attachment: imageBuffer,
                    name: 'screenshot.png'
                }]
            });
        } catch (error) {
            console.error("Error capturing screenshot:", error);
            message.reply('Sorry, there was an error capturing the screenshot.');
        }
    }
});

client.login('MTE0NzUzMzEzNjk1MjA0NTY0OQ.Gtoiz7.E-1IbeS-GTJA0z5Lsb1Ox30Bym1hVf8tKvQ9ww');  // 更换为你的 bot token
