import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not defined in the environment variables.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Hello! Tell me a fun fact about Node.js.";

    console.log(`Sending prompt: "${prompt}"...`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\nResponse:");
    console.log(text);
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

run();
