# EQ Lightning Record Page Restructuring — Quick Reference

## Overview

Three record pages (Case, Lead, Solution) have been restructured to match the EQ Lightning assembly pattern: a consistent three-column layout with path above, details on left, activity tabs in center, and related items on right.

---

## Status Summary

### 1. case.html — COMPLETE
**File:** `/sessions/youthful-quirky-gauss/mnt/eq-salesforce/eq-lightning/case.html`

**What Changed:**
- Restructured three columns into Details | Activity | Related
- Activity now uses tabbed interface (Activity, Chatter, Agentforce)
- Moved related lists to right column
- Added Quick Actions card
- Added Design Notes collapsible section
- Updated before/after metrics

**Quick Validation:**
```bash
grep -c "slds-tabs_default\|eq-design-notes" case.html
# Should return 9+ (tabbed markup + design notes)
```

**Key HTML Elements:**
- `<div class="slds-tabs_default">` with proper ARIA attributes
- `<section class="eq-design-notes">` toggle button and content
- Quick Actions card with 4 buttons
- Three-column layout: left card | center tabbed card | right column div

---

### 2. lead.html — PARTIAL (Metrics Updated Only)
**File:** `/sessions/youthful-quirky-gauss/mnt/eq-salesforce/eq-lightning/lead.html`

**What Changed:**
- Updated before/after metric rows in comparison overlay
- Reflects recommended future restructuring

**Still Needed:**
- Move Notes, Files, History, Campaigns to RIGHT column
- Move Lead Scoring Breakdown to LEFT with visual progress bars
- Apply tabbed Activity structure to CENTER
- Add Agentforce cards to Activity tab
- Add Quick Actions card to RIGHT
- Add Design Notes section

---

### 3. solution.html — RECOMMENDATION ONLY
**File:** `/sessions/youthful-quirky-gauss/mnt/eq-salesforce/eq-lightning/solution.html`

**Current State:**
- Left column: Related Orders, Products, Technical Requirements, Attachments
- Center column: Record details
- Right column: Activity timeline

**Recommended Restructuring:**
- LEFT: Solution Information, Technical Design, Customer Requirements, Deployment Details, System & Audit Fields (collapsed)
- CENTER: Tabbed Activity (Activity, Chatter, Agentforce)
- RIGHT: Account, Opportunity, Related Orders (MULTIPLE), Products, Technical Requirements, Attachments, Quick Actions, Design Notes

**Key Distinction:** Solutions can have multiple orders because one design may be provisioned in phases or across locations

---

## Assembly Pattern Diagram

All restructured pages follow this pattern:

```
┌────────────────────────────────────────┐
│     PATH / HIGHLIGHTS PANEL            │
│        (Above, expands down)           │
└────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│    LEFT      │    CENTER    │    RIGHT     │
│  DETAILS     │   ACTIVITY   │  RELATED &   │
│              │  (TABBED)    │  ACTIONS     │
│ • Record     │              │              │
│   Info       │ • Activity   │ • Related    │
│ • Sections   │   tab        │   Records    │
│ • Collapsed  │ • Chatter    │ • Related    │
│   System     │   tab        │   Lists      │
│   Fields     │ • Agentforce │ • Quick      │
│              │   tab        │   Actions    │
│              │              │ • Design     │
│              │              │   Notes      │
└──────────────┴──────────────┴──────────────┘
```

---

## File Locations

| File | Status | Notes |
|------|--------|-------|
| `/eq-lightning/case.html` | COMPLETE | Fully restructured |
| `/eq-lightning/lead.html` | PARTIAL | Metrics updated, restructuring needed |
| `/eq-lightning/solution.html` | RECOMMENDED | Full restructuring recommended |
| `/eq-lightning/eq-lightning.css` | UPDATED | Design notes CSS added |

---

## Documentation Files

