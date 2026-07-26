# Apple-Style Cover Flow Gallery Implementation Plan

## Project Context
- **Project**: ux-ui-gallery (React + Vite + Tailwind CSS + Framer Motion)
- **Location**: `C:\Users\Laptop\Downloads\Rough Pad\One Page Love\ux-ui-gallery`
- **Existing Component**: `src/components/CoverFlowGallery.jsx` (uses Framer Motion horizontal scroll - NOT true 3D Cover Flow)
- **Data Source**: `src/data/designTemplates.js` - 78 design objects with `{ id, image, title, colors, ... }`

## Goal
Replace existing `CoverFlowGallery.jsx` with a **pristine, hardware-accelerated Apple-style Cover Flow** built from scratch using raw CSS 3D transforms (not Framer Motion for the 3D track).

---

## Component API

```jsx
<CoverFlowGallery
  cards={designTemplates}           // Array<{ id, image, title, ...otherData }>
  onCardClick={(card) => {}}        // Called ONLY when CENTER card is clicked
  isPopupOpen={false}               // When true: pause auto-scroll completely
/>
```

---

## 1. Visual Architecture & 3D Math

### Container Setup
```css
.coverflow-container {
  perspective: 1000px;
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
  overflow: hidden;
}
```

### Track & Card Transforms
| State | Transform | Opacity | Z-Index |
|-------|-----------|---------|---------|
| **Center (index === activeIndex)** | `translateZ(200px) rotateY(0deg)` | 1.0 | 100 |
| **Left side (index < activeIndex)** | `translateX(-offset) translateZ(-depth) rotateY(45deg)` | 0.7 | descending |
| **Right side (index > activeIndex)** | `translateX(+offset) translateZ(-depth) rotateY(-45deg)` | 0.7 | descending |
| **Far left/right (beyond visible count)** | `opacity: 0; visibility: hidden` | 0 | 1 |

### Responsive Visible Card Count
| Breakpoint | Visible Side Cards (each side) | Total Visible |
|------------|-------------------------------|---------------|
| Mobile (< 640px) | 1 | 3 |
| Tablet (640-1024px) | 2 | 5 |
| Desktop (>= 1024px) | 3 | 7 |
| Large Desktop (>= 1440px) | 4 | 9 |

### Card Dimensions
- **Width**: 320px (responsive: 280px mobile, 320px tablet, 360px desktop)
- **Aspect Ratio**: 4:5 (320×400)
- **Gap between cards (visual)**: Calculated via translateX offsets

### Transition
```css
.coverflow-card {
  transition: 
    transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.5s ease,
    z-index 0.5s step-end;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}
```

---

## 2. Interaction Rules (Critical)

### Click Behavior
```javascript
const handleCardClick = (index, card) => {
  if (index === activeIndex) {
    // Center card → open popup
    onCardClick(card);
  } else {
    // Side card → navigate to it (NO popup)
    setActiveIndex(index);
  }
};
```

### Keyboard Navigation
- `ArrowRight` → next card (index + 1)
- `ArrowLeft` → previous card (index - 1)
- `Enter` / `Space` on focused card → `onCardClick(card)`

---

## 3. Scroll Hijacking & Wheel Handling (Strict Requirements)

### Event Listener Setup
```javascript
useEffect(() => {
  const container = containerRef.current;
  const handleWheel = (e) => {
    // CRITICAL: Must use passive: false
    // CRITICAL: Must call preventDefault() to stop page scroll
  };
  container.addEventListener('wheel', handleWheel, { passive: false });
  return () => container.removeEventListener('wheel', handleWheel, { passive: false });
}, []);
```

### Throttle: One Card Per Scroll
```javascript
const lastScrollTime = useRef(0);
const SCROLL_THROTTLE_MS = 450; // 400-500ms range

const handleWheel = (e) => {
  const now = Date.now();
  if (now - lastScrollTime.current < SCROLL_THROTTLE_MS) return;
  lastScrollTime.current = now;

  e.preventDefault(); // STOP page scroll
  e.stopPropagation();

  const direction = e.deltaY > 0 ? 1 : -1; // down = next, up = prev
  const newIndex = Math.max(0, Math.min(cards.length - 1, activeIndex + direction));
  setActiveIndex(newIndex);
};
```

### Touch/Swipe Support
- Track `touchstart` clientX
- On `touchend`, calculate deltaX
- Threshold: 50px minimum swipe
- Same throttle logic applies

---

## 4. Auto-Scroll Logic

### Interval Configuration
- **Interval**: 3000ms (3 seconds)
- **Direction**: Forward only (index + 1, loop to 0)

### Pause Conditions (ALL must be false to run)
```javascript
const isPaused = isHovered || isTouching || isPopupOpen;
```

