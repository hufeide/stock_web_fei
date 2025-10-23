// Configuration for HK Stock Alerts MVP
window.AppConfig = {
  refreshIntervalSec: 60,
  endpoint: 'http://localhost:3000/quote', // proxy backend for local dev
  maxStalenessSec: 60,
  defaultWatchlist: ['00700.HK','00001.HK']
};