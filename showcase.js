'use strict';
// Illustrative walkthrough. Actual access control belongs on the server.
const roleContent = {
 student:{label:'明卡 · 已分配题目',title:'设计一个门店知识助手',copy:'门店员工总要花时间翻找制度和操作说明。能不能用 AI 帮上忙？切入点和解法，由你来选。',rule:'给一个行业，把解法留给你。',clueTitle:'还有一层问题，留给面试官',clueCopy:'先把你的想法讲出来，面试官可以顺着方案再问一步。',permission:'查看分配题目 · 自主选题'},
 interviewer:{label:'明卡 + 暗卡 · 按需追问',title:'先听听，再追问一步',copy:'先听学生怎么解题，再决定要不要补充客户条件。顺着他的思路问下去，或结合经验换个角度，都可以。',rule:'暗卡给你线索，问不问、怎么问，由你判断。',clueTitle:'多一个条件：每家门店的制度未必一样',clueCopy:'可以追问：这个回答适用于哪家门店？也可以先观察，学生有没有自己想到这一层。',permission:'指定题目 · 生成新题 · 选择追问'},
 team:{label:'项目组 · 全量管理',title:'题目各有变化，目标要对齐',copy:'这里可以查看和调整全部题目，设置行业范围与权限。题目可以变，想考察的能力要始终想清楚。',rule:'先说清楚考什么、谁能看，再开始出题。',clueTitle:'同一套题，每个人拿到需要的那部分',clueCopy:'学生看自己的题，面试官安排题目与追问，项目组看全局、做调整。',permission:'查看全部题目 · 调整规则与内容'}
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
