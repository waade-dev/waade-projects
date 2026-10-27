import { ProjectDial, wrapIndex, wheelPixels } from './dial.mjs';

const art = {
  durable: '<g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="58" y="35" width="94" height="57" rx="4"/><path d="m78 55 8 8-8 8m20 0h29m25-9h39m-8-5 8 5-8 5"/><rect x="193" y="47" width="77" height="102" rx="4" fill="var(--art-paper)"/><path d="m207 70 4 4 7-9m7 7h29m-47 20 4 4 7-9m7 7h29m-47 20 4 4 7-9m7 7h29M104 92v39h66m-8-5 8 5-8 5"/></g><text x="60" y="157" fill="currentColor" font-size="10" font-family="monospace">CHECKPOINT → RESUME</text>',
  skills: '<g fill="none" stroke="currentColor" stroke-width="1.4"><rect x="63" y="40" width="137" height="111" rx="5"/><path d="M63 62h137"/><circle cx="76" cy="51" r="2"/><circle cx="85" cy="51" r="2"/><path d="m79 80 7 6-7 6m17 0h25m-42 19h77m-77 11h54"/><rect x="171" y="78" width="93" height="68" rx="5" fill="var(--art-paper)"/><path d="m193 101-8 9 8 9m48-18 8 9-8 9m-20-20-8 22"/></g><text x="211" y="51" fill="currentColor" font-size="10" font-family="monospace">SKILL.md</text>',
  papers: '<g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M99 33h103v122H99z" transform="rotate(-10 150 95)"/><path d="M106 29h103v122H106z" transform="rotate(6 150 95)"/><path d="M110 27h102v125H110z" fill="var(--art-paper)"/><path d="M125 46h31m-31 9h55m-55 63h71m-71 8h48"/><rect x="126" y="71" width="19" height="24" rx="3"/><rect x="177" y="71" width="19" height="24" rx="3"/><path d="M145 83h32m-9-5 9 5-9 5"/><circle cx="161" cy="105" r="3"/></g><text x="46" y="147" fill="currentColor" font-size="12" font-family="monospace">[ attention ]</text>',
  blueprint: '<g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="55" y="43" width="77" height="47" rx="3"/><rect x="194" y="43" width="77" height="47" rx="3"/><rect x="125" y="122" width="77" height="35" rx="3"/><path d="M132 66h62m-8-5 8 5-8 5m47 19v15H164v17m-5-8 5 8 5-8"/><path d="M72 59h44m-44 11h24m116-11h42m-42 11h22M141 139h45"/><circle cx="55" cy="43" r="3" fill="var(--art-paper)"/><circle cx="132" cy="90" r="3" fill="var(--art-paper)"/></g><path d="m277 122 9 23-10-4-5 9z" fill="currentColor"/>',
  space: '<g fill="none" stroke="currentColor" stroke-width="1.4"><rect x="64" y="27" width="200" height="128" rx="7"/><path d="M64 50h200"/><circle cx="77" cy="39" r="2"/><circle cx="87" cy="39" r="2"/><circle cx="97" cy="39" r="2"/><path d="M135 83 163 67l28 16v32l-28 16-28-16z"/><path d="m135 83 28 16 28-16m-28 16v32"/><path d="m85 76 6 6-6 6m14 1h16"/><path d="M216 111h27m-27 8h17"/></g><text x="82" y="143" fill="currentColor" font-size="9" font-family="monospace">SANDBOX_01</text>',
  library: '<g stroke="currentColor" stroke-width="1.3"><path d="M48 139h232v5H48z" fill="currentColor"/><rect x="69" y="57" width="28" height="81" rx="3" fill="none"/><rect x="101" y="46" width="35" height="92" rx="3" fill="currentColor" fill-opacity=".14"/><rect x="140" y="65" width="23" height="73" rx="2" fill="none"/><rect x="172" y="48" width="29" height="90" rx="3" fill="none" transform="rotate(-10 186 137)"/><rect x="213" y="72" width="29" height="66" rx="3" fill="currentColor" fill-opacity=".2"/><path d="M77 71h12m-12 6h12m19-17h21m-21 9h21m91 19h14" fill="none"/></g><text x="256" y="57" fill="currentColor" font-size="24">✳</text>',
  atlas: '<g fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="164" cy="93" r="28"/><circle cx="164" cy="93" r="50" stroke-dasharray="3 6"/><path d="m78 54 59 25m54 27 56 26m-61-57 53-33m-99 69-57 28m80-74V30m0 91v37"/><circle cx="78" cy="54" r="11" fill="var(--art-paper)"/><circle cx="247" cy="132" r="11" fill="var(--art-paper)"/><rect x="228" y="31" width="22" height="22" rx="3" fill="var(--art-paper)"/><rect x="72" y="128" width="22" height="22" rx="3" fill="var(--art-paper)"/><path d="m151 91 9 9 17-19" stroke-width="2"/></g><text x="221" y="94" fill="currentColor" font-size="10" font-family="monospace">evidence ↗</text>',
  profile: '<g fill="none" stroke="currentColor" stroke-width="1.4"><rect x="69" y="34" width="187" height="117" rx="6"/><circle cx="113" cy="81" r="18"/><path d="M89 123c0-22 48-22 48 0m18-57h72m-72 12h49m-49 19h72m-72 11h60m-60 11h33"/></g><text x="79" y="24" fill="currentColor" font-size="9" font-family="monospace">HELLO, WORLD.</text><path d="m245 138 7 16 7-16m-7 16v-25" fill="none" stroke="currentColor" stroke-width="1.4"/>'
};

