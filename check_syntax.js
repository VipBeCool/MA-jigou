// ===== 初始化侧边栏 =====
const role = sessionStorage.getItem('wb_role') || 'manager';
renderSidebar({ currentPage: 'customers', role });

// ===== 状态配置（与移动端完全对应） =====
const RS_MAP = {
  PENDING:             { l: '待触达',   c: 'var(--brand)',  bg: '#eff6ff',          dot: '#2563eb' },
  FOLLOWING:           { l: '跟进中',   c: '#d97706',       bg: '#fffbeb',          dot: '#f59e0b' },
  REACHED_INTERESTED:  { l: '有意向',   c: '#059669',       bg: '#ecfdf5',          dot: '#10b981' },
  REACHED_NO_INTEREST: { l: '无意向',   c: '#6b7280',       bg: '#f3f4f6',          dot: '#9ca3af' },
  UNREACHED_NO_ANSWER: { l: '触达失败', c: '#dc2626',       bg: '#fef2f2',          dot: '#ef4444' },
  UNREACHED_REJECTED:  { l: '触达失败', c: '#dc2626',       bg: '#fef2f2',          dot: '#ef4444' },
  UNREACHED_OTHER:     { l: '触达失败', c: '#dc2626',       bg: '#fef2f2',          dot: '#ef4444' },
  UNREACHED_EMPTY:     { l: '触达失败', c: '#dc2626',       bg: '#fef2f2',          dot: '#ef4444' },
};
const BS_MAP = {
  NONE:         { l: '',      c: '',         bg: '' },
  APPLIED:      { l: '已申请', c: '#2563eb',  bg: '#eff6ff' },
  REVIEWING:    { l: '审批中', c: '#d97706',  bg: '#fffbeb' },
  APPROVED:     { l: '已授信', c: '#059669',  bg: '#ecfdf5' },
  DISBURSED:    { l: '已放款', c: '#0891b2',  bg: '#ecfeff' },
  SETTLED:      { l: '已结清', c: '#6b7280',  bg: '#f3f4f6' },
  REJECTED_BIZ: { l: '已拒绝', c: '#dc2626',  bg: '#fef2f2' },
};

// 营销状态二级联动
const L2_OPTIONS = {
  '10': ['未接通', '拒绝沟通', '无效号码', '其他原因'],
  '20': ['利率太高', '已在他行', '近期无需求', '其他原因'],
  '30': ['意向沟通中', '材料准备中', '等待回复', '多次跟进中'],
  '40': ['明确有意向', '已预约面谈', '引导申请中'],
};

