with open('agents.html', 'r', encoding='utf-8') as f:
    html = f.read()

broken = """        renderDrawerConfig();
        openModal('detailDrawer');
      {"""

fixed = """        renderDrawerConfig();
        openModal('detailDrawer');
      }"""

if broken in html:
    html = html.replace(broken, fixed)
    print("Fixed brace.")
else:
    print("Could not find the brace.")

with open('agents.html', 'w', encoding='utf-8') as f:
    f.write(html)
