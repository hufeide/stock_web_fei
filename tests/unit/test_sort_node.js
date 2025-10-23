// Node test for sort utility (loads file and evaluates function)
const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('frontend/src/sort.js', 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(code, sandbox);
const sort = sandbox.window.SortUtils.sortByPercentChangeDesc;
const data = [ { symbol: 'A', percentChange: 1 }, { symbol: 'B', percentChange: -2 }, { symbol: 'C', percentChange: 3 } ];
const sorted = sort(data);
if (sorted[0].symbol !== 'C') throw new Error('expected C first');
if (sorted[2].symbol !== 'B') throw new Error('expected B last');
console.log('node test_sort_node passed');
