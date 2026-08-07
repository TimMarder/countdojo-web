import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

// CLAIM 1: arbitrary comma grids are invalid -> browser drops them -> single column.
const grids = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('[class*="grid-cols-["]').forEach((el) => {
    const cls = [...el.classList].find((c) => c.includes("grid-cols-["));
    const computed = getComputedStyle(el).gridTemplateColumns;
    out.push({
      cls,
      computed,
      columnCount: computed.split(/\s+/).filter(Boolean).length,
      heading: el.querySelector("h1,h2,h3")?.innerText?.slice(0, 40) || "",
    });
  });
  return out;
});

// CLAIM 2: unlayered globals.css beats Tailwind utilities.
const layerTest = await page.evaluate(() => {
  const results = {};
  // Pricing badges: `text-label text-emerald-accent` — should be emerald if utilities won.
  const badges = [...document.querySelectorAll(".text-label")].filter((el) =>
    el.className.includes("text-emerald-accent")
  );
  results.emeraldBadges = badges.map((b) => ({
    text: b.innerText.slice(0, 20),
    color: getComputedStyle(b).color,
  }));
  // site-shell max-w-4xl — should be 896px if utilities won, 1280px if .site-shell won.
  const shells = [...document.querySelectorAll(".site-shell")].filter((el) =>
    /max-w-(4xl|3xl)/.test(el.className)
  );
  results.shells = shells.map((s) => ({
    cls: [...s.classList].filter((c) => c.startsWith("max-w")).join(","),
    maxWidth: getComputedStyle(s).maxWidth,
  }));
  // link-mono text-paper-muted — should be muted #a8a29e if utilities won.
  const links = [...document.querySelectorAll(".link-mono")].filter((el) =>
    el.className.includes("text-paper-muted")
  );
  results.mutedLinks = links.slice(0, 3).map((l) => ({
    text: l.innerText.slice(0, 15),
    color: getComputedStyle(l).color,
  }));
  return results;
});

console.log("=== CLAIM 1: arbitrary comma grids ===");
const broken = grids.filter((g) => g.columnCount === 1);
console.log(`total arbitrary grids on page: ${grids.length}`);
console.log(`COLLAPSED to a single column: ${broken.length}`);
grids.slice(0, 8).forEach((g) =>
  console.log(`  ${g.columnCount} col | ${g.cls} -> "${g.computed}"  ${g.heading ? "[" + g.heading + "]" : ""}`)
);

console.log("\n=== CLAIM 2: unlayered CSS beating utilities ===");
console.log("emerald badges (expect rgb(52,211,153) if utilities win):");
layerTest.emeraldBadges.forEach((b) => console.log(`  "${b.text}" -> ${b.color}`));
console.log("site-shell + max-w-* (expect 896px/768px if utilities win, 1280px if not):");
layerTest.shells.forEach((s) => console.log(`  ${s.cls} -> ${s.maxWidth}`));
console.log("link-mono + text-paper-muted (expect rgb(168,162,158) if utilities win):");
layerTest.mutedLinks.forEach((l) => console.log(`  "${l.text}" -> ${l.color}`));

await browser.close();
