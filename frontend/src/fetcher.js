// fetcher.js - minimal fetch abstraction for MVP
async function fetchQuotes(symbols) {
  // symbols: array of symbol strings like ['00700.HK']
  const qs = encodeURIComponent(symbols.join(','));
  const url = `${window.AppConfig.endpoint}?symbols=${qs}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response not ok');
    const json = await res.json();
    // Normalize to DataPoint objects
    // Keep both `latestPrice` and `price` (some backends use one or the other)
    return (json.data || []).map(item => ({
      symbol: item.symbol,
      name: item.name || null,
      latestPrice: (item.latestPrice != null) ? item.latestPrice : (item.price != null ? item.price : null),
      price: (item.price != null) ? item.price : (item.latestPrice != null ? item.latestPrice : null),
      percentChange: item.percentChange,
      timestamp: item.timestamp
    }));
  } catch (err) {
    console.error('fetchQuotes error', err);
    throw err;
  }
}

// Exponential backoff wrapper
async function fetchWithRetry(symbols, attempts = 3) {
  let attempt = 0;
  while (attempt < attempts) {
    try {
      return await fetchQuotes(symbols);
    } catch (err) {
      attempt += 1;
      const wait = Math.pow(2, attempt) * 100 + Math.floor(Math.random()*200);
      await new Promise(r => setTimeout(r, wait));
    }
  }
  throw new Error('fetchWithRetry: all attempts failed');
}

window.fetcher = { fetchWithRetry };
