# Design Brief: Fuhrpark- und Wartungsmanagement

## 1. App Analysis

### What This App Does
This is a **Fleet & Maintenance Management System** for a bus company. It tracks a fleet of buses (vehicles), their maintenance schedules, and completed maintenance work. The system connects four apps: buses (fleet inventory), maintenance types (what kinds of maintenance exist), maintenance planning (scheduled work), and maintenance execution (completed work with costs).

### Who Uses This
Fleet managers and maintenance coordinators at a bus transportation company. They need to quickly see which buses need attention, track maintenance costs, and ensure the fleet stays operational. They're busy professionals who check this dashboard multiple times a day to keep operations running smoothly.

### The ONE Thing Users Care About Most
**How many buses need immediate attention?** Users need to instantly see which vehicles are due for maintenance or have urgent work scheduled. A bus breakdown means service disruption, unhappy passengers, and potential safety issues.

### Primary Actions (IMPORTANT!)
1. **Wartung erfassen** (Log Maintenance) → Primary Action Button - This is what users do most: record completed maintenance work
2. View bus details and maintenance history
3. Check upcoming scheduled maintenance

---

## 2. What Makes This Design Distinctive

### Visual Identity
This dashboard uses a **professional, industrial aesthetic** that fits a fleet management context. The color palette draws from highway infrastructure - a deep slate blue paired with warm amber accents that evoke warning lights and safety indicators. The off-white background with subtle warmth prevents the clinical coldness typical of enterprise software, making it feel more approachable for daily use.

### Layout Strategy
The layout uses **asymmetric proportions** to create clear hierarchy:
- The hero section (fleet status) dominates the top with oversized status indicators that feel like a control panel
- Desktop uses a 65/35 split - main content on the left, activity feed on the right
- Status counts use dramatically different sizes - the "needing attention" count is 3x larger than other stats
- Cards have varying heights based on content importance, not uniform boxes

### Unique Element
The **fleet status indicator** at the top uses pill-shaped badges with a thick left border (4px) in status colors, creating a visual "traffic light" effect. The "In Wartung" and "Außer Betrieb" badges pulse subtly with a gentle glow animation, drawing attention to buses that need action. This transforms a simple status display into something that feels like a live monitoring system.

---

## 3. Theme & Colors

### Font
- **Family:** Space Grotesk
- **URL:** `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap`
- **Why this font:** Space Grotesk has technical, engineering character with clean geometry that suits fleet management data. Its distinctive 'a' and 'g' letterforms add personality while remaining highly readable for numbers and technical labels.

### Color Palette
All colors as complete hsl() functions:

| Purpose | Color | CSS Variable |
|---------|-------|--------------|
| Page background | `hsl(40 20% 98%)` | `--background` |
| Main text | `hsl(220 25% 18%)` | `--foreground` |
| Card background | `hsl(0 0% 100%)` | `--card` |
| Card text | `hsl(220 25% 18%)` | `--card-foreground` |
| Borders | `hsl(220 15% 88%)` | `--border` |
| Primary action | `hsl(220 65% 45%)` | `--primary` |
| Text on primary | `hsl(0 0% 100%)` | `--primary-foreground` |
| Accent highlight | `hsl(38 92% 50%)` | `--accent` |
| Accent foreground | `hsl(220 25% 18%)` | `--accent-foreground` |
| Muted background | `hsl(220 15% 95%)` | `--muted` |
| Muted text | `hsl(220 10% 45%)` | `--muted-foreground` |
| Success/positive (In Betrieb) | `hsl(152 60% 40%)` | (component use) |
| Warning (In Wartung) | `hsl(38 92% 50%)` | (component use) |
| Error/negative (Außer Betrieb) | `hsl(0 72% 51%)` | `--destructive` |
| Secondary | `hsl(220 15% 95%)` | `--secondary` |
| Secondary foreground | `hsl(220 25% 18%)` | `--secondary-foreground` |

### Why These Colors
The deep slate blue (`hsl(220 65% 45%)`) anchors the design with authority and reliability - essential feelings for fleet management. The warm amber accent (`hsl(38 92% 50%)`) provides urgency and warmth, reminiscent of caution indicators on vehicles. The cream-tinted background (`hsl(40 20% 98%)`) adds warmth without sacrificing professionalism.

### Background Treatment
The page background uses a very subtle warm off-white. Cards are pure white to create gentle elevation. This creates a layered paper effect that feels organized and professional.

---

## 4. Mobile Layout (Phone)

Design mobile as a COMPLETELY SEPARATE experience, not squeezed desktop.

### Layout Approach
Mobile prioritizes immediate status visibility with a vertical flow. The hero (urgent attention count) dominates the first viewport, followed by scrollable status pills and upcoming maintenance cards. Visual interest comes from dramatic size differences between the hero number and supporting stats.

### What Users See (Top to Bottom)

**Header:**
- App title "Fuhrpark" on the left
- Primary action button "Wartung erfassen" on the right (compact, icon + text)

