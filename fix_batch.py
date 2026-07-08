import re

with open('customers.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Tabs block
content = content.replace('''        <!-- Tab 切换按钮 -->
        <div class="filter-tabs">
          <button class="filter-tab-btn active" id="tabStatusBtn" onclick="switchFilterTab('status')">按状态</button>
          <button class="filter-tab-btn" id="tabBatchBtn" onclick="switchFilterTab('batch')">按名单批次</button>
        </div>

''', '')

# 2. Unwrap filterTabContentStatus
content = content.replace('''        <!-- Tab 1: 按状态 -->
        <div id="filterTabContentStatus" style="display:block;">''', '')

content = content.replace('''          </div>
        </div>

        <!-- Tab 2: 按产品批次（客户来源平铺单独展示） -->''', '''          </div>

        <!-- Tab 2: 按产品批次（客户来源平铺单独展示） -->''')

# 3. Remove filterTabContentBatch
# It starts at <!-- Tab 2... and ends before <!-- 快速筛选 -->
content = re.sub(r'\s*<!-- Tab 2: 按产品批次.*?</div>\s*<!-- 快速筛选 -->', '\n\n        <!-- 快速筛选 -->', content, flags=re.DOTALL)

# 4. Insert filterBatch select into toolbar-filters
select_html = '''            <!-- 级联多选区域组件 -->
            <select class="form-control sort-select" id="filterBatch" onchange="doFilter()">
              <option value="ALL">名单批次</option>
              <optgroup label="橙业贷">
                <option value="橙业贷20160508">橙业贷20160508</option>
                <option value="橙业贷20160509">橙业贷20160509</option>
                <option value="橙业贷20160510">橙业贷20160510</option>
                <option value="橙业贷20260615">橙业贷20260615</option>
              </optgroup>
              <optgroup label="厂房贷">
                <option value="厂房贷20160501">厂房贷20160501</option>
                <option value="厂房贷20160502">厂房贷20160502</option>
              </optgroup>
              <optgroup label="税务贷">
                <option value="税务贷20160501">税务贷20160501</option>
                <option value="税务贷20160502">税务贷20160502</option>
              </optgroup>
            </select>'''
content = content.replace('            <!-- 级联多选区域组件 -->', select_html)

# 5. Fix JS
# Remove switchFilterTab function
content = re.sub(r'function switchFilterTab.*?}\n', '', content, flags=re.DOTALL)
# Remove switchFilterTab('status') call
content = content.replace("  switchFilterTab('status');\n", "")
# Update doFilter for batch
content = content.replace("if (filterState.batch !== 'ALL' && c.batch !== filterState.batch) return false;", "const fBatch = document.getElementById('filterBatch') ? document.getElementById('filterBatch').value : 'ALL';\n    if (fBatch !== 'ALL' && c.batch !== fBatch) return false;")
# Update resetAllFilters
content = content.replace("filterState = { rs: 'ALL', bs: 'ALL', product: 'ALL', batch: 'ALL', quick: '', owner: 'ALL', org: 'ALL' };", "filterState = { rs: 'ALL', bs: 'ALL', product: 'ALL', batch: 'ALL', quick: '', owner: 'ALL', org: 'ALL' };\n  if(document.getElementById('filterBatch')) document.getElementById('filterBatch').value = 'ALL';")

with open('customers.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
