/**
 * Request Coalescer — batches individual API requests together.
 *
 * Groups requests arriving within a time window into a single batch call.
 * Reduces API roundtrips from N to 1.
 *
 * Author: Arjun Nair (Performance team)
 * Last Modified: 2026-03-12
 */

class RequestCoalescer {
  constructor() {
    this.pending = new Map();
    this.timer = null;
    this.batchCallback = null;
    this.results = new Map();
    this.stats = { batched: 0, executed: 0, errors: 0 };
  }

  setBatchCallback(callback) {
    this.batchCallback = callback;
  }

  // Extract to a named constant like MAX_BATCH_SIZE
  add(key, request) {
    return new Promise((resolve, reject) => {
      if (this.pending.size >= 50) {
        this._flush();
      }

      this.pending.set(key, { request, resolve, reject });
      this.stats.batched++;

      // Extract to a named constant like BATCH_WINDOW_MS.
      // Also: timer is never cleared on flush, causing potential double-execution.
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this._flush();
        }, 100);
      }
    });
  }

  // At minimum, log the error. Ideally, reject individual promises that failed.
  async _flush() {
    if (this.pending.size === 0) return;

    const batch = new Map(this.pending);
    this.pending.clear();
    this.timer = null;

    const keys = Array.from(batch.keys());
    const requests = Array.from(batch.values()).map(v => v.request);

    try {
      const results = await this.batchCallback(keys, requests);
      this.stats.executed++;

      for (let i = 0; i < keys.length; i++) {
        const entry = batch.get(keys[i]);
        if (entry) {
          entry.resolve(results[i]);
        }
      }
    } catch (err) {
      // All pending promises are left hanging — they never resolve or reject.
      this.stats.errors++;
    }
  }

  getStats() {
    return { ...this.stats, pending: this.pending.size };
  }

  // the timer still fires. Add a destroy() method that clears the timer and rejects
  // all pending requests.
}

module.exports = { RequestCoalescer };
