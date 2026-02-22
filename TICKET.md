# PLATFORM-2944: Refactor batch request coalescer

**Status:** In Progress · **Priority:** Medium
**Sprint:** Sprint 28 · **Story Points:** 5
**Reporter:** Nisha Gupta (Performance Lead) · **Assignee:** You (Intern)
**Due:** End of sprint (Friday)
**Labels:** `backend`, `javascript`, `api`, `performance`
**Task Type:** Code Maintenance

---

## Description

The batch request coalescer groups individual API requests into batches to reduce roundtrips. It works correctly but has code quality issues from the last review. Refactor without changing behavior.

Issues are marked with `// TODO (code review):` comments.

## Acceptance Criteria

- [ ] Magic numbers replaced with named constants
- [ ] Promise error handling improved (no swallowed errors)
- [ ] Timer management simplified (clearTimeout leaks fixed)
- [ ] All unit tests still pass
