import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { medallionAnchors, medallionReferenceAnchors } from '../src/ui/sanctuary/medallionLayers.ts';
import type { SphereId } from '../src/domain/activity.ts';

test('independent layer registration stays within 5/500 units of measured reference sign anchors', () => {
  for (const sphere of Object.keys(medallionReferenceAnchors) as SphereId[]) {
    const actual=medallionAnchors[sphere], reference=medallionReferenceAnchors[sphere];
    assert.ok(Math.hypot(actual.x-reference.x,actual.y-reference.y)<=5, `${sphere} registration drift`);
  }
});

test('the three shipped layer masters are distinct RGBA PNGs matching their provenance manifest', () => {
  const root=new URL('../public/art/medallion/v2/',import.meta.url);
  const manifest=JSON.parse(readFileSync(new URL('manifest.json',root),'utf8'));
  assert.deepEqual(manifest.assets.map((asset:{id:string})=>asset.id),['frame','rune','gem']);
  const hashes=new Set();
  for (const asset of manifest.assets) {
    const bytes=readFileSync(new URL(asset.file,root));
    const hash=createHash('sha256').update(bytes).digest('hex');
    assert.equal(hash,asset.sha256);
    assert.equal(bytes.length,asset.bytes);
    assert.equal(bytes.readUInt32BE(16),asset.width);
    assert.equal(bytes.readUInt32BE(20),asset.height);
    assert.equal(bytes[24],8);
    assert.equal(bytes[25],6,'RGBA channel required');
    hashes.add(hash);
  }
  assert.equal(hashes.size,3);
  assert.equal(manifest.referenceRuntime,false);
});