const $ = id => document.getElementById(id);
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 720px)');
let projects = [], views = [], active = 'about', category = 'All';
let motion = true, tree = true, phase = 0, treePhase = 0, raf = 0, lastFrame = 0;
let pointer = { x: .5, y: .5 }, colors, sculptureCanvas = null, sculptureContext = null;
let mobileTarget = null;
const dial = new ProjectDial();
let dialFrame = 0, wheelItems = [], dialReady = false, drag = null, suppressDialClickUntil = 0, dialCommitPending = false;
let reducedWheelDelta = 0;
const treeCanvas = $('tree-canvas');
const treeContext = treeCanvas.getContext('2d');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const graphic = p => `<svg viewBox="0 0 328 184" fill="none" aria-hidden="true">${art[p.art] || art.papers}</svg>`;
const external = (url, label, className = 'text-link') => `<a class="${className}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`;
const prompt = cmd => `<p class="prompt">amith@waade <span>~ (main)</span><br>❯ <b>${escape(cmd)}</b></p>`;
const effectiveMotion = () => motion && !reduced.matches;
const preferences = {
  get(key, fallback) { try { return localStorage.getItem(`waade-${key}`) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(`waade-${key}`, String(value)); } catch { /* Preferences are optional. */ } }
};

function aboutHTML() {
  return `<div class="specimen"><div class="specimen-label"><span>WAADE / CURIOSITY FIELD</span><span>an idea, taking shape.</span></div><canvas id="sculpture-canvas" aria-hidden="true"></canvas><div class="specimen-word"><strong>waade.</strong><small>AMITH ATHREYA<br>SOFTWARE + EXPERIMENTS</small></div><div class="specimen-bottom"><span>points → connections → possibilities</span><span>study / 001</span></div></div>${prompt('whoami')}<h1>Things I’ve made.<br>Places to <em>explore.</em><span class="cursor">_</span></h1><p class="intro-description">I’m Amith. I build software and make things to understand them better. Useful tools, curious experiments, and ideas made interactive—these are my corners of the internet.</p><div class="intro-actions"><a class="text-link" href="#projects">Explore ${projects.length} projects <span aria-hidden="true">↗</span></a>${external('https://github.com/waade-dev', 'Find me on GitHub')}</div><dl class="facts"><dt>focus</dt><dd>Software engineering · backend systems · AI</dd><dt>approach</dt><dd>Build it. Explore it. Understand it.</dd><dt>currently</dt><dd>Following the next interesting question.</dd></dl>`;
}
function projectHTML(p) {
  return `${prompt(`inspect projects/${p.id}`)}<p class="eyebrow">${escape(p.category)} / PROJECT ${escape(p.number)}</p><h1 class="project-heading">${escape(p.name)}</h1><p class="project-description">${escape(p.description)}</p><div class="project-plate"><div class="specimen-label"><span>W / ${escape(p.number)}</span><span>${escape(p.label)}</span></div>${graphic(p)}</div>${external(p.url, p.access || 'Explore website', 'visit-link')}<p class="project-domain">${escape(new URL(p.url).hostname)}</p><div class="project-navigation"><a href="#projects">← all projects</a><button data-next>next discovery →</button></div>`;
}
function directoryHTML() {
  const filtered = projects.filter(p => category === 'All' || p.category === category);
  return `${prompt('ls projects/')}<p class="eyebrow">THE COLLECTION / ${String(projects.length).padStart(2,'0')} INDEPENDENT PROJECTS</p><h1>Follow a thread.<br><em>Find something interesting.</em></h1><div class="filters" role="group" aria-label="Filter projects by category">${['All',...new Set(projects.map(p=>p.category))].map(c => `<button class="filter" data-category="${c}" aria-pressed="${category === c}">${c === 'All' ? 'All projects' : c}</button>`).join('')}</div><div class="directory-list">${filtered.map(p => `<button class="directory-item" data-view="${p.id}"><span class="item-number">${p.number}</span><span><strong>${escape(p.name)}</strong><small>${escape(p.category)} / ${escape(p.label)}</small></span><span class="accent" aria-hidden="true">↗</span></button>`).join('')}</div>`;
}
function helpHTML() {
  return `${prompt('help')}<p class="eyebrow">A NOTEBOOK THAT TAKES DIRECTIONS</p><h1>A little less clicking.<br><em>A little more curiosity.</em></h1><p class="intro-description">Type a command in the prompt below, or search for anything in the collection. All project pages can also be selected in the explorer.</p><dl class="help-list"><dt>projects / ls</dt><dd>Explore the full collection.</dd><dt>about / whoami</dt><dd>Meet the person behind it.</dd><dt>next / prev</dt><dd>Turn the project wheel.</dd><dt>random</dt><dd>A surprise from the collection.</dd><dt>cd polylume</dt><dd>Go straight to a project by its ID.</dd><dt>theme paper</dt><dd>Try paper, carbon, or moss.</dd><dt>motion off</dt><dd>Pause every animation.</dd><dt>tree off</dt><dd>Freeze the rotating branch.</dd><dt>↑ ↓ / Enter</dt><dd>Explore, then focus the selected page.</dd><dt>/ / Escape</dt><dd>Open search / close search.</dd></dl>`;
}
function updateWheel() {
  const index = views.findIndex(v => v.id === active);
  const selected = Math.max(0,index);
  const position = mobile.matches ? selected : dial.position;
  $('wheel-scene').dataset.dialState = mobile.matches ? 'native' : dial.mode;
  $('wheel-scene').dataset.dialPosition = position.toFixed(4);
  const nearest = wrapIndex(position, views.length);
  wheelItems.forEach(({li,button},i) => {
    const distance = ((i-position+views.length/2)%views.length+views.length)%views.length-views.length/2;
    const angle = distance*.39;
    const vars = {x:`${164*(1-Math.cos(angle))}px`,y:`${275*Math.sin(angle)}px`,depth:`${-Math.abs(distance)*28}px`,ry:`${-distance*8}deg`,rz:`${distance*-8}deg`,opacity:String(Math.max(.13,1-Math.abs(distance)*.18)),z:String(20-Math.abs(distance))};
    for (const [key,value] of Object.entries(vars)) li.style.setProperty(`--${key}`,value);
    button.classList.toggle('is-nearest', i===nearest && active!=='help');
    button.setAttribute('aria-current', String(i===selected && active!=='help'));
    button.tabIndex = i===selected ? 0 : -1;
  });
  $('wheel-counter').textContent = `${String(nearest+1).padStart(2,'0')} / ${views.length}`;
}
function commitDial() {
  if (!views.length) return;
  if (!dialCommitPending) { updateWheel(); return; }
  dialCommitPending = false;
  const id = views[wrapIndex(dial.position,views.length)].id;
  if (id !== active) select(id,true,{fromDial:true});
  else updateWheel();
}
function runDial(now) {
  dialFrame = 0;
  const moving = dial.step(now);
  updateWheel();
  if (moving) dialFrame = requestAnimationFrame(runDial);
  else if (dial.mode === 'idle') commitDial();
}
function startDial() {
  if (!effectiveMotion()) {
    dial.finish(); updateWheel(); commitDial(); return;
  }
  if (!dialFrame) dialFrame = requestAnimationFrame(runDial);
}
function syncDial(index) {
  cancelAnimationFrame(dialFrame); dialFrame=0;
  dialCommitPending=false;
  dial.goTo(index,views.length,!effectiveMotion()||mobile.matches||!dialReady);
  dialReady=true;
  if (dial.mode!=='idle') startDial();
}
function centerMobile() {
  if (!mobile.matches) return;
  const button = $('wheel').querySelector('[aria-current="true"]');
  if (button) {
    const scene = $('wheel-scene');
    const left = button.parentElement.offsetLeft-(scene.clientWidth-button.parentElement.offsetWidth)/2;
    if (Math.abs(scene.scrollLeft-left)<2) { mobileTarget=null; return; }
    mobileTarget=active;
    scene.scrollTo({left,behavior:effectiveMotion()?'smooth':'instant'});
  }
}
function select(id, writeHash = true, {fromDial=false} = {}) {
  if (id === 'ferroprint') id = 'polylume';
  const fromSearch = $('search-dialog').open;
  if (fromSearch) closeSearch();
  const valid = views.some(v => v.id === id) || id === 'help';
  active = valid ? id : 'about';
  const p = projects.find(p => p.id === active);
  $('content').innerHTML = p ? projectHTML(p) : active === 'projects' ? directoryHTML() : active === 'help' ? helpHTML() : aboutHTML();
  $('content').scrollTop = 0;
  sculptureCanvas = $('sculpture-canvas');
  sculptureContext = sculptureCanvas?.getContext('2d');
  $('current-path').textContent = p ? `~/projects/${p.id}` : active === 'about' ? '~' : `~/${active}`;
  $('selected-label').textContent = p ? p.name.toUpperCase() : active === 'about' ? 'NOTEBOOK / WHOAMI' : active.toUpperCase();
  document.querySelectorAll('[data-nav]').forEach(a => a.setAttribute('aria-current', (a.dataset.nav === (p?'projects':active)) ? 'page' : 'false'));
  $('announcement').textContent = `${p?.name || (active==='about'?'Notebook':active)} selected`;
  $('command-results').hidden = true;
  if (!fromDial) syncDial(Math.max(0,views.findIndex(v=>v.id===active)));
  updateWheel(); centerMobile(); resizeCanvases(); draw();
  if (fromSearch) $('content').focus({preventScroll:true});
  if (writeHash && location.hash !== `#${active}`) history.pushState(null,'',`#${active}`);
}
function move(delta, focus=false) {
  if (!views.length) return;
  const index = Math.max(0, views.findIndex(v => v.id === active));
  select(views[(index+delta+views.length)%views.length].id);
  if (focus) $('wheel').querySelector('[aria-current="true"]')?.focus({preventScroll:true});
}
function buildWheel() {
  $('wheel').innerHTML = views.map(v => `<li><button class="wheel-card" data-view="${v.id}" aria-label="${escape(v.name)}" aria-current="false" tabindex="-1"><span class="wheel-art">${v.art ? graphic(v) : `<span class="wheel-symbol">${v.symbol}</span>`}</span><span class="wheel-name">${escape(v.short || v.name)}</span></button></li>`).join('');
  wheelItems=[...$('wheel').children].map(li=>({li,button:li.querySelector('button')}));
}
function setTheme(theme) {
  if (!['carbon','moss','paper'].includes(theme)) return false;
  root.dataset.theme = theme; $('theme-select').value = theme;
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue('--bg').trim();
  preferences.set('theme',theme); colors = null; draw(); return true;
}
function syncMotion() {
  if ((!effectiveMotion() || document.hidden) && dial.mode!=='idle') {
    cancelAnimationFrame(dialFrame);dialFrame=0;
    dial.finish();if(views.length)commitDial();
  }
  root.dataset.motion = effectiveMotion() ? 'on' : 'off'; root.dataset.tree = tree ? 'on' : 'off';
  $('motion-button').textContent = reduced.matches ? 'reduced ○' : motion ? 'on ●' : 'off ○';
  $('motion-button').setAttribute('aria-pressed',String(effectiveMotion()));
  $('motion-button').disabled = reduced.matches;
  $('tree-button').textContent = tree ? 'rotate ↻' : 'paused ○';
  $('tree-button').setAttribute('aria-pressed',String(tree));
  cancelAnimationFrame(raf); lastFrame = 0; draw();
  if (effectiveMotion() && !document.hidden) raf = requestAnimationFrame(animate);
}
function feedback(text) { $('command-feedback').textContent = text; }
function openSearch() {
  if (!$('search-dialog').open) {
    $('command-input').value='';
    $('search-dialog').showModal();
    $('search-toggle').setAttribute('aria-expanded','true');
  }
  searchResults();
  $('command-input').focus({preventScroll:true});
}
function closeSearch() {
  $('search-dialog').close();
  $('search-toggle').setAttribute('aria-expanded','false');
}
function searchResults() {
  const query = $('command-input').value.trim().toLowerCase();
  const box = $('command-results');
  const found = projects.filter(p => `${p.id} ${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query));
  box.innerHTML = found.length ? found.map(p=>`<button data-view="${p.id}"><span>${escape(p.name)}</span><span class="muted">${escape(p.category)} ↵</span></button>`).join('') : '<p>No matching projects. Press Enter to run a command, or try another search.</p>';
  box.hidden=false;
  feedback(query ? `${found.length} ${found.length===1?'project':'projects'} found` : `${projects.length} projects to explore`);
}
function command(raw) {
  if (!views.length) { feedback('The collection is still opening. Please try again.'); return; }
  const text = raw.trim().toLowerCase();
  if (!text) return;
  const [name,...words] = text.split(/\s+/), arg=words.join(' ');
  $('command-results').hidden=true;
  if (['projects','ls','work'].includes(name)) select('projects');
  else if (['about','whoami','home'].includes(name)) select('about');
  else if (name==='help') select('help');
  else if (['next','prev','previous'].includes(name)) move(name==='next'?1:-1);
  else if (name==='random') select(projects[Math.floor(Math.random()*projects.length)].id);
  else if (name==='theme') { if(!setTheme(arg)) { feedback('Try theme carbon, moss, or paper.'); return; } }
  else if (['motion','tree'].includes(name)) {
    if (!['on','off'].includes(arg)) { feedback(`Try ${name} on or ${name} off.`); return; }
    if(name==='motion') { motion=arg==='on'; preferences.set('motion',motion); } else {tree=arg==='on';preferences.set('tree',tree);}
    syncMotion();
  } else if (name==='clear') { $('command-input').value=''; feedback('follow your curiosity.');return; }
  else {
    const query = name==='cd' ? arg.replace(/^~?\/?projects\//,'').replace(/\/$/,'') : text;
    const match = views.find(v => v.id===query || v.name.toLowerCase()===query) || projects.find(p=>`${p.name} ${p.description}`.toLowerCase().includes(query));
    if(!match) {feedback('Nothing found. Try help or projects.'); return;}
    select(match.id);
  }
  $('command-input').value=''; feedback(`${text} ↵`);
}

// A rotating three-dimensional branch and a torus knot, projected onto 2D canvases.
// No WebGL, remote assets, telemetry, or animation dependencies.
function fit(canvas) {
  if (!canvas) return;
  const rect=canvas.getBoundingClientRect(), dpr=Math.min(devicePixelRatio||1,2);
  if (!rect.width || !rect.height) return;
  canvas.width=Math.round(rect.width*dpr); canvas.height=Math.round(rect.height*dpr);
  canvas.getContext('2d')?.setTransform(dpr,0,0,dpr,0,0);
}
function resizeCanvases(){ fit(treeCanvas);fit(sculptureCanvas); }
function palette(){ if(!colors){const style=getComputedStyle(root);colors={accent:style.getPropertyValue('--accent').trim(),muted:style.getPropertyValue('--muted').trim(),warm:style.getPropertyValue('--warm').trim()};} return colors; }
function project3d(x,y,z,rotation,tilt=0) {
  const xx=x*Math.cos(rotation)-z*Math.sin(rotation), zz=x*Math.sin(rotation)+z*Math.cos(rotation);
  return [xx,y*Math.cos(tilt)-zz*Math.sin(tilt),y*Math.sin(tilt)+zz*Math.cos(tilt)];
}
function drawTree() {
  if(!treeContext || mobile.matches) return;
  const w=treeCanvas.clientWidth,h=treeCanvas.clientHeight;
  treeContext.clearRect(0,0,w,h);treeContext.strokeStyle=palette().muted;treeContext.lineWidth=.65;
  const point=(x,y,z)=>{const [xx,yy,zz]=project3d(x,y,z,treePhase);return [w*.56+xx*(1+zz*.003),h*.94-yy*h*.84,zz];};
  const line=(a,b,alpha)=>{treeContext.globalAlpha=alpha;treeContext.beginPath();treeContext.moveTo(a[0],a[1]);treeContext.lineTo(b[0],b[1]);treeContext.stroke();};
  line(point(0,0,0),point(0,1,0),.65);
  for(let level=0;level<17;level++){
    const y=.05+level*.054;
    for(let branch=0;branch<3;branch++){
      const angle=branch*Math.PI*2/3+level*.79;
      const radius=18+Math.sin(level*.17)*23;
      const start=point(0,y,0),end=point(Math.cos(angle)*radius,y+.13,Math.sin(angle)*radius);
      const alpha=.25+(end[2]+45)/150;
      line(start,end,alpha);
      for(let k=1;k<4;k++){
        const f=k/4,xx=Math.cos(angle)*radius*f,zz=Math.sin(angle)*radius*f;
        const from=point(xx,y+.13*f,zz);
        line(from,point(xx+Math.cos(angle+1)*12,y+.13*f+.065,zz+Math.sin(angle+1)*12),alpha*.7);
        line(from,point(xx+Math.cos(angle-1)*12,y+.13*f+.065,zz+Math.sin(angle-1)*12),alpha*.7);
      }
    }
  }
  treeContext.globalAlpha=.3;treeContext.beginPath();treeContext.ellipse(w*.56,h*.95,37,5,0,0,Math.PI*2);treeContext.stroke();treeContext.globalAlpha=1;
}
function drawSculpture() {
  if(!sculptureCanvas || !sculptureContext) return;
  const ctx=sculptureContext,w=sculptureCanvas.clientWidth,h=sculptureCanvas.clientHeight;
  ctx.clearRect(0,0,w,h);
  const scale=Math.min(w*.21,h*.39),cx=w*.33,cy=h*.51;
  const points=[];
  for(let i=0;i<350;i++){
    const t=i/350*Math.PI*2;
    for(let j=0;j<5;j++){
      const a=j/5*Math.PI*2;
      const radius=1+.38*Math.cos(3*t);
      let x=(radius+.048*Math.cos(a))*Math.cos(2*t),y=(radius+.048*Math.cos(a))*Math.sin(2*t),z=.45*Math.sin(3*t)+.048*Math.sin(a);
      const p=project3d(x,y,z,phase*.22+(pointer.x-.5)*.25,.7+Math.sin(phase*.15)*.2);
      points.push(p);
    }
  }
  points.sort((a,b)=>a[2]-b[2]);
  ctx.fillStyle=palette().accent;
  for(const [x,y,z] of points){ctx.globalAlpha=.18+(z+1.3)/3.5;const size=.65+(z+1.4)*.24;ctx.fillRect(cx+x*scale,cy+y*scale,size,size);}
  ctx.globalAlpha=.2;ctx.strokeStyle=palette().muted;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(16,h-36);ctx.lineTo(w-16,h-36);ctx.stroke();ctx.globalAlpha=1;
}
function draw(){drawTree();drawSculpture();}
function animate(now){
  if(!effectiveMotion() || document.hidden) return;
  if(!lastFrame || now-lastFrame>=32){const step=lastFrame?Math.min((now-lastFrame)/1000,.08):0;phase+=step;if(tree)treePhase+=step*.24;draw();lastFrame=now;}
  raf=requestAnimationFrame(animate);
}

$('wheel').addEventListener('click',e=>{
  if(performance.now()<suppressDialClickUntil){e.preventDefault();return;}
  const b=e.target.closest('[data-view]');if(b)select(b.dataset.view);
});
$('content').addEventListener('click',e=>{
  const b=e.target.closest('[data-view],[data-category],[data-next]');if(!b)return;
  if(b.hasAttribute('data-category')){category=b.dataset.category;const scroll=$('content').scrollTop;select('projects',false);$('content').scrollTop=scroll;$('content').querySelector(`[data-category="${category}"]`).focus({preventScroll:true});}
  else if(b.hasAttribute('data-next'))move(1);else select(b.dataset.view);
});
$('previous').addEventListener('click',()=>move(-1));$('next').addEventListener('click',()=>move(1));
$('search-toggle').addEventListener('click',openSearch);
$('search-close').addEventListener('click',closeSearch);
$('search-dialog').addEventListener('cancel',e=>{e.preventDefault();closeSearch();});
$('search-dialog').addEventListener('click',e=>{
  const bounds=$('search-dialog').getBoundingClientRect();
  if(e.target===$('search-dialog')&&(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom))closeSearch();
});
$('search-dialog').addEventListener('keydown',e=>{
  if(!['ArrowDown','ArrowUp'].includes(e.key)||!e.target.closest('#command-results'))return;
  e.preventDefault();
  const buttons=[...$('command-results').querySelectorAll('button')],index=buttons.indexOf(document.activeElement);
  if(e.key==='ArrowUp'&&index===0)$('command-input').focus();
  else buttons[Math.max(0,Math.min(buttons.length-1,index+(e.key==='ArrowDown'?1:-1)))]?.focus();
});
$('command-form').addEventListener('submit',e=>{e.preventDefault();command($('command-input').value);});
$('command-input').addEventListener('input',searchResults);
$('command-results').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b){select(b.dataset.view);$('command-input').value='';feedback('found something interesting.');}});
$('command-input').addEventListener('keydown',e=>{if(e.key==='ArrowDown'&&!$('command-results').hidden){e.preventDefault();$('command-results').querySelector('button')?.focus();}});
document.querySelectorAll('[data-command]').forEach(b=>b.addEventListener('click',()=>command(b.dataset.command)));
$('theme-select').addEventListener('change',e=>setTheme(e.target.value));
$('motion-button').addEventListener('click',()=>{motion=!motion;preferences.set('motion',motion);syncMotion();});
$('tree-button').addEventListener('click',()=>{tree=!tree;preferences.set('tree',tree);syncMotion();});
$('wheel-scene').addEventListener('wheel',e=>{
  if(mobile.matches||e.ctrlKey||e.metaKey||drag?.moved||!views.length)return;
  const pixels=wheelPixels(e,$('wheel-scene').clientHeight);
  if(!pixels)return;
  e.preventDefault();
  if(!effectiveMotion()) {
    reducedWheelDelta+=pixels;
    const steps=Math.trunc(reducedWheelDelta/100);
    if(steps){reducedWheelDelta-=steps*100;move(steps);}
    return;
  }
  dialCommitPending=true;
  dial.scroll(pixels/150,performance.now());
  startDial();
},{passive:false});
$('wheel-scene').addEventListener('pointerdown',e=>{
  if(mobile.matches||!e.isPrimary||e.button!==0||!views.length)return;
  drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,lastY:e.clientY,moved:false};
});
$('wheel-scene').addEventListener('pointermove',e=>{
  if(!drag||drag.id!==e.pointerId)return;
  const now=performance.now();
  if(!drag.moved){
    if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<5)return;
    drag.moved=true;dialCommitPending=true;
    cancelAnimationFrame(dialFrame);dialFrame=0;
    dial.beginDrag(now);
    $('wheel-scene').setPointerCapture(e.pointerId);
    $('wheel-scene').classList.add('is-dragging');
  }
  dial.drag((drag.lastY-e.clientY)/107,now);
  drag.lastY=e.clientY;updateWheel();
});
function endDialDrag(e){
  if(!drag||drag.id!==e.pointerId)return;
  const moved=drag.moved;drag=null;
  $('wheel-scene').classList.remove('is-dragging');
  if($('wheel-scene').hasPointerCapture(e.pointerId))$('wheel-scene').releasePointerCapture(e.pointerId);
  if(moved){
    suppressDialClickUntil=performance.now()+250;
    dial.release(performance.now(),e.type!=='pointerup');startDial();
  }
}
for(const type of ['pointerup','pointercancel','lostpointercapture'])$('wheel-scene').addEventListener(type,endDialDrag);
$('wheel-scene').addEventListener('pointerleave',()=>{if(drag&&!drag.moved)drag=null;});
let mobileSettle;
$('wheel-scene').addEventListener('scroll',()=>{
  if(!mobile.matches||!views.length)return;clearTimeout(mobileSettle);
  mobileSettle=setTimeout(()=>{
    const scene=$('wheel-scene'), center=scene.scrollLeft+scene.clientWidth/2;
    const items=[...$('wheel').children];const nearest=items.reduce((a,b)=>Math.abs(b.offsetLeft+b.offsetWidth/2-center)<Math.abs(a.offsetLeft+a.offsetWidth/2-center)?b:a);
    const id=nearest?.querySelector('button').dataset.view;
    if(mobileTarget){if(id===mobileTarget)mobileTarget=null;return;}
    if(id&&id!==active)select(id);
  },180);
},{passive:true});
document.addEventListener('keydown',e=>{
  const typing=['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)||document.activeElement.isContentEditable;
  if(e.key==='Escape'&&$('search-dialog').open){e.preventDefault();closeSearch();return;}
  if(e.key==='Escape')return;
  if(e.metaKey||e.ctrlKey||e.altKey||typing||!views.length)return;
  if(e.key==='/'){e.preventDefault();openSearch();}
  else if(['ArrowDown','ArrowUp'].includes(e.key)&&!document.activeElement.closest('#command-results')){e.preventDefault();move(e.key==='ArrowDown'?1:-1,true);}
  else if(e.key==='Enter'&&document.activeElement.classList.contains('wheel-card')){e.preventDefault();$('content').focus({preventScroll:true});if(mobile.matches)$('content').scrollIntoView({block:'start',behavior:effectiveMotion()?'smooth':'instant'});}
});
document.addEventListener('pointermove',e=>{
  if(!effectiveMotion())return;pointer={x:e.clientX/innerWidth,y:e.clientY/innerHeight};
  $('eye-pupil').setAttribute('transform',`translate(${(pointer.x-.5)*13} ${(pointer.y-.5)*9})`);
  $('pointer-coordinates').textContent=`x ${pointer.x.toFixed(2)} / y ${pointer.y.toFixed(2)}`;
},{passive:true});
document.querySelector('.skip-link').addEventListener('click',e=>{e.preventDefault();$('content').focus();});
window.addEventListener('hashchange',()=>{if(views.length)select(readHash(),false);});
window.addEventListener('popstate',()=>{if(views.length)select(readHash(),false);});
function readHash(){try{return decodeURIComponent(location.hash.slice(1))||'about';}catch{return 'about';}}
window.addEventListener('resize',()=>{resizeCanvases();draw();});
mobile.addEventListener('change',()=>{
  drag=null;$('wheel-scene').classList.remove('is-dragging');
  if(views.length)syncDial(Math.max(0,views.findIndex(v=>v.id===active)));
  updateWheel();centerMobile();resizeCanvases();draw();
});
reduced.addEventListener('change',syncMotion);document.addEventListener('visibilitychange',syncMotion);

motion=preferences.get('motion','true')==='true';tree=preferences.get('tree','true')==='true';
setTheme(preferences.get('theme','carbon'));syncMotion();
try{
  const response=await fetch('/projects.json',{cache:'no-cache'});
  if(!response.ok)throw new Error('Catalog unavailable');
  projects=await response.json();
  if(!Array.isArray(projects)||!projects.length||projects.some(p=>!p.name||!p.id||!p.category||!p.description||new URL(p.url).protocol!=='https:'))throw new Error('Invalid catalog');
  views=[{id:'about',name:'About Amith',short:'whoami / Amith Athreya',symbol:'w.'},...projects,{id:'projects',name:'All projects',short:'projects / the collection',symbol:'ls -a'}];
  document.querySelectorAll('.project-count').forEach(e=>e.textContent=String(projects.length).padStart(2,'0'));
  buildWheel();select(readHash(),false);
}catch{
  $('content').innerHTML='<div class="error-state"><h1>The notebook couldn’t open.</h1><p>Please refresh to load the collection.</p><button id="retry-load">Try again ↻</button></div>';
  $('retry-load').addEventListener('click',()=>location.reload());
  feedback('Collection unavailable. Please refresh.');
}
