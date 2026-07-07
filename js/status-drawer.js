/**
 * 状态标记抽屉公共组件 (适配 PC 端 Drawer)
 * 完全照搬移动端状态字段、两级联动及业务逻辑，保障三端统一。
 */

// ===== 核心数据字典 (从移动端完全迁移) =====
const MKT = [
  { code:'00', label:'待触达', subs:[{code:'01',label:'待触达', tags:[]}] },
  { code:'10', label:'触达失败', subs:[
      {code:'11',label:'号码无效 (空/错/停机)', tags:['号码有误','空号','停机']},
      {code:'12',label:'无人接听/未接通', tags:['未接通','无人接听','多次拨打无人接听']},
      {code:'13',label:'拒绝沟通/秒挂', tags:['挂断','拒接','接听后挂断']},
      {code:'14',label:'触达受阻/找错人', tags:['分机号','总机','前台']}
  ]},
  { code:'20', label:'无意向', subs:[
      {code:'21',label:'暂无资金需求', tags:['不需要贷款','无意向','暂时不需要']},
      {code:'22',label:'他行已营销', tags:['已有他行授信','有授信额度']},
      {code:'23',label:'条件不匹配', tags:['利息高','额度低','期限不合适']}
  ]},
  { code:'30', label:'跟进中', subs:[
      {code:'31',label:'意向沟通中', tags:['还需再了解下','处于摇摆期']},
      {code:'32',label:'待后续联系', tags:['有询问老板，后期再跟','现在忙稍后打','已留电话/加微信']},
      {code:'33',label:'待线下拜访', tags:['约见上门','待面谈']}
  ]},
  { code:'40', label:'有意向', subs:[
      {code:'41',label:'明确有意向', tags:['客户已口头同意','有意向待推进转化']}
  ]}
];

const L1_DISPLAY = {
  '00': { l:'待触达', c:'var(--brand-primary)', bg:'rgba(37,99,235,0.08)' },
  '10': { l:'触达失败', c:'var(--danger)', bg:'var(--danger-bg)' },
  '20': { l:'无意向', c:'var(--gray-500)', bg:'var(--gray-100)' },
  '30': { l:'跟进中', c:'var(--warning)', bg:'var(--warning-bg)' },
  '40': { l:'有意向', c:'var(--success)', bg:'var(--success-bg)' },
};

const BIZ_MAP = {
  NONE: { l:'' }, APPLIED: { l:'已申请' }, REVIEWING: { l:'审批中' },
  APPROVED: { l:'已授信' }, DISBURSED: { l:'已放款' }, SETTLED: { l:'已结清' }, REJECTED_BIZ: { l:'已拒绝' },
};

const REJECT_REASONS = [
  '征信不良','负债过高','经营年限不足','流水不达标',
  '抵押物不足','行业限制','资料不齐全','关联企业风险','法律诉讼/执行','其他'
];

let loanRecords = [];
let currentCompanyId = null;

