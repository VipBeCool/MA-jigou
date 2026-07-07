with open('agents.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Check if lines 1601 to 1628 are the duplicate code. (1-indexed lines 1602 to 1629)
if "currentDrawerAgentId = agentId;" in lines[1601] and "      }\n" == lines[1628]:
    # Delete lines 1601 to 1628
    del lines[1601:1629]
    print("Deleted duplicate lines.")
    with open('agents.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)
else:
    print("Could not match the lines correctly.")
    print("Line 1602:", repr(lines[1601]))
    print("Line 1629:", repr(lines[1628]))
