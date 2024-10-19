---
title: "Riddle Three"
description: "Riddle Three for compsigh cascade"
---

## Riddle Three

You are an F1 fan named Jet who somehow ended up at a wild party with the pit crew. The crew got so drunk that they can only change tires in specific patterns. Your task is to help them get the car ready for the race by applying these patterns to achieve the desired tire configuration.

### Input

- A 2 × 2 grid representing the initial tire configuration of the car, where `S` stands for Soft, `M` for Medium, and `H` for Hard.
- Below it is a series of patterns that describe how the tires can be changed.
- Each pattern consists of two 2 × 2 grids.
- They can be applied like a mask, overlaying the pattern's grid onto the current tire configuration, and changing the tires according to the pattern's instructions.
- The change only affects tires that are in the same position, and are of the same "hardness" as the pattern.
- The affected tires are turned into the hardness that is in that position, in the second grid of the pattern.

### Output

The final tire configuration after applying all the patterns in sequence.

### Example input

Initial configuration:

```plaintext
SM
HS
```

Patterns:

```plaintext
MM
#M
SS
#S
```

```plaintext
SH
#H
MM
#M
```

```plaintext
HS
#S
HH
#H
```

### Example output

```plaintext
SS
SS
```

### Explanation

Start with the initial configuration:

```plaintext
SM
HS
```

Apply the first pattern:

```plaintext
MM
#M
SS
#S
```

Result:

```plaintext
SS
HS
```

Apply the second pattern:

```plaintext
SH
HH
SM
SM
```

Result:

```plaintext
SS
SS
```

Congratulations, you helped the pit crew get the car ready for the race!

Grab the full input file [here](/three.txt).

<Input part={3} />
