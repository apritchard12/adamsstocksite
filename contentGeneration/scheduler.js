import cron from 'node-cron';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptPath = path.join(__dirname, 'articleWriter.js');

function runArticleWriter() {
  console.log(`[${new Date().toISOString()}] Starting article generation...`);
  
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`[${new Date().toISOString()}] Error executing articleWriter:`, error);
      return;
    }
    if (stderr) {
      console.error(`[${new Date().toISOString()}] articleWriter stderr:`, stderr);
    }
    console.log(`[${new Date().toISOString()}] articleWriter success:\n${stdout}`);
  });
}

// Schedule for 9:00 AM EST (14:00 UTC) every day
// Syntax: minute hour day-of-month month day-of-week
cron.schedule('0 14 * * *', () => {
  console.log('Running scheduled morning brief article generation...');
  runArticleWriter();
});

// Schedule for 4:30 PM EST (21:30 UTC) every day
cron.schedule('30 21 * * *', () => {
  console.log('Running scheduled market close article generation...');
  runArticleWriter();
});

console.log('Content Generation Scheduler started.');
console.log('Scheduled tasks: 9:00 AM EST and 4:30 PM EST daily.');
