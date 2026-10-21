---
name: Tyree Chappell
description: A product keynote for one engineer; real software unveiled on real hardware in a dark hall.
colors:
  stage: "#050507"
  stage-raised: "#0d0d11"
  graphite: "#1d1d22"
  hairline: "#2a2a31"
  ink: "#f5f5f7"
  ink-muted: "#8e8e95"
  accent: "#4f46e5"
  accent-bright: "#6366f1"
  accent-ink: "#a5b4fc"
  paper: "#ffffff"
  paper-ink: "#1d1d1f"
  paper-body: "#3a3a3c"
  paper-muted: "#86868b"
  paper-rule: "#d2d2d7"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6.4vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  display-close:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 6rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline-read:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.4vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.6vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "\"ss01\", \"cv11\""
  body-sm:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  stat:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.3
    fontFeature: "\"tnum\""
rounded:
  inline: "6px"
  surface: "16px"
  panel: "24px"
  pill: "9999px"
spacing:
  gutter: "20px"
  gutter-sm: "32px"
  shell: "1200px"
  nav: "56px"
  section: "112px"
  section-lg: "160px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-bright}"
  button-secondary:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.hairline}"
  segmented-control:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "4px"
  segmented-control-active:
    backgroundColor: "{colors.stage}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  input-ask:
    backgroundColor: "{colors.stage}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  nav-bar:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    height: "{spacing.nav}"
  assistant-panel:
    backgroundColor: "{colors.stage-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    width: "400px"
  architecture-node:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "16px"
  code-block:
    backgroundColor: "{colors.stage-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "24px"
---

# Design System: Tyree Chappell

## Overview

**Creative North Star: "The Keynote Hall"**

The site is a dark auditorium where one engineer's software is unveiled on hardware. The ground is near-black stage, the light comes from the product, and everything else stays out of its way: aluminium text, graphite controls, one indigo voice. A procedural laptop (the Device) sits in reserved slots in the layout and is lit by painted studio light, not by a renderer's lights. Scroll scrubs it; the page never animates for its own sake.

Density is low and deliberate. Sections breathe at 112 to 160px vertical rhythm, headlines are large and tight-tracked, and body copy sits in muted aluminium at a reading measure. Facts live in HTML (ADR 0001). The 3D Stage is aria-hidden decoration, and when WebGL is absent the same real screens appear as flat posters, so the layout is complete without it.

The resume is the one place the hall turns the lights on: a white Letter sheet with its own paper palette, framed by the dark stage on screen and printed alone.

**Key Characteristics:**
- Near-black stage, aluminium type, one indigo accent reserved for live state and the primary action.
- Geist at display scale, semibold, tracked tight (-0.035em); Geist Mono only for proof stats and code.
- Pill controls on graphite; no outlined boxes and no cards nested in cards.
- Depth comes from painted light on the Device and tonal steps between stage, stage-raised and graphite.
- One authored motion moment (the hero lid reveal); everything else is scroll-scrubbed and damped.

## Colors

A near-monochrome dark palette in cool aluminium greys, with a single FlowPulse indigo family.

### Primary
- **FlowPulse Indigo** (accent): the fill of every primary pill ("See FlowPulse", "Read the case study", "Request a walkthrough", "Download PDF", the Ask submit, the skip link) and the text-selection highlight. It carries white text at AA, which is why it is the fill rather than its brighter sibling.
- **Live Indigo** (accent-bright): the primary pill's hover fill, and the only color for live state: the status dot on a project that is live, the dot on the floating Ask Tyree trigger, the model-loading progress bar.
- **Indigo Ink** (accent-ink): indigo as text on the stage. Used for a live project's status line, the "load the model" action in the Assistant, and the focus ring.