// ===== Mock 数据 =====
const ALL_DATA = [
  { id:1, name:'苏州智云科技有限公司', uscc:'91320594MA1EXAMPLE1', region: '江苏省/苏州市/工业园区', addr:'苏州市工业园区星湖街5号', rs:'PENDING', bs:'NONE', product:'橙业贷, 厂房贷', nature:'民营企业', honor:'高新技术', intent:'高', risk:'低', batch:'橙业贷20160508', batchSource:'auto', lastContact: '3天前', ds:92, legalPerson: '张三', status: '存续', entityType: '有限责任公司', indCat: '信息传输、软件 and 信息技术服务业', indType: '软件开发', regCap: '1000万人民币', regDate: '2016-05-08' },
  { id:2, name:'苏州生物医药研究院有限公司', uscc:'91320594MA5EXAMPLE5', region: '江苏省/苏州市/工业园区', addr:'苏州市工业园区独墅湖大道88号', rs:'UNREACHED_NO_ANSWER', bs:'NONE', product:'橙业贷', nature:'外资企业', honor:'独角兽企业', intent:'中', risk:'高', batch:'橙业贷20160508', batchSource:'auto', lastContact: '2天前', ds:81, legalPerson: '李四', status: '存续', entityType: '外商独资', indCat: '科学研究 and 技术服务业', indType: '医学研究 and 试验发展', regCap: '5000万人民币', regDate: '2018-09-12' },
  { id:3, name:'常州新能源科技股份有限公司', uscc:'91320412MA4EXAMPLE4', region: '江苏省/常州市/武进区', addr:'常州市武进区高新区南区', rs:'REACHED_NO_INTEREST', bs:'NONE', product:'橙业贷, 税务贷', nature:'国有企业', honor:'专精特新', intent:'低', risk:'中', batch:'橙业贷20160509', batchSource:'auto', lastContact: '1天前', ds:72, legalPerson: '王五', status: '存续', entityType: '股份有限公司', indCat: '制造业', indType: '电气机械 and 器材制造业', regCap: '1亿人民币', regDate: '2015-03-20' },
  { id:4, name:'南京创新智造集团有限公司', uscc:'91320115MA2EXAMPLE2', region: '江苏省/南京市/江宁区', addr:'南京市江宁区将军大道100号', rs:'FOLLOWING', bs:'NONE', product:'厂房贷', nature:'民营企业', honor:'高新技术', intent:'高', risk:'低', batch:'厂房贷20160501', batchSource:'auto', lastContact: '今天', ds:88, legalPerson: '赵六', status: '存续', entityType: '集团公司', indCat: '制造业', indType: '专用设备制造业', regCap: '2亿人民币', regDate: '2010-11-11' },
  { id:5, name:'苏州纳米智能装备有限公司', uscc:'91320594MA7EXAMPLE7', region: '江苏省/苏州市/高新区', addr:'苏州市高新区科技城锦峰路10号', rs:'REACHED_INTERESTED', bs:'NONE', product:'厂房贷', nature:'合资企业', honor:'瞪羚企业', intent:'高', risk:'低', batch:'厂房贷20160501', batchSource:'auto', lastContact: '1天前', ds:78, legalPerson: '孙七', status: '存续', entityType: '中外合资', indCat: '制造业', indType: '通用设备制造业', regCap: '3000万美元', regDate: '2019-07-01' },
  { id:6, name:'无锡光电半导体有限公司', uscc:'91320214MA3EXAMPLE3', region: '江苏省/无锡市/新吴区', addr:'无锡市新吴区太湖国际科技园', rs:'REACHED_INTERESTED', bs:'APPLIED', product:'厂房贷, 橙业贷', nature:'民营企业', honor:'高新技术', intent:'高', risk:'中', batch:'厂房贷20160502', batchSource:'auto', lastContact: '今天', ds:95, legalPerson: '周八', status: '存续', entityType: '有限责任公司', indCat: '制造业', indType: '计算机、通信 and 其他电子设备制造业', regCap: '5亿人民币', regDate: '2020-01-15' },
  { id:7, name:'常州智能制造系统有限公司', uscc:'91320402MAAEXAMPLEC', region: '江苏省/常州市/新北区', addr:'常州市新北区通江南路88号', rs:'FOLLOWING', bs:'REVIEWING', product:'税务贷', nature:'民营企业', honor:'专精特新', intent:'中', risk:'低', batch:'税务贷20160501', batchSource:'auto', lastContact: '5天前', ds:76, legalPerson: '吴九', status: '存续', entityType: '有限责任公司', indCat: '信息传输、软件和信息技术服务业', indType: '软件开发', regCap: '2000万人民币', regDate: '2021-08-08' },
  { id:8, name:'南京云端数据技术有限公司', uscc:'91320114MA8EXAMPLE8', region: '江苏省/南京市/雨花台区', addr:'南京市雨花台区软件大道1号', rs:'REACHED_INTERESTED', bs:'APPROVED', product:'税务贷', nature:'民营企业', honor:'瞪羚企业', intent:'高', risk:'低', batch:'税务贷20160501', batchSource:'auto', lastContact: '3天前', ds:90, legalPerson: '郑十', status: '存续', entityType: '有限责任公司', indCat: '信息传输、软件和信息技术服务业', indType: '互联网和相关服务', regCap: '8000万人民币', regDate: '2017-05-25' },
  { id:9, name:'南通精密机械制造有限公司', uscc:'91320602MA6EXAMPLE6', region: '江苏省/南通市/崇川区', addr:'南通市崇川区工农路20号', rs:'FOLLOWING', bs:'DISBURSED', product:'税务贷', nature:'民营企业', honor:'高新技术', intent:'中', risk:'低', batch:'税务贷20160501', batchSource:'auto', lastContact: '2天前', ds:82, legalPerson: '刘一', status: '存续', entityType: '有限责任公司', indCat: '制造业', indType: '通用设备制造业', regCap: '1500万人民币', regDate: '2014-10-10' },
  { id:10, name:'泰州华科电子科技有限公司', uscc:'91321203MA3EXAMPLED', region: '江苏省/泰州市/高港区', addr:'泰州市高港区科技大道8号', rs:'REACHED_NO_INTEREST', bs:'NONE', product:'橙业贷', nature:'合资企业', honor:'瞪羚企业', intent:'低', risk:'高', batch:'橙业贷20160508', batchSource:'auto', lastContact: '10天前', ds:65, legalPerson: '陈二', status: '注销', entityType: '有限责任公司', indCat: '制造业', indType: '计算机、通信和其他电子设备制造业', regCap: '500万人民币', regDate: '2012-12-12' },
  { id:11, name:'无锡集成电路设计有限公司', uscc:'91320214MA9EXAMPLEB', region: '江苏省/无锡市/滨湖区', addr:'无锡市滨湖区建筑路300号', rs:'PENDING', bs:'NONE', product:'橙业贷', nature:'国有企业', honor:'高新技术', intent:'中', risk:'中', batch:'橙业贷20160510', batchSource:'auto', lastContact: '暂无跟进', ds:70, legalPerson: '王三', status: '存续', entityType: '国有独资', indCat: '科学研究和技术服务业', indType: '专业技术服务业', regCap: '3亿人民币', regDate: '2008-08-08' },
  { id:12, name:'扬州苏仪自控系统有限公司', uscc:'91321002MA4EXAMPLEE', region: '江苏省/扬州市/广陵区', addr:'扬州市广陵区新城路12号', rs:'FOLLOWING', bs:'SETTLED', product:'橙业贷', nature:'民营企业', honor:'专精特新', intent:'高', risk:'低', batch:'橙业贷20260615', batchSource:'manual', lastContact: '今天', ds:85, legalPerson: '李梅', status: '存续', entityType: '有限责任公司', indCat: '制造业', indType: '仪器仪表制造业', regCap: '2500万人民币', regDate: '2013-04-18' },
  { id:13, name:'苏州工业机器人研发有限公司', uscc:'91320594MA2EXAMPLEG', region: '江苏省/苏州市/工业园区', addr:'苏州市工业园区独墅湖大道90号', rs:'REACHED_INTERESTED', bs:'APPLIED', product:'橙业贷', nature:'外资企业', honor:'高新技术', intent:'高', risk:'中', batch:'橙业贷20260615', batchSource:'manual', lastContact: '1天前', ds:93, legalPerson: '张伟', status: '存续', entityType: '外商独资', indCat: '科学研究和技术服务业', indType: '科技推广和应用服务业', regCap: '1000万美元', regDate: '2022-02-22' },
  { id:14, name:'盐城风电装备制造有限公司', uscc:'91320902MA1EXAMPLEF', region: '江苏省/盐城市/亭湖区', addr:'盐城市亭湖区环保产业园', rs:'UNREACHED_OTHER', bs:'NONE', product:'厂房贷', nature:'国有企业', honor:'无', intent:'低', risk:'低', batch:'厂房贷20160502', batchSource:'auto', lastContact: '7天前', ds:68, legalPerson: '赵云', status: '存续', entityType: '国有控股', indCat: '制造业', indType: '专用设备制造业', regCap: '1.5亿人民币', regDate: '2011-05-15' },
  { id:15, name:'镇江新材料技术有限公司', uscc:'91321102MA3EXAMPLEH', region: '江苏省/镇江市/京口区', addr:'镇江市京口区学府路66号', rs:'PENDING', bs:'NONE', product:'税务贷', nature:'合资企业', honor:'高新技术', intent:'中', risk:'中', batch:'税务贷20160502', batchSource:'auto', lastContact: '暂无跟进', ds:75, legalPerson: '马超', status: '存续', entityType: '中外合资', indCat: '制造业', indType: '化学原料和化学制品制造业', regCap: '6000万人民币', regDate: '2016-09-09' }
];

