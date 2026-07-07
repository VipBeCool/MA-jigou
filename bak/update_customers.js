const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'customers.html');
let content = fs.readFileSync(targetPath, 'utf-8');

// 1. Update Sort Options
const oldSortHTML = `<select class="form-control sort-select" id="sortSelect" onchange="doFilter()">
              <option value="default">综合排序</option>
              <option value="intent_desc">需求意向最高</option>
              <option value="alloc_desc">分配时间最新</option>
            </select>`;
const newSortHTML = `<select class="form-control sort-select" id="sortSelect" onchange="doFilter()">
              <option value="default">综合排序</option>
              <option value="intent_desc">需求意向最高</option>
              <option value="risk_asc">违约风险最低</option>
              <option value="alloc_desc">分配时间最近</option>
              <option value="alloc_asc">分配时间最早</option>
            </select>`;
content = content.replace(oldSortHTML, newSortHTML);

// Also update the sorting logic in doFilter()
const oldSortLogic = /if \(sort === 'intent_desc'\) list\.sort\(\(a,b\) => b\.ds - a\.ds\);\s*else if \(sort === 'alloc_desc'\) list\.sort\(\(a,b\) => b\.id - a\.id\);/;
const newSortLogic = `if (sort === 'intent_desc') list.sort((a,b) => b.ds - a.ds);
  else if (sort === 'alloc_desc') list.sort((a,b) => b.id - a.id);
  else if (sort === 'alloc_asc') list.sort((a,b) => a.id - b.id);
  else if (sort === 'risk_asc') {
    const riskMap = { '低': 1, '中': 2, '高': 3 };
    list.sort((a,b) => (riskMap[a.risk] || 9) - (riskMap[b.risk] || 9));
  }`;
content = content.replace(oldSortLogic, newSortLogic);

// 2. Rename 高级筛选 to 筛选
content = content.replace(/高级筛选\s*<svg id="advFilterArrow"/g, '筛选\n                <svg id="advFilterArrow"');

// 3. Remove 快速筛选
function getBlock(html, startClass) {
    const startIdx = html.indexOf(startClass);
    if (startIdx === -1) return "";
    let openCount = 0;
    let i = startIdx;
    for (; i < html.length; i++) {
        if (html.substring(i, i+4) === '<div') {
            openCount++;
        } else if (html.substring(i, i+5) === '</div') {
            openCount--;
            if (openCount === 0) {
                return html.substring(startIdx, i + 6);
            }
        }
    }
    return "";
}

// Find the filter-section that contains "快速筛选"
const quickFilterLabelIdx = content.indexOf('<div class="filter-section-label">快速筛选</div>');
if (quickFilterLabelIdx !== -1) {
    // Traverse backwards to find its parent <div class="filter-section">
    const beforeLabel = content.substring(0, quickFilterLabelIdx);
    const startClass = '<div class="filter-section">';
    const lastFilterSectionIdx = beforeLabel.lastIndexOf(startClass);
    if (lastFilterSectionIdx !== -1) {
        const quickFilterBlock = getBlock(content.substring(lastFilterSectionIdx), startClass);
        if (quickFilterBlock.includes('快速筛选')) {
            content = content.replace(quickFilterBlock, '');
        }
    }
}

// 4. Empty state update
// Replace old emptyState content
const oldEmptyStateMatch = content.match(/<div class="empty-state" id="emptyState" style="display:none;">[\s\S]*?<\/div>\s*<\/div>/);
if (oldEmptyStateMatch) {
    const newEmptyState = `<div class="empty-state" id="emptyState" style="display:none; text-align:center; padding: 60px 20px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px;">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="15" y2="17"></line>
          </svg>
          <div style="font-size: 14px; color: var(--gray-400);">暂无符合条件的客户数据</div>
        </div>`;
    content = content.replace(oldEmptyStateMatch[0], newEmptyState);
}

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Updated customers.html successfully.");
