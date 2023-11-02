async function fetchTodoistProjects() {
    const token = "b1b1a6b8a8f96ca137392acbd5fdc8db00db0314";  // 你的 Todoist API Token

    try {
        const response = await fetch('https://api.todoist.com/rest/v2/projects', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data from Todoist API:", error);
    }
}

// 当你需要运行此函数时，可以在控制台或你的代码环境中调用：
fetchTodoistProjects();

async function fetchTodoistSections(projectId) {
    const token = "b1b1a6b8a8f96ca137392acbd5fdc8db00db0314";  // 你的 Todoist API Token
    const url = `https://api.todoist.com/rest/v2/sections?project_id=${projectId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching sections from Todoist API:", error);
    }
}

// 当你需要运行此函数并获取具体项目的部分内容时，可以调用：
fetchTodoistSections("2318831044");


async function createTodoistSection(projectId, sectionName) {
    const token = "b1b1a6b8a8f96ca137392acbd5fdc8db00db0314";  // 你的 Todoist API Token
    const url = "https://api.todoist.com/rest/v2/sections";

    const payload = {
        project_id: projectId,
        name: sectionName
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) // 把 JavaScript 对象转换为 JSON 字符串
        });
        
        const data = await response.json();
        console.log(data);
        console.log(data.id);
        return data;
    } catch (error) {
        console.error("Error creating section in Todoist:", error);
    }
}
// 当你想要创建一个名为 "Groceries" 的部分在项目 2203306141 中时，你可以调用：
// createTodoistSection("2318831044", "B端灵活计价");
async function createTodoistTaskInSection(content, due_date, priority, sectionId) {
    const token = "b1b1a6b8a8f96ca137392acbd5fdc8db00db0314";  // 你的 Todoist API Token
    const url = "https://api.todoist.com/rest/v2/tasks";

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const uuid = generateUUID();

 // 开始构建 payload
    const payload = {
        content: content,
        priority: priority,
        section_id: sectionId // 指定 section_id
    };

    // 如果 due_date 存在且有值，则添加到 payload
    if (due_date) {
        payload.due_date = due_date;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Request-Id': uuid
            },
            body: JSON.stringify(payload) 
        });
        
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error creating task in Todoist:", error);
    }
}

// 调用函数，传递5个参数，包括 sectionId
// createTodoistTaskInSection("实验上线", "tomorrow at 12:00", "en", 4, 133557904);
//获取当前的roam的内容，page名称、block内容、block的uid
function getPageOnblock(block) {
    // returns the uid of a specific block on a specific page.
    // _page_: the title of the page.
    // _block_: the text of the block.
    let results = window.roamAlphaAPI.q(`
      [:find ?page_title
       :in $ ?block_uid
       :where
       [?page :node/title ?page_title]
       [?page :block/uid ?page_uid]
       [?block :block/parents ?page]
       [?block :block/string ?block_string]
       [?block :block/uid ?block_uid]
      ]`, block);
    console.log(results);
    if (results.length) {
      return results[0][0];
    }
  }
    
const textareaUid = window.roamAlphaAPI.ui.getFocusedBlock()?.["block-uid"];
console.log(textareaUid);
const pagename=getPageOnblock(textareaUid);
//获取page内特定blockstring的子内部并且建个循环组实现传输
function getblockOnpage(page,block) {
    // returns the uid of a specific block on a specific page.
    // _page_: the title of the page.
    // _block_: the text of the block.
    let results = window.roamAlphaAPI.q(`
      [:find ?block_uid
       :in $ ?page_title ?block_string
       :where
       [?page :node/title ?page_title]
       [?page :block/uid ?page_uid]
       [?block :block/parents ?page]
       [?block :block/string ?block_string]
       [?block :block/uid ?block_uid]
      ]`, page,block);
    console.log(results);
    if (results.length) {
      return results[0][0];
    }
  }

const textareaUid_1 =getblockOnpage(pagename,"拆解&Project schedule::");
// 定义一个函数来检查和转换日期
function extractDateFromBlockString(blockString) {
    // 使用正则表达式捕获日期格式
    const dateRegex = /\[\[(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2})(st|nd|rd|th)?, (\d{4})\]\]/;
    const match = blockString.match(dateRegex);

    if (match) {
        // 从匹配到的组中提取月份、日和年份
        const monthName = match[1];
        const day = match[2];
        const year = match[4];

        // 使用Date对象转换月份名称为月份数字
        const monthNumber = new Date(`${monthName} 1, 1970`).getMonth() + 1; // JS的月份从0开始

        // 返回YYYY-MM-DD格式
        return `${year}-${String(monthNumber).padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return null;
}

async function processTasks(pagename, textareaUid_1) {
    const project_Section = await createTodoistSection("2318831044", pagename);
    const project_Section_id = project_Section.id;

    console.log("project_Section_id:", project_Section_id);

    const blockChildren = window.roamAlphaAPI.pull('[* {:block/children [*]}]', [":block/uid", textareaUid_1])[':block/children'];
    
    // 根据 :block/order 对 blockChildren 进行排序
    blockChildren.sort((a, b) => a[':block/order'] - b[':block/order']);
    
    for (let child of blockChildren) {
        const blockString = child[':block/string'];
        const dateInString = extractDateFromBlockString(blockString);

        if (blockString) {
            console.log(blockString);
            console.log(dateInString);
            await createTodoistTaskInSection(blockString, dateInString, 4, project_Section_id);
        }
    }
}


// 调用 processTasks 函数
processTasks(pagename, textareaUid_1);




// const project_Section=await createTodoistSection("2318831044", pagename);
// const project_Section_id=project_Section.id;
// console.log("project_Section_id:", project_Section_id);
// const blockChildren = window.roamAlphaAPI.pull('[* {:block/children [*]}]',[":block/uid",textareaUid_1])[':block/children'];
// blockChildren.sort((a, b) => a[':block/order'] - b[':block/order']);
// blockChildren.forEach(child => {
//     const blockString = child[':block/string'];
//     const dateInString = extractDateFromBlockString(blockString);

//     if (blockString) {
//         console.log(blockString);
//         console.log(dateInString);
//         createTodoistTaskInSection(blockString, dateInString, 4, project_Section_id);
//     }
// });



// window.roamAlphaAPI.pull('[* {:block/children [*]}]',[":block/uid","NOI9B6HiK"])[':block/children'][0][':block/string']
// "bot完成提醒及内容接收 [[October 9th, 2023]]"




// //获取位置的内容
// window.roamAlphaAPI.pull('[*]',864)
// //获取blockuid的内容
// window.roamAlphaAPI.pull('[*]',[":block/uid","FnOHNxU4M"])
// window.roamAlphaAPI.pull('[*]',[":node/title","roam/js"])
// window.roamAlphaAPI.pull('[* {:block/children [*]}]',[":node/title","roam/js"])









// const textareaUid = window.roamAlphaAPI.ui.getFocusedBlock()?.["block-uid"];
// try {
//     if (textareaUid) {
//       const blockUid = textareaUid;
//       window.roamAlphaAPI.updateBlock({
//         "block": {
//           "uid": blockUid,
//           "string": textarea.value
//         }
//       });
//     } else {
//       console.error("Error: Unable to find block UID.");
//     }
//   } catch (error) {
//     console.error("Error updating block:", error);
//   }

//   function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }
  
//   function getPage(page) {
//     // returns the uid of a specific page in your graph.
//     // _page_: the title of the page.
//     let results = window.roamAlphaAPI.q(`
//       [:find ?uid
//        :in $ ?title
//        :where
//        [?page :node/title ?title]
//        [?page :block/uid ?uid]
//       ]`, page);
//     if (results.length) {
//       return results[0][0];
//     }
//   }
  
//   async function getOrCreatePage(page) {
//     // returns the uid of a specific page in your graph, creating it first if it does not already exist.
//     // _page_: the title of the page.
    
//     roamAlphaAPI.createPage({page: {title: page}});
//     let result;
//     while (!result) {
//       await sleep(25);
//       result = getPage(page);
//     }
//     return result;
//   }
  
//   async function getOrCreatePage_x(page) {
//     // returns the uid of a specific page in your graph, creating it first if it does not already exist.
//     // _page_: the title of the page.
//     let result = getPage(page);
//     if (result) return result;
//     return getOrCreatePage(page);
//   }
  
  
  
  
//   function getBlockOnPage(page, block) {
//     // returns the uid of a specific block on a specific page.
//     // _page_: the title of the page.
//     // _block_: the text of the block.
//     let results = window.roamAlphaAPI.q(`
//       [:find ?block_uid
//        :in $ ?page_title ?block_string
//        :where
//        [?page :node/title ?page_title]
//        [?page :block/uid ?page_uid]
//        [?block :block/parents ?page]
//        [?block :block/string ?block_string]
//        [?block :block/uid ?block_uid]
//       ]`, page, block);
//     if (results.length) {
//       return results[0][0];
//     }
//   }
  
//   async function createBlockOnPage(page, block, order) {
//     // creates a new top-level block on a specific page, returning the new block's uid.
//     // _page_: the title of the page.
//     // _block_: the text of the block.
//     // _order_: (optional) controls where to create the block, 0 for top of page, -1 for bottom of page.
//     let page_uid = getPage(page);
//     return createChildBlock(page_uid, block, order);
//   }
  
//   async function getOrCreateBlockOnPage(page, block, order) {
//     // returns the uid of a specific block on a specific page, creating it first as a top-level block if it's not already there.
//     // _page_: the title of the page.
//     // _block_: the text of the block.
//     // _order_: (optional) controls where to create the block, 0 for top of page, -1 for bottom of page.
//     let block_uid = getBlockOnPage(page, block);
//     if (block_uid) return block_uid;
//     return createBlockOnPage(page, block, order);
//   }
  
//   function getChildBlock(parent_uid, block) {
//     // returns the uid of a specific child block underneath a specific parent block.
//     // _parent_uid_: the uid of the parent block.
//     // _block_: the text of the child block.
//     let results = window.roamAlphaAPI.q(`
//       [:find ?block_uid
//        :in $ ?parent_uid ?block_string
//        :where
//        [?parent :block/uid ?parent_uid]
//        [?block :block/parents ?parent]
//        [?block :block/string ?block_string]
//        [?block :block/uid ?block_uid]
//       ]`, parent_uid, block);
//     if (results.length) {
//       return results[0][0];
//     }
//   }
  
//   async function getOrCreateChildBlock(parent_uid, block, order) {
//     // creates a new child block underneath a specific parent block, returning the new block's uid.
//     // _parent_uid_: the uid of the parent block.
//     // _block_: the text of the new block.
//     // _order_: (optional) controls where to create the block, 0 for inserting at the top, -1 for inserting at the bottom.
//     let block_uid = getChildBlock(parent_uid, block);
//     if (block_uid) return block_uid;
//     return createChildBlock(parent_uid, block, order);
//   }
  
//   async function createChildBlock(parent_uid, block, order) {
//     // returns the uid of a specific child block underneath a specific parent block, creating it first if it's not already there.
//     // _parent_uid_: the uid of the parent block.
//     // _block_: the text of the child block.
//     // _order_: (optional) controls where to create the block, 0 for inserting at the top, -1 for inserting at the bottom.
//     if (!order) {
//       order = 0;
//     }
//     window.roamAlphaAPI.createBlock(
//       {
//         "location": {"parent-uid": parent_uid, "order": order},
//         "block": {"string": block}
//       }
//     );
//     let block_uid;
//     while (!block_uid) {
//       await sleep(25);
//       block_uid = getChildBlock(parent_uid, block);
//     }
//     return block_uid;
//   }
  
//   window.getPage = getPage;
//   window.getOrCreatePage = getOrCreatePage;
//   window.getBlockOnPage = getBlockOnPage;
//   window.createBlockOnPage = createBlockOnPage;
//   window.getOrCreateBlockOnPage = getOrCreateBlockOnPage;
//   window.getChildBlock = getChildBlock;
//   window.getOrCreateChildBlock = getOrCreateChildBlock;
//   window.createChildBlock = createChildBlock;


