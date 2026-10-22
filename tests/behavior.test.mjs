import test from 'node:test';
import assert from 'node:assert/strict';
import {scrollMilestones} from '../production/js/behavior.js';
test('scroll milestones require scrolling and a scrollable page',()=>{assert.deepEqual(scrollMilestones(0,800,2000,new Set()),[]);assert.deepEqual(scrollMilestones(1,800,800,new Set()),[]);});
test('scroll jumps emit crossed milestones once and respect expanded document height',()=>{const sent=new Set();const first=scrollMilestones(700,800,2000,sent);assert.deepEqual(first,[25,50,75]);first.forEach(n=>sent.add(n));assert.deepEqual(scrollMilestones(700,800,2000,sent),[]);assert.deepEqual(scrollMilestones(700,800,4000,sent),[]);assert.deepEqual(scrollMilestones(1200,800,2000,sent),[90]);});
