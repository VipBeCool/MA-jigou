const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'customers.html');
let content = fs.readFileSync(targetPath, 'utf-8');

const oldVisibleCols = /let visibleCols = JSON\.parse\(localStorage\.getItem\('wb_list_cols'\)\) \|\| allColumns\.filter\(c => c\.fixed \|\| c\.default\)\.map\(c => c\.key\);/;
const newVisibleCols = `let visibleCols = JSON.parse(localStorage.getItem('wb_list_cols'));
if (!visibleCols) {
  visibleCols = allColumns.filter(c => c.fixed || c.default).map(c => c.key);
} else {
  // Ensure fixed columns are always included
  allColumns.forEach(c => {
    if (c.fixed && !visibleCols.includes(c.key)) {
      visibleCols.push(c.key);
    }
  });
}`;
content = content.replace(oldVisibleCols, newVisibleCols);

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Updated visibleCols logic");