// ===== 筛选状态 =====
let filterState = { rs: 'ALL', bs: 'ALL', product: 'ALL', batch: 'ALL', quick: '' };

let currentMarkId = null;

// ===== 辅助函数 =====
function getRsBadge(rs, bs) {
  // 业务状态优先显示
  if (bs === 'DISBURSED') return { l: '已放款', c: '#0891b2', bg: '#ecfeff', dot: '#0891b2' };
  if (bs === 'SETTLED')   return { l: '已结清', c: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af' };
  if (bs === 'REJECTED_BIZ') return { l: '审批拒绝', c: '#dc2626', bg: '#fef2f2', dot: '#ef4444' };
  const r = RS_MAP[rs] || RS_MAP.PENDING;
  const b = BS_MAP[bs];
  if (bs && bs !== 'NONE' && b && b.l) {
    return { l: `${r.l} · ${b.l}`, c: r.c, bg: r.bg, dot: r.dot };
  }
  return r;
}

function getBsOnlyBadge(bs) {
  const b = BS_MAP[bs];
  if (!b || !b.l) return `<span style="color:var(--gray-300);font-size:12px;">—</span>`;
  return `<span class="status-badge" style="background:${b.bg};color:${b.c};">${b.l}</span>`;
}

function isUnreached(rs) { return rs && rs.startsWith('UNREACHED'); }

// ===== 渲染 =====
function doFilter() {
  const search = document.getElementById('searchKey').value.toLowerCase().trim();
  const fRegion = window.cascaderRegion ? Array.from(window.cascaderRegion.selectedMulti) : [];
  const fContact = document.getElementById('filterContact').value;
  const fProduct = document.getElementById('filterProduct').value;
  const fNature = document.getElementById('filterNature').value;
  const fHonor = document.getElementById('filterHonor').value;
  const fIntent = document.getElementById('filterIntent').value;
  const fRisk = document.getElementById('filterRisk').value;
  
  const fBatch = window.cascaderBatch && window.cascaderBatch.selectedSingle ? window.cascaderBatch.selectedSingle : 'ALL';
  const fOrg = window.cascaderOrg && window.cascaderOrg.selectedSingle ? window.cascaderOrg.selectedSingle : 'ALL';
  const fOwner = document.getElementById('filterOwner') ? document.getElementById('filterOwner').value : 'ALL';

  let list = ALL_DATA.filter(c => {
    if (search && !c.name.toLowerCase().includes(search) && !c.uscc.toLowerCase().includes(search)) return false;
    
    if (filterState.rs !== 'ALL') {
      if (filterState.rs === 'unreached' && !isUnreached(c.rs)) return false;
      if (filterState.rs !== 'unreached' && c.rs !== filterState.rs) {
        if(!(filterState.rs === 'REACHED_INTERESTED' && c.rs === 'REACHED_INTERESTED')) return false;
      }
    }
    if (filterState.bs !== 'ALL' && c.bs !== filterState.bs) return false;
    
    if (fBatch !== 'ALL' && c.batch !== fBatch) return false;
    if (fRegion.length > 0) {
      if (!c.addr || !fRegion.some(dist => c.addr.includes(dist))) return false;
    }
    if (fContact !== 'ALL') {
      if (fContact === '有号码' && !c.hasPhone) return false;
      if (fContact === '无号码' && c.hasPhone) return false;
    }
    if (fProduct !== 'ALL' && c.product !== fProduct) return false;
    if (fNature !== 'ALL' && c.nature !== fNature) return false;
    if (fHonor !== 'ALL' && c.honor !== fHonor) return false;
    if (fIntent !== 'ALL' && c.intent !== fIntent) return false;
    if (fRisk !== 'ALL' && c.risk !== fRisk) return false;
    
    if (filterState.quick === 'no_contact') {
      if (!isUnreached(c.rs)) return false;
    }
    
    if (fOrg !== 'ALL' && c.org !== fOrg) return false;
    if (fOwner !== 'ALL' && c.owner !== fOwner) return false;
    
    return true;
  });

  list.sort((a,b) => {
    const s = document.getElementById('sortSelect').value;
    if(s==='score') return b.ds - a.ds;
    if(s==='time') return b.id - a.id;
    if(s==='reg') return b.id - a.id;
    return 0;
  });

  renderTable(list);
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('sortSelect').value = 'default';
  document.getElementById('filterRegion').value = 'ALL';
  document.getElementById('filterSource').value = 'ALL';
  document.getElementById('filterContact').value = 'ALL';
  document.getElementById('filterProduct').value = 'ALL';
  document.getElementById('filterNature').value = 'ALL';
  document.getElementById('filterHonor').value = 'ALL';
  document.getElementById('filterIntent').value = 'ALL';
  document.getElementById('filterRisk').value = 'ALL';
  document.querySelectorAll('.filter-option').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.filter-option[data-val="ALL"]').forEach(el => el.classList.add('active'));
  filterState = { rs: 'ALL', bs: 'ALL', product: 'ALL', batch: 'ALL', quick: '', owner: 'ALL', org: 'ALL' };
  const batchSel = document.getElementById('filterBatch'); if (batchSel) batchSel.value = 'ALL';
  doFilter();
}



function toggleAdvFilters() {
  const panel = document.getElementById('advancedFilters');
  const arrow = document.getElementById('advFilterArrow');
  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    arrow.style.transform = 'rotate(180deg)';
  } else {
    panel.style.display = 'none';
    arrow.style.transform = 'rotate(0deg)';
  }
}

