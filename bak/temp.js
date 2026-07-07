
const role = sessionStorage.getItem('wb_role') || 'manager';
renderSidebar({ currentPage: 'org-structure', role });

/* ── 图标注入 ── */
document.getElementById('modalCloseIcon').innerHTML = `<span style="width:18px;height:18px;">${ICONS.x}</span>`;
document.getElementById('memberCloseIcon').innerHTML = `<span style="width:18px;height:18px;">${ICONS.x}</span>`;
document.getElementById('importCloseIcon').innerHTML = `<span style="width:18px;height:18px;">${ICONS.x}</span>`;
document.getElementById('memberSearchIcon').innerHTML = `<svg viewBox="0 0 24 24" style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

/* ── Mock 数据 ── */
let ORG_DATA = {
  id: 'root', name: '宇宙银行总行', tag: '总行', city: '北京市', district: '西城区', memberCount: 15, active: true,
  children: [
    {
      id: 'js', name: '江苏省分行', tag: '分行', city: '南京市', district: '建邺区', memberCount: 8, active: true,
      children: [
        {
          id: 'sz', name: '苏州分行', tag: '分行', city: '苏州市', district: '工业园区', memberCount: 5, active: true,
          children: [
            { 
              id: 'sz-gs', name: '姑苏支行', tag: '支行', city: '苏州市', district: '姑苏区', memberCount: 10, active: true, 
              children: [
                { 
                  id: 'sz-gs-yy', name: '姑苏营业部', tag: '网点', city: '苏州市', district: '姑苏区', memberCount: 4, active: true, 
                  children: [
                    { id: 'sz-gs-yy-t1', name: '对公营销一队', tag: '团队', city: '苏州市', district: '姑苏区', memberCount: 3, active: true },
                    { id: 'sz-gs-yy-t2', name: '对公营销二队', tag: '团队', city: '苏州市', district: '姑苏区', memberCount: 1, active: true }
                  ] 
                },
                { id: 'sz-gs-sq', name: '社区服务点', tag: '网点', city: '苏州市', district: '姑苏区', memberCount: 2, active: true, children: [] }
              ] 
            },
            { id: 'sz-gx', name: '工业园区支行', tag: '支行', city: '苏州市', district: '工业园区', memberCount: 12, active: true, children: [] },
            { id: 'sz-wx', name: '吴中支行', tag: '支行', city: '苏州市', district: '吴中区', memberCount: 6, active: true, children: [] },
          ]
        },
        {
          id: 'nj', name: '南京分行', tag: '分行', city: '南京市', district: '鼓楼区', memberCount: 4, active: true,
          children: [
            { id: 'nj-gl', name: '鼓楼支行', tag: '支行', city: '南京市', district: '鼓楼区', memberCount: 10, active: true, children: [] },
            { id: 'nj-jy', name: '建邺支行', tag: '支行', city: '南京市', district: '建邺区', memberCount: 9, active: true, children: [] },
          ]
        },
        {
          id: 'wx', name: '无锡分行', tag: '分行', city: '无锡市', district: '滨湖区', memberCount: 2, active: true,
          children: [
            { id: 'wx-hs', name: '惠山支行', tag: '支行', city: '无锡市', district: '惠山区', memberCount: 7, active: true, children: [] },
            { id: 'wx-bh', name: '滨湖支行', tag: '支行', city: '无锡市', district: '滨湖区', memberCount: 8, active: true, children: [] },
          ]
        },
        {
          id: 'cz', name: '常州分行', tag: '分行', city: '常州市', district: '天宁区', memberCount: 2, active: true,
          children: [
            { id: 'cz-tn', name: '天宁支行', tag: '支行', city: '常州市', district: '天宁区', memberCount: 5, active: true, children: [] },
          ]
        }
      ]
    },
    {
      id: 'zj', name: '浙江省分行', tag: '分行', city: '杭州市', district: '上城区', memberCount: 6, active: true,
      children: [
        { id: 'hz', name: '杭州分行', tag: '分行', city: '杭州市', district: '西湖区', memberCount: 8, active: true, children: [] }
      ]
    }
  ]
};

const MEMBERS = {
  'root': [
    { initials: '张', name: '张行长',  role: '管理员', color: '#2563eb', id: 'u1' },
    { initials: '李', name: '李副行长', role: '管理员', color: '#6366f1', id: 'u2' },
  ],
  'sz': [
    { initials: '王', name: '王支行长', role: '管理员', color: '#10b981', id: 'u3' },
    { initials: '周', name: '周某某', role: '客户经理', color: '#f59e0b', id: 'u6' },
    { initials: '吴', name: '吴某某', role: '客户经理', color: '#06b6d4', id: 'u7' },
  ],
  'sz-gt': [
    { initials: '朱', name: '朱某人', role: '客户经理', color: '#8b5cf6', id: 'u4' },
    { initials: '赵', name: '赵小雨', role: '客户经理', color: '#f59e0b', id: 'u5' },
  ],
};

const MEMBERS_DATA = [
  { id:'u1',  name:'张行长',   account:'zh_pabank',   phone:'138****0001', org:'root',  orgPath:'江苏省分行', role:'admin',  status:'active' },
  { id:'u2',  name:'李副行长', account:'lf_pabank',   phone:'138****0002', org:'root',  orgPath:'江苏省分行', role:'admin',  status:'active' },
  { id:'u3',  name:'王支行长', account:'wz_sz',       phone:'139****0003', org:'sz',    orgPath:'苏州分行', role:'admin',   status:'active' },
  { id:'u4',  name:'朱某人',   account:'zm_sz_gt',    phone:'136****0004', org:'sz-gs', orgPath:'苏州分行 / 姑苏支行', role:'rm', status:'active' },
  { id:'u5',  name:'赵小雨',   account:'zxy_sz_gt',   phone:'137****0005', org:'sz-gs', orgPath:'苏州分行 / 姑苏支行', role:'rm', status:'active' },
  { id:'u6',  name:'陈菱',     account:'cl_sz_gx',    phone:'135****0006', org:'sz-yq', orgPath:'苏州分行 / 工业园区支行', role:'admin', status:'active' },
  { id:'u7',  name:'郑婵婷',   account:'zct_sz_gx',   phone:'132****0007', org:'sz-yq', orgPath:'苏州分行 / 工业园区支行', role:'rm', status:'inactive' },
  { id:'u8',  name:'杨守衡',   account:'ysh_nj',      phone:'133****0008', org:'nj',    orgPath:'南京分行', role:'admin',   status:'active' },
  { id:'u9',  name:'徐志忠',   account:'xzz_nj_gx',   phone:'131****0009', org:'nj-gl', orgPath:'南京分行 / 鼓楼支行', role:'rm', status:'active' },
  { id:'u10', name:'李新华',   account:'lxh_wx',      phone:'130****0010', org:'wx',    orgPath:'无锡分行', role:'admin',   status:'active' },
  { id:'u11', name:'周某某',   account:'zmm_sz',      phone:'138****0011', org:'sz',    orgPath:'苏州分行', role:'rm',  status:'active' },
  { id:'u12', name:'王总',     account:'wz_cz',       phone:'139****0012', org:'cz',    orgPath:'常州分行', role:'admin',   status:'active' },
];

const ROLE_LABELS = { admin:'管理员', rm:'客户经理' };
const ROLE_CLASS  = { admin:'manager', rm:'rm' };
const ROLE_HINTS  = {
  rm: '<strong>客户经理</strong><br>✓ 查看本人名单 &nbsp;✓ 记录营销跟进<br>✗ 查看他人名单 &nbsp;✗ 名单分配操作<br><span style="color:var(--gray-400);font-size:11px;">每个层级都可以有客户经理</span>',
  admin: '<strong>管理员</strong><br>✓ 查看本机构及下属全部名单<br>✓ 名单分配（本机构及下属）<br>✓ 管理本机构及下属成员<br><span style="color:var(--gray-400);font-size:11px;">权限范围自动继承：看得到本机构及所有下属机构</span>',
};

let activeTab = 'overview'; // 'overview' or 'members'
let activeRole = '';
let activeStatus = '';
let searchQ = '';
let resetTargetId = '';

let expandedIds = new Set();
let selectedId = 'root';
let isSearching = false;
let matchedIds = new Set();
const HAS_DATA = true; // 切成 false 可看到空状态

/* ============================================================
   页面初始化
============================================================ */
function init() {
  if (HAS_DATA && typeof ORG_DATA !== 'undefined') {
    expandedIds.clear();
    function collect(n) { expandedIds.add(n.id); if (n.children) n.children.forEach(collect); }
    collect(ORG_DATA);
  }

  if (!HAS_DATA) {
    renderEmptyState();
  } else {
    renderOrgLayout();
  }
}

function handleAddNodeBtnClick() {
  if (!HAS_DATA) {
    openModal('addNode', null);
  } else {
    openModal('addNode', selectedId || 'root');
  }
}

/* ── 空状态引导 ── */
function renderEmptyState() {
  document.getElementById('pageBody').innerHTML = `
    <div class="card">
      <div class="empty-setup">
        <div class="empty-setup-icon">
          <svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="4" rx="1"/><rect x="1" y="18" width="6" height="4" rx="1"/><rect x="17" y="18" width="6" height="4" rx="1"/><path d="M12 6v4m0 0-4 8m4-8 4 8M4 18l4-8m8 8 4-8"/></svg>
        </div>
        <h2>还没有机构数据</h2>
        <p>从这里开始配置贵行的组织架构和人员账号。<br>上传 Excel 模板可以同时创建机构层级并批量开通账号，平均配置时间从数小时缩短至 5 分钟。</p>
        <div class="empty-setup-actions">
          <div class="empty-setup-card primary" onclick="openImportWizard()">
            <div class="empty-setup-card-icon">📥</div>
            <div class="empty-setup-card-title">上传 Excel 一键建站</div>
            <div class="empty-setup-card-desc">同时创建机构层级<br>并批量开通账号</div>
          </div>
          <div class="empty-setup-card" onclick="openModal('addNode', null)">
            <div class="empty-setup-card-icon">✏️</div>
            <div class="empty-setup-card-title">手动新增第一个机构</div>
            <div class="empty-setup-card-desc">逐级手动配置<br>适合少量节点场景</div>
          </div>
        </div>
        <div style="margin-top:24px;font-size:12px;color:var(--gray-400);">
          💡 需要 Excel 模板？<a href="#" onclick="downloadTemplate()" style="color:var(--brand);font-weight:600;">点击下载标准模板</a>
        </div>
      </div>
    </div>
  `;
}

/* ── 有数据时的主布局 ── */
function renderOrgLayout() {
  document.getElementById('pageBody').innerHTML = `
    <div class="org-layout">
      <!-- 左：树 -->
      <div class="card org-tree-panel">
        <div class="card-header" style="padding-bottom:12px;">
          <h3 class="card-title">
            <span class="card-title-icon" style="width:16px;height:16px;">${ICONS.network}</span>
            机构层级树
          </h3>
          <button class="btn btn-ghost btn-sm" id="toggleExpandAllBtn" onclick="toggleExpandAll()">全部折叠</button>
        </div>
        <div style="padding:8px 14px 14px;">
          <div class="search-wrap" style="max-width:100%;margin-bottom:12px;">
            <svg viewBox="0 0 24 24" class="search-icon" style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="form-control" placeholder="搜索机构名称…" oninput="filterTree(this.value)">
          </div>
          <div id="orgTree"></div>
        </div>
      </div>

      <!-- 右：详情 -->
      <div class="detail-panel" id="detailPanel">
        <div class="card">
          <div class="card-body p-20" style="text-align:center;padding:60px 20px;">
            <div style="width:28px;height:28px;margin:0 auto 12px;">${ICONS.network}</div>
            <div class="empty-title">暂无数据</div>
            
          </div>
        </div>
      </div>
    </div>
  `;
  renderTree();
  if (selectedId) {
    renderDetail(selectedId);
  }
}

/* ============================================================
   树渲染
============================================================ */
function buildTree(node, depth = 0) {
  if (isSearching && !matchedIds.has(node.id)) return '';
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isDisabled = !node.active;

  // 根据标签精确选择图标
  let typeIcon = ICONS.user;
  if (node.tag === '总行') typeIcon = ICONS.network;
  else if (node.tag === '分行') typeIcon = ICONS.layers;
  else if (node.tag === '支行') typeIcon = ICONS.users;
  else if (node.tag === '网点') typeIcon = ICONS.send;
  else if (node.tag === '团队') typeIcon = ICONS.team;
  else {
    const depthIcons = [ICONS.network, ICONS.layers, ICONS.users, ICONS.send, ICONS.team];
    typeIcon = depthIcons[Math.min(depth, depthIcons.length - 1)];
  }

  return `
    <div class="tree-item" data-id="${node.id}">
      <div class="tree-row ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}"
           onclick="selectNode('${node.id}')">
        <span class="tree-row-toggle" onclick="toggleExpand(event, '${node.id}')">
          ${hasChildren ? ICONS.chevron_right : ''}
        </span>
        <span class="tree-row-icon" style="width:14px;height:14px;">${typeIcon}</span>
        <span class="tree-row-label">${node.name}${node.tag ? ` <span style="font-size:10px;color:var(--gray-400);font-weight:400;">${node.tag}</span>` : ''}</span>
        <span class="tree-row-count" onclick="event.stopPropagation();gotoMember('${node.id}')" title="查看该机构成员">
          ${node.memberCount}人
        </span>
        <span class="tree-row-actions" onclick="event.stopPropagation()">
          <button class="tree-row-action-btn" title="新增子节点" onclick="openModal('addNode','${node.id}')">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button class="tree-row-action-btn" title="编辑" onclick="openModal('editNode','${node.id}')">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          ${node.id !== 'root' ? `
          <button class="tree-row-action-btn danger" title="删除" onclick="deleteNode('${node.id}')">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>` : ''}
        </span>
      </div>
      ${hasChildren ? `
        <div class="tree-children ${isExpanded ? 'open' : ''}">
          ${node.children.map(c => buildTree(c, depth + 1)).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function renderTree() {
  const el = document.getElementById('orgTree');
  if (el) el.innerHTML = buildTree(ORG_DATA);
  
  const btn = document.getElementById('toggleExpandAllBtn');
  if (btn) {
    const hasOthers = Array.from(expandedIds).some(id => id !== 'root');
    btn.textContent = hasOthers ? '全部折叠' : '全部展开';
  }
}

function toggleExpandAll() {
  const hasOthers = Array.from(expandedIds).some(id => id !== 'root');
  if (hasOthers) {
    expandedIds.clear();
    if (ORG_DATA) expandedIds.add(ORG_DATA.id);
  } else {
    function collect(n) { expandedIds.add(n.id); if (n.children) n.children.forEach(collect); }
    collect(ORG_DATA);
  }
  renderTree();
}

function filterTree(q) {
  const query = q.trim().toLowerCase();
  if (!query) {
    isSearching = false;
    renderTree();
    return;
  }
  isSearching = true;
  matchedIds.clear();
  expandedIds.clear();
  
  function checkMatch(node) {
    let isMatch = node.name.toLowerCase().includes(query) || (node.tag && node.tag.toLowerCase().includes(query));
    let childMatch = false;
    if (node.children) {
      for (let c of node.children) {
        if (checkMatch(c)) childMatch = true;
      }
    }
    if (isMatch || childMatch) {
      matchedIds.add(node.id);
      expandedIds.add(node.id); // 自动展开包含匹配项的父节点
      return true;
    }
    return false;
  }
  
  checkMatch(ORG_DATA);
  renderTree();
}

/* ── 跳转人员管理并过滤该机构 ── */
function gotoMember(nodeId) {
  window.location.href = `org-members.html?org=${nodeId}`;
}

/* ============================================================
   选中节点 & 详情面板
============================================================ */
function findNode(node, id) {
  if (node.id === id) return node;
  for (const c of (node.children || [])) {
    const f = findNode(c, id);
    if (f) return f;
  }
  return null;
}

function selectNode(id) {
  selectedId = id;
  renderTree();
  renderDetail(id);
}

function toggleExpand(event, id) {
  event.stopPropagation();
  if (expandedIds.has(id)) expandedIds.delete(id);
  else expandedIds.add(id);
  renderTree();
}

function renderDetail(id) {
  const node = findNode(ORG_DATA, id);
  if (!node) return;
  const depth = getNodeDepth(ORG_DATA, id);
  let typeIcon = ICONS.user;
  if (node.tag === '总行') typeIcon = ICONS.network;
  else if (node.tag === '分行') typeIcon = ICONS.layers;
  else if (node.tag === '支行') typeIcon = ICONS.users;
  else if (node.tag === '网点') typeIcon = ICONS.send;
  else if (node.tag === '团队') typeIcon = ICONS.team;
  else {
    const depthIcons = [ICONS.network, ICONS.layers, ICONS.users, ICONS.send, ICONS.team];
    typeIcon = depthIcons[Math.min(depth, depthIcons.length - 1)];
  }

  document.getElementById('detailPanel').innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.02);min-height:calc(100vh - 210px);">
      <div class="tabs-header">
        <div class="tab-item ${activeTab === 'overview' ? 'active' : ''}" onclick="switchTab('overview')">机构概况</div>
        <div class="tab-item ${activeTab === 'members' ? 'active' : ''}" onclick="switchTab('members')">机构成员</div>
      </div>
      
      <!-- Tab 1: 机构概况 -->
      <div id="tab-overview" class="tab-content ${activeTab === 'overview' ? 'active' : ''}" style="padding:20px;background:#f9fafb;min-height:calc(100vh - 270px);">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- 基本信息卡 -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <span class="card-title-icon" style="width:18px;height:18px;">${typeIcon}</span>
                ${node.name}
              </h3>
              <div style="display:flex;gap:8px;">
                <button class="btn btn-default btn-sm" onclick="openModal('addNode', '${id}')">
                  <span style="width:13px;height:13px;">${ICONS.plus}</span> 新增子节点
                </button>
                <button class="btn btn-default btn-sm" onclick="openModal('editNode', '${id}')">
                  <span style="width:13px;height:13px;">${ICONS.edit}</span> 编辑
                </button>
                ${id !== 'root' ? `<button class="btn btn-danger btn-sm" title="删除" onclick="deleteNode('${id}')">
                  <span style="width:13px;height:13px;">${ICONS.trash}</span>
                </button>` : ''}
              </div>
            </div>
            <div class="card-body" style="padding-top:14px;">
              <div style="display:flex;gap:12px;">
                ${[
                  { label: '机构类型', value: node.tag || '未设置' },
                  { label: '业务辖区', value: '江苏省' + (node.city || '') + (node.district || '') },
                  { label: '下属子节点', value: `${(node.children||[]).length} 个` },
                ].map(item => `
                  <div style="flex:1;background:var(--gray-50);border-radius:10px;padding:12px 14px;border:1px solid var(--border);">
                    <div style="font-size:11.5px;color:var(--gray-400);margin-bottom:4px;">${item.label}</div>
                    <div style="font-size:14px;font-weight:700;color:var(--gray-900);">${item.value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- 下属机构 -->
          ${node.children && node.children.length ? `
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  <span class="card-title-icon" style="width:18px;height:18px;">${ICONS.network}</span>
                  下属机构 <span class="tag tag-gray" style="margin-left:6px;">${node.children.length} 个</span>
                </h3>
              </div>
              <div class="card-body" style="padding-top:14px;">
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;">
                  ${node.children.map(c => `
                    <div onclick="selectNode('${c.id}')" style="
                      padding:14px;border-radius:10px;border:1px solid var(--border);
                      cursor:pointer;transition:all 0.12s;background:var(--gray-50);
                      ${!c.active ? 'opacity:0.5;' : ''}
                    "
                      onmouseover="this.style.borderColor='var(--brand)';this.style.background='var(--brand-light)'"
                      onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--gray-50)'">
                      <div style="font-size:13.5px;font-weight:600;color:var(--gray-800);margin-bottom:4px;">${c.name}</div>
                      <div style="font-size:12px;color:var(--gray-400);">
                        ${c.tag || ''} · ${c.memberCount}人${!c.active ? ' · 已停用' : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Tab 2: 机构成员 -->
      <div id="tab-members" class="tab-content ${activeTab === 'members' ? 'active' : ''}" style="padding:20px;background:#fff;min-height:calc(100vh - 270px);">
        <!-- 会在这里动态渲染成员内容 -->
      </div>
    </div>
  `;
  
  if (activeTab === 'members') {
    renderMembersTab();
  }
}

function switchTab(tabId) {
  activeTab = tabId;
  renderDetail(selectedId);
}

/* ============================================================
   成员管理逻辑
============================================================ */
let includeSubOrgs = false;

function getAllSubOrgIds(node) {
  let ids = [node.id];
  if (node.children) {
    for (let c of node.children) {
      ids = ids.concat(getAllSubOrgIds(c));
    }
  }
  return ids;
}

function getFilteredMembers() {
  const node = findNode(ORG_DATA, selectedId);
  const targetOrgIds = includeSubOrgs && node ? getAllSubOrgIds(node) : [selectedId];

  return MEMBERS_DATA.filter(m => {
    if (!targetOrgIds.includes(m.org)) return false;
    if (activeRole && m.role !== activeRole) return false;
    if (activeStatus && m.status !== activeStatus) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.account.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function renderMembersTab() {
  const container = document.getElementById('tab-members');
  if (!container) return;

  const node = findNode(ORG_DATA, selectedId);
  const targetOrgIds = includeSubOrgs && node ? getAllSubOrgIds(node) : [selectedId];
  
  // 统计基于左侧树的当前选中节点下的总览，不受下面搜索框影响
  const allCurrentNodeMembers = MEMBERS_DATA.filter(m => targetOrgIds.includes(m.org));
  const countAll = allCurrentNodeMembers.length;
  const countRM = allCurrentNodeMembers.filter(m => m.role === 'rm').length;
  const countAdmin = allCurrentNodeMembers.filter(m => m.role === 'admin').length;

  const data = getFilteredMembers();

  container.innerHTML = `
    <!-- 统计卡片 -->
    <div class="stat-grid">
      <div class="stat-card" onclick="filterByRole(null)" style="cursor:pointer;${!activeRole ? 'border-color:var(--brand);box-shadow:0 0 0 1px var(--brand);' : ''}">
        <div class="stat-icon" style="background:#dbeafe;color:#1d4ed8;">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <div class="stat-value">${countAll}</div>
          <div class="stat-label">全部人员</div>
        </div>
      </div>
      <div class="stat-card" onclick="filterByRole('rm')" style="cursor:pointer;${activeRole==='rm' ? 'border-color:var(--brand);box-shadow:0 0 0 1px var(--brand);' : ''}">
        <div class="stat-icon" style="background:var(--gray-100);color:var(--gray-600);">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <div class="stat-value">${countRM}</div>
          <div class="stat-label">客户经理</div>
        </div>
      </div>
      <div class="stat-card" onclick="filterByRole('admin')" style="cursor:pointer;${activeRole==='admin' ? 'border-color:var(--brand);box-shadow:0 0 0 1px var(--brand);' : ''}">
        <div class="stat-icon" style="background:#ede9fe;color:#6d28d9;">
          <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <div class="stat-value">${countAdmin}</div>
          <div class="stat-label">管理员</div>
        </div>
      </div>
    </div>

    <!-- 列表区顶部栏 -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <div class="filter-bar" style="margin-bottom:0;">
        <div class="search-wrap" style="width:240px;">
          <svg viewBox="0 0 24 24" class="search-icon" style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="form-control" placeholder="搜索姓名 / 账号…" oninput="searchMembers(this.value)" value="${searchQ}">
        </div>
        <select class="form-control" style="width:120px;" onchange="filterByRoleSelect(this.value)">
          <option value="" ${activeRole === '' ? 'selected' : ''}>全部角色</option>
          <option value="rm" ${activeRole === 'rm' ? 'selected' : ''}>客户经理</option>
          <option value="admin" ${activeRole === 'admin' ? 'selected' : ''}>管理员</option>
        </select>
        <select class="form-control" style="width:120px;" onchange="filterByStatus(this.value)">
          <option value="" ${activeStatus === '' ? 'selected' : ''}>全部状态</option>
          <option value="active" ${activeStatus === 'active' ? 'selected' : ''}>已启用</option>
          <option value="inactive" ${activeStatus === 'inactive' ? 'selected' : ''}>已禁用</option>
        </select>
        
        <label style="display:flex;align-items:center;gap:6px;margin-left:8px;cursor:pointer;font-size:13px;color:var(--gray-600);user-select:none;">
          <input type="checkbox" ${includeSubOrgs ? 'checked' : ''} onchange="toggleIncludeSubOrgs(this.checked)">
          包含下属节点人员
        </label>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-default btn-sm" onclick="alert('TODO: 批量导入')">批量导入</button>
        <button class="btn btn-primary btn-sm" onclick="openMemberModal('add')">新增账号</button>
      </div>
    </div>

    <!-- 成员表格 -->
    <div style="overflow-x:auto;border:1px solid var(--border);border-radius:10px;">
      <table class="members-table">
        <thead>
          <tr>
            <th>姓名 / 账号</th>
            <th>所属机构</th>
            <th>角色</th>
            <th>手机号</th>
            <th>账号状态</th>
            <th style="text-align:right;">操作</th>
          </tr>
        </thead>
        <tbody>
          ${data.length === 0 ? `
            <tr><td colspan="6" style="text-align:center;padding:40px;color:var(--gray-400);">没有符合条件的人员</td></tr>
          ` : data.map(m => `
            <tr>
              <td>
                <div class="person-cell">
                  <div class="person-avatar" style="background:${avatarColor(m.name)};">${m.name[0]}</div>
                  <div>
                    <div class="person-name">${m.name}</div>
                    <div class="person-account">${m.account}</div>
                  </div>
                </div>
              </td>
              <td><span style="font-size:12.5px;color:var(--gray-500);">${m.orgPath}</span></td>
              <td><span class="role-tag ${ROLE_CLASS[m.role]}">${ROLE_LABELS[m.role]}</span></td>
              <td style="color:var(--gray-500);font-size:13px;">${m.phone}</td>
              <td>
                <span class="status-badge ${m.status}">
                  <span class="status-dot ${m.status}"></span>
                  ${m.status === 'active' ? '已启用' : '已禁用'}
                </span>
              </td>
              <td>
                <div class="action-btns" style="justify-content:flex-end;">
                  <button class="action-btn" onclick="openMemberModal('edit', '${m.id}')">编辑</button>
                  <button class="action-btn primary" onclick="openMemberModal('reset', '${m.id}')">重置密码</button>
                  <button class="action-btn danger" onclick="toggleMemberStatus('${m.id}')">
                    ${m.status === 'active' ? '禁用' : '启用'}
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function avatarColor(name) {
  const colors = ['#2563eb','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#84cc16'];
  return colors[name.charCodeAt(0) % colors.length];
}

function filterByRole(r) { activeRole = r || ''; renderMembersTab(); }
function filterByRoleSelect(v) { activeRole = v; renderMembersTab(); }
function filterByStatus(v) { activeStatus = v; renderMembersTab(); }
function searchMembers(q) { searchQ = q; renderMembersTab(); }
function toggleIncludeSubOrgs(val) { includeSubOrgs = val; renderMembersTab(); }

function toggleMemberStatus(id) {
  const m = MEMBERS_DATA.find(x => x.id === id);
  if (!m) return;
  const action = m.status === 'active' ? '禁用' : '启用';
  if (!confirm(`确认${action}账号「${m.name}（${m.account}）」？`)) return;
  m.status = m.status === 'active' ? 'inactive' : 'active';
  renderMembersTab();
  showToast(`已${action}账号「${m.name}」`, m.status === 'active' ? 'success' : '');
}

function openMemberModal(action, id = null) {
  if (action === 'reset') {
    const m = MEMBERS_DATA.find(x => x.id === id);
    if (!m) return;
    resetTargetId = id;
    document.getElementById('resetTargetName').textContent = m.name;
    document.getElementById('resetModal').classList.add('show');
  } else if (action === 'add' || action === 'edit') {
    document.getElementById('memberModalTitle').textContent = action === 'add' ? '新增账号' : '编辑账号';
    document.getElementById('memberModal').classList.add('show');
    // For demo simplicity, fields are cleared/populated loosely
    if (action === 'add') {
      document.getElementById('inputName').value = '';
      document.getElementById('inputPhone').value = '';
      document.getElementById('inputAccount').value = '';
      document.getElementById('inputOrg').value = selectedId;
      document.getElementById('inputRole').value = 'rm';
    } else {
      const m = MEMBERS_DATA.find(x => x.id === id);
      if (m) {
        document.getElementById('inputName').value = m.name;
        document.getElementById('inputPhone').value = m.phone;
        document.getElementById('inputAccount').value = m.account;
        document.getElementById('inputOrg').value = m.org;
        document.getElementById('inputRole').value = m.role;
      }
    }
    updateMemberRoleHint();
  }
}

function saveMemberAccount() {
  closeModal('memberModal');
  showToast('操作成功', 'success');
  renderMembersTab();
}

function doReset() {
  const m = MEMBERS_DATA.find(x => x.id === resetTargetId);
  closeModal('resetModal');
  showToast(`已重置「${m ? m.name : ''}」的密码，新密码已发送至手机`, 'success');
}

function updateMemberRoleHint() {
  const v = document.getElementById('inputRole')?.value || 'rm';
  const el = document.getElementById('memberRoleHint');
  if (el) el.innerHTML = ROLE_HINTS[v] || '';
}

/* ============================================================

   节点操作
============================================================ */
function deleteNode(id) {
  const node = findNode(ORG_DATA, id);
  if (!node) return;
  if (!confirm(`确认删除「${node.name}」？\n删除后不可恢复，且其所有下属机构也将被一并删除。`)) return;
  
  function removeRecursive(parent, targetId) {
    if (!parent.children) return false;
    const idx = parent.children.findIndex(c => c.id === targetId);
    if (idx !== -1) {
      parent.children.splice(idx, 1);
      return true;
    }
    for (let c of parent.children) {
      if (removeRecursive(c, targetId)) return true;
    }
    return false;
  }
  removeRecursive(ORG_DATA, id);
  
  if (selectedId === id) selectedId = 'root';
  renderTree();
  renderDetail(selectedId);
  showToast(`已删除「${node.name}」`, 'success');
}

/* ============================================================
   Modal
============================================================ */
function getNodePathNames(root, targetId, currentPath = []) {
  if (root.id === targetId) return [...currentPath, root.name];
  if (!root.children) return null;
  for (const c of root.children) {
    const p = getNodePathNames(c, targetId, [...currentPath, root.name]);
    if (p) return p;
  }
  return null;
}

function getParentNode(root, targetId) {
  if (root.id === targetId) return null;
  if (!root.children) return null;
  for (const c of root.children) {
    if (c.id === targetId) return root;
    const p = getParentNode(c, targetId);
    if (p) return p;
  }
  return null;
}

function openModal(type, nodeId) {
  const TAG_SEQ = ['总行', '分行', '支行', '网点', '团队'];

  if (type === 'addNode' || type === 'editNode') {
    document.getElementById('nodeModalTitle').textContent = type === 'addNode' ? '新增机构节点' : '编辑机构节点';
    if (type === 'editNode' && nodeId) {
      const node = findNode(ORG_DATA, nodeId);
      if (node) {
        document.getElementById('inputNodeName').value = node.name;
        const tagSelect = document.getElementById('inputNodeTag');
        Array.from(tagSelect.options).forEach(opt => opt.disabled = false);
        tagSelect.value = node.tag || '网点'; 
        
        const pNode = getParentNode(ORG_DATA, nodeId);
        if (pNode) {
          const pNames = getNodePathNames(ORG_DATA, pNode.id);
          document.getElementById('inputNodeParent').textContent = pNames ? pNames.join(' > ') : '无（顶级）';
        } else {
          document.getElementById('inputNodeParent').textContent = '无（顶级）';
        }
        
        const depth = getNodeDepth(ORG_DATA, nodeId);
        const levelNum = depth + 1;
        const levelNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        document.getElementById('inputNodeLevel').value = `${levelNames[levelNum - 1] || levelNum}级机构`;
        
        document.getElementById('inputNodeCity').value = node.city || '';
        document.getElementById('inputNodeDistrict').value = node.district || '';
      }
    } else {
      document.getElementById('inputNodeName').value = '';
      const tagSelect = document.getElementById('inputNodeTag');
      Array.from(tagSelect.options).forEach(opt => opt.disabled = false);

      if (nodeId) {
        const pNames = getNodePathNames(ORG_DATA, nodeId);
        document.getElementById('inputNodeParent').textContent = pNames ? pNames.join(' > ') : '无（顶级）';
        
        const parentNode = findNode(ORG_DATA, nodeId);
        
        const depth = getNodeDepth(ORG_DATA, nodeId);
        const levelNum = depth + 2;
        const levelNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        document.getElementById('inputNodeLevel').value = `${levelNames[levelNum - 1] || levelNum}级机构`;
        
        document.getElementById('inputNodeCity').value = (parentNode && parentNode.city) ? parentNode.city : '';
        document.getElementById('inputNodeDistrict').value = '';
        
        // 自动推断下一层级标签，并灰显禁用的层级标签
        let nextTag = '网点';
        let parentIdx = -1;
        if (parentNode && parentNode.tag) {
          parentIdx = TAG_SEQ.indexOf(parentNode.tag);
          if (parentIdx >= 0 && parentIdx < TAG_SEQ.length - 1) {
            nextTag = TAG_SEQ[parentIdx + 1];
          } else if (parentIdx === TAG_SEQ.length - 1) {
            nextTag = TAG_SEQ[parentIdx]; // 已经是最小层级则保持
          }
        }
        
        Array.from(tagSelect.options).forEach(opt => {
          const optIdx = TAG_SEQ.indexOf(opt.value);
          if (optIdx >= 0 && optIdx <= parentIdx) {
            opt.disabled = true;
          }
        });

        tagSelect.value = nextTag;
      } else {
        document.getElementById('inputNodeParent').textContent = '无（顶级）';
        tagSelect.value = '总行';
        document.getElementById('inputNodeLevel').value = '一级机构';
        document.getElementById('inputNodeCity').value = '';
        document.getElementById('inputNodeDistrict').value = '';
      }
    }
    document.getElementById('nodeModal').classList.add('show');
  } else if (type === 'addMember') {
    updateRoleHint();
    document.getElementById('memberModal').classList.add('show');
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

function saveNode() {
  closeModal('nodeModal');
  showToast('机构节点已保存', 'success');
  renderTree();
}

function toggleSwitch(id) {
  const el = document.getElementById(id);
  el.classList.toggle('on');
}

function updateRoleHint() {
  const v = document.getElementById('memberRole').value;
  document.getElementById('roleHint').innerHTML = ROLE_HINTS[v] || '';
}

/* ============================================================
   导入向导
============================================================ */
let iwStep = 1;
const IW_STEPS = ['下载模板', '上传文件', '预览确认', '导入完成'];

function openImportWizard() {
  iwStep = 1;
  renderIWSteps();
  renderIWContent();
  renderIWFooter();
  document.getElementById('importModal').classList.add('show');
}

function renderIWSteps() {
  const el = document.getElementById('iwSteps');
  let html = '';
  IW_STEPS.forEach((label, i) => {
    const n = i + 1;
    const cls = n < iwStep ? 'done' : (n === iwStep ? 'active' : '');
    if (i > 0) html += `<div class="iw-connector ${n <= iwStep ? 'done' : ''}"></div>`;
    html += `<div class="iw-step ${cls}">
      <div class="iw-step-dot">${n < iwStep ? '✓' : n}</div>
      <span class="iw-step-label">${label}</span>
    </div>`;
  });
  el.innerHTML = html;
}

function renderIWContent() {
  const el = document.getElementById('iwContent');
  if (iwStep === 1) {
    el.innerHTML = `
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:48px;margin-bottom:16px;">📋</div>
        <div style="font-size:16px;font-weight:700;color:var(--gray-900);margin-bottom:8px;">下载标准 Excel 模板</div>
        <div style="font-size:13.5px;color:var(--gray-500);line-height:1.7;max-width:480px;margin:0 auto 24px;">
          模板中包含填写说明和示例数据。按模板格式填入机构和人员信息后，系统将自动解析并创建。
        </div>
        <div style="margin-bottom:16px;padding:12px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:12.5px;color:#166534;line-height:1.6;">
          💡 <strong>层级路径式填写</strong>：从左到右逐级填写机构名称，右边空着表示到这一级为止。城商行只填 2 列也完全可以。
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:560px;margin:0 auto 24px;text-align:left;">
          ${[
            { col: '一级机构 ★', desc: '签约行（根节点），如「江苏省分行」或「XX银行总行」' },
            { col: '二级机构', desc: '下属机构，如「苏州分行」' },
            { col: '三级机构', desc: '更下层，如「姑苏支行」' },
            { col: '四级机构', desc: '最末级，如「城东网点」' },
            { col: '五级机构', desc: '如有更深层级可继续填写' },
            { col: '角色', desc: '管理员 或 客户经理' },
            { col: '姓名 ★', desc: '员工真实姓名（必填）' },
            { col: '账号 ★', desc: '登录账号，需唯一（必填）' },
            { col: '手机号', desc: '接收初始密码短信' },
          ].map(f => `
            <div style="display:flex;gap:8px;padding:7px 10px;background:var(--gray-50);border-radius:8px;border:1px solid var(--border);">
              <span style="font-size:12px;font-weight:700;color:var(--brand);white-space:nowrap;">${f.col}</span>
              <span style="font-size:12px;color:var(--gray-500);">${f.desc}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary" onclick="downloadTemplate()" style="font-size:14px;padding:11px 28px;">
          📥 下载 Excel 模板
        </button>
        <div style="margin-top:12px;font-size:12px;color:var(--gray-400);">下载后在本地填写完毕，再上传至下一步</div>
      </div>
    `;
  } else if (iwStep === 2) {
    el.innerHTML = `
      <div class="upload-zone" id="uploadZone"
        ondragover="event.preventDefault();this.classList.add('drag-over')"
        ondragleave="this.classList.remove('drag-over')"
        ondrop="handleFileDrop(event)"
        onclick="document.getElementById('fileInput').click()">
        <input type="file" id="fileInput" accept=".xlsx,.xls,.csv" style="display:none" onchange="handleFileSelect(this)">
        <div class="upload-zone-icon">📁</div>
        <div class="upload-zone-title">点击选择或拖拽文件到此处</div>
        <div class="upload-zone-desc">支持 .xlsx / .xls / .csv 格式，文件大小不超过 5MB</div>
      </div>
      <div id="filePreview" style="margin-top:12px;display:none;">
        <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--gray-50);border-radius:10px;border:1px solid var(--border);">
          <span style="font-size:24px;">📊</span>
          <div style="flex:1;">
            <div id="fileName" style="font-size:13.5px;font-weight:600;color:var(--gray-800);"></div>
            <div id="fileSize" style="font-size:12px;color:var(--gray-400);"></div>
          </div>
          <span style="color:var(--success);font-size:13px;font-weight:600;">✓ 格式校验通过</span>
        </div>
      </div>
      <div style="margin-top:14px;padding:10px 14px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;font-size:12.5px;color:#92400e;line-height:1.6;">
        ⚠ 如果账号已存在将跳过（不覆盖）；机构已存在将复用现有节点并追加新成员。
      </div>
    `;
  } else if (iwStep === 3) {
    el.innerHTML = `
      <div style="margin-bottom:14px;padding:12px 16px;background:var(--gray-50);border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;gap:16px;">
        <div style="text-align:center;">
          <div style="font-size:20px;font-weight:800;color:var(--success);">34</div>
          <div style="font-size:11px;color:var(--gray-400);">有效数据行</div>
        </div>
        <div style="width:1px;height:36px;background:var(--border);"></div>
        <div style="text-align:center;">
          <div style="font-size:20px;font-weight:800;color:var(--brand);">8</div>
          <div style="font-size:11px;color:var(--gray-400);">机构节点</div>
        </div>
        <div style="width:1px;height:36px;background:var(--border);"></div>
        <div style="text-align:center;">
          <div style="font-size:20px;font-weight:800;color:var(--brand);">34</div>
          <div style="font-size:11px;color:var(--gray-400);">账号</div>
        </div>
        <div style="width:1px;height:36px;background:var(--border);"></div>
        <div style="text-align:center;">
          <div style="font-size:20px;font-weight:800;color:#f59e0b;">2</div>
          <div style="font-size:11px;color:var(--gray-400);">警告</div>
        </div>
      </div>
      <div class="preview-grid">
        <!-- 机构树预览 -->
        <div class="preview-panel">
          <div class="preview-panel-title">机构层级预览</div>
          ${[
            { indent: 0, name: '江苏省分行', status: 'exists' },
            { indent: 1, name: '+ 南京分行', status: 'exists' },
            { indent: 2, name: '+ 建邺支行', status: 'new' },
            { indent: 2, name: '+ 鼓楼支行', status: 'exists' },
            { indent: 2, name: '+ 同城个贷三部', status: 'new' },
            { indent: 1, name: '+ 徐州分行', status: 'new' },
            { indent: 2, name: '+ 徐州支行', status: 'new' },
            { indent: 1, name: '+ 南通分行', status: 'new' },
            { indent: 2, name: '+ 南通支行', status: 'new' },
            { indent: 1, name: '+ 泰州分行', status: 'new' },
          ].map(r => `
            <div class="preview-tree-node ${r.status}" style="padding-left:${r.indent * 16}px;">
              ${r.name}
              <span style="font-size:10px;margin-left:4px;">${r.status === 'new' ? '(新建)' : '(已存在)'}</span>
            </div>
          `).join('')}
        </div>
        <!-- 账号预览 -->
        <div class="preview-panel">
          <div class="preview-panel-title">账号预览 (共34条，显示前8条)</div>
          ${[
            { name: '陈菱', account: 'yxw_pabank', role: '管理员', status: 'ok' },
            { name: '王某某', account: 'cw_shi', role: '管理员', status: 'ok' },
            { name: '郑婵婷', account: 'ztt_zhi', role: '客户经理', status: 'ok' },
            { name: '陈菱·支2', account: 'cw_zhi02', role: '管理员', status: 'ok' },
            { name: '徐志忠', account: 'xzh_zhi', role: '客户经理', status: 'ok' },
            { name: '李四（手机号格式错误）', account: 'ls_001', role: '客户经理', status: 'warn' },
            { name: '王五（账号重复）', account: 'cw_shi', role: '客户经理', status: 'error' },
            { name: '杨守衡', account: 'yyh_zhi', role: '客户经理', status: 'ok' },
          ].map(r => `
            <div class="preview-account-row ${r.status !== 'ok' ? r.status : ''}">
              <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:600;color:${r.status === 'error' ? '#dc2626' : r.status === 'warn' ? '#d97706' : 'var(--gray-800)'};">${r.name}</div>
                <div style="font-size:11.5px;color:var(--gray-400);">${r.account} · ${r.role}</div>
              </div>
              <span style="font-size:11px;${r.status === 'ok' ? 'color:var(--success)' : r.status === 'warn' ? 'color:#d97706' : 'color:#dc2626'};">
                ${r.status === 'ok' ? '✓' : r.status === 'warn' ? '⚠ 警告' : '✗ 冲突'}
              </span>
            </div>
          `).join('')}
          <div style="margin-top:8px;font-size:12px;color:var(--gray-400);">剩余26条正常，点击「确认导入」后统一处理</div>
        </div>
      </div>
      <div style="margin-top:12px;padding:10px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;font-size:12.5px;color:#dc2626;line-height:1.6;">
        发现 1 个账号冲突（已存在）将跳过，1 个警告项将继续创建。确认前请检查红色标注行。
      </div>
    `;
  } else if (iwStep === 4) {
    el.innerHTML = `
      <div style="text-align:center;padding:24px 0;">
        <div style="width:72px;height:72px;background:var(--success-bg);border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:var(--success);">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style="font-size:20px;font-weight:800;color:var(--gray-900);margin-bottom:8px;">导入成功！</h3>
        <p style="font-size:14px;color:var(--gray-500);margin-bottom:24px;line-height:1.7;">
          已创建 <strong style="color:var(--brand);">7</strong> 个机构节点，<br>
          开通 <strong style="color:var(--brand);">33</strong> 个账号（1个冲突已跳过），<br>
          初始密码已通过短信发送至对应手机。
        </p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:480px;margin:0 auto 24px;">
          ${[
            { label: '管理员', val: '13' },
            { label: '客户经理', val: '20' },
          ].map(s => `
            <div style="padding:12px 20px;background:var(--gray-50);border-radius:10px;border:1px solid var(--border);text-align:center;">
              <div style="font-size:22px;font-weight:800;color:var(--brand);">${s.val}</div>
              <div style="font-size:12px;color:var(--gray-500);">${s.label}</div>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button class="btn btn-default" onclick="closeModal('importModal')">关闭</button>
          <button class="btn btn-ghost" onclick="downloadImportReport()">下载导入报告</button>
          <button class="btn btn-primary" onclick="closeModal('importModal');location.href='org-members.html'">查看人员列表 →</button>
        </div>
      </div>
    `;
  }
}

function renderIWFooter() {
  const el = document.getElementById('iwFooter');
  if (iwStep === 4) { el.innerHTML = ''; return; }
  const canNext = iwStep !== 2; // Step2 需要上传文件才能继续
  el.innerHTML = `
    <button class="btn btn-default" onclick="${iwStep === 1 ? "closeModal('importModal')" : 'iwPrev()'}">
      ${iwStep === 1 ? '取消' : '← 上一步'}
    </button>
    ${iwStep === 1 ? `<button class="btn btn-ghost" onclick="iwNext()" style="margin-left:auto;">跳过模板，直接上传 →</button>` : ''}
    <button class="btn btn-primary" id="iwNextBtn"
      onclick="iwNext()"
      ${!canNext ? 'disabled style="opacity:0.4;pointer-events:none;"' : ''}
      style="${iwStep === 1 ? '' : 'margin-left:auto;'}">
      ${iwStep === 3 ? '确认导入生效' : '下一步 →'}
    </button>
  `;
}

function iwNext() {
  if (iwStep < 4) { iwStep++; renderIWSteps(); renderIWContent(); renderIWFooter(); }
}
function iwPrev() {
  if (iwStep > 1) { iwStep--; renderIWSteps(); renderIWContent(); renderIWFooter(); }
}

function handleFileSelect(input) {
  const f = input.files[0];
  if (!f) return;
  document.getElementById('fileName').textContent = f.name;
  document.getElementById('fileSize').textContent = `${(f.size / 1024).toFixed(1)} KB · 共 34 行数据`;
  document.getElementById('filePreview').style.display = '';
  // 启用下一步
  const btn = document.getElementById('iwNextBtn');
  if (btn) { btn.removeAttribute('disabled'); btn.style.opacity = ''; btn.style.pointerEvents = ''; }
}

function handleFileDrop(event) {
  event.preventDefault();
  document.getElementById('uploadZone').classList.remove('drag-over');
  const f = event.dataTransfer.files[0];
  if (f) {
    document.getElementById('fileName').textContent = f.name;
    document.getElementById('fileSize').textContent = `${(f.size / 1024).toFixed(1)} KB · 共 34 行数据`;
    document.getElementById('filePreview').style.display = '';
    const btn = document.getElementById('iwNextBtn');
    if (btn) { btn.removeAttribute('disabled'); btn.style.opacity = ''; btn.style.pointerEvents = ''; }
  }
}

function downloadTemplate() {
  showToast('模板下载中…（演示模式）', 'success');
}

function downloadImportReport() {
  showToast('导入报告下载中…（演示模式）', 'success');
}

/* ============================================================
   工具函数
============================================================ */
function showToast(msg, type = '') {
  const wrap = document.createElement('div');
  wrap.className = 'toast-wrap';
  wrap.innerHTML = `<div class="toast ${type}">${msg}</div>`;
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 2800);
}

/* ── 获取节点深度 ── */
function getNodeDepth(tree, targetId, depth = 0) {
  if (tree.id === targetId) return depth;
  for (const c of (tree.children || [])) {
    const d = getNodeDepth(c, targetId, depth + 1);
    if (d >= 0) return d;
  }
  return -1;
}

/* 初始化 */
init();
updateRoleHint();
