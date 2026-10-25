---
description: Show recent GSD changes and new features
---

# /whats-new Workflow

<objective>
Display recent changes, new features, and improvements to GSD for Antigravity.
</objective>

<process>

## 1. Read CHANGELOG.md

```bash
# Read the latest version section from CHANGELOG.md
head -50 CHANGELOG.md
```

## 2. Display Recent Changes

Render the most recent version entries actually read from CHANGELOG.md in Step 1.
Preserve each heading's version/date and release notes. Do not hard-code versions or
release-note claims in this workflow; if fewer entries exist, show only those entries.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► WHAT'S NEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Include the recent version heading(s) and release notes from CHANGELOG.md here.}

───────────────────────────────────────────────────────

📚 Full changelog: CHANGELOG.md

───────────────────────────────────────────────────────
```

</process>

## Cross-Platform Support

Describe support accurately: workflow files provide Bash equivalents where they are
documented. Some supplied workflow commands remain shell-specific; do not claim every
workflow is fully cross-platform.

<related>
## Related

### Workflows
| Command | Relationship |
|---------|--------------|
| `/update` | Update GSD to latest version |
| `/help` | List all commands |

</related>
