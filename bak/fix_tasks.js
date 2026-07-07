const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'tasks.html');
let content = fs.readFileSync(targetPath, 'utf-8');

// 1. Fix the missing </div> for .group-header
// The broken structure is:
//         <div class="group-header">
//           <div class="group-header-body">
//             <div class="group-header-row1">
//               <span class="group-header-title">...</span>
//               <span class="group-header-count">...</span>
//           </div>
//         </div>
//         <div class="cards-grid">
// We need to add one more </div> before <div class="cards-grid">.
content = content.replace(/(\s*<\/div>\s*<\/div>\s*)(<div class="cards-grid">)/g, "$1</div>\n        $2");

// Also, let's refine .group-header CSS so it doesn't have the blue left border
content = content.replace(/\.group-header \{[\s\S]*?\}/, `.group-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      margin-top: 10px;
    }`);
content = content.replace(/\.group-header\.paused \{ border-left-color: var\(--gray-300\); \}/g, "");
content = content.replace(/padding-left: 12px;\n      border-left: 3px solid var\(--brand\);/g, "");


// 2. Add missing Contact Drawer CSS to style.css or tasks.html inline.
// It's safer to add it to tasks.html <style> block.
const contactCSS = `
    /* ===== 触达路径 Drawer CSS ===== */
    .contact-tabs { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
    .contact-tab { padding: 12px 20px; font-size: 14px; font-weight: 500; color: var(--gray-500); cursor: pointer; border-bottom: 2px solid transparent; }
    .contact-tab.active { color: var(--brand); border-bottom-color: var(--brand); font-weight: 600; }
    .contact-pane { display: none; }
    .contact-pane.active { display: block; }
    .contact-path-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: var(--gray-50);
      border-radius: 8px;
      margin-bottom: 12px;
      align-items: flex-start;
    }
    .cp-tier {
      width: 28px; height: 28px;
      background: var(--brand-light); color: var(--brand);
      border-radius: 6px; font-weight: 700; font-size: 13px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .cp-info { flex: 1; }
    .cp-role { font-size: 14px; font-weight: 600; color: var(--gray-800); margin-bottom: 4px; }
    .cp-phone { font-size: 13px; font-weight: 500; color: var(--gray-900); margin-bottom: 6px; display: flex; align-items: center; }
    .cp-tips { font-size: 12px; color: var(--gray-500); line-height: 1.5; }
    .cp-call-btn {
      background: #eff6ff; color: var(--brand); border: none;
      padding: 6px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 600;
      cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
      transition: all 0.2s;
    }
    .cp-call-btn:hover { background: #dbeafe; }
`;
if (!content.includes('.contact-tabs { display: flex;')) {
    content = content.replace('</style>', contactCSS + '\n  </style>');
}

// 3. Fix the active tab CSS bug (my previous regex messed up)
// We need to restore .st-label and .stage-tab:hover .st-label properly.
// Wait, since I don't know exactly how I messed it up, let's just rewrite the whole stage-tabs CSS block to be clean.
const newTabsCSS = `
    /* ===== Stage Tab 导航 ===== */
    .stage-tabs {
      display: flex;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
      margin-bottom: 24px;
      overflow-x: auto;
      padding: 6px 8px;
    }
    .stage-tab {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      white-space: nowrap;
      flex-shrink: 0;
      border-radius: 8px;
    }
    .stage-tab:hover { background: var(--gray-50); }
    .stage-tab:hover .st-label { color: var(--gray-800); }
    .stage-tab.active { background: #eff6ff; }
    .stage-tab.active .st-label { color: var(--brand); font-weight: 700; }
    .stage-tab.active .st-count { background: var(--brand); color: white; }

    .st-label {
      font-size: 14.5px;
      font-weight: 500;
      color: var(--gray-500);
      transition: color 0.15s;
    }
    .st-count {
      font-size: 11.5px;
      font-weight: 700;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 100px;
      background: var(--gray-200);
      color: var(--gray-500);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
`;
// Replace the entire section from /* ===== Stage Tab 导航 ===== */ to /* ===== 分组标题（轻量两行式） ===== */
content = content.replace(/\/\* ===== Stage Tab 导航 ===== \*\/[\s\S]*?\/\* ===== 分组标题（轻量两行式） ===== \*\//, newTabsCSS + '\n    /* ===== 分组标题（轻量两行式） ===== */');

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Fixed tasks.html structure and CSS.");