// ===== DOM 初始化与注入 =====
function initStatusDrawer() {
  if (document.getElementById('statusDrawerOverlay')) return; // 已存在则不重复创建

  const drawerHTML = `
    <div class="drawer-overlay" id="statusDrawerOverlay" onclick="window.closeStatusDrawer()"></div>
    <div class="drawer-panel" id="statusDrawerPanel">
      <div class="drawer-header">
        <div>
          <div class="drawer-title">状态更新</div>
          <div class="drawer-company" id="statusDrawerCompany">—</div>
        </div>
        <button class="modal-close" onclick="window.closeStatusDrawer()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="drawer-body">
        <div class="mark-tabs">
          <div class="mark-tab active" onclick="sdTab(this,0)">营销状态</div>
          <div class="mark-tab" onclick="sdTab(this,1)">业务状态</div>
        </div>
        
        <!-- 隐式表单存储状态值 -->
        <input type="hidden" id="sd_fL1" value="00" />
        <input type="hidden" id="sd_fL2" value="01" />
        <input type="hidden" id="sd_fBiz" value="NONE" />

        <!-- 营销状态面板 -->
        <div class="mark-pane active" id="sdPane0">
          <div class="form-label">营销状态</div>
          <div class="chip-group" id="sd_fL1Group"></div>
          
          <div id="sd_l2Wrap" style="display:none; margin-top:16px;">
            <div class="form-label">详细情况</div>
            <div class="chip-group" id="sd_fL2Group"></div>
          </div>
          
          <div class="form-label" style="margin-top:16px;">营销跟进备注</div>
          <textarea class="form-textarea" id="sd_reachNote" placeholder="记录跟进情况、客户反馈、下一步计划..."></textarea>
          <div class="quick-tags" id="sd_quickTags"></div>
        </div>

        <!-- 业务状态面板 -->
        <div class="mark-pane" id="sdPane1">
          <div class="form-label">业务状态</div>
          <div class="chip-group" id="sd_fBizGroup">
            <div class="chip on" data-val="NONE" onclick="sdSelectBiz('NONE')">未申请</div>
            <div class="chip" data-val="APPLIED" onclick="sdSelectBiz('APPLIED')">已申请</div>
            <div class="chip" data-val="REVIEWING" onclick="sdSelectBiz('REVIEWING')">审批中</div>
            <div class="chip" data-val="APPROVED" onclick="sdSelectBiz('APPROVED')">已授信</div>
            <div class="chip" data-val="DISBURSED" onclick="sdSelectBiz('DISBURSED')">已放款</div>
            <div class="chip" data-val="SETTLED" onclick="sdSelectBiz('SETTLED')">已结清</div>
            <div class="chip" data-val="REJECTED_BIZ" onclick="sdSelectBiz('REJECTED_BIZ')">已拒绝</div>
          </div>
          
          <!-- 动态业务表单区域 -->
          <div id="sd_bizDynamic" style="margin-top:12px;"></div>

          <div class="form-label" style="margin-top:16px;">业务备注</div>
          <textarea class="form-textarea" id="sd_bizNote" placeholder="记录关键业务信息..."></textarea>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="drawer-btn cancel" onclick="window.closeStatusDrawer()">取消</button>
        <button class="drawer-btn save" onclick="sdSaveStatus()">保存</button>
      </div>
    </div>
  `;
  const container = document.createElement('div');
  container.innerHTML = drawerHTML;
  document.body.appendChild(container);
  
  // 初始化渲染
  sdRenderL1('00');
  sdSelectBiz('NONE');
}

// 确保 DOM 加载后初始化 (已移至文件末尾以支持动态加载)

// ===== 交互方法 =====
function sdTab(el, idx) {
  const tabs = document.querySelectorAll('#statusDrawerPanel .mark-tab');
  const panes = document.querySelectorAll('#statusDrawerPanel .mark-pane');
  tabs.forEach(t => t.classList.remove('active'));
  panes.forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('sdPane'+idx).classList.add('active');
}

function sdRenderL1(selected) {
  const g = document.getElementById('sd_fL1Group');
  if (!g) return;
  g.innerHTML = MKT.map(m =>
      `<div class="chip${m.code === selected ? ' on' : ''}" data-val="${m.code}" onclick="sdSelectL1('${m.code}')">${m.label}</div>`
  ).join('');
  document.getElementById('sd_fL1').value = selected;
  sdSelectL1(selected, true);
}

function sdSelectL1(code, skipHL) {
  document.getElementById('sd_fL1').value = code;
  if (!skipHL) {
    document.querySelectorAll('#sd_fL1Group .chip').forEach(el => el.classList.toggle('on', el.dataset.val === code));
  }
  
  const mkt = MKT.find(m => m.code === code);
  const l2w = document.getElementById('sd_l2Wrap');
  const l2g = document.getElementById('sd_fL2Group');
  
  if (mkt && mkt.subs.length > 1) {
      l2w.style.display = 'block';
      l2g.innerHTML = mkt.subs.map((s,i) => `<div class="chip${i===0?' on':''}" data-val="${s.code}" onclick="sdSelectL2('${code}','${s.code}')">${s.label}</div>`).join('');
      sdSelectL2(code, mkt.subs[0].code);
  } else if (mkt && mkt.subs.length === 1) {
      l2w.style.display = 'none';
      sdSelectL2(code, mkt.subs[0].code);
  } else {
      l2w.style.display = 'none';
      document.getElementById('sd_quickTags').innerHTML = '';
  }
}

function sdSelectL2(l1code, code) {
  document.getElementById('sd_fL2').value = code;
  document.querySelectorAll('#sd_fL2Group .chip').forEach(el => el.classList.toggle('on', el.dataset.val === code));
  
  const mkt = MKT.find(m => m.code === l1code);
  const sub = mkt ? mkt.subs.find(s => s.code === code) : null;
  const qt = document.getElementById('sd_quickTags');
  
  if (sub && sub.tags && sub.tags.length) {
      qt.innerHTML = sub.tags.map(t => `<div class="quick-tag" onclick="sdAppendTag(this,'${t}')">${t}</div>`).join('');
  } else {
      qt.innerHTML = '';
  }
}

