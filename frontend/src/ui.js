// ui.js - small helpers for timestamp and stale indicator
(function(){
  function displayTimestamp(containerId, timestamp){
    const el = document.getElementById(containerId);
    if (!el) return;
    const tm = timestamp ? new Date(timestamp) : null;
    const now = new Date();
    let text = 'No data yet';
    if (tm){
      const age = Math.floor((now - tm)/1000);
      text = `Last update: ${tm.toISOString()} (${age}s ago)`;
      if (age > (window.AppConfig.maxStalenessSec || 60)){
        text += ' - DATA MAY BE STALE';
      }
    }
    el.innerText = text;
  }
  window.ui = { displayTimestamp };
})();
