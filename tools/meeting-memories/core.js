'use strict';
// Shared date, media and backup rules. No DOM or storage side effects.
const MeetingCore = (() => {
  const MAX_FILE = 15 * 1024 * 1024;
  const MAX_TOTAL = 30 * 1024 * 1024;
  const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
  function dateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function validDate(value) {
    if (typeof value !== 'string' || !/^20\d{2}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00`);
    return !Number.isNaN(date.getTime()) && dateKey(date) === value;
  }
  function monthCells(year, month) {
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    return [...Array(offset).fill(null), ...Array.from({length:new Date(year, month + 1, 0).getDate()}, (_, day) => dateKey(new Date(year, month, day + 1)))];
  }
  function fileKind(type) { return TYPES.includes(type) ? (type.startsWith('image/') ? 'image' : 'video') : null; }
  function mediaBytes(item) { return Math.ceil(((item.data || '').split(',')[1] || '').length * 3 / 4); }
  function totalBytes(records) { return records.reduce((sum, record) => sum + record.media.reduce((n, item) => n + mediaBytes(item), 0), 0); }
  function text(value, max) {
    if (typeof value !== 'string' || value.length > max) throw new Error('备份中的文字字段不符合要求。');
    return value;
  }
  function validateBackup(payload) {
    if (!payload || payload.format !== 'meet-and-keep' || payload.version !== 1 || !Array.isArray(payload.records)) throw new Error('请导入此公开体验版导出的备份；旧版文件需在原工具中打开。');
    if (payload.records.length > 500) throw new Error('体验版最多支持 500 天记录。');
    const dates = new Set(); let mediaCount = 0;
    const records = payload.records.map(record => {
      if (!record || !validDate(record.date) || dates.has(record.date)) throw new Error('备份包含无效或重复日期。');
      dates.add(record.date);
      if (!Array.isArray(record.media) || record.media.length > 30) throw new Error('每一天最多保留 30 个影像。');
      const ids = new Set();
      const media = record.media.map(item => {
        if (!item || !fileKind(item.type) || typeof item.id !== 'string' || !/^[a-zA-Z0-9_-]{1,90}$/.test(item.id) || ids.has(item.id)) throw new Error('备份中的影像格式不正确。');
        ids.add(item.id);
        const data = item.data;
        const prefix = `data:${item.type};base64,`;
        if (typeof data !== 'string' || !data.startsWith(prefix) || data.length > MAX_FILE * 1.34 + 100 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data.slice(prefix.length))) throw new Error('影像必须为受支持的本地文件，且不超过 15 MB。');
        if (mediaBytes(item) > MAX_FILE) throw new Error('单个影像超过 15 MB。');
        mediaCount++;
        return {id:item.id, name:text(item.name, 180), type:item.type, data};
      });
      return {date:record.date, title:text(record.title, 60), location:text(record.location, 80), note:text(record.note, 2000), media};
    });
    if (mediaCount > 300 || totalBytes(records) > MAX_TOTAL) throw new Error('体验版影像上限为 300 个、合计 30 MB。');
    return records;
  }
  function mergeRecords(existing, incoming) {
    const merged = new Map(existing.map(record => [record.date, record]));
    incoming.forEach(record => merged.set(record.date, record));
    return [...merged.values()].sort((a, b) => b.date.localeCompare(a.date));
  }
  function backup(records) { return {format:'meet-and-keep', version:1, records}; }
  return {MAX_FILE, MAX_TOTAL, dateKey, validDate, monthCells, fileKind, totalBytes, validateBackup, mergeRecords, backup};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = MeetingCore;
