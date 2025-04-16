import random
import string
import requests

"""
Puzzle Description:

1. Given a jumbled sentence, decode it using a Caesar Cipher (words are separated by spaces).
2. After decoding, search through a 2D grid for the decoded words.
3. Return the indices of all decoded words in the grid.

Example:

Input:
text: "cqrb rb j cnbc"
shift: 9
grid: [
    ["hello", "test", "what"],
    ["cascade", "october", "is"],
    ["a", "this", "output", "compsigh"]
]

Output:
[(0, 1), (1, 2), (2, 0), (2, 1)]  # The order of indices may vary

Explanation:
Decoded text: "This is a test"
The locations of the decoded words in the grid are returned as output.

Note:
- For constructing the grid, build a lexicon of text and randomly select words, ensuring that the input terms are present.
"""
def caesar_cipher(text, shift):
    def shift_char(c):
        if c.isalpha():
            start = ord('a') if c.islower() else ord('A')
            return chr(start + (ord(c) - start + shift) % 26)
        return c

    return ''.join(shift_char(c) for c in text)

def generate_riddle(words, grid_size, shift):
    # Select words to be in the grid
    selected_words = random.sample(words, grid_size[0] * grid_size[1])
    
    # Create the grid
    grid = [selected_words[i:i + grid_size[1]] for i in range(0, len(selected_words), grid_size[1])]
    
    # Select words to be in the jumbled text
    jumbled_words = random.sample(selected_words, random.randint(1, len(selected_words)))
    
    # Create the jumbled text
    jumbled_text = ' '.join(jumbled_words)
    
    # Encode the jumbled text using Caesar Cipher
    encoded_text = caesar_cipher(jumbled_text, shift)
    
    return encoded_text, shift, grid

def fetch_words():
    response = requests.get("https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt")
    words = response.text.split()
    return words

def create_unique_grid(words, grid_size):
    selected_words = random.sample(words, grid_size[0] * grid_size[1])
    grid = [selected_words[i:i + grid_size[1]] for i in range(0, len(selected_words), grid_size[1])]
    return grid

def generate_riddle_with_random_shift(words, grid_size):
    grid = create_unique_grid(words, grid_size)
    jumbled_words = random.sample([word for row in grid for word in row], random.randint(1, len(grid) * len(grid[0])))
    jumbled_text = ' '.join(jumbled_words)
    shift = random.randint(1, 25)
    encoded_text = caesar_cipher(jumbled_text, shift)
    return encoded_text, shift, grid

# Fetch words from the online dictionary
words = fetch_words()

# Generate the riddle with a 10x100 grid and random shift
grid_size = (10, 100)
encoded_text, shift, grid = generate_riddle_with_random_shift(words, grid_size)

print("Encoded Text:", encoded_text)
print("Shift:", shift)
print("Grid:")
for row in grid:
    print(row)

    # Save the encoded text to a file
    with open("riddles/2/encodedInput.txt", "w") as encoded_file:
        encoded_file.write(encoded_text)

    # Save the grid to a file
    with open("riddles/2/gridInput.txt", "w") as grid_file:
        for row in grid:
            grid_file.write(' '.join(row) + '\n')
# Save the shift to a file
with open("riddles/2/shiftInput.txt", "w") as shift_file:
    shift_file.write(str(shift))