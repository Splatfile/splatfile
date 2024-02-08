import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";

await Actor.init();

type Input = {
  url: string;
};

const input = await Actor.getInput<Input>();

// Create a PuppeteerCrawler
const crawler = new PuppeteerCrawler({
  async requestHandler({ request, page }) {
    // Capture the screenshot with Puppeteer
    const screenshot = await page.screenshot();
    // Convert the URL into a valid key
    const key = request.url.replace(/[:/]/g, "_");
    request.userData;
    // Save the screenshot to the default key-value store
    await Actor.setValue(key, screenshot, { contentType: "image/png" });
  },
});

if (!!input) {
  // Run the crawler
  await crawler.run([
    { url: input.url },
  ]);
}

await Actor.exit();
