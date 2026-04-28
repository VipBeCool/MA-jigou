/**
 * 触达路径推荐 - 角色标签全量配置
 * 覆盖 P1-P7 共 15 个角色标签 + 1 个风险拦截标签
 * 前端展示时根据 role 字段匹配对应的颜色、Tips 等
 */
const CONTACT_ROLE_CONFIG = {
  // ===== P1 - 核心决策与融资专人（最高优先）=====
  '[财务/税务负责人]': { tier: 1, tips: '企业财税核心负责人，对资金动向最清楚，适合推荐结算和信贷产品。', tagBg: '#e6f7ff', tagColor: '#1890ff', tagBorder: '#91d5ff' },
  '[企业法人/实控人]': { tier: 1, tips: '企业最高决策人，适合大额信贷或核心业务沟通。', tagBg: '#e6f7ff', tagColor: '#1890ff', tagBorder: '#91d5ff' },
  '[融资对接人]':       { tier: 1, tips: '明确主导过企业融资项目的负责人，转化意向极高。', tagBg: '#e6f7ff', tagColor: '#1890ff', tagBorder: '#91d5ff' },
  '[项目业务负责人]':   { tier: 1, tips: '核心业务或招投标负责人，常伴有项目周转资金需求。', tagBg: '#e6f7ff', tagColor: '#1890ff', tagBorder: '#91d5ff' },

  // ===== P2 - 优质资质及项目报送人 =====
  '[资质项目申报人]': { tier: 2, tips: '高新/专精特新等资质申报负责人，通常是高管或老板亲信。', tagBg: '#f9f0ff', tagColor: '#722ed1', tagBorder: '#d3adf7' },

  // ===== P3 - 高管与核心管理人员 =====
  '[董监高/核心股东]':  { tier: 3, tips: '企业核心管理层或重要股东，法人失联时的最佳平替。', tagBg: '#fff7e6', tagColor: '#fa8c16', tagBorder: '#ffd591' },
  '[经营者/实控人]':    { tier: 3, tips: '个体或企业的实际经营者，直达决策核心。', tagBg: '#fff7e6', tagColor: '#fa8c16', tagBorder: '#ffd591' },
  '[采购方业务对接人]': { tier: 3, tips: '采购环节核心对接人，适合推荐供应链金融方案。', tagBg: '#fff7e6', tagColor: '#fa8c16', tagBorder: '#ffd591' },

  // ===== P4 - 业务经办与职能人员 =====
  '[工程负责人]':     { tier: 4, tips: '项目/工程主导人，通常有周转资金需求，适合推供应链融资。', tagBg: '#e6fffb', tagColor: '#13c2c2', tagBorder: '#87e8de' },
  '[职能经办/联络员]': { tier: 4, tips: '企业内部真实员工，可作为触达高层的桥梁。', tagBg: '#e6fffb', tagColor: '#13c2c2', tagBorder: '#87e8de' },

  // ===== P5 - 资产关联人员 =====
  '[资产关联人]': { tier: 5, tips: '关联高价值资产（房/车/船），适合抵押类信贷产品沟通。', tagBg: '#fcffe6', tagColor: '#7cb305', tagBorder: '#d3f261' },

  // ===== P6 - 外采公开数据补充 =====
  '[公开渠道联系人]': { tier: 6, tips: '来自公开渠道的补充数据，身份待进一步确认。', tagBg: '#f5f5f5', tagColor: '#8c8c8c', tagBorder: '#d9d9d9', dim: true },

  // ===== P7 - 工商联系方式（兜底）=====
  '[基础预留联系人]': { tier: 7, tips: '常规预留联系人，建议优先核实身份后再沟通。', tagBg: '#f5f5f5', tagColor: '#8c8c8c', tagBorder: '#d9d9d9', dim: true },
  '[基础业务联系人]': { tier: 7, tips: '常规业务联系人，可尝试触达。', tagBg: '#f5f5f5', tagColor: '#8c8c8c', tagBorder: '#d9d9d9', dim: true },
  '[工商预留固话]':   { tier: 7, tips: '工商注册预留固话，接通率较低，建议作最后兜底使用。', tagBg: '#f5f5f5', tagColor: '#bfbfbf', tagBorder: '#e8e8e8', dim: true },

  // ===== 风险拦截（不参与正常排序）=====
  '[风险拦截对象]': { tier: 99, tips: '存在风险提示的关联人，不建议重点营销。', tagBg: '#fff1f0', tagColor: '#f5222d', tagBorder: '#ffa39e', dim: true }
};

