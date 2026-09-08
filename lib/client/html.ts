export function htmlToPlainText(html: string): string {
  if (typeof window === "undefined") return html.replace(/<[^>]+>/g, "");

  const doc = new DOMParser().parseFromString(html, "text/html");
  const lines: string[] = [];

  function walk(node: ChildNode) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) lines.push(text);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === "ul" || tag === "ol") {
      const items = Array.from(el.children).filter(
        (c) => c.tagName.toLowerCase() === "li"
      );
      items.forEach((li, i) => {
        const prefix = tag === "ol" ? `${i + 1}. ` : "- ";
        lines.push(`${prefix}${li.textContent?.trim() ?? ""}`);
      });
      return;
    }

    if (tag === "p" || tag === "div") {
      const text = el.textContent?.trim();
      if (text) lines.push(text);
      return;
    }

    el.childNodes.forEach(walk);
  }

  doc.body.childNodes.forEach(walk);
  return lines.join("\n\n");
}
