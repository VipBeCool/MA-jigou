const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'customers.html');
let content = fs.readFileSync(targetPath, 'utf-8');

// 1. Remove the "重置" button inside toolbar-filters
const resetBtnRegex = /<button class="btn btn-default" style="padding: 6px 14px; border-radius: 8px; font-size: 13px; border: 1px solid var\(--border\); background: white; cursor: pointer; height: 35px;" onclick="resetFilters\(\)">重置<\/button>/g;
content = content.replace(resetBtnRegex, "");

// 2. Restructure the toolbar
// Find the start of <div class="toolbar"> and the end of it (before <!-- 列表信息栏 -->)
const toolbarStart = content.indexOf('<div class="toolbar">');
const listMetaStart = content.indexOf('<!-- 列表信息栏 -->');
let toolbarHTML = content.substring(toolbarStart, listMetaStart);

// We need to extract:
// - toolbar-search
// - toolbar-filters
// - toolbar-right
const searchMatch = toolbarHTML.match(/<div class="toolbar-search">[\s\S]*?<\/div>/);
const filtersMatch = toolbarHTML.match(/<div class="toolbar-filters">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/); 
// wait, toolbar-filters is complex because of regionCascader which has many nested divs.
// Let's use string manipulation instead of regex for HTML block extraction.

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

const searchBlock = getBlock(toolbarHTML, '<div class="toolbar-search">');
const filtersBlock = getBlock(toolbarHTML, '<div class="toolbar-filters">');
const rightBlock = getBlock(toolbarHTML, '<div class="toolbar-right">');

if (searchBlock && filtersBlock && rightBlock) {
    const newToolbarHTML = `
        <!-- 工具栏 -->
        <div class="toolbar">
          <div class="toolbar-top" style="display:flex; align-items:center; justify-content:space-between; gap:12px; width:100%;">
            ${searchBlock.replace(/max-width: 360px/, 'max-width: 400px')}
            
            <div class="toolbar-right" style="display:flex; align-items:center; gap:8px;">
              ${rightBlock.replace('<div class="toolbar-right">', '').replace(/<\/div>$/, '')}
              <button class="btn btn-default" id="toggleAdvFilterBtn" onclick="toggleAdvFilters()" style="padding:7px 12px; border-radius:8px; font-size:13.5px; border:1px solid var(--border); background:white; color:var(--gray-700); cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.2s;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                高级筛选
                <svg id="advFilterArrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
          </div>
          
          <div class="toolbar-advanced" id="advancedFilters" style="display:none; padding:16px; background:var(--gray-50); border-radius:12px; border:1px solid var(--border); width:100%; box-sizing:border-box;">
            ${filtersBlock}
          </div>
        </div>
        `;
    
    content = content.substring(0, toolbarStart) + newToolbarHTML + "\n        " + content.substring(listMetaStart);
} else {
    console.error("Could not extract toolbar blocks.");
}

// 3. Fix the CSS for toolbar
content = content.replace(/\.toolbar \{[\s\S]*?flex-wrap: wrap;\n    \}/, `.toolbar {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
      margin-bottom: 18px;
    }`);
content = content.replace(/\.toolbar-search \{\n      flex: 1;\n      min-width: 200px;\n      max-width: 360px;\n      position: relative;\n    \}/, `.toolbar-search {
      flex: 1;
      min-width: 200px;
      max-width: 400px;
      position: relative;
    }`);

// 4. Add the toggle script
const toggleScript = `
function toggleAdvFilters() {
  const panel = document.getElementById('advancedFilters');
  const arrow = document.getElementById('advFilterArrow');
  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    arrow.style.transform = 'rotate(180deg)';
  } else {
    panel.style.display = 'none';
    arrow.style.transform = 'rotate(0deg)';
  }
}
`;
content = content.replace('// ==================== 列配置逻辑 ====================', toggleScript + '\n// ==================== 列配置逻辑 ====================');

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Successfully refactored toolbar!");
