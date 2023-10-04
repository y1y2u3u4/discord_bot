console.log("Starting the test...");
import { TodoistApi } from '@doist/todoist-api-typescript';

const { TodoistApi } = require("@doist/todoist-api-typescript");
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
async function handleDiscordInteraction(req, res) {
  const { type, data } = req.body;
  console.log('Handling Discord Interaction');
  console.log('type',type);
  console.log('InteractionType.APPLICATION_COMMAND',InteractionType.APPLICATION_COMMAND);
  console.log('data.name',data.name);
  if (type === InteractionType.APPLICATION_COMMAND && data.name === 'todoreminder') {
    const todos = await getTodayTasksFromTodoist();
    // console.log('todos',todos);
    return res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: `Today's Todos:\n${todos}` },
    });
  }
  // ...其他的interaction处理逻辑
}

import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';

//... 导入或定义VerifyDiscordRequest和其他依赖

// const app = express();

// app.post('/interactions', async function (req, res) {
//   if (!VerifyDiscordRequest(req)) {
//     return res.status(401).send('Unauthorized');
//   }
//   handleDiscordInteraction(req, res);
// });

// if (process.env.NODE_ENV !== 'test') {
//   app.listen(3000, () => {
//     console.log('Listening on port 3000');
//   });
// }

const mockRequest = {
  body: {
    type: 2,
    data: { name: 'todoreminder' },
  },
};

const mockResponse = {
  json: (data) => {
    console.log("Response Data: ", data);
  },
};

if (process.env.NODE_ENV === 'test') {
  handleDiscordInteraction(mockRequest, mockResponse).catch(err => {
    console.error('处理出错：', err);
  });
}

console.log("Test completed.");