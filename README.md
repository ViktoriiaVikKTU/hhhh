# Lost & Found

A React-based parallax landing page for the **Lost & Found** project.

## Structure

```
src/
├── App.jsx                    # Root component
└── components/
    ├── Header.jsx             # Fixed transparent navigation header
    ├── Header.css
    ├── ParallaxSection.jsx    # Full-viewport hero section with parallax background
    └── ParallaxSection.css
```

## Features

- Fixed transparent header with logo and navigation links (About, Gallery, Contact)
- Full-viewport hero section with a dark parallax background image
- Layered "LOST & FOUND" typographic treatment:
  - Base cream-coloured text layer (`#f4eddd`)
  - Overlay layer (`#litText`) with a radial gradient glow — designed to track cursor position via JavaScript
- "Scroll to explore" prompt that fades in after 6 seconds
