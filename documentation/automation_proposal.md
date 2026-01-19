# Content Automation & Expansion Proposal

## 1. The Core Problem: "Hallucinated News"
Currently, `articleWriter.js` asks Gemini to write news about "upcoming events" based solely on the current date.
*   **Issue:** Gemini (the model) does not know what happened *today* or *yesterday* in the real world. It generates plausible-sounding but potentially fictional or outdated news.
*   **Solution:** **Retrieval-Augmented Generation (RAG) Lite.** We must feed real-world headlines into the prompt so Gemini acts as a *commentator* rather than a *reporter*.

## 2. Architecture Overview
We will create a specialized automation pipeline running on your GCP instance.

```
+---------------------+
| Cron Job / Scheduler|
+----------+----------+
           |
           v
+----------+----------+
|   Content Strategy  |
+----+-----+------+---+
     |     |      |
     |     |      +------------------------+
     |     v                               v
     |  +--+-------------------+    +------+-------------------+
     |  | Morning: RSS Feeds   |    | Wrap-up: Market Indices  |
     |  | (CNBC, Reuters)      |    | (Yahoo Finance Data)     |
     |  +----------+-----------+    +----------+---------------+
     v             |                           |
+----+-------------+-----------+               |
| Earnings: Yahoo Finance Data |               |
+----------+-------------------+               |
           |                                   |
           v                                   v
      +----+-----------------------------------+---+
      |      Construct Context-Rich Prompt         |
      +--------------------+-----------------------+
                           |
                           v
      +--------------------+-----------------------+
      |      Gemini API (William Barnaby Persona)  |
      +--------------------+-----------------------+
                           |
                           v
              +------------+-------------+
              |      MySQL Database      |
              +--------------------------+
```

## 3. New Content Streams

### A. The "Market Pulse" (RSS Driven)
*   **Source:** Public RSS feeds (CNBC, WSJ, Google News - Technology/Finance sections).
*   **Mechanism:**
    1.  Script downloads the RSS XML.
    2.  Extracts the top 3 headlines and descriptions.
    3.  **Prompt:** "Here are the top 3 headlines from the real world: [List]. Write a commentary article connecting these threads..."
*   **Frequency:** Daily at 9:00 AM EST.

### B. "Earnings Whisperer" (Data Driven)
*   **Source:** `yahoo-finance2` (which we already installed).
*   **Mechanism:**
    1.  Script defines a watchlist (e.g., AAPL, NVDA, TSLA).
    2.  Checks `yahooFinance.quoteSummary(ticker)` for `earnings` data.
    3.  If an earnings date is within 3 days, trigger an article.
    4.  **Prompt:** "NVDA is trading at $[Price] with a PE of [PE]. Earnings are in 2 days. Analyze the stakes..."
*   **Frequency:** Daily check at 8:00 AM EST.

### C. "The Daily Close" (Performance Driven)
*   **Source:** `indicesService.js` (S&P 500, Nasdaq change %).
*   **Mechanism:**
    1.  Fetch the day's % change for indices.
    2.  Fetch the "Top Gainers" using Yahoo Finance modules.
    3.  **Prompt:** "The S&P 500 moved [X]% today. Identify if this is 'irrational exuberance' or a 'buying opportunity'..."
*   **Frequency:** Daily at 4:30 PM EST.

## 4. Implementation Plan

### Step 1: Install Utilities
We need a lightweight RSS parser.
```bash
npm install rss-parser node-cron
```

### Step 2: Refactor `articleWriter.js`
Split the monolithic script into a modular class structure:
*   `sources/rssProvider.js`
*   `sources/marketDataProvider.js`
*   `generators/geminiGenerator.js`

### Step 3: Image Automation
Currently, we leave `image_url` null or mock it.
*   **Upgrade:** Use the **Unsplash Source API** (Free, no key needed for simple embedding).
*   **Logic:** If the article is about "Tesla", auto-assign `https://source.unsplash.com/featured/?tesla,car`.

### Step 4: Scheduling (The "Set and Forget")
Create a `scheduler.js` entry point running on PM2.

```javascript
import cron from 'node-cron';

// Morning News (9 AM)
cron.schedule('0 14 * * *', () => runMorningBrief()); // 14:00 UTC = 9 AM EST

// Market Close (4:30 PM)
cron.schedule('30 21 * * *', () => runMarketClose()); // 21:30 UTC = 4:30 PM EST
```

## 5. Immediate Next Steps
1.  **Approve this plan.**
2.  I will verify `rss-parser` works on your instance.
3.  I will create the `scheduler.js` and the RSS integration.
