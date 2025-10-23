// alertHistory.js - simple accessors for alert history
(function(){
  function list(){
    return window.Storage.get('alertHistory', []);
  }
  function clear(){
    window.Storage.set('alertHistory', []);
  }
  function remove(id){
    const h = list().filter(x=>x.id!==id);
    window.Storage.set('alertHistory', h);
  }
  window.alertHistory = { list, clear, remove };
})();
