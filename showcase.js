'use strict';
// Illustrative walkthrough. Actual access control belongs on the server.
const roleContent = {
 student:{label:'明卡 · 已分配题目',title:'设计一个门店知识助手',copy:'门店员工查找制度和操作说明比较费时。请自行选择切入点，提出一个 AI 辅助方案。',rule:'行业限定，解题路径开放。',clueTitle:'追问线索由面试官掌握',clueCopy:'学生先展开自己的方案，考官保留追问空间。',permission:'查看分配题目 · 自主选题'},
 interviewer:{label:'明卡 + 暗卡 · 按需追问',title:'同一题目，多一层观察',copy:'先听学生的方案，再决定是否补充客户条件。你可以追问，也可以结合经验调整交流节奏。',rule:'保留面试官自主判断，追问不强制触发。',clueTitle:'暗卡示例：不同门店的制度并不相同',clueCopy:'可选追问：你如何判断回答适用于哪家门店？学生是否提前考虑了这个条件？',permission:'指定题目 · 生成新题 · 选择追问'},
 team:{label:'项目组 · 全量管理',title:'把一致性落实到规则里',copy:'查看与调整全部题目，管理行业范围和角色权限。检查题目是否仍服务于本轮考察目标。',rule:'先确定考察与权限规则，再组织出题。',clueTitle:'关键边界：信息按角色分配',clueCopy:'学生看到分配的题目，面试官组织考察，项目组统一查看与调整。',permission:'查看全部题目 · 调整规则与内容'}
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
