import { GoogleGenerativeAI } from "@google/generative-ai";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
import pool from '../lib/db.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const sesClient = new SESClient({ region: "us-east-1" });

async function sendEmail(content) {
  const params = {
    Source: "no-reply@adams-stock-site.com",
    Destination: {
      ToAddresses: ["adam@example.com"],
    },
    Message: {
      Body: {
        Text: {
          Data: content,
        },
      },
      Subject: {
        Data: "Adam's Stock Site: New Articles Generated",
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function saveArticlesToDb(articles) {
    console.log(`Attempting to save ${articles.length} articles to database...`);
    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            for (const article of articles) {
                const query = `
                    INSERT INTO articles (title, summary, content, category, related_tickers, author, image_url, active)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const values = [
                    article.title,
                    article.summary,
                    article.content,
                    article.category || 'Markets',
                    article.related_tickers || '',
                    article.author || 'William Barnaby',
                    article.image_url || null,
                    1 // active
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
    Constraint: Never give financial advice. Always frame your output as 'educational commentary' or 'historical context.' don't add "signed author name" to the end of an articles content
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

    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
        const parsed = JSON.parse(jsonStr);
        console.log("\nSuccessfully parsed JSON. Article count:", parsed.length);
        await sendEmail(JSON.stringify(parsed, null, 2));
        await saveArticlesToDb(parsed);
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        await sendEmail(text);
    } finally {
        await pool.end();
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

run();
