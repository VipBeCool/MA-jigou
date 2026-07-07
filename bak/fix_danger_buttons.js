const fs = require('fs');
const path = require('path');

function processFile(filename) {
    const filePath = path.join(__dirname, filename);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add .danger to "禁用", "删除", "停用" buttons
    content = content.replace(/<button class="action-btn" onclick="([^"]+)">禁用<\/button>/g, '<button class="action-btn danger" onclick="$1">禁用</button>');
    content = content.replace(/<button class="action-btn" onclick="([^"]+)">删除<\/button>/g, '<button class="action-btn danger" onclick="$1">删除</button>');
    content = content.replace(/<button class="action-btn" onclick="([^"]+)">停用<\/button>/g, '<button class="action-btn danger" onclick="$1">停用</button>');
    
    // In case they had 'primary' added by my previous script but should be danger? 
    // No, I only added primary to "详情" and "编辑".
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Processed " + filename);
}

processFile('org-config.html');
processFile('org-members.html');
