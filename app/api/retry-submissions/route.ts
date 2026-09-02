import { NextResponse } from "next/server";
import { Resend } from "resend";
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

const SUBMISSIONS_DIR = path.join(process.cwd(), ".submissions");
const SUBMISSIONS_LOG = path.join(SUBMISSIONS_DIR, "submissions.jsonl");
const MAX_RETRIES = 3;

/** Read all stored submissions from the log. */
async function readSubmissions(): Promise<StoredSubmission[]> {
  try {
    const content = await fs.readFile(SUBMISSIONS_LOG, "utf-8");
    return content
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StoredSubmission);
  } catch {
    return [];
  }
}

/** Update a submission in the log. */
async function updateSubmission(
  submission: StoredSubmission
): Promise<void> {
  try {
    const submissions = await readSubmissions();
    const updated = submissions.map((s) =>
      s.id === submission.id ? submission : s
    );
    const content = updated.map((s) => JSON.stringify(s)).join("\n") + "\n";
    await fs.mkdir(path.dirname(SUBMISSIONS_LOG), { recursive: true });
    await fs.writeFile(SUBMISSIONS_LOG, content, "utf-8");
  } catch (err) {
    console.error("Failed to update submissions:", err);
  }
}

/** Resend API key should be the same as in the environment. */
function buildEmailFromPayload(
  payload: any
): { subject: string; text: string; html: string; replyTo?: string } {
  function escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toParagraph(value: string) {
    return escapeHtml(value).replace(/\n/g, "<br/>");
  }

  if (payload.type === "recommend") {
    const subject = `[Recommend a Place] ${payload.place}`;
    const text = [
      `Place: ${payload.place}`,
      "",
      `Reason / significance: ${payload.reason}`,
      "",
      `Travelling there within the upcoming year: ${payload.planningToTravel}`,
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <p><strong>Place:</strong> ${escapeHtml(payload.place)}</p>
      <p><strong>Reason / significance:</strong><br/>${toParagraph(
        payload.reason
      )}</p>
      <p><strong>Travelling there within the upcoming year:</strong> ${
        payload.planningToTravel
      }</p>
      <hr />
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
    `;

    return { subject, text, html, replyTo: payload.email };
  }

  if (payload.type === "note") {
    const subject = `[Note] For ${payload.to} — from ${payload.name}`;
    const text = [
      `To: ${payload.to}`,
      `From: ${payload.name} (${payload.fromPlace})`,
      "",
      payload.note,
    ].join("\n");

    const html = `
      <p><strong>To:</strong> ${escapeHtml(payload.to)}</p>
      <p><strong>From:</strong> ${escapeHtml(payload.name)} — ${escapeHtml(
        payload.fromPlace
      )}</p>
      <hr />
      <p>${toParagraph(payload.note)}</p>
    `;

    return { subject, text, html, replyTo: undefined };
  }

  if (payload.type === "notify") {
    return {
      subject: `[Notify Me] ${payload.email}`,
      text: `Add to the project notification list: ${payload.email}`,
      html: `<p>Add to the project notification list: <strong>${escapeHtml(
        payload.email
      )}</strong></p>`,
      replyTo: payload.email,
    };
  }

  if (payload.type === "contact") {
    const subject = `[Contact] ${payload.subject}`;
    const text = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      "",
      payload.message,
    ].join("\n");

    const html = `
      <p><strong>From:</strong> ${escapeHtml(payload.name)} (${escapeHtml(
        payload.email
      )})</p>
      <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
      <hr />
      <p>${toParagraph(payload.message)}</p>
    `;

    return { subject, text, html, replyTo: payload.email };
  }

  throw new Error(`Unknown submission type: ${payload.type}`);
}

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Optional: check for admin auth token
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.RETRY_ADMIN_TOKEN;
  if (adminToken && authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const submissions = await readSubmissions();
    const toRetry = submissions.filter(
      (s) => !s.emailSent && s.retryCount < MAX_RETRIES
    );

    const results = await Promise.allSettled(
      toRetry.map(async (submission) => {
        const email = buildEmailFromPayload(submission.payload);

        const { error } = await resend.emails.send({
          from: "Gathering Is Real <contact@gatheringisreal.org>",
          to: process.env.CONTACT_EMAIL ?? "Gatheringisreal1@gmail.com",
          replyTo: email.replyTo,
          subject: email.subject,
          text: email.text,
          html: email.html,
        });

        if (error) {
          submission.retryCount += 1;
          submission.emailError = error.message || "Unknown error";
          await updateSubmission(submission);
          throw error;
        }

        submission.emailSent = true;
        submission.emailError = undefined;
        await updateSubmission(submission);
        return submission.id;
      })
    );

    const succeeded = results.filter(
      (r) => r.status === "fulfilled"
    ) as PromiseFulfilledResult<string>[];
    const failed = results.filter(
      (r) => r.status === "rejected"
    ) as PromiseRejectedResult[];

    return NextResponse.json({
      attempted: toRetry.length,
      succeeded: succeeded.length,
      failed: failed.length,
      ids: succeeded.map((r) => r.value),
    });
  } catch (err) {
    console.error("Retry submission error:", err);
    return NextResponse.json(
      { error: "Failed to process retries" },
      { status: 500 }
    );
  }
}

/** GET to check pending submissions */
export async function GET() {
  try {
    const submissions = await readSubmissions();
    const pending = submissions.filter((s) => !s.emailSent);
    const failed = submissions.filter(
      (s) => !s.emailSent && s.retryCount >= MAX_RETRIES
    );

    return NextResponse.json({
      total: submissions.length,
      pending: pending.length,
      failed: failed.length,
      submissions: pending.map((s) => ({
        id: s.id,
        timestamp: s.timestamp,
        type: s.payload.type,
        retryCount: s.retryCount,
        error: s.emailError,
      })),
    });
  } catch (err) {
    console.error("Failed to read submissions:", err);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
