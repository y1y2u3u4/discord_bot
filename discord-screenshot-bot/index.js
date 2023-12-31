const fs = require('fs');  
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');  
const { guildId, CHANNEL_ID } = require('./config.json');
const { InteractionType } = require("discord-api-types/v10");  
const { TodoistApi } = require("@doist/todoist-api-typescript");
const { scheduleJob } = require('node-schedule');

//获取当天的任务内容
async function getTodayTasksFromTodoist() {
  console.log('Fetching tasks from Todoist');
  const api = new TodoistApi("b1b1a6b8a8f96ca137392acbd5fdc8db00db0314");
  try {
    const tasks = await api.getTasks({ due_date: 'today' });
    // console.log("tasks",tasks);
    return tasks.map(task => ({ content: task.content, id: task.id }));
  } catch (error) {
    console.error('Todoist API Error:', error);
    return 'Failed to fetch tasks';
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });  
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));    

for (const file of eventFiles) {  
    const event = require(`./events/${file}`);  
    if (event.once) {  
        client.once(event.name, (...args) => event.execute(...args));  
    } else {  
        client.on(event.name, (...args) => event.execute(...args));  
    }  
}  
  
client.commands = new Collection();  
const cmdPaths = require("./cmdPaths.js").data;  
const commandFiles = [];  
for (let i = 0; i < cmdPaths.length; i++) {  
    commandFiles[i] = fs.readdirSync(cmdPaths[i]).filter(file => file.endsWith(".js")); // fs.readdirSync() 的结果是个数组，所以 commandFiles是个二维数组  
    for (let j = 0; j < commandFiles[i].length; j++) {  
        commandFiles[i][j] = cmdPaths[i] + "/" + commandFiles[i][j];  
    }  
}  
  
for (const fileArray of commandFiles) {  
    for (const file of fileArray) {  
        const command = require(`./${file}`);  
        client.commands.set(command.data.name, command);  
  
        // if any ‘aka' name exists  
        if (command.akaNames != null && command.akaNames !== []) {  
            for (let i = 0; i < command.akaNames.length; i++) {  
                client.commands.set(command.akaNames[i], command);  
            }  
        }  
    }  
}  
  
// client.once(Events.ClientReady, () => {
//     console.log('Bot is online');

//     const guild = client.guilds.cache.get(guildId);  // 用实际的服务器（Guild）ID替换 'GUILD_ID'
//     if (!guild) return console.log('Guild not found');
  
//     const channel = guild.channels.cache.get(CHANNEL_ID);  // 用实际的频道（Channel）ID替换 'CHANNEL_ID'
//     if (!channel || channel.type === 'GUILD_TEXT') return console.log('Channel not found or not a text channel');
  
//     setInterval(() => {
//       channel.send('这是一个定时消息');  // 你可以发送任何你想发送的消息
//     }, 5000); // 每60秒（60000毫秒）发送一次消息

// });

client.once(Events.ClientReady,  () => {
    console.log('Bot is online');
  
    const guild = client.guilds.cache.get(guildId);  // 用实际的服务器（Guild）ID替换 'GUILD_ID'
    if (!guild) return console.log('Guild not found');
  
    const channel = guild.channels.cache.get(CHANNEL_ID);  // 用实际的频道（Channel）ID替换 'CHANNEL_ID'
    if (!channel || channel.type === 'GUILD_TEXT') return console.log('Channel not found or not a text channel');

    // setInterval(() => {
    //     channel.send('这是一个定时消息');  // 你可以发送任何你想发送的消息
    //   }, 5000); // 每60秒（60000毫秒）发送一次消息
  
    // 获取当前时间并加1秒
    const currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + 1);
  
    // 获取毫秒差
    const delay = currentDate.getTime() - new Date().getTime();
    
    // 在1秒后发送一条测试消息
    setTimeout(async () => {
        const tasks = await getTodayTasksFromTodoist();
        if (tasks === 'Failed to fetch tasks') {
            channel.send('无法从Todoist获取任务');
        } else {
            // 使用 forEach 来遍历任务数组并发送每一个任务
            tasks.forEach(task => {
              channel.send(`**任务**: ${task.content}\n**任务ID**: ${task.id}`);
            });
        }
    }, delay);
  
    // 设置早中晚三次提醒，你可以根据需要调整时间
    const times = ['09:00', '12:00', '18:00'];
  
    for (const time of times) {
      // 设置每天特定时间触发的定时器
      scheduleJob(time, async () => {
        const tasks = await getTodayTasksFromTodoist();
        if (tasks === 'Failed to fetch tasks') {
          channel.send('无法从Todoist获取任务');
        } else {
          const taskMessages = tasks.map(task => `• ${task.content}`).join('\n');
          channel.send(`**今天的任务：**\n${taskMessages}`);
        }
      });
    }
  });
  


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    const command = client.commands.get(interaction.commandName);  
  
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
  
    try {  
        await command.execute(interaction);  
    } catch (error) {  
        console.error(error);  
        await interaction.reply({  
            content: 'There was an error while executing this command!',  
            ephemeral: true  
        });  
    }  
});  

client.on('messageCreate', async (message) => {
    console.log('Received a message');  // 添加这行
    if (message.author.bot) return;
    if (message.reference && message.reference.messageId) {
      console.log('Message has a reference');  // 添加这行
      const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
      console.log(repliedMessage.content);
      const taskIdMatch = repliedMessage.content.match(/任务ID\**: (\d+)/);
      console.log('taskIdMatch:', taskIdMatch);
      if (taskIdMatch) {
        console.log('Task ID found');
        const taskId = taskIdMatch[1];
        // 使用API更新Todoist任务
        const api = new TodoistApi("b1b1a6b8a8f96ca137392acbd5fdc8db00db0314");
        api.addComment({
          taskId: taskId,
          content: message.content,
        }).then((comment) => {
          message.reply('已添加评论到Todoist');
          console.log('Comment added to Todoist');  // 添加这行
        }).catch((error) => {
          message.reply('添加评论失败');
          console.log('Failed to add comment', error);  // 添加这行
          console.log(error);
        });
      }
    }
  });


client.login(token);
