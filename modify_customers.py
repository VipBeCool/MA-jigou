import re
import json

with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/customers.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update filter text: 负责客户经理 -> 跟进客户经理
content = content.replace('<option value="ALL">负责客户经理</option>', '<option value="ALL">跟进客户经理</option>')

# 2. Add filterOrg next to filterOwner
org_select = """
            <select class="form-control sort-select" id="filterOrg" onchange="doFilter()">
              <option value="ALL">所属机构</option>
              <option value="姑苏支行">姑苏支行</option>
              <option value="工业园区支行">工业园区支行</option>
              <option value="吴中支行">吴中支行</option>
              <option value="鼓楼支行">鼓楼支行</option>
              <option value="建邺支行">建邺支行</option>
              <option value="惠山支行">惠山支行</option>
              <option value="新吴支行">新吴支行</option>
              <option value="京口支行">京口支行</option>
              <option value="亭湖支行">亭湖支行</option>
            </select>
            <select class="form-control sort-select" id="filterOwner" onchange="doFilter()">
"""
content = content.replace('<select class="form-control sort-select" id="filterOwner" onchange="doFilter()">', org_select)


# 3. Update filterState and doFilter
content = content.replace("let filterState = { rs: 'ALL', bs: 'ALL', product: 'ALL', batch: 'ALL', quick: '', owner: 'ALL' };",
                          "let filterState = { rs: 'ALL', bs: 'ALL', product: 'ALL', batch: 'ALL', quick: '', owner: 'ALL', org: 'ALL' };")

dofilter_additions_1 = """
  const fRisk = document.getElementById('filterRisk').value;
  const fOwner = document.getElementById('filterOwner') ? document.getElementById('filterOwner').value : 'ALL';
  const fOrg = document.getElementById('filterOrg') ? document.getElementById('filterOrg').value : 'ALL';
"""
content = re.sub(r"const fRisk = .*?;\n.*?const fOwner = .*?;", dofilter_additions_1.strip(), content, count=1)

dofilter_additions_2 = """
    if (fOwner !== 'ALL' && c.owner !== fOwner) return false;
    if (fOrg !== 'ALL' && c.org !== fOrg) return false;
    return true;
"""
content = content.replace("if (fOwner !== 'ALL' && c.owner !== fOwner) return false;\n    return true;", dofilter_additions_2.strip())


# 4. Modify columns definition
new_columns = """
const allColumns = [
  { key: 'name', label: '企业名称', fixed: true, default: true },
  { key: 'uscc', label: '统一社会信用代码', fixed: true, default: false },
  { key: 'region', label: '区域', fixed: false, default: false },
  { key: 'org', label: '所属机构', fixed: false, default: true },
  { key: 'owner', label: '跟进客户经理', fixed: false, default: true },
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
"""
content = re.sub(r"const allColumns = \[.*?\];", new_columns.strip(), content, flags=re.DOTALL)


# 5. Remove banner logic and set select value
banner_removal = """
  if (ownerParam) {
    filterState.owner = ownerParam;
    const ownerSel = document.getElementById('filterOwner');
    if (ownerSel) { ownerSel.value = ownerParam; }
    const advFilters = document.getElementById('advancedFilters');
    if (advFilters) advFilters.style.display = 'block';
  }
  if (orgParam) {
    filterState.org = decodeURIComponent(orgParam);
    const orgSel = document.getElementById('filterOrg');
    if (orgSel) {
      let decodedOrg = decodeURIComponent(orgParam);
      // Check if option exists, if not, add it
      let exists = Array.from(orgSel.options).some(opt => opt.value === decodedOrg);
      if(!exists) {
        let newOption = new Option(decodedOrg, decodedOrg);
        orgSel.add(newOption);
      }
      orgSel.value = decodedOrg;
    }
    const advFilters = document.getElementById('advancedFilters');
    if (advFilters) advFilters.style.display = 'block';
  }
"""
content = re.sub(r"if \(ownerParam\) \{.*?\}  if \(orgParam\) \{.*?\}", banner_removal.strip() + "\n", content, flags=re.DOTALL)