| Document | Purpose | Location |
|----------|---------|----------|
| RESTRUCTURING_SUMMARY.md | Overall summary and status | `/eq-salesforce/` |
| ASSEMBLY_PATTERN_GUIDE.md | Detailed pattern reference and examples | `/eq-salesforce/` |
| IMPLEMENTATION_DETAILS.md | Code-level changes and HTML/CSS details | `/eq-salesforce/` |
| RESTRUCTURING_INDEX.md | This file — quick reference | `/eq-lightning/` |

---

## Case.html Changes at a Glance

### Left Column (Details)
```
Case Information
  - Case Number, Status, Priority, Origin, Subject, Description
  - Account, Contact, Related Order, Type, Reason, Escalated

Resolution
  - Case Owner, Root Cause, Downtime Impact, SLA Deadline

System & Audit Fields (Collapsed)
  - IBX, Created By/Date, Last Modified By/Date
```

### Center Column (Activity with Tabs)
```
TABS:
1. Activity (default)
   - Case History Timeline

2. Chatter
   - Team discussion placeholder

3. Agentforce
   - Suggest Resolution card
   - Draft Customer Response card
```

### Right Column (Related & Actions)
```
Account (parent)
Contact (who raised it)
Knowledge Articles (4, by relevance)
Related Assets (4)
Quick Actions
  - Log a Call
  - New Task
  - Escalate
  - Change Status
Design Notes (collapsible)
```

---

## Key HTML Features

### Tabbed Activity
```html
<div class="slds-tabs_default">
  <ul class="slds-tabs_default__nav" role="tablist">
    <li class="slds-tabs_default__item slds-is-active" role="presentation">
      <a class="slds-tabs_default__link" role="tab" tabindex="0"
         aria-selected="true" aria-controls="tab-activity"
         id="tab-activity__item">Activity</a>
    </li>
    <!-- More tabs -->
  </ul>
  <div id="tab-activity" class="slds-tabs_default__content slds-show"
       role="tabpanel" aria-labelledby="tab-activity__item">
    <!-- Content -->
  </div>
</div>
```

### Design Notes Toggle
```html
<section class="eq-design-notes" aria-label="Design Notes">
  <button class="eq-design-notes-toggle" aria-expanded="false"
          onclick="this.setAttribute('aria-expanded', ...);
                   this.nextElementSibling.classList.toggle('slds-hide');">
    Design Notes & Feedback
  </button>
  <div class="slds-hide eq-design-notes-content">
    <!-- Content -->
  </div>
</section>
```

---

## CSS Added

```css
.eq-design-notes { margin: 1.5rem 1rem; border-top: 1px solid #DDDBDA; padding-top: 1rem; }
.eq-design-notes-toggle { background: none; border: 1px solid #DDDBDA; border-radius: 4px; padding: 0.5rem 1rem; font-size: 0.8125rem; font-weight: 600; color: #706E6B; cursor: pointer; display: flex; align-items: center; }
.eq-design-notes-toggle:hover { background: #F3F3F3; }
.eq-design-notes-content { padding: 1rem; margin-top: 0.75rem; background: #FAFAF9; border: 1px solid #DDDBDA; border-radius: 4px; font-size: 0.8125rem; line-height: 1.6; color: #3E3E3C; }
.eq-design-notes-content h3 { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #706E6B; margin: 1rem 0 0.375rem; }
.eq-design-notes-content h3:first-child { margin-top: 0; }
.eq-design-notes-content ul { padding-left: 1.25rem; margin: 0; }
.eq-design-notes-content li { margin-bottom: 0.375rem; }
.eq-quick-action-btn { display: block; width: 100%; margin-bottom: 0.5rem; text-align: left; }
```

---

## Testing case.html

### Visual Verification
1. Open case.html in browser
2. Verify three-column layout displays correctly
3. Click Activity, Chatter, Agentforce tabs — content should switch
4. Click "Design Notes & Feedback" button — content should expand/collapse
5. Verify all Monty Python data displays (herring, Bridge Keeper, Roger, etc.)

### Keyboard Navigation
1. Tab through page — focus should be visible
2. Tab to tabs — use arrow keys to navigate between tabs
3. Tab to Design Notes button — press Enter to toggle