// ==================== 列配置逻辑 ====================
const allColumns = [
  { key: 'name', label: '企业名称', fixed: true, default: true },
  { key: 'uscc', label: '统一社会信用代码', fixed: true, default: true },
  { key: 'region', label: '区域', fixed: false, default: true },
  { key: 'product', label: '适配产品', fixed: false, default: true },
  { key: 'rs', label: '营销状态', fixed: true, default: true },
  { key: 'bs', label: '业务状态', fixed: true, default: true },
  { key: 'lastContact', label: '最近跟进', fixed: true, default: true },
  { key: 'legalPerson', label: '法定代表人', fixed: false, default: false },
  { key: 'status', label: '企业状态', fixed: false, default: false },
  { key: 'entityType', label: '实体类型', fixed: false, default: false },
  { key: 'indCat', label: '行业门类', fixed: false, default: false },
  { key: 'indType', label: '行业大类', fixed: false, default: false },
  { key: 'regCap', label: '注册资本', fixed: false, default: false },
  { key: 'regDate', label: '成立日期', fixed: false, default: false },
  { key: 'addr', label: '企业住所', fixed: false, default: false },
  { key: 'action', label: '操作', fixed: true, default: true }
];

let visibleCols = JSON.parse(localStorage.getItem('wb_list_cols_v2'));
if (!visibleCols) {
  visibleCols = allColumns.filter(c => c.fixed || c.default).map(c => c.key);
} else {
  // Ensure fixed columns are always included
  allColumns.forEach(c => {
    if (c.fixed && !visibleCols.includes(c.key)) {
      visibleCols.push(c.key);
    }
  });
}

