const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'customers.html');
let content = fs.readFileSync(targetPath, 'utf-8');

// The column JS to inject
const columnJS = `
// ==================== 列配置逻辑 ====================
const allColumns = [
  { key: 'name', label: '企业名称', fixed: true },
  { key: 'uscc', label: '统一社会信用代码', fixed: false, default: true },
  { key: 'legalPerson', label: '法定代表人', fixed: false, default: true },
  { key: 'status', label: '企业状态', fixed: false, default: true },
  { key: 'entityType', label: '实体类型', fixed: false, default: true },
  { key: 'indCat', label: '行业门类', fixed: false, default: true },
  { key: 'indType', label: '行业大类', fixed: false, default: true },
  { key: 'regCap', label: '注册资本', fixed: false, default: true },
  { key: 'regDate', label: '成立日期', fixed: false, default: true },
  { key: 'addr', label: '企业住所', fixed: false, default: true },
  { key: 'product', label: '适配产品', fixed: false, default: false },
  { key: 'rs', label: '营销状态', fixed: false, default: false },
  { key: 'bs', label: '业务状态', fixed: false, default: false },
  { key: 'lastContact', label: '最近跟进', fixed: false, default: false },
  { key: 'action', label: '操作', fixed: true }
];

let visibleCols = JSON.parse(localStorage.getItem('wb_list_cols')) || allColumns.filter(c => c.fixed || c.default).map(c => c.key);

function toggleColPopover(e) {
  e.stopPropagation();
  const pop = document.getElementById('colPopover');
  pop.classList.toggle('show');
}
document.addEventListener('click', e => {
  const pop = document.getElementById('colPopover');
  if (pop && pop.classList.contains('show') && !e.target.closest('.col-settings')) {
    pop.classList.remove('show');
  }
});
function initColPopover() {
  const body = document.getElementById('colPopBody');
  if(!body) return;
  let html = '';
  allColumns.forEach(c => {
    const isChecked = visibleCols.includes(c.key) ? 'checked' : '';
    const isFixed = c.fixed ? 'disabled' : '';
    const fixedStyle = c.fixed ? 'opacity: 0.5; cursor: not-allowed;' : '';
    html += \`<label class="col-pop-item" style="\${fixedStyle}">
      <input type="checkbox" value="\${c.key}" \${isChecked} \${isFixed} onchange="onColChange(this)">
      <span>\${c.label}</span>
    </label>\`;
  });
  body.innerHTML = html;
}
function onColChange(cb) {
  if (cb.checked) {
    if (!visibleCols.includes(cb.value)) visibleCols.push(cb.value);
  } else {
    visibleCols = visibleCols.filter(v => v !== cb.value);
  }
  localStorage.setItem('wb_list_cols', JSON.stringify(visibleCols));
  renderTable(window.filtered || window.customersData);
}
function resetColumns() {
  visibleCols = allColumns.filter(c => c.fixed || c.default).map(c => c.key);
  localStorage.setItem('wb_list_cols', JSON.stringify(visibleCols));
  initColPopover();
  renderTable(window.filtered || window.customersData);
}

// 覆盖原本的 renderTable
function renderTable(list) {
  if(!list) list = [];
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if(!thead || !tbody) return;

  // Render Head
  let thHtml = '<tr>';
  thHtml += \`<th style="width:50px;text-align:center;">序号</th>\`;
  allColumns.forEach(c => {
    if (visibleCols.includes(c.key)) {
      thHtml += \`<th>\${c.label}</th>\`;
    }
  });
  thHtml += '</tr>';
  thead.innerHTML = thHtml;

  // Render Body
  if (list.length === 0) {
    tbody.innerHTML = '';
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('tableView').style.display = 'none';
    return;
  }
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('tableView').style.display = 'block';

  let tbHtml = '';
  list.forEach((item, index) => {
    tbHtml += \`<tr onclick="goDetail(\${item.id})">\`;
    tbHtml += \`<td style="text-align:center;color:var(--gray-500);">\${index + 1}</td>\`;
    allColumns.forEach(c => {
      if (visibleCols.includes(c.key)) {
        if (c.key === 'name') tbHtml += \`<td><a href="javascript:void(0)" class="table-link">\${item.name}</a></td>\`;
        else if (c.key === 'uscc') tbHtml += \`<td style="color:var(--gray-500);">\${item.uscc || '-'}</td>\`;
        else if (c.key === 'legalPerson') tbHtml += \`<td style="color:var(--gray-800);">\${item.legalPerson || '-'}</td>\`;
        else if (c.key === 'status') tbHtml += \`<td>\${item.status || '-'}</td>\`;
        else if (c.key === 'entityType') tbHtml += \`<td>\${item.entityType || '-'}</td>\`;
        else if (c.key === 'indCat') tbHtml += \`<td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="\${item.indCat || ''}">\${item.indCat || '-'}</td>\`;
        else if (c.key === 'indType') tbHtml += \`<td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="\${item.indType || ''}">\${item.indType || '-'}</td>\`;
        else if (c.key === 'regCap') tbHtml += \`<td>\${item.regCap || '-'}</td>\`;
        else if (c.key === 'regDate') tbHtml += \`<td>\${item.regDate || '-'}</td>\`;
        else if (c.key === 'addr') tbHtml += \`<td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="\${item.addr || ''}">\${item.addr || '-'}</td>\`;
        else if (c.key === 'product') tbHtml += \`<td><span style="background:var(--gray-100);padding:2px 8px;border-radius:4px;font-size:12px;color:var(--gray-700);">\${item.product}</span></td>\`;
        else if (c.key === 'rs') tbHtml += \`<td><span class="status-badge \${getRsClass(item.rs)}">\${getRsText(item.rs)}</span></td>\`;
        else if (c.key === 'bs') tbHtml += \`<td><span class="status-badge \${getBsClass(item.bs)}">\${getBsText(item.bs)}</span></td>\`;
        else if (c.key === 'lastContact') tbHtml += \`<td style="color:var(--gray-500);">\${item.lastContact}</td>\`;
        else if (c.key === 'action') tbHtml += \`<td onclick="event.stopPropagation()">
            <button class="btn btn-primary" style="padding:4px 10px; border-radius:6px; font-size:12px;" onclick="openMarkModal(\${item.id}, '\${item.name}')">状态</button>
            <button class="btn btn-default" style="padding:4px 10px; border-radius:6px; font-size:12px; margin-left:6px; background:white; border:1px solid var(--border);" onclick="openContactDrawer(\${item.id}, '\${item.name}')">路径</button>
          </td>\`;
      }
    });
    tbHtml += \`</tr>\`;
  });
  tbody.innerHTML = tbHtml;
}

function setView(v) {
  // dummy to prevent errors from leftover calls
}

document.addEventListener('DOMContentLoaded', () => {
  initColPopover();
  doFilter();
});
`;

// Replace `function renderTable(list) { ... }` up to the end of `renderCards(list) { ... }`
// The old JS goes from `function renderTable(list)` all the way down. Let's just use string operations.
const idxRenderTable = content.indexOf('function renderTable(list) {');
const idxSetView = content.indexOf('function setView(v) {');
if (idxRenderTable !== -1 && idxSetView !== -1) {
  // Find where setView ends
  let endOfSetView = content.indexOf('}', idxSetView) + 1;
  const oldCode = content.substring(idxRenderTable, endOfSetView);
  content = content.replace(oldCode, columnJS);
} else {
  console.log("Could not find the exact JS block!");
}

// Remove the default initializations of currentView
content = content.replace(/let currentView = 'table';\s*$/, "");
content = content.replace(/if \(currentView === 'table'\) renderTable\(filtered\);\n\s*else renderCards\(filtered\);/, "renderTable(filtered);");
content = content.replace(/if \(currentView === 'table'\) \{\s*document.getElementById\('tableView'\).style.display = 'block';\s*\} else \{\s*document.getElementById\('cardView'\).style.display = 'block';\s*\}/, "");

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Successfully replaced JS logic!");
