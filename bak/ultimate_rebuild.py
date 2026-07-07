import re

with open('agents_backup_broken.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the known escape error in the string
text = text.replace(r"\\'手动生成\\'", r"\'手动生成\'")

# Find the start of selectFreq
start_idx = text.find('      function selectFreq(freq, el) {')
if start_idx == -1:
    print("Could not find selectFreq")
    exit(1)

# Find the start of openDeleteConfirmModal
end_idx = text.find('      function openDeleteConfirmModal() {')
if end_idx == -1:
    print("Could not find openDeleteConfirmModal")
    exit(1)

part1 = text[:start_idx]
part3 = text[end_idx:]

good_code = """      function selectFreq(freq, el) {
        document.querySelectorAll('.freq-option').forEach(o => o.classList.remove('active'));
        el.classList.add('active');
        const d = document.getElementById('freqDetail');
        if (freq === 'manual') {
          d.innerHTML = '<p style="font-size:13px;color:var(--gray-500);">手动触发：在智能体详情弹窗名单批次tab中，手动拉取名单，不自动跑批生成。</p>';
        } else if (freq === 'weekly') {
          d.innerHTML = `<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
      <span style="font-size:13px;font-weight:500;color:var(--gray-600);">执行日：</span>
      ${['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((wd, i) => `<label style="display:flex;align-items:center;gap:4px;font-size:13px;cursor:pointer;"><input type="checkbox" ${i === 1 ? 'checked' : ''}> ${wd}</label>`).join('')}
      <span style="font-size:13px;font-weight:500;color:var(--gray-600);margin-left:8px;">执行时间：</span>
      <input type="time" class="form-control" value="06:00" style="width:130px;">
    </div>`;
        } else if (freq === 'monthly') {
          d.innerHTML = `
    <div style="margin-bottom:12px;">
      <span style="font-size:13px;font-weight:500;color:var(--gray-600);margin-bottom:8px;display:block;">每月执行日期（多选）：</span>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${Array.from({ length: 31 }, (_, i) => i + 1).map(day => `<div class="day-tag ${day === 1 ? 'selected' : ''}" onclick="this.classList.toggle('selected')">${day}</div>`).join('')}</div>
    </div>
    <div style="display:flex;gap:10px;align-items:center;">
      <span style="font-size:13px;font-weight:500;color:var(--gray-600);">执行时间：</span>
      <input type="time" class="form-control" value="06:00" style="width:130px;">
    </div>`;
        } else if (freq === 'quarterly') {
          d.innerHTML = `
    <div style="margin-bottom:12px;">
      <span style="font-size:13px;font-weight:500;color:var(--gray-600);margin-bottom:8px;display:block;">执行月份（季度的第几个月，多选）：</span>
      <div style="display:flex; gap: 14px; margin-bottom:12px;">
        <label style="display:flex;align-items:center;gap:4px;font-size:13px;cursor:pointer;"><input type="checkbox" checked> 第一个月</label>
        <label style="display:flex;align-items:center;gap:4px;font-size:13px;cursor:pointer;"><input type="checkbox"> 第二个月</label>
        <label style="display:flex;align-items:center;gap:4px;font-size:13px;cursor:pointer;"><input type="checkbox"> 第三个月</label>
      </div>
      <span style="font-size:13px;font-weight:500;color:var(--gray-600);margin-bottom:8px;display:block;">执行日期（多选）：</span>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${Array.from({ length: 31 }, (_, i) => i + 1).map(day => `<div class="day-tag ${day === 1 ? 'selected' : ''}" onclick="this.classList.toggle('selected')">${day}</div>`).join('')}</div>
    </div>
    <div style="display:flex;gap:10px;align-items:center;">
      <span style="font-size:13px;font-weight:500;color:var(--gray-600);">执行时间：</span>
      <input type="time" class="form-control" value="02:00" style="width:130px;">
    </div>`;
        } else {
          d.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><span style="font-size:13px;font-weight:500;color:var(--gray-600);">每日执行时间：</span><input type="time" class="form-control" value="02:00" style="width:130px;"></div>`;
        }
      }

      function toggleListProcess() {
        const type = document.querySelector('input[name="list_process_type"]:checked').value;
        document.getElementById('listProcessConfig').style.display = type === 'direct' ? 'none' : 'block';
      }

      function toggleNoLimit() {
        const cb = document.getElementById('f-noLimit');
        const input = document.getElementById('f-outputLimit');
        input.disabled = cb.checked; input.style.opacity = cb.checked ? '0.4' : '1';
      }

      function openUploadListModal() {
        document.getElementById('uploadListModal').classList.add('show');
      }

      function handleListFileSelect(input) {
        if (input.files && input.files[0]) {
          const filename = input.files[0].name;
          closeModal('uploadListModal');
          addBlacklistFileToUI(filename);
          input.value = ''; // Reset
        }
      }

      function addBlacklistFileToUI(filename) {
        const c = document.getElementById('blacklistFiles');
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:8px 12px;background:var(--gray-50);border-radius:7px;border:1px solid var(--border);';
        row.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    <span style="font-size:13px;font-weight:600;flex:1;">${filename}</span>
    <button onclick="this.parentNode.remove()" style="background:transparent;border:none;cursor:pointer;color:var(--gray-400);padding:0;font-size:16px;">×</button>`;
        c.appendChild(row);
      }

      function toggleWhitelistConfig() {
        document.getElementById('whitelistConfig').style.display = document.getElementById('f-enableWhitelist').checked ? 'block' : 'none';
      }

      /* ---- Step5 字段配置 ---- */
      const FIELD_CONFIG = [
        { key: 'addr', label: '企业地址', checked: true },
        { key: 'nature', label: '企业性质', checked: true },
        { key: 'honor', label: '荣誉标签', checked: true },
        { key: 'intent', label: '意向等级', checked: false },
        { key: 'risk', label: '风险等级', checked: false },
        { key: 'revenue', label: '年营业收入', checked: false },
        { key: 'regCapi', label: '注册资本', checked: false },
        { key: 'establish', label: '成立日期', checked: false },
        { key: 'employees', label: '从业人数', checked: false },
        { key: 'taxLevel', label: '纳税信用', checked: false },
        { key: 'ds', label: '得分', checked: false },
        { key: 'lastContact', label: '最后联系时间', checked: false },
      ];

      function initFieldToggles() {
        const container = document.getElementById('fieldToggles');
        if (!container || container.children.length > 0) return;
        container.innerHTML = FIELD_CONFIG.map(f => `
    <label class="field-toggle-btn" id="ft-${f.key}" onclick="toggleField('${f.key}',this)"
      style="display:flex;align-items:center;gap:7px;padding:8px 10px;border-radius:7px;cursor:pointer;
             border:1.5px solid ${f.checked ? 'var(--brand)' : 'var(--border)'};
             background:${f.checked ? 'var(--brand-light)' : '#fff'};
             font-size:13px;color:${f.checked ? 'var(--brand)' : 'var(--gray-700)'};
             font-weight:${f.checked ? '600' : '400'};transition:all 0.15s;">
      <span class="ft-check" style="width:12px;height:12px;display:flex;align-items:center;justify-content:center;">
        ${f.checked ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
      </span>
      ${f.label}
    </label>`).join('');
        updateFieldCount();
      }

      function updateFieldCount() {
        const c = FIELD_CONFIG.filter(f => f.checked).length;
        document.getElementById('f-selCount').textContent = c;
      }

      function toggleField(key, el) {
        const cfg = FIELD_CONFIG.find(f => f.key === key);
        if (!cfg) return;
        cfg.checked = !cfg.checked;
        el.style.borderColor = cfg.checked ? 'var(--brand)' : 'var(--border)';
        el.style.background = cfg.checked ? 'var(--brand-light)' : '#fff';
        el.style.color = cfg.checked ? 'var(--brand)' : 'var(--gray-700)';
        el.style.fontWeight = cfg.checked ? '600' : '400';
        el.querySelector('.ft-check').innerHTML = cfg.checked
          ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
          : '';
        updateFieldCount();
      }

"""

final_text = part1 + good_code + part3

with open('agents.html', 'w', encoding='utf-8') as f:
    f.write(final_text)
