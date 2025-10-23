// alertEditor.js - UI to create/edit AlertRule
(function(){
  function render(containerId){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = `
      <div>
        <h3>Create Alert</h3>
        <label>Symbol: <input id="ae-symbol" /></label>
        <label>Threshold (%): <input id="ae-threshold" type="number" step="0.01" /></label>
        <label>Direction: <select id="ae-direction"><option value="UP">UP</option><option value="DOWN">DOWN</option></select></label>
        <label>Popup: <input id="ae-popup" type="checkbox" checked /></label>
        <button id="ae-save">Save Alert</button>
      </div>`;
    document.getElementById('ae-save').addEventListener('click', ()=>{
      const symbol = document.getElementById('ae-symbol').value.trim();
      const thr = parseFloat(document.getElementById('ae-threshold').value);
      const dir = document.getElementById('ae-direction').value;
      const popup = document.getElementById('ae-popup').checked;
      if (!symbol || isNaN(thr)) { alert('Provide symbol and threshold'); return; }
      const rule = { id: 'r_'+Date.now(), targetType: 'TICKER', targetId: symbol, thresholdPercent: thr, direction: dir, popupEnabled: popup, enabled:true, createdAt:new Date().toISOString() };
      const rules = window.Storage.get('alertRules', []);
      rules.push(rule);
      window.Storage.set('alertRules', rules);
      alert('Saved');
      window.location.reload();
    });
  }
  window.alertEditor = { render };
})();
