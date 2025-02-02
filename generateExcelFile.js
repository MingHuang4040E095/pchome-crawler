const ExcelJS = require("exceljs")
const path = require("path")
const fs = require("fs")

// 生成 Excel 文件
const generateExcelFile = async (data = [], columns = [], fileName = "") => {
  console.log("開始生成 Excel 文件")
  // 創建一個新的工作簿
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("產品資料")

  // 添加標題行
  // 假設 worksheet 已經定義並且包含 columns
  worksheet.columns = columns
  worksheet.columns.forEach((column, index) => {
    column.index = index + 1 // 索引從 1 開始
  })

  // 添加數據行
  data.forEach((user) => {
    worksheet.addRow(user)
  })

  // 指定輸出文件夾
  const outputDir = path.join(__dirname, "output")
  // 確保輸出文件夾存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  // 根據name再建立該分類的資料夾
  const outputDirCategory = path.join(outputDir, fileName)
  if (!fs.existsSync(outputDirCategory)) {
    fs.mkdirSync(outputDirCategory)
  }

  const timestamp = getTimestamp()
  const outputPath = path.join(
    outputDirCategory,
    `${fileName}_${timestamp}.xlsx`
  )

  // 將工作簿寫入文件
  await workbook.xlsx.writeFile(outputPath)
  console.log(`excel已輸出至 ${outputPath}`)

  // 輸出成json檔
  generateJsonFile(data, fileName)
  console.log("======================================")
}

/**
 * 輸出成json檔
 * @param {Array} data 資料
 * @param {String} fileName 檔名
 */
const generateJsonFile = async (data = [], fileName = "") => {
  console.log("開始生成 json 文件")
  const outputDir = path.join(__dirname, "output")
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  const outputDirCategory = path.join(outputDir, fileName)
  if (!fs.existsSync(outputDirCategory)) {
    fs.mkdirSync(outputDirCategory)
  }

  const outputPath = path.join(outputDirCategory, `${fileName}.json`)

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
  console.log(`json已輸出至 ${outputPath}`)
}

const getTimestamp = () => {
  // 取得當前時間並格式化為 YYYYMMDDHHmmss
  const now = new Date()
  const timestamp =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0")
  return timestamp
}

module.exports = {
  generateExcelFile,
}
