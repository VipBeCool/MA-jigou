const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, 'customers.html');
let content = fs.readFileSync(targetPath, 'utf-8');

// 1. Update allColumns definitions
const oldColumnsMatch = content.match(/const allColumns = \[[\s\S]*?\];/);
if (oldColumnsMatch) {
  const newColumns = `const allColumns = [
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
];`;
  content = content.replace(oldColumnsMatch[0], newColumns);
}

// 2. Remove tr onclick="goDetail" and update render logic with new fields and correct buttons
const oldRenderBodyMatch = content.match(/let tbHtml = '';\s*list\.forEach\(\(item, index\) => \{[\s\S]*?tbody\.innerHTML = tbHtml;/);
if (oldRenderBodyMatch) {
  const newRenderBody = `let tbHtml = '';
  list.forEach((item, index) => {
    tbHtml += \`<tr>\`;
    tbHtml += \`<td style="text-align:center;color:var(--gray-500);">\${index + 1}</td>\`;
    allColumns.forEach(c => {
      if (visibleCols.includes(c.key)) {
        if (c.key === 'name') tbHtml += \`<td><a href="javascript:void(0)" class="table-link" onclick="goDetail(\${item.id})">\${item.name}</a></td>\`;
        else if (c.key === 'uscc') tbHtml += \`<td style="color:var(--gray-500);">\${item.uscc || '-'}</td>\`;
        else if (c.key === 'region') tbHtml += \`<td>\${item.region || '-'}</td>\`;
        else if (c.key === 'legalPerson') tbHtml += \`<td style="color:var(--gray-800);">\${item.legalPerson || '-'}</td>\`;
        else if (c.key === 'status') tbHtml += \`<td>\${item.status || '-'}</td>\`;
        else if (c.key === 'entityType') tbHtml += \`<td>\${item.entityType || '-'}</td>\`;
        else if (c.key === 'indCat') tbHtml += \`<td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="\${item.indCat || ''}">\${item.indCat || '-'}</td>\`;
        else if (c.key === 'indType') tbHtml += \`<td style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="\${item.indType || ''}">\${item.indType || '-'}</td>\`;
        else if (c.key === 'regCap') tbHtml += \`<td>\${item.regCap || '-'}</td>\`;
        else if (c.key === 'regDate') tbHtml += \`<td>\${item.regDate || '-'}</td>\`;
        else if (c.key === 'addr') tbHtml += \`<td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="\${item.addr || ''}">\${item.addr || '-'}</td>\`;
        else if (c.key === 'product') tbHtml += \`<td><span style="background:var(--gray-100);padding:2px 8px;border-radius:4px;font-size:12px;color:var(--gray-700);">\${item.product}</span></td>\`;
        else if (c.key === 'rs') {
          const r = RS_MAP[item.rs] || { l: '-', c: 'var(--gray-500)', bg: 'var(--gray-100)' };
          tbHtml += \`<td><span class="status-badge" style="background:\${r.bg};color:\${r.c};">\${r.l}</span></td>\`;
        }
        else if (c.key === 'bs') {
          const b = BS_MAP[item.bs];
          if (b && b.l) tbHtml += \`<td><span class="status-badge" style="background:\${b.bg};color:\${b.c};">\${b.l}</span></td>\`;
          else tbHtml += \`<td><span style="color:var(--gray-300);">-</span></td>\`;
        }
        else if (c.key === 'lastContact') tbHtml += \`<td style="color:var(--gray-500);">\${item.lastContact}</td>\`;
        else if (c.key === 'action') tbHtml += \`<td>
            <button class="btn btn-default" style="padding:4px 10px; border-radius:6px; font-size:12px; background:white; border:1px solid var(--border);" onclick="goDetail(\${item.id})">详情</button>
            <button class="btn btn-primary" style="padding:4px 10px; border-radius:6px; font-size:12px; margin-left:6px;" onclick="openMarkDrawer(\${item.id})">状态</button>
            <button class="btn btn-default" style="padding:4px 10px; border-radius:6px; font-size:12px; margin-left:6px; background:white; border:1px solid var(--border);" onclick="openContactModal(\${item.id})">路径</button>
          </td>\`;
      }
    });
    tbHtml += \`</tr>\`;
  });
  tbody.innerHTML = tbHtml;`;
  content = content.replace(oldRenderBodyMatch[0], newRenderBody);
}

// 3. Update ALL_DATA mock values
const oldDataMatch = content.match(/const ALL_DATA = \[\s*[\s\S]*?\];/);
if (oldDataMatch) {
  const newData = `const ALL_DATA = [
  { id:1, name:'苏州智云科技有限公司', uscc:'91320594MA1EXAMPLE1', region: '江苏省/苏州市/工业园区', addr:'苏州市工业园区星湖街5号', rs:'PENDING', bs:'NONE', product:'橙业贷', nature:'民营企业', honor:'高新技术', intent:'高', risk:'低', batch:'橙业贷20160508', batchSource:'auto', lastContact: '3天前', ds:92, legalPerson: '张三', status: '存续', entityType: '有限责任公司', indCat: '信息传输、软件和信息技术服务业', indType: '软件开发', regCap: '1000万人民币', regDate: '2016-05-08' },
  { id:2, name:'苏州生物医药研究院有限公司', uscc:'91320594MA5EXAMPLE5', region: '江苏省/苏州市/工业园区', addr:'苏州市工业园区独墅湖大道88号', rs:'UNREACHED_NO_ANSWER', bs:'NONE', product:'橙业贷', nature:'外资企业', honor:'独角兽企业', intent:'中', risk:'高', batch:'橙业贷20160508', batchSource:'auto', lastContact: '2天前', ds:81, legalPerson: '李四', status: '存续', entityType: '外商独资', indCat: '科学研究和技术服务业', indType: '医学研究和试验发展', regCap: '5000万人民币', regDate: '2018-09-12' },
  { id:3, name:'常州新能源科技股份有限公司', uscc:'91320412MA4EXAMPLE4', region: '江苏省/常州市/武进区', addr:'常州市武进区高新区南区', rs:'REACHED_NO_INTEREST', bs:'NONE', product:'橙业贷', nature:'国有企业', honor:'专精特新', intent:'低', risk:'中', batch:'橙业贷20160509', batchSource:'auto', lastContact: '1天前', ds:72, legalPerson: '王五', status: '存续', entityType: '股份有限公司', indCat: '制造业', indType: '电气机械和器材制造业', regCap: '1亿人民币', regDate: '2015-03-20' },
  { id:4, name:'南京创新智造集团有限公司', uscc:'91320115MA2EXAMPLE2', region: '江苏省/南京市/江宁区', addr:'南京市江宁区将军大道100号', rs:'FOLLOWING', bs:'NONE', product:'厂房贷', nature:'民营企业', honor:'高新技术', intent:'高', risk:'低', batch:'厂房贷20160501', batchSource:'auto', lastContact: '今天', ds:88, legalPerson: '赵六', status: '存续', entityType: '集团公司', indCat: '制造业', indType: '专用设备制造业', regCap: '2亿人民币', regDate: '2010-11-11' },
  { id:5, name:'苏州纳米智能装备有限公司', uscc:'91320594MA7EXAMPLE7', region: '江苏省/苏州市/高新区', addr:'苏州市高新区科技城锦峰路10号', rs:'REACHED_INTERESTED', bs:'NONE', product:'厂房贷', nature:'合资企业', honor:'瞪羚企业', intent:'高', risk:'低', batch:'厂房贷20160501', batchSource:'auto', lastContact: '1天前', ds:78, legalPerson: '孙七', status: '存续', entityType: '中外合资', indCat: '制造业', indType: '通用设备制造业', regCap: '3000万美元', regDate: '2019-07-01' },
  { id:6, name:'无锡光电半导体有限公司', uscc:'91320214MA3EXAMPLE3', region: '江苏省/无锡市/新吴区', addr:'无锡市新吴区太湖国际科技园', rs:'REACHED_INTERESTED', bs:'APPLIED', product:'厂房贷', nature:'民营企业', honor:'高新技术', intent:'高', risk:'中', batch:'厂房贷20160502', batchSource:'auto', lastContact: '今天', ds:95, legalPerson: '周八', status: '存续', entityType: '有限责任公司', indCat: '制造业', indType: '计算机、通信和其他电子设备制造业', regCap: '5亿人民币', regDate: '2020-01-15' },
  { id:7, name:'常州智能制造系统有限公司', uscc:'91320402MAAEXAMPLEC', region: '江苏省/常州市/新北区', addr:'常州市新北区通江南路88号', rs:'FOLLOWING', bs:'REVIEWING', product:'税务贷', nature:'民营企业', honor:'专精特新', intent:'中', risk:'低', batch:'税务贷20160501', batchSource:'auto', lastContact: '5天前', ds:76, legalPerson: '吴九', status: '存续', entityType: '有限责任公司', indCat: '信息传输、软件和信息技术服务业', indType: '软件开发', regCap: '2000万人民币', regDate: '2021-08-08' },
  { id:8, name:'南京云端数据技术有限公司', uscc:'91320114MA8EXAMPLE8', region: '江苏省/南京市/雨花台区', addr:'南京市雨花台区软件大道1号', rs:'REACHED_INTERESTED', bs:'APPROVED', product:'税务贷', nature:'民营企业', honor:'瞪羚企业', intent:'高', risk:'低', batch:'税务贷20160501', batchSource:'auto', lastContact: '3天前', ds:90, legalPerson: '郑十', status: '存续', entityType: '有限责任公司', indCat: '信息传输、软件和信息技术服务业', indType: '互联网和相关服务', regCap: '8000万人民币', regDate: '2017-05-25' },
  { id:9, name:'南通精密机械制造有限公司', uscc:'91320602MA6EXAMPLE6', region: '江苏省/南通市/崇川区', addr:'南通市崇川区工农路20号', rs:'FOLLOWING', bs:'DISBURSED', product:'税务贷', nature:'民营企业', honor:'高新技术', intent:'中', risk:'低', batch:'税务贷20160501', batchSource:'auto', lastContact: '2天前', ds:82, legalPerson: '刘一', status: '存续', entityType: '有限责任公司', indCat: '制造业', indType: '通用设备制造业', regCap: '1500万人民币', regDate: '2014-10-10' },
  { id:10, name:'泰州华科电子科技有限公司', uscc:'91321203MA3EXAMPLED', region: '江苏省/泰州市/高港区', addr:'泰州市高港区科技大道8号', rs:'REACHED_NO_INTEREST', bs:'NONE', product:'橙业贷', nature:'合资企业', honor:'瞪羚企业', intent:'低', risk:'高', batch:'橙业贷20160508', batchSource:'auto', lastContact: '10天前', ds:65, legalPerson: '陈二', status: '注销', entityType: '有限责任公司', indCat: '制造业', indType: '计算机、通信和其他电子设备制造业', regCap: '500万人民币', regDate: '2012-12-12' },
  { id:11, name:'无锡集成电路设计有限公司', uscc:'91320214MA9EXAMPLEB', region: '江苏省/无锡市/滨湖区', addr:'无锡市滨湖区建筑路300号', rs:'PENDING', bs:'NONE', product:'橙业贷', nature:'国有企业', honor:'高新技术', intent:'中', risk:'中', batch:'橙业贷20160510', batchSource:'auto', lastContact: '暂无跟进', ds:70, legalPerson: '王三', status: '存续', entityType: '国有独资', indCat: '科学研究和技术服务业', indType: '专业技术服务业', regCap: '3亿人民币', regDate: '2008-08-08' },
  { id:12, name:'扬州苏仪自控系统有限公司', uscc:'91321002MA4EXAMPLEE', region: '江苏省/扬州市/广陵区', addr:'扬州市广陵区新城路12号', rs:'FOLLOWING', bs:'SETTLED', product:'橙业贷', nature:'民营企业', honor:'专精特新', intent:'高', risk:'低', batch:'橙业贷手工筛选20260615', batchSource:'manual', lastContact: '今天', ds:85, legalPerson: '李梅', status: '存续', entityType: '有限责任公司', indCat: '制造业', indType: '仪器仪表制造业', regCap: '2500万人民币', regDate: '2013-04-18' },
  { id:13, name:'苏州工业机器人研发有限公司', uscc:'91320594MA2EXAMPLEG', region: '江苏省/苏州市/工业园区', addr:'苏州市工业园区独墅湖大道90号', rs:'REACHED_INTERESTED', bs:'APPLIED', product:'橙业贷', nature:'外资企业', honor:'高新技术', intent:'高', risk:'中', batch:'橙业贷手工筛选20260615', batchSource:'manual', lastContact: '1天前', ds:93, legalPerson: '张伟', status: '存续', entityType: '外商独资', indCat: '科学研究和技术服务业', indType: '科技推广和应用服务业', regCap: '1000万美元', regDate: '2022-02-22' },
  { id:14, name:'盐城风电装备制造有限公司', uscc:'91320902MA1EXAMPLEF', region: '江苏省/盐城市/亭湖区', addr:'盐城市亭湖区环保产业园', rs:'UNREACHED_OTHER', bs:'NONE', product:'厂房贷', nature:'国有企业', honor:'无', intent:'低', risk:'低', batch:'厂房贷20160502', batchSource:'auto', lastContact: '7天前', ds:68, legalPerson: '赵云', status: '存续', entityType: '国有控股', indCat: '制造业', indType: '专用设备制造业', regCap: '1.5亿人民币', regDate: '2011-05-15' },
  { id:15, name:'镇江新材料技术有限公司', uscc:'91321102MA3EXAMPLEH', region: '江苏省/镇江市/京口区', addr:'镇江市京口区学府路66号', rs:'PENDING', bs:'NONE', product:'税务贷', nature:'合资企业', honor:'高新技术', intent:'中', risk:'中', batch:'税务贷20160502', batchSource:'auto', lastContact: '暂无跟进', ds:75, legalPerson: '马超', status: '存续', entityType: '中外合资', indCat: '制造业', indType: '化学原料和化学制品制造业', regCap: '6000万人民币', regDate: '2016-09-09' }
];`;
  content = content.replace(oldDataMatch[0], newData);
}

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Field configurations and mock data updated successfully.");
