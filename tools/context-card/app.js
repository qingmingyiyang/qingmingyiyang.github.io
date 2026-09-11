'use strict';
const form = document.getElementById('card-form');
const output = document.getElementById('output');
const status = document.getElementById('status');
let currentCard = '';
const getData = () => Object.fromEntries(ContextCard.fields.map(key => [key, document.getElementById(key).value]));
function generate() {
  if (!form.reportValidity()) return false;
  try { currentCard = ContextCard.buildCard(getData()); output.value = currentCard; status.textContent = '卡片已生成，请核对后复制或下载。'; return true; }
  catch (error) { status.textContent = error.message; return false; }
}
form.addEventListener('submit', event => { event.preventDefault(); generate(); });
form.addEventListener('input', event => { if (event.target !== output) { currentCard = ''; output.value = ''; status.textContent = '资料已修改，请重新生成。'; } });
document.getElementById('example').addEventListener('click', () => {
  if (ContextCard.fields.some(key => document.getElementById(key).value.trim())) { status.textContent = '当前已有内容，示例未覆盖。可在新页面中查看示例。'; return; }
  const example = { title:'演示：资料回找需求',source:'虚构演示材料，仅用于试用',original:'一位受访者表示：上周收藏了一篇文章，但现在记不起它在哪里。',facts:'演示材料描述了找不到已收藏文章的情况。',judgment:'可能需要保存来源和检索线索，尚不能推断所有用户都有同样需求。',questions:'出现频率是多少？现有搜索为什么没有解决？',task:'提出两个可验证的假设，并分别给出一个访谈问题。不要编造调查结果。' };
  for (const key of ContextCard.fields) document.getElementById(key).value = example[key];
  generate();
});
document.getElementById('copy').addEventListener('click', async () => {
  if (!currentCard && !generate()) return;
  try { await navigator.clipboard.writeText(currentCard); status.textContent = '已复制。'; }
  catch { output.focus(); output.select(); status.textContent = '浏览器未允许自动复制，已选中文本，请按 Ctrl+C 或长按复制。'; }
});
document.getElementById('download').addEventListener('click', () => {
  if (!currentCard && !generate()) return;
  const blob = new Blob([currentCard], {type:'text/markdown;charset=utf-8'});
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = ContextCard.filename(document.getElementById('title').value);
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = '已发起下载，请在浏览器下载列表中查看。';
});
