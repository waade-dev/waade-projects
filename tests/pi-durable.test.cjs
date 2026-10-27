const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '../pi-durable');
const {initial, advance, view} = require('../pi-durable/model.js');

test('direct-file entry uses ordered classic scripts and relative local assets', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script([^>]*)src="([^"]+)"([^>]*)><\/script>/g)];
  assert.deepEqual(scripts.map(s=>s[2]), ['./model.js', './app.js', '../analytics.js']);
  for (const script of scripts) {
    assert.match(script[1] + script[3], /\bdefer\b/);
    assert.doesNotMatch(script[1] + script[3], /\b(?:module|async)\b/);
    const source = fs.readFileSync(path.join(root, script[2]), 'utf8');
    assert.doesNotMatch(source, /^\s*(?:import|export)\b/m);
  }
  assert.doesNotMatch(html, /(?:href|src)="\//);
  const browser = {window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'model.js'),'utf8'),browser);
  assert.equal(typeof browser.window.PiDurableModel.initial,'function');
});

for (const scenario of ['saved', 'safe', 'unsafe']) test(`${scenario}: interrupted work follows the correct recovery contract`, () => {
  let state = initial(scenario);
  assert.ok(view(state).durable.every(s=>s==='pending'));
  state=advance(advance(state));
  assert.equal(view(state).complete,false);
  if(scenario==='unsafe') {
    assert.equal(view(state).externalPR,true);
    assert.equal(view(state).uncertain,true);
    assert.equal(view(state).durable[3],'unknown');
  }
  state=advance(state);
  if(scenario==='saved') assert.deepEqual(view(state).durable,['done','done','done','pending','pending']);
  if(scenario==='safe') assert.equal(view(state).durable[0],'replay');
  if(scenario==='unsafe') assert.equal(view(state).durable[3],'verify');
  state=advance(state);
  assert.ok(view(state).durable.every(s=>s==='done'));
  assert.equal(view(state).complete,true);
  assert.deepEqual(advance(state),state);
  assert.deepEqual(initial(scenario),{scenario,phase:0});
});
