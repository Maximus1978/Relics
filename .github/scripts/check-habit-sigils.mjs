import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildSigilReview } from './build-sigil-review.mjs';

export async function checkHabitSigils({ send, evaluate, until, viewport, click, press, output }) {
  async function capture(name, selector) {
    const clip = await evaluate(`(() => {
      const rect = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
      return { x: 0, y: Math.max(0, rect.top + scrollY - 5),
        width: innerWidth, height: Math.ceil(rect.height + 10), scale: 1 };
    })()`);
    const image = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip });
    await writeFile(join(output, name + '.png'), Buffer.from(image.data, 'base64'));
  }

  await viewport(1440, 1050);
  await send('Page.navigate', { url: 'http://127.0.0.1:1420/sigils.html' });
  await until('document.querySelectorAll("#craft .habit-medal").length === 18', 'Showcase renders six materials by three stages');
  const geometry = await evaluate(`[...document.querySelectorAll('#craft .habit-medal')].map(svg => {
    const slot = svg.querySelector('[data-layer=icon]');
    const center = new DOMPoint(24, 24).matrixTransform(slot.getScreenCTM());
    const bounds = svg.getBoundingClientRect();
    return {
      material: svg.dataset.material, stage: svg.dataset.stage, viewBox: svg.getAttribute('viewBox'),
      slot: ['x','y','width','height','viewBox'].map(key => slot.getAttribute(key)),
      craft: [...svg.querySelectorAll('[data-layer=craft] path, [data-layer=craft] circle')].map(shape =>
        ['d','cx','cy','r'].map(key => shape.getAttribute(key)).join(',')).join('|'),
      centered: Math.abs(center.x - bounds.x - bounds.width / 2) < 0.5
        && Math.abs(center.y - bounds.y - bounds.height / 2) < 0.5,
      size: Math.round(svg.getBoundingClientRect().width),
      title: document.getElementById(svg.getAttribute('aria-labelledby')).textContent,
    };
  })`);
  assert.equal(new Set(geometry.map(item => item.material + item.stage)).size, 18);
  assert.equal(new Set(geometry.map(item => item.craft)).size, 18);
  assert.equal(new Set(geometry.map(item => item.size)).size, 1);
  assert.ok(geometry.every(item => item.title && item.centered && item.viewBox === '0 0 200 200'));
  assert.ok(geometry.every(item => item.slot.join('|') === '64|64|72|72|0 0 48 48'));
  await capture('sigils-18-material-stages', '#craft');
  await click('.registration-toggle:not(.scale-toggle) input');
  await until('document.querySelectorAll(".registration-overlay").length === 18', 'Alignment overlay exposes every registered slot');
  await capture('sigils-alignment', '#craft');
  await click('.registration-toggle:not(.scale-toggle) input');
  await click('.scale-toggle input');
  await until('[...document.querySelectorAll("#craft .habit-medal")].every(medal => medal.getBoundingClientRect().width === 94)', 'All 18 stages can be inspected at 94px inventory scale');
  await capture('sigils-18-compact', '#craft');
  await click('.scale-toggle input');

  const ornaments = await evaluate(`[...document.querySelectorAll('.switch-example svg.habit-medal')].map(svg => svg.querySelector('[data-layer=craft]').innerHTML)`);
  for (const icon of ['book', 'music', 'bicycle', 'sigil']) {
    await click('.icon-option:has(input[value="' + icon + '"])');
    await until(`[...document.querySelectorAll('.switch-example .habit-medal')].every(medal => medal.dataset.icon === '${icon}')`, 'Live ' + icon + ' swap updates four materials');
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('.switch-example svg.habit-medal')].map(svg => svg.querySelector('[data-layer=craft]').innerHTML)`), ornaments);
    await capture('sigils-icons-' + icon, '#icons');
  }

  const states = await evaluate(`[...document.querySelectorAll('#states .sample-card')].map(card => {
    const medal = card.querySelector('.habit-medal');
    return [card.dataset.completed, medal.dataset.material, medal.dataset.resonance,
      !!card.querySelector('.completion-mark'), getComputedStyle(medal).filter];
  })`);
  assert.deepEqual(states.map(([complete, material, light, mark]) => [complete, material, light, mark]), [
    ['false', 'gold', '0', false], ['false', 'gold', '0', false], ['true', 'gold', '0', true],
    ['true', 'gold', '0', true], ['true', 'gold', '0.5', true], ['true', 'gold', '1', true],
  ]);
  assert.ok(states.every(state => !state[4].includes('grayscale')));
  await capture('sigils-completion-resonance', '#states');

  await evaluate('document.querySelector("#compact").scrollIntoView({block:"center"}); document.querySelector("#compact .sample-card:nth-child(2)").focus()');
  await press('Tab', 'Tab', 9);
  const point = await evaluate(`(() => {
    const box = document.querySelector('#compact .sample-card:first-child').getBoundingClientRect();
    return {x: box.left + box.width / 2, y: box.top + box.height / 2};
  })()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
  await until(`document.querySelector('#compact .sample-card:nth-child(3)').matches(':focus-visible')
    && document.querySelector('#compact .sample-card:first-child').matches(':hover')`, 'Keyboard focus and pointer hover remain independent');
  assert.equal(await evaluate('document.querySelectorAll("#compact .completion-mark").length'), 0);
  assert.notEqual(await evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'none');
  await capture('sigils-hover-focus', '#compact');

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".sample-card")).transitionDuration'), '0s');
  for (const width of [320, 390, 768]) {
    await viewport(width, 900);
    await until('document.documentElement.scrollWidth <= window.innerWidth', 'Sigils fit at ' + width + 'px');
  }
  await viewport(390, 900);
  await capture('sigils-mobile-materials', '#craft');
  await capture('sigils-mobile-icons', '#icons');

  const localReview = await buildSigilReview(output);
  await send('Page.navigate', { url: pathToFileURL(localReview).href });
  await until('location.protocol === "file:" && document.querySelectorAll("#craft .habit-medal").length === 18', 'Portable review opens directly from disk');
  assert.equal(await evaluate('performance.getEntriesByType("resource").length'), 0);
  await click('.icon-option:has(input[value="book"])');
  await until(`[...document.querySelectorAll('.switch-example .habit-medal')].every(medal => medal.dataset.icon === 'book')`, 'Portable review switches icons without fetching resources');
  await writeFile(join(output, 'sigils-registration.json'), JSON.stringify({
    fixture: 'synthetic', nativeUiRuntimeVerified: false, portableOfflineReview: true,
    geometry: geometry.map(({ craft, ...item }) => item), states,
  }, null, 2));
}
