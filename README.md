# compsigh cascade

## Riddle one

You are an old, senile CS professor walking around the twisting halls of Kalmanovitz.

**Input:** You're given a *2D* character array with `R`, `L`, and `#`. Starting from the top left, navigate using the current tile: `R` means right, `L` means left, and `#` means straight. Each turn is relative to your current direction.

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

## Riddle three

You are an F1 fan named Jet who somehow ended up at a wild party with the pit crew. The crew got so drunk that they can only change tires in specific patterns. Your task is to help them get the car ready for the race by applying these patterns to achieve the desired tire configuration.

**Input:** A 2x2 grid representing the initial tire configuration of the car, where `S` stands for Soft, `M` for Medium, and `H` for Hard. Below it, a series of patterns that describe how the tires can be changed. Each pattern consists of two 2x2 grids. They can applies like a mask, overlaying the pattern's grid onto the current tire configuration and changing the tires according to the pattern's instructions. The change only affects tires that are in the same position and are of the same hardness as the pattern, those affected tires are turned into the hardness that is in that positoin in the second grid of the pattern.

**Output:** The final tire configuration after applying all the patterns in sequence.

### Example

**Input:**
Initial Configuration:
```
SM
HS
```
Patterns:
```
MM
#M
SS
#S

SH
#H
MM
#M

HS
#S
HH
#H
```

**Output:**
```
SS
SS
```

### Explanation

1. Start with the initial configuration:
    ```
    SM
    HS
    ```
2. Apply the first pattern:
    ```
    MM
    #M
    SS
    #S
    ```
    Result:
    ```
    SS
    HS
    ```
3. Apply the second pattern:
    ```
    SH
    HH
    SM
    SM
    ```
    Result:
    ```
    SS
    SS
    ```

Congratulations, you helped the pit crew get the car ready for the race!