function sdAppendTag(el, text) {
  const ta = document.getElementById('sd_reachNote');
  ta.value = ta.value ? ta.value + '；' + text : text;
  el.style.background = 'rgba(37,99,235,0.08)'; 
  el.style.color = 'var(--brand-primary)'; 
  el.style.borderColor = 'rgba(37,99,235,0.2)';
}

function sdSelectBiz(val) {
  document.getElementById('sd_fBiz').value = val;
  document.querySelectorAll('#sd_fBizGroup .chip').forEach(el => el.classList.toggle('on', el.dataset.val === val));
  sdRenderBizDynamic(val);
}

function sdRenderBizDynamic(val) {
  const box = document.getElementById('sd_bizDynamic');
  if (!box) return;
  if (val === 'APPLIED') {
      box.innerHTML = `<div class="dyn-box"><div class="dyn-row"><div class="dyn-field"><label>申请日期 (选填)</label><input type="date" id="sd_applyDate" class="form-input" style="padding:4px 8px; font-size:13px; margin-top:4px; border:1px solid var(--border); border-radius:6px;"></div></div></div>`;
  } else if (val === 'APPROVED') {
      box.innerHTML = `<div class="dyn-box"><div class="dyn-row"><div class="dyn-field"><label>授信金额 (万元)</label><input type="number" id="sd_creditAmt" placeholder="选填" class="form-input" style="padding:4px 8px; font-size:13px; margin-top:4px; border:1px solid var(--border); border-radius:6px;"></div><div class="dyn-field"><label>授信日期 (选填)</label><input type="date" id="sd_creditDate" class="form-input" style="padding:4px 8px; font-size:13px; margin-top:4px; border:1px solid var(--border); border-radius:6px;"></div></div></div>`;
  } else if (val === 'DISBURSED') {
      box.innerHTML = `<div class="dyn-box">
          <div class="dyn-row"><div class="dyn-field"><label>放款金额 (万元)</label><input type="number" id="sd_loanAmt" placeholder="请输入" class="form-input" style="padding:4px 8px; font-size:13px; margin-top:4px; border:1px solid var(--border); border-radius:6px; width:90px;"></div><div class="dyn-field"><label>放款日期</label><input type="date" id="sd_loanDate" class="form-input" style="padding:4px 8px; font-size:13px; margin-top:4px; border:1px solid var(--border); border-radius:6px; width:120px;"></div></div>
          <button class="loan-add-btn" onclick="sdAddLoan()" style="background:#fff; border:1px dashed var(--brand); color:var(--brand); padding:6px 12px; border-radius:6px; font-size:13px; cursor:pointer; margin-top:8px; display:flex; align-items:center; gap:4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>添加放款记录</button>
          <div class="loan-list" id="sd_loanList" style="margin-top:12px;">${sdRenderLoans()}</div></div>`;
  } else if (val === 'SETTLED') {
      box.innerHTML = `<div class="dyn-box"><div class="dyn-row"><div class="dyn-field"><label>结清日期 (选填)</label><input type="date" id="sd_settleDate" class="form-input" style="padding:4px 8px; font-size:13px; margin-top:4px; border:1px solid var(--border); border-radius:6px;"></div></div></div>`;
  } else if (val === 'REJECTED_BIZ') {
      box.innerHTML = `<div class="dyn-box"><div class="form-label" style="font-size:13px;margin-bottom:8px;">拒绝原因</div>
          <div class="chip-group" id="sd_rejectGroup" style="flex-wrap:wrap;">${REJECT_REASONS.map(r => `<div class="chip" data-val="${r}" onclick="sdToggleReject(this)">${r}</div>`).join('')}</div></div>`;
  } else { box.innerHTML = ''; }
}

function sdToggleReject(el) { el.classList.toggle('on'); }

function sdAddLoan() {
  const amt = document.getElementById('sd_loanAmt'), dt = document.getElementById('sd_loanDate');
  if (!amt.value) { sdShowToast('请输入放款金额'); return; }
  loanRecords.push({ amt: amt.value, date: dt.value || '未填写', id: Date.now() });
  amt.value = ''; dt.value = '';
  document.getElementById('sd_loanList').innerHTML = sdRenderLoans();
}

