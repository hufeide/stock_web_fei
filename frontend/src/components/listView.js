// listView.js - renders a sortable table into #list
(function(){
  function renderList(containerId, data){
    const container = document.getElementById(containerId);
    if (!container) return;
    // sort by percentChange desc by default
    const sorted = (window.SortUtils && window.SortUtils.sortByPercentChangeDesc) ? window.SortUtils.sortByPercentChangeDesc(data) : data;
    // Build DOM nodes to avoid HTML encoding issues with UTF-8 strings
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Symbol</th><th>Name</th><th>Price</th><th>%Change</th><th>Timestamp</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    for (const d of sorted){
      const tr = document.createElement('tr');
      const tdSymbol = document.createElement('td'); tdSymbol.innerText = d.symbol; tr.appendChild(tdSymbol);
      const tdName = document.createElement('td'); tdName.innerText = d.name || ''; tr.appendChild(tdName);
      const tdPrice = document.createElement('td'); tdPrice.innerText = (d.price != null ? d.price : (d.latestPrice != null ? d.latestPrice : '-')); tr.appendChild(tdPrice);
      const tdPct = document.createElement('td'); tdPct.innerText = (d.percentChange != null ? d.percentChange + '%' : '-'); tr.appendChild(tdPct);
      const tdTs = document.createElement('td'); tdTs.innerText = d.timestamp || ''; tr.appendChild(tdTs);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
  }
  window.listView = { renderList };
})();
