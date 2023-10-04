const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// 初始化Discord客户端
client.once('ready', () => {
  console.log('Logged in as ' + client.user.tag);
});

// 登录到Discord
client.login('MTE0NzUzMzEzNjk1MjA0NTY0OQ.GKZI6E.cdOWQrQjHwfCugZ2KlIxfRMMNuVfj0UF9lVaE0');

async function sendDiscordMessage(content, taskId) {
  try {
    // 找到特定的Discord频道
    const channel = await client.channels.fetch('你的Discord频道ID');
  
    // 发送消息
    await channel.send(`任务提醒: ${content}`);
  } catch (error) {
    console.error(`发送消息失败: ${error}`);
  }
}
