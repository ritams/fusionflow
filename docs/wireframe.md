

# FusionFlow MVP

## Wireframe-Level UI Specification

(Storyboard-first, UGC-first, Web)

---

## SCREEN 0: Landing → “Create Project” Modal

### Trigger

* User clicks “New Project”
* Or first-time user lands here automatically

---

### Modal Layout (centered, fixed width ~640px)

**Header**

* Title: “Create a new campaign”
* Subtitle: “We’ll generate a starting storyboard for you”

---

**Section 1: Basics**

* Campaign Name (text input)
* Goal (dropdown)

  * Awareness
  * Engagement
  * Conversion

---

**Section 2: Platforms**

* Checkbox grid with icons:

  * Instagram Reels
  * Instagram Feed
  * YouTube Shorts
  * Meta Ads

On select:

* Duration auto-fills below (read-only):

  * “Target: 7–15s”

---

**Section 3: Brand**
Two radio options:

◉ Select existing brand
○ Quick brand

If **Quick brand** selected (inline expand):

* Brand name
* Voice sliders (3 horizontal sliders):

  * Casual ↔ Professional
  * Bold ↔ Soft
  * Playful ↔ Serious
* Visual tone sliders:

  * Raw ↔ Polished
  * Minimal ↔ Busy
* Optional: Upload reference (small dropzone)

---

**Footer**

* Primary CTA: **Create storyboard**
* Secondary: Cancel

---

### On submit

* Modal closes
* User lands in **Storyboard Mode**
* Initial storyboard auto-generated

No loading screen. Skeleton cards appear immediately.

---

## SCREEN 1: App Shell (Persistent)

### Overall Layout (Desktop Web)

```
------------------------------------------------
Top Bar
------------------------------------------------
| Left Rail | Main Canvas (Storyboard) | Inspector |
------------------------------------------------
```

---

### Top Bar (height ~56px)

**Left**

* FusionFlow logo
* Campaign name (inline editable)

**Center**

* Creative Context Pill:

  * [IG Reel] [15s] [Awareness]
* Hover tooltip shows:

  * Platforms
  * Goal
  * Brand name
* Click → Context Editor modal

**Right**

* Adapt
* Variants
* Export
* User avatar

---

### Left Rail (icon-only, ~56px wide)

Icons stacked vertically:

1. Storyboard (active)
2. Brand
3. Assets
4. Audio
5. Versions

Hover shows label.

---

### Right Rail (Inspector, ~320px wide)

Default content:

* Brand Summary (until a scene is selected)

---

## SCREEN 2: Storyboard Mode (Home Screen)

This is where users spend 80% of time.

---

### Main Canvas Layout

* Horizontal scroll container
* Single row of Scene Cards
* No vertical scroll

Padding left/right so first/last card are centered-ish.

---

### Scene Card (Default State)

**Dimensions**

* Width ~280–320px
* Height ~380px

---

**Top Section**

* Scene number (top-left)
* Duration bar (top-right)

  * Visually elastic (pill bar)
  * Drag left/right to adjust

---

**Middle Section (Visual Preview)**

* 16:9 or 9:16 thumbnail (platform-aware)
* If empty: soft placeholder with icon
* Overlaid text preview (faded)

---

**Bottom Section**

* Intent line (1–2 lines, editable)

  * Example: “Hook viewer with a relatable moment”
* Icons row:

  * Camera icon (Handheld)
  * Audio icon (voice/music present or empty)

---

**Hover Actions (top-right overlay)**

* Duplicate
* Delete
* Lock scene

---

### Selected Scene State

* Card slightly scales up
* Blue outline
* Right Inspector updates to Scene Inspector

---

### Empty Slot Behavior (within a scene)

* If visual missing:

  * “Generate visual” button appears
* If text missing:

  * Placeholder text: “Add overlay”

---

## SCREEN 3: Scene Inspector (Right Rail)

Appears when a Scene Card is selected.

---

### Section 1: Scene Header

* “Scene 2”
* Lock toggle (scene-level)

---

### Section 2: Intent

**Editable Text Area**

* Natural language
* Multiline

**Quick Action Buttons**

* More punch
* More casual
* Less salesy

Clicking button:

* Shows loading shimmer
* Updates intent + preview only
* Does NOT change duration or structure

---

### Section 3: Visual

**Thumbnail**

* Current asset preview

**Brand Fit Indicator**

* Green dot: On-brand
* Yellow dot: Borderline
* Red dot: Off-brand (flag icon)

If Red:

* Tooltip explaining mismatch
* Button: “Regenerate on-brand”

**Actions**

* Replace
* Regenerate
* Lock asset

---

### Section 4: Text Overlays

List of overlays (usually 1–2):

Each item:

* Inline editable text
* Lock toggle

Locked overlays never regenerate.

---

### Section 5: Camera & Motion

Dropdowns:

* Camera:

  * Static
  * Handheld
  * Push
* Motion feel:

  * Natural
  * Energetic
  * Raw

Changes update preview silently.

---

### Section 6: Audio

**Voiceover**

* Text input
* Voice style dropdown

**Music**

* Tag selector (e.g. “Upbeat”, “Chill”)

**Preview button**

* Plays only this scene

---

## SCREEN 4: Brand Mode

Accessed via Left Rail.

---

### Main Canvas: Brand Summary

Read-only card showing:

* Brand name
* Voice sliders (visual only)
* Visual tone sliders
* Constraints list
* Reference thumbnails

Button: **Edit Brand**

---

### Brand Editor (Modal)

Same layout as Quick Brand, but expanded.

On Save:

* Modal closes
* Prompt appears (toast-style, not modal):

  > “Brand updated. Apply to storyboard?”

Buttons:

* Apply to all
* Review changes
* Ignore

---

### Review Changes

* Opens temporary diff view:

  * Each scene listed
  * Preview thumbnail
  * Accept / Skip per scene

---

## SCREEN 5: Assets Mode

---

### Main Canvas: Asset Grid

Grid of thumbnails:

* Generated
* Uploaded

Each tile shows:

* Usage count
* Brand fit dot

---

### Asset Click → Asset Inspector (Right Rail)

Shows:

* Larger preview
* Used in Scene 1, 3, 5
* Replace everywhere
* Replace in selected scene

No regeneration triggered automatically.

---

## SCREEN 6: Audio Mode

---

### Layout

**Left**

* Vertical list of scenes

**Center**

* Voiceover text blocks per scene

**Right**

* Voice controls:

  * Style
  * Pace
  * Emotion

Clicking a scene highlights corresponding storyboard card.

---

## SCREEN 7: Variants Modal

Triggered from Top Bar.

---

### Modal Layout

* Title: “Create Variants”

Fields:

* Dimension:

  * Hook
  * CTA
  * Visual style
* Number of variants (2–10)

CTA: **Generate**

---

### Result

* New storyboards created
* Shown as tabs or list under project
* Original remains unchanged

---

## SCREEN 8: Adapt Modal

---

### Modal

* Title: “Adapt storyboard”

Options:

* Platform
* Duration

Preview section:

* Before / After scene list

CTA: **Apply**

---

## SCREEN 9: Export Modal

---

### Modal

Auto-filled:

* Platform formats
* Aspect ratios
* File names

Checkbox:

* Include watermark

CTA: **Export**

Export happens async.

---

## SCREEN 10: Versions Mode

---

### Main Canvas

Vertical list:

* Timestamp
* Change summary
* Source (User / AI)

Button per item:

* Restore (creates new version)

---
