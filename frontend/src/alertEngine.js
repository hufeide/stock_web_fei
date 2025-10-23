// alertEngine.js - evaluate incoming DataPoint against AlertRules
(function(){
  function evaluate(dataPoints){
    // dataPoints: array of {symbol, latestPrice, percentChange, timestamp}
    const rules = window.Storage.get('alertRules', []);
    const triggered = [];
    for (const r of rules){
      if (!r.enabled) continue;
      if (r.targetType === 'TICKER'){
        const dp = dataPoints.find(d=>d.symbol === r.targetId);
        if (!dp) continue;
        if (r.direction === 'UP' && dp.percentChange >= r.thresholdPercent){ triggered.push({rule:r, data:dp}); }
        if (r.direction === 'DOWN' && dp.percentChange <= r.thresholdPercent){ triggered.push({rule:r, data:dp}); }
      }
      // watchlist handling omitted for brevity
    }
    for (const t of triggered){
      // record history
      const history = window.Storage.get('alertHistory', []);
      history.push({ id:'h_'+Date.now(), ruleId: t.rule.id, symbol: t.data.symbol, percentChange: t.data.percentChange, timestamp: new Date().toISOString() });
      window.Storage.set('alertHistory', history);
      window.Observability.alertTriggered();
      if (t.rule.popupEnabled && window.Storage.get('popupGlobalEnabled', true)){
        try{ window.popup.show(`${t.data.symbol} ${t.data.percentChange}% reached threshold ${t.rule.thresholdPercent}%`, 8000, { ruleId: t.rule.id }); }catch(e){}
      }
    }
    return triggered;
  }
  window.alertEngine = { evaluate };
})();
