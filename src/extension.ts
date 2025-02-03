import * as vscode from 'vscode';
import ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {

	console.log('"deepseek-ext" is now active!');

    // Register a new command that starts the Deep Seek Chat panel
    // Contains all chat dialog
	const disposable = vscode.commands.registerCommand('deepseek-ext.start', () => {
		const panel = vscode.window.createWebviewPanel(
			'deepChat',
			'Deep Seek Chat',
			vscode.ViewColumn.One,
			{enableScripts: true}
		)

        // Webview 
		panel.webview.html = getWebViewContent()

		// Handle messages from the webview
		panel.webview.onDidReceiveMessage(async (message: any) => {
			if (message.command == 'chat') {
				const userPrompt = message.text // passes message to Ollama
				let responseText = ''

				try {
					const streamResponse = await ollama.chat({
						model: 'deepseek-r1:1.5b', // Change to whatever model you have
						messages: [{ role: 'user', content: userPrompt }],
						stream: true	
					})
                    
                    // Process the response in chunks and update the webview
                    // sends text to Ollama
                    // gives text sentence by sentence instead of waiting for the entire thing
					for await (const part of streamResponse) {
						responseText += part.message.content
						panel.webview.postMessage({command: 'chatResponse', text: responseText })
					}
				} catch (err) {
                    // Handle errors and send error message to the webview
					panel.webview.postMessage({command: 'chatResponse', text: 'Error: ${String(err)}' });
				}
			} 
		});
	 
	});

	context.subscriptions.push(disposable);
}

// Returns the HTML content for the webview panel
// Use es6-string-html extension to have syntax highlighting
function getWebViewContent(): string {
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />    
        <style>
            body {
                font-family: sans-serif;
                background-color: #1e1e1e;
                color: #d4d4d4;
                margin: 0;
                display: flex;
                flex-direction: column;
                height: 100vh;
                padding: 1rem;
            }
            h2 {
                text-align: center;
                color: #ffffff;
            }
            #chatContainer {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                overflow-y: auto;
                padding: 1rem;
                border: 1px solid #333;
                border-radius: 8px;
                background: #252526;
                max-height: 70vh;
            }
            #history {
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                padding: 1rem;
                border-bottom: 1px solid #444;
                margin-bottom: 10px;
            }
            .message {
                max-width: 80%;
                padding: 10px;
                margin: 8px;
                border-radius: 8px;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
                white-space: pre-wrap;
                background: #2d2d2d;
            }
            .user-message {
                align-self: flex-end;
                background-color: #007acc;
                color: white;
            }
            .bot-message {
                align-self: flex-start;
                background-color: #3c3c3c;
                color: #d4d4d4;
            }
            #inputContainer {
                display: flex;
                align-items: center;
                background: #252526;
                border-radius: 8px;
                padding: 5px;
                margin-top: 10px;
            }
            #prompt {
                flex-grow: 1;
                border: none;
                background: #333;
                color: #d4d4d4;
                padding: 10px;
                border-radius: 6px;
                outline: none;
                font-size: 14px;
            }
            #askBtn {
                background-color: #007acc;
                border: none;
                color: white;
                padding: 10px 15px;
                margin-left: 8px;
                border-radius: 6px;
                cursor: pointer;
                transition: 0.3s;
            }
            #askBtn:hover {
                background-color: #005f99;
            }
            #response {
                border-top: 1px solid #555;
                padding: 15px;
                margin-top: 10px;
                color: #d4d4d4;
                font-size: 14px;
                white-space: pre-wrap;
                background: #2d2d2d;
                border-radius: 6px;
                box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.2);
                display: none; 
            }
        </style>
    </head>
    <body>
        <h2>DeepSeek VS Code Extension</h2>
        
        <div id="chatContainer">
            <div id="history"></div> <!-- Stores all past inputs and responses -->
            <div id="response"></div> <!-- Keeps current response while it updates -->
        </div>
        
        <div id="inputContainer">
            <input id="prompt" type="text" placeholder="Ask something..." />
            <button id="askBtn">Send</button> 
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            const historyDiv = document.getElementById('history');
            const responseDiv = document.getElementById('response');
            const inputField = document.getElementById('prompt');
            const askButton = document.getElementById('askBtn');

            function addMessageToHistory(text, isUser = true) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
                messageDiv.textContent = text;
                historyDiv.appendChild(messageDiv);
                historyDiv.scrollTop = historyDiv.scrollHeight; 
            }

            askButton.addEventListener('click', () => {
                const text = inputField.value.trim();
                if (text === '') return;

                addMessageToHistory(text, true); // Store user input in history
                inputField.value = ''; // Clear input
                responseDiv.innerText = ""; // Clear previous response
                responseDiv.style.display = "block"; // Show live response
                vscode.postMessage({ command: 'chat', text });

                // Create a new response div for this input
                const newResponseDiv = document.createElement('div');
                newResponseDiv.classList.add('message', 'bot-message');
                historyDiv.appendChild(newResponseDiv);

                // Store reference to update it later
                responseDiv.dataset.currentResponse = newResponseDiv;
            });

            window.addEventListener('message', event => {
                const { command, text } = event.data;
                if (command === 'chatResponse') {
                    responseDiv.innerText = text; // Live update response

                    // Append response to the specific message div created for it
                    const latestResponseDiv = historyDiv.lastElementChild;
                    if (latestResponseDiv) {
                        latestResponseDiv.innerText = text;
                    }

                    // Hide #response once the response is finalized
                    // TODO: Find a better solution to hide the response
                    // I know this is terrible
                    if (text.endsWith("😊") || text.endsWith(".") || text.endsWith("!") || text.endsWith("?")) {
                        setTimeout(() => {
                            responseDiv.style.display = "none";
                        }, 500);
                    }
                }
            });

            // Pressing Enter to send message
            inputField.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    askButton.click();
                }
            });
        </script>
    </body>
    </html>
    `;
}

export function deactivate() {}