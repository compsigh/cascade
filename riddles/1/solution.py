import re
import os

def solve_maze(grid):
    n = len(grid)
    m = len(grid[0]) if n > 0 else 0
    
    # Directions: 0 = up, 1 = right, 2 = down, 3 = left
    direction_vectors = {
        0: (-1, 0),
        1: (0, 1),
        2: (1, 0),
        3: (0, -1)
    }
    
    # Initialize starting position and direction
    x, y = 0, 0
    direction = 2  # Starting direction is down
    path_chars = [grid[x][y]]
    
    visited = set()
    visited.add(((x, y), direction))
    
    while (x, y) != (n-1, m-1):
        current_char = grid[x][y]
        
        # Change direction based on current cell
        if current_char == 'R':
            direction = (direction + 1) % 4
        elif current_char == 'L':
            direction = (direction - 1) % 4
        elif current_char == '#':
            pass
        else:
            raise ValueError(f"Invalid character '{current_char}' at ({x}, {y})")
        
        # Move to next cell
        dx, dy = direction_vectors[direction]
        new_x, new_y = x + dx, y + dy
        
        # Check boundaries
        if not (0 <= new_x < n and 0 <= new_y < m):
            return ''.join(path_chars)
        
        # Check for cycles
        if (new_x, new_y) in visited:
            raise ValueError(f"Agent revisited cell ({new_x}, {new_y}), possible loop.")
        
        # Move to the new cell
        x, y = new_x, new_y
        path_chars.append(grid[x][y])
        visited.add(((x, y), direction))
    
    return ''.join(path_chars)

# Example usage:
if __name__ == "__main__":
    file = open("riddles/1/input.txt", "r")
    maze = [list(re.sub(r'\s+', '', line)) for line in file]
    solution = solve_maze(maze)
    file.close()
    os.system('cls' if os.name == 'nt' else 'clear')
    print("Solution Path:", solution)
    with open("riddles/1/output.txt", "w") as output_file:
        output_file.write(solution)
