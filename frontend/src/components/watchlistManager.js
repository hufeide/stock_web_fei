// watchlistManager.js - simple watchlist add/remove UI
(function(){
  function render(containerId){
    const c = document.getElementById(containerId);
    if(!c) return;
    const list = window.Storage.get('watchlist', window.AppConfig.defaultWatchlist || []);
    c.innerHTML = `<div class="watchlist-manager"><h3>Watchlist</h3><input id="wl-add" placeholder="Ticker (e.g. 00700.HK)" /><button id="wl-add-btn">Add</button><ul id="wl-list"></ul></div>`;
    const ul = document.getElementById('wl-list');
    function redraw(){
      ul.innerHTML='';
      const cur = window.Storage.get('watchlist', window.AppConfig.defaultWatchlist || []);
      cur.forEach(s=>{
        const li = document.createElement('li');
        li.innerText = s + ' ';
        const rem = document.createElement('button'); rem.innerText='Remove';
        rem.addEventListener('click', ()=>{ const newl = window.Storage.get('watchlist',[]).filter(x=>x!==s); window.Storage.set('watchlist', newl); redraw(); });
        li.appendChild(rem);
        ul.appendChild(li);
      });
    }
    document.getElementById('wl-add-btn').addEventListener('click', ()=>{
      const v = document.getElementById('wl-add').value.trim();
      if (!v) return; const cur = window.Storage.get('watchlist', window.AppConfig.defaultWatchlist || []); cur.push(v); window.Storage.set('watchlist', [...new Set(cur)]); document.getElementById('wl-add').value=''; redraw();
    });
    redraw();
  }
  window.watchlistManager = { render };
})();
