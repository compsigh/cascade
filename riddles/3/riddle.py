import random

def generate_initial_configuration():
    tires = ['S', 'M', 'H']
    return [[random.choice(tires) for _ in range(2)] for _ in range(2)]

def generate_pattern():
    tires = ['S', 'M', 'H', '#']
    pattern = [[random.choice(tires) for _ in range(2)] for _ in range(2)]
    result = []
    for row in pattern:
        new_row = []
        for cell in row:
            if cell == '#':
                new_row.append('#')
            else:
                new_row.append(random.choice(['S', 'M', 'H']))
        result.append(new_row)
    return pattern, result

def pattern_to_string(pattern, result):
    pattern_str = '\n'.join([''.join(row) for row in pattern])
    result_str = '\n'.join([''.join(row) for row in result])
    return f"{pattern_str}\n{result_str}"

def save_patterns_to_file(initial_config, patterns, filename):
    with open(filename, 'w') as file:
        initial_str = '\n'.join([''.join(row) for row in initial_config])
        file.write(f"{initial_str}\n\n")
        for pattern, result in patterns:
            file.write(f"{pattern_to_string(pattern, result)}\n\n")

def main():
    initial_config = generate_initial_configuration()
    print("Initial Configuration:")
    for row in initial_config:
        print(''.join(row))
    n = 100  # Number of patterns to generate
    patterns = [generate_pattern() for _ in range(n)]
    print("\nGenerated Patterns:")
    for pattern, result in patterns:
        print(pattern_to_string(pattern, result))
    save_patterns_to_file(initial_config, patterns, '/home/jet/Documents/cascade/riddles/3/riddle.txt')

if __name__ == "__main__":
    main()