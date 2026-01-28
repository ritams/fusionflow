# ui_ux_design.md

## 1. Design Philosophy: "The Generative Darkroom"
The interface should feel like a high-end darkroom for the digital age. It represents a place where light (images) emerges from darkness.
- **Background:** Pure Hex `#000000` or extremely deep `#030303`. Not grey.
- **Glass:** Panels have high blur (`blur-xl`), low opacity borders (`border-white/10`), and subtle noise texture to ground them.
- **Light:** The only bright colors should be the *content* (the images) and the *active indicators* (selection borders, flow beams).

---

## 2. The Layout Skeleton

### 2.1. The Shell
A full-screen, non-scrolling viewport application.
```
+-------------------------------------------------------+
|  [Top Bar: Project Name | Credits | Export | User]    |
+---+-----------------------------------------------+---+
|   |                                               |   |
| L |                                               | R |
| E |                                               | I |
| F |              INFINITE CANVAS                  | G |
| T |             (The Workspace)                   | H |
|   |                                               | T |
| R |                                               |   |
| A |                                               | R |
| I |                                               | A |
| L |                                               | I |
|   |                                               | L |
+---+-----------------------------------------------+---+
|      [Bottom Timeline (Retractable 200px)]        |
+-------------------------------------------------------+
```

### 2.2. Left Rail (The Asset Vault)
*   **Behavior:** Collapsible, but likely pinned. Width: 280px.
*   **Tabs:**
    *   *Assets:* Uploaded images, videos. Grid view.
    *   *Templates:* Pre-made node graphs (e.g., "Product Shot Workflow").
    *   *History:* Global history of generations.

### 2.3. Right Rail (The Inspector)
*   **Behavior:** Context-aware. If nothing is selected, it shows Project Settings. If a node is selected, it shows *Node Parameters*.
*   **Design:**
    *   **"Jog Wheels":** For values like Steps (1-50) or CFG (1-20), don't use standard browser sliders. Use circular, touch-friendly dials or "scrubbable numbers" (click and drag mouse L/R).
    *   **Prompt Box:** A large, auto-expanding textarea that supports "Entry Syntax" (typing `@` brings up styles/LoRAs).

---

## 3. The Node Design (Crucial)
Nodes in FusionFlow are not just logic blocks; they are **Viewports**.

### Visual Structure of a Node
1.  **Header:**
    *   Small icon (Image/Video/Text).
    *   Title (e.g., "Flux Pro Generator").
    *   Status Dot (Green = Done, Pulsing Blue = Generating, Red = Error).
2.  **Body (The Monitor):**
    *   This is the largest part. It displays the *result* of the node.
    *   Aspect Ratio: Dynamic, matches the generation.
    *   **Hover Actions:** Hovering the image reveals "Quick Actions" (Download, Variation, Upscale).
3.  **Handles:**
    *   Left side: Inputs (Reference Image, Prompt, Mask).
    *   Right side: Outputs (Image, Video, Latent).
    *   *Connection Beams:* Animated SVG paths. When data flows, a pulse travels down the line.

---

## 4. Key UX Interactions

### 4.1. "The Prompt Builder"
Typing a prompt is hard.
*   **Feature:** **Smart Chips**.
    *   User types "Cinematic lighting".
    *   UI suggests a chip: `[Lighting: Cinematic]`.
    *   User accepts. The chip is a distinct object in the prompt box, easily deletable or reorderable.

### 4.2. "Time Travel" (Versioning)
*   **Problem:** You change the seed, the old cool image is gone.
*   **Solution:** The Node Footer has a timeline scrubber.
    *   `< [ Version 5 / 12 ] >`
    *   Clicking `<` instantly swaps the image in the node body to the previous generation and restores the Inspector parameters to what they were *then*.

### 4.3. "Magic Paste"
*   User finds an image on Twitter/Pinterest.
*   User `Ctrl+V` onto the Canvas.
*   **System Action:** Automatically creates a "Reference Image Node" with that image loaded and uploads it to S3 in the background.

### 4.4. "Direct Manipulation"
*   **In-Painting:** Click "Edit" on a node -> The node expands to full screen (Modal). You paint over the mistake. You click "Generate". The mask is saved as part of the node's state.

---

## 5. Mobile Experience
*   **View Only:** The Canvas is too complex for phones to *edit*.
*   **Mobile Companion:** The mobile view is a "Feed" of your generations. You can browse, download, and share, but not build graphs.
