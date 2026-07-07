const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'customers.html');
let content = fs.readFileSync(targetPath, 'utf-8');

const doFilterRegex = /if \(currentView === 'table'\) renderTable\(list\);\s*else renderCards\(list\);/g;
content = content.replace(doFilterRegex, "window.filtered = list; renderTable(list);");

const emptyStateRegex = /document\.getElementById\('emptyState'\)\.style\.display = list\.length === 0 \? 'block' : 'none';/g;
content = content.replace(emptyStateRegex, ""); // renderTable already handles emptyState

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Fixed doFilter!");
