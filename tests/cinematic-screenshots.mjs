import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL = "http://localhost:3000";
const OUT = "/tmp/cinematic";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });

async function scrollToProgress(p) {
  await page.evaluate((p) => {
    const section = document.querySelector(".cinematic-section");
    const rect = section.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const sectionHeight = rect.height;
    const viewport = window.innerHeight;
    const scrollableSpan = sectionHeight - viewport;
    window.scrollTo({ top: sectionTop + scrollableSpan * p, behavior: "instant" });
  }, p);
  // let any transitions settle
  await page.waitForTimeout(700);
}

const shots = [
  { label: "hero", scroll: async () => window.scrollTo(0, 0), wait: 400 },
  { label: "act1-deal", progress: 0.12 },
  { label: "act1-fan-settled", progress: 0.22 },
  { label: "act2-helix-quarter", progress: 0.4 },
  { label: "act2-helix-mid", progress: 0.5 },
  { label: "act3-converge-start", progress: 0.75 },
  { label: "act3-ace-forward", progress: 0.92 },
];

for (const s of shots) {
  if (s.progress !== undefined) {
    await scrollToProgress(s.progress);
  } else if (s.scroll) {
    await page.evaluate(s.scroll);
    await page.waitForTimeout(s.wait ?? 400);
  }
  const path = `${OUT}/${s.label}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log(`wrote ${path}`);
}

await browser.close();
