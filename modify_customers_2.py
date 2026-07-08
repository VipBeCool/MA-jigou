import re

with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/customers.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace tbHtml body loop
tb_body_repl = """
  let tbHtml = '';
  list.forEach((item, index) => {
    tbHtml += `<tr>`;
    tbHtml += `<td style="text-align:center;color:var(--gray-500);">${index + 1}</td>`;
    allColumns.forEach(c => {
      if (visibleCols.includes(c.key)) {
        if (c.key === 'name') tbHtml += `<td><a href="javascript:void(0)" class="table-link" onclick="goDetail(${item.id})">${item.name}</a></td>`;
        else if (c.key === 'uscc') tbHtml += `<td style="color:var(--gray-500);">${item.uscc || '-'}</td>`;
        else if (c.key === 'region') tbHtml += `<td>${item.region || '-'}</td>`;
        else if (c.key === 'org') tbHtml += `<td style="color:var(--gray-700);">${item.org || '-'}</td>`;
        else if (c.key === 'owner') {
          const ownerName = window.OWNER_MAP && window.OWNER_MAP[item.owner] ? window.OWNER_MAP[item.owner] : (item.owner || '-');
          tbHtml += `<td style="color:var(--gray-800);">${ownerName}</td>`;
        }
        else if (c.key === 'legalPerson') tbHtml += `<td style="color:var(--gray-800);">${item.legalPerson || '-'}</td>`;
        else if (c.key === 'status') tbHtml += `<td>${item.status || '-'}</td>`;
        else if (c.key === 'entityType') tbHtml += `<td>${item.entityType || '-'}</td>`;
        else if (c.key === 'indCat') tbHtml += `<td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.indCat || ''}">${item.indCat || '-'}</td>`;
        else if (c.key === 'indType') tbHtml += `<td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.indType || ''}">${item.indType || '-'}</td>`;
        else if (c.key === 'regCap') tbHtml += `<td>${item.regCap || '-'}</td>`;
        else if (c.key === 'regDate') tbHtml += `<td>${item.regDate || '-'}</td>`;
        else if (c.key === 'addr') tbHtml += `<td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.addr || ''}">${item.addr || '-'}</td>`;
        else if (c.key === 'product') tbHtml += `<td>${item.product}</td>`;
        else if (c.key === 'rs') {
          const r = RS_MAP[item.rs] || { l: '-', c: 'var(--gray-500)', bg: 'var(--gray-100)' };
          tbHtml += `<td style="text-align:center;"><span class="status-badge" style="background:${r.bg};color:${r.c};">${r.l}</span></td>`;
        }
        else if (c.key === 'bs') {
          const b = BS_MAP[item.bs];
          if (b && b.l) tbHtml += `<td style="text-align:center;"><span class="status-badge" style="background:${b.bg};color:${b.c};">${b.l}</span></td>`;
          else tbHtml += `<td style="text-align:center;"><span style="color:var(--gray-300);">-</span></td>`;
        }
        else if (c.key === 'lastContact') tbHtml += `<td style="color:var(--gray-500);">${item.lastContact}</td>`;
        else if (c.key === 'action') tbHtml += `<td style="text-align:center;">
            <div class="action-btns">
              <button class="action-btn primary" onclick="goDetail(${item.id})">详情</button>
              <button class="action-btn" onclick="openMarkDrawer(${item.id})">状态</button>
              <button class="action-btn" onclick="openContactModal(${item.id})">触达</button>
            </div>
          </td>`;
      }
    });
    tbHtml += `</tr>`;
  });
"""

content = re.sub(r"let tbHtml = '';\n  list\.forEach\(\(item, index\) => \{.*?\n  \}\);", tb_body_repl.strip(), content, flags=re.DOTALL)


dom_loaded_repl = """
document.addEventListener('DOMContentLoaded', () => {
  initColPopover();
  // 读取 URL 参数自动设置筛选
  const urlParams = new URLSearchParams(window.location.search);
  const ownerParam = urlParams.get('owner');
  const orgParam = urlParams.get('org');
  
  if (ownerParam) {
    filterState.owner = ownerParam;
    const ownerSel = document.getElementById('filterOwner');
    if (ownerSel) { ownerSel.value = ownerParam; }
  }
  
  if (orgParam) {
    let decodedOrg = decodeURIComponent(orgParam);
    filterState.org = decodedOrg;
    const orgSel = document.getElementById('filterOrg');
    if (orgSel) {
      let exists = Array.from(orgSel.options).some(opt => opt.value === decodedOrg);
      if(!exists) {
        let newOption = new Option(decodedOrg, decodedOrg);
        orgSel.add(newOption);
      }
      orgSel.value = decodedOrg;
    }
  }
  
  doFilter();
});
"""
content = re.sub(r"document\.addEventListener\('DOMContentLoaded', \(\) => \{.*?\}\);\n", dom_loaded_repl.strip() + '\n', content, flags=re.DOTALL)


with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/customers.html', 'w', encoding='utf-8') as f:
    f.write(content)
