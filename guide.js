(()=>{
const root=document.querySelector('[data-start-guide]');if(!root)return;
const scenes=[...root.querySelectorAll('[data-guide-scene]')],dots=[...root.querySelectorAll('[data-guide-dot]')],next=root.querySelector('[data-guide-next]'),enter=root.querySelector('[data-guide-enter]');
let idx=0;
const render=()=>{scenes.forEach((s,i)=>s.classList.toggle('is-active',i===idx));dots.forEach((d,i)=>d.classList.toggle('active',i===idx));if(next)next.textContent=idx===scenes.length-1?'Done':'Next';};
next?.addEventListener('click',()=>{ window.__akkuMusic?.play().catch(()=>{}); if(idx<scenes.length-1){idx++;render()}else{root.classList.add('hidden');setTimeout(()=>root.remove(),380)}});
dots.forEach((d,i)=>d.addEventListener('click',()=>{idx=i;render()}));
enter?.addEventListener('click',()=>{ window.__akkuMusic?.play().catch(()=>{}); root.classList.add('hidden');setTimeout(()=>root.remove(),380)});
root.addEventListener('keydown',e=>{if(e.key==='Escape'){root.classList.add('hidden');setTimeout(()=>root.remove(),380)}},{passive:true});
render();
})();
