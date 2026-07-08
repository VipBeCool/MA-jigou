import re

with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/customers.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Using regex to inject org into each dictionary in ALL_DATA
org_mapping = {
    "苏州智云科技有限公司": "姑苏支行",
    "苏州生物医药研究院有限公司": "姑苏支行",
    "常州新能源科技股份有限公司": "武进支行",
    "南京创新智造集团有限公司": "建邺支行",
    "苏州纳米智能装备有限公司": "姑苏支行",
    "无锡光电半导体有限公司": "惠山支行",
    "常州智能制造系统有限公司": "武进支行",
    "南京云端数据技术有限公司": "建邺支行",
    "南通精密机械制造有限公司": "崇川支行",
    "泰州华科电子科技有限公司": "高港支行",
    "无锡集成电路设计有限公司": "惠山支行",
    "扬州苏仪自控系统有限公司": "工业园区支行",
    "苏州工业机器人研发有限公司": "姑苏支行",
    "盐城风电装备制造有限公司": "亭湖支行",
    "镇江新材料技术有限公司": "京口支行",
    "苏州半导体封装技术有限公司": "吴中支行",
    "苏州古城文旅发展有限公司": "吴中支行",
    "南京量子计算研究院有限公司": "鼓楼支行",
    "无锡物联网产业园有限公司": "新吴支行",
    "南京鼓楼医疗器械有限公司": "鼓楼支行",
}

for name, org in org_mapping.items():
    # find something like name:'苏州智云科技有限公司' and replace it with org:'...', name:'...'
    pattern = r"name:'" + name + r"'"
    replacement = f"org:'{org}', name:'{name}'"
    content = re.sub(pattern, replacement, content)

with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/customers.html', 'w', encoding='utf-8') as f:
    f.write(content)
