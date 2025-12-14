import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = 'AIzaSyBQFYJ-HRNzqH5IYQydnOWwSir5qXQga5g'; 

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
    // The SDK doesn't have a direct listModels method on the client instance easily accessible in this version?
    // Wait, the error message said "Call ListModels".
    // I suspect I might need to use a different way to list models or just the REST API.
    // However, looking at the docs, there should be a `genAI.getGenerativeModel`... wait.
    // The SDK usually has a ModelManager or similar?
    // Actually, looking at the source code of the error, it seems it's a standard API error.
    
    // Let's try to make a raw fetch request to list models if the SDK doesn't expose it easily.
    // But I'll try to find if the SDK has it.
    // For now, I'll try to use a simple fetch.
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
