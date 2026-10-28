import test from 'node:test';
import assert from 'node:assert/strict';
import {bookingEventName} from '../../src/js/booking.js';
test('audit keeps request_audit_click across renamed and legacy buttons',()=>{for(const name of ['The Systems Audit','Growth Systems Audit'])assert.equal(bookingEventName({offerName:name}),'request_audit_click');assert.equal(bookingEventName({offerKey:'diagnostic',offerName:'Future label'}),'request_audit_click');});
test('implementation packages and generic booking retain fit-call event',()=>{for(const name of ['The Growth System Fix','The Growth OS Partnership',''])assert.equal(bookingEventName({offerName:name}),'book_fit_call_click');});
