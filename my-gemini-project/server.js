require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Use the API key from the environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.get('/', async (req, res) => {
    const model = genAI.getGenerativeModel({ model: "Gemini API" });
    const prompt = "Explain how AI works";

    try {
        const result = await model.generateContent(prompt);
        res.send(result.response.text); // Adjust based on the response structure
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).send("Error generating content");
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});