**Hero Section (The FIRST thing users see):**
- Large centered number showing buses needing attention (In Wartung + Außer Betrieb)
- Size: The number is 64px, taking about 30% of initial viewport
- Label below: "Fahrzeuge brauchen Aufmerksamkeit" in muted text
- Background: Subtle amber/orange gradient behind the number if count > 0, creating urgency
- Why this is the hero: This is the critical operational metric - if this number is high, there's a problem

**Section 2: Flottenübersicht (Fleet Status)**
- Horizontal scrollable row of status pills
- Each pill shows: colored dot + status name + count
- Order: In Betrieb (green), Reserve (blue), In Wartung (amber), Außer Betrieb (red)
- Compact, allowing all 4 to be visible with slight scroll hint

**Section 3: Anstehende Wartungen (Upcoming Maintenance)**
- Section title with small badge showing count
- Vertically stacked cards (3 visible)
- Each card shows: Bus identifier (Fahrzeugnummer + Kennzeichen), maintenance type, date, priority badge
- Cards sorted by date, urgent items highlighted with amber left border

**Section 4: Letzte Wartungen (Recent Maintenance)**
- Section title
- Compact list format (not full cards to save space)
- Shows: Bus, maintenance type, date, cost
- Limited to 5 items with "Alle anzeigen" link

**Bottom Navigation / Action:**
- Fixed bottom action button: "Wartung erfassen" (full width, primary blue, 56px height)
- Icon: wrench + plus

### Mobile-Specific Adaptations
- Fleet status uses horizontal scroll instead of grid
- Maintenance cards are simplified (fewer fields shown)
- Charts are replaced with simple numeric summaries
- Touch targets are minimum 44px

### Touch Targets
- All cards have 44px minimum touch area
- Status pills are 44px height
- Primary action button is 56px height

### Interactive Elements
- Tapping a maintenance card could show full details in a bottom sheet (optional future enhancement)
- Status pills are tappable to filter upcoming maintenance list

---

## 5. Desktop Layout

### Overall Structure
Three-column layout with asymmetric proportions:
- **Left sidebar (240px fixed):** Navigation and fleet summary stats
- **Main content (flexible, ~60%):** Hero metrics, charts, upcoming maintenance
- **Right sidebar (320px fixed):** Activity feed, recent maintenance

The eye flows: Hero metrics (top-center) → Fleet status (left) → Upcoming work (center) → Recent activity (right)

### Section Layout

**Top Area (spans main + right):**
- Header bar with app title and primary action button
- Hero KPIs in a row: "Brauchen Aufmerksamkeit" (large, emphasized), "Gesamtflotte", "Wartungskosten (Monat)"

**Left Sidebar:**
- Fleet status breakdown with vertical list of status counts
- Each status as a horizontal bar showing: status dot, label, count, percentage bar
- Total fleet count at bottom

**Main Content Area:**
- "Anstehende Wartungen" section with sortable table
- Columns: Bus (Fahrzeugnummer), Typ, Geplantes Datum, Priorität, Status
- Priority shown as colored badge
- Hover row highlights and shows "Details" action

**Right Sidebar:**
- "Letzte Wartungen" as a timeline/activity feed
- Each item: Date header grouping, then cards showing bus, work type, cost
- Scrollable within fixed height

### What Appears on Hover
- Table rows show subtle highlight and action buttons
- Bus identifiers show full details (Hersteller, Modell) in tooltip
- Cost values show breakdown tooltip

### Clickable/Interactive Areas
- Table rows expand to show full maintenance details
- Status filter badges filter the maintenance table
- Fleet status bars filter to show only buses with that status

---

## 6. Components

### Hero KPI
The MOST important metric that users see first.

- **Title:** Brauchen Aufmerksamkeit
- **Data source:** Busse (filtered by status = 'in_wartung' OR status = 'ausser_betrieb')
- **Calculation:** COUNT of buses where status is 'in_wartung' or 'ausser_betrieb'
- **Display:** Massive number (desktop: 72px, mobile: 64px) with subtle amber background glow when > 0
- **Context shown:** Below the number, show breakdown: "X in Wartung, Y außer Betrieb"
- **Why this is the hero:** This directly answers "do I have a problem right now?" - the primary concern for fleet managers

### Secondary KPIs

**Gesamtflotte (Total Fleet)**
- Source: Busse
- Calculation: COUNT all buses
- Format: number
- Display: Medium card, number with small "Fahrzeuge" label below

**Wartungskosten (Monat) (Monthly Maintenance Costs)**
- Source: Wartungsdurchfuehrung (filtered by durchfuehrungsdatum in current month)
- Calculation: SUM of gesamtkosten
- Format: currency (EUR), German locale
- Display: Medium card, formatted as "XX.XXX €" with "diesen Monat" label

**Anstehende Wartungen (Upcoming Maintenance Count)**
- Source: Wartungsplanung (filtered by planungsstatus = 'geplant' or 'bestaetigt')
- Calculation: COUNT
- Format: number
- Display: Badge next to section title

