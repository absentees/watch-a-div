import { Handler } from '@netlify/functions'
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

export const handler: Handler = async (event, context) => {
  // Extract event.body into an object
  const { url, selector } = JSON.parse(event.body);
  console.log(`Looking for ${selector} in ${url}`);
  let value = null;

 
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    headless: chromium.true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector(selector);
  value = await page.$eval(selector, (el: any) => el.innerText);
  await browser.close();


  // Return the value
  return {
    statusCode: 200,
    body: JSON.stringify({
      value,
    }),
  }

}
