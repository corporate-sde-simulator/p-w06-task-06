/**
 * Batch Executor — executes batched requests against an API endpoint.
 *
 * Handles retry logic and partial failure within a batch.
 *
 * Author: Arjun Nair (Performance team)
 * Last Modified: 2026-03-12
 */

class BatchExecutor {
  constructor(endpoint, options = {}) {
    this.endpoint = endpoint;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelayMs = options.retryDelayMs || 200;
    this.timeout = options.timeout || 5000;
    this.stats = { total: 0, success: 0, partialFailure: 0, fullFailure: 0 };
  }

  async executeBatch(keys, requests) {
    this.stats.total++;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await this._sendBatch(keys, requests);
        this.stats.success++;
        return response;
      } catch (err) {
        if (attempt === this.maxRetries - 1) {
          this.stats.fullFailure++;
          throw err;
        }
        await this._delay(this.retryDelayMs * Math.pow(2, attempt));
      }
    }
  }

  async _sendBatch(keys, requests) {
    // Simulate API call
    const results = [];
    for (let i = 0; i < requests.length; i++) {
      results.push({
        key: keys[i],
        status: 'success',
        data: requests[i],
      });
    }
    return results;
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats() {
    return { ...this.stats };
  }
}

module.exports = { BatchExecutor };
