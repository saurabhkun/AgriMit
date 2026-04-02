# Disease-Specific Precautions Feature - Step-by-Step

## Plan Breakdown (Approved: Prioritize Tomato diseases)

**Step 1: [✅] Update backend ml_stubs.py** - Add tomato diseases to cnn_stub, disease_precautions dict in generate_advice_stub (3-4 precautions per disease)

**Step 2: [✅] Update schemas.py** - Add `precautions: List[str]` to AdviceResult

**Step 3: [✅] Frontend ImageAnalysisCard.jsx + ImageUpload.jsx** - Display precautions section

**Step 4: [✅] Update AdvicePanel.jsx** - Show precautions

**Step 5: [✅] Test & Update TODO_FEATURES.md** - Mark progress, run servers

**Tomato Diseases Priority:**

1. early_blight
2. late_blight
3. bacterial_spot
4. tomato_mosaic_virus

**General Diseases:**

- leaf_blight (corn/wheat)
- nutrient_deficiency
- pest_damage

## Progress Tracker

- Backend complete: ✅
- Schemas complete: ✅
- Frontend cards complete: ✅
- AdvicePanel complete: ✅
- Tested: ✅