### Effect Dependencies
```javascript
useEffect(() => {
  if (isPaused) {
    clearInterval(autoPlayRef.current);
    return;
  }
  autoPlayRef.current = setInterval(() => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  }, 3000);
  return () => clearInterval(autoPlayRef.current);
}, [isHovered, isTouching, isPopupOpen, cards.length]);
```

### Hover/Touch Tracking
```javascript
const [isHovered, setIsHovered] = useState(false);
const [isTouching, setIsTouching] = useState(false);

<div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  onTouchStart={() => setIsTouching(true)}
  onTouchEnd={() => setIsTouching(false)}
>
```

---

## 5. Implementation Strategy

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/CoverFlowGallery.jsx` | **REPLACE** | New implementation from scratch |
| `src/components/CoverFlowCard.jsx` | **CREATE** | Individual card component with image, title, badges |
| `src/components/CoverFlowNavigation.jsx` | **CREATE** | Dots + prev/next buttons (optional but recommended) |
| `src/styles/CoverFlow.css` | **CREATE** | Raw CSS for 3D transforms, transitions, responsive breakpoints |
| `src/hooks/useCoverFlow.js` | **CREATE** | Custom hook for scroll logic, auto-play, keyboard |

### Why Separate CSS File?
- Raw CSS 3D transforms need precise control
- Framer Motion's `useTransform` adds overhead for 60fps 3D
- `will-change`, `backface-visibility`, `transform-style` work best in static CSS
- Media queries for responsive visible card count

### Why Custom Hook?
- Separates 3D math from React rendering
- Easier to test scroll logic in isolation
- Reusable if another Cover Flow needed

---

## 6. Card Component (`CoverFlowCard.jsx`)

### Props
```jsx
{
  card: { id, image, title, colors, skill, category, ... },
  isCenter: boolean,
  isAdjacent: boolean, // index === activeIndex ± 1
  isVisible: boolean,  // within visible range
  onClick: () => void,
  style: { transform, opacity, zIndex } // computed by parent
}
```

### Visual States
| State | Styles |
|-------|--------|
| Center | Full color, no grayscale, max shadow, `cursor: pointer` |
| Adjacent | 0.7 opacity, grayscale(0.4), slight blur |
| Far | 0 opacity, hidden |

### Accessibility
- `role="button"` on center card only
- `aria-pressed={isCenter}` on center
- `tabIndex={isCenter ? 0 : -1}`
- `aria-label` includes title + "centered" or "click to focus"

---

## 7. Responsive Breakpoints (CSS)

```css
/* Mobile: 1 side card visible */
@media (max-width: 639px) {
  .coverflow-card:nth-child(n + 4) { opacity: 0; visibility: hidden; }
  .coverflow-card:nth-last-child(n + 4) { opacity: 0; visibility: hidden; }
}

/* Tablet: 2 side cards */
@media (min-width: 640px) and (max-width: 1023px) {
  .coverflow-card:nth-child(n + 6) { opacity: 0; visibility: hidden; }
  .coverflow-card:nth-last-child(n + 6) { opacity: 0; visibility: hidden; }
}

/* Desktop: 3 side cards */
@media (min-width: 1024px) and (max-width: 1439px) {
  .coverflow-card:nth-child(n + 8) { opacity: 0; visibility: hidden; }
  .coverflow-card:nth-last-child(n + 8) { opacity: 0; visibility: hidden; }
}

/* Large: 4 side cards */
@media (min-width: 1440px) {
  .coverflow-card:nth-child(n + 10) { opacity: 0; visibility: hidden; }
  .coverflow-card:nth-last-child(n + 10) { opacity: 0; visibility: hidden; }
}
```

---

## 8. 3D Transform Calculation (JS)

```javascript
const CARD_WIDTH = 320; // base, responsive via CSS
const PERSPECTIVE = 1000;
const CENTER_Z = 200;
const SIDE_ROTATE = 45; // degrees
const SIDE_Z = -150;
const SPACING = 180; // horizontal gap between card centers

