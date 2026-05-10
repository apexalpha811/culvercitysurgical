---
name: "Culver City Surgical Specialists"
theme: "light"

colors:
  neutral:
    shade-0: "#FFFFFF"
    shade-1: "#F2F2F2"
    shade-2: "#D9D9D9"
    shade-3: "#B3B3B3"
    shade-4: "#808181"
    shade-5: "#4D4E4F"
    shade-6: "#1B1C1D"
    shade-7: "#020304"
    white: "#FFFFFF"
  pelorous:
    shade-1: "#EDF8F9"
    shade-2: "#DBF2F3"
    shade-3: "#81D1D7"
    shade-4: "#4BBEC6"
    shade-5: "#3C989E"
    shade-6: "#1E4C4F"
    shade-7: "#16393B"
  tan:
    shade-1: "#FAF7F3"
    shade-2: "#F6EFE7"
    shade-3: "#E0C7AD"
    shade-4: "#D4AF8A"
    shade-5: "#A98C6E"
    shade-6: "#544637"
    shade-7: "#3F3429"
  spring-wood:
    shade-1: "#FEFEFD"
    shade-2: "#FDFDFC"
    shade-3: "#FAF9F7"
    shade-4: "#F9F7F4"
    shade-5: "#C7C5C3"
    shade-6: "#636261"
    shade-7: "#4A4A49"
  pickled-bluewood:
    shade-1: "#E9EBED"
    shade-2: "#D4D8DC"
    shade-3: "#6B7784"
    shade-4: "#2C3E50"
    shade-5: "#233140"
    shade-6: "#111820"
    shade-7: "#0D1218"

typography:
  heading:
    fontFamily: "Fraunces"
    fontWeight: 500
  body:
    fontFamily: "Inter"
    fontWeight: 400
  sizes:
    desktop:
      h1: 84px
      h2: 60px
      h3: 48px
      h4: 40px
      h5: 32px
      h6: 26px
      text-large: 26px
      text-medium: 20px
      text-regular: 18px
      text-small: 16px
      text-tiny: 12px
    mobile:
      h1: 48px
      h2: 44px
      h3: 32px
      h4: 24px
      h5: 20px
      h6: 18px
      text-large: 18px
      text-medium: 16px
      text-regular: 14px
      text-small: 12px
      text-tiny: 10px

ui:
  style: "sleek"
  buttonRadius: 6px
  tagRadius: 4px
  inputRadius: 6px

cards:
  style: "outlined"
  borderWidth: 1px
  dividerWidth: 1px
  radiusLarge: 8px
  radiusMedium: 8px
  radiusSmall: 8px

schemes:
  - name: "Scheme 1"
    background: "neutral-shade-0"
    backgroundHex: "#FFFFFF"
    foregroundHex: "#FFFFFF"
    textHex: "#020304"
    accentHex: "#020304"
    borderValue: "#02030426"
    useLogoVariant: light
    cssClass: "scheme-1"
  - name: "Scheme 2"
    background: "chromatic1-shade-7"
    backgroundHex: "#16393B"
    foregroundHex: "#16393B"
    textHex: "#ffffff"
    accentHex: "#ffffff"
    borderValue: "#ffffff33"
    useLogoVariant: dark
    cssClass: "scheme-2"
  - name: "Scheme 3"
    background: "chromatic1-shade-6"
    backgroundHex: "#1E4C4F"
    foregroundHex: "#1E4C4F"
    textHex: "#ffffff"
    accentHex: "#ffffff"
    borderValue: "#ffffff33"
    useLogoVariant: dark
    cssClass: "scheme-3"
  - name: "Scheme 4"
    background: "neutral-shade-2"
    backgroundHex: "#D9D9D9"
    foregroundHex: "#D9D9D9"
    textHex: "#020304"
    accentHex: "#020304"
    borderValue: "#02030426"
    useLogoVariant: light
    cssClass: "scheme-4"
---

# Culver City Surgical Specialists — Design Specification

This file contains machine-readable design tokens in the YAML frontmatter above, and human-readable guidance below.

## Colors

The design uses a **light** theme with a neutral palette and 4 chromatic palettes.

- **Neutral shades** range from shade-0 (darkest) to shade-7 (lightest), plus white
- **Pelorous** — primary shade: `#4BBEC6`
- **Tan** — primary shade: `#D4AF8A`
- **Spring Wood** — primary shade: `#F9F7F4`
- **Pickled Bluewood** — primary shade: `#2C3E50`

Use the CSS custom properties from `react/globals.css` for all colors (e.g. `--color-neutral-darkest`, `--color-blue-ribbon`).

## Typography

Headings use **Fraunces** at weight 500. Body text uses **Inter** at weight 400.

The type scale has desktop and mobile sizes. Apply mobile sizes at smaller breakpoints. All values are in `react/globals.css`.

## UI Elements

UI style is **sleek** with button radius 6px. Cards use the **outlined** style with border-width 1px.

## Color Schemes

Sections use color schemes to control their visual appearance. Each scheme is derived from a single background color — all other colors (text, foreground, accent, border) are automatically computed for optimal contrast.

| Scheme | Background | Text | Accent | Logo | CSS class |
|--------|-----------|------|--------|------|-----------|
| Scheme 1 | Neutral White (#FFFFFF) | #020304 | #020304 | light | `.scheme-1` |
| Scheme 2 | Pelorous Darkest (#16393B) | #ffffff | #ffffff | dark | `.scheme-2` |
| Scheme 3 | Pelorous Darker (#1E4C4F) | #ffffff | #ffffff | dark | `.scheme-3` |
| Scheme 4 | Neutral Lighter (#D9D9D9) | #020304 | #020304 | light | `.scheme-4` |

Apply a scheme by adding its CSS class to the section element. See `sitemap.md` for which scheme each section uses.

### Tweaking Schemes

To create visual variation, you can change which scheme a section uses. When switching schemes:

- Swap the CSS class (e.g. change `.scheme-1` to `.scheme-2`)
- All child elements automatically inherit the correct text, accent, and border colors
- Use the matching logo variant (`logo-light.svg` or `logo-dark.svg`) based on the scheme's `useLogoVariant`
- Alternate between light and dark schemes to create visual rhythm
