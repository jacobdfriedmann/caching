const util = require("util");
const createCachedFunction = require("./createCachedFunction");

test("createCachedFunction should return correct value", () => {
  const VALUE = "hello";
  const mockExpensiveFunction = i => i;
  const cached = createCachedFunction(mockExpensiveFunction, 3);
  const missReturnValue = cached(VALUE);
  const hitReturnValue = cached(VALUE);
  expect(missReturnValue).toBe(VALUE);
  expect(hitReturnValue).toBe(VALUE);
});

test("createCachedFunction should not call expensive function for cached value", async () => {
  const VALUE = "hello";
  const mockExpensiveFunction = jest.fn();
  const cached = createCachedFunction(mockExpensiveFunction, 3);
  cached(VALUE);
  cached(VALUE);
  expect(mockExpensiveFunction).toHaveBeenCalledTimes(1);
});

test("createCachedFunction should evict least called value", async () => {
  const VALUE_A = "hello";
  const VALUE_B = "jello";
  const VALUE_C = "yello";
  const VALUE_D = "fello";
  const mockExpensiveFunction = jest.fn();
  const cached = createCachedFunction(mockExpensiveFunction, 3);

  // Fill up the cache, VALUE_C having the least number of reads
  cached(VALUE_A);
  cached(VALUE_A);
  cached(VALUE_B);
  cached(VALUE_B);
  cached(VALUE_C);

  // Expect that it was only called once per value
  expect(mockExpensiveFunction).toHaveBeenCalledTimes(3);
  expect(cached.size()).toBe(3);

  // On the first call of a new value, cache should be unmodified
  // expensive function called once
  cached(VALUE_D);
  expect(mockExpensiveFunction).toHaveBeenCalledTimes(4);

  // On the second call, we'll need to recompute expensive value,
  // D should now outrank C and evict it in the cache
  cached(VALUE_D);
  expect(mockExpensiveFunction).toHaveBeenCalledTimes(5);
  expect(cached.size()).toBe(3);

  // Now, the next call of D should be a cache hit,
  // avoiding a new call to the expensive function
  cached(VALUE_D);
  expect(mockExpensiveFunction).toHaveBeenCalledTimes(5);
  expect(cached.size()).toBe(3);

  // If we call with C again, it should no longer be in the cache
  // resulting in one more run of the expensive function
  cached(VALUE_C);
  expect(mockExpensiveFunction).toHaveBeenCalledTimes(6);
});
