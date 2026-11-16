"use client";

import Script from "next/script";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/** Renders server-fetched embed HTML, then loads Instagram's script after the page is idle. */
export default function InstagramEmbeds({ items }: { items: { url: string; html: string }[] }) {
  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
        {items.map((item) => (
          <div key={item.url} dangerouslySetInnerHTML={{ __html: item.html }} />
        ))}
      </div>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
        onError={() => {}}
      />
    </>
  );
}
