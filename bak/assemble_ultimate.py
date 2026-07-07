with open('agents_backup_before_fix.html', 'r', encoding='utf-8') as f:
    lines_fix = f.readlines()

with open('agents_backup_before_del_old_script.html', 'r', encoding='utf-8') as f:
    lines_script = f.readlines()

# 1. THE PERFECT HEAD AND CSS
css_part1 = "".join(lines_fix[0:120])
css_part2 = "".join(lines_fix[2045:2749])

# 2. THE PERFECT DOM
dom_part = "".join(lines_fix[2750:3321])

broken_svg = """<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" /></svg>
          下载模板
          </button>"""

fixed_svg = """<button class="btn btn-ghost" onclick="downloadTemplate()" style="display:inline-flex;align-items:center;gap:6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          下载模板
        </button>"""

dom_part = dom_part.replace(broken_svg, fixed_svg)

# 3. THE PERFECT JAVASCRIPT
js_part = "".join(lines_script[1498:2626])

broken_wizard_next = """      function wizardNext() {
        if (currentStep < TOTAL_STEPS - 1) { currentStep++; updateWizardStep(); }
      function updateRulePreview() {"""

fixed_wizard_next = """      function wizardNext() {
        if (currentStep < TOTAL_STEPS - 1) { currentStep++; updateWizardStep(); }
      }
      function updateRulePreview() {"""

js_part = js_part.replace(broken_wizard_next, fixed_wizard_next)

broken_select_freq = """      function selectFreq(freq, el) {
        const cb = document.getElementById('f-noLimit');
        const input = document.getElementById('f-outputLimit');
        input.disabled = cb.checked; input.style.opacity = cb.checked ? '0.4' : '1';
      }"""

fixed_toggle_limit = """      function toggleOutputLimit() {
        const cb = document.getElementById('f-noLimit');
        const input = document.getElementById('f-outputLimit');
        input.disabled = cb.checked; input.style.opacity = cb.checked ? '0.4' : '1';
      }"""

js_part = js_part.replace(broken_select_freq, fixed_toggle_limit)

final_content = css_part1 + css_part2 + "\n" + dom_part + "\n" + js_part

with open('agents.html', 'w', encoding='utf-8') as f:
    f.write(final_content)
    
print("Ultimate Rebuild success.")
