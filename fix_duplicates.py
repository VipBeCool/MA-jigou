import re

with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/customers.html', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the EXACT string block that is duplicated and remove it.
# The duplicated old block starts from: `            </div>\n\n            <select class="form-control sort-select" id="filterContact" onchange="doFilter()">`
# Actually, I can just use `multi_replace_file_content` but since the file is large, a python script with exact string replacement is safer.

# Let's read the current file and find where the old <select id="filterContact"> block is.
# The NEW block has `<div class="toolbar-filters">` and ends at `</div>\n          </div>\n        </div>`.
# Then there is another `            </div>\n\n            <select class="form-control sort-select" id="filterContact" onchange="doFilter()">` which is the old block.

# Since I know the old block contains `<option value="有号码">有号码</option>` etc. Let's just find the exact chunk from line 1085 to 1150 and remove it.
# Wait, I will use line-based editing.
lines = content.split('\n')
start_del = -1
end_del = -1
for i, line in enumerate(lines):
    if line.strip() == '<select class="form-control sort-select" id="filterContact" onchange="doFilter()">' and i > 1050:
        # Check if the previous line is `            </div>`
        if '</div>' in lines[i-1] and '</div>' in lines[i-2]:
             start_del = i - 2
             break

if start_del != -1:
    for i in range(start_del, len(lines)):
        if lines[i].strip() == '</div>' and lines[i+1].strip() == '</div>' and 'list-meta' in lines[i+2]:
            end_del = i + 1
            break

if start_del != -1 and end_del != -1:
    del lines[start_del:end_del+1]

with open('/Users/becool/Documents/联合征信/智能营销平台/营销平台Antig/bank-workbench/customers.html', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Deleted from {start_del} to {end_del}")
