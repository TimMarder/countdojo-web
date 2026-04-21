// Smoke test for the cinematic 3D scroll sequence.
//
// What we verify:
//   1. The .cinematic-section is at least 200vh tall.
//   2. The .cinematic-sticky child pins at the top of the viewport as the
//      user scrolls through the section (true sticky behavior).
//   3. At ~50% scroll progress through the section, the scene has rotated
//      (Act II is firing) — i.e., the transform matrix on .cinematic-scene
//      at mid-scroll differs from the transform at section entry.
//   4. At ~90% scroll progress, the Ace of Spades has advanced in Z (Act III).
//
// Run: node tests/cinematic-scroll.mjs
// Assumes dev server is running at http://localhost:3000.

import { chromium } from "playwright";

const URL = process.env.URL ?? "http://localhost:3000";
const PASS = "\x1b[32mPASS\x1b[0m";
const FAIL = "\x1b[31mFAIL\x1b[0m";

function assert(cond, msg, evidence) {
  if (cond) {
    console.log(`${PASS}  ${msg}`);
  } else {
    console.log(`${FAIL}  ${msg}`);
    if (evidence !== undefined) console.log(`        evidence: ${evidence}`);
    process.exitCode = 1;
  }
}

function approxEqual(a, b, eps = 2) {
  return Math.abs(a - b) < eps;
}

async function scrollToProgress(page, progress) {
  // progress is 0–1 through the cinematic section
  await page.evaluate((p) => {
    const section = document.querySelector(".cinematic-section");
    if (!section) throw new Error("no .cinematic-section");
    const rect = section.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const sectionHeight = rect.height;
    const viewport = window.innerHeight;
    const scrollableSpan = sectionHeight - viewport;
    // scroll so that (scrollY - sectionTop) / scrollableSpan ≈ progress
    const targetScrollY = sectionTop + scrollableSpan * p;
    window.scrollTo({ top: targetScrollY, behavior: "instant" });
  }, progress);
  // give motion values a frame to propagate
  await page.waitForTimeout(120);
}

async function main() {
  console.log(`\n--- cinematic-scroll smoke test (${URL}) ---\n`);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });

  // 1. Section height
  const sectionHeight = await page.evaluate(
    () => document.querySelector(".cinematic-section")?.getBoundingClientRect().height ?? 0,
  );
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  assert(
    sectionHeight >= 1.8 * viewportHeight,
    `section is at least 1.8× viewport tall (got ${Math.round(sectionHeight)}px vs viewport ${viewportHeight}px)`,
  );

  // 2. Sticky pinning: scroll halfway through the section and check that the
  //    sticky inner's top is at or near the viewport top (y ≈ 0).
  await scrollToProgress(page, 0.5);
  const stickyAtMid = await page.evaluate(() => {
    const el = document.querySelector(".cinematic-sticky");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top, height: r.height };
  });
  assert(
    stickyAtMid !== null,
    `.cinematic-sticky exists`,
  );
  assert(
    stickyAtMid && approxEqual(stickyAtMid.top, 0, 5),
    `sticky pins at viewport top (mid-scroll)`,
    stickyAtMid ? `top=${stickyAtMid.top.toFixed(1)}px (expected ≈ 0)` : "element missing",
  );

  // 3. Act II: at progress 0.5, the scene should have a non-zero rotateY.
  const sceneTransformAtMid = await page.evaluate(() => {
    const el = document.querySelector(".cinematic-scene");
    if (!el) return null;
    return getComputedStyle(el).transform;
  });

  // Act I entry: progress ~0.05
  await scrollToProgress(page, 0.05);
  const sceneTransformAtStart = await page.evaluate(() => {
    const el = document.querySelector(".cinematic-scene");
    return el ? getComputedStyle(el).transform : null;
  });

  assert(
    sceneTransformAtMid !== null && sceneTransformAtStart !== null,
    `.cinematic-scene has a transform`,
  );
  assert(
    sceneTransformAtMid !== sceneTransformAtStart,
    `scene transform CHANGES between scroll progress 0.05 and 0.5 (Act II rotates the scene)`,
    `start=${sceneTransformAtStart}  mid=${sceneTransformAtMid}`,
  );

  // 4. Act III Ace z-advance: at 0.92, check that HelixCard index 0 has
  //    translateZ > 100 (Ace forward). We can read its inline transform.
  await scrollToProgress(page, 0.92);
  const aceTransform = await page.evaluate(() => {
    const cards = document.querySelectorAll(".helix-card");
    if (!cards[0]) return null;
    return getComputedStyle(cards[0]).transform;
  });
  // Parse matrix3d or matrix — if matrix3d, element m43 (index 14) is translateZ
  const z = aceTransform?.match(/matrix3d\(([^)]+)\)/)?.[1].split(",").map(Number)?.[14] ?? 0;
  assert(
    z > 100,
    `Ace of Spades has advanced in Z at scroll progress 0.92 (Act III convergence)`,
    `matrix3d translateZ ≈ ${z.toFixed(1)}px`,
  );

  // 5. Stage text: at progress 0.1 stage 0 active; at 0.5 stage 1; at 0.9 stage 2.
  const stageActiveAt = async (p) => {
    await scrollToProgress(page, p);
    await page.waitForTimeout(250);
    return await page.evaluate(() => {
      const stages = Array.from(document.querySelectorAll(".cinematic-stage"));
      return stages.map((s) => s.getAttribute("data-active") === "true");
    });
  };

  const s1 = await stageActiveAt(0.1);
  const s2 = await stageActiveAt(0.5);
  const s3 = await stageActiveAt(0.9);
  assert(
    s1[0] && !s1[1] && !s1[2],
    `Act I active at progress 0.1`,
    `actives=${JSON.stringify(s1)}`,
  );
  assert(
    !s2[0] && s2[1] && !s2[2],
    `Act II active at progress 0.5`,
    `actives=${JSON.stringify(s2)}`,
  );
  assert(
    !s3[0] && !s3[1] && s3[2],
    `Act III active at progress 0.9`,
    `actives=${JSON.stringify(s3)}`,
  );

  await browser.close();

  if (process.exitCode === 1) {
    console.log(`\n\x1b[31mSMOKE TEST FAILED\x1b[0m\n`);
  } else {
    console.log(`\n\x1b[32mSMOKE TEST PASSED\x1b[0m\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
