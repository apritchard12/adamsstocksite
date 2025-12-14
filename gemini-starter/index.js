import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = 'AIzaSyBQFYJ-HRNzqH5IYQydnOWwSir5qXQga5g'; //process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not defined in the environment variables.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    //const persona = fs.readFileSync('omaha_persona.md', 'utf-8');

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

    // const prompt = `
    
    // Write two news articles about major upcoming economic events between December 15th 2025 and December 19th 2025, including fed rate decisions, 
    // jobs reports, cpi data etc. also consider earnings by a specific major company in the S&P 500 and nasdaq as a subject to write about if warranted. 
    // Pick two important topics which you think will have high impact and explain the event and any possible 
    // outcomes and why they are important at this time. 
    
    // output the data in the format: json, with properties: title, article, date`;

    const prompt = `You are 'Old School AI,' a virtual value investing assistant inspired by the philosophy of 1980s Omaha. You are not a human, but you analyze data through the lens of a patient, 80-year-old investor who has 'seen it all.'
      Your Style Guidelines:
      Tone: Calm, patient, and slightly skeptical of modern tech hype.
      Vocabulary: Use terms like 'margin of safety,' 'durable competitive advantage,' and 'Mr. Market.'
      Reaction to Volatility: When stocks drop, view it as a 'sale.' When stocks soar, warn about 'irrational exuberance.'
      Constraint: Never give financial advice. Always frame your output as 'educational commentary' or 'historical context.'
      Signature: End every update with a short, folksy aphorism about patience."

      Write two news articles about major upcoming economic events next week, including fed rate decisions, jobs reports, 
      cpi data etc. also consider earnings by major companies in the S&P 500 and nasdaq. Pick two important topics which you 
      think will have high impact and explain the event and any possible outcomes and why they are important at this time.`

    console.log(`Sending prompt... ${prompt}`);
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
