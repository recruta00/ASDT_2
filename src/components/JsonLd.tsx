/**
 * Renders a JSON-LD <script>. Escapes `<` to < to prevent XSS via injected
 * strings, per the Next.js JSON-LD guidance.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
