import type { FaqItem } from "../content/pages";

// Hairline between reading-column sections (DOC_RULE in content/pages.ts).
export function DocRule() {
  return (
    <div className="container">
      <hr className="doc-rule" />
    </div>
  );
}

// Question and answer on the reading column, one hairline row each
// (renderFaq in content/pages.ts writes the same markup).
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <ul className="doc-list">
      {items.map((item) => (
        <li key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </li>
      ))}
    </ul>
  );
}