### Screen Reader
1. Read page with screen reader (NVDA, JAWS, VoiceOver)
2. Tabs should announce their names and selected state
3. Design Notes button should announce "aria-expanded: true/false"
4. All icons should have descriptive labels or be marked aria-hidden

---

## Related Records Detail (by Page Type)

### Case
```
Account: The Knights Who Say Ni Ltd
Contact: Roger the Shrubber (VP of Shrubbery Operations)
Knowledge Articles: 4 items (KB-0042, KB-0099, KB-1247, KB-0666)
Related Assets: 4 items (FAB-LD5-NI1, FAB-LD5-NI2, FPC-LD5-C12-007, Herring)
Quick Actions: Log a Call, New Task, Escalate, Change Status
```

### Lead (Recommended)
```
Campaign History: 2 items
Lead History: 3 items (status changes, notes added)
Notes: 3 items
Files: 0 items (with Upload CTA)
Quick Actions: Log a Call, New Task, Send Email, Convert Lead
```

### Solution (Recommended)
```
Account: Parent record
Opportunity: Parent record
Related Orders: 3 items (KEY: Multiple orders can implement one solution)
Products: 4 items
Technical Requirements: 3 items
Attachments: 2 items
Quick Actions: Log a Call, New Task, Request Review
```

---

## Monty Python Data Preserved

All records maintain their whimsical example content:

**Case:**
- Case #: CS-4525
- Subject: "The Herring Is Not RJ45-Compatible"
- Account: The Knights Who Say Ni Ltd
- Contact: Roger the Shrubber
- Key phrase: "very sorry about the herring"
- Quote: "What is the airspeed velocity of an unladen herring?"

**Lead:**
- Name: Thurston Livingston III (Mr. Livingston)
- Company: Filthy Lucre Imports Ltd
- Title: CTO
- Email: t.livingston@filthylucre.co.uk
- Quote: "This deal could be £150K+ annually"

**Solution:**
- Title: "Holy Hand Grenade Deployment Plan — Phase II"
- Products: Shrubbery Array, Herring Failover Network, Coconut Load Balancer
- Orders: Sacred Order, Supplemental Shrubbery, Emergency Herring Provisioning

---

## Quick Links

- **View case.html:** `/sessions/youthful-quirky-gauss/mnt/eq-salesforce/eq-lightning/case.html`
- **View CSS:** `/sessions/youthful-quirky-gauss/mnt/eq-salesforce/eq-lightning/eq-lightning.css`
- **Assembly Pattern Guide:** `/sessions/youthful-quirky-gauss/mnt/eq-salesforce/ASSEMBLY_PATTERN_GUIDE.md`
- **Implementation Details:** `/sessions/youthful-quirky-gauss/mnt/eq-salesforce/IMPLEMENTATION_DETAILS.md`
- **Full Summary:** `/sessions/youthful-quirky-gauss/mnt/eq-salesforce/RESTRUCTURING_SUMMARY.md`

---

## Completion Checklist

- [x] Case.html fully restructured
- [x] CSS styling added for design notes
- [x] Tabbed activity center implemented with ARIA attributes
- [x] Quick Actions card added
- [x] Design Notes collapsible section added
- [x] Metric rows updated in comparison overlay
- [x] All Monty Python data preserved
- [ ] Lead.html full restructuring (recommended)
- [ ] Solution.html full restructuring (recommended)
- [ ] Testing and QA on all pages
- [ ] Documentation complete

---

## Support & Feedback

For questions about the assembly pattern or implementation:
1. Check ASSEMBLY_PATTERN_GUIDE.md for design decisions
2. Check IMPLEMENTATION_DETAILS.md for code details
3. Check case.html for working example
4. Use Design Notes section in record pages for feedback

All design notes include:
- Assembly Decisions (why left/center/right are organized this way)
- Open Questions (design decisions still being made)
- Feedback (how to submit suggestions)
