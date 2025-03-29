import { cache } from "react";

type RateLimitData = {
  count: number;
  timestamp: number;
};

const store = new Map<string, RateLimitData>();

export const rateLimit = cache(async (identifier: string) => {
  const now = Date.now();
  const windowSize = 60 * 60 * 1000; // 1 hour
  const maxRequests = 3; // 3 requests per hour

  const data = store.get(identifier) || { count: 0, timestamp: now };

  // Reset if outside window
  if (now - data.timestamp > windowSize) {
    data.count = 0;
    data.timestamp = now;
  }

  if (data.count >= maxRequests) {
    return false;
  }

  data.count++;
  store.set(identifier, data);
  return true;
});
