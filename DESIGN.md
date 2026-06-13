---
name: Brasseries de Suisse
description: Carte interactive des brasseries répertoriées en Suisse.
direction: Palette terre + bière, honnête et chaleureuse. Pas d'effets clinquants.
---

colors:
  background: "#FAF6EE"      # ivoire chaud
  surface: "#FFFFFF"
  ink: "#2A1F14"             # encre brun foncé
  ink-muted: "#6B5A48"       # encre secondaire
  primary: "#B8651A"         # ambre / orange-brun (accent principal)
  primary-strong: "#8C4A12"  # ambre foncé (hover)
  secondary: "#5C7A3D"       # vert mousse (éléments secondaires)
  visited: "#D97A2F"         # orange brûlé (pin visitée — distinct du primary)
  warning: "#C44A2C"

typography:
  family-sans: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  family-mono: "ui-monospace, 'SF Mono', Menlo, monospace"
  size-base: 16px
  size-small: 14px
  size-title: 22px
  weight-regular: 400
  weight-semibold: 600

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px

rounded:
  sm: 4px
  md: 8px
  lg: 12px
  pill: 999px

components:
  header:
    background: surface
    border-bottom: "1px solid #E5DCC8"
    padding: md
    layout: title à gauche, search-input centré, compteur à droite

  search-input:
    background: background
    border: "1px solid #C8B89E"
    rounded: md
    padding: "8px 12px"
    placeholder: "Rechercher une brasserie..."
    focus-ring: primary

  brewery-pin-default:
    color: primary
    size: 28px
    description: Pin Leaflet teinté à la couleur primary

  brewery-pin-visited:
    color: visited
    size: 28px
    description: Pin Leaflet teinté en orange brûlé (distinct du primary)

  brewery-popup:
    background: surface
    rounded: md
    padding: md
    title: "weight-semibold, ink"
    meta: "ink-muted, size-small"
    link-website: "primary, underline on hover"

  visited-button:
    background: secondary
    color: surface
    rounded: pill
    padding: "6px 14px"
    label-not-visited: "Marquer comme visitée"
    label-visited: "Marquer comme non visitée"

  footer:
    background: surface
    border-top: "1px solid #E5DCC8"
    padding: md
    text: "ink-muted, size-small"
    content: "X brasseries affichées"
