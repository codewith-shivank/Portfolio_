---
description: Create a new milestone with phases
argument-hint: "<milestone-name>"
---

# /new-milestone Workflow

<objective>
Define a new milestone with goal, phases, and success criteria.
</objective>

<process>

## 1. Validate SPEC Exists

**PowerShell:**
```powershell
if (-not (Test-Path ".gsd/SPEC.md")) {
    throw "SPEC.md required. Run /new-project first."
}
```

**Bash:**
```bash
if [ ! -f ".gsd/SPEC.md" ]; then
    echo "Error: SPEC.md required. Run /new-project first." >&2
    exit 1
fi
```

---

## 2. Gather Milestone Information

Ask for:
- **Name** — Milestone identifier (e.g., "v1.0", "MVP", "Beta")
- **Goal** — What does this milestone achieve?
- **Must-haves** — Non-negotiable deliverables
- **Nice-to-haves** — Optional if time permits
- **Risks** — Material risks and mitigations
- **Success criteria** — Measurable completion conditions

---

## 3. Generate Phase Breakdown

Based on goal and must-haves, suggest phases:

```markdown
## Suggested Phases

Phase 1: {Foundation/Setup}
Phase 2: {Core Feature A}
Phase 3: {Core Feature B}
Phase 4: {Integration/Polish}
Phase 5: {Verification/Launch}
```

Ask user to confirm or modify.

---

## 4. Update ROADMAP.md

```markdown
# ROADMAP.md

> **Current Milestone**: {name}
> **Goal**: {goal}

## Must-Haves
- [ ] {must-have 1}
- [ ] {must-have 2}

## Phases

### Phase 1: {name}
**Status**: ⬜ Not Started
**Objective**: {description}

### Phase 2: {name}
**Status**: ⬜ Not Started
**Objective**: {description}

...
```

---

## 4b. Create Milestone Record

Create `.gsd/milestones/{name}/MILESTONE.md` from `.gsd/templates/milestone.md`.
Create `.gsd/milestones/{name}/` first if it does not exist:

```powershell
New-Item -ItemType Directory -Force ".gsd/milestones/{name}" | Out-Null
```

```bash
mkdir -p ".gsd/milestones/{name}"
```

Populate the template metadata, vision, must-haves, nice-to-haves, confirmed phases,
success criteria, architecture decisions, risks, and progress log with the information
collected in Steps 2-3. Preserve every collected nice-to-have, risk, and success
criterion rather than dropping it from the record.

---

## 5. Update STATE.md

```markdown
## Current Position
- **Milestone**: {name}
- **Phase**: Not started
- **Status**: Milestone planned
```

---

## 5b. Reset Session Files (if starting fresh)

Never clear history-bearing DECISIONS.md or JOURNAL.md entries here. Reset a file
only when its nonblank content is limited to its title and a horizontal-rule
separator; preserve every other file unchanged. Archive existing history first if
it must be cleared for the new milestone.

**PowerShell:**
```powershell
# Reset only a header-only file; preserve all files with entries.
if (Test-Path ".gsd/DECISIONS.md") {
    $decisionContent = Get-Content ".gsd/DECISIONS.md"
    $decisionEntries = @($decisionContent | Where-Object {
        $_.Trim() -and $_.Trim() -notin @("# Decisions", "---")
    })
    if ($decisionEntries.Count -eq 0) {
        Set-Content ".gsd/DECISIONS.md" "# Decisions`n`n---`n"
    }
}
if (Test-Path ".gsd/JOURNAL.md") {
    $journalContent = Get-Content ".gsd/JOURNAL.md"
    $journalEntries = @($journalContent | Where-Object {
        $_.Trim() -and $_.Trim() -notin @("# Journal", "---")
    })
    if ($journalEntries.Count -eq 0) {
        Set-Content ".gsd/JOURNAL.md" "# Journal`n`n---`n"
    }
}
```

**Bash:**
```bash
if [ -f ".gsd/DECISIONS.md" ] && ! grep -Ev '^[[:space:]]*(# Decisions|---)?[[:space:]]*$' .gsd/DECISIONS.md | grep -q .; then
    printf '# Decisions\n\n---\n' > .gsd/DECISIONS.md
fi
if [ -f ".gsd/JOURNAL.md" ] && ! grep -Ev '^[[:space:]]*(# Journal|---)?[[:space:]]*$' .gsd/JOURNAL.md | grep -q .; then
    printf '# Journal\n\n---\n' > .gsd/JOURNAL.md
fi
```

> **Note:** Files containing any history remain unchanged unless that history has
> first been archived. Header-only files may be reset safely.

---

## 6. Commit

```powershell
git add -- .gsd/ROADMAP.md .gsd/STATE.md .gsd/milestones/{name}/MILESTONE.md
if (Test-Path ".gsd/DECISIONS.md") { git add -- .gsd/DECISIONS.md }
if (Test-Path ".gsd/JOURNAL.md") { git add -- .gsd/JOURNAL.md }
git commit -m "docs: create milestone {name}"
```

**Bash:**
```bash
git add -- .gsd/ROADMAP.md .gsd/STATE.md ".gsd/milestones/{name}/MILESTONE.md"
[ ! -f ".gsd/DECISIONS.md" ] || git add -- .gsd/DECISIONS.md
[ ! -f ".gsd/JOURNAL.md" ] || git add -- .gsd/JOURNAL.md
git commit -m "docs: create milestone {name}"
```

---

## 7. Offer Next Steps

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► MILESTONE CREATED ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Milestone: {name}
Phases: {N}

───────────────────────────────────────────────────────

▶ NEXT

/plan 1 — Create Phase 1 execution plans

───────────────────────────────────────────────────────
```

</process>
