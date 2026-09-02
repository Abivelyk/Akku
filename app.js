(() => {
  'use strict';

  const photos = Array.from({length:26}, (_,i)=>`p${String(i+1).padStart(2,'0')}.webp`);
  const captions = [
    'The first little universe','Quiet light','One of those days','A soft moment','The kind worth keeping','A frame that stayed',
    'A tiny piece of summer','A little chaos','A memory in focus','The face behind the feeling','A day I would replay','Warmth, somehow',
    'Another ordinary miracle','A picture with a heartbeat','The details matter','Nothing loud, just real','The smile that wins','A frame for later',
    'The calm between things','This one feels like home','A little closer','A day worth remembering','The part I kept','The softest proof','Saved for forever','The last photograph'
  ];
  const forever = [
    ['The little things','The jokes that made no sense, the random check-ins, the quiet comfort of knowing someone was there.','p14.webp'],
    ['The photographs','Some pictures feel like proof that a moment happened exactly the way you remember it.','p19.webp'],
    ['The late nights','The conversations that wandered everywhere and nowhere, and somehow made the night smaller.','p22.webp'],
    ['The ordinary magic','No grand explanation. Just two people making ordinary minutes feel worth keeping.','p24.webp'],
    ['The part that stays','Some memories do not ask permission. They simply become part of the map of you.','p26.webp']
  ];
  const rooms = ['home','memories','cinema','letter','museum','forever'];
  const roomLabels = {home:'Home',memories:'Memories',cinema:'Cinema',letter:'Letter',museum:'Museum',forever:'Forever'};

  const app = document.getElementById('app');
  let musicReady = false;
  let activeRoom = 'home';
  let currentPhoto = 0;
  let cinemaIndex = 0;
  let resumeMusicAfterVideo = false;
  let introDismissed = false;

  function esc(s){return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  app.innerHTML = `
    <header class="topbar" id="topbar">
      <button class="brand" data-route="home" aria-label="AKKÚ home"><span class="brand-dot"></span>AKKÚ <span style="opacity:.35">·</span> THE UNIVERSE</button>
      <nav class="nav" id="nav">${rooms.map(r=>`<button data-route="${r}" class="${r==='home'?'active':''}">${roomLabels[r]}</button>`).join('')}</nav>
      <button class="menu-btn" id="menuBtn" aria-label="Open menu">☰</button>
    </header>
    <div class="mobile-nav" id="mobileNav"><div class="mobile-nav-inner">${rooms.map(r=>`<button data-route="${r}">${roomLabels[r]}</button>`).join('')}</div></div>
    <div class="progress" id="progress"></div>
    <div class="room-chip" id="roomChip">HOME</div>
    <div class="swipe-cue" id="swipeCue"><span>SWIPE</span><i></i><b>TO EXPLORE</b></div>
    <div class="archive-hud" aria-hidden="true">
      <div class="archive-hud-top"><span class="hud-live"><i></i>LIVE ARCHIVE</span><span class="hud-id">AKKÚ / 70 PB // VISUAL FICTION</span></div>
      <div class="hud-grid">
        <div><b data-stat-room>HOME</b><small>ACTIVE NODE</small></div>
        <div><b>026</b><small>MEMORY OBJECTS</small></div>
        <div><b>002</b><small>MOTION FILES</small></div>
        <div><b>001</b><small>AUDIO STREAM</small></div>
      </div>
      <div class="hud-scan"></div>
    </div>
    <div class="archive-badge" aria-hidden="true"><span>NODE</span><b data-node-id>01</b><i></i></div>
    <main>
      ${rooms.map(r=>`<section class="room ${r==='home'?'active':''}" data-room="${r}"></section>`).join('')}
      <aside class="archive-drawer" aria-hidden="true">
        <div class="drawer-head"><span>ARCHIVE FABRIC</span><b>01 // 05</b></div>
        <div class="drawer-line"><i></i><span>Memory lattice</span><strong>STABLE</strong></div>
        <div class="drawer-line"><i></i><span>Motion cluster</span><strong>READY</strong></div>
        <div class="drawer-line"><i></i><span>Letter index</span><strong>OPEN</strong></div>
        <div class="drawer-line"><i></i><span>Archive depth</span><strong>70.0 PB*</strong></div>
        <small>*visual storytelling fiction, not storage capacity</small>
      </aside>
    </main>
    <div class="music-dock paused" id="musicDock">
      <button class="music-toggle" id="musicToggle" aria-label="Play music">▶</button>
      <div class="music-copy"><b>Jaavedaan Hai</b><span>AKKÚ · continuous soundtrack</span></div>
      <div class="music-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <audio id="music" preload="metadata" loop playsinline src="assets/audio_3.mp3"></audio>
    </div>
    <div class="overlay" id="guideOverlay">
      <div class="guide">
        <div class="guide-kicker">A note before you enter</div>
        <div class="guide-stage">
          <div class="guide-step active"><div class="guide-icon">🎧</div><h2>Use headphones.</h2><p>There is one song for this little universe. Let it stay in the background while you move through the rooms.</p></div>
          <div class="guide-step"><div class="guide-icon">📖</div><h2>Read everything.</h2><p>Nothing here is filler. The small lines are part of the story, because apparently subtlety was worth the extra engineering.</p></div>
          <div class="guide-step"><div class="guide-icon">🎬</div><h2>Watch carefully.</h2><p>Take your time. Open the photographs. Watch the two clips. Let the pages breathe before moving on.</p></div>
        </div>
        <div class="guide-progress"><i class="active"></i><i></i><i></i></div>
        <div class="guide-actions"><button class="btn" id="guideBack" style="display:none">Back</button><button class="btn primary" id="guideNext">Next</button></div>
      </div>
    </div>
    <div class="lightbox" id="lightbox"><div class="lightbox-inner"><img id="lightboxImg" alt="Memory"><div class="lightbox-tools"><button id="lbPrev">←</button><button id="lbClose">Close</button><button id="lbNext">→</button></div></div></div>
  `;

  function roomFrame(kicker,title,copy,actions=''){
    return `<div class="section-in"><div class="room-head"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1></div><p>${copy}</p></div>${actions}</div>`;
  }

  function homeHTML(){
    return `${roomFrame('The beginning','A small universe,<br><em>made for one person.</em>','Six rooms. Twenty-six photographs. Two little films. One song that stays with you while you move through it. Built to feel rich without making your phone suffer for the privilege.','')}
      <div class="hero-grid">
        <div class="hero-copy">
          <div class="eyebrow">Start slowly</div>
          <h2 style="font-size:clamp(48px,7vw,98px);margin-top:12px">Some things are too important to be <span class="accent">ordinary.</span></h2>
          <p class="lede hero-sub">Enter when you have a minute. Read the little things. Watch the clips. Stay with the pictures. The point isn't to finish it quickly. The point is to feel it.</p>
          <div class="actions"><button class="btn primary" data-route="memories">Begin with the memories →</button><button class="btn" data-route="letter">Read first →</button></div>
          <div class="hero-kpis"><div class="kpi"><b>26</b>photographs</div><div class="kpi"><b>02</b>little films</div><div class="kpi"><b>01</b>soundtrack</div><div class="kpi"><b>∞</b>reasons</div></div>
        </div>
        <div class="hero-visual">
          <div class="hero-orbit" aria-hidden="true"></div>
          <div class="hero-frame"><img src="assets/p10.webp" width="720" height="900" fetchpriority="high" alt="A memory from the universe"><div class="hero-caption">Frame 10 · a face worth remembering</div></div>
        </div>
      </div>
      <div class="room-cards">${[['memories','01','The Memories','photographs'],['cinema','02','Cinema','motion'],['letter','03','The Letter','words'],['museum','04','Museum','frames'],['forever','05','Forever','what stays']].map(([r,n,t,s])=>`<button class="room-card" data-route="${r}"><div class="room-card-art"><img src="assets/p${String((Number(n)*4+6)).padStart(2,'0')}.webp" loading="lazy" alt="${t}"></div><div class="room-card-copy"><strong>${t}</strong><span>${n} · ${s}</span></div></button>`).join('')}</div>`;
  }

  function memoriesHTML(){
    return `${roomFrame('Room 01 · Memories','A wall for the little things.','Twenty-six frames. Some polished, some imperfect, all real. Tap one, let it open, then take your time.','<div class="filter-row"><button class="filter active" data-mem-filter="all">All 26</button><button class="filter" data-mem-filter="first">First half</button><button class="filter" data-mem-filter="last">Second half</button><button class="btn primary" data-route="cinema">Next → Cinema</button></div>')}
      <div class="memory-grid">${photos.map((f,i)=>`<button class="memory-card" data-photo-index="${i}"><img src="assets/${f}" loading="lazy" decoding="async" width="720" height="900" alt="${esc(captions[i])}"><div class="shade"><strong>${esc(captions[i])}</strong><span>Memory ${String(i+1).padStart(2,'0')}</span></div></button>`).join('')}</div>`;
  }

  function cinemaHTML(){
    return `${roomFrame('Room 02 · Cinema','A few seconds that move.','Two clips. No autoplay tricks. Press play when you are ready. Jaavedaan Hai pauses while a clip is playing, then continues when the film is done.','')}
      <div class="cinema-grid"><div><div class="video-wrap"><video id="video" playsinline preload="metadata" poster="assets/v02.webp"></video><div class="video-controls"><button id="vPlay">Play</button><button id="vMute">Sound</button><input id="vSeek" type="range" min="0" max="100" value="0" aria-label="Video progress"><button id="vFull">Fullscreen</button></div></div><div class="cinema-note"><div class="eyebrow">Cinema note</div><h3>Keep the volume up.</h3><p>Some memories sound better in motion. Watch one, smile, replay it, and let the ordinary bits become the ones you remember most.</p><div class="actions"><button class="btn" data-route="letter">Next → Letter</button><button class="btn primary" data-route="museum">Skip to Museum →</button></div></div></div><div class="video-list"><div class="video-thumb"><button data-video-index="0"><img src="assets/v02.webp" loading="lazy" alt="Cinema clip one"><span>Motion / 01</span></button></div><div class="video-thumb"><button data-video-index="1"><img src="assets/v03.webp" loading="lazy" alt="Cinema clip two"><span>Motion / 02</span></button></div></div></div>`;
  }

  function letterHTML(){
    return `${roomFrame('Room 03 · Letter','For the girl who made ordinary days glow.','I could have sent you a paragraph. Instead, I made a room you can enter whenever you need a little reminder that someone cared enough to make this.','<div class="actions"><button class="btn primary" data-route="museum">Open the Museum →</button><button class="btn" data-route="forever">Next chapter →</button></div>')}
      <div class="letter-shell"><div class="letter-photo"><img src="assets/p10.webp" loading="lazy" decoding="async" width="720" height="900" alt="A memory"><div class="stamp">for you · always</div></div><div><div class="letter-quote">“The little minutes became the memories. Somehow, that was the whole point.”</div><p class="lede">You do not have to do anything with these. Just keep them as tiny reminders that there was softness here. The jokes. The silence. The random conversations. The days that looked ordinary until they became impossible to forget.</p><div class="letter-lines"><div class="letter-line">01 · The jokes that made absolutely no sense.<small>And somehow became the funniest things in the world.</small></div><div class="letter-line">02 · The tiny moments that nobody else noticed.<small>The ones that made a normal day feel different.</small></div><div class="letter-line">03 · Listening properly. Being gentle. Showing up.<small>Not dramatically. Just consistently.</small></div><div class="letter-line">04 · Learning the shape of another person's heart.<small>Slowly. Carefully. Imperfectly.</small></div><div class="letter-line">05 · This isn't a performance.<small>It is just a place to breathe, smile, and remember that someone cared enough to build it.</small></div></div></div></div>`;
  }

  function museumHTML(){
    return `${roomFrame('Room 04 · Museum','A wall for her.','Twenty-six frames arranged like a tiny private gallery. Tap any one. It opens larger.','<div class="actions"><button class="btn primary" data-route="forever">There is one last room →</button><button class="btn" data-route="memories">Back to the memories →</button></div>')}
      <div class="museum-grid">${photos.map((f,i)=>`<button class="museum-card" data-photo-index="${i}"><img src="assets/${f}" loading="lazy" decoding="async" width="720" height="900" alt="Museum memory ${i+1}"><span>Frame ${String(i+1).padStart(2,'0')} · ${esc(captions[i])}</span></button>`).join('')}</div>`;
  }

  function foreverHTML(){
    return `${roomFrame('Room 05 · Forever','Some memories do not need permission to stay.','This is not a promise about the future. It is a place to keep what was real: the late-night conversations, the photographs, the laughter, the quiet, and the feeling of being understood.','')}
      <div class="forever-list">${forever.map((x,i)=>`<article class="forever-panel"><div><div class="eyebrow">Memory ${String(i+1).padStart(2,'0')}</div><h2>${esc(x[0])}</h2><p class="lede">${esc(x[1])}</p><div class="memory-list"><div>Keep the ordinary details.</div><div>Remember how it felt, not just how it looked.</div><div>Let the good parts stay good.</div></div></div><img src="assets/${x[2]}" loading="lazy" decoding="async" width="720" height="900" alt="${esc(x[0])}"></article>`).join('')}</div>
      <div class="end"><div class="glow">The last door is another beginning.</div><h2>Thank you for being real with me.</h2><p class="lede" style="margin:18px auto 0">A normal paragraph felt too small. So I built a little universe instead.</p><div class="actions" style="justify-content:center"><button class="btn" data-route="home">Back to the beginning</button><button class="btn primary" data-route="memories">Stay with the photographs</button></div></div>`;
  }

  document.querySelector('[data-room="home"]').innerHTML=homeHTML();
  document.querySelector('[data-room="memories"]').innerHTML=memoriesHTML();
  document.querySelector('[data-room="cinema"]').innerHTML=cinemaHTML();
  document.querySelector('[data-room="letter"]').innerHTML=letterHTML();
  document.querySelector('[data-room="museum"]').innerHTML=museumHTML();
  document.querySelector('[data-room="forever"]').innerHTML=foreverHTML();

  const music = document.getElementById('music');
  const musicDock = document.getElementById('musicDock');
  const musicToggle = document.getElementById('musicToggle');

  let lastMusicSaveBucket=-1;
  function saveMusic(force=false){
    try{
      const time=Number(music.currentTime)||0;
      const bucket=Math.floor(time/4);
      if(!force && bucket===lastMusicSaveBucket) return;
      lastMusicSaveBucket=bucket;
      localStorage.setItem('akku_music_time', String(time));
      localStorage.setItem('akku_music_playing', music.paused?'0':'1');
    }catch{}
  }
  function restoreMusic(){
    try{
      const t=parseFloat(localStorage.getItem('akku_music_time')||'0');
      if(Number.isFinite(t) && t>0 && music.duration) music.currentTime=Math.min(t,Math.max(0,music.duration-.25));
    }catch{}
  }
  function playMusic(){
    musicReady=true;
    music.play().then(()=>{musicDock.classList.remove('paused');musicToggle.textContent='❚❚';saveMusic();}).catch(()=>{});
  }
  function pauseMusic(){music.pause();musicDock.classList.add('paused');musicToggle.textContent='▶';saveMusic();}
  music.addEventListener('loadedmetadata',restoreMusic,{once:true});
  music.addEventListener('play',()=>{musicDock.classList.remove('paused');musicToggle.textContent='❚❚';saveMusic();});
  music.addEventListener('pause',()=>{musicDock.classList.add('paused');musicToggle.textContent='▶';saveMusic();});
  music.addEventListener('timeupdate',()=>saveMusic(false));
  window.addEventListener('pagehide',()=>saveMusic(true));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)saveMusic(true);});
  musicToggle.addEventListener('click',()=>music.paused?playMusic():pauseMusic());

  const roomMeta={home:['01','ORIGIN NODE'],memories:['02','MEMORY VAULT'],cinema:['03','MOTION CLUSTER'],letter:['04','PERSONAL INDEX'],museum:['05','GALLERY ARRAY'],forever:['06','ARCHIVE CORE']};

  function route(room,push=true){
    if(!rooms.includes(room)) room='home';
    const previous=activeRoom;
    activeRoom=room;
    const currentEl=document.querySelector(`.room[data-room="${previous}"]`);
    const nextEl=document.querySelector(`.room[data-room="${room}"]`);
    if(currentEl && nextEl && previous!==room){
      currentEl.classList.add('swipe-exit');
      nextEl.classList.add('active','swipe-enter');
      requestAnimationFrame(()=>nextEl.classList.add('swipe-enter-live'));
      setTimeout(()=>currentEl.classList.remove('active','swipe-exit'),260);
      setTimeout(()=>nextEl.classList.remove('swipe-enter','swipe-enter-live'),520);
    } else {
      document.querySelectorAll('.room').forEach(r=>r.classList.toggle('active',r.dataset.room===room));
    }
    document.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===room));
    document.getElementById('roomChip').textContent=roomLabels[room].toUpperCase();
    document.querySelector('[data-stat-room]').textContent=roomLabels[room].toUpperCase();
    const meta=roomMeta[room]||['01','NODE']; document.querySelector('[data-node-id]').textContent=meta[0]; document.querySelector('.archive-drawer .drawer-head b').textContent=meta[0]+' // 06'; document.querySelector('.archive-hud').dataset.room=room; document.querySelector('.archive-badge').dataset.room=room;
    document.getElementById('mobileNav').classList.remove('open');
    if(push){history.pushState({room},'',`#${room}`);}else if(location.hash.slice(1)!==room){history.replaceState({room},'',`#${room}`)}
    window.scrollTo({top:0,behavior:'auto'});
    if(room==='cinema'){
      if(!video.getAttribute('src')) loadVideo(0,false);
      setTimeout(()=>document.getElementById('video')?.focus({preventScroll:true}),120);
    }
  }

  document.addEventListener('click',e=>{
    const r=e.target.closest('[data-route]');
    if(r){route(r.dataset.route);return;}
    const m=e.target.closest('[data-mem-filter]');
    if(m){
      document.querySelectorAll('[data-mem-filter]').forEach(b=>b.classList.toggle('active',b===m));
      document.querySelectorAll('[data-room="memories"] .memory-card').forEach((card,i)=>{card.hidden=m.dataset.memFilter==='first'?i>=13:m.dataset.memFilter==='last'?i<13:false;});
      return;
    }
    const p=e.target.closest('[data-photo-index]');
    if(p){openLightbox(Number(p.dataset.photoIndex));return;}
    const v=e.target.closest('[data-video-index]');
    if(v){loadVideo(Number(v.dataset.videoIndex),true);route('cinema',true);}
  });
  window.addEventListener('popstate',()=>route(location.hash.slice(1)||'home',false));

  const menuBtn=document.getElementById('menuBtn'); const mobileNav=document.getElementById('mobileNav');
  menuBtn.addEventListener('click',()=>mobileNav.classList.toggle('open'));
  mobileNav.addEventListener('click',e=>{if(e.target===mobileNav)mobileNav.classList.remove('open')});

  // Touch-first room swipes. Deliberately event-driven: no rendering loop.
  let swipeStartX=0, swipeStartY=0;
  const roomOrder=rooms.slice();
  document.addEventListener('touchstart',e=>{
    if(e.touches.length!==1) return;
    const t=e.changedTouches[0]; swipeStartX=t.clientX; swipeStartY=t.clientY;
  },{passive:true});
  document.addEventListener('touchend',e=>{
    if(document.getElementById('lightbox')?.classList.contains('open')) return;
    if(document.getElementById('mobileNav')?.classList.contains('open')) return;
    const t=e.changedTouches[0]; const dx=t.clientX-swipeStartX; const dy=t.clientY-swipeStartY;
    if(Math.abs(dx)<72 || Math.abs(dx)<Math.abs(dy)*1.2) return;
    const idx=roomOrder.indexOf(activeRoom);
    const nextIdx=(idx+(dx<0?1:-1)+roomOrder.length)%roomOrder.length;
    route(roomOrder[nextIdx]);
  },{passive:true});

  function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;document.getElementById('progress').style.width=(max>0?scrollY/max*100:100)+'%';document.getElementById('topbar').classList.toggle('scrolled',scrollY>8)}
  addEventListener('scroll',updateProgress,{passive:true}); addEventListener('resize',updateProgress,{passive:true}); updateProgress();

  const video=document.getElementById('video');
  const vPlay=document.getElementById('vPlay'); const vMute=document.getElementById('vMute'); const vSeek=document.getElementById('vSeek'); const vFull=document.getElementById('vFull');
  function loadVideo(i,autoplay=false){cinemaIndex=i;const src=i===0?'assets/v02.mp4':'assets/v03.mp4'; video.pause();video.src=src;video.poster=src.replace('.mp4','.webp');video.load(); if(autoplay){resumeMusicAfterVideo=!music.paused; if(!music.paused)pauseMusic(); video.play().catch(()=>{});}}
  vPlay.addEventListener('click',()=>{if(video.paused){resumeMusicAfterVideo=!music.paused; if(!music.paused)pauseMusic(); video.play().catch(()=>{});}else video.pause();});
  vMute.addEventListener('click',()=>{video.muted=!video.muted;vMute.textContent=video.muted?'Sound off':'Sound'});
  vSeek.addEventListener('input',()=>{if(video.duration)video.currentTime=(vSeek.value/100)*video.duration});
  video.addEventListener('timeupdate',()=>{if(video.duration)vSeek.value=String(video.currentTime/video.duration*100)});
  video.addEventListener('play',()=>{vPlay.textContent='Pause';if(!music.paused){resumeMusicAfterVideo=true;pauseMusic();}});
  video.addEventListener('pause',()=>{vPlay.textContent='Play'});
  video.addEventListener('ended',()=>{if(resumeMusicAfterVideo){resumeMusicAfterVideo=false;playMusic();}});
  vFull.addEventListener('click',()=>{const f=video.requestFullscreen||video.webkitRequestFullscreen;if(f)f.call(video)});
  // Intentionally defer video network/loading until Cinema is actually opened.

  let lightIndex=0;
  const lb=document.getElementById('lightbox'); const lbImg=document.getElementById('lightboxImg');
  function openLightbox(i){lightIndex=i;lbImg.src=`assets/${photos[i]}`;lbImg.alt=captions[i];lb.classList.add('open');}
  function closeLightbox(){lb.classList.remove('open')}
  function stepLight(d){lightIndex=(lightIndex+d+photos.length)%photos.length;lbImg.src=`assets/${photos[lightIndex]}`;lbImg.alt=captions[lightIndex]}
  document.getElementById('lbClose').addEventListener('click',closeLightbox);document.getElementById('lbPrev').addEventListener('click',()=>stepLight(-1));document.getElementById('lbNext').addEventListener('click',()=>stepLight(1));
  lb.addEventListener('click',e=>{if(e.target===lb)closeLightbox()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();if(lb.classList.contains('open')){if(e.key==='ArrowLeft')stepLight(-1);if(e.key==='ArrowRight')stepLight(1)}});
  let tx=0;lb.addEventListener('touchstart',e=>tx=e.changedTouches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40)stepLight(dx<0?1:-1)},{passive:true});

  const guide=document.getElementById('guideOverlay');const guideSteps=[...guide.querySelectorAll('.guide-step')];const guideDots=[...guide.querySelectorAll('.guide-progress i')];let guideIndex=0;
  const guideNext=document.getElementById('guideNext'), guideBack=document.getElementById('guideBack');
  function guideShow(){guideSteps.forEach((s,i)=>s.classList.toggle('active',i===guideIndex));guideDots.forEach((d,i)=>d.classList.toggle('active',i===guideIndex));guideBack.style.display=guideIndex?'inline-flex':'none';guideNext.textContent=guideIndex===guideSteps.length-1?'Enter the Universe':'Next'}
  guideNext.addEventListener('click',()=>{if(guideIndex<guideSteps.length-1){guideIndex++;guideShow();}else{guide.classList.add('hide');setTimeout(()=>guide.remove(),650);playMusic();}});
  guideBack.addEventListener('click',()=>{guideIndex=Math.max(0,guideIndex-1);guideShow()});guideShow();

  // Adaptive display engine: CSS does the heavy lifting; JS only exposes the live viewport metrics.
  // This avoids device-specific hardcoding and lets phones, tablets, laptops and ultrawide monitors
  // share the same fluid layout system.
  (()=>{
    const root=document.documentElement;
    let frame=0;
    const applyViewport=()=>{
      frame=0;
      const vv=window.visualViewport;
      const w=Math.max(1,Math.round(vv?.width||window.innerWidth));
      const h=Math.max(1,Math.round(vv?.height||window.innerHeight));
      root.style.setProperty('--vw',w+'px');
      root.style.setProperty('--vh',h+'px');
      root.dataset.width=w<480?'phone-small':w<760?'phone':w<1040?'compact':w<1440?'desktop':'desktop-wide';
      root.dataset.orientation=w>=h?'landscape':'portrait';
      root.classList.toggle('touch-layout',matchMedia('(pointer:coarse)').matches || navigator.maxTouchPoints>0);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(applyViewport)};
    addEventListener('resize',schedule,{passive:true});
    addEventListener('orientationchange',schedule,{passive:true});
    vv?.addEventListener('resize',schedule,{passive:true});
    if('ResizeObserver' in window){
      const ro=new ResizeObserver(schedule);
      const mainEl=document.querySelector('main');
      if(mainEl)ro.observe(mainEl);
    }
    applyViewport();
  })();

  // Desktop polish is CSS-only: no pointer tracking, no per-card layout reads, no render loop.

  // Detail pass: add tiny metadata ribbons to major visual blocks without extra rendering loops.
  document.querySelectorAll('.room-head').forEach((el,i)=>{if(!el.querySelector('.detail-ribbon')){const r=document.createElement('div');r.className='detail-ribbon';r.innerHTML='<span>ARCHIVE TRACE</span><b>'+String(i+1).padStart(2,'0')+'</b><i></i><em>SYNCED</em>';el.appendChild(r)}});
  document.querySelectorAll('.memory-card').forEach((el,i)=>el.style.setProperty('--card-index',i));
  document.querySelectorAll('.forever-panel').forEach((el,i)=>el.dataset.archive=String(i+1).padStart(2,'0'));

  // Reveal long sections when they enter view, no animation loop.
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('section-in');revealObserver.unobserve(en.target)}}),{threshold:.08}) : null;
  document.querySelectorAll('.forever-panel,.memory-card,.museum-card').forEach(el=>{if(revealObserver)revealObserver.observe(el)});

  document.addEventListener('keydown',e=>{
    if(!e.shiftKey) return;
    const map={'1':'home','2':'memories','3':'cinema','4':'letter','5':'museum','6':'forever'};
    if(map[e.key]){e.preventDefault();route(map[e.key]);}
  });
  route(location.hash.slice(1)||'home',false);
})();
