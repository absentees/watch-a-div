const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const dotenv = require('dotenv').config();

exports.handler = async (event, context) => {
  // Extract event.body into an object
  const { url, selector } = JSON.parse(event.body);
  console.log(`Looking for ${selector} in ${url}`);

  let value = null;

  // Optional: If you'd like to use the legacy headless mode. "new" is the default.
  chromium.setHeadlessMode = "new";

  //
  const browser = await puppeteer.launch({
    args: process.env.IS_LOCAL ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL
      ? process.env.CHROME_EXECUTABLE_PATH
      : await chromium.executablePath(),
    headless: process.env.IS_LOCAL ? false : chromium.headless
  });


  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(selector);
    value = await page.$eval(selector, el => el.innerText);
    await browser.close();

    // Return the value
    return {
      statusCode: 200,
      body: JSON.stringify({
        value,
      })
    }


  } catch (error) {
    await browser.close();

    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed' }),
    }
  }

}
