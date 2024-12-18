// Load environment variables from .env file
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use the API key from the environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateContent() {
    const model = genAI.getGenerativeModel({ model: "Gemini API" });
    const prompt = "Explain how AI works";

    try {
        const result = await model.generateContent(prompt);
        // Adjust this line based on the actual response structure
        console.log(result.response.text); // or result.response.text() if it's a function
    } catch (error) {
        console.error("Error generating content:", error);
    }
}

generateContent();