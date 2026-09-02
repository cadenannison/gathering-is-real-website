#!/usr/bin/env node
import { promises as fs } from "fs";
import path from "path";

type StoredSubmission = {
  id: string;
  timestamp: string;
  payload: any;
  emailSent: boolean;
  emailError?: string;
  retryCount: number;
};

const SUBMISSIONS_LOG = path.join(
  process.cwd(),
  ".submissions",
  "submissions.jsonl"
);

async function checkSubmissions() {
  try {
    const content = await fs.readFile(SUBMISSIONS_LOG, "utf-8");
    const submissions: StoredSubmission[] = content
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));

    const sent = submissions.filter((s) => s.emailSent);
    const pending = submissions.filter((s) => !s.emailSent);
    const failed = pending.filter((s) => s.retryCount >= 3);

    console.log("\n📊 Submission Status Report\n");
    console.log(`Total submissions: ${submissions.length}`);
    console.log(`✅ Successfully sent: ${sent.length}`);
    console.log(`⏳ Pending: ${pending.length}`);
    console.log(`❌ Failed (max retries): ${failed.length}\n`);

    if (pending.length > 0) {
      console.log("Pending Submissions:");
      pending.forEach((s) => {
        console.log(
          `  - [${s.id}] ${s.payload.type} (${new Date(s.timestamp).toLocaleString()}) - Retries: ${s.retryCount}`
        );
        if (s.emailError) {
          console.log(`    Error: ${s.emailError}`);
        }
      });
    }

    if (failed.length > 0) {
      console.log("\nFailed Submissions (exceeded max retries):");
      failed.forEach((s) => {
        console.log(
          `  - [${s.id}] ${s.payload.type} (${new Date(s.timestamp).toLocaleString()})`
        );
        if (s.emailError) {
          console.log(`    Error: ${s.emailError}`);
        }
      });
    }

    console.log(
      "\nTo retry failed submissions, run:\n  curl -X POST http://localhost:3000/api/retry-submissions\n"
    );
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("No submissions recorded yet.");
    } else {
      console.error("Error reading submissions:", err);
    }
  }
}

checkSubmissions().catch(console.error);
