// sort.js - sorting utilities for stock lists
(function(){
  function sortByPercentChangeDesc(data){
    // copy and sort
    return (data || []).slice().sort((a,b)=>{
      const pa = Number(a.percentChange || 0);
      const pb = Number(b.percentChange || 0);
      return pb - pa;
    });
  }
  window.SortUtils = { sortByPercentChangeDesc };
})();