// 优先级对应的奖牌图标
const TIER_MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

// P1 层级高亮背景色
const TIER_BG = { 1: '#f0f9eb', 2: '#fafafa', 3: '#fafafa' };
const TIER_BORDER = { 1: '#b7eb8f', 2: '#f0f0f0', 3: '#f0f0f0' };

/**
 * 根据角色标签获取完整渲染配置
 * @param {string} role - 如 '[财务/税务负责人]'
 * @returns {object} 包含 tier, tips, tagBg, tagColor, tagBorder, dim 等
 */
function getRoleConfig(role) {
  return CONTACT_ROLE_CONFIG[role] || { tier: 7, tips: '常规联系方式。', tagBg: '#f5f5f5', tagColor: '#8c8c8c', tagBorder: '#d9d9d9' };
}

/**
 * 通用联系方式卡片 HTML 生成函数
 * @param {object} opt - { maskedPhone, fullPhone, role, contactName?, tips? }
 * @param {number} index - 用于确定奖牌 (0=🥇, 1=🥈, 2=🥉)
 */
window.buildContactCard = function(opt, index) {
  const cfg = getRoleConfig(opt.role);
  const tips = opt.tips || cfg.tips;
  const tier = opt.tier || cfg.tier;
  const dim = opt.dim !== undefined ? opt.dim : cfg.dim;
  
  const MEDALS = ['🥇', '🥈', '🥉'];
  const medal = (index !== undefined && index >= 0 && index < 3) ? MEDALS[index] : '';

  const bg = opt.bg || TIER_BG[tier] || '#fafafa';
  const border = opt.border || TIER_BORDER[tier] || '#f0f0f0';
  const phoneColor = tier === 1 ? '#1890ff' : (dim ? '#bfbfbf' : '#262626');
  const phoneSize = tier === 1 ? '17px' : (dim ? '14px' : '15px');

  const nameHtml = opt.contactName ? `<div style="font-size:12px;color:#8c8c8c;margin-bottom:2px;">👤 ${opt.contactName}</div>` : '';
  const opacityStyle = dim ? 'opacity:0.65;' : '';

  return `<div style="padding:14px 16px;background:${bg};border:1px solid ${border};border-radius:10px;margin-bottom:10px;${opacityStyle}">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <span style="font-size:${phoneSize};font-weight:600;color:${phoneColor};">
          <span class="phone-text">${opt.maskedPhone}</span>
          <span style="cursor:pointer;font-size:13px;opacity:0.5;margin-left:3px;" onclick="window.togglePhone(this,'${opt.maskedPhone}','${opt.fullPhone}')">👁️</span>
        </span>
        <span style="font-size:11px;background:${cfg.tagBg};color:${cfg.tagColor};padding:2px 8px;border-radius:4px;border:1px solid ${cfg.tagBorder};">
          ${opt.role}
        </span>
      </div>
      <span style="font-size:18px;flex-shrink:0;">${medal}</span>
    </div>
    ${nameHtml}
    <div style="font-size:12px;color:#595959;line-height:1.6;background:rgba(255,255,255,0.7);padding:6px 10px;border-radius:6px;margin-bottom:10px;">
      <span style="opacity:0.6;">Tips：</span>${tips}
    </div>
    <div class="feedback-container" style="display:flex;justify-content:flex-end;align-items:center;border-top:1px dashed #e8e8e8;padding-top:10px;position:relative;">
      <span style="font-size:11px;color:#8c8c8c;margin-right:8px;">联系不上？</span>
      <button class="btn btn-sm" style="padding:2px 8px;font-size:11px;border-radius:4px;background:#fff;color:#1890ff;border:1px solid #1890ff;cursor:pointer;" onclick="window.toggleFeedbackPopover(this, event)">反馈一下 ▾</button>
      
      <div class="feedback-popover" style="display:none;position:absolute;top:32px;right:0;background:#fff;border:1px solid #f0f0f0;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.15);padding:6px;z-index:100;min-width:115px;text-align:left;">
        <div style="font-size:11px;color:#bfbfbf;margin-bottom:4px;padding-bottom:4px;border-bottom:1px solid #f0f0f0;">选择失效原因</div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <button style="text-align:left;padding:6px 8px;font-size:11px;border-radius:4px;background:transparent;color:#595959;border:none;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'" onclick="window.markFeedback(this, '空号/停机', '📵', event)">空号/停机</button>
          <button style="text-align:left;padding:6px 8px;font-size:11px;border-radius:4px;background:transparent;color:#595959;border:none;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'" onclick="window.markFeedback(this, '代账/非本企业', '🚫', event)">代账/非本企业</button>
          <button style="text-align:left;padding:6px 8px;font-size:11px;border-radius:4px;background:transparent;color:#595959;border:none;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'" onclick="window.markFeedback(this, '拒绝/勿扰', '🔕', event)">拒绝/勿扰</button>
        </div>
      </div>
    </div>
  </div>`;
}

