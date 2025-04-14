# compsigh cascade

## Riddle one

You are an old, senile CS professor walking around the twisting halls of Kalmanovitz.

**Input:** You're given a _2D_ character array with `R`, `L`, and `#`. Starting from the top left, navigate using the current tile: `R` means right, `L` means left, and `#` means straight. Each turn is relative to your current direction.

**Output:** List every tile you visit from start to finish. You start and end on `#`.

### Example

**Input:**

```
# R R #
L L R #
R # # #
# L # #
```

**Output:**

```
#LLRRRL#L##
```

## Riddle two

You are given a jumbled sentence encoded with a Caesar Cipher and a 2D grid of words.

**Input:** A string `text` encoded with a Caesar Cipher, an integer `shift` representing the cipher shift, and a 2D list `grid` containing words.

**Output:** The decoded sentence and the list of indices where each word of the decoded sentence appears in the grid.

### Example

**Input:**

```
text: "cqrb rb j cnbc"
shift: 9
grid: [
    ["hello", "test", "what"],
    ["cascade", "october", "is"],
    ["a", "this", "output", "compsigh"]
]
```

**Output:**

```
Decoded Text: "this is a test"
Indices: (2, 1), (1, 2), (2, 0), (0, 1)
```

TODO: @edward how do you want the output formatted?
