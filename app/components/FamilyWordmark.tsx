import paths from "./family-mark-paths.json";

// Exact outlined letters from the reviewed WEB-2 pick-components.mjs renderer.
export function FamilyWordmark({ brand = "u", cap = 24, ground = "cream" }: {
  brand?: "u" | "z";
  cap?: number;
  ground?: "cream" | "ink" | "field";
}) {
  const width = brand === "u" ? 465 : 377.2778;
  let drawing = brand === "z" && cap <= 32 ? paths.zSmall : paths[brand];
  if (ground === "cream") drawing = drawing.replaceAll("#FFF4EC", brand === "u" ? "#C2410C" : "#002C9B").replaceAll("#729EFF", "#002C9B");
  if (ground === "field") drawing = drawing.replaceAll("#C2410C", "#FFF4EC").replaceAll("#729EFF", "#FFF4EC");
  if (cap <= 32 && brand === "u") drawing = drawing.replaceAll("V14", "V20");
  return <svg className="family-wordmark" data-brand={brand} data-cap={cap} data-ground={ground}
    width={width * cap / 100} height={cap} viewBox={`0 0 ${width} 100`}
    role="img" aria-label={brand === "u" ? "Uoink" : "Zing"}
    dangerouslySetInnerHTML={{ __html: drawing }} />;
}
