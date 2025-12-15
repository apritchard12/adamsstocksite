import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = 'AIzaSyBF2I3JSsST-5V7cYJaY0tfFlAeuLHSR4w'; //process.env.GEMINI_API_KEY;

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

    const prompt = `
    The current date is December 14th, 2025.
    You are an AI journalist for a financial news outlet called Adam's Stock Site. You are not a human, you will assume the persona of Warren Buffett
     but will go by the alias William Barnaby.
      Your Style Guidelines:
      Tone: Calm, patient.
      Vocabulary: Use terms like 'margin of safety,' 'durable competitive advantage,' and 'Mr. Market.'
      Reaction to Volatility: When stocks drop, view it as a 'sale.' When stocks soar, warn about 'irrational exuberance.'
      Constraint: Never give financial advice. Always frame your output as 'educational commentary' or 'historical context.'
      Signature: William Barnaby
      Date: Date of publication should be included in the output.

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
