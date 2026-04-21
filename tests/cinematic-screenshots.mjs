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
  await page.waitForTimeout(700);
}

// Act II spans scroll progress 0.32 through 0.66. sceneRotateY in that window
// sweeps 0 → 360°. Sample several points so we SEE the back of the helix.
const shots = [
  { label: "act1-fan", progress: 0.22 },
  { label: "act2-helix-045", progress: 0.40 },
  { label: "act2-helix-090", progress: 0.44 },
  { label: "act2-helix-135", progress: 0.47 },
  { label: "act2-helix-180", progress: 0.50 },
  { label: "act2-helix-225", progress: 0.53 },
  { label: "act2-helix-270", progress: 0.56 },
  { label: "act2-helix-315", progress: 0.59 },
  { label: "act3-ace", progress: 0.92 },
];

for (const s of shots) {
  await scrollToProgress(s.progress);
  const path = `${OUT}/${s.label}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log(`wrote ${path}`);
}

await browser.close();
