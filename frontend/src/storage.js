// storage.js - simple browser persistence abstraction
const Storage = {
  get(key, fallback=null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      console.warn('Storage.get parse error', e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage.set error', e);
    }
  }
};

window.Storage = Storage;
