import string

def caesar_cipher(text, shift):
    def shift_char(c):
        if c.isalpha():
            start = ord('a') if c.islower() else ord('A')
            return chr(start + (ord(c) - start + shift) % 26)
        return c

    return ''.join(shift_char(c) for c in text)

def decode_caesar_cipher(text, shift):
    return caesar_cipher(text, -shift)

def find_words_in_grid(words, grid):
    indices = []
    for word in words:
        for i, row in enumerate(grid):
            if word in row:
                indices.append((i, row.index(word)))
    return indices

def read_encoded_input(file_path):
    with open(file_path, 'r') as file:
        return file.read().strip()

def read_grid_input(file_path):
    with open(file_path, 'r') as file:
        return [line.strip().split() for line in file]
def read_shift_input(file_path):
    with open(file_path, 'r') as file:
        return int(file.read().strip())
def main():
    encoded_text = read_encoded_input("riddles/2/encodedInput.txt")
    grid = read_grid_input("riddles/2/gridInput.txt")
    
    shift = read_shift_input("riddles/2/shiftInput.txt")

    decoded_text = decode_caesar_cipher(encoded_text, shift)
    decoded_words = decoded_text.split()
    
    indices = find_words_in_grid(decoded_words, grid)
    
    print("Decoded Text:", decoded_text)
    print("Indices of decoded words in the grid:", indices)
    with open("riddles/2/decodedOutput.txt", 'w') as decoded_file:
        decoded_file.write(decoded_text)

    with open("riddles/2/indicesOutput.txt", 'w') as indices_file:
        for index in indices:
            # indices_file.write(f"{index[0]}, {index[1]}\n") # for new lines 
            indices_file.write(', '.join(f"({index[0]}, {index[1]})" for index in indices)) # for comma seperated list

if __name__ == "__main__":
    main()
