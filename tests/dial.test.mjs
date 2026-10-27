import test from 'node:test';
import assert from 'node:assert/strict';
import { ProjectDial, wrapIndex, wheelPixels } from '../dial.mjs';

function settle(dial, from=0, hz=60) {
  for(let now=from;now<from+2500;now+=1000/hz){
    dial.step(now);
    if(dial.mode==='idle')return now;
  }
  assert.fail('Dial did not settle within 2.5 seconds');
}

test('rapid trackpad events all contribute, including sub-card movement',()=>{
  const dial=new ProjectDial();
  for(let i=0;i<60;i++)dial.scroll(2/150,i*8);
  assert.ok(Math.abs(dial.target-.8)<1e-10);
  dial.step(480);
  assert.ok(dial.position>0&&dial.position<1);
  assert.equal(dial.mode,'input');
  settle(dial,480);
  assert.equal(dial.mode,'idle');
  assert.equal(dial.position,1);
});

test('tiny scrolls move continuously and can return to the same card',()=>{
  const dial=new ProjectDial();
  dial.scroll(.08,0);dial.step(16);
  assert.ok(dial.position>0&&dial.position<.08);
  assert.equal(dial.mode,'input');
  settle(dial,32);
  assert.equal(dial.position,0);
});

test('the spring settles with the same position at 60 and 120 Hz',()=>{
  const positions=[60,120].map(hz=>{
    const dial=new ProjectDial();
    dial.goTo(3,9);
    for(let now=0;now<=400;now+=1000/hz)dial.step(now);
    const intermediate=dial.position;
    settle(dial,420,hz);
    assert.equal(dial.position,3);
    return intermediate;
  });
  assert.ok(Math.abs(positions[0]-positions[1])<.025);
});

test('wraparound uses the short path across either end of the collection',()=>{
  const dial=new ProjectDial();
  dial.goTo(8,9);
  assert.equal(dial.target,-1);
  settle(dial);
  assert.equal(wrapIndex(dial.position,9),8);
  dial.goTo(0,9);
  assert.equal(dial.target,0);
  settle(dial);
  assert.equal(wrapIndex(dial.position,9),0);
});

test('reversing direction interrupts a snap without jumping',()=>{
  const dial=new ProjectDial();
  dial.goTo(3,9);dial.step(0);dial.step(30);
  const before=dial.position;
  dial.scroll(-.2,40);
  assert.equal(dial.position,before);
  assert.ok(dial.target<before);
  settle(dial,50);
  assert.ok(dial.position<3);
});

test('a released drag has a short glide but a held or cancelled drag has none',()=>{
  const glide=new ProjectDial();glide.beginDrag(0);glide.drag(.4,25);glide.release(30);
  assert.equal(glide.target,1);
  settle(glide,30);assert.equal(glide.position,1);
  for(const cancelled of [false,true]){
    const dial=new ProjectDial();dial.beginDrag(0);dial.drag(.4,25);dial.release(cancelled?30:200,cancelled);
    assert.equal(dial.velocity,0);assert.equal(dial.target,0);
  }
});

test('immediate navigation finishes without residual animation',()=>{
  const dial=new ProjectDial();dial.scroll(.8,0);dial.step(16);
  dial.goTo(2,9,true);
  assert.equal(dial.position,2);assert.equal(dial.velocity,0);assert.equal(dial.mode,'idle');
  assert.equal(dial.step(1000),false);
});

test('wheel pixel, line, page, and horizontal deltas are normalized',()=>{
  assert.equal(wheelPixels({deltaX:0,deltaY:60,deltaMode:0},500),60);
  assert.equal(wheelPixels({deltaX:0,deltaY:3,deltaMode:1},500),48);
  assert.equal(wheelPixels({deltaX:0,deltaY:-1,deltaMode:2},500),-500);
  assert.equal(wheelPixels({deltaX:50,deltaY:2,deltaMode:0},500),50);
});
