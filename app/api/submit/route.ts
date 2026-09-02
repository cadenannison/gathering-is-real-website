import { NextResponse } from "next/server";
import { Resend } from "resend";
import { promises as fs } from "fs";
import path from "path";

type RecommendPayload = {
  type: "recommend";
  place: string;
  reason: string;
  planningToTravel: "yes" | "no";
  name: string;
  email: string;
  phone?: string;
};

type NotePayload = {
  type: "note";
  to: string;
  note: string;
  name: string;
  fromPlace: string;
};

type NotifyPayload = {
  type: "notify";
  email: string;
};

type ContactPayload = {
  type: "contact";
  name: string;
  email: string;
  subject: string;
  message: string;
};

type SubmitPayload =
  | RecommendPayload
  | NotePayload
  | NotifyPayload
  | ContactPayload;

type StoredSubmission = {
  id: string;
  timestamp: string;
  payload: SubmitPayload;
  emailSent: boolean;
  emailError?: string;
  retryCount: number;
};

const SUBMISSIONS_DIR = path.join(process.cwd(), ".submissions");
const SUBMISSIONS_LOG = path.join(SUBMISSIONS_DIR, "submissions.jsonl");

/** Escapes user input before it lands in an HTML email body. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Ensures submission storage directory exists. */
async function ensureSubmissionDir() {
  try {
    await fs.mkdir(SUBMISSIONS_DIR, { recursive: true });
  } catch {
    // Directory may already exist or be inaccessible
  }
}

/** Generate a unique submission ID. */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Store submission for redundancy and recovery. */
async function storeSubmission(
  submission: StoredSubmission
): Promise<boolean> {
  try {
    await ensureSubmissionDir();
    const line = JSON.stringify(submission) + "\n";
    await fs.appendFile(SUBMISSIONS_LOG, line, "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to store submission:", err);
    return false;
  }
}

/** Update submission status (e.g., mark as successfully sent). */
async function updateSubmissionStatus(
  id: string,
  emailSent: boolean,
  emailError?: string
): Promise<void> {
  try {
    await ensureSubmissionDir();
    const content = await fs.readFile(SUBMISSIONS_LOG, "utf-8");
    const lines = content.split("\n").filter(Boolean);
    const updated = lines.map((line) => {
      const submission = JSON.parse(line) as StoredSubmission;
      if (submission.id === id) {
        return JSON.stringify({ ...submission, emailSent, emailError });
      }
      return line;
    });
    await fs.writeFile(SUBMISSIONS_LOG, updated.join("\n") + "\n", "utf-8");
  } catch (err) {
    console.error("Failed to update submission status:", err);
  }
}

function toParagraph(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br/>");
}

function buildRecommendEmail(payload: RecommendPayload) {
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
    <p><strong>Reason / significance:</strong><br/>${toParagraph(payload.reason)}</p>
    <p><strong>Travelling there within the upcoming year:</strong> ${payload.planningToTravel}</p>
    <hr />
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
  `;

  return { subject, text, html, replyTo: payload.email };
}

function buildNoteEmail(payload: NotePayload) {
  const subject = `[Note] For ${payload.to} — from ${payload.name}`;
  const text = [
    `To: ${payload.to}`,
    `From: ${payload.name} (${payload.fromPlace})`,
    "",
    payload.note,
  ].join("\n");

  const html = `
    <p><strong>To:</strong> ${escapeHtml(payload.to)}</p>
    <p><strong>From:</strong> ${escapeHtml(payload.name)} — ${escapeHtml(payload.fromPlace)}</p>
    <hr />
    <p>${toParagraph(payload.note)}</p>
  `;

  return { subject, text, html, replyTo: undefined };
}

function buildContactEmail(payload: ContactPayload) {
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

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const payload = (await request.json()) as SubmitPayload;
  const submissionId = generateId();

  // Validate payload based on type
  if (payload.type === "recommend") {
    if (!payload.place || !payload.reason || !payload.name || !payload.email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
  } else if (payload.type === "note") {
    if (!payload.note || !payload.name || !payload.fromPlace) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
  } else if (payload.type === "notify") {
    if (!payload.email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
  } else if (payload.type === "contact") {
    if (
      !payload.name ||
      !payload.email ||
      !payload.subject ||
      !payload.message
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
  } else {
    return NextResponse.json(
      { error: "Invalid submission type" },
      { status: 400 }
    );
  }

  // Build email from payload
  let email: { subject: string; text: string; html: string; replyTo?: string };

  if (payload.type === "recommend") {
    email = buildRecommendEmail(payload);
  } else if (payload.type === "note") {
    email = buildNoteEmail(payload);
  } else if (payload.type === "notify") {
    email = {
      subject: `[Notify Me] ${payload.email}`,
      text: `Add to the project notification list: ${payload.email}`,
      html: `<p>Add to the project notification list: <strong>${escapeHtml(
        payload.email
      )}</strong></p>`,
      replyTo: payload.email,
    };
  } else {
    email = buildContactEmail(payload);
  }

  // Create submission record (before sending email for durability)
  const submission: StoredSubmission = {
    id: submissionId,
    timestamp: new Date().toISOString(),
    payload,
    emailSent: false,
    retryCount: 0,
  };

  const stored = await storeSubmission(submission);

  // Attempt to send email
  const { error } = await resend.emails.send({
    from: "Gathering Is Real <contact@gatheringisreal.org>",
    to: process.env.CONTACT_EMAIL ?? "Gatheringisreal1@gmail.com",
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  if (error) {
    // Email failed, but we have it stored
    await updateSubmissionStatus(
      submissionId,
      false,
      error.message || "Unknown error"
    );

    // Return success anyway since we've stored the submission
    return NextResponse.json(
      {
        success: true,
        stored: true,
        message: "Submission saved and will be retried",
      },
      { status: 202 }
    );
  }

  // Email succeeded, mark it
  await updateSubmissionStatus(submissionId, true);

  return NextResponse.json({
    success: true,
    id: submissionId,
    stored,
  });
}
