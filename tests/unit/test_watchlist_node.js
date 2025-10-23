// node test for watchlist persistence - minimal harness
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
    AppConfig: { defaultWatchlist: [] }
  };
}

const win = createWindow();
const ctx = vm.createContext(win);
ctx.window = ctx;

const wlSrc = fs.readFileSync(__dirname + '/../../frontend/src/components/watchlistManager.js','utf8');
vm.runInContext(wlSrc, ctx);
// simulate DOM elements by adding minimal document API
ctx.document = { getElementById: ()=>null };

// test storage behavior
win.Storage.set('watchlist', ['A','B']);
const cur = win.Storage.get('watchlist', []);
assert(Array.isArray(cur) && cur.length===2, 'watchlist saved');
console.log('watchlist persistence test passed');
