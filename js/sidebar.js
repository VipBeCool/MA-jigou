/**
 * 银行端 PC 工作台 — 共享侧边栏组件 v2.0
 * 支持多级折叠导航、角色权限控制、SVG 图标
 */

/* ── SVG 图标库 ── */
const ICONS = {
  dashboard:   `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
  users:       `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  user:        `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  clipboard:   `<svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></svg>`,
  shuffle:     `<svg viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`,
  team:        `<svg viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>`,
  network:     `<svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="4" rx="1"/><rect x="1" y="18" width="6" height="4" rx="1"/><rect x="17" y="18" width="6" height="4" rx="1"/><path d="M12 6v4m0 0-4 8m4-8 4 8M4 18l4-8m8 8 4-8"/></svg>`,
  bot:         `<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
  chart:       `<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  alert:       `<svg viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  filecheck:   `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>`,
  download:    `<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  chevron_down:`<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`,
  check:       `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
  chevron_right:`<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`,
  settings:    `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  layers:      `<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  target:      `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  briefcase:   `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  x:           `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  plus:        `<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit:        `<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:       `<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  eye:         `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  search:      `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  bell:        `<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  trending_up: `<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  filter:      `<svg viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  refresh:     `<svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  more:        `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  activity:    `<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  send:        `<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  home:        `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  map_pin:     `<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  flag:        `<svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`
};

function icon(name, cls = '') {
  return `<span class="icon-svg ${cls}">${ICONS[name] || ICONS.settings}</span>`;
}

/* ── 角色配置（精简为两类：管理员 + 客户经理） ── */
const ROLES_CONFIG = {
  manager: {
    name: '张行长',
    initials: '张',
    label: '管理员',
    color: '#2563eb',
  },
  rm: {
    name: '朱某人',
    initials: '朱',
    label: '客户经理',
    color: '#8b5cf6',
  },
};

/* ── 判断是否管理员角色 ── */
function isAdminRole(role) {
  return role !== 'rm';
}

/* ── 导航结构（按角色过滤菜单） ── */
function getNavConfig(role) {
  const sections = [];
  const admin = isAdminRole(role);

  // ── 工作台（共用） ──
  sections.push({
    items: [
      { id: 'home', label: '工作台', icon: 'dashboard', href: 'index.html' },
    ],
  });

  // ── 客户营销 ──
  const custItems = [
    { id: 'customers', label: '客户名单', icon: 'users', href: 'customers.html' },
  ];
  if (admin) {
    custItems.push({ id: 'allocation', label: '名单分配', icon: 'shuffle', href: 'allocation.html' });
  }
  if (!admin) {
    custItems.push({ id: 'tasks', label: '营销跟进', icon: 'activity', href: 'tasks.html' });
  }
  if (admin) {
    custItems.push({ id: 'team', label: '团队业绩', icon: 'team', href: 'team.html' });
  }
  sections.push({ label: '客户营销', items: custItems });

  // ── 运营管理（仅管理员） ──
  if (admin) {
    const opsItems = [
      { id: 'select', label: '智能探客', icon: 'target', href: 'select.html' },
      { id: 'agents', label: '智能体管理', icon: 'bot', href: 'agents.html' },
      { id: 'org-structure', label: '组织与成员管理', icon: 'network', href: 'org-config.html' },
      { id: 'risk-alert', label: '风险预警', icon: 'alert', href: 'risk-alert.html' }
    ];
    sections.push({ label: '运营管理', items: opsItems });
  }

  // ── 数据分析（仅管理员） ──
  if (admin) {
    sections.push({
      label: '数据分析',
      items: [
        { id: 'dashboard', label: '数据看板', icon: 'chart', href: 'dashboard.html' },
      ],
    });
  }

  // ── 其他 ──
  const otherItems = [];
  if (admin) {
    otherItems.push({ id: 'reconciliation', label: '对账确认', icon: 'filecheck', href: 'reconciliation.html' });
  }
  otherItems.push({ id: 'downloads', label: '下载中心', icon: 'download', href: 'downloads.html' });
  sections.push({ label: '其他', items: otherItems });

  return sections;
}

/* ── 渲染一个导航项 ── */
function renderNavItem(item, currentPage) {
  const isActive = currentPage === item.id;

  if (item.children && item.children.length) {
    // 有子项 → 折叠父项
    const hasActiveChild = item.children.some(c => currentPage === c.id);
    const openClass = (hasActiveChild) ? 'open' : '';

    const childrenHtml = item.children.map(child => {
      const ca = currentPage === child.id;
      return `<a href="${child.href}" class="nav-child ${ca ? 'active' : ''}" data-id="${child.id}">${child.label}</a>`;
    }).join('');

    return `
      <div class="nav-parent ${openClass}" onclick="toggleNavParent(this)">
        <span class="nav-parent-icon">${ICONS[item.icon] || ''}</span>
        <span class="flex-1 nav-item-label">${item.label}</span>
        <span class="nav-chevron">${ICONS.chevron_down}</span>
      </div>
      <div class="nav-children ${openClass}">
        ${childrenHtml}
      </div>
    `;
  }

  return `
    <a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}" data-id="${item.id}">
      <span class="nav-item-icon">${ICONS[item.icon] || ''}</span>
      <span class="nav-item-label">${item.label}</span>
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    </a>
  `;
}

/* ── 渲染完整侧边栏 ── */
function renderSidebar({ currentPage = 'home', role = 'rm', containerId = 'sidebar' } = {}) {
  const r = ROLES_CONFIG[role] || ROLES_CONFIG.rm;
  const sections = getNavConfig(role);

  let navHtml = '';
  sections.forEach(section => {
    if (section.label) {
      navHtml += `<div class="nav-section"><span class="nav-section-label">${section.label}</span></div>`;
    }
    section.items.forEach(item => {
      navHtml += renderNavItem(item, currentPage);
    });
  });

  const otherRoles = Object.entries(ROLES_CONFIG).filter(([k]) => k !== role);

  const sidebarHtml = `
    <div class="sidebar-logo" id="sidebarLogo" title="智能营销平台" style="gap: 12px; padding: 0 16px;">
      <div class="logo-mark" style="background: transparent; box-shadow: none; width: 34px; height: 34px; padding: 0;">
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoHex1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563eb"/>
              <stop offset="100%" stop-color="#1e40af"/>
            </linearGradient>
            <linearGradient id="logoHex2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3b82f6"/>
              <stop offset="100%" stop-color="#1d4ed8"/>
            </linearGradient>
            <linearGradient id="logoHex3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#60a5fa"/>
              <stop offset="100%" stop-color="#2563eb"/>
            </linearGradient>
          </defs>
          <path d="M18 3L31 10.5V25.5L18 33L5 25.5V10.5L18 3Z" stroke="url(#logoHex3)" stroke-width="1.5" fill="rgba(59,130,246,0.1)"/>
          <path d="M18 9L26.66 14L18 19L9.34 14Z" fill="url(#logoHex3)"/>
          <path d="M18 19L26.66 14V24L18 29Z" fill="url(#logoHex1)"/>
          <path d="M18 19V29L9.34 24V14Z" fill="url(#logoHex2)"/>
        </svg>
      </div>
      <div>
        <div class="logo-title" style="font-size: 16px; font-weight: 800; background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 0.5px;">智能营销平台</div>
        <div class="logo-subtitle" style="font-size: 11px; color: var(--gray-400); letter-spacing: 0.5px; margin-top: 2px;">金融机构端</div>
      </div>
    </div>

    <!-- 演示角色切换面板（隐藏于Logo交互之下） -->
    <div class="role-popover" id="rolePopover" style="top:60px;bottom:auto;">
      <div class="role-popover-title">🎭 切换演示角色</div>
      ${Object.entries(ROLES_CONFIG).map(([k, rc]) => `
        <div class="role-option ${k === role ? 'active' : ''}" onclick="switchRole('${k}')">
          <div class="role-option-avatar" style="background:${rc.color};">${rc.initials}</div>
          <div>
            <div class="role-option-name">${rc.name}</div>
            <div class="role-option-desc">${rc.label}</div>
          </div>
          ${k === role ? `<span class="role-option-check">${ICONS.check}</span>` : ''}
        </div>
      `).join('')}
    </div>

    <nav class="nav-menu">${navHtml}</nav>

    <div class="sidebar-footer">
      <!-- 个人中心下拉菜单 -->
      <div class="user-menu-popover" id="userMenuPopover">
        <a href="profile.html" class="user-menu-item">
          <span class="user-menu-icon">${ICONS.user}</span>
          <span>个人中心</span>
        </a>
        <div class="user-menu-divider"></div>
        <a href="login.html" class="user-menu-item danger" onclick="handleLogout(event)">
          <span class="user-menu-icon">${ICONS.x}</span>
          <span>退出登录</span>
        </a>
      </div>

      <div class="sidebar-user" onclick="toggleUserMenu()" id="sidebarUser">
        <div class="user-avatar">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div class="user-meta">
          <div class="user-name">${r.name}</div>
          <div class="user-role">${r.label}</div>
        </div>
        <span class="sidebar-user-chevron">${ICONS.chevron_down}</span>
      </div>
    </div>
  `;

  const container = document.getElementById(containerId);
  if (container) container.innerHTML = sidebarHtml;

  // 事件：点击外部关闭所有 popover
  document.addEventListener('click', (e) => {
    const rolePopover = document.getElementById('rolePopover');
    const logo = document.getElementById('sidebarLogo');
    const userMenu = document.getElementById('userMenuPopover');
    const user = document.getElementById('sidebarUser');
    
    // 关闭角色切换面板
    if (rolePopover && logo && !logo.contains(e.target) && !rolePopover.contains(e.target)) {
      rolePopover.classList.remove('show');
    }
    // 关闭用户菜单
    if (userMenu && user && !user.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.classList.remove('show');
    }
  });

  // Logo 双击和右键触发演示角色切换
  const logoEl = document.getElementById('sidebarLogo');
  if (logoEl) {
    let clickCount = 0, clickTimer;
    logoEl.addEventListener('dblclick', (e) => {
      e.preventDefault();
      toggleRolePopover();
    });
    logoEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      toggleRolePopover();
    });
  }
}

/* ── 折叠/展开父项 ── */
function toggleNavParent(el) {
  const isOpen = el.classList.contains('open');
  // 先关闭同级
  el.parentElement.querySelectorAll('.nav-parent.open').forEach(p => {
    if (p !== el) {
      p.classList.remove('open');
      const sib = p.nextElementSibling;
      if (sib && sib.classList.contains('nav-children')) sib.classList.remove('open');
    }
  });
  el.classList.toggle('open', !isOpen);
  const children = el.nextElementSibling;
  if (children && children.classList.contains('nav-children')) {
    children.classList.toggle('open', !isOpen);
  }
}

/* ── 角色切换 ── */
function switchRole(role) {
  sessionStorage.setItem('wb_role', role);
  location.href = 'index.html';
}

/* ── 演示模式：Logo双击/右键弹出角色切换 Popover ── */
function toggleRolePopover() {
  const p = document.getElementById('rolePopover');
  const um = document.getElementById('userMenuPopover');
  if (um) um.classList.remove('show'); // 关闭用户菜单
  if (p) p.classList.toggle('show');
}

/* ── 用户菜单（个人中心 / 退出登录） ── */
function toggleUserMenu() {
  const um = document.getElementById('userMenuPopover');
  const rp = document.getElementById('rolePopover');
  if (rp) rp.classList.remove('show');
  if (um) um.classList.toggle('show');
}

/* ── 退出登录 ── */
function handleLogout(e) {
  e.preventDefault();
  sessionStorage.removeItem('wb_role');
  sessionStorage.removeItem('wb_user');
  window.location.href = 'login.html';
}

/* ── 全局 CSS 注入（icon-svg） ── */
(function injectIconStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .icon-svg { display:inline-flex; align-items:center; justify-content:center; }
    .icon-svg svg, .nav-item-icon svg, .nav-parent-icon svg,
    .nav-chevron svg, .card-title-icon svg, .sidebar-user-chevron svg,
    .role-option-check svg, .logo-mark svg,
    .search-icon svg, .modal-close svg, .btn svg, .tree-node-icon svg,
    .tree-node-toggle svg, .wizard-dot svg {
      stroke: currentColor;
      fill: none;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
      width: 100%;
      height: 100%;
    }
  `;
  document.head.appendChild(style);
})();

