# DeepSeek R1 VS Code Extension

## Overview

The **DeepSeek R1 VS Code Extension** is an AI-powered chatbox that allows users to interact with the **DeepSeek-R1** model directly within VS Code.

## Features

- **AI-powered chat interface** integrated into VS Code.
- **Streaming responses** from the **DeepSeek R1:1.5b** model.
- **Real-time message updates**.

---

## Requirements

### Install Node.js
Ensure you have **Node.js (v18 or higher)** installed. Download it from the [Node.js official site](https://nodejs.org/).

### Install Ollama
Download **Ollama** from the [Ollama official website](https://ollama.com/download).

### Install DeepSeek R1 Model
Get the command from the [Ollama library](https://ollama.com/library/deepseek-r1).

---

## Installation & Setup

### Clone the Repository
```sh
git clone https://github.com/J-Cherian/DeepSeek-R1-EXT.git
```

### Navigate to the Project Directory
```sh
cd DeepSeek-R1-EXT
```

### Install Dependencies
```sh
npm install
```

### Build the Extension
```sh
npm run build
```

### Install Ollama via npm
```sh
npm install ollama
```

### VERY IMPORTANT: Change the Model 

It is **CRUCIAL** to update the model if you need a different version. Failure to do so may lead to unexpected results.

To change the model, navigate to `src/extensions.ts` and modify the following:
```sh
model: 'deepseek-r1:1.5b', // Change to whatever model you have
```

If you're unsure which models are available, run the following command to list all installed models:
```sh
ollama list
```

### Open in VS Code
1. Launch **VS Code** and open the project directory.
2. Open the **Command Palette** (`Ctrl + Shift + P` or `Cmd + Shift + P` on macOS) and select **Start Debugging**.
3. A new **VS Code window** will open with the extension installed.
4. In the new VS Code window, open the **Command Palette** again and select **Chat with DeepSeek**.
5. 🎉 You should now see the extension in action!

![DeepSeek R1 Extension](https://github.com/user-attachments/assets/4be65577-8b6c-4a8a-be5e-777ca7595cf7)

---

## Extension Settings
This extension currently does **not** provide configurable settings, but future updates may introduce customizable options.

---

## Known Issues
- Large inputs **may slow down response times**.
- If you experience unexpected behavior, ensure **all dependencies are properly installed**.

---

## Contributions

There will be many changes coming soon! Stay tuned for updates.

We welcome contributions! To contribute:

1. **Fork** the repository.
2. **Create a new branch** for your feature or fix:
   ```sh
   git checkout -b feature-branch
   ```
3. **Make your changes** and commit them with a descriptive message.
4. **Push the changes** to your fork:
   ```sh
   git push origin feature-branch
   ```
5. **Open a Pull Request (PR)** in the main repository.
6. I will review and approve changes as needed!

---

## Support
If you encounter any issues, please **open a GitHub issue** in the repository.

---

## More Information
- [🔗 Visual Studio Code Extension API](https://code.visualstudio.com/api)
- [🔗 Ollama Documentation](https://ollama.com/docs)
- [🔗 DeepSeek R1 Model](https://ollama.com/library/deepseek-r1)

**Enjoy using DeepSeek R1 in VS Code!** 
