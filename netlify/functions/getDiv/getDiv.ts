import { Handler } from '@netlify/functions'

const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');


export const handler: Handler = async (event, context) => {
  // Extract event.body into an object
  const { url, selector } = JSON.parse(event.body);
  console.log(`Looking for ${selector} in ${url}`);
  let value = null;


  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.EXCECUTABLE_PATH || await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  value = await page.evaluate((selector) => {
    return document.querySelector(selector).textContent;
  }, selector);

  await browser.close();

  console.log(value);

  return {
    statusCode: 200,
    body: JSON.stringify({ value })
  }




  // try{
  //   // User axios to get the page contents and wait for js to load
  //   const html = await axios.get(url, {
  //     headers: {
  //       'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  //     },
  //     timeout: 10000,
  //     responseType: 'document',
  //     transformResponse: (data) => {
  //       return data
  //     }
  //   });

  //   const dom = new JSDOM(html.data, { 
  //     runScripts: "dangerously",
  //     resources: "usable",
  //     pretendToBeVisual: true
  //    });
  //   value = dom.window.document.querySelector(selector).textContent;

  //   console.log(value);

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({ value })
  //   }

  // }
  // catch(e){
  //   console.log(e);
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ error: e })
  //   }
  // }

}
