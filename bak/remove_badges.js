const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'customers.html');

let content = fs.readFileSync(targetPath, 'utf-8');

// Use regex to remove <span class="filter-option-count"...>...</span>
content = content.replace(/<span class="filter-option-count"[^>]*>.*?<\/span>/g, '');

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Removed filter option count badges from customers.html");
