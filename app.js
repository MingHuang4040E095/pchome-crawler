const ExcelJS = require("exceljs")
const path = require("path")
const fs = require("fs")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer")

// -- 引入js
const { generateExcelFile } = require("./generateExcelFile")

const getProductInfo = async (browser, config , callback) => {
    try {
        const { url, name, excelColumns } = config
        const page = await browser.newPage()
        await page.goto(url)
        console.log("page loaded")
        // 取得商品資料
        const productInfo = []
        let currentPage = 1
        console.log(`開始爬蟲 - ${name}`)
        console.log(`目標網站 - ${url}`)

        for(let i = 1; i < Infinity; i++){
            // 等待特定的 JavaScript 條件為真
            await page.waitForFunction(
                'document.querySelectorAll(".c-listInfoGrid__item .c-prodInfoV2__text")[0]?.innerText'
            )
            
            // 取得頁面的 HTML
            const html = await page.content()
            // 使用 cheerio 解析 HTML
            const $ = cheerio.load(html)

            console.log(`正在爬取第 ${currentPage} 頁`)
    
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
            currentPage++
        }

        console.log(`爬蟲結束 - ${name}`)
        console.log(`共爬取 ${productInfo.length} 筆資料`)
        
        // 生成 Excel 文件    
        await generateExcelFile(productInfo, excelColumns, name)
        
        return productInfo
    }catch(err){
        console.log(err)
        return []
    }
}

;(async () => {
    // return
  const browser = await puppeteer.launch({ 
    headless: true, // 是否不要介面 true:無介面 false:有介面
    slowMo: 50, // 每個操作減慢 50 毫秒
    defaultViewport: {
        width: 1920,
        height: 1080
    },
 })

  // 網站1的配置
  const web1Config = {
    url: "https://24h.pchome.com.tw/category/DGAD08C",
    name: "pcHome拍立得",
    excelColumns: [
        { header: 'Name', key: 'name', width: 50 },
        { header: 'Price', key: 'price', width: 50 }
    ]
  }

  // 取得商品資料
  await getProductInfo(browser, web1Config, async $=>{
    const data = []
    $(".c-listInfoGrid__item").each((index, element) => {
        const name = $(element).find(".c-prodInfoV2__title").text()
        const price = $(element)
          .find(".c-prodInfoV2__price .c-prodInfoV2__priceValue")
          .text()
        data.push({ name, price }) 
    })
    return data
  })
  // 網站1的配置
  const web2Config = {
    url: "https://24h.pchome.com.tw/search/?q=%E6%8A%80%E5%98%89%E9%A1%AF%E7%A4%BA%E5%8D%A1&p=1",
    name: "pcHome顯示卡",
    excelColumns: [
        { header: 'Name', key: 'name', width: 50 },
        { header: 'Price', key: 'price', width: 50 }
    ]
  }
  // 取得商品資料
  await getProductInfo(browser, web2Config, async $=>{
    const data = []
    $(".c-listInfoGrid__item").each((index, element) => {
        const name = $(element).find(".c-prodInfoV2__title").text()
        const price = $(element)
          .find(".c-prodInfoV2__price .c-prodInfoV2__priceValue")
          .text()
        data.push({ name, price }) 
    })
    return data
  })
  // 成功完成後終止腳本
  process.exit(0);
})()