### Neutral
- **Stage Black** (stage): the page ground and the hall itself. Set on `html`, never on `body`, because the Stage canvas sits at z-index -1 behind the body.
- **Raised Stage** (stage-raised): the one tonal step up. Proof band, Contact section, the walkthrough panel on case pages, code blocks and the Assistant panel.
- **Graphite** (graphite): secondary pills, the segmented resume switch, Architecture nodes, inline code, the progress track and the scrollbar thumb.
- **Hairline** (hairline): 1px rules between sections and inside lists, and the secondary pill's hover fill.
- **Aluminium** (ink): headlines, primary text, links.
- **Brushed Aluminium** (ink-muted): body copy, captions, nav links at rest, metadata.

### Resume paper
- **Paper** (paper), **Paper Ink** (paper-ink, names and headings), **Paper Body** (paper-body, running text), **Paper Muted** (paper-muted, list markers) and **Paper Rule** (paper-rule, section underlines). Used only inside the resume sheet; never on the stage.

### Named Rules
**The One Voice Rule.** Indigo appears only on live state and the primary action. A section has at most one indigo pill; every other control is graphite.

**The Live Means Live Rule.** A status line and its dot turn indigo only when the project is actually live (`project.live`); otherwise both are Brushed Aluminium.

**The Ink Link Rule.** Inline links are Aluminium with an underline (muted decoration in long-form, brightening on hover), never indigo. Indigo text is reserved for state and actions.

## Typography

**Display Font:** Geist (with system-ui, sans-serif)
**Body Font:** Geist (with system-ui, sans-serif), stylistic sets ss01 and cv11 on
**Label/Mono Font:** Geist Mono, for proof stats and code only

**Character:** One family doing everything, the way a keynote uses one face: semibold and tight at display size, plain and airy for reading. The mono face appears only where a number or code is the content.

### Hierarchy
- **Display** (600, clamp(2.5rem, 6.4vw, 5.5rem), 1.02): the hero line only, set as one sentence per line, balanced.
- **Display Close** (600, clamp(2.75rem, 7vw, 6rem), 1.02): the Contact sign-off, the one place type reaches the 6rem ceiling. Case-page titles use the same voice at a 5.5rem ceiling.
- **Headline** (600, clamp(2.5rem, 5vw, 4rem), 1.02, -0.035em): section and project names. The Lab heading steps down to clamp(2rem, 4vw, 3rem).
- **Headline Read** (600, clamp(1.75rem, 3.4vw, 2.5rem), 1.08): case-study h2 and the walkthrough heading; 96px above, 24px below.
- **Title** (600, clamp(1.375rem, 2.4vw, 1.875rem)): project beats. **Title Small** (600, 21px): job roles, AI practices, case-study h3, Stack.
- **Lead** (400, clamp(1.0625rem, 1.6vw, 1.3125rem), relaxed): section intros in Brushed Aluminium, 48 to 60ch.
- **Body** (400, 17px, relaxed; 1.7 in case studies): running copy at 52 to 68ch. **Body Small** (16px) for lists and experience bullets.
- **Label** (14px; nav at 13 to 14px) and **Caption** (12px): metadata, status lines, Device captions.
- **Stat** (Geist Mono 400, 22px, tabular figures): proof stat values; the Proof band sets its inline figures in Mono at sentence size.

### Named Rules
**The Mono Is Data Rule.** Geist Mono appears only on proof-stat values and code. Labels, dates and captions stay in Geist (dates use tabular figures instead).

**The 6rem Ceiling Rule.** No type exceeds 6rem. Display tracking is -0.035em; never wider.

## Layout

A single centered shell (max 1200px, 20px gutters, 32px from 640px) carries every section. Sections run 112px top and bottom, 160px from 1024px. The fixed nav is 56px tall on translucent stage with backdrop blur; anchor targets get 80px of scroll padding.

Devices own their space through **stage slots**: empty boxes in the flow that reserve room for the 3D laptop and appear only when `html[data-stage="on"]` (WebGL2 present, no Save-Data). Without it, a **poster** (the same real screen, 16px-rounded image) takes the slot's place, so the layout closes up instead of leaving gaps.

