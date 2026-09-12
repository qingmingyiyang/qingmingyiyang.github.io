'use strict';
// Illustrative walkthrough. Actual access control belongs on the server.
const roleContent = {
 student:{label:'明卡 · 已分配题目',title:'设计一个门店知识助手',copy:'门店员工经常要翻找制度和操作说明。请选择一个具体问题，设计能帮助他们的 AI 工具。',rule:'题目限定在连锁零售行业，具体选题和做法由学生决定。',clueTitle:'面试官还有一些补充信息',clueCopy:'先说明你的方案，面试官可能会补充客户条件，或进一步追问。',permission:'查看分配题目 · 自主选题'},
 interviewer:{label:'明卡 + 暗卡 · 按需追问',title:'面试官可以补充条件、提出问题',copy:'先听学生介绍方案，再决定是否补充客户的情况。可以针对方案追问，也可以结合自己的经验提出其他问题。',rule:'暗卡中的问题供面试官参考，是否追问由面试官决定。',clueTitle:'多一个条件：每家门店的制度未必一样',clueCopy:'可以追问：这个回答适用于哪家门店？也可以先观察，学生有没有自己想到这一层。',permission:'指定题目 · 生成新题 · 选择追问'},
 team:{label:'项目组 · 全量管理',title:'项目组可以管理全部题目',copy:'查看和调整全部题目，设置行业范围和角色权限，检查新题是否符合考察要求。',rule:'先确定考察要求，以及每个角色可以查看和修改什么。',clueTitle:'按角色分配题目和信息',clueCopy:'学生查看自己的题目，面试官分配题目并决定如何追问，项目组统一管理。',permission:'查看全部题目 · 调整规则与内容'}
};
const tabs=[...document.querySelectorAll('[data-role]')];
function selectRole(role){
 const data=roleContent[role];if(!data)return;
 tabs.forEach(tab=>{const active=tab.dataset.role===role;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
 document.getElementById('role-panel').setAttribute('aria-labelledby','tab-'+role);
 const values={'visible-label':data.label,'role-title':data.title,'role-copy':data.copy,'role-rule':'↳ '+data.rule,'clue-title':data.clueTitle,'clue-copy':data.clueCopy,'permission-text':data.permission};
 for(const [id,text] of Object.entries(values))document.getElementById(id).textContent=text;
 document.getElementById('clue-card').classList.toggle('revealed',role!=='student');
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectRole(tab.dataset.role));tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();selectRole(tabs[next].dataset.role);});});
// Accept sizing only from this page's read-only album iframe, never other windows.
const meetingFrame = document.querySelector('#meeting iframe');
window.addEventListener('message', event => {
 if (!meetingFrame || event.source !== meetingFrame.contentWindow || event.data?.type !== 'meeting-preview-size') return;
 const height = event.data.height;
 if (Number.isFinite(height) && height >= 300 && height <= 1600) meetingFrame.style.height = `${Math.ceil(height)}px`;
});

// Original-image links remain usable when JavaScript or <dialog> is unavailable.
const screenshotDialog = document.getElementById('screenshot-dialog');
if (screenshotDialog && typeof screenshotDialog.showModal === 'function') {
 const image = document.getElementById('screenshot-dialog-image');
 const title = document.getElementById('screenshot-dialog-title');
 const caption = document.getElementById('screenshot-dialog-caption');
 const original = document.getElementById('screenshot-original');
 let opener;
 document.querySelectorAll('[data-screenshot]').forEach(link => {
  link.addEventListener('click', event => {
   if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
   event.preventDefault();
   opener = link;
   image.src = link.href;
   image.alt = link.querySelector('img').alt;
   title.textContent = link.dataset.title;
   caption.textContent = link.dataset.caption;
   original.href = link.href;
   screenshotDialog.showModal();
  });
 });
 screenshotDialog.querySelector('.screenshot-close').addEventListener('click', () => screenshotDialog.close());
 screenshotDialog.addEventListener('click', event => {
  if (event.target !== screenshotDialog) return;
  const box = screenshotDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) screenshotDialog.close();
 });
 screenshotDialog.addEventListener('close', () => { if (opener?.isConnected) opener.focus({preventScroll:true}); });
}
