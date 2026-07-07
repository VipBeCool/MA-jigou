const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'customers.html');
let content = fs.readFileSync(targetPath, 'utf-8');

// 1. Remove .view-toggle HTML
const viewToggleRegex = /<div class="view-toggle">[\s\S]*?<\/div>\s*<\/div>/;
// We'll replace it with the new column settings button
const newToolbarRight = `
            <div class="col-settings">
              <button class="col-settings-btn" id="colSettingsBtn" onclick="toggleColPopover(event)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                列展示
              </button>
              <div class="col-popover" id="colPopover">
                <div class="col-pop-header">
                  <span>列展示</span>
                  <span class="col-pop-reset" onclick="resetColumns()">重置</span>
                </div>
                <div class="col-pop-body" id="colPopBody">
                  <!-- JS generated -->
                </div>
              </div>
            </div>`;
content = content.replace(viewToggleRegex, newToolbarRight);

// 2. Remove #cardView HTML
const cardViewRegex = /<!-- 卡片视图 -->\s*<div id="cardView" style="display:none;">\s*<div class="card-grid" id="cardGrid"><\/div>\s*<\/div>/;
content = content.replace(cardViewRegex, "");

// 3. Update table HTML structure (we need to give id to headers so JS can show/hide them, or we can just re-render the whole table in JS)
// Let's replace the whole thead with a dynamically rendered one or simply replace the table view block with a single container and render the table entirely via JS.
const tableBlockRegex = /<table class="cust-table">[\s\S]*?<\/table>/;
const newTableBlock = `<table class="cust-table">
              <thead id="tableHead"></thead>
              <tbody id="tableBody"></tbody>
            </table>`;
content = content.replace(tableBlockRegex, newTableBlock);

// 4. Update the mock data
const mockDataRegex = /const custData = \[[\s\S]*?\];/;
const newMockData = `const custData = [
  { id:1,  name:'常州万事鑫悦汽车有限公司', uscc:'91320411MADHPW667C', legalPerson:'马宇',  status:'在业', entityType:'企业', indCat:'批发和零售业', indType:'批发业', regCap:'5000000人民币', regDate:'2024-04-19', addr:'常州市新北区河海中路', rs:'CONFIRM', bs:'NONE', product:'苏科贷', lastContact: '2小时前' },
  { id:2,  name:'靖江市众志金属结构有限公司', uscc:'91321282MADFA8E42T', legalPerson:'徐志明', status:'在业', entityType:'企业', indCat:'制造业', indType:'金属制品业', regCap:'3550000人民币', regDate:'2024-03-21', addr:'靖江市经济开发区', rs:'FOLLOWING', bs:'NONE', product:'信易贷', lastContact: '昨天' },
  { id:3,  name:'扬州阳祖木业有限公司', uscc:'91321012MACUDXAE5Q', legalPerson:'王尚建', status:'在业', entityType:'企业', indCat:'制造业', indType:'木材加工', regCap:'5000000人民币', regDate:'2023-09-08', addr:'扬州市江都区', rs:'CONVERT', bs:'NONE', product:'苏信贷', lastContact: '1天前' },
  { id:4,  name:'常州耀梵是新材料科技有限公司', uscc:'91320412MACUC3CG71', legalPerson:'钱璞',   status:'在业', entityType:'企业', indCat:'科学研究和技术服务业', indType:'科技推广', regCap:'10000000人民币', regDate:'2023-08-11', addr:'常州市武进区', rs:'FOLLOWING', bs:'NONE', product:'厂房贷', lastContact: '今天' },
  { id:5,  name:'绿方（江苏南京）新能源科技有限公司', uscc:'91320118MACTWB5A31', legalPerson:'谢入金', status:'在业', entityType:'企业', indCat:'科学研究和技术服务业', indType:'科技推广', regCap:'50000000人民币', regDate:'2023-08-07', addr:'南京市江宁区', rs:'CREDIT', bs:'PROCESSING', product:'专精特新贷', lastContact: '昨天' },
  { id:6,  name:'江苏诚姆新能源有限公司', uscc:'91321191MACQJKNY5N', legalPerson:'朱翔',   status:'在业', entityType:'企业', indCat:'制造业', indType:'专用设备制造', regCap:'10000000人民币', regDate:'2023-08-07', addr:'镇江市丹徒区', rs:'DRAWDOWN', bs:'DONE', product:'苏科贷', lastContact: '今天' },
  { id:7,  name:'无锡超凡供应链管理有限公司', uscc:'91320206MACTW09741', legalPerson:'张冬冬', status:'在业', entityType:'企业', indCat:'租赁和商务服务业', indType:'商务服务业', regCap:'1000000人民币', regDate:'2023-08-07', addr:'无锡市惠山区', rs:'FOLLOWING', bs:'NONE', product:'信易贷', lastContact: '2天前' },
  { id:8,  name:'江阴市创浩智能科技有限公司', uscc:'91320281MACTDJ7K6R', legalPerson:'胡军浩', status:'在业', entityType:'企业', indCat:'科学研究和技术服务业', indType:'科技推广', regCap:'4000000人民币', regDate:'2023-07-28', addr:'江阴市金山路', rs:'PAUSED', bs:'REJECTED', product:'环保贷', lastContact: '1天前' },
  { id:9,  name:'科沃（徐州）生物科技有限公司', uscc:'91320381MACR55YR1R', legalPerson:'陆佳',   status:'在业', entityType:'企业', indCat:'科学研究和技术服务业', indType:'研究和试验发展', regCap:'10000000人民币', regDate:'2023-07-24', addr:'徐州市铜山区', rs:'PAUSED', bs:'NONE', product:'科技贷', lastContact: '3天前' },
  { id:10, name:'南京美丽居生活服务有限公司', uscc:'91320105MACNTFHA90', legalPerson:'孙涛',   status:'在业', entityType:'企业', indCat:'租赁和商务服务业', indType:'商务服务业', regCap:'5000000人民币', regDate:'2023-07-14', addr:'南京市建邺区', rs:'FOLLOWING', bs:'NONE', product:'苏科贷', lastContact: '刚刚' }
];`;
content = content.replace(mockDataRegex, newMockData);

