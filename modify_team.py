import re

with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/team.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CSS
css_additions = """
    /* 进度条 */
    .progress-bar-wrap {
      height: 6px; background: var(--gray-100); border-radius: 3px; margin: 12px 0 6px; overflow: hidden;
    }
    .progress-bar-inner {
      height: 100%; background: var(--brand); border-radius: 3px; transition: width 0.3s;
    }
    
    /* 节点类型Tab */
    .node-tabs {
      display: flex; gap: 20px; border-bottom: 1px solid var(--border); margin-bottom: 16px;
    }
    .node-tab {
      padding: 8px 4px; font-size: 14px; font-weight: 500; color: var(--gray-500);
      cursor: pointer; position: relative;
    }
    .node-tab.active {
      color: var(--brand); font-weight: 700;
    }
    .node-tab.active::after {
      content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
      height: 2px; background: var(--brand); border-radius: 2px 2px 0 0;
    }
    
    /* 排行榜Tab */
    .rank-tabs {
      display: flex; gap: 8px; background: var(--gray-100); padding: 4px; border-radius: 8px;
    }
    .rank-tab {
      padding: 4px 12px; font-size: 12px; font-weight: 500; color: var(--gray-500);
      border-radius: 6px; cursor: pointer; transition: all 0.2s;
    }
    .rank-tab.active {
      background: white; color: var(--gray-900); box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
"""
content = content.replace("/* 趋势迷你柱 */", css_additions + "\n    /* 趋势迷你柱 */")


# 2. Update Layout Grid
# Replace: <div style="display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start;"> ... </div>
layout_start = content.find('<!-- 主体 -->')
layout_end = content.find('</main>')

new_layout = """<!-- 主体 -->
    <!-- 节点网格区（支持Tab切换） -->
    <div id="nodeContent" style="margin-bottom:24px;"></div>

    <!-- 底部：排行榜 -->
    <div class="card" style="width:100%;">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h3 class="card-title">
          <span class="card-title-icon" id="rankIcon"></span>
          <span id="rankTitle">团队排行</span>
        </h3>
        <div class="rank-tabs">
          <div class="rank-tab active" onclick="switchRankTab('touch', this)">触达排行</div>
          <div class="rank-tab" onclick="switchRankTab('intent', this)">意向排行</div>
          <div class="rank-tab" onclick="switchRankTab('credit', this)">授信排行</div>
        </div>
      </div>
      <div class="card-body" style="padding-top:10px;">
        <!-- 改为多列排布 -->
        <div id="rankList" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;"></div>
      </div>
    </div>
"""

content = content[:layout_start] + new_layout + "\n  " + content[layout_end:]

# 3. Add JS state and functions for tabs
js_additions = """
let currentNodeTypeTab = 'org'; // 'org' or 'member'
let currentRankType = 'touch'; // 'touch', 'intent', 'credit'

function switchNodeTypeTab(tab) {
  currentNodeTypeTab = tab;
  renderNodeContent();
}

function switchRankTab(type, el) {
  currentRankType = type;
  document.querySelectorAll('.rank-tab').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  renderRank();
}
"""

content = content.replace("let currentNodeId = 'root';", js_additions + "\nlet currentNodeId = 'root';")

