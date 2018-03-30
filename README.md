# JS Caching Fun

Implements a cache for memoizing an expensive function. The cache is optimized for the majority of reads coming from a small set of keys. It accomplishes this by keeping track of the number of reads per key.

## Install

After cloning, install dependencies:

```bash
npm i
```

or

```bash
yarn
```

## Run

To run:

```bash
npm start
```

or

```bash
yarn start
```

## Benchmark

The library comes with benchmarking. It uses a generated data set and compares the custom caching method in this library to a naive least-recently-used based memoization.

```bash
npm run benchmark
```

or

```bash
yarn run benchmark
```

### Sample Results

| Caching Method       | Expensive method calls | Time             |
| -------------------- | ---------------------- | ---------------- |
| None                 | 20000                  | 16s 419.639467ms |
| Naive LRU Cache      | 11061                  | 8s 787.967688ms  |
| createCachedFunction | 1828                   | 1s 450.803339ms  |

## Test

To run the test suite:

```bash
npm test
```

or

```bash
yarn test
```
