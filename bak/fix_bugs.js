const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'customers.html');
let content = fs.readFileSync(targetPath, 'utf-8');

// 1. Fix SVG sizes
content = content.replace(/<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"/g, '<svg style="width:15px;height:15px;flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor"');
content = content.replace(/<svg id="advFilterArrow" width="14" height="14"/g, '<svg id="advFilterArrow" style="width:14px;height:14px;flex-shrink:0;transition:transform 0.2s;"');

// 2. Fix data variable issue
content = content.replace(/window\.customersData/g, 'ALL_DATA');

// 3. Remove 手工导入 marks
content = content.replace(/<span style="float:right;font-size:11px;font-weight:400;color:var\(--gray-400\);">手工导入<\/span>/g, '');
content = content.replace(/<span style="font-size:10\.5px;font-weight:700;padding:1px 5px;border-radius:4px;background:#fef3c7;color:#92400e;line-height:1\.6;">📋 手工<\/span>/g, '');
// Change the structure of the batch item to fix wrapping
content = content.replace(/<span style="display:flex;align-items:center;gap:4px;padding-left:4px;">\s*橙业贷手工筛选20260615\s*<\/span>/g, '<span style="padding-left:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px;" title="橙业贷手工筛选20260615">橙业贷手工筛选20260615</span>');
// Also apply ellipsis to other batch spans
content = content.replace(/<span style="padding-left:4px;">(.*?)<\/span>/g, '<span style="padding-left:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px; display:inline-block; vertical-align:middle;" title="$1">$1</span>');

// 4. Rename 产品批次 to 名单批次
content = content.replace(/>按产品批次</g, '>按名单批次<');
content = content.replace(/<div class="filter-section-label">产品批次<\/div>/g, '<div class="filter-section-label">名单批次</div>');
content = content.replace(/<div class="filter-section-label">产品批次<span/g, '<div class="filter-section-label">名单批次<span'); // just in case

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Fixed all bugs!");