# 4. Modify render() to split renderNodeContent and renderRank
render_func_replacement = """function render() {
  const node = findNode(currentNodeId) || ORG_TREE;
  const agg = aggregateNode(node);
  
  // 导航和KPI保持不变
  const path = getNodePath(currentNodeId) || [{ id: 'root', name: ORG_TREE.name }];
  document.getElementById('levelNav').innerHTML = path.map((p, i) => {
    const isLast = i === path.length - 1;
    return `
      ${i > 0 ? '<span class="level-nav-sep">›</span>' : ''}
      <div class="level-nav-item ${isLast ? 'active' : ''}" onclick="drillDown('${p.id}')">
        <span class="nav-icon">${i === 0 ? ICONS.network || SVG_ORG : SVG_ORG}</span>
        ${p.name}
      </div>
    `;
  }).join('');

  document.getElementById('teamStats').innerHTML = [
    { icon: 'users',       label: '管辖客户经理', value: agg.memberCount, suffix: '人', featured: true },
    { icon: 'layers',      label: '已分配名单',   value: agg.allocated,   suffix: '家' },
    { icon: 'trending_up', label: '已触达',        value: agg.touch,       suffix: '家' },
    { icon: 'target',      label: '意向转化',      value: agg.intent,      suffix: '家' },
  ].map(s => `
    <div class="stat-card ${s.featured ? 'featured' : ''}">
      <div class="stat-card-icon"><span style="width:20px;height:20px;">${ICONS[s.icon] || ''}</span></div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}<span class="stat-suffix">${s.suffix}</span></div>
    </div>
  `).join('');

  // 默认重置tab
  if (node.children && node.children.length > 0) {
    currentNodeTypeTab = 'org';
  } else {
    currentNodeTypeTab = 'member';
  }
  
  renderNodeContent();
  renderRank();
}

function renderNodeContent() {
  const node = findNode(currentNodeId) || ORG_TREE;
  let html = '';
  
  const hasChildren = node.children && node.children.length > 0;
  const hasMembers = node.members && node.members.length > 0;
  
  if (hasChildren && hasMembers) {
    html += `
      <div class="node-tabs">
        <div class="node-tab ${currentNodeTypeTab === 'org' ? 'active' : ''}" onclick="switchNodeTypeTab('org')">下级机构</div>
        <div class="node-tab ${currentNodeTypeTab === 'member' ? 'active' : ''}" onclick="switchNodeTypeTab('member')">直属客户经理</div>
      </div>
    `;
  }
  
  html += `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;">`;
  
  if (currentNodeTypeTab === 'org' && hasChildren) {
    html += node.children.map(c => renderOrgCard(c)).join('');
  } else if (currentNodeTypeTab === 'member' && hasMembers) {
    html += node.members.map(m => renderMemberCard(m)).join('');
  } else if (currentNodeTypeTab === 'org' && !hasChildren && hasMembers) {
    // Edge case if somehow tab state gets desynced
    html += node.members.map(m => renderMemberCard(m)).join('');
  }
  
  html += `</div>`;
  document.getElementById('nodeContent').innerHTML = html;
}

function renderRank() {
  const node = findNode(currentNodeId) || ORG_TREE;
  const allMembers = getAllMembers(node);
  
  if (node.children && !node.children.every(c => c.members && !c.children)) {
    const orgRank = node.children.map(c => {
      const ca = aggregateNode(c);
      return { name: c.name, touch: ca.touch, intent: ca.intent, credit: ca.credit, memberCount: ca.memberCount, id: c.id };
    });
    renderOrgRank(orgRank);
  } else {
    renderMemberRank(allMembers);
  }
}
"""

# Replace render function body
content = re.sub(r'function render\(\) \{.*?(?=function renderOrgCard)', render_func_replacement, content, flags=re.DOTALL)


# 5. Modify renderOrgCard and renderMemberCard
org_card_replacement = """function renderOrgCard(c) {
  const agg = aggregateNode(c);
  const convRate = agg.touch > 0 ? (agg.intent / agg.touch * 100).toFixed(1) : '0.0';
  const reachRate = agg.allocated > 0 ? (agg.touch / agg.allocated * 100).toFixed(1) : '0.0';
  const orgUrl = encodeURIComponent(c.name);
  return `
    <div class="node-card clickable" onclick="drillDown('${c.id}')">
      <div class="node-card-header">
        <div class="node-av org">${SVG_ORG}</div>
        <div style="flex:1;min-width:0;">
          <div class="node-card-name">${c.name}</div>
          <div class="node-card-sub">${agg.memberCount} 名客户经理</div>
        </div>
        <span class="tag tag-blue" style="font-size:11px;white-space:nowrap;">${convRate}% 意向转化</span>
      </div>
      <div class="kpi-row">
        <div class="kpi-box"><div class="kpi-val">${agg.allocated}</div><div class="kpi-lbl">已分配</div></div>
        <div class="kpi-box"><div class="kpi-val">${agg.touch}</div><div class="kpi-lbl">已触达</div></div>
        <div class="kpi-box"><div class="kpi-val">${agg.intent}</div><div class="kpi-lbl">意向</div></div>
        <div class="kpi-box"><div class="kpi-val ${agg.credit > 0 ? '' : 'muted'}">${agg.credit > 0 ? agg.credit + '万' : '—'}</div><div class="kpi-lbl">授信</div></div>
      </div>
      
      <div class="progress-bar-wrap"><div class="progress-bar-inner" style="width:${Math.min(reachRate, 100)}%;"></div></div>
      <div style="font-size:10.5px;color:var(--gray-400);text-align:right;">触达率 ${reachRate}%</div>
      
      <div class="card-actions">
        <button class="btn btn-default btn-sm" style="flex:1;font-size:12px;" onclick="event.stopPropagation();window.location.href='customers.html?org=${orgUrl}'">
          查看客户
        </button>
      </div>
    </div>
  `;
}

function renderMemberCard(m) {
  const convRate = m.touch > 0 ? (m.intent / m.touch * 100).toFixed(1) : '0.0';
  const reachRate = m.allocated > 0 ? (m.touch / m.allocated * 100).toFixed(1) : '0.0';
  const convNum = parseFloat(convRate);
  const tagCls = convNum >= 20 ? 'tag-green' : convNum >= 10 ? 'tag-blue' : 'tag-amber';
  return `
    <div class="node-card">
      <div class="node-card-header">
        <div class="node-av person">${SVG_PERSON}</div>
        <div style="flex:1;min-width:0;">
          <div class="node-card-name">${m.name}</div>
          <div class="node-card-sub">客户经理</div>
        </div>
        <span class="tag ${tagCls}" style="font-size:11px;white-space:nowrap;">${convRate}% 意向转化</span>
      </div>
      <div class="kpi-row">
        <div class="kpi-box"><div class="kpi-val">${m.allocated}</div><div class="kpi-lbl">已分配</div></div>
        <div class="kpi-box"><div class="kpi-val">${m.touch}</div><div class="kpi-lbl">已触达</div></div>
        <div class="kpi-box"><div class="kpi-val">${m.intent}</div><div class="kpi-lbl">意向</div></div>
        <div class="kpi-box"><div class="kpi-val ${m.credit > 0 ? '' : 'muted'}">${m.credit > 0 ? m.credit + '万' : '—'}</div><div class="kpi-lbl">授信</div></div>
      </div>
      
      <div class="progress-bar-wrap"><div class="progress-bar-inner" style="width:${Math.min(reachRate, 100)}%;"></div></div>
      <div style="font-size:10.5px;color:var(--gray-400);text-align:right;">触达率 ${reachRate}%</div>
      
      <div class="card-actions">
        <button class="btn btn-default btn-sm" style="flex:1;font-size:12px;" onclick="window.location.href='customers.html?owner=${m.id}'">
          查看客户
        </button>
      </div>
    </div>
  `;
}
"""

