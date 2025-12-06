const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Read .env.local manually to avoid dotenv dependency issues
function getEnvValue(key) {
    try {
        const envPath = path.join(__dirname, '.env.local');
        if (!fs.existsSync(envPath)) return null;
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

async function diagnose() {
    const apiKey = getEnvValue('GOOGLE_GENAI_API_KEY') || getEnvValue('GOOGLE_AI_API_KEY');

    if (!apiKey) {
        console.error("❌ No API Key found in .env.local");
        return;
    }

    console.log(`🔑 Found API Key (starts with: ${apiKey.substring(0, 4)}...)`);
    const genAI = new GoogleGenerativeAI(apiKey);

    // List of models to test
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-1.0-pro',
        'gemini-pro',
        'gemini-1.5-flash-latest'
    ];

    console.log("🔍 Testing models...");

    for (const modelName of models) {
        process.stdout.write(`Testing '${modelName}'... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`✅ SUCCESS!`);
            console.log(`\n🎉 SOLUTION: Please use model name: '${modelName}'`);
            return; // Stop after finding the first working one
        } catch (error) {
            console.log(`❌ Failed (${error.message.split('[')[0].trim()})`);
        }
    }

    console.log("\n❌ No working model found. Please check if your API key has access to Gemini API.");
}

diagnose();
