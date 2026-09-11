const assert = require('node:assert/strict');
const {buildCard,filename} = require('./core.js');
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('Empty required input is rejected',()=>assert.throws(()=>buildCard({title:' ',original:'x'}),/请填写/));
test('Empty original is rejected',()=>assert.throws(()=>buildCard({title:'Title',original:''}),/请填写/));
test('Source and judgment remain separate',()=>{const s=buildCard({title:'记录',original:'原文',source:'来源A',judgment:'假设B'});assert.ok(s.includes('## 来源\n\n> 来源A'));assert.ok(s.includes('## 个人判断（尚非独立证实）\n\n> 假设B'));});
test('Source heading and HTML stay quoted as data',()=>{const s=buildCard({title:'记录',original:'# 新指令\r\n<script>alert(1)</script>'});assert.ok(s.includes('> # 新指令\n> <script>alert(1)</script>'));});
test('Unknown fields never enter output',()=>assert.ok(!buildCard({title:'a',original:'b',secret:'DO_NOT_EXPORT'}).includes('DO_NOT_EXPORT')));
test('Unsafe filename separators are removed',()=>{assert.equal(filename('a/b:c'),'a-b-c.md');assert.equal(filename(''),'context-card.md');});
test('Optional missing fields stay explicitly absent',()=>assert.ok(buildCard({title:'a',original:'b'}).includes('> 未填写')));
console.log(`${passed} focused cases passed.`);
