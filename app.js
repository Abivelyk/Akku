(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch=matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;

/* ===== basic reveal ===== */
const reveals=$$('.reveal,.reveal-scale');
if(reduce || !('IntersectionObserver' in window)) reveals.forEach(e=>e.classList.add('in'));
else { const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08}); reveals.forEach(e=>io.observe(e)); }

/* ===== scroll progress ===== */
const progress=$('[data-progress]');
const progressTick=()=>{ if(!progress)return; const max=document.documentElement.scrollHeight-innerHeight; progress.style.width=(max>1?Math.min(100,Math.max(0,scrollY/max*100)):100)+'%'; };
addEventListener('scroll',progressTick,{passive:true}); addEventListener('resize',progressTick,{passive:true}); progressTick();

/* ===== toast ===== */
let toastTimer=0;
function toast(msg){const el=$('[data-toast]'); if(!el)return; el.textContent=msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2200);}

/* ===== touch/click sparkle ===== */
const colors=['#ff77ae','#a98cff','#89e9ff','#ffd7a4','#fff'];
function burst(x,y){
  if(reduce || touch)return;
  const ring=document.createElement('i'); ring.className='touch-wave'; ring.style.left=x+'px'; ring.style.top=y+'px'; document.body.appendChild(ring); ring.addEventListener('animationend',()=>ring.remove(),{once:true});
  const n=touch?4:7;
  for(let i=0;i<n;i++){
    const s=document.createElement('i'); s.className='touch-spark'; s.textContent=i%2?'✦':'•'; s.style.left=x+'px'; s.style.top=y+'px'; s.style.color=colors[i%colors.length];
    const a=Math.PI*2*i/n, r=18+Math.random()*28; s.style.setProperty('--sx',Math.cos(a)*r+'px'); s.style.setProperty('--sy',Math.sin(a)*r+'px'); document.body.appendChild(s); s.addEventListener('animationend',()=>s.remove(),{once:true});
  }
  if(Math.random()<.7){ const h=document.createElement('i'); h.className='touch-heart'; h.textContent=Math.random()<.7?'♡':'✧'; h.style.left=x+'px'; h.style.top=y+'px'; h.style.color=colors[(Math.random()*colors.length)|0]; h.style.setProperty('--hx',(Math.random()*40-20)+'px'); h.style.setProperty('--hy',(-30-Math.random()*25)+'px'); document.body.appendChild(h); h.addEventListener('animationend',()=>h.remove(),{once:true}); }
}
document.addEventListener('pointerdown',e=>burst(e.clientX,e.clientY),{passive:true});

/* ===== ambient stars ===== */
if(!reduce && !touch){
  const c=document.createElement('canvas'); c.className='ambient-canvas'; document.body.appendChild(c); const ctx=c.getContext('2d');
  let W=0,H=0,dpr=1; const count=touch?34:80; const pts=Array.from({length:count},()=>({x:Math.random(),y:Math.random(),r:.3+Math.random()*1.2,p:Math.random()*6.28,a:.1+Math.random()*.45}));
  function resize(){dpr=Math.min(devicePixelRatio||1,touch?1.2:1.5);W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);}
  function draw(t){ctx.clearRect(0,0,W,H);for(const p of pts){const x=p.x*W+Math.sin(t*.00015+p.p)*16,y=p.y*H+Math.cos(t*.00011+p.p)*11;ctx.fillStyle=`rgba(255,240,250,${p.a})`;ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();}requestAnimationFrame(draw)}
  addEventListener('resize',resize,{passive:true});resize();requestAnimationFrame(draw);
}

