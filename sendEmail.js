require("dotenv").config()
const nodemailer = require("nodemailer")
const util = require("util")

const sendEmail = async () => {
  // 創建傳輸器
  let transporter = nodemailer.createTransport({
    service: "gmail", // 使用 Gmail 服務
    auth: {
      user: process.env.APP_GMAIL, // 您的 Gmail 地址
      pass: process.env.APP_GMAIL_PASSWORD, // 您的 Gmail 密碼或應用程式專用密碼
    },
  })

  // 設定郵件內容
  let mailOptions = {
    from: process.env.APP_GMAIL, // 發件人地址
    to: process.env.APP_TARGET_GMAIL, // 收件人地址
    subject: "爬蟲測試", // 郵件主題
    text: "已完成今日爬蟲", // 郵件正文
  }

  // 使用 util.promisify 將 sendMail 轉換為返回 Promise 的方法
  const sendMail = util.promisify(transporter.sendMail).bind(transporter)

  // 使用 await 等待 sendMail 完成
  let info = await sendMail(mailOptions)
  console.log("Email sent: " + info.response)
}
module.exports = {
  sendEmail,
}
