// main.js - bootstrap for minimal MVP
(function(){
  const defaultWatchlist = window.AppConfig.defaultWatchlist || [];
  let watchlist = window.Storage.get('watchlist', defaultWatchlist);
  const refreshInterval = window.AppConfig.refreshIntervalSec || 60;
  const containerId = 'list';

  async function doFetchAndRender(){
    try{
      // re-read watchlist each poll so UI changes take effect without reload
      watchlist = window.Storage.get('watchlist', window.AppConfig.defaultWatchlist || []);
      const data = await window.fetcher.fetchWithRetry(watchlist);
      // Add name placeholder if missing
      const enriched = data.map(d=>Object.assign({name:''}, d));
      window.listView.renderList(containerId, enriched);
      const now = new Date().toISOString();
      document.getElementById('status').innerText = `Last fetch: ${now}`;
      window.ui.displayTimestamp('status', now);
      window.Observability.dataFetchSuccess(now);
      // evaluate alert rules against the latest data
      try{
        if (window.alertEngine && typeof window.alertEngine.evaluate === 'function'){
          window.alertEngine.evaluate(enriched);
        }
      }catch(e){ console.error('alert engine error', e); }
      // Update metrics file if running in an environment that serves static files
      try{
        if (window.Observability && window.Observability.exportMetrics){
          const m = window.Observability.exportMetrics();
          // best-effort: write to in-memory metrics.json endpoint via fetch (if backend supports)
          // This is a placeholder; server-side should expose /health
        }
      }catch(e){/* ignore */}
    } catch(e){
      window.Observability.dataFetchFailure();
      document.getElementById('status').innerText = `Fetch error at ${new Date().toISOString()}`;
    }
  }

  // initial render
  document.addEventListener('DOMContentLoaded', ()=>{
    window.listView.renderList(containerId, []);
    // render settings and history UI
  try{ window.settings && window.settings.render && window.settings.render('controls'); }catch(e){}
  try{ window.watchlistManager && window.watchlistManager.render && window.watchlistManager.render('controls'); }catch(e){}
  try{ window.historyView && window.historyView.render && window.historyView.render('alerts'); }catch(e){}
    doFetchAndRender();
    setInterval(doFetchAndRender, refreshInterval*1000 + Math.floor(Math.random()*10000));
  });
})();
