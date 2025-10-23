// observability.js - minimal hooks for logging/metrics
const Observability = (function(){
  const metrics = { fetchCount:0, fetchErrors:0, lastFetch:null, alerts:0 };
  function dataFetchSuccess(ts){ metrics.fetchCount += 1; metrics.lastFetch = ts; console.log('[OBS] fetch success', ts); }
  function dataFetchFailure(){ metrics.fetchErrors += 1; console.warn('[OBS] fetch failure'); }
  function alertTriggered(){ metrics.alerts += 1; console.log('[OBS] alert triggered'); }
  function exportMetrics(){ return Object.assign({}, metrics); }
  return { dataFetchSuccess, dataFetchFailure, alertTriggered, exportMetrics };
})();
window.Observability = Observability;