// 5. Inject new JS for columns logic
// We need to append JS logic at the end, right before </script>
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
  renderTable();
}
function resetColumns() {
  visibleCols = allColumns.filter(c => c.fixed || c.default).map(c => c.key);
  localStorage.setItem('wb_list_cols', JSON.stringify(visibleCols));
  initColPopover();
  renderTable();
}

// 覆盖原本的 renderTable
function renderTable() {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if(!thead || !tbody) return;

  // Render Head
  let thHtml = '<tr>';
  thHtml += \`<th>序号</th>\`;
  allColumns.forEach(c => {
    if (visibleCols.includes(c.key)) {
      thHtml += \`<th>\${c.label}</th>\`;
    }
  });
  thHtml += '</tr>';
  thead.innerHTML = thHtml;

  // Render Body
  if (filtered.length === 0) {
    tbody.innerHTML = '';
    return;
  }
  let tbHtml = '';
  filtered.forEach((item, index) => {
    tbHtml += \`<tr onclick="goDetail(\${item.id})">\`;
    tbHtml += \`<td style="text-align:center;">\${index + 1}</td>\`;
    allColumns.forEach(c => {
      if (visibleCols.includes(c.key)) {
        if (c.key === 'name') tbHtml += \`<td><a href="javascript:void(0)" class="table-link">\${item.name}</a></td>\`;
        else if (c.key === 'uscc') tbHtml += \`<td>\${item.uscc}</td>\`;
        else if (c.key === 'legalPerson') tbHtml += \`<td>\${item.legalPerson}</td>\`;
        else if (c.key === 'status') tbHtml += \`<td>\${item.status}</td>\`;
        else if (c.key === 'entityType') tbHtml += \`<td>\${item.entityType}</td>\`;
        else if (c.key === 'indCat') tbHtml += \`<td style="max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="\${item.indCat}">\${item.indCat}</td>\`;
        else if (c.key === 'indType') tbHtml += \`<td style="max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="\${item.indType}">\${item.indType}</td>\`;
        else if (c.key === 'regCap') tbHtml += \`<td>\${item.regCap}</td>\`;
        else if (c.key === 'regDate') tbHtml += \`<td>\${item.regDate}</td>\`;
        else if (c.key === 'addr') tbHtml += \`<td style="max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="\${item.addr}">\${item.addr}</td>\`;
        else if (c.key === 'product') tbHtml += \`<td>\${item.product}</td>\`;
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

// Ensure initColPopover runs on load
const originalDoFilter = window.doFilter;
window.doFilter = function() {
  if (originalDoFilter) originalDoFilter();
  // Ensure the table renders correctly with columns
  // (Assuming originalDoFilter updates 'filtered' and then called renderTable/renderCards)
  // Our overridden renderTable will handle the display.
}

document.addEventListener('DOMContentLoaded', () => {
  initColPopover();
});
`;
// Replace the old renderTable / renderCards / setView functions
const jsToReplaceRegex = /function renderTable\(\) \{[\s\S]*?function setView\(v\) \{[\s\S]*?\}/;
content = content.replace(jsToReplaceRegex, columnJS + "\nfunction setView() {}");

// Also remove initialization of view
content = content.replace(/let currentView = 'table';/, "");
content = content.replace(/if \(currentView === 'table'\) renderTable\(\);\n\s*else renderCards\(\);/, "renderTable();");
content = content.replace(/document\.getElementById\('viewBtnTable'\)\.classList\.add\('active'\);/, "");
content = content.replace(/document\.getElementById\('tableView'\)\.style\.display = 'block';/, "");
content = content.replace(/document\.getElementById\('viewBtnCard'\)\.classList\.remove\('active'\);/, "");
content = content.replace(/document\.getElementById\('cardView'\)\.style\.display = 'none';/, "");


// 6. Inject CSS
const newCSS = `
    /* ===== 客户名单表格增强 & 列设置面板 ===== */
    .cust-table-wrapper {
      overflow-x: auto;
      max-width: 100%;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    .cust-table {
      min-width: 1200px; /* Force scroll */
    }
    .cust-table th, .cust-table td {
      white-space: nowrap;
    }
    
    .col-settings {
      position: relative;
    }
    .col-settings-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: white;
      color: var(--gray-700);
      font-size: 13.5px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .col-settings-btn:hover {
      background: var(--gray-50);
      border-color: var(--brand);
      color: var(--brand);
    }
    .col-popover {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 220px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
      border: 1px solid var(--border);
      z-index: 100;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-5px);
      transition: all 0.2s;
    }
    .col-popover.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .col-pop-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--gray-100);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-800);
    }
    .col-pop-reset {
      font-size: 12.5px;
      color: var(--brand);
      font-weight: 500;
      cursor: pointer;
    }
    .col-pop-body {
      padding: 8px;
      max-height: 300px;
      overflow-y: auto;
    }
    .col-pop-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
    }
    .col-pop-item:hover {
      background: var(--gray-50);
    }
    .col-pop-item input {
      cursor: pointer;
    }
    .col-pop-item span {
      font-size: 13.5px;
      color: var(--gray-700);
    }
`;
content = content.replace('</style>', newCSS + '\n  </style>');

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Successfully rebuilt customers.html for pure table layout with column popover!");
