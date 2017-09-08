const puppeteer = require("puppeteer");
const http = require("http");

const port = process.env.PORT || 3000;

async function main() {
  const browser = await puppeteer.launch();

  process.on("beforeExit", () => {
    console.log("Closing browser");
    browser.close();
  });

  http
    .createServer(async (req, res) => {
      const path = req.url.slice(1);

      if (path.startsWith("http")) {
        console.log(`Requested title of ${path}`);
        try {
          const title = await getPageTitle(browser, path);
          res.statusCode = 200;
          res.end(title);
        } catch (err) {
          res.statusCode = 500;
          res.end(err.message);
          console.error(err);
        }
      } else {
        res.statusCode = 404;
        res.end("Not a valid url");
      }
    })
    .listen(port, () => {
      console.log(`Server started at ${port}`);
    });
}

async function getPageTitle(browser, url) {
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle"
  });

  return await page.evaluate(() => document.title);
}

main();
