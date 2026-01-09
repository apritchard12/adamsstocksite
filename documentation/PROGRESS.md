# Project Progress: Adam's Stock Site (William Barnaby AI)

## Current Status
- **Infrastructure:** Successfully set up a GCP `e2-micro` instance in a Free Tier region.
- **Networking:** 
    - Configured for **IPv6-only** to stay in the Free Tier (avoiding IPv4 charges).
    - **Cloudflare Bridge:** Domain `adamsstocksite.com` is registered/proxied through Cloudflare.
    - **Verification:** "Hello World" is currently live and accessible via IPv4 and IPv6 thanks to the Cloudflare proxy.
- **Environment:** 
    - Node.js (v20) installed on VM.
    - MySQL Server installed and running on VM.
- **Database Schema:** 
    - Table `articles` created to handle `preview` and `review` types.
    - Tracking `follow_up_status` (pending/completed) to handle automated follow-up articles.

## Implementation Details
- **Persona:** William Barnaby (Warren Buffett style: calm, patient, value-oriented).
- **Core Logic:**
    - **Mondays:** Generate 2 preview articles about upcoming economic events.
    - **Daily/Fridays:** Check DB for past events and generate "Review" follow-up articles.
- **Variables extracted:** `title`, `content`, `topic`, `event_date`.

## Next Steps
1. Refactor `index.js` to use `mysql2` and `@google/generative-ai`.
2. Implement the `cron.js` scheduler using `node-cron`.
3. Set up the `.env` file on the VM with the Gemini API Key and DB credentials.
4. Migrate the local code to the VM and start with `pm2`.
