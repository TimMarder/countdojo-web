import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const URL = "http://localhost:3200";
const OUT = process.argv[2] || "/tmp/countdojo-visual-audit";
await mkdir(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });
const report = {};

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.name === "mobile",
    hasTouch: vp.name === "mobile",
  });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300));
  });
  page.on("pageerror", (e) => consoleErrors.push("PAGEERROR: " + String(e).slice(0, 300)));

  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);

  // Enumerate every top-level section so we shoot each one individually.
  const sections = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("main > *, main section, section").forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.height < 40) return;
      const cls = (el.className || "").toString().split(/\s+/).slice(0, 3).join(".");
      const heading = el.querySelector("h1,h2,h3")?.innerText?.slice(0, 60) || "";
      out.push({ i, cls, heading, top: window.scrollY + r.top, height: r.height });
    });
    return out;
  });

  // Horizontal-overflow check — a classic "janky" tell.
  const overflow = await page.evaluate(() => {
    const bad = [];
    const docW = document.documentElement.clientWidth;
    document.querySelectorAll("*").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > docW + 2 || r.left < -2)) {
        bad.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 80),
          left: Math.round(r.left),
          right: Math.round(r.right),
          docW,
        });
      }
    });
    return bad.slice(0, 25);
  });

  // Tap-target audit (mobile especially) — sub-44px interactive elements.
  const smallTargets = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll("a,button,[role=button],input,select,summary").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.height < 44 || r.width < 44) {
        bad.push({
          tag: el.tagName.toLowerCase(),
          text: (el.innerText || el.getAttribute("aria-label") || "").slice(0, 40),
          w: Math.round(r.width),
          h: Math.round(r.height),
        });
      }
    });
    return bad.slice(0, 40);
  });

  report[vp.name] = { sections, overflow, smallTargets, consoleErrors };

  // Full-page capture (chunked to stay under image size limits).
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const chunk = vp.height * 2;
  let n = 0;
  for (let y = 0; y < pageHeight && n < 14; y += chunk) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await page.waitForTimeout(650);
    await page.screenshot({
      path: `${OUT}/${vp.name}-${String(n).padStart(2, "0")}.png`,
      type: "png",
    });
    n++;
  }
  await ctx.close();
}

await browser.close();
await writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2));

for (const [k, v] of Object.entries(report)) {
  console.log(`\n===== ${k.toUpperCase()} =====`);
  console.log(`sections: ${v.sections.length}`);
  console.log(`console errors: ${v.consoleErrors.length}`);
  v.consoleErrors.slice(0, 6).forEach((e) => console.log("   ! " + e));
  console.log(`horizontal overflow elements: ${v.overflow.length}`);
  v.overflow.slice(0, 8).forEach((o) => console.log(`   > ${o.tag}.${o.cls} [${o.left}..${o.right}] doc=${o.docW}`));
  console.log(`sub-44px tap targets: ${v.smallTargets.length}`);
  v.smallTargets.slice(0, 10).forEach((t) => console.log(`   · ${t.tag} "${t.text}" ${t.w}x${t.h}`));
}