content = re.sub(r'function renderOrgCard\(c\) \{.*?(?=function renderMemberRank)', org_card_replacement, content, flags=re.DOTALL)


# 6. Modify Rank rendering
rank_replacement = """function renderMemberRank(members) {
  document.getElementById('rankTitle').textContent = '客户经理排行';
  const sorted = [...members].sort((a, b) => b[currentRankType] - a[currentRankType]).slice(0, 12);
  
  let label = currentRankType === 'touch' ? '触达' : currentRankType === 'intent' ? '意向' : '授信';
  let unit = currentRankType === 'credit' ? '万' : '家';
  
  document.getElementById('rankList').innerHTML = sorted.map((m, i) => `
    <div class="rank-row">
      <div class="rank-num ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n'}">${i + 1}</div>
      <div class="node-av person" style="width:28px;height:28px;border-radius:50%;">${SVG_PERSON}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:600;color:var(--gray-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.name}</div>
      </div>
      <div style="text-align:right;flex-shrink:0; display:flex; align-items:baseline; gap:4px;">
        <div style="font-size:15px;font-weight:800;color:var(--brand);">${m[currentRankType] > 0 ? m[currentRankType] : '0'}</div>
        <div style="font-size:11px;color:var(--gray-400);">${unit}</div>
      </div>
    </div>
  `).join('');
}

function renderOrgRank(orgList) {
  document.getElementById('rankTitle').textContent = '机构排行';
  const sorted = [...orgList].sort((a, b) => b[currentRankType] - a[currentRankType]).slice(0, 12);
  
  let label = currentRankType === 'touch' ? '触达' : currentRankType === 'intent' ? '意向' : '授信';
  let unit = currentRankType === 'credit' ? '万' : '家';
  
  document.getElementById('rankList').innerHTML = sorted.map((o, i) => `
    <div class="rank-row">
      <div class="rank-num ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n'}">${i + 1}</div>
      <div class="node-av org" style="width:28px;height:28px;border-radius:8px;cursor:pointer;" onclick="drillDown('${o.id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:600;color:var(--gray-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${o.name}</div>
      </div>
      <div style="text-align:right;flex-shrink:0; display:flex; align-items:baseline; gap:4px;">
        <div style="font-size:15px;font-weight:800;color:var(--brand);">${o[currentRankType] > 0 ? o[currentRankType] : '0'}</div>
        <div style="font-size:11px;color:var(--gray-400);">${unit}</div>
      </div>
    </div>
  `).join('');
}
"""

content = re.sub(r'function renderMemberRank\(members\) \{.*?(?=function exportReport)', rank_replacement, content, flags=re.DOTALL)


with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/team.html', 'w', encoding='utf-8') as f:
    f.write(content)

