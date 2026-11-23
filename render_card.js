const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

async function main() {
  const apiUrl = process.env.APPS_SCRIPT_URL;
  if (!apiUrl) {
    throw new Error("Missing APPS_SCRIPT_URL environment variable.");
  }

  // Optional: pass DATE_OVERRIDE=2026-11-24 when testing manually
  const targetUrl = process.env.DATE_OVERRIDE
    ? `${apiUrl}${apiUrl.includes("?") ? "&" : "?"}date=${encodeURIComponent(process.env.DATE_OVERRIDE)}`
    : apiUrl;

  console.log("Fetching tomorrow's card data from Google Apps Script...");
  const response = await fetch(targetUrl, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Apps Script request failed: ${response.status} ${response.statusText}`);
  }

  const cardData = await response.json();
  console.log(`Rendering card for: ${cardData.Day_Label || cardData.Date}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 500, height: 850 },
    deviceScaleFactor: 3 // Crisp 3x Retina resolution (1290x2292) for iPhone
  });

  const page = await context.newPage();

  // Inject JSON payload before card_v2.html executes its script
  await page.addInitScript((data) => {
    window.__CARD_DATA__ = data;
  }, cardData);

  const htmlPath = path.resolve(__dirname, "card_v2.html");
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });

  // Wait briefly for backdrop-filter & fonts to settle
  await page.waitForTimeout(300);

  const cardElement = page.locator("#card");
  await cardElement.screenshot({
    path: path.resolve(__dirname, "tomorrow.png"),
    type: "png"
  });

  await browser.close();
  console.log("Saved crisp 3x PNG -> tomorrow.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
