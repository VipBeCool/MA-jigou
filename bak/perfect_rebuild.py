import re

with open('agents_backup_before_del_old_script.html', 'r', encoding='utf-8') as f:
    html = f.read()

part1_regex = r"(function renderAgentGrid\(list\) \{.*?'<div class=\"amc-sub\">' \+ a\.org \+ ' &middot; ' \+ a\.type \+ ' &middot; 辖区：' \+ a\.region \+ '<br>' \+\s+\(freqLabel\[a\.freq\] \|\| '按周'\) \+ '更新 &middot; ' \+ \(a\.whitelist \? '白名单已启用' : '不启用白名单'\) \+ '</div>' \+)"
match1 = re.search(part1_regex, html, re.DOTALL)

part3_regex = r"(<button class=\"btn btn-outline btn-sm\" style=\"border-color:#ef4444;color:#ef4444;margin-right:16px;\" onclick=\"openDeleteConfirmModal\(\)\">删除智能体</button>'.*)"
match3 = re.search(part3_regex, html, re.DOTALL)

part2 = """
            '</div>' +
            '</div>';
        }).join('');

        const createCardHTML =
          '<div class="agent-main-card create-card" onclick="openWizard()" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; border: 2px dashed var(--gray-300); background: transparent; box-shadow: none; min-height: 250px;">' +
          '<div class="cc-icon" style="width:56px;height:56px;border-radius:14px;background:var(--gray-100);display:flex;align-items:center;justify-content:center;margin-bottom:16px;color:var(--gray-500);transition:all 0.15s;">' +
          '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
          '</div>' +
          '<div style="font-size:16px;font-weight:600;color:var(--gray-800);margin-bottom:8px;">新建智能体</div>' +
          '<div style="font-size:13px;color:var(--gray-500);text-align:center;line-height:1.5;">基于行内指标库<br>配置全新的客群筛选策略</div>' +
          '</div>';

        grid.innerHTML = listHTML + createCardHTML;
      }

      /* ---- 详情抽屉 ---- */
      var currentDrawerAgentId = null;
      var currentDrawerTab = 'batches';

      function openAgentDetail(agentId) {
        currentDrawerAgentId = agentId;
        currentDrawerTab = 'config';
        const a = AGENTS_DATA.find(function (x) { return x.id === agentId; });
        if (!a) return;
        const colorMap = { running: ['#2563eb', '#eff6ff'], paused: ['#d97706', '#fffbeb'], draft: ['#9ca3af', '#f3f4f6'] };
        const c = colorMap[a.status][0], bg = colorMap[a.status][1];
        const freqLabel = { daily: '按天', weekly: '按周', monthly: '按月', manual: '手动触发' };
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
          '\\''
"""
# Replace `\\'` at the very end of part2 with just `'`
part2 = part2[:-3] + "'"

if match1 and match3:
    new_html = html[:match1.start()] + match1.group(1) + part2 + match3.group(1)
    
    broken_wizardNext = """        if (currentStep < TOTAL_STEPS - 1) { currentStep++; updateWizardStep(); }
      function wizardPrev() {"""
    fixed_wizardNext = """        if (currentStep < TOTAL_STEPS - 1) { currentStep++; updateWizardStep(); }
      }
      function wizardPrev() {"""
    new_html = new_html.replace(broken_wizardNext, fixed_wizardNext)

    broken_selectFreq = """      function toggleOutputLimit(val) {
        document.getElementById('wizardOutputLimit').style.display = val ? 'block' : 'none';
      }
      function selectFreq(val) {
        document.getElementById('wizardOutputLimit').style.display = val ? 'block' : 'none';
      }"""
    fixed_selectFreq = """      function toggleOutputLimit(val) {
        document.getElementById('wizardOutputLimit').style.display = val ? 'block' : 'none';
      }"""
    new_html = new_html.replace(broken_selectFreq, fixed_selectFreq)

    with open('agents.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Perfect reconstruction successful!")
else:
    print("Regex match failed.")