/* ===== desktop cursor ===== */
if(!touch&&!reduce){const c=$('.cursor'),l=$('.lumen'); if(c){addEventListener('pointermove',e=>{c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';if(l){l.style.left=e.clientX+'px';l.style.top=e.clientY+'px';}},{passive:true});}}

/* ===== mobile menu ===== */
const menuButton=$('[data-menu]'), menuPanel=$('[data-menu-panel]');
if(menuButton&&menuPanel){
  const close=()=>{menuPanel.classList.remove('open');document.body.classList.remove('menu-open');};
  menuButton.addEventListener('click',e=>{e.preventDefault();menuPanel.classList.toggle('open');document.body.classList.toggle('menu-open');burst(e.clientX||innerWidth-30,e.clientY||30);});
  $$('.mobile-menu-inner a',menuPanel).forEach(a=>a.addEventListener('click',close));
  menuPanel.addEventListener('click',e=>{if(e.target===menuPanel)close();});
}

/* ===== entry scene ===== */
const entry=$('[data-entry]');
if(entry){
  const canvas=$('[data-entry-canvas]',entry), ctx=canvas?.getContext('2d');
  if(canvas&&ctx&&!reduce&&!touch){let W=0,H=0;const bs=Array.from({length:touch?12:22},()=>({a:Math.random()*6.28,t:Math.random()*6.28}));const rs=()=>{W=canvas.width=innerWidth;H=canvas.height=innerHeight;canvas.style.width=W+'px';canvas.style.height=H+'px'};const draw=t=>{ctx.clearRect(0,0,W,H);for(const b of bs){b.a+=.01;b.t+=.03;const x=W/2+Math.cos(b.a)*Math.min(W,H)*(.22+.03*Math.sin(b.t));const y=H*.56-Math.abs(Math.sin(b.t))*H*.25;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(b.t)*.5);ctx.globalAlpha=.22+.18*Math.sin(b.t);ctx.fillStyle='#ffb6da';ctx.beginPath();ctx.ellipse(-5,0,7,3,Math.sin(b.t),0,6.28);ctx.ellipse(5,0,7,3,-Math.sin(b.t),0,6.28);ctx.fill();ctx.restore();}requestAnimationFrame(draw)};addEventListener('resize',rs,{passive:true});rs();requestAnimationFrame(draw)}
  const open=()=>{entry.classList.add('hidden');document.body.classList.remove('entry-lock');for(let i=0;i<(touch?14:26);i++)setTimeout(()=>burst(innerWidth/2+(Math.random()*180-90),innerHeight*.55+(Math.random()*160-80)),i*25);};
  $('[data-enter]',entry)?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open();});
  entry.addEventListener('click',e=>{if(e.target===entry||e.target===canvas)open();});
}

/* ===== tilt cards ===== */
if(!touch&&!reduce){$$('.tilt,.room-card,.museum-card').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.5).toFixed(2)}deg) translateY(-2px)`},{passive:true});el.addEventListener('pointerleave',()=>el.style.removeProperty('transform'),{passive:true})});}

/* ===== home hero canvas ===== */
const heroCanvas=$('[data-space]');
if(heroCanvas&&!reduce&&!touch){const ctx=heroCanvas.getContext('2d');let W=0,H=0;const stars=Array.from({length:touch?24:55},()=>({x:Math.random(),y:Math.random(),r:.5+Math.random()*1.3,p:Math.random()*6.28}));const rs=()=>{W=heroCanvas.width=innerWidth;H=heroCanvas.height=innerHeight;heroCanvas.style.width=W+'px';heroCanvas.style.height=H+'px'};const draw=t=>{ctx.clearRect(0,0,W,H);for(const s of stars){const x=s.x*W+Math.sin(t*.00018+s.p)*10,y=s.y*H+Math.cos(t*.00014+s.p)*8;ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.arc(x,y,s.r,0,6.28);ctx.fill()}requestAnimationFrame(draw)};addEventListener('resize',rs,{passive:true});rs();requestAnimationFrame(draw)}

/* ===== memories carousel ===== */
const film=$('[data-film]');
if(film){const slides=$$('.film-slide',film),dots=$$('.film-dot',film),prev=$('[data-film-prev]',film),next=$('[data-film-next]',film);let idx=Math.max(0,slides.findIndex(s=>s.classList.contains('active')));const go=dir=>{idx=(idx+dir+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===idx));dots.forEach((d,i)=>d.classList.toggle('active',i===idx));};prev?.addEventListener('click',()=>go(-1));next?.addEventListener('click',()=>go(1));dots.forEach((d,i)=>d.addEventListener('click',()=>go(i-idx)));let sx=0;film.addEventListener('touchstart',e=>sx=e.changedTouches[0].clientX,{passive:true});film.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)go(dx<0?1:-1)},{passive:true});}

/* ===== photo modal + museum filter ===== */
const modal=$('[data-photo-modal]'),modalImg=$('[data-modal-img]'),modalCap=$('[data-modal-caption]');
function openModal(file,cap){if(!modal||!modalImg)return;const hi='assets/ultra/'+file.replace('.webp','_x2.jpg');const fallback='assets/'+file;modalImg.onerror=()=>{modalImg.onerror=null;modalImg.src=fallback;};modalImg.src=hi;modalImg.alt=cap||'Memory';if(modalCap)modalCap.textContent=cap||'';modal.classList.add('open');document.body.classList.add('modal-open');}
function closeModal(){modal?.classList.remove('open');document.body.classList.remove('modal-open');}
$$('.open-photo,.museum-card').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.photo||'',b.dataset.caption||('memory '+(b.dataset.photo||'').replace('p','').replace('.webp','')))));
$('[data-modal-close]')?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});
const museum=$('[data-museum]'); if(museum){$$('[data-filter]',museum).forEach(f=>f.addEventListener('click',()=>{const v=f.dataset.filter;$$('[data-filter]',museum).forEach(x=>x.classList.toggle('active',x===f));$$('.museum-card',museum).forEach(card=>{card.hidden=!(v==='all'||card.dataset.mood===v);});}));}

/* ===== cinema ===== */
const video=$('[data-main-video]');
if(video){
  video.addEventListener('play',()=>window.__akkuPauseForVideo?.(),{passive:true});
  video.addEventListener('pause',()=>window.__akkuResumeAfterVideo?.(),{passive:true});
  video.addEventListener('ended',()=>window.__akkuResumeAfterVideo?.(),{passive:true});
  const sources=['v01.mp4','v02.mp4','v03.mp4','v04.mp4','v05.mp4'];
  const titles=['motion / 01','motion / 02','motion / 03','motion / 04','motion / 05'];
  const thumbs=$$('[data-video-index]');
  const play=$('[data-v-play]'),mute=$('[data-v-mute]'),vol=$('[data-v-volume]'),seek=$('[data-v-seek]'),time=$('[data-v-time]'),title=$('[data-v-title]');
  let idx=0;
  const fmt=s=>Number.isFinite(s)?`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`:'0:00';
  const syncUI=()=>{
    if(play)play.textContent=video.paused?'Play':'Pause';
    if(mute)mute.textContent=video.muted?'Sound on':'Mute';
    if(vol)vol.value=String(video.volume||.86);
    if(seek)seek.value=video.duration?String(video.currentTime/video.duration*100):'0';
    if(time)time.textContent=`${fmt(video.currentTime)} / ${fmt(video.duration)}`;
  };
  const load=i=>{
    idx=((i%sources.length)+sources.length)%sources.length;
    video.pause();
    video.src='assets/'+sources[idx];
    video.poster='assets/'+sources[idx].replace('.mp4','.webp');
    video.preload='metadata';
    video.muted=false;
    video.volume=Number(vol?.value||.86);
    video.load();
    if(title)title.textContent=titles[idx];
    thumbs.forEach((t,n)=>t.classList.toggle('active',n===idx));
    if(play)play.textContent='Play';
    if(mute)mute.textContent='Mute';
    if(seek)seek.value='0';
    if(time)time.textContent='0:00 / 0:00';
  };
  load(0);
  thumbs.forEach(t=>t.addEventListener('click',()=>load(Number(t.dataset.videoIndex))));
  play?.addEventListener('click',async()=>{
    try{
      if(video.paused){video.muted=false;await video.play();}
      else video.pause();
      syncUI();
    }catch{toast('The browser blocked playback. Tap Play once more.');}
  });
  mute?.addEventListener('click',()=>{
    video.muted=!video.muted;
    syncUI();
    if(!video.paused)video.play().catch(()=>{});
  });
  vol?.addEventListener('input',()=>{
    video.volume=Number(vol.value);
    if(video.volume>0)video.muted=false;
    syncUI();
  });
  seek?.addEventListener('input',()=>{if(video.duration)video.currentTime=Number(seek.value)/100*video.duration;syncUI();});
  video.addEventListener('loadedmetadata',syncUI);
  video.addEventListener('timeupdate',syncUI);
  video.addEventListener('play',syncUI);
  video.addEventListener('pause',syncUI);
  video.addEventListener('error',()=>toast('This video could not be loaded.'));
  $('[data-video-fullscreen]')?.addEventListener('click',()=>{const fn=video.requestFullscreen||video.webkitRequestFullscreen;if(fn)fn.call(video);});
}

/* ===== animated letter */
const letter=$('[data-letter]'),orb=$('[data-letter-orb]');
if(letter&&orb){orb.addEventListener('click',()=>{const first=!letter.classList.contains('opened');letter.classList.add('opened');if(first){$$('.letter-line').forEach((l,i)=>l.style.transitionDelay=(.2+i*.12)+'s');for(let i=0;i<(touch?15:26);i++)setTimeout(()=>burst(innerWidth/2+(Math.random()*180-90),innerHeight*.48+(Math.random()*180-90)),i*35);}});}

/* ===== forever image drift ===== */
if(!reduce&&!touch){$$('.forever-panel').forEach(panel=>{const img=$('img',panel);if(!img)return;const tick=()=>{const r=panel.getBoundingClientRect();const d=(r.top+r.height/2-innerHeight/2)/(innerHeight/2);img.style.transform=`translate3d(0,${Math.max(-14,Math.min(14,-d*8))}px,0) scale(${1.02+Math.max(0,1-Math.abs(d))*.02})`;};addEventListener('scroll',tick,{passive:true});tick();});}

/* ===== home sound panel ===== */
$('[data-sound-open]')?.addEventListener('click',()=>{$('[data-sound-panel]')?.classList.add('open')});$('[data-sound-close]')?.addEventListener('click',()=>{$('[data-sound-panel]')?.classList.remove('open')});

/* ===== Escape closes overlays ===== */
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();menuPanel?.classList.remove('open');document.body.classList.remove('menu-open');}});
})();

/* ===== POLISH PASS INTERACTIONS ===== */
(function polishPass(){
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch='ontouchstart' in window || navigator.maxTouchPoints>0;
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const miniBurst=(x,y)=>{if(reduced || touch)return;for(let i=0;i<(touch?4:8);i++){const s=document.createElement('span');s.textContent=i%3===0?'♡':'✦';s.style.position='fixed';s.style.left=x+'px';s.style.top=y+'px';s.style.zIndex=14001;s.style.pointerEvents='none';s.style.color=['#ff9fc2','#a98cff','#9bdfff','#ffd7a4'][i%4];s.style.fontSize=(8+Math.random()*8)+'px';s.style.setProperty('--hx',(Math.random()*56-28)+'px');s.style.setProperty('--hy',(-20-Math.random()*36)+'px');s.style.animation='touchHeart .72s ease-out forwards';document.body.appendChild(s);setTimeout(()=>s.remove(),760)}};
  document.addEventListener('pointerdown',e=>{const t=e.target;if(t.closest('button,a,input'))miniBurst(e.clientX,e.clientY)},{passive:true});

  // Memory constellation
  const mu=q('[data-memory-universe]');
  if(mu){
    const nodes=qa('[data-memory-node]',mu), read=q('[data-memory-readout]',mu), orbit=q('[data-memory-orbit]',mu), random=q('[data-memory-random]',mu);
    let selected=-1,drag=false,startX=0,rot=0;
    const renderRead=(i)=>{const b=nodes[i]; if(!b||!read)return; nodes.forEach(n=>n.classList.remove('selected'));b.classList.add('selected');selected=i; const title=b.dataset.caption||'memory'; read.innerHTML=`<span>MEMORY ${String(i+1).padStart(2,'0')}</span><b>${title}</b><small>Tap again to open the full frame.</small>`;};
    nodes.forEach((b,i)=>b.addEventListener('click',()=>{renderRead(i); setTimeout(()=>{const m=document.querySelector('[data-photo-modal]');const img=document.querySelector('[data-modal-img]');const cap=document.querySelector('[data-modal-caption]');if(m&&img){img.src='assets/ultra/'+b.dataset.photo.replace('.webp','_x2.jpg');if(cap)cap.textContent=b.dataset.caption||'';m.classList.add('open');document.body.classList.add('modal-open');}},160)}));
    random?.addEventListener('click',()=>{let i=Math.floor(Math.random()*nodes.length);renderRead(i);miniBurst(innerWidth/2,innerHeight*.58)});
    if(orbit){
      const down=e=>{drag=true;startX=e.clientX||e.touches?.[0]?.clientX||0;orbit.classList.add('dragging')};
      const move=e=>{if(!drag)return;const x=e.clientX||e.touches?.[0]?.clientX||startX;rot+=(x-startX)*.18;startX=x;nodes.forEach((n,i)=>n.style.setProperty('--manual-rot',rot+'deg'));orbit.style.transform=`rotate(${rot}deg)`};
      const up=()=>{drag=false;orbit.classList.remove('dragging')};
      orbit.addEventListener('pointerdown',down);window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerup',up,{passive:true});
    }
  }

  // Soundtrack enhancements
  const st=q('.soundtrack');
  if(st){
    const audio=q('[data-audio]',st), bars=qa('[data-sound-visualizer] i',st), percent=q('[data-sound-percent]',st), status=q('[data-sound-status]',st);
    qa('[data-scene-tag]',st).forEach(tag=>tag.addEventListener('click',()=>{qa('[data-scene-tag]',st).forEach(x=>x.classList.remove('active'));tag.classList.add('active');status&&(status.textContent=tag.dataset.tag==='soft'?'soft light mode':tag.dataset.tag==='late'?'late-night mode':'memory mode');}));
    if(audio){audio.addEventListener('play',()=>st.classList.add('playing'));audio.addEventListener('pause',()=>st.classList.remove('playing'));audio.addEventListener('timeupdate',()=>{if(percent&&audio.duration)percent.textContent=Math.round(audio.currentTime/audio.duration*100)+'%';});}
  }
})();

/* ===== 11/10 INTERACTION ENGINE ===== */
(()=>{
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer:fine)").matches;
  function spawn(x,y){
    if(reduced || !fine) return;
    const r=document.createElement("span");
    r.className="touch-ripple"; r.style.left=x+"px"; r.style.top=y+"px";
    document.body.appendChild(r); setTimeout(()=>r.remove(),620);
    for(let i=0;i<6;i++){
      const s=document.createElement("span"); s.className="touch-spark";
      const a=(Math.PI*2*i/6)+(Math.random()-.5)*.3, d=18+Math.random()*28;
      s.style.left=x+"px";s.style.top=y+"px";s.style.setProperty("--dx",`${Math.cos(a)*d}px`);
      s.style.setProperty("--dy",`${Math.sin(a)*d}px`);s.style.setProperty("--c",["#ff8fc7","#8fe9ff","#c7a5ff","#ffe6a0"][i%4]);
      document.body.appendChild(s); setTimeout(()=>s.remove(),650);
    }
    if(Math.random()<.7){
      const h=document.createElement("span");h.className="mini-heart";
      h.textContent=["♡","✦","♥","⋆"][Math.random()*4|0];
      h.style.left=x+"px";h.style.top=y+"px";h.style.color="#ff9fce";
      h.style.setProperty("--dx",`${Math.random()*44-22}px`);
      h.style.setProperty("--dy",`${-25-Math.random()*28}px`);
      document.body.appendChild(h);setTimeout(()=>h.remove(),820);
    }
  }
  addEventListener("pointerdown",e=>{
    if(e.pointerType==="mouse" && !fine) return;
    if(e.button!==undefined && e.button!==0) return;
    spawn(e.clientX,e.clientY);
    const el=e.target.closest("button,a,.memory-card,.film-card,.track,.filter");
    if(el){
      el.animate(
        [{transform:"scale(.97)"},{transform:"scale(1)"}],
        {duration:180,easing:"cubic-bezier(.2,.8,.2,1)"}
      );
    }
  },{passive:true});
  // magnetic hover on desktop
  if(fine && !reduced){
    document.querySelectorAll("[data-magnetic]").forEach(el=>{
      el.addEventListener("pointermove",e=>{
        const r=el.getBoundingClientRect(), dx=(e.clientX-(r.left+r.width/2))/r.width, dy=(e.clientY-(r.top+r.height/2))/r.height;
        el.style.transform=`translate(${dx*7}px,${dy*7}px)`;
      });
      el.addEventListener("pointerleave",()=>el.style.transform="");
    });
  }
  // transition curtain
  if(!document.querySelector(".page-transition")){
    const t=document.createElement("div");t.className="page-transition";document.body.appendChild(t);
    document.querySelectorAll("a[href$='.html']").forEach(a=>{
      a.addEventListener("click",e=>{
        if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
        const href=a.getAttribute("href"); if(!href || href.startsWith("#")) return;
        e.preventDefault();t.classList.add("show");setTimeout(()=>location.href=href,220);
      });
    });
  }
})();

/* ===== FINAL-RUNTIME-SAFETY ===== */
(()=>{
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Always keep reveal sections discoverable, even when IO is unavailable or a room is entered via cache.
  const reveal = ()=>document.querySelectorAll('.reveal,.reveal-scale,.ultra-reveal').forEach(el=>{
    const r=el.getBoundingClientRect();
    if(reduce || r.top < innerHeight*1.08) el.classList.add('in','show');
  });
  addEventListener('scroll', reveal, {passive:true});
  addEventListener('resize', reveal, {passive:true});
  setTimeout(reveal,80);
  // Ensure any page-wipe overlay can never trap input.
  const wipe=document.querySelector('[data-page-wipe]');
  if(wipe){
    wipe.style.pointerEvents='none';
    setTimeout(()=>wipe.classList.remove('show'),700);
  }
  // Friendly focus/press feedback for keyboard and touch alike.
  document.addEventListener('pointerdown', e=>{
    const el=e.target.closest('button,a,.room-card,.museum-card,.film-slide,.track,.filter');
    if(!el) return;
    el.classList.add('is-pressed');
    setTimeout(()=>el.classList.remove('is-pressed'),140);
  }, {passive:true});
})();


/* ===== AKKU SINGLE-SONG MUSIC: persistent Jaavedaan Hai ===== */
(()=>{
  const KEY='akku.music.state.v5';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
  const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}};
  const init=()=>{
    if(document.querySelector('[data-akku-music]'))return;
    const prev=read();
    const audio=document.createElement('audio');
    audio.dataset.akkuMusic='1';
    audio.src='assets/audio_3.mp3';
    audio.preload='auto';
    audio.autoplay=true;
    audio.loop=true;
    audio.volume=.72;
    audio.setAttribute('playsinline','');
    audio.setAttribute('aria-label','Jaavedaan Hai');
    audio.style.cssText='position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1';
    document.body.appendChild(audio);
    let wasPlaying=!!prev?.playing;
    const save=()=>write({time:Number.isFinite(audio.currentTime)?audio.currentTime:0,playing:!audio.paused&&!audio.ended});
    const restore=()=>{
      if(prev&&Number.isFinite(prev.time)){
        try{audio.currentTime=Math.max(0,prev.time)}catch{}
      }
      if(wasPlaying)audio.play().catch(()=>{});
    };
    const tryResume=()=>{if(wasPlaying)audio.play().catch(()=>{});save();};
    audio.addEventListener('loadedmetadata',restore,{once:true});
    audio.addEventListener('timeupdate',save,{passive:true});
    audio.addEventListener('play',save,{passive:true});
    audio.addEventListener('pause',save,{passive:true});
    audio.addEventListener('ended',()=>{audio.currentTime=0;tryResume()},{passive:true});
    addEventListener('pagehide',save,{passive:true});
    addEventListener('beforeunload',save,{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save()},{passive:true});
    document.addEventListener('pointerdown',tryResume,{once:true,passive:true});
    document.addEventListener('touchstart',tryResume,{once:true,passive:true});
    document.addEventListener('keydown',tryResume,{once:true,passive:true});
    window.__akkuMusic=audio;
    window.__akkuPauseForVideo=()=>{const resume=!audio.paused;wasPlaying=resume;save();audio.pause();return resume};
    window.__akkuResumeAfterVideo=()=>{if(wasPlaying)audio.play().catch(()=>{})};
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