- **Hero:** full-viewport, centered column. The slot is clamp(240px, min(54svh, 72vw), 620px) tall; at 1440x900 the hero laptop renders at about 42vw wide by design, so the headline, Device, caption and both pills all fit in the first viewport. On phones it fills roughly 90vw. The no-WebGL poster is capped at min(44svh, 500px) tall for the same reason.
- **Projects:** a full-width slot (max 1000px) with caption, then a two-column grid of 5fr/7fr from 1024px: a sticky left column (name, tagline, status, stats, actions) and a right column of beats.
- **AI, Experience, Lab:** headline, lead, then three-up (AI practices), 4fr/8fr (jobs) or two-up (Lab) grids, each item topped by a hairline rule.
- **Case pages:** a single 920px article column, body at 68ch, code at 76ch.
- **Resume:** an 8.5in sheet on the stage; print removes the toolbar and margins.

Breakpoints are Tailwind's defaults (640, 768, 1024). Under 768px the Stage drops its pixel-ratio cap from 1.75 to 1.5, and the nav hides Experience to stay on one line.

## Elevation & Depth

Depth comes from light, not shadows. The page is flat tonal layering (stage, raised stage, graphite); the Device carries all the dimensionality, rendered with unlit materials: a canvas-painted aluminium matcap, a painted deck with keys and trackpad, a graphite light pool on the floor, a blurred contact shadow, and an additive indigo-white spill from the screen onto the deck. No scene lights, environment maps or PBR.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 8px 24px rgba(0,0,0,0.45)`): the floating Ask Tyree trigger only.
- **Overlay** (`box-shadow: 0 24px 60px rgba(0,0,0,0.6)`): the open Assistant panel. The resume sheet uses the same geometry at 0.5 to lift paper off the stage; print removes it.

### Named Rules
**The Lit Not Shadowed Rule.** In-flow content never takes a shadow. Shadows exist only on things that float above the page (the Assistant trigger and panel) and on the resume sheet.

**The Painted Studio Rule.** The Stage adds no lights, environment or PBR materials. New surfaces on the Device are painted onto canvases and drawn unlit.

## Shapes

Soft, product-like geometry. Controls are full pills (9999px). Content surfaces (posters, Architecture nodes, code blocks) round at 16px; large containers (the Assistant panel, the case-page walkthrough) at 24px; inline code and the focus ring at 6px. The Device itself is a rounded box (0.04-unit bevel) with a black bezel.

There are no outlined boxes. The only lines are 1px hairline rules: between sections, above list items, under the Assistant header, above the stats grid, and the connectors in Architecture diagrams.

## Components

### Buttons (Pills)
- **Shape:** full pill (9999px), 12px by 24px, 17px medium text, no underline.
- **Primary:** FlowPulse Indigo fill, white text; hover to Live Indigo. One per group.
- **Secondary:** Graphite fill, Aluminium text; hover to Hairline.
- **Press / Focus:** scales to 0.97 on press; background and transform transition over 200ms on the expo ease-out. Focus is a 2px Indigo Ink outline, 3px offset.
- Links and buttons share one class (`pillClass`), so an anchor and an Ask Tyree button are visually identical.

### Segmented control
- The resume variant switch: a Graphite pill track with 4px padding; the current option is a Stage-black pill in Aluminium, others Brushed Aluminium brightening on hover.

### Inputs
- **Ask field:** Stage-black pill inside the raised panel, 14px text, muted placeholder; no border. Focus shows the Indigo Ink outline. The submit is a small primary pill that dims to 50% when disabled.

### Navigation
- Fixed 56px bar, stage at 80% with blur and saturation. Name on the left in semibold Aluminium; links on the right in Brushed Aluminium at 13 to 14px, brightening to Aluminium on hover. No active indicator, no underline.

### Proof stats
- A two-column definition grid under a hairline rule: value in Geist Mono 22px tabular Aluminium, label beneath at 13px Brushed Aluminium.

### Status line
- 14px line with a 6px round dot. Live: Indigo Ink text, Live Indigo dot. Otherwise both Brushed Aluminium.

### The Device and its caption (signature)
- A procedural laptop locked each frame to its stage slot's on-screen box (layout owns placement). Its screen shows real footage stills cross-faded by scroll progress. Every Device or poster carries a 12px centered caption naming the sample data, because the screens contain dollar figures.

### Ask Tyree
- **Trigger:** floating Graphite pill bottom-right with a Live Indigo dot and the Float shadow; hidden while the hero is in view.
- **Panel:** 400px Raised Stage panel, 24px radius, Overlay shadow, hairline-ruled header and footer; full width less 12px gutters on phones. Answers in Aluminium, citations as underlined ink links.

### Architecture diagram
- An HTML diagram: Graphite nodes (16px radius, 16px padding) joined by hairline connectors, left to right from 1024px and top to bottom below. Side services sit under a hairline inside the node at 12px.

### Case-study prose
- Headings carry ids for deep links; body is Brushed Aluminium at 17px and 1.7; strong text is Aluminium; lists use hairline or muted markers; code blocks sit on Raised Stage and scroll inside their box.

### Motion

- **The lid reveal** is the one authored moment: on load the hero Device's lid opens over about 1.8s on an ease-out (power 2.4), slow enough to read as a reveal.
- **Scroll-scrubbed poses:** each Device interpolates enter, rest and exit poses (tilt, turn, lid) across its slot's scroll progress, easing out into rest and easing in on exit. Poses are damped (lambda 7) toward the target, so any motion is interruptible from its current value in either direction.
- **Footage cross-fade:** each still holds for most of its share, then smoothsteps into the next across the middle 20%.
- **Smooth scroll:** Lenis drives the page. Assistant citations "fly the camera" by scrolling through Lenis to the cited section (1.6s, 80px offset) and moving focus there.
- **Shader warm-up:** Devices stay hidden until `compileAsync` resolves, so no Device appears half-compiled and the first frame never blocks on shader linking.
- **UI transitions:** 200ms on cubic-bezier(0.16, 1, 0.3, 1) for pills; 300ms opacity for the floating trigger.
- **Reduced motion:** no Lenis, no lid intro, poses snap to target, citations jump, and CSS transitions collapse to near zero.
- **Rendering:** the Stage renders on demand. Scroll and resize request frames, and Devices request more only while settling.

## Do's and Don'ts

### Do:
- **Do** put indigo on exactly one primary pill per group and on live state; everything else is Graphite or Aluminium.
- **Do** reserve Device space with a stage slot and give it a poster and a sample-data caption.
- **Do** keep display type semibold at -0.035em tracking, and at or under 6rem.
- **Do** separate sections with tonal steps (Stage to Raised Stage) or a 1px Hairline rule.
- **Do** set proof-stat values in Geist Mono with tabular figures.
- **Do** keep the hero laptop at about 42vw on a 1440x900 viewport so both hero pills stay above the fold.
- **Do** paint any new Device surface onto a canvas and draw it unlit.

### Don't:
- **Don't** use indigo for inline links, headings or decoration; links are Aluminium and underlined.
- **Don't** outline boxes or nest a card inside a card; a surface is a tonal fill, never a border.
- **Don't** shadow in-flow content; only the floating Assistant and the resume sheet take shadows.
- **Don't** place a label or eyebrow above a heading; the name lives in the nav.
- **Don't** use gradient text, or Geist Mono for anything but data and code.
- **Don't** add scene lights, environment maps or PBR materials to the Stage.
- **Don't** show Device footage without its sample-data caption.
- **Don't** add a second authored animation; motion comes from scroll.
