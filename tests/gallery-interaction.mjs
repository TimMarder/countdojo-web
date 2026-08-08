import { chromium } from "playwright";
const b = await chromium.launch({ headless: true });
const page = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
const errs = [];
page.on("pageerror", e => errs.push(String(e).slice(0,120)));
await page.goto("http://localhost:3200/", { waitUntil:"networkidle" });
await page.evaluate(() => document.querySelector("#screenshots").scrollIntoView({behavior:"instant"}));
await page.waitForTimeout(800);

const t = {};
t.tabCount = await page.locator('[role="tab"]').count();
t.panelCount = await page.locator('[role="tabpanel"]').count();
t.learnShots = await page.locator('.screen-card').count();

// arrow-key roving tabindex
await page.locator('#surface-tab-learn').focus();
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(400);
t.afterArrowRight = await page.evaluate(() => document.activeElement?.id);
t.afterArrowSelected = await page.locator('[role="tab"][aria-selected="true"]').getAttribute("id");
t.practiceShots = await page.locator('.screen-card').count();

await page.keyboard.press("End"); await page.waitForTimeout(400);
t.afterEnd = await page.evaluate(() => document.activeElement?.id);
t.fieldShots = await page.locator('.screen-card').count();

// lightbox: open, arrow-navigate, escape, focus return
await page.locator('#surface-tab-learn').click(); await page.waitForTimeout(400);
const firstCard = page.locator('.screen-card').first();
await firstCard.click(); await page.waitForTimeout(600);
t.lightboxOpen = await page.locator('[role="dialog"]').count();
t.counterStart = (await page.locator('.screen-lightbox__meta .font-mono').innerText()).trim();
await page.keyboard.press("ArrowRight"); await page.waitForTimeout(400);
t.counterAfterArrow = (await page.locator('.screen-lightbox__meta .font-mono').innerText()).trim();
t.bodyLocked = await page.evaluate(() => document.body.style.overflow);
await page.keyboard.press("Escape"); await page.waitForTimeout(500);
t.lightboxClosed = (await page.locator('[role="dialog"]').count()) === 0;
t.bodyRestored = await page.evaluate(() => document.body.style.overflow) !== "hidden";
t.focusReturned = await page.evaluate(() => document.activeElement?.className?.includes?.("screen-card") ?? false);
t.pageerrors = errs.length;

for (const [k,v] of Object.entries(t)) console.log(`  ${k.padEnd(20)} ${v}`);
await b.close();