function toggleColPopover(e) {
  e.stopPropagation();
  const pop = document.getElementById('colPopover');
  pop.classList.toggle('show');
}
document.addEventListener('click', e => {
  const pop = document.getElementById('colPopover');
  if (pop && pop.classList.contains('show') && !e.target.closest('.col-settings')) {
    pop.classList.remove('show');
  }
});
function initColPopover() {
  const body = document.getElementById('colPopBody');
  if(!body) return;
  let html = '';
  allColumns.forEach(c => {
    const isChecked = visibleCols.includes(c.key) ? 'checked' : '';
    const isFixed = c.fixed ? 'disabled' : '';
    const fixedStyle = c.fixed ? 'opacity: 0.5; cursor: not-allowed;' : '';
    html += `<label class="col-pop-item" style="${fixedStyle}">
      <input type="checkbox" value="${c.key}" ${isChecked} ${isFixed} onchange="onColChange(this)">
      <span>${c.label}</span>
    </label>`;
  });
  body.innerHTML = html;
}
function onColChange(cb) {
  if (cb.checked) {
    if (!visibleCols.includes(cb.value)) visibleCols.push(cb.value);
  } else {
    visibleCols = visibleCols.filter(v => v !== cb.value);
  }
  localStorage.setItem('wb_list_cols_v2', JSON.stringify(visibleCols));
  renderTable(window.filtered || ALL_DATA);
}
function resetColumns() {
  visibleCols = allColumns.filter(c => c.fixed || c.default).map(c => c.key);
  localStorage.setItem('wb_list_cols_v2', JSON.stringify(visibleCols));
  initColPopover();
  renderTable(window.filtered || ALL_DATA);
}

