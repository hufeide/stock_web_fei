// test that popup global override prevents popup but history is recorded
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
    popup: { show: ()=>{ throw new Error('should not be called when global disabled'); } },
    window: {}
  };
}

const win = createWindow();
const ctx = vm.createContext(win);
ctx.window = ctx;

const ae = fs.readFileSync(__dirname + '/../../frontend/src/alertEngine.js','utf8');
const ah = fs.readFileSync(__dirname + '/../../frontend/src/alertHistory.js','utf8');
vm.runInContext(ae, ctx);
vm.runInContext(ah, ctx);

win.Storage.set('alertRules', [{ id:'r1', targetType:'TICKER', targetId:'TEST', thresholdPercent:1.0, direction:'UP', popupEnabled:true, enabled:true }]);
win.Storage.set('popupGlobalEnabled', false);

const data = [{ symbol:'TEST', latestPrice:101, percentChange:1.2, timestamp: new Date().toISOString() }];
// should not throw
const triggered = ctx.alertEngine.evaluate(data);
assert(triggered.length===1, 'rule should trigger');
const history = win.Storage.get('alertHistory', []);
assert(history.length===1, 'history should be recorded');
console.log('popup override test passed');
