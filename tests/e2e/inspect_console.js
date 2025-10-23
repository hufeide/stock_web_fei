const puppeteer = require('puppeteer');
(async ()=>{
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push({type: msg.type(), text: msg.text()}));
  page.on('pageerror', err => logs.push({type: 'pageerror', text: ''+err}));
  await page.goto('http://localhost:8080/frontend/index.html', {waitUntil: 'networkidle2', timeout: 10000});
  // give scripts some time to run
  await page.waitForTimeout(1000);
  const content = await page.content();
  console.log('---console logs---');
  logs.forEach(l => console.log(l.type + ': ' + l.text));
  console.log('---page html snippet---');
  console.log(content.slice(0, 2000));
  await browser.close();
})();