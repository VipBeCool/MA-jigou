const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, 'css/style.css');

let css = fs.readFileSync(cssPath, 'utf-8');
const oldHover = '.action-btn:hover { background: var(--gray-100); color: var(--gray-800); text-decoration: none; }';
const newHover = `.action-btn:hover { background: var(--gray-100); color: var(--gray-800); text-decoration: none; }
.action-btn.primary { color: var(--brand); font-weight: 600; }
.action-btn.danger { color: #dc2626; }`;
css = css.replace(oldHover, newHover);
fs.writeFileSync(cssPath, css, 'utf-8');
console.log("Updated style.css");

// Update customers.html
const custPath = path.join(__dirname, 'customers.html');
let cust = fs.readFileSync(custPath, 'utf-8');
cust = cust.replace('<button class="action-btn" onclick="goDetail(${item.id})">详情</button>', '<button class="action-btn primary" onclick="goDetail(${item.id})">详情</button>');
fs.writeFileSync(custPath, cust, 'utf-8');

// Update org-config.html
const orgConfigPath = path.join(__dirname, 'org-config.html');
let orgConfig = fs.readFileSync(orgConfigPath, 'utf-8');
orgConfig = orgConfig.replace(/<button class="action-btn" onclick="openMemberModal\('edit', '\${m\.id}'\)">编辑<\/button>/g, '<button class="action-btn primary" onclick="openMemberModal(\'edit\', \'${m.id}\')">编辑</button>');
fs.writeFileSync(orgConfigPath, orgConfig, 'utf-8');

// Update org-members.html
const orgMembersPath = path.join(__dirname, 'org-members.html');
let orgMembers = fs.readFileSync(orgMembersPath, 'utf-8');
orgMembers = orgMembers.replace(/<button class="action-btn" onclick="openEditModal\('\${m\.id}'\)">编辑<\/button>/g, '<button class="action-btn primary" onclick="openEditModal(\'${m.id}\')">编辑</button>');
fs.writeFileSync(orgMembersPath, orgMembers, 'utf-8');

console.log("Updated html files");
