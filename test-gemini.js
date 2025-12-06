const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        console.error("❌ No GOOGLE_AI_API_KEY found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("Fetching available models...");
        // For listing models, we don't need to instantiate a specific model first
        // But the SDK doesn't expose listModels directly on the main class in all versions.
        // Let's try to just use a known model to check connection, or print error.

        // Actually, the SDK does not have a simple 'listModels' helper in the main entry.
        // We will try to generate content with 'gemini-pro' and 'gemini-1.5-flash' and see which one works.

        const modelsToTest = ['gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.0-pro', 'gemini-1.5-pro'];

        for (const modelName of modelsToTest) {
            console.log(`\nTesting model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, are you working?");
                const response = await result.response;
                console.log(`✅ SUCCESS! Model '${modelName}' is working.`);
                console.log(`Response: ${response.text()}`);
                return; // Found a working one!
            } catch (error) {
                console.log(`❌ Failed with '${modelName}': ${error.message.split('\n')[0]}`);
            }
        }

        console.log("\n❌ Could not find a working model from the common list.");

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
