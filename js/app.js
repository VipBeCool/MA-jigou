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

// 根据状态获取样式类（兼容新旧状态）
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
      <div class="ai-recommendation-title"><span class="icon">🤖</span> AI生成话术</div>
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
  // 恢复 footer
  const footer = document.querySelector('#scriptModal .modal-footer');
  footer.innerHTML = `
    <button class="btn btn-default" onclick="closeModal('scriptModal')">关闭</button>
    <button class="btn btn-primary">复制话术</button>
  `;
  openModal('scriptModal');
}

// 显示状态更新模态框 — 双维度 Tab 版本
function showStatusModal(customerId) {
  const customer = getCustomerById(customerId);
  if (!customer) return;

  const reachCfg = getReachStageConfig(customer.reachStage || 'PENDING');
  const bizCfg = getBizStageConfig(customer.bizStage || 'NONE');

  // 构建营销阶段选项
  const reachOptions = Object.entries(REACH_STAGES).map(([k, v]) =>
    `<option value="${k}" ${customer.reachStage === k ? 'selected' : ''}>${v.icon} ${v.label}</option>`
  ).join('');

  // 构建业务阶段选项
  const bizOptions = Object.entries(BIZ_STAGES).map(([k, v]) =>
    `<option value="${k}" ${customer.bizStage === k ? 'selected' : ''}>${v.icon} ${v.label}</option>`
  ).join('');

  // 放款明细表
  const disbursements = customer.disbursements || [];
  const loanTableRows = disbursements.map((d, i) => `
    <tr>
      <td style="font-size:12px;">${d.date}</td>
      <td style="font-size:12px;font-weight:600;color:#237804;">${d.amount}万</td>
      <td style="font-size:12px;">${d.term}</td>
      <td style="font-size:12px;">${d.rate}</td>
      <td style="font-size:12px;">${d.product||'--'}</td>
      <td style="font-size:12px;"><span style="padding:2px 6px;border-radius:4px;font-size:11px;${d.status==='正常'?'background:#f6ffed;color:#52c41a;':'background:#fff2f0;color:#ff4d4f;'}">${d.status}</span></td>
      <td><button class="btn btn-text btn-sm" style="color:#ff4d4f;font-size:11px;" onclick="removeDisbursement(${i})">删除</button></td>
    </tr>
  `).join('');

  // 更新来源标记
  const sourceTag = customer.updateSource
    ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:2px 8px;border-radius:4px;margin-left:8px;${
        customer.updateSource === 'API' ? 'background:#f0f5ff;color:#2f54eb;border:1px solid #adc6ff;' :
        customer.updateSource === '批量上传' ? 'background:#f9f0ff;color:#722ed1;border:1px solid #d3adf7;' :
        'background:#f5f5f5;color:#8c8c8c;border:1px solid #d9d9d9;'
      }">📌 ${customer.updateSource} ${customer.lastUpdateTime||''}</span>`
    : '';

  const content = `
    <div style="margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;">
      <div>当前状态：${renderStageBadge(reachCfg)} ${renderStageBadge(bizCfg)}</div>
      ${sourceTag}
    </div>

    <div style="display:flex;border-bottom:2px solid #f0f0f0;margin-bottom:16px;">
      <div class="status-modal-tab active" onclick="switchStatusTab(this,'reachTab')" style="padding:10px 20px;cursor:pointer;font-weight:600;font-size:14px;border-bottom:2px solid #1890ff;margin-bottom:-2px;color:#1890ff;">📞 营销阶段</div>
      <div class="status-modal-tab" onclick="switchStatusTab(this,'bizTab')" style="padding:10px 20px;cursor:pointer;font-weight:500;font-size:14px;color:#8c8c8c;margin-bottom:-2px;">🏦 业务阶段</div>
    </div>

    <!-- 营销阶段 Tab -->
    <div id="reachTab" class="status-tab-panel">
      <div class="form-group">
        <label class="form-label">更新营销阶段</label>
        <select class="form-select" id="newReachStage" onchange="onReachStageChange()">
          ${reachOptions}
        </select>
      </div>
      <div id="reachExtraFields">${renderStageFields(REACH_STAGE_FIELDS[customer.reachStage], customer.reachDetail)}</div>
      <div class="form-group">
        <label class="form-label">跟进备注</label>
        <textarea class="form-input" rows="2" id="reachRemark" placeholder="请输入跟进备注..." style="font-size:13px;"></textarea>
      </div>
    </div>

    <!-- 业务阶段 Tab -->
    <div id="bizTab" class="status-tab-panel" style="display:none;">
      <div class="form-group">
        <label class="form-label">更新业务阶段</label>
        <select class="form-select" id="newBizStage" onchange="onBizStageChange()">
          ${bizOptions}
        </select>
      </div>
      <div id="bizExtraFields">${renderStageFields(BIZ_STAGE_FIELDS[customer.bizStage], customer.bizDetail)}</div>

      <!-- 放款明细区域（仅 DISBURSED 时显示）-->
      <div id="loanSection" style="${customer.bizStage === 'DISBURSED' ? '' : 'display:none;'}margin-top:8px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <label class="form-label" style="margin:0;font-weight:600;">💰 放款明细（支持多笔）</label>
          <button class="btn btn-primary btn-sm" onclick="addDisbursementRow()" style="font-size:12px;">＋ 新增一笔</button>
        </div>
        <div style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;max-height:200px;overflow-y:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:12px;" id="loanTable">
            <thead><tr style="background:#fafafa;">
              <th style="padding:6px 8px;text-align:left;color:#8c8c8c;font-weight:500;">放款日期</th>
              <th style="padding:6px 8px;text-align:left;color:#8c8c8c;font-weight:500;">金额</th>
              <th style="padding:6px 8px;text-align:left;color:#8c8c8c;font-weight:500;">期限</th>
              <th style="padding:6px 8px;text-align:left;color:#8c8c8c;font-weight:500;">利率</th>
              <th style="padding:6px 8px;text-align:left;color:#8c8c8c;font-weight:500;">产品</th>
              <th style="padding:6px 8px;text-align:left;color:#8c8c8c;font-weight:500;">状态</th>
              <th style="padding:6px 8px;width:40px;"></th>
            </tr></thead>
            <tbody id="loanTableBody">${loanTableRows || '<tr><td colspan="7" style="padding:16px;text-align:center;color:#bfbfbf;">暂无放款记录</td></tr>'}</tbody>
          </table>
        </div>

        <!-- 新增放款行（默认隐藏）-->
        <div id="newLoanRow" style="display:none;margin-top:10px;padding:12px;background:#f0f5ff;border-radius:8px;border:1px dashed #91d5ff;">
          <div style="font-size:12px;font-weight:600;color:#1890ff;margin-bottom:8px;">📝 新增放款记录</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
            <div><label style="font-size:11px;color:#8c8c8c;">放款日期</label><input type="date" class="form-input" id="newLoanDate" style="font-size:12px;padding:4px 8px;"></div>
            <div><label style="font-size:11px;color:#8c8c8c;">金额(万)</label><input type="number" class="form-input" id="newLoanAmount" placeholder="如 100" style="font-size:12px;padding:4px 8px;"></div>
            <div><label style="font-size:11px;color:#8c8c8c;">期限</label><select class="form-select" id="newLoanTerm" style="font-size:12px;padding:4px 8px;"><option>3个月</option><option>6个月</option><option selected>12个月</option><option>24个月</option><option>36个月</option></select></div>
            <div><label style="font-size:11px;color:#8c8c8c;">利率</label><input type="text" class="form-input" id="newLoanRate" placeholder="如 4.85%" style="font-size:12px;padding:4px 8px;"></div>
            <div><label style="font-size:11px;color:#8c8c8c;">产品</label><select class="form-select" id="newLoanProduct" style="font-size:12px;padding:4px 8px;"><option>科技贷</option><option>税e融</option><option>供应链金融</option><option>其他</option></select></div>
            <div style="display:flex;align-items:flex-end;gap:6px;">
              <button class="btn btn-primary btn-sm" onclick="confirmAddLoan()" style="font-size:11px;">确认添加</button>
              <button class="btn btn-default btn-sm" onclick="cancelAddLoan()" style="font-size:11px;">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modalBody').innerHTML = content;
  document.getElementById('modalTitle').textContent = '更新状态 - ' + customer.name;

  // 替换 footer 按钮
  const footer = document.querySelector('#scriptModal .modal-footer');
  footer.innerHTML = `
    <button class="btn btn-default" onclick="closeModal('scriptModal')">取消</button>
    <button class="btn btn-primary" onclick="confirmStatusUpdate(${customerId})">✅ 保存更新</button>
  `;

  // 存储当前编辑的客户ID
  window._editingCustomerId = customerId;
  openModal('scriptModal');
}

// Tab 切换
function switchStatusTab(el, tabId) {
  document.querySelectorAll('.status-modal-tab').forEach(t => {
    t.style.borderBottom = '2px solid transparent';
    t.style.color = '#8c8c8c';
    t.classList.remove('active');
  });
  el.style.borderBottom = '2px solid #1890ff';
  el.style.color = '#1890ff';
  el.classList.add('active');
  document.querySelectorAll('.status-tab-panel').forEach(p => p.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

// 营销阶段下拉变化 → 动态渲染附加字段
function onReachStageChange() {
  const code = document.getElementById('newReachStage').value;
  const container = document.getElementById('reachExtraFields');
  container.innerHTML = renderStageFields(REACH_STAGE_FIELDS[code], {});
}

// 业务阶段下拉变化 → 动态渲染附加字段
function onBizStageChange() {
  const code = document.getElementById('newBizStage').value;
  const container = document.getElementById('bizExtraFields');
  container.innerHTML = renderStageFields(BIZ_STAGE_FIELDS[code], {});
  // 放款区域显隐
  document.getElementById('loanSection').style.display = code === 'DISBURSED' ? '' : 'none';
}

// 新增放款行展示
function addDisbursementRow() {
  document.getElementById('newLoanRow').style.display = 'block';
}
function cancelAddLoan() {
  document.getElementById('newLoanRow').style.display = 'none';
}

// 确认添加放款记录
function confirmAddLoan() {
  const date = document.getElementById('newLoanDate').value;
  const amount = document.getElementById('newLoanAmount').value;
  const term = document.getElementById('newLoanTerm').value;
  const rate = document.getElementById('newLoanRate').value;
  const product = document.getElementById('newLoanProduct').value;
  if (!date || !amount) { showToast('⚠️ 请填写放款日期和金额'); return; }

  const customer = getCustomerById(window._editingCustomerId);
  if (!customer.disbursements) customer.disbursements = [];
  customer.disbursements.push({
    id: 'D' + String(customer.disbursements.length + 1).padStart(3, '0'),
    amount: parseFloat(amount), date, term, rate: rate || '--', status: '正常', product
  });

  // 重新渲染弹窗
  showStatusModal(window._editingCustomerId);
  showToast('✅ 放款记录已添加');
}

// 删除放款记录
function removeDisbursement(index) {
  const customer = getCustomerById(window._editingCustomerId);
  if (customer.disbursements) {
    customer.disbursements.splice(index, 1);
    showStatusModal(window._editingCustomerId);
    showToast('🗑️ 放款记录已删除');
  }
}

// 确认保存状态更新
function confirmStatusUpdate(customerId) {
  const customer = getCustomerById(customerId);
  if (!customer) return;

  const newReach = document.getElementById('newReachStage').value;
  const newBiz = document.getElementById('newBizStage').value;

  customer.reachStage = newReach;
  customer.bizStage = newBiz;
  customer.updateSource = '手动';
  customer.lastUpdateTime = new Date().toLocaleString('zh-CN');

  // 同步旧 status 字段（向后兼容）
  const reachCfg = getReachStageConfig(newReach);
  if (newReach === 'PENDING') customer.status = '待触达';
  else if (newReach.startsWith('REACHED')) customer.status = '已触达';
  else customer.status = '待触达';
  if (newBiz === 'DISBURSED') customer.status = '已放款';

  closeModal('scriptModal');
  showToast('✅ 状态已更新');
  if (typeof filterCustomers === 'function') filterCustomers();
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
