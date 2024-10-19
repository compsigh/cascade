---
title: "The Riddle"
description: "The Riddle for compsigh cascade"
---

You are Father Fitz. You thought retiring would spare you from being degraded by a bunch of computer science students, but alas, that is not the case.

Perhaps ironically, but all too unsurprisingly, you haven't stepped foot in Harney in years. The layout of the building is a complete mystery to you.

You've decided that, actually, maybe another term would be nice. You must wipe your resignation email from the servers in Harney. Find your way through the twisting halls, enter the server room, and enter the code to wipe the data.

### Input

You're given a 2D character array with `R`, `L`, and `#`. Starting from the top left facing down, navigate using the current tile: `R` means right, `L` means left, and `#` means continue straight. Each turn is relative to the current direction you're facing.

### Output

List every tile you visit, from start to finish, as a string. No special formatting necessary. You start and end on `#`.

### Example

An input of:

```plaintext
# R R #
L L R #
R # # #
# L # #
```

Should yield an output of:

```plaintext
#LLRRRL#L##
```

Grab the input file [here](/input.txt).

<Input />