### Chart
- **Type:** Bar chart - shows monthly maintenance costs over time, answering "are we spending more or less than usual?"
- **Title:** Wartungskosten pro Monat
- **What question it answers:** "What's our maintenance spend trend? Are costs increasing?"
- **Data source:** Wartungsdurchfuehrung
- **X-axis:** Month (derived from durchfuehrungsdatum), last 6 months
- **Y-axis:** Total costs (sum of gesamtkosten per month)
- **Mobile simplification:** Hidden on mobile, replaced with simple "Kosten letzter Monat vs. dieser Monat" comparison

### Lists/Tables

**Anstehende Wartungen (Upcoming Maintenance)**
- Purpose: Shows what maintenance work is scheduled so users can plan resources
- Source: Wartungsplanung (joined with Busse and Wartungstypen via applookup)
- Fields shown:
  - Bus Fahrzeugnummer + Kennzeichen
  - Wartungstyp (from linked Wartungstypen)
  - Geplantes Datum
  - Priorität (as colored badge)
  - Status (Planungsstatus)
- Mobile style: Vertical cards with key info, priority as left border color
- Desktop style: Sortable table
- Sort: By geplantes_datum ascending (soonest first), then by prioritaet (dringend first)
- Limit: 10 items, with pagination or "show more"

**Letzte Wartungen (Recent Maintenance)**
- Purpose: Activity feed showing what work was recently completed
- Source: Wartungsdurchfuehrung (joined with Busse via applookup)
- Fields shown:
  - Bus Fahrzeugnummer
  - Wartungstyp (from linked Wartungstypen)
  - Durchführungsdatum
  - Gesamtkosten
- Mobile style: Compact list with date, bus, cost on one line
- Desktop style: Timeline cards grouped by date
- Sort: By durchfuehrungsdatum descending (most recent first)
- Limit: 5 items

### Primary Action Button (REQUIRED!)

- **Label:** Wartung erfassen
- **Action:** add_record
- **Target app:** Wartungsdurchfuehrung
- **What data:** Form with fields: bus (select from Busse), wartungstypen (select from Wartungstypen), durchfuehrungsdatum (date picker, default today), km_stand_bei_wartung (number), durchgefuehrte_arbeiten (textarea), gesamtkosten (number)
- **Mobile position:** bottom_fixed
- **Desktop position:** header (top right)
- **Why this action:** Recording completed maintenance is the most frequent action. Every time a mechanic finishes work, this needs to be logged. Quick access is essential.

---

## 7. Visual Details

### Border Radius
Rounded (8px) - Modern but not too playful. Cards feel substantial.

### Shadows
Subtle - Cards have `shadow-sm` (0 1px 2px rgba(0,0,0,0.05)). On hover, elevate to `shadow-md`.

### Spacing
Normal - 16px base unit. Cards have 24px padding. Sections separated by 32px.

### Animations
- **Page load:** Stagger fade-in for cards (50ms delay between each)
- **Hover effects:** Cards lift slightly with shadow increase (transform: translateY(-2px))
- **Tap feedback:** Scale down to 0.98 on press, then return
- **Number changes:** Hero KPI animates counting up on load

---

## 8. CSS Variables (Copy Exactly!)

The implementer MUST copy these values exactly into `src/index.css`:

```css
:root {
  --background: hsl(40 20% 98%);
  --foreground: hsl(220 25% 18%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(220 25% 18%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(220 25% 18%);
  --primary: hsl(220 65% 45%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(220 15% 95%);
  --secondary-foreground: hsl(220 25% 18%);
  --muted: hsl(220 15% 95%);
  --muted-foreground: hsl(220 10% 45%);
  --accent: hsl(38 92% 50%);
  --accent-foreground: hsl(220 25% 18%);
  --destructive: hsl(0 72% 51%);
  --border: hsl(220 15% 88%);
  --input: hsl(220 15% 88%);
  --ring: hsl(220 65% 45%);
  --radius: 0.5rem;
}
```

---

## 9. Implementation Checklist

The implementer should verify:
- [ ] Font loaded from URL above (Space Grotesk)
- [ ] All CSS variables copied exactly
- [ ] Mobile layout matches Section 4 (vertical flow, hero dominant)
- [ ] Desktop layout matches Section 5 (three columns, asymmetric)
- [ ] Hero element is prominent as described (large attention count)
- [ ] Colors create the mood described in Section 2 (industrial, professional, warm)
- [ ] Status colors: green for "In Betrieb", amber for "In Wartung", red for "Außer Betrieb", blue for "Reserve"
- [ ] Primary action button present and functional
- [ ] Data fetched from correct Living Apps using extractRecordId for applookup fields
- [ ] German labels used throughout (this is a German app)
- [ ] Numbers formatted with German locale (1.234,56 not 1,234.56)
- [ ] Dates formatted in German format (DD.MM.YYYY)
