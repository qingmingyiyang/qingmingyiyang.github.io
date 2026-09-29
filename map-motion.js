/* Small, bounded motion; native anchors retain all navigation behavior. */
(() => {
  const canvas = document.querySelector('.map-canvas');
  if (!canvas) return;
  const branches = [...canvas.querySelectorAll('.map-branch')];
  const center = canvas.querySelector('.map-center');
  const svg = canvas.querySelector('.map-lines');
  const control = document.querySelector('.map-motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 851px) and (hover: hover) and (pointer: fine)');
  const paths = branches.map(() => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    return path;
  });
  svg.replaceChildren(...paths);
  let visible = false, entered = false, paused = false, hover = -1, focused = -1;
  let frame = 0, lastTime = 0, elapsed = 0, mouseX = 0, mouseY = 0;
  const positions = branches.map(() => ({x:0,y:0}));
  let entrance = [];
  function edge(rect, other, origin, gap) {
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const dx = other.left + other.width / 2 - cx, dy = other.top + other.height / 2 - cy;
    const ratio = Math.min(rect.width / 2 / Math.max(Math.abs(dx), .01), rect.height / 2 / Math.max(Math.abs(dy), .01));
    const distance = Math.max(Math.hypot(dx, dy), 1);
    return [cx + dx * ratio + dx / distance * gap - origin.left, cy + dy * ratio + dy / distance * gap - origin.top];
  }
  function draw() {
    const origin = canvas.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${origin.width} ${origin.height}`);
    const root = center.getBoundingClientRect();
    branches.forEach((branch, i) => {
      const title = branch.querySelector('h3 a').getBoundingClientRect();
      // Leave breathing room at both ends; approach from the open side, clear of the link list.
      const start = edge(root, title, origin, 22);
      const inwardX = root.left + root.width / 2 > title.left + title.width / 2 ? title.right + 26 : title.left - 26;
      const end = [inwardX - origin.left, title.top + title.height / 2 - origin.top];
      paths[i].setAttribute('d', `M${start.join(' ')} L${end.join(' ')}`);
    });
  }
  function activeBranch() {
    const active = focused >= 0 ? focused : hover;
    branches.forEach((b,i) => b.classList.toggle('map-active', i === active));
    paths.forEach((p,i) => p.classList.toggle('map-active', i === active));
    schedule();
  }
  function canMove() { return visible && !document.hidden && desktop.matches && !reduced.matches && !paused && hover < 0 && focused < 0; }
  function tick(now) {
    frame = 0;
    if (!canMove()) { lastTime = 0; return; }
    const dt = lastTime ? Math.min(now-lastTime, 40) : 16;
    lastTime = now; elapsed += dt;
    branches.forEach((branch,i) => {
      const phase = elapsed / 2300 + i * 1.8;
      const targetX = Math.sin(phase) * 3.5 + mouseX * (i % 2 ? 6 : 4);
      const targetY = Math.cos(phase * .83) * 3 + mouseY * 4;
      const alpha = 1 - Math.exp(-dt/180);
      positions[i].x += (targetX-positions[i].x)*alpha;
      positions[i].y += (targetY-positions[i].y)*alpha;
      branch.style.transform = `translate(${positions[i].x.toFixed(2)}px,${positions[i].y.toFixed(2)}px)`;
    });
    draw(); frame = requestAnimationFrame(tick);
  }
  function schedule() {
    if (!canMove()) { cancelAnimationFrame(frame); frame=0; lastTime=0; }
    else if (!frame) frame=requestAnimationFrame(tick);
  }
  function preferences() {
    entrance.forEach(a=>a.cancel()); entrance=[];
    if (!desktop.matches || reduced.matches) {
      branches.forEach((b,i)=>{b.style.removeProperty('transform');positions[i]={x:0,y:0};});
    }
    control.hidden = !desktop.matches || reduced.matches;
    draw(); schedule();
  }
  branches.forEach((branch,i)=>{
    branch.addEventListener('pointerenter',()=>{hover=i;activeBranch();});
    branch.addEventListener('pointerleave',()=>{hover=-1;activeBranch();});
    branch.addEventListener('focusin',()=>{focused=i;activeBranch();});
    branch.addEventListener('focusout',()=>{queueMicrotask(()=>{focused=branches.findIndex(b=>b.contains(document.activeElement));activeBranch();});});
  });
  canvas.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||!desktop.matches||reduced.matches)return;
    const box=canvas.getBoundingClientRect();
    mouseX=Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1));
    mouseY=Math.max(-1,Math.min(1,(event.clientY-box.top)/box.height*2-1));
  },{passive:true});
  canvas.addEventListener('pointerleave',()=>{mouseX=mouseY=0;});
  control.addEventListener('click',()=>{
    paused=!paused;control.setAttribute('aria-pressed',String(paused));
    control.textContent=paused?'播放动态':'暂停动态';schedule();
  });
  new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible && !entered){
      entered=true;draw();
      if(!reduced.matches){
        entrance=branches.map((b,i)=>b.animate([{opacity:.3},{opacity:1}],{duration:650,delay:i*90,easing:'ease-out'}));
        if(desktop.matches)paths.forEach((p,i)=>{const length=p.getTotalLength();entrance.push(p.animate([{strokeDasharray:`${length}`,strokeDashoffset:length},{strokeDasharray:`${length}`,strokeDashoffset:0}],{duration:800,delay:i*90,easing:'ease-out'}));});
      }
    }
    schedule();
  },{threshold:.12}).observe(canvas);
  new ResizeObserver(preferences).observe(canvas);
  reduced.addEventListener('change',preferences);desktop.addEventListener('change',preferences);
  document.addEventListener('visibilitychange',schedule);
  document.fonts.ready.then(draw);
  preferences();
})();
