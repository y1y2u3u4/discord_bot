const { TodoistApi } = require("@doist/todoist-api-typescript");


const api = new TodoistApi("b1b1a6b8a8f96ca137392acbd5fdc8db00db0314")
api.getProjects()
    .then((projects) => console.log(projects))
    .catch((error) => console.log(error))

// 假设 roamTasks 是一个从 Roam Research 提取的任务数组
const roamTasks = ["Task 1", "Task 2", "Task 3"];

// 替换为你的 Todoist API Token
const TODOIST_API_TOKEN = 'your_api_token_here';

// Todoist API endpoint for tasks
const TODOIST_TASKS_URL = 'https://api.todoist.com/rest/v1/tasks';

roamTasks.forEach((task) => {
    fetch(TODOIST_TASKS_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TODOIST_API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: task
            // 你也可以设置其他字段，比如 'due_string', 'priority' 等。
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            console.log(`Successfully added ${task} to Todoist.`);
        } else {
            console.log(`Failed to add ${task} to Todoist.`);
        }
    })
    .catch((error) => {
        console.log(`Error: ${error}`);
    });
});