const getCardTransform = (index, activeIndex, visibleCount) => {
  const offset = index - activeIndex;
  const absOffset = Math.abs(offset);
  
  // Beyond visible range
  if (absOffset > visibleCount) {
    return { transform: 'translateX(-9999px)', opacity: 0, zIndex: 1 };
  }
  
  if (offset === 0) {
    // CENTER
    return {
      transform: `translateZ(${CENTER_Z}px) rotateY(0deg)`,
      opacity: 1,
      zIndex: 100
    };
  }
  
  const direction = offset > 0 ? 1 : -1; // right = positive, left = negative
  const x = direction * (SPACING * absOffset);
  const z = SIDE_Z * (absOffset - 1) - 50; // push back progressively
  const rotateY = direction * SIDE_ROTATE * (absOffset === 1 ? 1 : 0.8);
  
  return {
    transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`,
    opacity: 0.7,
    zIndex: 50 - absOffset
  };
};
```

---

## 9. Integration with Parent (GalleryView)

The parent `GalleryView.jsx` currently passes:
```jsx
<CoverFlowGallery
  designs={designs}
  onDesignClick={onDesignClick}
  selectedIndex={selectedIndex}
  onIndexChange={setSelectedIndex}
/>
```

New API compatibility:
```jsx
<CoverFlowGallery
  cards={designs}
  onCardClick={onDesignClick}        // maps to onDesignClick
  isPopupOpen={!!selectedDesign}     // maps to modal open state
  // selectedIndex / onIndexChange handled internally via activeIndex
/>
```

**Note**: Parent manages `selectedDesign` state for modal. CoverFlow only receives `isPopupOpen` boolean.

---

## 10. Implementation Task List

### Phase 1: Core Infrastructure
- [ ] Create `src/styles/CoverFlow.css` with all 3D transforms, transitions, responsive hiding
- [ ] Create `src/hooks/useCoverFlow.js` with:
  - [ ] `activeIndex` state + setter
  - [ ] Wheel handler with `{ passive: false }` + throttle
  - [ ] Touch swipe handler with threshold
  - [ ] Auto-play interval with pause conditions
  - [ ] Keyboard navigation
  - [ ] Responsive visible count calculation

### Phase 2: Components
- [ ] Create `src/components/CoverFlowCard.jsx` with image, title, badges, accessibility
- [ ] Create `src/components/CoverFlowNavigation.jsx` (dots + arrows)
- [ ] Replace `src/components/CoverFlowGallery.jsx` with new implementation

### Phase 3: Integration & Polish
- [ ] Update `GalleryView.jsx` to use new props
- [ ] Test scroll hijacking on page (verify page doesn't scroll)
- [ ] Test auto-pause on hover/touch/popup
- [ ] Test click behavior: center = popup, side = focus
- [ ] Verify 60fps on desktop/mobile (Chrome DevTools Performance)
- [ ] Run `npm run lint` and `npm run build`

---

## 11. Acceptance Criteria

| Requirement | Verification |
|-------------|--------------|
| True 3D Cover Flow (perspective + rotateY) | Inspect element → computed transform shows `rotateY(±45deg) translateZ()` |
| Hardware accelerated | DevTools → Rendering → "Layer borders" shows promoted layers |
| One card per wheel tick | Fast scroll → advances exactly 1 card per 450ms |
| Page doesn't scroll when over gallery | Wheel on gallery → page stays put |
| Auto-scroll pauses on hover | Hover 5s → no advance |
| Auto-scroll pauses on touch | Touch hold 5s → no advance |
| Auto-scroll pauses when `isPopupOpen=true` | Open modal → wait 5s → no advance |
| Center click → `onCardClick` | Click center → modal opens |
| Side click → focus only | Click side → card centers, no modal |
| Responsive visible cards | Resize viewport → side cards fade in/out correctly |
| Keyboard nav works | Arrow keys / Enter navigate correctly |
| 60fps animation | Performance tab shows <16ms/frame |

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Framer Motion overhead on 3D track | Use raw CSS transforms on track; only use Framer Motion for card hover/tap micro-interactions |
| `passive: false` listener on non-passive container | Attach to gallery container ref, not window |
| Mobile touch scrolling conflicts | `touch-action: pan-y` on container; only preventDefault on horizontal swipe |
| Z-index flickering during transition | Use `step-end` timing for z-index transition |
| Image loading causes layout shift | Set explicit aspect-ratio on card containers; use skeleton loaders |

---

## 13. Out of Scope
- Framer Motion animations on the 3D track (use CSS)
- Infinite loop carousel (stop at ends, don't wrap)
- Vertical Cover Flow
- Server-side rendering considerations
- Image optimization (handled by existing Pexels utility)

---

## 14. Next Steps

**Ready for implementation.** The plan is complete and addresses all requirements. The implementation agent should:

1. Create the CSS file first (foundation)
2. Build the custom hook (logic)
3. Build card + navigation components
4. Assemble in new CoverFlowGallery
5. Integrate with GalleryView
6. Verify all acceptance criteria

**Question for clarification before implementation:**
1. Should the gallery **loop infinitely** (after last card, next goes to first) or **stop at ends**? (Plan assumes stop at ends per Apple Cover Flow behavior)
2. Should the **card click area** be the entire card or just a specific "open" button? (Plan assumes entire center card)
3. Any specific **easing curve** preference beyond `cubic-bezier(0.25, 0.46, 0.45, 0.94)`?