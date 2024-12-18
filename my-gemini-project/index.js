const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use your actual API key here
const genAI = new GoogleGenerativeAI("AIzaSyBA-GoWZD5QV-XCkXlBdYSas9t0fLsjP-M");

async function generateContent() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Explain how AI works";

    try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    } catch (error) {
        console.error("Error generating content:", error);
    }
}

generateContent();