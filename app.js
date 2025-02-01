const ExcelJS = require("exceljs")
const path = require("path")
const fs = require("fs")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer")

// -- 引入js
const { generateExcelFile } = require("./generateExcelFile")

const getProductInfo = async (browser, url = "https://24h.pchome.com.tw/category/DGAD08C" , callback) => {
    try {
        const page = await browser.newPage()
        await page.goto(url)
        console.log("page loaded")
        // 取得商品資料
        const productInfo = []


        for(let i = 1; i < Infinity; i++){
            // 等待特定的 JavaScript 條件為真
            await page.waitForFunction(
                'document.querySelectorAll(".c-listInfoGrid__item .c-prodInfoV2__text")[0]?.innerText'
            )
            
            // 取得頁面的 HTML
            const html = await page.content()
            // 使用 cheerio 解析 HTML
            const $ = cheerio.load(html)
    
            // 目標資料
            const targetData = await callback($)
            productInfo.push(...targetData)
    
            const nextPageButton = await page.$(".c-pagination__button.is-next button")
            const isDisabled = await nextPageButton.evaluate(node => node.disabled)
            if(!nextPageButton || isDisabled){
                // 如果沒有下一頁按鈕或是按鈕被禁用，就跳出迴圈
                break
            }
            // 點擊下一頁按鈕
            await nextPageButton.click()
        }
        
      
        return productInfo
    }catch(err){
        console.log(err)
        return []
    }
}

;(async () => {
    // return
  const browser = await puppeteer.launch({ headless: false })
  
  const targetUrl = "https://24h.pchome.com.tw/category/DGAD08C"
  // 取得商品資料
  const productInfo1 = await getProductInfo(browser, targetUrl, async $=>{
    const data = []
    $(".c-listInfoGrid__item").each((index, element) => {
        console.log("-------------------")
        const name = $(element).find(".c-prodInfoV2__title").text()
        console.log("name:", name)
        const price = $(element)
          .find(".c-prodInfoV2__price .c-prodInfoV2__priceValue")
          .text()
        console.log("price:", price)
        // productInfo.push({ title, price })
        console.log("-------------------")
        data.push({ name, price }) 
    })
    return data
  })
  console.log(productInfo1)
  console.log(productInfo1.length)

  const columns = [
      { header: 'Name', key: 'name', width: 50 },
      { header: 'Price', key: 'price', width: 50 }
  ]
  await generateExcelFile(productInfo1, columns, 'pcHome')
  // 成功完成後終止腳本
  process.exit(0);
})()
