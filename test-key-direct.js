const { GoogleGenerativeAI } = require("@google/generative-ai");

// PASTE YOUR KEY HERE TO TEST DIRECTLY
const TEST_KEY = "AIzaSyBfZBv_hb1GfxjCeKWwtlEqbtM_fNEG-3o";

async function testKey() {
    console.log("Testing key:", TEST_KEY.substring(0, 10) + "...");

    const genAI = new GoogleGenerativeAI(TEST_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log("✅ SUCCESS! Response:", response.text());
    } catch (error) {
        console.error("❌ FAILED:", error.message);
    }
}

testKey();
