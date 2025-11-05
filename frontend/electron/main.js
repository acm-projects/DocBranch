const { app, BrowserWindow } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const openai = new OpenAI({
  //baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.API_KEY,
});

let mainWindow;

async function callAI() {
  try {
    console.log('Calling OpenAI...');
    // const completion = await openai.chat.completions.create({
    //   //model: 'deepseek/deepseek-r1-0528-qwen3-8b:free'
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'user', content: 'What is the meaning of life?' }],
    // });

    // Dummy response for testing without actual API call (cause these things expensive af)
    const completion = {
      "id": "chatcmpl-abc123",
      "object": "chat.completion",
      "created": 1690000000,
      "model": "gpt-3.5-turbo",
      "choices": [
        {
          "index": 0,
          "message": {
            "role": "assistant",
            "content": "The meaning of life is a question that has fascinated philosophers, scientists, and thinkers for centuries. Many believe it is about finding happiness, purpose, and connection with others, while others see it as a journey of personal growth and discovery."
          },
          "finish_reason": "stop"
        }
      ],
      "usage": {
        "prompt_tokens": 15,
        "completion_tokens": 32,
        "total_tokens": 47
      }
    }

    const aiResponse = completion.choices[0].message.content;
    console.log('Got AI response:', aiResponse);

    // Directly run JS in renderer to update DOM
    if (mainWindow && aiResponse) {
      mainWindow.webContents.executeJavaScript(
        `window.electronAPI.setElementText('output', ${JSON.stringify(aiResponse)});`
      );
    }
  } catch (err) {
    console.error('OpenAI call failed:', err);
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(
        `window.electronAPI.setElementText('output', 'Error: ${err.message}');`
      );
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.on('did-finish-load', () => {
    callAI();
  });
}

app.whenReady().then(createWindow);
