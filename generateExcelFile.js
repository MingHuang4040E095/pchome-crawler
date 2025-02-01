const ExcelJS = require("exceljs")
const path = require("path")
const fs = require("fs")
// 生成 Excel 文件
const generateExcelFile = async (data = [], columns = [], fileName = '')=>{
    console.log('開始生成 Excel 文件')
    // 創建一個新的工作簿
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');
  
    // 添加標題行
    // 假設 worksheet 已經定義並且包含 columns
    worksheet.columns = columns;
    worksheet.columns.forEach((column, index) => {
        column.index = index + 1; // 索引從 1 開始
    });
  
    // 添加數據行
    data.forEach(user => {
      worksheet.addRow(user);
    });
  
    // 指定輸出文件夾和文件名
    const outputDir = path.join(__dirname, 'output');
    const timestamp = getTimestamp();
    const outputPath = path.join(outputDir, `${fileName}_${timestamp}.xlsx`);
  
    // 確保輸出文件夾存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
  
    // 將工作簿寫入文件
    await workbook.xlsx.writeFile(outputPath);
    console.log(`excel已輸出至 ${outputPath}`)
    console.log('======================================')
  }

  const getTimestamp = ()=>{
    // 取得當前時間並格式化為 YYYYMMDDHHmmss
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
    return timestamp
  }

  module.exports = {
    generateExcelFile
  }