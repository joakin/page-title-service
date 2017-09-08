const puppeteer = require("puppeteer");

const url = process.argv.slice(2)[0] || "https://example.com";
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle"
  });

  const title = await page.evaluate(() => document.title);
  browser.close();

  console.log(title);
})();
