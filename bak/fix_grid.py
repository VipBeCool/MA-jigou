with open('agents.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace 1
old_1 = """            '<div class="amc-sub">' + a.org + ' &middot; ' + a.type + ' &middot; 辖区：' + a.region + '<br>' +
            (freqLabel[a.freq] || '按周') + '更新 &middot; ' + (a.whitelist ? '白名单已启用' : '不启用白名单') + '</div>' +

        const createCardHTML ="""

new_1 = """            '<div class="amc-sub">' + a.org + ' &middot; ' + a.type + ' &middot; 辖区：' + a.region + '<br>' +
            (freqLabel[a.freq] || '按周') + '更新 &middot; ' + (a.whitelist ? '白名单已启用' : '不启用白名单') + '</div>' +
            '</div>' +
            '</div>';
        }).join('');

        const createCardHTML ="""

if old_1 in html:
    html = html.replace(old_1, new_1)
    print("Fixed replacement 1")
else:
    print("Failed replacement 1")

# Replace 2
old_2 = """          '<div style="font-size:13px;color:var(--gray-500);text-align:center;line-height:1.5;">基于行内指标库<br>配置全新的客群筛选策略</div>' +
          '</div>';

          '<button class="btn btn-outline btn-sm" style="border-color:#ef4444;color:#ef4444;margin-right:16px;" onclick="openDeleteConfirmModal()">删除智能体</button>' +
          '<button class="modal-close" onclick="closeModal(\\'detailDrawer\\')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        document.querySelectorAll('#drawerTabs .detail-tab').forEach(function (t, i) { t.classList.toggle('active', i === 0); });
        ['config', 'batches', 'whitelist', 'logs'].forEach(function (t) {
          document.getElementById('dtab-' + t).style.display = t === 'config' ? 'block' : 'none';
        });
        renderDrawerConfig();
      function openAgentDetail(agentId) {"""

new_2 = """          '<div style="font-size:13px;color:var(--gray-500);text-align:center;line-height:1.5;">基于行内指标库<br>配置全新的客群筛选策略</div>' +
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
          '<button class="btn btn-outline btn-sm" style="border-color:#ef4444;color:#ef4444;margin-right:16px;" onclick="openDeleteConfirmModal()">删除智能体</button>' +
          '<button class="modal-close" onclick="closeModal(\\'detailDrawer\\')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        document.querySelectorAll('#drawerTabs .detail-tab').forEach(function (t, i) { t.classList.toggle('active', i === 0); });
        ['config', 'batches', 'whitelist', 'logs'].forEach(function (t) {
          document.getElementById('dtab-' + t).style.display = t === 'config' ? 'block' : 'none';
        });
        renderDrawerConfig();
        openModal('detailDrawer');
      }"""

if old_2 in html:
    html = html.replace(old_2, new_2)
    print("Fixed replacement 2")
else:
    print("Failed replacement 2")

with open('agents.html', 'w', encoding='utf-8') as f:
    f.write(html)