function sdRenderLoans() {
  return loanRecords.map((ln,i) => `<div class="loan-item" style="display:flex; justify-content:space-between; align-items:center; background:#f9fafb; padding:8px 12px; border-radius:6px; margin-bottom:8px; border:1px solid var(--border);">
      <div class="loan-info" style="font-size:13px; font-weight:600;"><span style="color:var(--gray-900); margin-right:8px;">${ln.amt}万</span><span style="color:var(--gray-400); font-weight:400;">${ln.date}</span></div>
      <div class="loan-acts" style="display:flex; gap:8px;">
          <button class="edit-btn" onclick="sdEditLoan(${i})" style="background:none; border:none; cursor:pointer; color:var(--gray-400);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="del-btn" onclick="sdDelLoan(${i})" style="background:none; border:none; cursor:pointer; color:var(--danger);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
      </div></div>`).join('');
}

function sdDelLoan(i) { loanRecords.splice(i, 1); document.getElementById('sd_loanList').innerHTML = sdRenderLoans(); }
function sdEditLoan(i) {
  const ln = loanRecords[i];
  document.getElementById('sd_loanAmt').value = ln.amt;
  document.getElementById('sd_loanDate').value = ln.date === '未填写' ? '' : ln.date;
  loanRecords.splice(i, 1);
  document.getElementById('sd_loanList').innerHTML = sdRenderLoans();
}

function sdShowToast(msg) {
  let el = document.getElementById('wb_toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'wb_toast';
    el.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:10px 20px; border-radius:8px; font-size:14px; z-index:9999; display:none;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 2000);
}

// ===== 外部接口 =====
window.openStatusDrawer = function(companyId = null, companyName = '公司名称', initMkt = '00', initBiz = 'NONE') {
  initStatusDrawer(); // 安全保障
  
  currentCompanyId = companyId;
  const overlay = document.getElementById('statusDrawerOverlay');
  const panel = document.getElementById('statusDrawerPanel');
  const nameEl = document.getElementById('statusDrawerCompany');
  
  if (nameEl) nameEl.textContent = companyName;
  
  // 重置
  document.getElementById('sd_reachNote').value = '';
  document.getElementById('sd_bizNote').value = '';
  loanRecords = [];
  sdRenderL1(initMkt);
  sdSelectBiz(initBiz);
  sdTab(document.querySelector('#statusDrawerPanel .mark-tab'), 0); // 默认营销状态Tab

  overlay.classList.add('show');
  panel.classList.add('show');
  document.body.style.overflow = 'hidden';
};

window.closeStatusDrawer = function() {
  const overlay = document.getElementById('statusDrawerOverlay');
  const panel = document.getElementById('statusDrawerPanel');
  if (overlay) overlay.classList.remove('show');
  if (panel) panel.classList.remove('show');
  document.body.style.overflow = '';
};

// 保存状态 (供外部劫持回调或默认执行)
function sdSaveStatus() {
  let l1 = document.getElementById('sd_fL1').value;
  const bsVal = document.getElementById('sd_fBiz').value;

  // 自动晋升纠错
  if (bsVal !== 'NONE' && bsVal !== 'REJECTED_BIZ' && (l1 === '00' || l1 === '10')) {
      l1 = '40';
      sdSelectL1('40'); 
  }

  const rs = L1_DISPLAY[l1] || L1_DISPLAY['00'];
  const bs = BIZ_MAP[bsVal] || BIZ_MAP.NONE;
  
  // 在详情页如果有特定的更新钩子，可以在这里扩展，或者外部统一刷新
  // 为简单起见，如果存在 detailStatus 元素，则自动更新
  const badge = document.getElementById('pageStatus');
  if (badge) {
      if (bsVal === 'DISBURSED') {
          badge.textContent = '已放款';
          badge.style.background = 'var(--info-bg)';
          badge.style.color = 'var(--info)';
      } else if (bsVal === 'SETTLED') {
          badge.textContent = '已结清';
          badge.style.background = 'var(--gray-100)';
          badge.style.color = 'var(--gray-500)';
      } else if (bsVal === 'REJECTED_BIZ') {
          badge.textContent = '审批拒绝';
          badge.style.background = 'var(--danger-bg)';
          badge.style.color = 'var(--danger)';
      } else {
          const label = bs.l ? `${rs.l} · ${bs.l}` : rs.l;
          badge.textContent = label;
          badge.style.background = rs.bg;
          badge.style.color = rs.c;
      }
  }

  sdShowToast('✓ 状态已保存');
  window.closeStatusDrawer();
  
  if (typeof window.onStatusSaved === 'function') {
      window.onStatusSaved(l1, bsVal, document.getElementById('sd_reachNote').value, document.getElementById('sd_bizNote').value);
  } else if (typeof window.refreshCurrentData === 'function') {
      window.refreshCurrentData();
  }
}

