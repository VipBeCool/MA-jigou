/**
 * 智能营销平台 - 银行端工作台 公共逻辑
 */

// 获取URL参数
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// 根据ID获取客户
function getCustomerById(id) {
  return customers.find(c => c.id === parseInt(id));
}

// 根据状态获取样式类
function getStatusClass(status) {
  const map = {
    '待触达': 'status-pending',
    '已触达': 'status-contacted',
    '已意向': 'status-interested',
    '已放款': 'status-success',
    '已拒绝': 'status-rejected'
  };
  return map[status] || 'status-pending';
}

// 根据标签获取样式类
function getTagClass(tag) {
  if (tag.includes('高新')) return 'tag-blue';
  if (tag.includes('专精特新')) return 'tag-purple';
  if (tag.includes('上市')) return 'tag-orange';
  if (tag.includes('龙头')) return 'tag-green';
  return 'tag-blue';
}

// 渲染侧边栏
function renderSidebar(activePage) {
  const menuItems = [
    { id: 'home', icon: '🏠', text: '工作台', href: 'index.html' },
    { id: 'customers', icon: '👥', text: '客户名单', href: 'customers.html' },
    { id: 'tasks', icon: '📋', text: '任务管理', href: 'tasks.html' },
    { id: 'select', icon: '🎯', text: '智能圈选', href: 'select.html' },
    { id: 'dashboard', icon: '📊', text: '数据看板', href: 'dashboard.html' },
    { id: 'reconciliation', icon: '📑', text: '对账确认', href: 'reconciliation.html' }
  ];

  return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">💼</div>
        <h1>智能营销平台</h1>
      </div>
      <nav class="nav-menu">
        ${menuItems.map(item => `
          <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-text">${item.text}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">李</div>
          <div>
            <div class="user-name">朱某人</div>
            <div class="user-role">客户经理</div>
          </div>
        </div>
      </div>
    </aside>
  `;
}

// 渲染统计卡片
function renderStatCards() {
  return `
    <div class="stat-cards">
      <div class="stat-card primary" onclick="location.href='customers.html?status=待触达'">
        <div class="stat-label">待触达客户</div>
        <div class="stat-value">${statistics.pendingCount}<span class="stat-suffix">家</span></div>
        <div class="stat-trend up">↑ ${statistics.pendingTrend}% 较上周</div>
      </div>
      <div class="stat-card success" onclick="location.href='customers.html?status=已触达'">
        <div class="stat-label">本周已触达</div>
        <div class="stat-value">${statistics.contactedThisWeek}<span class="stat-suffix">家</span></div>
        <div class="stat-trend up">↑ ${statistics.contactedTrend}% 较上周</div>
      </div>
      <div class="stat-card warning" onclick="location.href='customers.html?status=已意向'">
        <div class="stat-label">意向客户</div>
        <div class="stat-value">${statistics.interestedCount}<span class="stat-suffix">家</span></div>
        <div class="stat-trend up">↑ ${statistics.interestedTrend}% 较上周</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-label">本月放款金额</div>
        <div class="stat-value">${statistics.loanThisMonth}<span class="stat-suffix">万</span></div>
        <div class="stat-trend up">↑ ${statistics.loanTrend}% 较上月</div>
      </div>
    </div>
  `;
}

// 打开模态框
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

// 关闭模态框
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// 显示话术生成模态框
function showScriptModal(customerId) {
  const customer = getCustomerById(customerId);
  if (!customer) return;

  const content = `
    <div class="ai-recommendation">
      <div class="ai-recommendation-title">
        <span class="icon">🤖</span> AI生成话术
      </div>
      <div class="ai-recommendation-text">
        <p><strong>【开场白】</strong></p>
        <p>您好，请问是${customer.contact.name}吗？我是江苏银行的客户经理朱某人。</p>
        <p>我们注意到贵公司${customer.name}近年来发展迅速，${customer.recommendation}是典型的优质企业。</p>
        <p>我们银行有一款专门针对科技企业的"科技贷"产品，最高可授信${customer.suggestedAmount}，利率优惠，想了解一下您这边是否有融资需求？</p>
      </div>
    </div>
  `;

  document.getElementById('modalBody').innerHTML = content;
  document.getElementById('modalTitle').textContent = '智能话术 - ' + customer.name;
  openModal('scriptModal');
}

// 显示状态更新模态框
function showStatusModal(customerId) {
  const customer = getCustomerById(customerId);
  if (!customer) return;

  const content = `
    <div class="form-group">
      <label class="form-label">当前状态</label>
      <div class="status-badge ${getStatusClass(customer.status)}">${customer.status}</div>
    </div>
    <div class="form-group">
      <label class="form-label">更新为</label>
      <select class="form-select" id="newStatus">
        <option value="已触达">已触达</option>
        <option value="已意向">已意向</option>
        <option value="已申请">已申请</option>
        <option value="已放款">已放款</option>
        <option value="已拒绝">已拒绝</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">备注</label>
      <textarea class="form-input" rows="3" placeholder="请输入跟进备注..."></textarea>
    </div>
  `;

  document.getElementById('modalBody').innerHTML = content;
  document.getElementById('modalTitle').textContent = '更新状态 - ' + customer.name;
  openModal('scriptModal');
}

// Tab切换
function initTabs() {
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', function () {
      const tabGroup = this.closest('.card');
      tabGroup.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
      tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      this.classList.add('active');
      const targetId = this.dataset.tab;
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
  initTabs();
});