// 覆盖原本的 renderTable
function renderTable(list) {
  if(!list) list = [];
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if(!thead || !tbody) return;

  // Render Head
  let thHtml = '<tr>';
  thHtml += `<th style="width:50px;text-align:center;">序号</th>`;
  allColumns.forEach(c => {
    if (visibleCols.includes(c.key)) {
      if (c.key === 'action' || c.key === 'rs' || c.key === 'bs') thHtml += `<th style="text-align:center;">${c.label}</th>`;
      else thHtml += `<th>${c.label}</th>`;
    }
  });
  thHtml += '</tr>';
  thead.innerHTML = thHtml;

  // Render Body
  if (list.length === 0) {
    tbody.innerHTML = '';
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('tableView').style.display = 'none';
    return;
  }
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('tableView').style.display = 'block';

  let tbHtml = '';
  list.forEach((item, index) => {
    tbHtml += `<tr>`;
    tbHtml += `<td style="text-align:center;color:var(--gray-500);">${index + 1}</td>`;
    allColumns.forEach(c => {
      if (visibleCols.includes(c.key)) {
        if (c.key === 'name') tbHtml += `<td><a href="javascript:void(0)" class="table-link" onclick="goDetail(${item.id})">${item.name}</a></td>`;
        else if (c.key === 'uscc') tbHtml += `<td style="color:var(--gray-500);">${item.uscc || '-'}</td>`;
        else if (c.key === 'region') tbHtml += `<td>${item.region || '-'}</td>`;
        else if (c.key === 'legalPerson') tbHtml += `<td style="color:var(--gray-800);">${item.legalPerson || '-'}</td>`;
        else if (c.key === 'status') tbHtml += `<td>${item.status || '-'}</td>`;
        else if (c.key === 'entityType') tbHtml += `<td>${item.entityType || '-'}</td>`;
        else if (c.key === 'indCat') tbHtml += `<td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.indCat || ''}">${item.indCat || '-'}</td>`;
        else if (c.key === 'indType') tbHtml += `<td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.indType || ''}">${item.indType || '-'}</td>`;
        else if (c.key === 'regCap') tbHtml += `<td>${item.regCap || '-'}</td>`;
        else if (c.key === 'regDate') tbHtml += `<td>${item.regDate || '-'}</td>`;
        else if (c.key === 'addr') tbHtml += `<td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.addr || ''}">${item.addr || '-'}</td>`;
        else if (c.key === 'product') tbHtml += `<td>${item.product}</td>`;
        else if (c.key === 'rs') {
          const r = RS_MAP[item.rs] || { l: '-', c: 'var(--gray-500)', bg: 'var(--gray-100)' };
          tbHtml += `<td style="text-align:center;"><span class="status-badge" style="background:${r.bg};color:${r.c};">${r.l}</span></td>`;
        }
        else if (c.key === 'bs') {
          const b = BS_MAP[item.bs];
          if (b && b.l) tbHtml += `<td style="text-align:center;"><span class="status-badge" style="background:${b.bg};color:${b.c};">${b.l}</span></td>`;
          else tbHtml += `<td style="text-align:center;"><span style="color:var(--gray-300);">-</span></td>`;
        }
        else if (c.key === 'lastContact') tbHtml += `<td style="color:var(--gray-500);">${item.lastContact}</td>`;
        else if (c.key === 'action') tbHtml += `<td style="text-align:center;">
            <div class="action-btns">
              <button class="action-btn primary" onclick="goDetail(${item.id})">详情</button>
              <button class="action-btn" onclick="openMarkDrawer(${item.id})">状态</button>
              <button class="action-btn" onclick="openContactModal(${item.id})">触达</button>
            </div>
          </td>`;
      }
    });
    tbHtml += `</tr>`;
  });
  tbody.innerHTML = tbHtml;
}

function setView(v) {
  // dummy to prevent errors from leftover calls
}

document.addEventListener('DOMContentLoaded', () => {
  initColPopover();
  doFilter();
});


// ===== 筛选 =====
function setFilter(type, val, el) {
  filterState[type] = val;
  // 同组高亮
  document.querySelectorAll(`[data-filter="${type}"]`).forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  doFilter();
}
function resetAllFilters() {
  filterState = { rs: 'ALL', bs: 'ALL', product: 'ALL', batch: 'ALL', quick: '', owner: 'ALL', org: 'ALL' };
  
  if (window.cascaderBatch) window.cascaderBatch.reset();
  if (window.cascaderRegion) window.cascaderRegion.reset();
  if (window.cascaderOrg) window.cascaderOrg.reset();
  
  document.querySelectorAll('.filter-option').forEach(e => {
    e.classList.remove('active');
    if (e.dataset.val === 'ALL') e.classList.add('active');
  });
  ['filterContact', 'filterProduct', 'filterNature', 'filterHonor', 'filterIntent', 'filterRisk', 'filterOwner'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.value = 'ALL';
  });
  
  doFilter();
}

// ===== 导航 =====
function goDetail(id) { location.href = 'customer-detail.html?id=' + id; }
function exportData() { document.getElementById('exportModal').style.display = 'flex'; }
function closeExportModal() { document.getElementById('exportModal').style.display = 'none'; }
function goToDownloadCenter() { location.href = 'downloads.html'; }

