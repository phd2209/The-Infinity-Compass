/**
 * Retry utility with exponential backoff
 */
export async function withRetry(fn, options = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry = null,
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt - 1),
        maxDelay
      );

      console.log(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms delay`);

      if (onRetry) {
        onRetry(error, attempt, delay);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error) {
  // Network errors
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    return true;
  }

  // HTTP status codes that are retryable
  if (error.response?.status) {
    const status = error.response.status;
    return status === 429 || status >= 500;
  }

  return false;
}

/**
 * Wrapper for API calls with automatic retry on specific errors
 */
export async function retryableApiCall(fn, options = {}) {
  return withRetry(fn, {
    ...options,
    onRetry: (error, attempt, delay) => {
      if (!isRetryableError(error)) {
        console.log('Error is not retryable, stopping retries');
        throw error;
      }

      console.log(
        `API call failed (attempt ${attempt}), retrying in ${delay}ms...`,
        error.message
      );

      if (options.onRetry) {
        options.onRetry(error, attempt, delay);
      }
    },
  });
}
