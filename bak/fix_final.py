with open('agents_backup_broken.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the only syntax error in the file
text = text.replace(r"\\'手动生成\\'", r"\'手动生成\'")

with open('agents.html', 'w', encoding='utf-8') as f:
    f.write(text)