/* ── 全局自动转化原生单选下拉为自定义下拉 ── */
(function initGlobalCustomSelects() {
  function upgradeSelects() {
    document.querySelectorAll('select.form-control:not([multiple])').forEach(select => {
      if (select.dataset.customized) return;
      select.dataset.customized = "true";
      select.style.display = 'none';
      
      const wrap = document.createElement('div');
      wrap.className = 'custom-singleselect';
      if (select.style.width) wrap.style.width = select.style.width;
      if (select.style.flex) wrap.style.flex = select.style.flex;
      if (select.style.flexBasis) wrap.style.flexBasis = select.style.flexBasis;
      select.parentNode.insertBefore(wrap, select);
      wrap.appendChild(select);
      
      const display = document.createElement('div');
      display.className = 'custom-singleselect-display';
      if (select.disabled) display.classList.add('disabled');
      
      const text = document.createElement('span');
      text.className = 'custom-singleselect-text';
      
      const icon = document.createElement('span');
      icon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
      icon.style.display = 'flex';
      
      display.appendChild(text);
      display.appendChild(icon);
      
      const dropdown = document.createElement('div');
      dropdown.className = 'custom-singleselect-dropdown';
      
      wrap.appendChild(display);
      wrap.appendChild(dropdown);
      
      const renderOptions = () => {
        dropdown.innerHTML = '';
        Array.from(select.options).forEach((opt, idx) => {
          if(opt.style.display === 'none') return;
          const div = document.createElement('div');
          div.className = 'custom-singleselect-option' + (opt.selected ? ' selected' : '') + (opt.disabled ? ' disabled' : '');
          div.textContent = opt.text;
          div.onclick = (e) => {
            e.stopPropagation();
            if (select.disabled || opt.disabled) return;
            select.selectedIndex = idx;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            text.textContent = opt.text;
            dropdown.classList.remove('show');
            display.classList.remove('focus');
            renderOptions();
          };
          dropdown.appendChild(div);
        });
        text.textContent = select.options[select.selectedIndex]?.text || '';
      };
      
      renderOptions();
      
      display.onclick = (e) => {
        e.stopPropagation();
        if (select.disabled) return;
        document.querySelectorAll('.custom-singleselect-dropdown.show, .custom-multiselect-dropdown.show').forEach(el => {
          if (el !== dropdown) el.classList.remove('show');
        });
        document.querySelectorAll('.custom-singleselect-display.focus').forEach(el => el.classList.remove('focus'));
        const isShowing = dropdown.classList.contains('show');
        if (!isShowing) {
          const rect = wrap.getBoundingClientRect();
          if (dropdown.parentNode !== document.body) {
            document.body.appendChild(dropdown);
          }
          dropdown.style.position = 'fixed';
          dropdown.style.top = (rect.bottom + 4) + 'px';
          dropdown.style.left = rect.left + 'px';
          dropdown.style.minWidth = rect.width + 'px';
          dropdown.style.width = 'max-content';
          dropdown.style.zIndex = '99999';
          dropdown.classList.add('show');
          display.classList.add('focus');
        } else {
          dropdown.classList.remove('show');
        }
      };
      
      // 监听 DOM 的 Option 变化
      const observer = new MutationObserver(() => renderOptions());
      observer.observe(select, { childList: true, subtree: true });
      
      // 监听属性变化 (如 disabled)
      const attrObserver = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          if (m.attributeName === 'disabled') {
            if (select.disabled) display.classList.add('disabled');
            else display.classList.remove('disabled');
          }
        });
      });
      attrObserver.observe(select, { attributes: true, attributeFilter: ['disabled'] });
      
      // 拦截 JS 直接赋值 select.value 和 select.selectedIndex
      ['value', 'selectedIndex'].forEach(prop => {
        const desc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, prop);
        if(desc) {
          Object.defineProperty(select, prop, {
            set(val) {
              desc.set.call(this, val);
              renderOptions();
            },
            get() {
              return desc.get.call(this);
            }
          });
        }
      });
      
      select.addEventListener('change', renderOptions);
    });
  }
  
  // 外部点击收起
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-singleselect') && 
        !e.target.closest('.custom-multiselect') &&
        !e.target.closest('.custom-singleselect-dropdown') &&
        !e.target.closest('.custom-multiselect-dropdown')) {
      document.querySelectorAll('.custom-singleselect-dropdown.show, .custom-multiselect-dropdown.show').forEach(el => el.classList.remove('show'));
      document.querySelectorAll('.custom-singleselect-display.focus').forEach(el => el.classList.remove('focus'));
    }
  });
  
  // 滚动时收起（捕获阶段，监听所有容器的滚动）
  document.addEventListener('scroll', (e) => {
    if (e.target && e.target.closest && (e.target.closest('.custom-singleselect-dropdown') || e.target.closest('.custom-multiselect-dropdown'))) {
      return; // 忽略下拉框内部的滚动
    }
    document.querySelectorAll('.custom-singleselect-dropdown.show, .custom-multiselect-dropdown.show').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.custom-singleselect-display.focus').forEach(el => el.classList.remove('focus'));
  }, true);

  document.addEventListener('DOMContentLoaded', upgradeSelects);
  if (document.readyState !== 'loading') upgradeSelects();
  
  window.upgradeCustomSelects = upgradeSelects; // 暴露给动态弹窗调用
})();
