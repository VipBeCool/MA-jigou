#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
替换 agents.html 中的 JS 函数区域：
- 删除旧的 renderBatches/renderWhitelist/renderLogs 等
- 保留并修正 LOGS_DATA, INDICATOR_LIB, STATUS_MAP
- 插入新的 filterAgentList/renderAgentGrid/openAgentDetail/switchDrawerTab/renderDrawer* 等
- 修改初始化调用为 renderAgentGrid()
"""
import re

with open('agents.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 新的 JS 函数块（从 STATUS_MAP 之后的部分）
NEW_JS_BLOCK = r"""
const STATUS_MAP = { running:{cls:'tag-green',text:'运行中'}, paused:{cls:'tag-amber',text:'已暂停'}, draft:{cls:'tag-gray',text:'草稿'} };

/* ---- 主列表：全宽卡片渲染 ---- */
function filterAgentList() {
  const q = document.getElementById('agentSearch').value.toLowerCase();
  const org = document.getElementById('agentOrgFilter').value;
  const status = document.getElementById('agentStatusFilter').value;
  const filtered = AGENTS_DATA.filter(a =>
    (!q || (a.name + a.orgShort).toLowerCase().includes(q)) &&
    (!org || a.orgShort === org) &&
    (!status || a.status === status)
  );
  renderAgentGrid(filtered);
}

