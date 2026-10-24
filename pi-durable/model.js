(function (root) {
'use strict';
const steps = ['Read the repository', 'Prepare the fix', 'Run the tests', 'Create a pull request', 'Report the result'];
const scenarios = {
  saved: {boundary: 3, title: 'The tests passed. Their result is saved.', body: 'Both agents have completed three actions. Now interrupt the process before it starts the pull request.', recovery: 'Reuse the saved results.', detail: 'The replacement worker reads the journal and proceeds to the PR. It does not need to repeat the three recorded tool outcomes.'},
  safe: {boundary: 0, title: 'A file read is in flight.', body: 'The durable journal records the tool intent. The process has not saved its result yet. This example tool only reads a file and is declared safe to replay.', recovery: 'Repeat the safe read.', detail: 'The durable worker reruns the interrupted read, records its result, and continues. Safe replay is a tool contract — not something to assume for every command.'},
  unsafe: {boundary: 3, title: 'The PR exists. The result is not yet recorded.', body: 'The external service created the PR, then the process died before saving its response. This is the dangerous gap between doing an action and recording success.', recovery: 'The PR outcome needs checking.', detail: 'The harness surfaces the interrupted unsafe tool instead of silently creating another PR. In this example, a separate read checks the repository and finds the existing PR.'}
};
function initial(scenario = 'saved') {
  if (!scenarios[scenario]) throw new Error('Unknown scenario');
  return {scenario, phase: 0};
}
function advance(state) { return {...state, phase: Math.min(4, state.phase + 1)}; }
function view(state) {
  const s = scenarios[state.scenario];
  const count = state.phase === 0 ? 0 : state.phase === 4 ? 5 : s.boundary;
  const durable = steps.map((_, i) => i < count ? 'done' : 'pending');
  const regular = steps.map((_, i) => i < (state.phase ? s.boundary : 0) ? 'done' : 'pending');
  if (state.phase === 1 && state.scenario !== 'saved') durable[s.boundary] = regular[s.boundary] = 'active';
  if (state.phase === 2 && state.scenario !== 'saved') durable[s.boundary] = regular[s.boundary] = 'unknown';
  if (state.phase === 3 && state.scenario === 'safe') durable[0] = 'replay';
  if (state.phase === 3 && state.scenario === 'unsafe') durable[3] = 'verify';
  return {durable, regular, complete:state.phase === 4, externalPR:state.scenario === 'unsafe' && state.phase >= 1 || state.phase === 4, uncertain:state.scenario === 'unsafe' && [2,3].includes(state.phase)};
}

const api = {steps, scenarios, initial, advance, view};
if (typeof module === 'object' && module.exports) module.exports = api;
else root.PiDurableModel = api;
})(typeof window === 'undefined' ? globalThis : window);