// 反馈气泡弹窗切换
window.toggleFeedbackPopover = function(btn, event) {
  event.stopPropagation();
  // 先关闭其他所有打开的气泡
  document.querySelectorAll('.feedback-popover').forEach(p => {
    if (p !== btn.nextElementSibling) p.style.display = 'none';
  });
  
  const popover = btn.nextElementSibling;
  popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
};

// 反馈选中交互
window.markFeedback = function(btn, type, icon, event) {
  event.stopPropagation();
  const container = btn.closest('.feedback-container');
  const label = container.querySelector('span:first-child');
  const toggleBtn = container.querySelector('button');
  const popover = container.querySelector('.feedback-popover');
  
  // 更新按钮样式为已标记状态
  toggleBtn.innerHTML = `${icon} 已标记为：${type} ▾`;
  toggleBtn.style.color = '#a8071a';
  toggleBtn.style.background = '#fff1f0';
  toggleBtn.style.border = '1px solid #ffa39e';
  
  // 隐藏“联系不上？”提示文本
  if (label && !label.classList.contains('feedback-popover')) {
    label.style.display = 'none';
  }
  
  // 关闭气泡
  if (popover) {
    popover.style.display = 'none';
  }
};

// 全局点击关闭气泡弹窗
if (typeof window !== 'undefined') {
  window.addEventListener('click', function(e) {
    if (!e.target.closest('.feedback-container')) {
      document.querySelectorAll('.feedback-popover').forEach(p => p.style.display = 'none');
    }
  });
}

// 电话明文/掩码切换
window.togglePhone = function(el, masked, full) {
  const phoneSpan = el.previousElementSibling;
  if (phoneSpan.textContent === masked) {
    phoneSpan.textContent = full;
    el.textContent = '🙈';
  } else {
    phoneSpan.textContent = masked;
    el.textContent = '👁️';
  }
};

// 展开/收起更多
window.toggleMoreContacts = function(el, targetId) {
  const target = document.getElementById(targetId);
  if (target.style.display === 'none' || target.style.display === '') {
    target.style.display = 'block';
    el.innerHTML = '🔼 收起更多';
  } else {
    target.style.display = 'none';
    el.innerHTML = '🔽 展开更多 (' + (el.dataset.count || '') + ')';
  }
};

// 选项卡切换功能
window.switchContactTab = function(el, targetId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // 切换内容区域
  const panels = container.querySelectorAll('.contact-tab-panel');
  panels.forEach(p => p.style.display = 'none');
  const targetPanel = container.querySelector('#' + targetId);
  if (targetPanel) targetPanel.style.display = 'block';

  // 切换选项卡样式
  const tabs = el.parentElement.querySelectorAll('.contact-tab-btn');
  tabs.forEach(t => {
    t.style.borderBottom = 'none';
    t.style.color = '#595959';
  });
  el.style.borderBottom = '2px solid #1890ff';
  el.style.color = '#1890ff';
};

// Mock 样例数据 - 覆盖 P1-P7 所有层级的代表性角色
const MOCK_CONTACT_PATHS = [
  { maskedPhone:'138****1234', fullPhone:'13800001234', role:'[财务/税务负责人]', contactName:'张明' },
  { maskedPhone:'186****8888', fullPhone:'18688888888', role:'[融资对接人]' },
  { maskedPhone:'139****5678', fullPhone:'13988885678', role:'[资质项目申报人]' },
  { maskedPhone:'137****0000', fullPhone:'13711110000', role:'[董监高/核心股东]' },
  { maskedPhone:'136****2222', fullPhone:'13622222222', role:'[工程负责人]' },
  { maskedPhone:'135****3333', fullPhone:'13533333333', role:'[资产关联人]' },
  { maskedPhone:'158****4444', fullPhone:'15844444444', role:'[公开渠道联系人]' },
  { maskedPhone:'025-888****9', fullPhone:'025-88889999', role:'[工商预留固话]' }
];
