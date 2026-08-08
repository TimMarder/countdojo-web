import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3200", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

const r = await page.evaluate(() => {
  const out = {};

  // Heading hierarchy
  const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
  out.h1Count = hs.filter((h) => h.tagName === "H1").length;
  let skips = [];
  let prev = 0;
  hs.forEach((h) => {
    const lvl = +h.tagName[1];
    if (prev && lvl > prev + 1) skips.push(`${"h" + prev} -> ${"h" + lvl}: "${h.innerText.slice(0, 40)}"`);
    prev = lvl;
  });
  out.headingSkips = skips;

  // Landmarks
  out.landmarks = {
    header: document.querySelectorAll("header").length,
    nav: document.querySelectorAll("nav").length,
    main: document.querySelectorAll("main").length,
    footer: document.querySelectorAll("footer").length,
  };

  // div/span acting as button
  out.fakeButtons = [...document.querySelectorAll('div[onclick],span[onclick],div[role="button"],span[role="button"]')]
    .map((e) => e.tagName + "." + (e.className || "").toString().slice(0, 40));

  // Interactive elements with no accessible name
  const namer = (el) =>
    (el.getAttribute("aria-label") || el.innerText || el.getAttribute("title") || "").trim();
  out.unnamed = [...document.querySelectorAll("a,button")]
    .filter((el) => el.offsetParent !== null && !namer(el))
    .map((el) => el.tagName + "." + (el.className || "").toString().slice(0, 50));

  // Images missing alt
  out.imgNoAlt = [...document.querySelectorAll("img")]
    .filter((i) => !i.hasAttribute("alt"))
    .map((i) => i.src.slice(-45));

  // Roles that PROMISE a keyboard pattern. Declaring one without implementing
  // it is the defect; a correctly implemented widget should pass.
  out.riskyRoles = [];
  document.querySelectorAll('[role="menu"],[role="menuitem"]').forEach((e) => {
    out.riskyRoles.push(`${e.getAttribute("role")} on ${e.tagName} (menu pattern rarely implemented)`);
  });
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const zero = tabs.filter((t) => t.tabIndex === 0).length;
    const selected = tabs.filter((t) => t.getAttribute("aria-selected") === "true").length;
    const controls = tabs.every((t) => {
      const id = t.getAttribute("aria-controls");
      return id && document.getElementById(id);
    });
    if (zero !== 1) out.riskyRoles.push(`tablist: roving tabindex broken (${zero} tabs with tabindex=0, expected 1)`);
    if (selected !== 1) out.riskyRoles.push(`tablist: ${selected} tabs aria-selected, expected 1`);
    if (!controls) out.riskyRoles.push("tablist: a tab's aria-controls does not resolve to an element");
  });

  // Elements animating layout-triggering properties
  out.badTransitions = [];
  document.querySelectorAll("*").forEach((el) => {
    const t = getComputedStyle(el).transitionProperty;
    if (/\b(width|height|top|left|right|bottom|margin|padding)\b/.test(t)) {
      out.badTransitions.push((el.className || el.tagName).toString().slice(0, 45) + " :: " + t.slice(0, 50));
    }
  });
  out.badTransitions = [...new Set(out.badTransitions)].slice(0, 10);

  return out;
});

console.log("h1 count:            ", r.h1Count, r.h1Count === 1 ? "(correct)" : "(SHOULD BE 1)");
console.log("heading skips:       ", r.headingSkips.length === 0 ? "none" : r.headingSkips);
console.log("landmarks:           ", JSON.stringify(r.landmarks));
console.log("div/span as button:  ", r.fakeButtons.length === 0 ? "none" : r.fakeButtons);
console.log("unnamed interactive: ", r.unnamed.length === 0 ? "none" : r.unnamed);
console.log("img missing alt:     ", r.imgNoAlt.length === 0 ? "none" : r.imgNoAlt);
console.log("ARIA pattern defects:", r.riskyRoles.length === 0 ? "none" : r.riskyRoles);
console.log("layout-animating:    ", r.badTransitions.length === 0 ? "none" : r.badTransitions);

await browser.close();
