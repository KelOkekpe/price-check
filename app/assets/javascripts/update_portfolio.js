const { chromium } = require('playwright');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
const fetch = require('node-fetch');

(async () => {
  const userDataDir = '/Users/jokekpe/Library/Application Support/Google/Chrome/Default'
  const browser = await chromium.launchPersistentContext(userDataDir, {headless: true}); 
  const page = await browser.newPage();
  await page.goto('https://robinhood.com', {timeout: 60000, waitUntil: 'domcontentloaded'});

  console.log('total account value:')
  const account_total = await getAccountValue(page)
  const get_links = await getContractLinks(page)
  const options_body = await buildOptionsBody(page, get_links)
  const body = {value: account_total, contracts: options_body }
  const id = 9
  const put = updatePortfolio(page, id, body)

  await setTimeoutPromise(1000);
  await browser.close();
})();

async function updatePortfolio(page, id, params){
    fetch(`http://localhost:3000/portfolios/${id}`, {
        method: 'put',
        body:   JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => console.log(json));

  console.log('UPDATED portfolio details')
}


async function getAccountValue(page) {
    await page.waitForSelector('div[class=QzVHcLdwl2CEuEMpTUFaj]')
    const price = await page.evaluate(() => {
        return { price: document.querySelector('div[class=QzVHcLdwl2CEuEMpTUFaj]').innerText.replace(/[^0-9.]/g, "") }
    });
    console.log(price.price)  
    return Promise.resolve(price.price)
}


async function getContractLinks(page){
    await page.waitForSelector('[data-testid="VirtualizedSidebar"] svg')
    
    //this returns an array of all contract tickers belonging to user
    //if a user has separate contracts with same ticker, a count is appended to subsequent tickers
    //i.e. (['AMD', 'NIO', 'XLK', 'NIO2'])
    const ticker_array = await page.evaluate(()=>{
        all_hyperlink_selectors = document.getElementsByClassName('rh-hyperlink')
        my_contracts_selectors = []
        ticker_array = []
        count = 1

        for(i=0;i<all_hyperlink_selectors.length; i++){
            if(all_hyperlink_selectors[i].innerText.includes('Exp')){
                 my_contracts_selectors.push(all_hyperlink_selectors[i])
            }
        }

        for(i=0; i<my_contracts_selectors.length; i++) { 
            if(ticker_array.includes(my_contracts_selectors[i].innerText.split(' ')[0])) { 
                count++
                ticker_array.push(my_contracts_selectors[i].innerText.split(' ')[0] + `${count}`)
            } else {
                ticker_array.push(my_contracts_selectors[i].innerText.split(' ')[0])
            }
        }
        return { tickers: ticker_array}
    })

    //this formats a hash with each contract, corresponding keys for contract details and empty values
   const contract_details_json = {}
   count = 1
   for(i=0; i<ticker_array.tickers.length; i++){
       key = ticker_array.tickers[i]
       
       if(contract_details_json.hasOwnProperty(key)){
           count++ 
           contract_details_json[`${key}${count}`] = {"strike_price":"0","option_type":"0","expiration_date":"0","current_premium_price":"0","premium_purchase_price":"0"}
        } else {
           contract_details_json[key] = {"strike_price":"0","option_type":"0","expiration_date":"0","current_premium_price":"0","premium_purchase_price":"0"}
        }
    }

    //creates an array of contract hyperlinks that will be used to navigate to individual contract pages
    // this is necessary to pull details from contracts that are only located on contract pages
   const hyperlinks = await page.evaluate(() => {
       hyperlinks = document.getElementsByClassName('rh-hyperlink')
       contract_links_array = []
       for(i=0; i<hyperlinks.length; i++) { 
           if(hyperlinks[i].innerText.includes('Exp')) { 
               contract_links_array.push(hyperlinks[i].href)
           } 
       } 
       return { links_array: contract_links_array}
    })
return Promise.all([hyperlinks.links_array, contract_details_json, ticker_array.tickers])
}



async function buildOptionsBody(page, links){

    for(i=0; i<links[0].length; i++){
        await page.goto(links[0][i], {timeout: 60000, waitUntil: 'domcontentloaded'});
        console.log(`navigated to link ${i}`)
        await page.waitForSelector('div[class=caption-text]')

       strike_price = await page.$$eval("h1[class='css-17x9yt1']", divs => divs[0].innerText.replace(/[^0-9.]/g, ""))
       option_type = await page.$$eval("h1[class='css-17x9yt1']", divs => divs[0].innerText.split(' ')[2])
       expiration_date = await page.$$eval("span[class='css-1wyk9uc']", divs => divs[1].innerText)
       current_premium_price = await page.$$eval("span[class='css-1wyk9uc']", divs => divs[0].innerText.replace(/[^0-9.]/g, "")/100)

       const premium_purchase_price = await page.evaluate(()=>{
            table = document.querySelectorAll('table[class=table]')[1]
            d = table.getElementsByTagName('tr')[2]
            price = d.getElementsByTagName('td')[2].innerText.replace(/[^0-9.]/g, "")
            return { price: price}
       })

        links[1][links[2][i]]['strike_price'] = strike_price
        links[1][links[2][i]]['option_type'] = option_type
        links[1][links[2][i]]['expiration_date'] = expiration_date
        links[1][links[2][i]]['current_premium_price'] = current_premium_price
        links[1][links[2][i]]['premium_purchase_price'] = premium_purchase_price.price
        
    }
    // console.log(links[1])
    return Promise.resolve(links[1])
}
