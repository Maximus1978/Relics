import assert from 'node:assert/strict';
import test from 'node:test';
import { icons, materials, resolveMedal, surfaces } from '../src/ui/sigils/medalDesign.ts';

test('all six materials retain their stage and independent selected icon', () => {
  assert.equal(materials.length, 6);
  for (const material of materials) {
    assert.ok(surfaces[material].label);
    for (const stage of [1, 2, 3]) {
      for (const iconId of Object.keys(icons)) {
        assert.deepEqual(resolveMedal({ material, stage, iconId, resonance: .5 }), {
          material, stage, iconId, resonance: .5,
        });
      }
    }
  }
});

test('invalid presentation props fall back and finite illumination is clamped', () => {
  for (const value of ['__proto__', 'constructor', '', null, undefined]) {
    assert.deepEqual(resolveMedal({ material: value, stage: value, iconId: value, resonance: value }), {
      material: 'stone', stage: 1, iconId: 'sigil', resonance: 0,
    });
  }
  assert.equal(resolveMedal({ resonance: NaN }).resonance, 0);
  assert.equal(resolveMedal({ resonance: Infinity }).resonance, 0);
  assert.equal(resolveMedal({ resonance: -1 }).resonance, 0);
  assert.equal(resolveMedal({ resonance: 2 }).resonance, 1);
});