// ===== 注入必要的通用 CSS =====
function injectDrawerStyles() {
  if (document.getElementById('statusDrawerStyles')) return;
  const style = document.createElement('style');
  style.id = 'statusDrawerStyles';
  style.textContent = `
    .drawer-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 1000;
      display: none;
      justify-content: flex-end;
      backdrop-filter: blur(3px);
    }
    .drawer-overlay.show { display: flex; animation: fadeIn 0.2s ease; }
    .drawer-panel {
      position: fixed;
      right: -480px;
      top: 0;
      bottom: 0;
      width: 440px;
      background: var(--bg-card, #fff);
      z-index: 1001;
      box-shadow: -8px 0 40px rgba(0,0,0,0.12);
      transition: right 0.3s cubic-bezier(0.4,0,0.2,1);
      display: flex;
      flex-direction: column;
    }
    .drawer-panel.show { right: 0; }
    .drawer-header {
      padding: 22px 24px 18px;
      border-bottom: 1px solid var(--border, #f3f4f6);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .drawer-title { font-size: 17px; font-weight: 700; color: var(--gray-900, #111827); }
    .drawer-company { font-size: 13px; color: var(--gray-500, #6b7280); margin-top: 3px; }
    .drawer-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
    .drawer-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border, #f3f4f6);
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }
    .drawer-btn {
      flex: 1;
      padding: 12px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .drawer-btn.cancel { background: var(--gray-100, #f3f4f6); color: var(--gray-600, #4b5563); }
    .drawer-btn.cancel:hover { background: var(--gray-200, #e5e7eb); }
    .drawer-btn.save { background: var(--brand, #2563eb); color: white; box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
    .drawer-btn.save:hover { background: #1d4ed8; }

    /* 状态标记 Tabs */
    .mark-tabs {
      display: flex;
      background: var(--gray-100, #f3f4f6);
      border-radius: 10px;
      padding: 3px;
      margin-bottom: 20px;
    }
    .mark-tab {
      flex: 1;
      text-align: center;
      padding: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--gray-500, #6b7280);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mark-tab.active {
      background: white;
      color: var(--brand, #2563eb);
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .mark-pane { display: none; }
    .mark-pane.active { display: block; }

    /* Chip 组 */
    .chip-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 6px;
    }
    .chip {
      padding: 7px 14px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      border: 1.5px solid var(--gray-200, #e5e7eb);
      background: var(--gray-50, #f9fafb);
      color: var(--gray-600, #4b5563);
      cursor: pointer;
      transition: all 0.2s;
    }
    .chip:hover { border-color: var(--brand, #2563eb); color: var(--brand, #2563eb); }
    .chip.on {
      border-color: var(--brand, #2563eb);
      background: var(--brand-light, #eff6ff);
      color: var(--brand, #2563eb);
      font-weight: 700;
    }
    .form-label {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--gray-800, #1f2937);
      margin-bottom: 12px;
      margin-top: 20px;
    }
    .form-label:first-child { margin-top: 0; }
    .form-textarea {
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1.5px solid var(--gray-200, #e5e7eb);
      font-size: 13.5px;
      color: var(--gray-800, #1f2937);
      resize: vertical;
      min-height: 80px;
      transition: border-color 0.2s;
      font-family: inherit;
      box-sizing: border-box;
    }
    .form-textarea:focus { outline: none; border-color: var(--brand, #2563eb); }
    .quick-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .quick-tag {
      padding: 4px 10px;
      background: var(--gray-100, #f3f4f6);
      border-radius: 6px;
      font-size: 12px;
      color: var(--gray-600, #4b5563);
      cursor: pointer;
      transition: all 0.15s;
    }
    .quick-tag:hover { background: var(--brand-light, #eff6ff); color: var(--brand, #2563eb); }
    
    .modal-close {
      width: 32px; height: 32px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--gray-500, #6b7280);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }
    .modal-close:hover { background: var(--gray-200, #e5e7eb); }
  `;
  document.head.appendChild(style);
}
// 立即执行注入样式，避免因脚本在 body 底部加载导致 DOMContentLoaded 已错失
injectDrawerStyles();

// 确保 DOM 初始化逻辑如果在 DOM 已加载完成时也立刻执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStatusDrawer);
} else {
  initStatusDrawer();
}
