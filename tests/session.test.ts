import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createSession, validSession, passwordMatches, configured, SESSION_SECONDS } from '../lib/session.ts';
test('sessions expire, reject tampering and are revoked when the admin password changes',()=>{
 process.env.ADMIN_PASSWORD=randomBytes(24).toString('hex');process.env.SESSION_SECRET=randomBytes(32).toString('hex');
 assert.equal(configured(),true);assert.equal(passwordMatches(process.env.ADMIN_PASSWORD),true);assert.equal(passwordMatches('wrong'),false);
 const now=Date.now(),token=createSession(now);assert.equal(validSession(token,now),true);assert.equal(validSession(token,now+SESSION_SECONDS*1000),false);
 const [payload,signature]=token.split('.');assert.equal(validSession(payload+'.'+(signature[0]==='a'?'b':'a')+signature.slice(1),now),false);
 process.env.ADMIN_PASSWORD=randomBytes(24).toString('hex');assert.equal(validSession(token,now),false);
 delete process.env.SESSION_SECRET;assert.equal(validSession(token,now),false);assert.equal(configured(),false);
});
