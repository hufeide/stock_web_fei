// node test for alertEngine - minimal harness
const assert = require('assert');
const vm = require('vm');
const fs = require('fs');

function createWindow(){
  const store = {};
  return {
    Storage: {
      get: (k, d)=> (k in store? store[k] : d),
      set: (k,v)=> { store[k]=v; }
    },
    Observability: { alertTriggered: ()=>{} },
    popup: { show: ()=>{} },
    window: {}
  };
}

const win = createWindow();
const ctx = vm.createContext(win);
// ensure window references the sandbox so code that uses `window.*` works
ctx.window = ctx;

// load alertEngine and alertHistory source
const alertEngineSrc = fs.readFileSync(__dirname + '/../../frontend/src/alertEngine.js','utf8');
const alertHistorySrc = fs.readFileSync(__dirname + '/../../frontend/src/alertHistory.js','utf8');
vm.runInContext(alertEngineSrc, ctx);
vm.runInContext(alertHistorySrc, ctx);

// add a rule
win.Storage.set('alertRules', [{ id:'r1', targetType:'TICKER', targetId:'TEST', thresholdPercent:1.0, direction:'UP', popupEnabled:false, enabled:true }]);

// simulate incoming data
const data = [{ symbol:'TEST', latestPrice:101, percentChange:1.2, timestamp: new Date().toISOString() }];
const triggered = ctx.alertEngine.evaluate(data);
assert(Array.isArray(triggered) && triggered.length===1, 'expected one trigger');
const history = win.Storage.get('alertHistory', []);
assert(history.length===1 && history[0].ruleId==='r1', 'history recorded');
console.log('alert engine test passed');