function renderAgentGrid(list) {
  if (!list) list = AGENTS_DATA;
  const s = STATUS_MAP;
  const colorMap = { running:['#2563eb','#eff6ff'], paused:['#d97706','#fffbeb'], draft:['#9ca3af','#f3f4f6'] };
  const freqLabel = { daily:'按天', weekly:'按周', monthly:'按月', manual:'手动触发' };
  const el = document.getElementById('agentCount');
  if (el) el.textContent = '共 ' + list.length + ' 个智能体';
  const grid = document.getElementById('agentGrid');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--gray-400);font-size:14px;">未找到匹配的智能体</div>';
    return;
  }
  grid.innerHTML = list.map(function(a) {
    const c = colorMap[a.status][0], bg = colorMap[a.status][1];
    const statusBtn = a.status === 'running'
      ? '<button class="btn btn-default btn-sm" onclick="event.stopPropagation();showToast(\'' + a.orgShort + '·' + a.name + ' 已暂停\')"> 暂停</button>'
      : a.status === 'paused'
      ? '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();showToast(\'' + a.orgShort + '·' + a.name + ' 已启动\',\'success\')"> 启动</button>'
      : '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();showToast(\'正在部署...\')"> 部署</button>';
    return '<div class="agent-main-card ' + a.status + '">' +
      '<div class="amc-icon" style="background:' + bg + ';color:' + c + ';">' +
        '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>' +
      '</div>' +
      '<div class="amc-body">' +
        '<div class="amc-title">' + a.orgShort + ' &nbsp;&middot;&nbsp; ' + a.name +
          '<span class="tag ' + s[a.status].cls + '">' + s[a.status].text + '</span>' +
        '</div>' +
        '<div class="amc-sub">' + a.org + ' &nbsp;&middot;&nbsp; ' + a.type + ' &nbsp;&middot;&nbsp; 辖区：' + a.region +
          ' &nbsp;&middot;&nbsp; ' + (freqLabel[a.freq] || '按周') + '更新 &nbsp;&middot;&nbsp; ' + (a.whitelist ? '白名单已启用' : '不启用白名单') + '</div>' +
        '<div class="amc-stats">' +
          '<div class="amc-stat"><div class="sv" style="color:#2563eb;">' + a.totalBatches + '</div><div class="sk">已输出批次</div></div>' +
          '<div class="amc-stat"><div class="sv">' + (a.totalOutput > 0 ? a.totalOutput.toLocaleString() : '—') + '</div><div class="sk">累计输出客户</div></div>' +
          '<div class="amc-stat"><div class="sv">' + (a.thisMonth > 0 ? a.thisMonth : '—') + '</div><div class="sk">本月新增</div></div>' +
          '<div class="amc-stat"><div class="sv" style="font-size:13px;color:var(--gray-500);">' + (a.lastRun || '—') + '</div><div class="sk">上次执行</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="amc-actions">' +
        '<div style="display:flex;gap:6px;align-items:center;">' +
          statusBtn +
          '<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openWizard(\'' + a.id + '\')" style="display:inline-flex;align-items:center;gap:4px;">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0;display:block;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>编辑' +
          '</button>' +
          '<button class="btn btn-default btn-sm" onclick="openAgentDetail(\'' + a.id + '\')" style="display:inline-flex;align-items:center;gap:4px;">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0;display:block;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>详情' +
          '</button>' +
        '</div>' +
        '<div class="amc-rule-hint">' + a.totalBatches + '个批次 &middot; 输出上限 ' + a.outputLimit + '户/批</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ---- 详情抽屉 ---- */
var currentDrawerAgentId = null;
var currentDrawerTab = 'batches';

function openAgentDetail(agentId) {
  currentDrawerAgentId = agentId;
  currentDrawerTab = 'batches';
  const a = AGENTS_DATA.find(function(x) { return x.id === agentId; });
  if (!a) return;
  const colorMap = { running:['#2563eb','#eff6ff'], paused:['#d97706','#fffbeb'], draft:['#9ca3af','#f3f4f6'] };
  const c = colorMap[a.status][0], bg = colorMap[a.status][1];
  const freqLabel = { daily:'按天', weekly:'按周', monthly:'按月', manual:'手动触发' };
  document.getElementById('drawerAgentInfo').innerHTML =
    '<div style="display:flex;align-items:center;gap:14px;flex:1;">' +
      '<div class="detail-drawer-icon" style="background:' + bg + ';color:' + c + ';">' +
        '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>' +
      '</div>' +
      '<div>' +
        '<div style="font-size:16px;font-weight:700;color:var(--gray-900);display:flex;align-items:center;gap:8px;">' + a.orgShort + ' &nbsp;&middot;&nbsp; ' + a.name +
          '<span class="tag ' + STATUS_MAP[a.status].cls + '">' + STATUS_MAP[a.status].text + '</span>' +
        '</div>' +
        '<div style="font-size:12.5px;color:var(--gray-500);margin-top:2px;">' + a.org + ' &nbsp;&middot;&nbsp; ' + a.type + ' &nbsp;&middot;&nbsp; 辖区：' + a.region + ' &nbsp;&middot;&nbsp; ' + (freqLabel[a.freq] || '按周') + '更新</div>' +
      '</div>' +
    '</div>' +
    '<button class="modal-close" onclick="closeModal(\'detailDrawer\')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
  document.querySelectorAll('#drawerTabs .detail-tab').forEach(function(t, i) { t.classList.toggle('active', i === 0); });
  ['batches','whitelist','logs'].forEach(function(t) {
    document.getElementById('dtab-' + t).style.display = t === 'batches' ? 'block' : 'none';
  });
  renderDrawerBatches();
  document.getElementById('detailDrawer').classList.add('show');
}

function switchDrawerTab(tab, el) {
  document.querySelectorAll('#drawerTabs .detail-tab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  ['batches','whitelist','logs'].forEach(function(t) {
    document.getElementById('dtab-' + t).style.display = t === tab ? 'block' : 'none';
  });
  currentDrawerTab = tab;
  if (tab === 'batches') renderDrawerBatches();
  if (tab === 'whitelist') renderDrawerWhitelist();
  if (tab === 'logs') renderDrawerLogs();
}

function renderDrawerBatches() {
  const list = BATCHES_DATA.filter(function(b) { return b.agentId === currentDrawerAgentId; });
  document.getElementById('dtab-batches').innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">' +
      '<div style="font-size:13.5px;font-weight:700;color:var(--gray-900);">名单批次（共 ' + list.length + ' 批）</div>' +
      '<button class="btn btn-default btn-sm" onclick="openImportModal()" style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;flex-shrink:0;display:block;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>手工导入' +
      '</button>' +
    '</div>' +
    '<div class="card" style="padding:0;overflow:hidden;">' +
      '<table class="table" style="margin-bottom:0;">' +
        '<thead><tr><th>批次名称</th><th>来源</th><th>客户数</th><th>生成时间</th><th>状态</th><th>操作</th></tr></thead>' +
        '<tbody>' +
        (list.length ? list.map(function(b) {
          return '<tr>' +
            '<td><div style="font-weight:600;color:var(--gray-900);font-size:13.5px;">' + b.name + '</div></td>' +
            '<td><span class="batch-source-tag ' + (b.source === 'auto' ? 'auto' : 'manual') + '">' + (b.source === 'auto' ? '系统生成' : '手工导入') + '</span></td>' +
            '<td><strong>' + b.count + '</strong> <span style="color:var(--gray-400);font-size:12px;">户</span></td>' +
            '<td style="color:var(--gray-500);font-size:13px;">' + b.time + '</td>' +
            '<td><span class="tag ' + (b.status === '已分配' ? 'tag-green' : b.status === '分配中' ? 'tag-blue' : 'tag-gray') + '">' + b.status + '</span></td>' +
            '<td><div style="display:flex;gap:6px;">' +
              '<button class="btn btn-ghost btn-sm">查看</button>' +
              '<button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;">' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0;display:block;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>导出' +
              '</button>' +
            '</div></td>' +
          '</tr>';
        }).join('') : '<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--gray-400)">暂无批次数据</td></tr>') +
        '</tbody></table></div>';
}

function renderDrawerWhitelist() {
  const list = WHITELIST_DATA.filter(function(w) { return w.agentId === currentDrawerAgentId; });
  document.getElementById('dtab-whitelist').innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">' +
      '<div><div style="font-size:13.5px;font-weight:700;color:var(--gray-900);">白名单快照历史</div>' +
        '<div style="font-size:12px;color:var(--gray-400);margin-top:2px;">全量过筛后符合条件的企业快照，可下载发送给银行用于对账分润</div></div>' +
      '<button class="btn btn-primary btn-sm" onclick="showToast(\'正在生成白名单快照，预计 5 分钟完成…\')"> 立即生成快照</button>' +
    '</div>' +
    (list.length ? list.map(function(w) {
      return '<div class="snapshot-item">' +
        '<div class="snap-icon"><svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:14px;font-weight:700;color:var(--gray-900);">版本 ' + w.version + '</div>' +
          '<div style="font-size:12.5px;color:var(--gray-500);margin-top:2px;">生成时间：' + w.genTime + ' &nbsp;&middot;&nbsp; 企业数：<strong style="color:var(--gray-900);">' + w.count.toLocaleString() + '</strong> 户</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">' +
          '<span class="tag ' + (w.status === '已同步银行' ? 'tag-green' : w.status === '待同步' ? 'tag-amber' : 'tag-gray') + '">' + w.status + '</span>' +
          '<div style="display:flex;gap:6px;">' +
            '<button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;">' +
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0;display:block;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载 Excel' +
            '</button>' +
            (w.status === '待同步' ? '<button class="btn btn-primary btn-sm" onclick="showToast(\'已标记为已同步银行\', \'success\')"> 标记已同步</button>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('') : '<div style="text-align:center;padding:40px;color:var(--gray-400)">暂无白名单快照</div>');
}

function renderDrawerLogs() {
  const list = LOGS_DATA.filter(function(l) { return l.agentId === currentDrawerAgentId; });
  document.getElementById('dtab-logs').innerHTML =
    '<div class="card" style="padding:0;overflow:hidden;">' +
      '<div style="padding:14px 18px;border-bottom:1px solid var(--gray-100);display:flex;align-items:center;justify-content:space-between;">' +
        '<h3 style="font-size:14px;font-weight:700;color:var(--gray-900);">执行日志（' + list.length + ' 条）</h3>' +
        '<button class="btn btn-ghost btn-sm">查看全部</button>' +
      '</div>' +
      (list.length ? list.map(function(l) {
        return '<div class="log-row">' +
          '<div class="log-time">' + l.time + '</div>' +
          '<div class="log-dot ' + l.status + '"></div>' +
          '<div class="log-detail"><strong>' + l.action + '</strong>：' + l.detail + '</div>' +
          '<div class="log-count" style="color:' + (l.count.startsWith('+') ? '#2563eb' : 'var(--gray-400)') + '">' + l.count + '</div>' +
        '</div>';
      }).join('') : '<div style="text-align:center;padding:30px;color:var(--gray-400)">暂无日志</div>') +
    '</div>';
}

"""

# 找到 INDICATOR_LIB 数组结束后的位置（纳税信用等级后面开始有乱码，我们从INDICATOR_LIB完全重写）
# 策略：找到 "const STATUS_MAP" 后的所有旧JS到 "/* ---- 向导 ----" 之前，全部替换

# 方案：用正则将 STATUS_MAP 行之前的所有这些函数（从INDICATOR_LIB最后一条到向导之前）替换掉
# 先删除 INDICATOR_LIB 中乱码的行，重建完整的 INDICATOR_LIB

# 更简单的方案：替换整个 "const LOGS_DATA..." 到 "/* ---- 向导 ---- */" 之间的内容

NEW_DATA_AND_FUNCS = r"""
const LOGS_DATA = [
  { agentId:'a1', time:'06:18', agent:'平安橙业贷', action:'定时任务执行完成', detail:'命中3,842家，输出298户（上限300）', count:'+298', status:'success' },
  { agentId:'a2', time:'06:14', agent:'招行厂房贷', action:'定时任务执行完成', detail:'命中1,204家，输出204户（上限200）', count:'+204', status:'success' },
  { agentId:'a1', time:'14:30', agent:'平安橙业贷', action:'手工导入完成', detail:'导入82条，白名单校验：80通过 / 2超范围已标记', count:'+82', status:'warn' },
  { agentId:'a3', time:'06:00', agent:'农行惠农贷', action:'任务已暂停跳过', detail:'智能体处于暂停状态，本次定时任务跳过', count:'—', status:'warn' },
  { agentId:'a1', time:'昨日', agent:'平安橙业贷', action:'白名单快照生成', detail:'全量过筛完成，白名单3,842户，版本 v2026-06，可下载', count:'3842', status:'success' },
  { agentId:'a4', time:'昨日', agent:'江苏科创贷', action:'草稿未部署', detail:'智能体为草稿状态，规则未完善，定时任务未激活', count:'—', status:'error' },
];

const INDICATOR_LIB = [
  { label:'营业收入', field:'revenueAmt', unit:'万元', type:'number' },
  { label:'注册资本', field:'regCapi', unit:'万元', type:'number' },
  { label:'成立年限', field:'establishPeriod', unit:'年', type:'number' },
  { label:'从业人数', field:'employeeNum', unit:'人', type:'number' },
  { label:'当前贷款笔数', field:'nCurrLoan', unit:'笔', type:'number' },
  { label:'贷款银行数', field:'nCurrOrg', unit:'家', type:'number' },
  { label:'工商变更次数(近6月)', field:'changeCorpOperManCnt6m', unit:'次', type:'number' },
  { label:'贷销比', field:'rLoanSale', unit:'[0~1]', type:'number' },
  { label:'房地产数量', field:'houseLandCnt', unit:'处', type:'number' },
  { label:'主体划型', field:'entity_type', unit:'', type:'enum', options:['是小微企业','不是小微企业'] },
  { label:'实体类型', field:'entityTypeCd', unit:'', type:'enum', options:['法人企业','个体工商户','农民专业合作社','其他'] },
  { label:'企业状态', field:'corpStatusCd', unit:'', type:'enum', options:['在业','迁出','撤销','注销','其他'] },
  { label:'纳税信用等级', field:'taxLevelCd', unit:'', type:'enum', options:['A级','B级','M级','其他'] },
  { label:'贷款状态', field:'worstLoanStatusCd', unit:'', type:'enum', options:['正常','关注','不良'] },
  { label:'环保评级', field:'envLevelCd', unit:'', type:'enum', options:['绿色','蓝色','黄色','红色','黑色','无评级'] },
  { label:'无贷户', field:'hasLoanHistory', unit:'', type:'enum', options:['是无贷户','非无贷户'] },
  { label:'特色认证', field:'corpCertificate', unit:'', type:'multi', options:['专精特新企业','专精特新小巨人企业','高新技术企业'] },
  { label:'失信信息', field:'dishonestExecutorFlag', unit:'', type:'bool', options:['有失信信息','无失信信息'] },
  { label:'行政处罚', field:'adminPunishFlag', unit:'', type:'bool', options:['有行政处罚','无行政处罚'] },
  { label:'经营异常', field:'manageAbnormalFlag', unit:'', type:'bool', options:['有经营异常','无经营异常'] },
  { label:'股权出质', field:'equityPledgeFlag', unit:'', type:'bool', options:['有股权出质','无股权出质'] },
  { label:'海关注册', field:'customsRegFlag', unit:'', type:'bool', options:['有海关注册信息','无海关注册信息'] },
  { label:'授权状态', field:'jfAuthFlag', unit:'', type:'bool', options:['已授权','未授权'] },
  { label:'被执行人', field:'executorFlag', unit:'', type:'bool', options:['是被执行人','非被执行人'] },
  { label:'行业分类', field:'belongTradeCd', unit:'国民经济行业代码', type:'text' },
];

const STATUS_MAP = { running:{cls:'tag-green',text:'运行中'}, paused:{cls:'tag-amber',text:'已暂停'}, draft:{cls:'tag-gray',text:'草稿'} };

/* ---- 主列表：全宽卡片渲染 ---- */
function filterAgentList() {
  const q = document.getElementById('agentSearch').value.toLowerCase();
  const org = document.getElementById('agentOrgFilter').value;
  const status = document.getElementById('agentStatusFilter').value;
  const filtered = AGENTS_DATA.filter(a =>
    (!q || (a.name + a.orgShort).toLowerCase().includes(q)) &&
    (!org || a.orgShort === org) &&
    (!status || a.status === status)
  );
  renderAgentGrid(filtered);
}

function renderAgentGrid(list) {
  if (!list) list = AGENTS_DATA;
  const s = STATUS_MAP;
  const colorMap = { running:['#2563eb','#eff6ff'], paused:['#d97706','#fffbeb'], draft:['#9ca3af','#f3f4f6'] };
  const freqLabel = { daily:'按天', weekly:'按周', monthly:'按月', manual:'手动触发' };
  const el = document.getElementById('agentCount');
  if (el) el.textContent = '共 ' + list.length + ' 个智能体';
  const grid = document.getElementById('agentGrid');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--gray-400);font-size:14px;">未找到匹配的智能体</div>';
    return;
  }
  grid.innerHTML = list.map(function(a) {
    const c = colorMap[a.status][0], bg = colorMap[a.status][1];
    const statusBtn = a.status === 'running'
      ? '<button class="btn btn-default btn-sm" onclick="event.stopPropagation();showToast(\'' + a.orgShort + '·' + a.name + ' 已暂停\')"> 暂停</button>'
      : a.status === 'paused'
      ? '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();showToast(\'' + a.orgShort + '·' + a.name + ' 已启动\',\'success\')"> 启动</button>'
      : '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();showToast(\'正在部署...\')"> 部署</button>';
    return '<div class="agent-main-card ' + a.status + '">' +
      '<div class="amc-icon" style="background:' + bg + ';color:' + c + ';">' +
        '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>' +
      '</div>' +
      '<div class="amc-body">' +
        '<div class="amc-title">' + a.orgShort + ' &nbsp;&middot;&nbsp; ' + a.name +
          '<span class="tag ' + s[a.status].cls + '">' + s[a.status].text + '</span>' +
        '</div>' +
        '<div class="amc-sub">' + a.org + ' &nbsp;&middot;&nbsp; ' + a.type + ' &nbsp;&middot;&nbsp; 辖区：' + a.region +
          ' &nbsp;&middot;&nbsp; ' + (freqLabel[a.freq] || '按周') + '更新 &nbsp;&middot;&nbsp; ' + (a.whitelist ? '白名单已启用' : '不启用白名单') + '</div>' +
        '<div class="amc-stats">' +
          '<div class="amc-stat"><div class="sv" style="color:#2563eb;">' + a.totalBatches + '</div><div class="sk">已输出批次</div></div>' +
          '<div class="amc-stat"><div class="sv">' + (a.totalOutput > 0 ? a.totalOutput.toLocaleString() : '—') + '</div><div class="sk">累计输出客户</div></div>' +
          '<div class="amc-stat"><div class="sv">' + (a.thisMonth > 0 ? a.thisMonth : '—') + '</div><div class="sk">本月新增</div></div>' +
          '<div class="amc-stat"><div class="sv" style="font-size:13px;color:var(--gray-500);">' + (a.lastRun || '—') + '</div><div class="sk">上次执行</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="amc-actions">' +
        '<div style="display:flex;gap:6px;align-items:center;">' +
          statusBtn +
          '<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openWizard(\'' + a.id + '\')" style="display:inline-flex;align-items:center;gap:4px;">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0;display:block;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>编辑' +
          '</button>' +
          '<button class="btn btn-default btn-sm" onclick="openAgentDetail(\'' + a.id + '\')" style="display:inline-flex;align-items:center;gap:4px;">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0;display:block;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>详情' +
          '</button>' +
        '</div>' +
        '<div class="amc-rule-hint">' + a.totalBatches + '个批次 &middot; 输出上限 ' + a.outputLimit + '户/批</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ---- 详情抽屉 ---- */
var currentDrawerAgentId = null;
var currentDrawerTab = 'batches';

function openAgentDetail(agentId) {
  currentDrawerAgentId = agentId;
  currentDrawerTab = 'batches';
  const a = AGENTS_DATA.find(function(x) { return x.id === agentId; });
  if (!a) return;
  const colorMap = { running:['#2563eb','#eff6ff'], paused:['#d97706','#fffbeb'], draft:['#9ca3af','#f3f4f6'] };
  const c = colorMap[a.status][0], bg = colorMap[a.status][1];
  const freqLabel = { daily:'按天', weekly:'按周', monthly:'按月', manual:'手动触发' };
  document.getElementById('drawerAgentInfo').innerHTML =
    '<div style="display:flex;align-items:center;gap:14px;flex:1;">' +
      '<div class="detail-drawer-icon" style="background:' + bg + ';color:' + c + ';">' +
        '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>' +
      '</div>' +
      '<div>' +
        '<div style="font-size:16px;font-weight:700;color:var(--gray-900);display:flex;align-items:center;gap:8px;">' + a.orgShort + ' &nbsp;&middot;&nbsp; ' + a.name +
          '<span class="tag ' + STATUS_MAP[a.status].cls + '">' + STATUS_MAP[a.status].text + '</span>' +
        '</div>' +
        '<div style="font-size:12.5px;color:var(--gray-500);margin-top:2px;">' + a.org + ' &nbsp;&middot;&nbsp; ' + a.type + ' &nbsp;&middot;&nbsp; 辖区：' + a.region + ' &nbsp;&middot;&nbsp; ' + (freqLabel[a.freq] || '按周') + '更新</div>' +
      '</div>' +
    '</div>' +
    '<button class="modal-close" onclick="closeModal(\'detailDrawer\')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
  document.querySelectorAll('#drawerTabs .detail-tab').forEach(function(t, i) { t.classList.toggle('active', i === 0); });
  ['batches','whitelist','logs'].forEach(function(t) {
    document.getElementById('dtab-' + t).style.display = t === 'batches' ? 'block' : 'none';
  });
  renderDrawerBatches();
  document.getElementById('detailDrawer').classList.add('show');
}

function switchDrawerTab(tab, el) {
  document.querySelectorAll('#drawerTabs .detail-tab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  ['batches','whitelist','logs'].forEach(function(t) {
    document.getElementById('dtab-' + t).style.display = t === tab ? 'block' : 'none';
  });
  currentDrawerTab = tab;
  if (tab === 'batches') renderDrawerBatches();
  if (tab === 'whitelist') renderDrawerWhitelist();
  if (tab === 'logs') renderDrawerLogs();
}

function renderDrawerBatches() {
  const list = BATCHES_DATA.filter(function(b) { return b.agentId === currentDrawerAgentId; });
  document.getElementById('dtab-batches').innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">' +
      '<div style="font-size:13.5px;font-weight:700;color:var(--gray-900);">名单批次（共 ' + list.length + ' 批）</div>' +
      '<button class="btn btn-default btn-sm" onclick="openImportModal()" style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;flex-shrink:0;display:block;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>手工导入' +
      '</button>' +
    '</div>' +
    '<div class="card" style="padding:0;overflow:hidden;">' +
      '<table class="table" style="margin-bottom:0;">' +
        '<thead><tr><th>批次名称</th><th>来源</th><th>客户数</th><th>生成时间</th><th>状态</th><th>操作</th></tr></thead>' +
        '<tbody>' +
        (list.length ? list.map(function(b) {
          return '<tr>' +
            '<td><div style="font-weight:600;color:var(--gray-900);font-size:13.5px;">' + b.name + '</div></td>' +
            '<td><span class="batch-source-tag ' + (b.source === 'auto' ? 'auto' : 'manual') + '">' + (b.source === 'auto' ? '系统生成' : '手工导入') + '</span></td>' +
            '<td><strong>' + b.count + '</strong> <span style="color:var(--gray-400);font-size:12px;">户</span></td>' +
            '<td style="color:var(--gray-500);font-size:13px;">' + b.time + '</td>' +
            '<td><span class="tag ' + (b.status === '已分配' ? 'tag-green' : b.status === '分配中' ? 'tag-blue' : 'tag-gray') + '">' + b.status + '</span></td>' +
            '<td><div style="display:flex;gap:6px;">' +
              '<button class="btn btn-ghost btn-sm">查看</button>' +
              '<button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;">' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0;display:block;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>导出' +
              '</button>' +
            '</div></td>' +
          '</tr>';
        }).join('') : '<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--gray-400)">暂无批次数据</td></tr>') +
        '</tbody></table></div>';
}

function renderDrawerWhitelist() {
  const list = WHITELIST_DATA.filter(function(w) { return w.agentId === currentDrawerAgentId; });
  document.getElementById('dtab-whitelist').innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">' +
      '<div><div style="font-size:13.5px;font-weight:700;color:var(--gray-900);">白名单快照历史</div>' +
        '<div style="font-size:12px;color:var(--gray-400);margin-top:2px;">全量过筛后符合条件的企业快照，可下载发送给银行用于对账分润</div></div>' +
      '<button class="btn btn-primary btn-sm" onclick="showToast(\'正在生成白名单快照，预计 5 分钟完成…\')"> 立即生成快照</button>' +
    '</div>' +
    (list.length ? list.map(function(w) {
      return '<div class="snapshot-item">' +
        '<div class="snap-icon"><svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:14px;font-weight:700;color:var(--gray-900);">版本 ' + w.version + '</div>' +
          '<div style="font-size:12.5px;color:var(--gray-500);margin-top:2px;">生成时间：' + w.genTime + ' &nbsp;&middot;&nbsp; 企业数：<strong style="color:var(--gray-900);">' + w.count.toLocaleString() + '</strong> 户</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">' +
          '<span class="tag ' + (w.status === '已同步银行' ? 'tag-green' : w.status === '待同步' ? 'tag-amber' : 'tag-gray') + '">' + w.status + '</span>' +
          '<div style="display:flex;gap:6px;">' +
            '<button class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;">' +
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;flex-shrink:0;display:block;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>下载 Excel' +
            '</button>' +
            (w.status === '待同步' ? '<button class="btn btn-primary btn-sm" onclick="showToast(\'已标记为已同步银行\', \'success\')"> 标记已同步</button>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('') : '<div style="text-align:center;padding:40px;color:var(--gray-400)">暂无白名单快照</div>');
}

function renderDrawerLogs() {
  const list = LOGS_DATA.filter(function(l) { return l.agentId === currentDrawerAgentId; });
  document.getElementById('dtab-logs').innerHTML =
    '<div class="card" style="padding:0;overflow:hidden;">' +
      '<div style="padding:14px 18px;border-bottom:1px solid var(--gray-100);display:flex;align-items:center;justify-content:space-between;">' +
        '<h3 style="font-size:14px;font-weight:700;color:var(--gray-900);">执行日志（' + list.length + ' 条）</h3>' +
        '<button class="btn btn-ghost btn-sm">查看全部</button>' +
      '</div>' +
      (list.length ? list.map(function(l) {
        return '<div class="log-row">' +
          '<div class="log-time">' + l.time + '</div>' +
          '<div class="log-dot ' + l.status + '"></div>' +
          '<div class="log-detail"><strong>' + l.action + '</strong>：' + l.detail + '</div>' +
          '<div class="log-count" style="color:' + (l.count.startsWith('+') ? '#2563eb' : 'var(--gray-400)') + '">' + l.count + '</div>' +
        '</div>';
      }).join('') : '<div style="text-align:center;padding:30px;color:var(--gray-400)">暂无日志</div>') +
    '</div>';
}

"""

lines = content.split('\n')

# 找到 "const LOGS_DATA" 行和 "/* ---- 向导 ----" 行
start_line = None
end_line = None
for i, line in enumerate(lines):
    if 'const LOGS_DATA' in line and start_line is None:
        start_line = i
    if '/* ---- 向导 ----' in line and end_line is None:
        end_line = i
        break

print(f"start_line: {start_line}, end_line: {end_line}")

if start_line is not None and end_line is not None:
    new_lines = lines[:start_line] + [NEW_DATA_AND_FUNCS] + lines[end_line:]
    content = '\n'.join(new_lines)
    print("JS函数区块已替换")
else:
    print("ERROR: 未找到替换范围")

# 替换初始化调用
content = content.replace('renderAgentList();\nrenderDeployed();', 'renderAgentGrid();')

with open('agents.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("文件已保存")
