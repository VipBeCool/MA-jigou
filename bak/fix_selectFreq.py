import re

with open('agents.html', 'r', encoding='utf-8') as f:
    text = f.read()

bad_pattern = r"function selectFreq\(freq, el\).*?function toggleNoLimit\(\) \{"

good_code = """function selectFreq(freq, el) {
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

      function selectListProcess() {
        const type = document.querySelector('input[name="list_process_type"]:checked').value;
        document.getElementById('listProcessConfig').style.display = type === 'direct' ? 'none' : 'block';
      }

      function toggleNoLimit() {"""

text = re.sub(bad_pattern, good_code, text, flags=re.DOTALL)

with open('agents.html', 'w', encoding='utf-8') as f:
    f.write(text)
