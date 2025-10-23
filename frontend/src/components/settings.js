// settings.js - UI for global settings (popupGlobalEnabled)
(function(){
  function render(containerId){
    const c = document.getElementById(containerId);
    if(!c) return;
    const enabled = window.Storage.get('popupGlobalEnabled', true);
    c.innerHTML = `<div class="settings"><label>Enable popups: <input id="s-popup" type="checkbox" ${enabled? 'checked':''} /></label></div>`;
    document.getElementById('s-popup').addEventListener('change', (e)=>{
      window.Storage.set('popupGlobalEnabled', e.target.checked);
    });
  }
  window.settings = { render };
})();
