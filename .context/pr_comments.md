# PR Review - Batch request coalescer (by Ravi)

## Reviewer: Nisha Gupta
---

**Overall:** Good foundation but critical bugs need fixing before merge.

### `requestCoalescer.js`

> **Bug #1:** Batch timeout fires but does not flush pending requests so they accumulate forever
> This is the higher priority fix. Check the logic carefully and compare against the design doc.

### `batchExecutor.js`

> **Bug #2:** Response routing maps results to wrong original requests and responses are shuffled
> This is more subtle but will cause issues in production. Make sure to add a test case for this.

---

**Ravi**
> Acknowledged. I have documented the issues for whoever picks this up.
