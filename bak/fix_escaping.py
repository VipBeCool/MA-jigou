with open('agents.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace \\'手动生成\\' with \'手动生成\'
text = text.replace(r"\\'手动生成\\'", r"\'手动生成\'")

with open('agents.html', 'w', encoding='utf-8') as f:
    f.write(text)
