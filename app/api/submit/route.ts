import { NextResponse } from "next/server";
import { Resend } from "resend";

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

/** Escapes user input before it lands in an HTML email body. */
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

  let email: { subject: string; text: string; html: string; replyTo?: string };

  if (payload.type === "recommend") {
    if (!payload.place || !payload.reason || !payload.name || !payload.email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    email = buildRecommendEmail(payload);
  } else if (payload.type === "note") {
    if (!payload.note || !payload.name || !payload.fromPlace) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    email = buildNoteEmail(payload);
  } else if (payload.type === "notify") {
    if (!payload.email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    email = {
      subject: `[Notify Me] ${payload.email}`,
      text: `Add to the project notification list: ${payload.email}`,
      html: `<p>Add to the project notification list: <strong>${escapeHtml(
        payload.email
      )}</strong></p>`,
      replyTo: payload.email,
    };
  } else if (payload.type === "contact") {
    if (
      !payload.name ||
      !payload.email ||
      !payload.subject ||
      !payload.message
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    email = buildContactEmail(payload);
  } else {
    return NextResponse.json(
      { error: "Invalid submission type" },
      { status: 400 }
    );
  }

  const { error } = await resend.emails.send({
    from: "Gathering Is Real <contact@gatheringisreal.org>",
    to: process.env.CONTACT_EMAIL ?? "Gatheringisreal1@gmail.com",
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
