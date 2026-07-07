const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'tasks.html');
let content = fs.readFileSync(targetPath, 'utf-8');

// 1. Redesign CSS for stage-tabs and follow-card
content = content.replace(/\.stage-tabs \{[\s\S]*?\}/, `.stage-tabs {
      display: flex;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
      margin-bottom: 24px;
      overflow-x: auto;
      padding: 6px 8px;
    }`);

content = content.replace(/\.stage-tab \{[\s\S]*?\}/, `.stage-tab {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 24px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      white-space: nowrap;
      flex-shrink: 0;
      border-radius: 8px;
    }`);

content = content.replace(/\.stage-tab::after \{[\s\S]*?\}/, ``); // Remove the underline

content = content.replace(/\.stage-tab:hover .st-label \{[\s\S]*?\}/, `.stage-tab:hover { background: var(--gray-50); }
    .stage-tab:hover .st-label { color: var(--gray-800); }`);

content = content.replace(/\.stage-tab\.active::after \{[\s\S]*?\}/, ``);

content = content.replace(/\.stage-tab\.active \.st-label \{[\s\S]*?\}/, `.stage-tab.active { background: #eff6ff; }
    .stage-tab.active .st-label { color: var(--brand); font-weight: 700; }`);

content = content.replace(/\.st-label \{[\s\S]*?\}/, `.st-label {
      font-size: 15px;
      font-weight: 600;
      color: var(--gray-500);
      transition: color 0.15s;
    }`);


// Redesign Follow Card CSS
content = content.replace(/\.follow-card \{[\s\S]*?\}/, `.follow-card {
      background: var(--bg-card);
      border-radius: 16px;
      border: 1px solid var(--border);
      padding: 20px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }`);

content = content.replace(/\.fc-row1 \{[\s\S]*?\}/, `.fc-main {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .fc-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #eff6ff;
      color: var(--brand);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }`);

content = content.replace(/\.fc-name \{[\s\S]*?\}/, `.fc-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--gray-900);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }`);

content = content.replace(/\.fc-sub \{[\s\S]*?\}/, `.fc-sub {
      font-size: 13px;
      color: var(--gray-500);
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }`);

content = content.replace(/\.fc-actions \{[\s\S]*?\}/, `.fc-actions {
      display: flex;
      gap: 10px;
      padding-top: 16px;
      border-top: 1px dashed var(--gray-100);
    }`);

content = content.replace(/\.fc-btn \{[\s\S]*?\}/, `.fc-btn {
      flex: 1;
      padding: 8px 0;
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.15s;
      white-space: nowrap;
      text-align: center;
    }`);

// Fix the HTML for each card
const svgIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"></path><path d="M6 12H4a2 2 0 0 0-2 2v8"></path><path d="M18 16h2a2 2 0 0 1 2 2v4"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>`;

const cardRegex = /<div class="fc-row1">([\s\S]*?)<div class="fc-name-wrap">([\s\S]*?)<\/div>\s*<div class="fc-actions" onclick="event\.stopPropagation\(\)">([\s\S]*?)<\/div>\s*<\/div>/g;

content = content.replace(cardRegex, (match, prefix, nameWrap, actions) => {
    return `<div class="fc-main">
              <div class="fc-icon">
                ${svgIcon}
              </div>
              <div class="fc-name-wrap">
                ${nameWrap.trim()}
              </div>
            </div>
            <div class="fc-actions" onclick="event.stopPropagation()">
              ${actions.trim()}
            </div>`;
});

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Updated tasks.html successfully.");
