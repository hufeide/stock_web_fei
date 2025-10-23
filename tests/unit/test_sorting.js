const assert = (cond, msg) => { if(!cond) throw new Error(msg||'assert failed'); }

// simple test for sort utility
(function(){
  const data = [
    { symbol: 'A', percentChange: 1 },
    { symbol: 'B', percentChange: -2 },
    { symbol: 'C', percentChange: 3 }
  ];
  const sorted = window.SortUtils.sortByPercentChangeDesc(data);
  assert(sorted[0].symbol === 'C', 'expected C first');
  assert(sorted[1].symbol === 'A', 'expected A second');
  assert(sorted[2].symbol === 'B', 'expected B last');
  console.log('test_sorting passed');
})();
