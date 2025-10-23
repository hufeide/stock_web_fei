// Backend proxy using EastMoney push2 API as primary source for HK symbols
// Fetches fields like f43 (latest * 1000) and f60 (previous close * 1000)
// Normalizes prices by dividing by 1000 and computes percent changes.
const express = require('express');
const app = express();

// Config
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 2000);
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 10000);

// Simple in-memory cache: key = secid (e.g. 116.00700)
const cache = new Map();
let lastFetchAt = null;
let lastUpstreamStatus = null;
let lastError = null;

// Format timestamps in Hong Kong time (UTC+8) as ISO-like string with offset
function hkISO(date = new Date()){
  try{
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Hong_Kong', hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const parts = dtf.formatToParts(date);
    const P = {};
    for (const p of parts) P[p.type] = p.value;
    const ms = String(date.getMilliseconds()).padStart(3,'0');
    return `${P.year}-${P.month}-${P.day}T${P.hour}:${P.minute}:${P.second}.${ms}+08:00`;
  }catch(e){
    // fallback to UTC ISO
    return new Date(date).toISOString();
  }
}

function mapToEastSecid(sym){
  if (!sym) return null;
  const s = String(sym).toUpperCase().trim();
  if (s.endsWith('.HK')){
    const code = s.replace(/\.HK$/,''); // keep leading zeros
    return `116.${code}`;
  }
  return null;
}

async function fetchFromEastMoney(secids){
  const out = {};
  for (const secid of secids){
    try{
      const url = `https://push2.eastmoney.com/api/qt/stock/get?secid=${encodeURIComponent(secid)}`;
      const resp = await (globalThis.fetch ? globalThis.fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://quote.eastmoney.com/', 'Accept': 'application/json, text/plain, */*' } }) : Promise.reject(new Error('fetch not available')));
      lastUpstreamStatus = resp.status;
      if (!resp.ok){
        lastError = `eastmoney HTTP ${resp.status}`;
        console.warn('eastmoney fetch failed', secid, resp.status);
        continue;
      }
      const js = await resp.json();
      const d = js && js.data;
      if (!d){ lastError = 'eastmoney no data'; continue; }

      // user-specified mapping: f43 latest (scaled 1000), f60 prev close (scaled 1000)
      const rawLatest = (typeof d.f43 === 'number') ? d.f43 : (d.f43 ? Number(d.f43) : null);
      const rawPrev = (typeof d.f60 === 'number') ? d.f60 : (d.f60 ? Number(d.f60) : null);
      const latestPrice = rawLatest !== null ? Number((rawLatest/1000).toFixed(3)) : null;
      const prevPrice = rawPrev !== null ? Number((rawPrev/1000).toFixed(3)) : null;
      let percentChange = null;
      if (prevPrice !== null && latestPrice !== null && prevPrice !== 0){
        percentChange = Number((((latestPrice - prevPrice)/prevPrice)*100).toFixed(2));
      }
      // 1. 原始逻辑：取名字
    const name = d.f58 || d.f14 || d.name || null;

  const obj = { name, latestPrice, percentChange, timestamp: hkISO(), raw: { f43: rawLatest, f60: rawPrev } };
      out[secid] = obj;
  cache.set(secid, { data: obj, expiresAt: Date.now() + CACHE_TTL_MS });
  lastFetchAt = hkISO();
      lastError = null;
    }catch(err){
      lastError = String(err && err.message);
      console.error('fetchFromEastMoney error', secid, lastError);
    }
  }
  return out;
}

// lightweight pollers: start on-demand and keep fetching in background
const pollers = new Map();
function ensurePoller(secid){
  if (pollers.has(secid)) return;
  const id = setInterval(()=>{ fetchFromEastMoney([secid]).catch(()=>{}); }, POLL_INTERVAL_MS);
  pollers.set(secid, id);
}

// CORS and ensure JSON responses include charset=utf-8 so browser renders UTF-8 names correctly
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  // For JSON responses Express will set Content-Type, but ensure charset is present
  const _json = res.json.bind(res);
  res.json = function(body){
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type','application/json; charset=utf-8');
    return _json(body);
  };
  next();
});

app.get('/health', (req,res)=>{
  res.json({ status: 'ok', lastFetchAt, lastUpstreamStatus, lastError, cacheSize: cache.size });
});

app.get('/quote', async (req,res)=>{
  const raw = (req.query.symbols || '');
  const symbols = raw.split(',').map(s=>s.trim()).filter(Boolean);
  if (!symbols.length) return res.status(400).json({ error: 'no_symbols' });

  const now = Date.now();
  const results = [];
  const toFetch = [];

  for (const s of symbols){
    const secid = mapToEastSecid(s);
  if (!secid){ results.push({ symbol: s, name: null, latestPrice: null, percentChange: null, timestamp: hkISO(), error: 'unknown_symbol' }); continue; }
    const cached = cache.get(secid);
    if (cached && cached.expiresAt > now){ results.push(Object.assign({ symbol: s }, cached.data)); ensurePoller(secid); }
    else { toFetch.push(secid); ensurePoller(secid); }
  }

  if (toFetch.length){
    const fetched = await fetchFromEastMoney(toFetch);
    for (const s of symbols){
      const secid = mapToEastSecid(s);
      if (!secid) continue;
      const d = fetched[secid] || (cache.get(secid)&&cache.get(secid).data) || null;
      if (d) results.push(Object.assign({ symbol: s }, d));
      else results.push({ symbol: s, name: null, latestPrice: null, percentChange: null, timestamp: hkISO(), error: 'not_found' });
    }
  }

  res.json({ data: results });
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log('EastMoney proxy listening on', port));
