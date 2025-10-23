// popup.js - minimal popup notifications
(function(){
  function ensureContainer(){
    let c = document.getElementById('popup-container');
    if (!c){
      c = document.createElement('div');
      c.id = 'popup-container';
      c.style.position = 'fixed';
      c.style.right = '12px';
      c.style.top = '12px';
      c.style.zIndex = 9999;
      document.body.appendChild(c);
    }
    return c;
  }
  function show(message, ttlMs, ctx){
    const c = ensureContainer();
    const el = document.createElement('div');
    el.className = 'popup-item';
    el.style.background = '#222';
    el.style.color = '#fff';
    el.style.padding = '8px 12px';
    el.style.marginTop = '8px';
    el.style.borderRadius = '6px';
    el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    const txt = document.createElement('div'); txt.innerText = message;
    el.appendChild(txt);
    if (ctx && ctx.ruleId){
      const btn = document.createElement('button'); btn.innerText='Silence rule'; btn.style.marginLeft='8px';
      btn.addEventListener('click', ()=>{
        // disable the rule
        const rules = window.Storage.get('alertRules', []);
        const nr = rules.map(r=> r.id===ctx.ruleId? Object.assign({}, r, {enabled:false}) : r );
        window.Storage.set('alertRules', nr);
        el.remove();
      });
      el.appendChild(btn);
    }
    const close = document.createElement('button'); close.innerText='Close'; close.style.marginLeft='8px'; close.addEventListener('click', ()=>el.remove());
    el.appendChild(close);
    c.appendChild(el);
    const ttl = ttlMs || 8000;
    setTimeout(()=>{ el.remove(); }, ttl);
  }
  window.popup = { show };
})();