# 6. Add 'org' to ALL_DATA
content = content.replace(" owner:'u1', name:'苏州智云科技有限公司'", " owner:'u1', org:'姑苏支行', name:'苏州智云科技有限公司'")
content = content.replace(" owner:'u7', name:'苏州生物医药研究院有限公司'", " owner:'u7', org:'姑苏支行', name:'苏州生物医药研究院有限公司'")
content = content.replace(" owner:'u3', name:'常州新能源科技股份有限公司'", " owner:'u3', org:'武进支行', name:'常州新能源科技股份有限公司'")
content = content.replace(" owner:'u4', name:'南京创新智造集团有限公司'", " owner:'u4', org:'建邺支行', name:'南京创新智造集团有限公司'")
content = content.replace(" owner:'u1', name:'苏州纳米智能装备有限公司'", " owner:'u1', org:'姑苏支行', name:'苏州纳米智能装备有限公司'")
content = content.replace(" owner:'u5', name:'无锡光电半导体有限公司'", " owner:'u5', org:'惠山支行', name:'无锡光电半导体有限公司'")
content = content.replace(" owner:'u3', name:'常州智能制造系统有限公司'", " owner:'u3', org:'武进支行', name:'常州智能制造系统有限公司'")
content = content.replace(" owner:'u4', name:'南京云端数据技术有限公司'", " owner:'u4', org:'建邺支行', name:'南京云端数据技术有限公司'")
content = content.replace(" owner:'u8', name:'南通精密机械制造有限公司'", " owner:'u8', org:'崇川支行', name:'南通精密机械制造有限公司'")
content = content.replace(" owner:'u7', name:'泰州华科电子科技有限公司'", " owner:'u7', org:'高港支行', name:'泰州华科电子科技有限公司'")
content = content.replace(" owner:'u5', name:'无锡集成电路设计有限公司'", " owner:'u5', org:'惠山支行', name:'无锡集成电路设计有限公司'")
content = content.replace(" owner:'u2', name:'扬州苏仪自控系统有限公司'", " owner:'u2', org:'工业园区支行', name:'扬州苏仪自控系统有限公司'")
content = content.replace(" owner:'u1', name:'苏州工业机器人研发有限公司'", " owner:'u1', org:'姑苏支行', name:'苏州工业机器人研发有限公司'")
content = content.replace(" owner:'u6', name:'盐城风电装备制造有限公司'", " owner:'u6', org:'亭湖支行', name:'盐城风电装备制造有限公司'")
content = content.replace(" owner:'u2', name:'镇江新材料技术有限公司'", " owner:'u2', org:'京口支行', name:'镇江新材料技术有限公司'")
content = content.replace(" owner:'u9', name:'苏州半导体封装技术有限公司'", " owner:'u9', org:'吴中支行', name:'苏州半导体封装技术有限公司'")
content = content.replace(" owner:'u9', name:'苏州古城文旅发展有限公司'", " owner:'u9', org:'吴中支行', name:'苏州古城文旅发展有限公司'")
content = content.replace(" owner:'u3', name:'南京量子计算研究院有限公司'", " owner:'u3', org:'鼓楼支行', name:'南京量子计算研究院有限公司'")
content = content.replace(" owner:'u6', name:'无锡物联网产业园有限公司'", " owner:'u6', org:'新吴支行', name:'无锡物联网产业园有限公司'")
content = content.replace(" owner:'u8', name:'南京鼓楼医疗器械有限公司'", " owner:'u8', org:'鼓楼支行', name:'南京鼓楼医疗器械有限公司'")

# 7. Add columns in renderTable body
# The renderTable body loops over `allColumns` and outputs `td`.
# Let's verify how renderTable outputs td. Wait, looking at customers.html, renderTable uses a hardcoded tbHtml generation or loops over columns?
# Let's check renderTable.