// ===== 触达路径弹窗 =====
function openContactModal(id) {
  const c = ALL_DATA.find(x => x.id === id);
  document.getElementById('contactModalTitle').textContent = '触达路径';
  document.getElementById('contactModalSub').textContent = c ? c.name : '';
  document.getElementById('contactModal').classList.add('show');
}
function closeContactModal() {
  document.getElementById('contactModal').classList.remove('show');
}
function contactTab(el, idx) {
  document.querySelectorAll('.contact-tab').forEach((t,i) => {
    t.className = 'contact-tab' + (i === idx ? ' active' : '');
    document.getElementById('cPane' + i).className = 'contact-pane' + (i === idx ? ' active' : '');
  });
}
function makeCall(phone) {
  document.getElementById('callModalPhone').innerText = phone;
  document.getElementById('callModal').classList.add('show');
}
function closeCallModal() {
  document.getElementById('callModal').classList.remove('show');
}

// ===== 状态标记抽屉 =====
// 包装器，适配本地列表调用 window.openStatusDrawer (公共组件)
function openMarkDrawer(id) {
  const c = ALL_DATA.find(x => x.id === id);
  const mktInit = '00'; // 可根据 c.rs 映射
  const bizInit = c && c.bs && c.bs !== 'ALL' ? c.bs : 'NONE';
  window.openStatusDrawer(id, c ? c.name : '未知企业', mktInit, bizInit);
}

// ===== ESC关闭 =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeContactModal();
    if(window.closeStatusDrawer) window.closeStatusDrawer();
  }
});
document.getElementById('contactModal').addEventListener('click', e => {
  if (e.target === document.getElementById('contactModal')) closeContactModal();
});

// ===== 区域级联多选组件逻辑 =====
const REGION_DATA = [
  {
    name: '江苏省',
    children: [
      { name: '苏州市', children: ['工业园区', '高新区', '吴中区', '相城区', '姑苏区'] },
      { name: '南京市', children: ['玄武区', '秦淮区', '建邺区'] },
      { name: '南通市', children: ['崇川区', '通州区'] }
    ]
  },
  {
    name: '浙江省',
    children: [
      { name: '杭州市', children: ['西湖区', '上城区', '余杭区'] },
      { name: '宁波市', children: ['海曙区', '江北区'] }
    ]
  }
];

// ===== 通用级联组件逻辑 =====
class GenericCascader {
  constructor(config) {
    this.id = config.id;
    this.data = config.data;
    this.levels = config.levels;
    this.isMulti = config.isMulti || false;
    this.defaultText = config.defaultText;
    this.onSelect = config.onSelect;
    
    this.state = new Array(this.levels - 1).fill(0);
    this.selectedMulti = new Set();
    this.selectedSingle = null;
    
    this.container = document.getElementById(this.id);
    this.dropdown = document.getElementById(this.id + 'Dropdown');
    this.colsContainer = document.getElementById(this.id + 'Cols');
    this.textEl = document.getElementById(this.id + 'Text');
    this.displayEl = this.container.querySelector('.custom-singleselect-display');
  }

  toggle(e) {
    if(e) e.stopPropagation();
    const isShowing = this.dropdown.style.display === 'flex';
    document.querySelectorAll('.cascader-dropdown').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.custom-singleselect-display.focus').forEach(el => el.classList.remove('focus'));
    
    if (isShowing) {
      this.dropdown.style.display = 'none';
      this.displayEl.classList.remove('focus');
    } else {
      this.dropdown.style.display = 'flex';
      this.displayEl.classList.add('focus');
      this.render();
    }
  }

  getColData(level) {
    let current = this.data;
    for (let i = 0; i < level; i++) {
      if (!current || !current[this.state[i]] || !current[this.state[i]].children) return [];
      current = current[this.state[i]].children;
    }
    return current || [];
  }

