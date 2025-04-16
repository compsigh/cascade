def read_riddle_file(filename):
    with open(filename, 'r') as file:
        lines = file.read().strip().split('\n\n')
    
    initial_config = [list(line) for line in lines[0].split('\n')]
    patterns = []
    
    for pattern_block in lines[1:]:
        pattern_lines = pattern_block.split('\n')
        pattern = [list(pattern_lines[i]) for i in range(2)]
        result = [list(pattern_lines[i]) for i in range(2, 4)]
        patterns.append((pattern, result))
    
    return initial_config, patterns

def apply_pattern(config, pattern, result):
    new_config = [row[:] for row in config]
    
    for i in range(2):
        for j in range(2):
            if pattern[i][j] != '#' and config[i][j] == pattern[i][j]:
                new_config[i][j] = result[i][j]
    
    return new_config

def solve_riddle(filename):
    initial_config, patterns = read_riddle_file(filename)
    
    current_config = initial_config
    for pattern, result in patterns:
        current_config = apply_pattern(current_config, pattern, result)
    
    return current_config

def print_config(config):
    for row in config:
        print(''.join(row))

if __name__ == "__main__":
    filename = 'riddles/3/input.txt'
    final_config = solve_riddle(filename)
    print("Final Configuration:")
    print_config(final_config)
    with open('riddles/3/output.txt', 'w') as file:
        for row in final_config:
            file.write(''.join(row) + '\n')