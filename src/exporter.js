const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

function groupByAuthor(commits) {
    return commits.reduce((acc, commit) => {
        const author = commit.author_name;
        if (!acc[author]) acc[author] = [];
        acc[author].push(commit);
        return acc;
    }, {});
}

async function exportToExcel(commits,  projectName, outputDir = '.') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Commits');

    // 表头
    sheet.addRow(['作者', '提交时间', '提交备注']);
    const now = Date.now();
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

    const grouped = groupByAuthor(commits);
    Object.entries(grouped).forEach(([author, list]) => {
        list.forEach(commit => {
            const dateObj = new Date(commit.date);
            const row = sheet.addRow([author, '', commit.message]);

            // 设置第二列为 Date 类型 + 格式
            row.getCell(2).value = dateObj;
            row.getCell(2).numFmt = 'yyyy-mm-dd hh:mm';

            // 标红近两天的提交
            if (now - dateObj.getTime() < twoDaysMs) {
                row.eachCell(cell => {
                    cell.font = { color: { argb: 'FFFF0000' } };
                });
            }
        });
    });

    // 自动列宽
    sheet.columns.forEach(column => {
        let maxLength = 10;
        column.eachCell({ includeEmpty: true }, cell => {
            const length = (cell.value || '').toString().length;
            if (length > maxLength) maxLength = length;
        });
        column.width = maxLength + 2;
    });

    // 确保目录存在
    const reportDir = path.join(outputDir, 'report');
    fs.mkdirSync(reportDir, { recursive: true });

    const fileName = `${projectName}-${now}.xlsx`;
    const filePath = path.join(reportDir, fileName);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
}

module.exports = { exportToExcel };
