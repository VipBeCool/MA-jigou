import sys

def trace_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()

    stack = []
    lines = text.split('\n')
    for i, line in enumerate(lines):
        # Extremely simple check ignoring strings and comments
        # This is just for a quick heuristic
        in_string = False
        string_char = ''
        escape = False
        
        for j, char in enumerate(line):
            if escape:
                escape = False
                continue
            if char == '\\':
                escape = True
                continue
            if char in ("'", '"', '`'):
                if not in_string:
                    in_string = True
                    string_char = char
                elif string_char == char:
                    in_string = False
            
            if not in_string:
                if char == '{':
                    stack.append((i+1, j+1))
                    print(f"OPEN {{ at {i+1}:{j+1} depth {len(stack)}")
                elif char == '}':
                    if not stack:
                        print(f"EXTRA }} at {i+1}:{j+1} depth {len(stack)}: {line}")
                        return
                    top = stack.pop()
                    print(f"CLOSE }} at {i+1}:{j+1} depth {len(stack)} matched OPEN at {top[0]}:{top[1]}")

trace_braces('/tmp/test_agents.js')
