'use strict';
const C = MeetingCore;
const $ = id => document.getElementById(id);
const embedded = new URLSearchParams(location.search).get('embed') === '1';
document.body.classList.toggle('embedded', embedded);
const sample = [
  {date:'2026-09-06', title:'沿着湖边，慢慢走', location:'湖边步道', note:'本来只想出来走十分钟，后来一直走到了日落。\n没有特别的安排，风和晚霞刚刚好。', media:[{id:'lake',name:'日落时的湖边 · 示例插画',type:'image/svg+xml',src:'assets/lake.svg'},{id:'train',name:'回去的路上 · 示例插画',type:'image/svg+xml',src:'assets/train.svg'}]},
  {date:'2026-08-22', title:'周末，坐一趟慢车', location:'去山里的路上', note:'临时买票，临时出发。\n窗外一片绿色，聊着聊着就到站了。',media:[{id:'train',name:'窗外的山 · 示例插画',type:'image/svg+xml',src:'assets/train.svg'}]},
  {date:'2026-08-15', title:'好久不见，还是聊不完', location:'街角咖啡店', note:'从下午坐到天黑。\n咖啡早就凉了，话题却一直没有停。',media:[{id:'cafe',name:'两杯咖啡的下午 · 示例插画',type:'image/svg+xml',src:'assets/cafe.svg'}]}
];
let mode = 'demo', selected = sample[0].date, month = new Date(`${selected}T12:00:00`);
let personal = [], database = null, storageReady = false, busy = false;
let mediaIndex = 0, draftMedia = [], dirty = false, editing = false, toastTimer;
function setBusy(value) { busy = value; $('app').inert = value; }
function records() { return mode === 'demo' ? sample : personal; }
function current() { return records().find(record => record.date === selected) || {date:selected,title:'这一天，想留下什么？',location:'',note:'',media:[]}; }
function toast(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 5500); }
function el(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
function confirmAction(title, message, label = '确认') {
  return new Promise(resolve => {
    const dialog = $('confirm-dialog'); $('confirm-title').textContent = title; $('confirm-message').textContent = message; $('confirm-yes').textContent = label;
    const finish = value => { dialog.close(); dialog.oncancel = null; $('confirm-yes').onclick = null; $('confirm-no').onclick = null; resolve(value); };
    $('confirm-yes').onclick = () => finish(true); $('confirm-no').onclick = () => finish(false);
    dialog.oncancel = event => { event.preventDefault(); finish(false); }; dialog.showModal();
  });
}
async function discardAllowed() { return !dirty || await confirmAction('这几句话还没保存', '离开会丢失这次修改。可以返回保存，再继续翻日历。', '放弃这次修改'); }
async function chooseDay(date) {
  if (busy || !C.validDate(date) || !await discardAllowed()) return;
  selected = date; month = new Date(`${date}T12:00:00`); editing = false; dirty = false; mediaIndex = 0; render();
}
async function changeMode(next, newDay = false) {
  if (embedded || busy || !await discardAllowed()) return;
  if (next === 'personal' && !storageReady) { toast('本地存储尚不可用。可以先浏览示例，或换一个支持本地存储的浏览器。'); return; }
  mode = next; editing = false; dirty = false; mediaIndex = 0;
  selected = next === 'demo' ? sample[0].date : (newDay ? C.dateKey(new Date()) : (personal[0]?.date || C.dateKey(new Date())));
  month = new Date(`${selected}T12:00:00`); render();
  if (newDay) startEditing();
}
function renderCalendar() {
  const year = month.getFullYear(), m = month.getMonth();
  $('month-label').textContent = `${year} 年 ${m + 1} 月`;
  $('date-jump').value = selected;
  $('prev-month').disabled = year === 2000 && m === 0;
  $('next-month').disabled = year === 2099 && m === 11;
  const dates = new Set(records().map(record => record.date)); const fragment = document.createDocumentFragment();
  C.monthCells(year, m).forEach(date => {
    if (!date) { fragment.append(el('span')); return; }
    const button = el('button', date === C.dateKey(new Date()) ? 'today' : '', String(Number(date.slice(-2))));
    button.setAttribute('aria-label', `${date}${dates.has(date) ? '，有回忆' : ''}`); button.setAttribute('aria-pressed', String(date === selected)); button.dataset.record = String(dates.has(date));
    button.addEventListener('click', () => chooseDay(date)); fragment.append(button);
  });
  $('calendar-grid').replaceChildren(fragment);
  $('record-count').textContent = `${records().length} 天`;
  const recent = document.createDocumentFragment();
  records().slice(0, 8).forEach(record => {
    const button = el('button'); button.setAttribute('aria-pressed', String(record.date === selected));
    const tile = el('span', 'date-tile', String(Number(record.date.slice(-2)))); tile.append(el('small', '', `${record.date.slice(0,4)} / ${Number(record.date.slice(5,7))} 月`));
    const text = el('span', 'recent-text'); text.append(el('strong', '', record.title || '留住这一天'), el('small', '', record.location || '有故事的一天'));
    button.append(tile, text); button.addEventListener('click', () => chooseDay(record.date)); recent.append(button);
  });
  if (!records().length) recent.append(el('p', 'calendar-footnote', '还没有记录。选一天，就可以开始。'));
  $('recent-days').replaceChildren(recent);
}
function mediaNode(item) {
  const node = el(item.type.startsWith('video/') ? 'video' : 'img');
  node.src = item.src || item.data;
  if (node.tagName === 'IMG') { node.alt = item.name; node.addEventListener('error', () => { node.replaceWith(el('p', 'empty-image', '这张图片暂时打不开。原文件仍保留在备份中。')); }); }
  else { node.controls = true; node.preload = 'metadata'; node.playsInline = true; node.addEventListener('error', () => toast('浏览器无法播放这个视频编码。可尝试 MP4（H.264）或 WebM。')); }
  return node;
}
function stopVideos(container) { container.querySelectorAll('video').forEach(video => { video.pause(); video.removeAttribute('src'); video.load(); }); }
function renderMedia() {
  const record = current(); if (mediaIndex >= record.media.length) mediaIndex = 0;
  stopVideos($('media-stage')); $('media-stage').replaceChildren(); $('media-thumbs').replaceChildren();
  if (record.media.length) {
    const item = record.media[mediaIndex];
    if (item.type.startsWith('video/')) $('media-stage').append(mediaNode(item));
    else { const button = el('button'); button.setAttribute('aria-label', `放大查看：${item.name}`); button.append(mediaNode(item), el('span', 'image-hint', mode === 'demo' ? '示例插画 · 点开看看 ↗' : '点开看看 ↗')); button.addEventListener('click', openLightbox); $('media-stage').append(button); }
    record.media.forEach((media, index) => {
      const button = el('button'); button.setAttribute('aria-label', `影像 ${index + 1}：${media.name}`); button.setAttribute('aria-pressed', String(index === mediaIndex));
      button.append(media.type.startsWith('video/') ? el('span', '', '▶ 视频') : mediaNode(media));
      button.addEventListener('click', () => { mediaIndex = index; renderMedia(); }); $('media-thumbs').append(button);
    });
  } else {
    const empty = el('div', 'empty-image'); empty.append(el('b', '', '◒'), el('p', '', mode === 'demo' ? '这一天，还留着空白。' : '给这一天，加一张照片吧。'), el('small', '', mode === 'demo' ? '试试日历里有小圆点的日子。' : '也可以只写几句话，照片以后再补。')); $('media-stage').append(empty);
  }
  const images = record.media.filter(item => item.type.startsWith('image/')).length;
  $('media-count').textContent = record.media.length ? `${images} ${mode === 'demo' ? '幅插画' : '张照片'} · ${record.media.length - images} 段视频` : '留一点空白，等故事发生。';
}
function render() {
  const record = current();
  $('demo-mode').setAttribute('aria-pressed', String(mode === 'demo')); $('personal-mode').setAttribute('aria-pressed', String(mode === 'personal'));
  $('mode-caption').textContent = mode === 'demo' ? '3 段虚构回忆 · 配图为原创插画' : '只保存在当前浏览器 · 记得备份';
  $('day-date').textContent = selected.replaceAll('-', ' / '); $('day-tag').textContent = mode === 'demo' ? '示例回忆' : '我的回忆';
  $('day-title').textContent = record.title || '留住这一天'; $('day-location').textContent = record.location;
  $('day-note').textContent = record.note || '照片以外，你还记得些什么？';
  $('edit-day').hidden = mode !== 'personal' || editing; $('try-own').hidden = mode !== 'demo' || embedded;
  $('editor').hidden = !editing; renderCalendar(); renderMedia();
}
function markDirty() { dirty = true; $('save-state').textContent = '有修改，记得保存'; }
function renderDraftFiles() {
  $('draft-files').replaceChildren();
  draftMedia.forEach((item, index) => {
    const row = el('div'); const button = el('button', '', '移出这次记录'); button.type = 'button'; button.setAttribute('aria-label', `移出：${item.name}`);
    button.addEventListener('click', () => { if (busy) return; draftMedia.splice(index, 1); markDirty(); renderDraftFiles(); }); row.append(el('span', '', item.name), button); $('draft-files').append(row);
  });
}
function startEditing() {
  if (busy || mode !== 'personal') return;
  const record = personal.find(item => item.date === selected);
  editing = true; dirty = false; draftMedia = [...(record?.media || [])];
  $('title-input').value = record?.title || ''; $('location-input').value = record?.location || ''; $('note-input').value = record?.note || '';
  $('save-state').textContent = record ? '已保存，可继续修改' : '尚未保存'; $('editor').hidden = false; $('edit-day').hidden = true; renderDraftFiles(); $('title-input').focus();
}
function txComplete(tx) { return new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error('写入已取消')); }); }
async function storeRecords(next) {
  if (!database) throw new Error('浏览器存储不可用');
  const tx = database.transaction('days', 'readwrite'); const done = txComplete(tx);
  next.forEach(record => tx.objectStore('days').put(record)); await done;
}
async function openStorage() {
  if (embedded) return;
  try {
    database = await new Promise((resolve, reject) => { const request = indexedDB.open('meet-and-keep-public-v1', 1); request.onupgradeneeded = () => request.result.createObjectStore('days', {keyPath:'date'}); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); request.onblocked = () => reject(new Error('请关闭其他旧版窗口后重试')); });
    database.onversionchange = () => { database.close(); database = null; storageReady = false; toast('存储版本发生变化，请保存备份并刷新。'); };
    personal = await new Promise((resolve, reject) => { const request = database.transaction('days').objectStore('days').getAll(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    personal = C.validateBackup(C.backup(personal)).sort((a,b) => b.date.localeCompare(a.date)); storageReady = true;
  } catch (error) { $('storage-warning').hidden = false; $('storage-warning').textContent = '当前浏览器暂时无法读取本地记录。示例仍可浏览；请尝试普通浏览窗口，原有数据不会被覆盖。'; }
}
async function saveDay(event) {
  event.preventDefault(); if (busy || mode !== 'personal' || !storageReady) return;
  const record = {date:selected,title:$('title-input').value.trim(),location:$('location-input').value.trim(),note:$('note-input').value.trim(),media:[...draftMedia]};
  if (!record.title && !record.note && !record.location && !record.media.length) { toast('写一句话，或放一张照片，再保存吧。'); return; }
  setBusy(true); $('save-day').disabled = true; $('save-state').textContent = '正在保存…';
  try { const next = C.validateBackup(C.backup(C.mergeRecords(personal, [record]))); await storeRecords([record]); personal = next; dirty = false; editing = false; render(); toast('这一天，收好了。'); }
  catch (error) { $('save-state').textContent = '保存未完成，修改仍在'; toast(error.message?.includes('体验版') ? error.message : '保存未完成，可能是本地空间不足。请先保留当前文字或下载已有备份。'); }
  finally { setBusy(false); $('save-day').disabled = false; }
}
function readFile(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('文件没有读取成功，请再试一次。')); reader.readAsDataURL(file); }); }
async function addMedia(event) {
  if (busy || !editing) { event.target.value = ''; return; }
  const files = [...event.target.files]; event.target.value = ''; if (!files.length) return;
  setBusy(true);
  try {
    if (draftMedia.length + files.length > 30) throw new Error('每一天最多添加 30 个影像。');
    if (files.some(file => !C.fileKind(file.type) || !file.size || file.size > C.MAX_FILE)) throw new Error('请选 JPG、PNG、WebP、GIF、MP4 或 WebM，每个文件不超过 15 MB。');
    if (C.totalBytes(personal.filter(record => record.date !== selected)) + C.totalBytes([{media:draftMedia}]) + files.reduce((sum, file) => sum + file.size, 0) > C.MAX_TOTAL) throw new Error('本地影像总量将超过 30 MB，请减少文件。');
    const pending = [];
    for (const file of files) pending.push({id:crypto.randomUUID(),name:file.name.slice(0,180),type:file.type,data:await readFile(file)});
    draftMedia.push(...pending); markDirty(); renderDraftFiles(); toast(`已加入 ${pending.length} 个文件，保存后就能回看。`);
  } catch (error) { toast(error.message); } finally { setBusy(false); }
}
function openLightbox() { stopVideos($('media-stage')); renderLightbox(); $('lightbox').showModal(); }
function renderLightbox() {
  const record = current(), item = record.media[mediaIndex]; if (!item) return;
  stopVideos($('lightbox-media')); $('lightbox-media').replaceChildren(mediaNode(item)); $('lightbox-caption').textContent = item.name;
  $('lightbox-counter').textContent = `${mediaIndex + 1} / ${record.media.length}`; $('prev-media').disabled = mediaIndex === 0; $('next-media').disabled = mediaIndex === record.media.length - 1;
}
function moveMedia(delta) { const next = mediaIndex + delta; if (next < 0 || next >= current().media.length) return; mediaIndex = next; renderLightbox(); }
function downloadBackup() {
  if (!storageReady) { toast('请等待本地记录读取完成。'); return; }
  if (!personal.length) { toast('先记下一天，再把回忆带走。'); return; }
  const url = URL.createObjectURL(new Blob([JSON.stringify(C.backup(personal))], {type:'application/json'}));
  const link = el('a'); link.href = url; link.download = `见见面备份-${C.dateKey(new Date())}.json`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 15000);
  toast('已发起备份下载，请确认文件已保存。备份含有你的文字和影像，请妥善保管。');
}
async function importBackup(event) {
  const file = event.target.files[0]; event.target.value = ''; if (!file || busy) return;
  if (!storageReady) { toast('当前本地存储不可用，未导入。'); return; }
  if (!await discardAllowed()) return;
  setBusy(true);
  try {
    if (file.size > 43 * 1024 * 1024) throw new Error('备份过大，体验版最多支持 30 MB 影像。');
    let parsed; try { parsed = JSON.parse(await file.text()); } catch { throw new Error('这份文件不是完整的 JSON 备份，原记录未改变。'); }
    const incoming = C.validateBackup(parsed); if (!incoming.length) throw new Error('这份备份里没有记录。');
    const conflicts = incoming.filter(record => personal.some(old => old.date === record.date)).length;
    const next = C.validateBackup(C.backup(C.mergeRecords(personal, incoming)));
    const confirmed = await confirmAction('把这份回忆放进来？', `将导入 ${incoming.length} 天记录。${conflicts ? `其中 ${conflicts} 天与现有记录同日，确认后会替换这些日期的文字与影像。建议先返回下载备份。` : '现有日期的记录会保留。'}`, conflicts ? '确认替换并导入' : '确认导入');
    if (!confirmed) return;
    await storeRecords(incoming); personal = next; mode = 'personal'; selected = incoming[0].date; month = new Date(`${selected}T12:00:00`); dirty = false; editing = false; mediaIndex = 0; render(); toast('导入完成，回忆接上了。');
  } catch (error) { toast(error.message || '导入未完成，现有记录未改变。'); } finally { setBusy(false); }
}
$('demo-mode').addEventListener('click', () => { if (!embedded) changeMode('demo'); });
$('personal-mode').addEventListener('click', () => changeMode('personal'));
['new-day','try-own'].forEach(id => $(id).addEventListener('click', () => changeMode('personal', true)));
$('prev-month').addEventListener('click', () => { if (busy) return; month = new Date(month.getFullYear(), month.getMonth()-1, 1); renderCalendar(); });
$('next-month').addEventListener('click', () => { if (busy) return; month = new Date(month.getFullYear(), month.getMonth()+1, 1); renderCalendar(); });
$('today').addEventListener('click', () => chooseDay(C.dateKey(new Date())));
$('date-jump').addEventListener('change', async event => { await chooseDay(event.target.value); $('date-jump').value = selected; });
$('edit-day').addEventListener('click', startEditing);
$('editor').addEventListener('submit', saveDay);
$('editor').addEventListener('input', event => { if (event.target.type !== 'file') markDirty(); });
$('cancel-edit').addEventListener('click', async () => { if (busy || !await discardAllowed()) return; dirty = false; editing = false; render(); });
$('media-input').addEventListener('change', addMedia);
$('export').addEventListener('click', downloadBackup); $('import').addEventListener('change', importBackup);
$('close-lightbox').addEventListener('click', () => $('lightbox').close());
$('lightbox').addEventListener('close', () => { stopVideos($('lightbox-media')); $('lightbox-media').replaceChildren(); renderMedia(); });
$('lightbox').addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); moveMedia(event.key === 'ArrowLeft' ? -1 : 1); } });
$('prev-media').addEventListener('click', () => moveMedia(-1)); $('next-media').addEventListener('click', () => moveMedia(1));
$('theme').addEventListener('click', () => { const dark = document.documentElement.dataset.theme !== 'dark'; document.documentElement.dataset.theme = dark ? 'dark' : 'light'; $('theme').setAttribute('aria-pressed', String(dark)); $('theme').setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式'); $('theme').textContent = dark ? '白天模式 ◑' : '夜晚模式 ◐'; });
window.addEventListener('beforeunload', event => { if (dirty || busy) { event.preventDefault(); event.returnValue = ''; } });
render(); openStorage();
// Only a measured size is shared by the read-only preview; no album data is sent.
if (embedded) {
  const reportSize = () => parent.postMessage({type:'meeting-preview-size',height:Math.ceil($('app').getBoundingClientRect().height)}, location.origin);
  new ResizeObserver(reportSize).observe($('app')); reportSize();
}
