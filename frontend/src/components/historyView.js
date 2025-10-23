// historyView.js - show recent alert history
(function(){
  function render(containerId){
    const c = document.getElementById(containerId);
    if(!c) return;
    const list = window.alertHistory.list();
    c.innerHTML = '<h3>Alert History</h3>' + (list.length? '<ul id="hist-list"></ul>' : '<div>No alerts yet</div>');
    const ul = document.getElementById('hist-list');
    if(ul){
      list.slice().reverse().forEach(h=>{
        const li = document.createElement('li');
        li.innerText = `${h.timestamp} - ${h.symbol} ${h.percentChange}% (rule:${h.ruleId})`;
        ul.appendChild(li);
      });
    }
  }
  window.historyView = { render };
})();
