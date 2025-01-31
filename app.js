const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const getProductInfo = async ($)=>{
   
    // 取得商品資料
    const productInfo = [];
    $('.c-listInfoGrid__item').each((index, element) => {
        console.log('-------------------')
        const title = $(element).find('.c-prodInfoV2__title').text();
        console.log('title:', title)
        const price = $(element).find('.c-prodInfoV2__price .c-prodInfoV2__priceValue').text();
        console.log('price:', price)
        productInfo.push({title, price});
        console.log('-------------------')

    });
    return productInfo;
}

(async ()=>{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://24h.pchome.com.tw/category/DGAD08C');
    console.log('page loaded');
    const data = []
    // 等待特定的 JavaScript 條件為真
    await page.waitForFunction('document.querySelectorAll(".c-listInfoGrid__item .c-prodInfoV2__text")[0]?.innerText');

    // 取得頁面的 HTML
    const html = await page.content();
     // 使用 cheerio 解析 HTML
     const $ = cheerio.load(html);
    // 取得商品資料
    const productInfo = await getProductInfo($);
    data.push(...productInfo);
    
    const nextPageButton = await page.$('.c-pagination__button.is-next button');
    // 點擊下一頁按鈕
    await nextPageButton.click();



    // -------- 第二頁
    // 等待特定的 JavaScript 條件為真
    await page.waitForFunction('document.querySelectorAll(".c-listInfoGrid__item .c-prodInfoV2__text")[0]?.innerText');
    // 取得頁面的 HTML
    const html2 = await page.content();
     // 使用 cheerio 解析 HTML
     const $2 = cheerio.load(html2);
    // 取得商品資料
    const productInfo2 = await getProductInfo($2);
    data.push(...productInfo2);


    // await browser.close();
    // console.log('browser closed');
    console.log(data);
    console.log(data.length)
})()