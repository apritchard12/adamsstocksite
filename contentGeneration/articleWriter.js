import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create a local pool for this script since lib/db.js relies on Next.js runtime or different path structure
// that might be brittle in standalone script execution.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stock_news',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// AWS SES Configuration
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error("Error: GEMINI_API_KEY is not defined in the environment variables.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

async function sendEmail(content) {
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
     console.warn("AWS Credentials not found, skipping email.");
     return;
  }

  const sesClient = new SESClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Destination: {
      ToAddresses: [process.env.EMAIL_TO],
    },
    Message: {
      Body: {
        Text: {
          Data: content,
        },
      },
      Subject: {
        Data: "Gemini Generated Content",
      },
    },
    Source: process.env.EMAIL_FROM,
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Email sent successfully:", data.MessageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

async function saveArticlesToDb(articles) {

    if (!articles || articles.length === 0) {

        console.log("No articles to save to database.");

        return;

    }



    console.log(`Attempting to save ${articles.length} articles to database...`);

    

    try {

        const connection = await pool.getConnection();

        

        try {

            await connection.beginTransaction();



            for (const article of articles) {

                // Prepare query

                // MOCK_NEWS/Schema fields: title, summary, content, category, related_tickers, author, image_url

                const query = `

                    INSERT INTO articles (title, summary, content, category, related_tickers, author, image_url)

                    VALUES (?, ?, ?, ?, ?, ?, ?)

                `;

                

                const values = [

                    article.title,

                    article.summary,

                    article.content,

                    article.category || 'Markets',

                    article.related_tickers || '',

                    article.author || 'William Barnaby',

                    article.image_url || null

                ];



                await connection.execute(query, values);

                console.log(`Saved article: "${article.title}"`);

            }



            await connection.commit();

            console.log("All articles committed to database successfully.");



        } catch (err) {

            await connection.rollback();

            console.error("Error inserting articles, rolling back:", err);

            throw err;

        } finally {

            connection.release();

        }



    } catch (err) {

        console.error("Database connection failed:", err);

    }

}



async function run() {

  try {

    // For text-only input, use the gemini-pro model

    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });



    const currentDate = new Date().toLocaleDateString('en-US', {

      timeZone: 'America/Chicago',

      month: 'long',

      day: 'numeric',

      year: 'numeric'

    });



    const prompt = `

    

    The current date is ${currentDate}.

    You are an AI journalist for a financial news outlet called Adam's Stock Site. You are not a human, you will assume the persona of Warren Buffett

     but will go by the alias William Barnaby.

      Your Style Guidelines:

      Tone: Calm, patient.

      Vocabulary: Use terms like 'margin of safety,' 'durable competitive advantage,' and 'Mr. Market.'

      Reaction to Volatility: When stocks drop, view it as a 'sale.' When stocks soar, warn about 'irrational exuberance.'

      Constraint: Never give financial advice. Always frame your output as 'educational commentary' or 'historical context.'

      Signature: William Barnaby

      

      Task:

      Write two news articles about major upcoming economic events next week, opec reports, jobs reports, retail numbers,

      cpi data etc. also consider earnings by major companies in the S&P 500 and nasdaq. Pick two of the most important topics which you 

      think will have high impact and explain the event and any possible outcomes and why they are important at this time.

      

      Additional guidance: If an earnings report is selected as a significant event occurring this week, make sure the article is just about

      one company, and provides the specific date of the upcoming earnings report.

      After selecting the two events to write about, do an independent search to verify that the subject you are to write about is in fact

      occurring in the next week. If it was actually in the past, select a new event to write about.

      If it is a FOMC meeting, please check to see that there was not a meeting that already occurred recently.

      

      Output Format:

      Strictly return a valid JSON array of objects. Do not wrap the JSON in markdown code blocks.

      Each object should have the following properties:

      - title: The headline of the article.

      - summary: A short 1-2 sentence summary of the article.

      - content: The full body of the article (plain text or markdown, but without title).

      - category: The category (e.g., 'Markets', 'Economy', 'Technology', 'Earnings').

      - related_tickers: A comma-separated string of related stock tickers (e.g., "AAPL, MSFT").

      - author: "William Barnaby"

      - image_url: A relevant unsplash image URL if warranted (or null).

      

      Example JSON Structure:

      [

        {

          "title": "Example Title",

          "summary": "Example summary...",

          "content": "Full article content...",

          "category": "Economy",

          "related_tickers": "SPY",

          "author": "William Barnaby",

          "image_url": "https://images.unsplash.com/..."

        }

      ]

    `;

    

    console.log(`Sending prompt...`);

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();



    console.log("\nResponse:");

    console.log(text);



    // Basic cleaning if the model wraps in code blocks despite instructions

    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    

    // Validate JSON parsing

    try {

        const parsed = JSON.parse(jsonStr);

        console.log("\nSuccessfully parsed JSON. Article count:", parsed.length);

        

        // Convert back to string for email or DB logging

        // For now, we still email the raw text or the parsed JSON string

        await sendEmail(JSON.stringify(parsed, null, 2));



        // Save to Database

        await saveArticlesToDb(parsed);



    } catch (e) {

        console.error("Failed to parse JSON response:", e);

        // Fallback to emailing raw text

        await sendEmail(text);

    } finally {

        // Close the pool when the script finishes

        await pool.end();

    }



  } catch (error) {

    console.error("Error generating content:", error);

  }

}



run();
