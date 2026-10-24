import {steps, scenarios, initial, advance, view} from './model.mjs';
const $ = (id) => document.getElementById(id);
let state = initial();
const labels = ['1. Run to failure point', '2. Crash the process', '3. Restart the worker', '4. Finish recovery', 'Experiment complete'];
const phaseLabels = ['READY TO RUN', 'AT THE FAILURE POINT', 'PROCESS OFFLINE', 'NEW WORKER RECOVERING', 'WORK COMPLETE'];
const statusNames = {done:'Saved / complete', pending:'Waiting', active:'In progress', unknown:'Interrupted', replay:'Replay safe read', verify:'Check remote PR'};
function renderSteps(id, values) {
  $(id).replaceChildren(...steps.map((name,i) => {
    const li = document.createElement('li'); li.className = values[i];
    const icon = document.createElement('span'); icon.className='step-icon'; icon.textContent=values[i]==='done'?'✓':values[i]==='unknown'?'!':String(i+1).padStart(2,'0');
    const text = document.createElement('span'); text.textContent=name;
    const status = document.createElement('small'); status.textContent=statusNames[values[i]];
    li.append(icon,text,status); return li;
  }));
}
function render() {
  const s=scenarios[state.scenario], v=view(state), p=state.phase;
  renderSteps('regular-steps',v.regular); renderSteps('durable-steps',v.durable);
  $('advance').textContent=labels[p]+(p===4?' ✓':' →'); $('advance').disabled=p===4;
  $('phase-label').textContent=phaseLabels[p];
  $('regular-status').textContent=['Waiting for you to begin.','Process running.','Process stopped. Conversation history may still exist.','Session available; user must inspect and continue.','Awaiting user-directed recovery.'][p];
  $('durable-status').textContent=['Waiting for you to begin.','Recording durable state.','Process stopped. Persistent journal remains.','Replacement worker opened the same storage.','Recovered and finished. One PR in this example.'][p];
  let title='Try breaking the process.', body='Press Run to reach this scenario’s failure boundary. You control each stage; nothing runs in the background.';
  if(p===1) {title=s.title;body=s.body;}
  if(p===2) {title='The worker is gone. The journal is still here.';body='A stopped process cannot continue by itself. In a deployed system, a supervisor, queue, or alarm must start a replacement worker. Press Restart to simulate that wake-up.';}
  if(p===3) {title=s.recovery;body=s.detail;}
  if(p===4) {title=state.scenario==='unsafe'?'Recovered without blindly repeating the action.':'Recorded progress becomes a place to continue.';body=state.scenario==='unsafe'?'The verification read found the existing PR, so the agent recorded that result and continued. This check is an example tool strategy, not an exactly-once guarantee from Pi.':'The remaining actions finish and their results are recorded. Regular Pi can also be continued by a user; the difference demonstrated here is coordinated recovery of an unfinished task.';}
  $('explain-title').textContent=title; $('explain-body').textContent=body;
  const journal=p===0?['No events yet.']:['request accepted · task pending'];
  if(p) {
    for(let i=0;i<s.boundary;i++)journal.push(`tool ${i+1} · intent saved → outcome committed`);
    if(state.scenario!=='saved')journal.push(`tool ${s.boundary+1} · intent saved → outcome missing`);
    if(p>=2)journal.push('worker stopped · journal retained');
    if(p>=3)journal.push(state.scenario==='unsafe'?'recovery · unsafe tool interrupted → verify remote state':state.scenario==='safe'?'recovery · replay safe read':'recovery · reuse committed outcomes');
    if(p===4)journal.push(state.scenario==='unsafe'?'verification · existing PR found → outcome recorded':'remaining tools · outcomes committed', 'task complete');
  }
  $('journal').replaceChildren(...journal.map(event=>{const li=document.createElement('li');li.textContent=event;return li;}));
}
document.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  state=initial(button.dataset.scenario);render();
}));
$('advance').addEventListener('click',()=>{state=advance(state);render();});
$('reset').addEventListener('click',()=>{state=initial(state.scenario);render();});
const layers={
  client:['THE WINDOW','Closing a tab is not killing a worker.','Your browser sends requests and displays the run. When work is owned by a cloud backend, the browser can disconnect and later reconnect to recorded state. The application must implement this separation.','A chat screen is a client. It is not the agent’s whole runtime.'],
  harness:['THE COORDINATOR','The machinery around the model.','Pi manages the conversation, context, tool calls, and the agent loop. Pi Durable adds persistent task state and recovery behavior. It is a framework for building agents; installing it does not automatically turn the regular CLI into a hosted service.','Model → proposed action → tool result → next model turn.'],
  model:['THE REASONING','It still needs an AI model.','The model interprets context and proposes text or tool calls. Durability preserves the surrounding task state; it does not keep a failed network stream alive or make the model more intelligent.','Interrupted requests may be sent again. Account for extra usage.'],
  storage:['THE JOURNAL','Remember what was committed.','Persistent storage holds conversation and task records. A replacement worker needs access to the same data. Pi Durable offers SQLite and JSONL storage, alongside an in-memory option intended for cases that do not require crash persistence.','A journal on temporary storage disappears when that storage does.'],
  tools:['THE HANDS','Actions need their own boundaries.','Tools read files, run tests, or call APIs. A sandbox contains code execution. Its files and lifetime need a separate plan: saving a conversation does not save every workspace file.','Safe to repeat? Declare and design that contract per tool.'],
  host:['THE WAKE-UP','Something must restart the work.','A cloud worker provides compute. Queues, alarms, or a supervisor bring unfinished tasks back after interruption. Durable storage plus a restart mechanism lets a new process take over.','A VM alone is a place to run code, not a complete recovery design.']
};
function selectLayer(key){const [k,t,b,r]=layers[key];$('layer-kicker').textContent=k;$('layer-title').textContent=t;$('layer-body').textContent=b;$('layer-rule').textContent=r;}
document.querySelectorAll('[data-layer]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));selectLayer(button.dataset.layer);}));
const clouds={
  vercel:{badge:'BETA / A NATURAL NEXT EXPERIMENT',title:'Replaceable functions. A durable log.',body:'The durable-harness/pi-durable integration runs Pi’s full Harness on a Workflow SDK World log. A queue brings the turn back in a new function after failure. Each Pi commit waits for the log, adding latency. For your existing Vercel projects, this is a practical route to investigate.',url:'https://vercel.com/docs/agent-harnesses/pi',flow:['Browser / authenticated API','Pi Harness in a function','World log + queue','New function resumes pending turn']},
  cloudflare:{badge:'BETA / STATEFUL AGENT HOST',title:'One durable object. Persistent state.',body:'PiHarness stores Pi’s records in the Durable Object’s SQLite database. Lifecycle jobs and alarms wake unfinished work after eviction or a crash. Your application chooses how to deliver the session stream to clients, such as WebSockets or HTTP.',url:'https://developers.cloudflare.com/agents/harnesses/pi/',flow:['Browser / application transport','PiHarness in a Durable Object','SQLite + Lifecycle alarm','Object wakes and reopens Pi state']},
  self:{badge:'YOUR INFRASTRUCTURE / YOUR OPERATIONS',title:'Own the runtime and the recovery.',body:'You can build around Pi Durable on your own server with persistent storage. You then own the supervisor, storage reliability, access control, backups, and tool environment. This gives control, but moves operational work into your application.',url:'https://earendil.com/posts/pi-durable/',flow:['Your client / API','Pi Durable process','Persistent SQLite or JSONL','Your supervisor restarts the process']}
};
function selectCloud(key){const c=clouds[key];$('cloud-badge').textContent=c.badge;$('cloud-title').textContent=c.title;$('cloud-body').textContent=c.body;$('cloud-source').href=c.url;$('cloud-flow').replaceChildren(...c.flow.map((name,i)=>{const row=document.createElement('div'),num=document.createElement('span');num.textContent=String(i+1).padStart(2,'0');row.append(num,document.createTextNode(name));return row;}));}
document.querySelectorAll('[data-cloud]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-cloud]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));selectCloud(button.dataset.cloud);}));
render();selectLayer('harness');selectCloud('vercel');
