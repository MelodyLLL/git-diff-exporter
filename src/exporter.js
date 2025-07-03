const ExcelJS = require('exceljs');

function groupByAuthor(commits) {
  return commits.reduce((acc, commit) => {
    const author = commit.author_name;
    if (!acc[author]) acc[author] = [];
    acc[author].push(commit);
    return acc;
  }, {});
}

async function exportToExcel(commits, projectName) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Commits');

  sheet.addRow(['作者', '提交时间', '提交备注']);

  const now = Date.now();
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
  const grouped = groupByAuthor(commits);

  Object.entries(grouped).forEach(([author, list]) => {
    sheet.addRow([author]);
    list.forEach(commit => {
      const date = new Date(commit.date);
      const row = sheet.addRow(['', commit.date, commit.message]);
      if (now - date.getTime() < twoDaysMs) {
        row.eachCell(cell => {
          cell.font = { color: { argb: 'FFFF0000' } };
        });
      }
    });
    sheet.addRow([]);
  });

  const filePath = `./diff-${projectName}.xlsx`;
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = { exportToExcel };
