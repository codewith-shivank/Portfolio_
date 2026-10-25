---
description: Add a new phase to the end of the roadmap
argument-hint: "<phase-name>"
---

# /add-phase Workflow

<objective>
Add a new phase to the end of the current roadmap.
</objective>

<process>

## 1. Validate Roadmap Exists

```powershell
if (-not (Test-Path ".gsd/ROADMAP.md")) {
    throw "ROADMAP.md required. Run /new-milestone first."
}
```

---

## 2. Determine Next Phase Number

```powershell
# Count existing phases
$phases = Select-String -Path ".gsd/ROADMAP.md" -Pattern "### Phase \d+"
$nextPhase = $phases.Count + 1
```

---

## 3. Gather Phase Information

Ask for:
- **Name** — Phase title
- **Objective** — What this phase achieves
- **Depends on** — Previous phases (usually N-1)

Record the dependency response exactly; do not assume the immediately previous phase.

---

## 4. Add to ROADMAP.md

Append:
```markdown
---

### Phase {N}: {name}
**Status**: ⬜ Not Started
**Objective**: {objective}

**Tasks**:
- [ ] TBD (run /plan {N} to create)

**Verification**:
- TBD
```

Only add `**Depends on**: {collected dependency list}` when Step 3 returned one.
Otherwise omit the field.

---

## 5. Update STATE.md

Note phase added.

---

## 6. Commit

```powershell
git add .gsd/ROADMAP.md .gsd/STATE.md
git commit -m "docs: add phase {N} - {name}"
```

---

## 7. Offer Next Steps

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PHASE ADDED ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase {N}: {name}

───────────────────────────────────────────────────────

▶ NEXT

/plan {N} — Create execution plans for this phase

───────────────────────────────────────────────────────
```

</process>
