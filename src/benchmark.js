const { performance } = require("perf_hooks");
const Table = require("cli-table");
const memoize = require("memoizee");
const createCachedFunction = require("./createCachedFunction");

// Generate a lumpy data set where 95% values
// are from a small subset of potential values
const generateDataSet = function*(size) {
  const POTENTIAL_VALUES = Array(100000)
    .fill(0)
    .map((_, i) => `${i}`);
  let i = 0;
  while (i < size) {
    const probability = Math.random();
    // 95% of the time, read only through values 0-19
    if (probability >= 0.05) {
      yield POTENTIAL_VALUES[Math.floor(20 * Math.random())];
      // 5% of the time, read from everywhere else
    } else {
      yield POTENTIAL_VALUES[Math.floor(80 * Math.random()) + 20];
    }
    i++;
  }
};

const expensive = val => {
  let result = 0;
  for (let i = 0; i < 100000; i++) {
    result += i * val;
  }
  return result;
};

module.exports = async () => {
  let expensiveCalls = 0;
  let naiveExpensiveCalls = 0;
  let cachedExpensiveCalls = 0;

  const expensiveFunc = val => {
    expensiveCalls++;
    return expensive(val);
  };
  const naiveCacheFunc = val => {
    naiveExpensiveCalls++;
    return expensive(val);
  };
  const cachedExpensiveFunc = val => {
    cachedExpensiveCalls++;
    return expensive(val);
  };

  // Naive, LRU type caching
  const naive = memoize(naiveCacheFunc, { max: 10 });
  // Our cache function
  const cached = createCachedFunction(cachedExpensiveFunc, 10);

  const dataSet = [...generateDataSet(20000)];

  // Run functions
  const rawStart = process.hrtime();
  dataSet.forEach(expensiveFunc);
  const rawDuration = process.hrtime(rawStart);
  const naiveStart = process.hrtime();
  dataSet.forEach(naive);
  const naiveDuration = process.hrtime(naiveStart);
  const cachedStart = process.hrtime();
  dataSet.forEach(cached);
  const cachedDuration = process.hrtime(cachedStart);

  // Display results
  const table = new Table({
    head: ["Caching Method", "Expensive method calls", "Time"],
    colWidths: [30, 30, 20]
  });
  table.push(
    [
      "None",
      expensiveCalls,
      `${rawDuration[0]}s ${rawDuration[1] / 1000000}ms`
    ],
    [
      "Naive LRU Cache",
      naiveExpensiveCalls,
      `${naiveDuration[0]}s ${naiveDuration[1] / 1000000}ms`
    ],
    [
      "createCachedFunction",
      cachedExpensiveCalls,
      `${cachedDuration[0]}s ${cachedDuration[1] / 1000000}ms`
    ]
  );
  console.log(table.toString());
};
