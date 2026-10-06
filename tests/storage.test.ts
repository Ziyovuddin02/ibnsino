import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getJSON, setJSON, listKeys, saveFile, getFile, claimLoginAttempt } from '../lib/storage.ts';
test('local persistence, binary uploads, and atomic login throttling',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'sino-test-'));process.env.STORAGE_BACKEND='local';process.env.LOCAL_DATA_DIR=folder;
 try{
  await setJSON('content','records/a',{count:42});assert.deepEqual(await getJSON('content','records/a'),{count:42});
  await setJSON('content','records/a',{count:32});assert.deepEqual(await getJSON('content','records/a'),{count:32});assert.deepEqual(await listKeys('content','records/'),['records/a']);assert.equal(await getJSON('content','missing'),null);
  const bytes=new Uint8Array([137,80,78,71,0]);await saveFile('photo.png',bytes.buffer,'image/png');const saved=await getFile('photo.png');assert.equal(saved?.contentType,'image/png');assert.deepEqual(new Uint8Array(saved!.data),bytes);
  const results=await Promise.all(Array.from({length:15},()=>claimLoginAttempt(900000)));assert.equal(results.filter(Boolean).length,10);assert.equal(await claimLoginAttempt(1200000),true);
 }finally{await rm(folder,{recursive:true,force:true});delete process.env.STORAGE_BACKEND;delete process.env.LOCAL_DATA_DIR;}
});