  render() {
    let html = '';
    for (let i = 0; i < this.levels; i++) {
      if (i > 0) html += '<div class="cascader-divider"></div>';
      html += `<div class="cascader-col" id="${this.id}-col-${i}"></div>`;
    }
    this.colsContainer.innerHTML = html;
    
    for (let level = 0; level < this.levels; level++) {
      const colEl = document.getElementById(`${this.id}-col-${level}`);
      const list = this.getColData(level);
      
      let colHtml = '';
      if (level === this.levels - 1) { // 最后一级
        colHtml = list.map(item => {
          let val = item.name || item;
          if (this.isMulti) {
            let isChecked = this.selectedMulti.has(val) ? 'checked' : '';
            return `
              <label class="cascader-checkbox-item" onclick="event.stopPropagation()">
                <input type="checkbox" value="${val}" ${isChecked} onchange="window['${this.id}'].toggleMulti('${val}', this.checked)">
                ${val}
              </label>
            `;
          } else {
            let isActive = this.selectedSingle === val ? 'active' : '';
            return `
              <div class="cascader-item ${isActive}" onclick="window['${this.id}'].selectSingle('${val}', event)">
                ${val}
              </div>
            `;
          }
        }).join('');
      } else {
        colHtml = list.map((item, idx) => `
          <div class="cascader-item ${idx === this.state[level] ? 'active' : ''}" onclick="window['${this.id}'].setIdx(${level}, ${idx}, event)">
            ${item.name}
            <div class="cascader-item-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
          </div>
        `).join('');
      }
      colEl.innerHTML = colHtml;
    }
    
    if (this.isMulti) {
      let countEl = document.getElementById(this.id.replace('cascader', 'cascaderRegionCount'));
      if(countEl) countEl.textContent = this.selectedMulti.size;
    }
  }

  setIdx(level, idx, e) {
    if(e) e.stopPropagation();
    this.state[level] = idx;
    for (let i = level + 1; i < this.state.length; i++) this.state[i] = 0;
    this.render();
  }

  toggleMulti(val, checked) {
    if(checked) this.selectedMulti.add(val);
    else this.selectedMulti.delete(val);
    this.render();
  }

  selectSingle(val, e) {
    if(e) e.stopPropagation();
    this.selectedSingle = val;
    this.textEl.textContent = val;
    this.textEl.style.color = 'var(--brand)';
    this.textEl.style.fontWeight = '600';
    this.dropdown.style.display = 'none';
    this.displayEl.classList.remove('focus');
    if(this.onSelect) this.onSelect();
  }

  confirm(e) {
    if(e) e.stopPropagation();
    this.dropdown.style.display = 'none';
    this.displayEl.classList.remove('focus');
    const count = this.selectedMulti.size;
    if (count > 0) {
      this.textEl.textContent = `已选${this.defaultText} (${count})`;
      this.textEl.style.color = 'var(--brand)';
      this.textEl.style.fontWeight = '600';
    } else {
      this.textEl.textContent = this.defaultText;
      this.textEl.style.color = '';
      this.textEl.style.fontWeight = '';
    }
    if(this.onSelect) this.onSelect();
  }

  reset(e) {
    if(e) e.stopPropagation();
    this.selectedMulti.clear();
    this.selectedSingle = null;
    this.state = new Array(this.levels - 1).fill(0);
    this.textEl.textContent = this.defaultText;
    this.textEl.style.color = '';
    this.textEl.style.fontWeight = '';
    this.render();
    if(this.onSelect) this.onSelect();
  }
}

const BATCH_DATA = [
  { name: '橙业贷', children: ['橙业贷20160508', '橙业贷20160509', '橙业贷20160510', '橙业贷20260615'] },
  { name: '厂房贷', children: ['厂房贷20160501', '厂房贷20160502'] },
  { name: '税务贷', children: ['税务贷20160501', '税务贷20160502'] }
];

const ORG_DATA = [
  {
    name: '江苏省分行', children: [
      { name: '南京市分行', children: ['鼓楼支行', '玄武支行'] },
      { name: '苏州市分行', children: ['姑苏支行', '工业园区支行', '新吴支行'] },
      { name: '无锡市分行', children: ['滨湖支行'] }
    ]
  }
];

window.initCascaders = function() {
  window.cascaderBatch = new GenericCascader({ id: 'cascaderBatch', data: BATCH_DATA, levels: 2, defaultText: '名单批次', onSelect: doFilter });
  window.cascaderRegion = new GenericCascader({ id: 'cascaderRegion', data: REGION_DATA, levels: 3, isMulti: true, defaultText: '区域', onSelect: doFilter });
  window.cascaderOrg = new GenericCascader({ id: 'cascaderOrg', data: ORG_DATA, levels: 3, defaultText: '对接机构', onSelect: doFilter });
};

document.addEventListener('click', e => {
  if (!e.target.closest('.custom-cascader')) {
    document.querySelectorAll('.cascader-dropdown').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.custom-singleselect-display.focus').forEach(el => el.classList.remove('focus'));
  }
});

window.initCascaders();
doFilter();
