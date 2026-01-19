import { GoogleGenerativeAI } from "@google/generative-ai";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
import pool from '../lib/db.js';
import { getTopHeadlines } from '../services/rssService.js';
import { fetchIndicesRaw } from '../services/indicesFetcher.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const sesClient = new SESClient({ 
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function sendEmail(content) {
  if (!process.env.AWS_ACCESS_KEY_ID) {
    console.log("Skipping email: AWS credentials not configured.");
    return;
  }

  const params = {
    Source: process.env.EMAIL_FROM,
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const currentDate = new Date().toLocaleDateString('en-US', {
      timeZone: 'America/Chicago',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    console.log("Fetching real-world context...");
    const [headlines, indices] = await Promise.all([
      getTopHeadlines(5),
      fetchIndicesRaw()
    ]);

    const headlineContext = headlines.map(h => `- ${h.title} (Source: ${h.source})`).join('\n');
    const indexContext = indices.map(i => `- ${i.name}: ${i.value} (${i.change})`).join('\n');

    const prompt = `
    The current date is ${currentDate}.
    
    REAL-WORLD CONTEXT:
    Top Financial Headlines Today:
    ${headlineContext}
    
    Current Market Status:
    ${indexContext}

    You are an AI journalist for a financial news outlet called Adam's Stock Site. You are not a human, you will assume the persona of Warren Buffett
    but will go by the alias William Barnaby.
    
    Your Style Guidelines:
    Tone: Calm, patient, wise.
    Vocabulary: Use terms like 'margin of safety,' 'durable competitive advantage,' and 'Mr. Market.'
    Reaction to Volatility: When stocks drop, view it as a 'sale.' When stocks soar, warn about 'irrational exuberance.'
    Constraint: Never give financial advice. Always frame your output as 'educational commentary' or 'historical context.'
    
    Task:
    Based on the REAL-WORLD CONTEXT provided above, write two insightful articles. One should focus on a major headline or trend, and the other should analyze the current market performance or a specific company mentioned in the news.
    Ensure your commentary reflects the current state of the market as provided in the context.
    
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
    `;
    
    console.log(`Sending prompt to Gemini...`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
        const parsed = JSON.parse(jsonStr);
        console.log("\nSuccessfully parsed JSON. Article count:", parsed.length);
        await saveArticlesToDb(parsed);
        await sendEmail(JSON.stringify(parsed, null, 2));
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
