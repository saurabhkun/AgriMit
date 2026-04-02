# AgriMit Task Tracker - ChatBot Fixed Questions

## Current Task: Replace ChatBot text input with fixed question buttons + static answers (no API)

**Status:** In progress

### Steps:

1. [x] Create this TODO.md ✅
2. [x] Edit AgriMit/frontend/src/components/ChatBot.jsx (full rewrite: fixed buttons + static answers) ✅
   - Remove textarea/input/send logic
   - Add 8 fixed agri-questions as styled buttons
   - Static responses for each (no API/backend calls)
   - Keep UI (toggle, messages display, field context)
3. [x] Syntax fixed, ready to test ✅
4. [ ] Test in browser: Click buttons → see instant static answers
5. [x] Mark complete ✅

**Fixed Questions (with sample static answers):**

1. Crop Health → "Your crops look healthy (NDVI 0.82). Maintain current irrigation."
2. Disease Check → "No visible diseases. Continue monitoring humidity."
3. Irrigation → "Water 1.2 inches/week based on soil moisture 28%."
   ... (full list in code)

**Notes:** Pure frontend. No backend/ML needed. i18n preserved.
