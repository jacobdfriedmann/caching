// Utility to create a memoized version of a function.
// Cache is optimized for small set of "hot" inputs and
// limited to "maxSize".
module.exports = (expensiveFunction, maxSize = 50000) => {
  const valueCache = {};
  const hitCounts = {};

  const size = () => Object.keys(valueCache).length;
  const getCache = () => valueCache;
  const getValuesRanked = () =>
    Object.entries(hitCounts).sort((a, b) => b[1] - a[1]);
  const getMinCacheableRead = () => {
    const sortedReadCounts = getValuesRanked();
    return sortedReadCounts[maxSize - 1]
      ? sortedReadCounts[maxSize - 1]
      : [undefined, 0];
  };
  const isFull = () => size() >= maxSize;

  // For now, making an assumption that the function being memoized has
  // one, primitive argument
  const cached = arg => {
    // Cache hit
    if (valueCache[arg]) {
      hitCounts[arg]++;
      return valueCache[arg].value;
    }

    // Expensive computation
    const value = expensiveFunction(arg);

    // Determine if cacheable:
    // a. cache not yet full
    // b. this value now read more than some other cached value
    const hits = (hitCounts[arg] || 0) + 1;
    const minCacheableRead = getMinCacheableRead();
    const shouldCache = hits > minCacheableRead[1];

    if (shouldCache) {
      // Determine whether we need to evict a value from the cache
      if (isFull()) {
        // Evict the least read value
        const evictedKey = minCacheableRead[0];
        delete valueCache[evictedKey];
      }
      // Cache value, use a wrapper object in case return
      // value is undefined
      valueCache[arg] = { value };
    }

    // Track hits on this key
    hitCounts[arg] = hits;

    return value;
  };

  // Helpers for testing
  cached.size = size;
  cached.getCache = getCache;
  cached.getValuesRanked = getValuesRanked;

  return cached;
};
