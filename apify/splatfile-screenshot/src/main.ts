import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";

await Actor.init();

type Input = {
  url: string;
};

const input = await Actor.getInput<Input>();

const crawler = new PuppeteerCrawler({
  async requestHandler({ page }) {
    const screenshot = await page.screenshot({
      fullPage: true,
    });

    await Actor.setValue("result", screenshot, { contentType: "image/png" });
  },
});

if (!!input) {
  // Run the crawler
  await crawler.run([
    { url: input.url },
  ]);
}

await Actor.exit();
