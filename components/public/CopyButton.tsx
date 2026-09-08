"use client";

import { useState } from "react";
import { htmlToPlainText } from "@/lib/client/html";

export default function CopyButton({ html }: { html: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(htmlToPlainText(html));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently ignore: clipboard permission not granted
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex-none rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-white hover:shadow-glow"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
