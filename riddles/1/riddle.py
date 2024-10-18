import random

def generate_maze(n, m):
    # Initialize the grid
    grid = [['' for _ in range(m)] for _ in range(n)]
    
    # Set the first row to 'R'
    for j in range(m):
        grid[0][j] = 'R'
    
    # Set the left wall to 'L'
    for i in range(n):
        grid[i][0] = 'L'
    
    # Set the right wall to 'R'
    for i in range(n):
        grid[i][m-1] = 'R'
    
    # Set the bottom wall to 'L'
    for j in range(m):
        grid[n-1][j] = 'L'
    
    # Set the starting cell
    grid[0][0] = '#'
    
    # Fill in the rest of the grid randomly
    for i in range(1, n-1):
        for j in range(1, m-1):
            if grid[i][j] == '':
                grid[i][j] = random.choice(['R', 'L', '#'])
    
    return grid

# Example usage:
n = 100
m = 100
maze = generate_maze(n, m)
print("Generated Maze:")
for row in maze:
    print(' '.join(row))
try:
    with open('riddles/1/input.txt', 'w') as f:
        for row in maze:
            f.write(' '.join(row) + '\n')
    print("Maze saved to 'input.txt'")
except IOError as e:
    print(f"An error occurred while saving the maze: {e}")
# Example usage:
n = 100
m = 100
maze = generate_maze(n, m)
print("Generated Maze:")
for row in maze:
    print(' '.join(row))
try:
    with open('riddles/1/input.txt', 'w') as f:
        for row in maze:
            f.write(' '.join(row) + '\n')
    print("Maze saved to 'input.txt'")
except IOError as e:
    print(f"An error occurred while saving the maze: {e}")
