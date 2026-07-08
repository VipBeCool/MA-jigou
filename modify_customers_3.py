import re

with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/customers.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Empty State
empty_state_repl = """
        <!-- 空状态 -->
        <div class="empty-state" id="emptyState" style="display:none; text-align:center; padding:100px 0;">
          <div style="display:inline-flex; align-items:center; justify-content:center; width:80px; height:80px; background:var(--gray-100); border-radius:50%; margin-bottom:16px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"></path><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
          </div>
          <div style="font-size:15px; font-weight:500; color:var(--gray-600); margin-bottom:8px;">暂无数据</div>
          <div style="font-size:13px; color:var(--gray-400);">没有找到符合当前筛选条件的客户</div>
        </div>
"""
content = re.sub(r'<!-- 空状态 -->\s*<div class="empty-state" id="emptyState" style="display:none;">.*?</div>\s*</div>', empty_state_repl.strip() + '\n      </div>', content, flags=re.DOTALL)

# 2. Update display:none to display:block for advanced filters
content = content.replace(
    '<div class="toolbar-advanced" id="advancedFilters" style="display:none; padding:16px; background:var(--gray-50); border-radius:12px; border:1px solid var(--border); width:100%; box-sizing:border-box;">',
    '<div class="toolbar-advanced" id="advancedFilters" style="display:block; padding:16px; background:var(--gray-50); border-radius:12px; border:1px solid var(--border); width:100%; box-sizing:border-box;">'
)

# 3. Update the filter arrow
content = content.replace(
    '<svg id="advFilterArrow" style="width:14px;height:14px;flex-shrink:0;transition:transform 0.2s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    '<svg id="advFilterArrow" style="width:14px;height:14px;flex-shrink:0;transition:transform 0.2s;transform:rotate(180deg);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'
)

# 4. Filter text updates
content = content.replace('<option value="ALL">所属机构</option>', '<option value="ALL">对接机构</option>')
content = content.replace('<option value="ALL">跟进客户经理</option>', '<option value="ALL">对接客户经理</option>')


# 5. Extract filters and reorder them
# Wait, rather than extracting, let's just write the whole block out. It's safer.
filters_html = """
            <div class="toolbar-filters">
            <!-- 级联多选区域组件 -->
            <div class="custom-cascader" id="regionCascader">
              <div class="custom-singleselect-display" id="regionCascaderDisplay" onclick="toggleRegionCascader(event)">
                <span class="custom-singleselect-text" id="regionCascaderText">区域</span>
                <span style="display:flex;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </div>
              <div class="cascader-dropdown" id="regionCascaderDropdown" style="display:none;">
                <div class="cascader-columns">
                  <!-- 省份列 -->
                  <div class="cascader-col" id="colProv"></div>
                  <div class="cascader-divider"></div>
                  <!-- 城市列 -->
                  <div class="cascader-col" id="colCity"></div>
                  <div class="cascader-divider"></div>
                  <!-- 区县列 -->
                  <div class="cascader-col" id="colDist"></div>
                </div>
                <div class="cascader-footer">
                  <div class="cascader-selected-count">已选: <span id="regionSelCount">0</span> 项</div>
                  <div style="display:flex;gap:8px;">
                    <button class="btn btn-default btn-sm" onclick="resetRegionCascader(event)">重置</button>
                    <button class="btn btn-primary btn-sm" onclick="confirmRegionCascader(event)">确定</button>
                  </div>
                </div>
              </div>
            </div>

            <select class="form-control sort-select" id="filterProduct" onchange="doFilter()">
              <option value="ALL">适配产品</option>
              <option value="橙业贷">橙业贷</option>
              <option value="厂房贷">厂房贷</option>
              <option value="税务贷">税务贷</option>
            </select>
            
            <select class="form-control sort-select" id="filterOrg" onchange="doFilter()">
              <option value="ALL">对接机构</option>
              <option value="苏州市分行">苏州市分行</option>
              <option value="姑苏支行">姑苏支行</option>
              <option value="工业园区支行">工业园区支行</option>
              <option value="吴中支行">吴中支行</option>
              <option value="南京市分行">南京市分行</option>
              <option value="鼓楼支行">鼓楼支行</option>
              <option value="建邺支行">建邺支行</option>
              <option value="无锡市分行">无锡市分行</option>
              <option value="惠山支行">惠山支行</option>
              <option value="新吴支行">新吴支行</option>
            </select>
            
            <select class="form-control sort-select" id="filterOwner" onchange="doFilter()">
              <option value="ALL">对接客户经理</option>
              <option value="u1">朱某人</option>
              <option value="u7">钱伟东</option>
              <option value="u2">王芳</option>
              <option value="u3">张伟</option>
              <option value="u4">陈静</option>
              <option value="u5">李磊</option>
              <option value="u6">赵小雨</option>
              <option value="u8">孙秀英</option>
              <option value="u9">周明辉</option>
            </select>

            <select class="form-control sort-select" id="filterNature" onchange="doFilter()">
              <option value="ALL">企业性质</option>
              <option value="国有企业">国有企业</option>
              <option value="民营企业">民营企业</option>
              <option value="外资企业">外资企业</option>
              <option value="合资企业">合资企业</option>
            </select>
            
            <select class="form-control sort-select" id="filterHonor" onchange="doFilter()">
              <option value="ALL">荣誉标签</option>
              <option value="专精特新">专精特新</option>
              <option value="高新技术">高新技术</option>
              <option value="瞪羚企业">瞪羚企业</option>
              <option value="独角兽企业">独角兽企业</option>
            </select>
            
            <select class="form-control sort-select" id="filterIntent" onchange="doFilter()">
              <option value="ALL">资金意向</option>
              <option value="高">高意向</option>
              <option value="中">中意向</option>
              <option value="低">低意向</option>
            </select>
            
            <select class="form-control sort-select" id="filterRisk" onchange="doFilter()">
              <option value="ALL">违约风险</option>
              <option value="低">低风险</option>
              <option value="中">中风险</option>
              <option value="高">高风险</option>
            </select>

            <select class="form-control sort-select" id="filterContact" onchange="doFilter()">
              <option value="ALL">联系方式</option>
              <option value="有号码">有号码</option>
              <option value="无号码">无号码</option>
            </select>
          </div>
"""

content = re.sub(r'<div class="toolbar-filters">.*?</div>\s*</div>\s*</div>', filters_html.strip() + '\n          </div>\n        </div>', content, flags=re.DOTALL)

with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/customers.html', 'w', encoding='utf-8') as f:
    f.write(content)
