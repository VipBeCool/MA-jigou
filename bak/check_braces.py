import sys

def check_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()

    stack = []
    lines = text.split('\n')
    for i, line in enumerate(lines):
        # Extremely simple check ignoring strings and comments
        # This is just for a quick heuristic
        for j, char in enumerate(line):
            if char == '{':
                stack.append((i+1, j+1))
            elif char == '}':
                if not stack:
                    print(f"Extra closing brace at line {i+1}:{j+1}: {line}")
                    return
                stack.pop()

    if stack:
        print("Unclosed braces:")
        for loc in stack:
            print(f"Line {loc[0]}:{loc[1]}")
    else:
        print("Braces matched perfectly (heuristic).")

check_braces('/tmp/test_agents.js')
