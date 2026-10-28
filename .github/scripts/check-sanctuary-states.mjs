import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Exercise actual controls against the explicitly fictional, nonpersistent demo.
 * No test hooks, DOM-forced visual states or owner data are used.
 */
export async function checkSanctuaryStates({ output, send, evaluate, until, click, viewport, screenshot }) {
  const active = selector => `[...document.querySelectorAll(${JSON.stringify(selector)})].filter(node => node.dataset.state === 'illuminated').map(node => node.dataset.sphere).sort()`;
  const shrines = '.sphere-shrine';
  const sockets = '.wheel-gem';
  async function expectSpheres(expected, description) {
    const sorted = [...expected].sort();
    await until(`${active(shrines)}.join(',') === ${JSON.stringify(sorted.join(','))}`, description);
    assert.deepEqual(await evaluate(active(sockets)), sorted, 'Central gemstones match selected-day shrines');
  }
  async function selectDay(day) {
    await evaluate(`(() => { const input = document.querySelector('input[type=date]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(day)}); input.dispatchEvent(new Event('input', {bubbles:true})); input.dispatchEvent(new Event('change', {bubbles:true})); })()`);
    await until(`document.querySelector('.observation-period').textContent.includes(${JSON.stringify(day)})`, `Selected-date state acknowledges ${day}`);
  }
  async function closeup(name, selector = '.balance-wheel') {
    await evaluate('window.scrollTo(0,0)');
    const bounds = await evaluate(`document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect().toJSON()`);
    const captured = await send('Page.captureScreenshot', { format: 'png', clip: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height, scale: 3 }, captureBeyondViewport: true });
    await writeFile(join(output, name), Buffer.from(captured.data, 'base64'));
  }
  async function log(id) {
    await click(`[data-habit-id="demo-${id}"] .completion-button`);
    await until(`document.querySelector('[data-habit-id="demo-${id}"]')?.dataset.state === 'illuminated' && !document.querySelector('.save-status').textContent.includes('Сохраняем')`, `Saved ${id} awakens its ordinary relic`);
  }
  async function cancelMatching(name, day) {
    await click(`.entry button[aria-label="Отменить: ${name}, ${day}"]`);
    await until(`![...document.querySelectorAll('.entry button')].some(button => button.getAttribute('aria-label') === ${JSON.stringify(`Отменить: ${name}, ${day}`)})`, `Cancellation refreshes ${name} on ${day}`);
  }
  await send('Page.reload');
  await viewport(1440, 900);
  await until('document.querySelectorAll(".entry").length === 2 && document.querySelectorAll(".relic-item").length === 6', 'State scenarios start with isolated synthetic history');
  const today = await evaluate('document.querySelector("input[type=date]").value');
  const observation = await evaluate('[...document.querySelectorAll(".recorded-ring")].map(node => node.getAttribute("aria-label"))');
  await expectSpheres(['body', 'recovery'], 'Today illuminates only its saved snapshot spheres');
  await screenshot('state-partial-selected-day.png');
  await closeup('rune-diverse-selected-partial.png');

  await selectDay('2000-01-01');
  await expectSpheres([], 'Unrecorded past day subdues every gemstone without disabling habits');
  assert.equal(await evaluate('[...document.querySelectorAll(".completion-button")].every(button => !button.disabled)'), true);
  assert.deepEqual(await evaluate('[...document.querySelectorAll(".recorded-ring")].map(node => node.getAttribute("aria-label"))'), observation);
  assert.equal(await evaluate('document.querySelector(".sanctuary-rune").dataset.represented'), '3');
  await screenshot('state-empty-selected-day-recent-diverse.png');
  await log('read');
  await expectSpheres(['mind'], 'Single-sphere backdated completion illuminates one gem');
  await log('guitar');
  await expectSpheres(['mind', 'recovery'], 'Multisphere backdated completion illuminates all snapshot spheres');
  assert.deepEqual(await evaluate('[...document.querySelectorAll(".recorded-ring")].map(node => node.getAttribute("aria-label"))'), observation);

  // Changing a definition must not recolor previously recorded sphere snapshots.
  await click('[data-habit-id="demo-guitar"] .habit-actions summary');
  await click('[data-habit-id="demo-guitar"] .habit-action-options button:first-child');
  await until('document.querySelector("#habit-name")?.value === "Гитара"', 'State test opens the real habit editor');
  await click('.creation-form input[value="mind"]');
  await click('.creation-form input[value="recovery"]');
  await click('.creation-form input[value="body"]');
  await click('.creation-form button[type="submit"]');
  await until('!document.querySelector(".creation-form") && document.querySelector("[data-habit-id=demo-guitar]")?.dataset.sphere === "body"', 'Definition changes future identity, not historical contributions');
  await expectSpheres(['mind', 'recovery'], 'Edited definitions leave saved sphere illumination unchanged');
  await click('.chronicle > summary');
  await cancelMatching('Гитара', '2000-01-01');
  await expectSpheres(['mind'], 'Cancelling a multisphere snapshot removes only its remaining contributions');
  await cancelMatching('Чтение', '2000-01-01');
  await expectSpheres([], 'Cancelling the last selected-day record returns gems to subdued');

  // Empty the synthetic journal using actual cancellation controls.
  while (await evaluate('document.querySelectorAll(".entry").length > 0')) {
    const count = await evaluate('document.querySelectorAll(".entry").length');
    await click('.entry button');
    await until(`document.querySelectorAll('.entry').length === ${count - 1}`, 'Synthetic record cancellation refreshes current-period observations');
  }
  await click('.date-shortcuts button:first-child');
  await expectSpheres([], 'No current history leaves all selected-day gems subdued');
  await until('document.querySelector(".sanctuary-rune").dataset.state === "subdued"', 'Zero seven-day coverage subdues the original monogram');
  await click('.chronicle > summary');
  await screenshot('state-subdued-desktop.png');
  await closeup('rune-subdued.png');
  await closeup('habit-gem-subdued.png', '[data-habit-id="demo-walk"] .relic-art');
  await viewport(390, 844);
  await screenshot('state-subdued-narrow.png');
  await viewport(1440, 900);

  await log('walk');
  await expectSpheres(['body', 'recovery'], 'Two-sphere completion awakens the selected day');
  await until('document.querySelector(".sanctuary-rune").dataset.state === "partial"', 'Limited current-period coverage softly illuminates the rune');
  await screenshot('state-partial-desktop.png');
  await closeup('rune-partial.png');
  await log('read');
  await until('document.querySelector(".sanctuary-rune").dataset.state === "diverse"', 'Three represented spheres give the monogram a restrained richer light');
  await closeup('rune-diverse.png');
  await log('connect');
  await log('work');
  await expectSpheres(['body', 'mind', 'relationships', 'work', 'recovery'], 'All five recorded spheres illuminate matching shrines and sockets');
  await until('document.querySelector(".sanctuary-rune").dataset.state === "full"', 'All-sphere seven-day coverage illuminates the authored seal without rewards');
  await screenshot('state-all-five-desktop.png');
  await closeup('rune-all-five.png');
  await closeup('habit-gem-illuminated.png', '[data-habit-id="demo-walk"] .relic-art');
  for (const [width, height] of [[1280,800],[1000,800],[390,844],[320,844]]) {
    await viewport(width,height);
    await until('document.documentElement.scrollWidth <= innerWidth', `All-sphere state fits ${width}px`);
    await screenshot(`state-all-five-${width}x${height}.png`);
    if (width === 390) {
      await evaluate('document.querySelector(".relic-inventory").scrollIntoView({block:"start",behavior:"instant"})');
      const captured = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await writeFile(join(output, 'state-all-five-inventory-390x844.png'), Buffer.from(captured.data, 'base64'));
    }
  }
  await viewport(1440,900);
  await click('[data-habit-id="demo-connect"] .habit-actions summary');
  await click('[data-habit-id="demo-connect"] .habit-action-options button:nth-child(2)');
  await until('!!document.querySelector(".archive-confirmation")', 'Archive confirmation opens in state scenario');
  await click('.archive-confirmation .form-actions button:last-child');
  await until('!document.querySelector("[data-habit-id=demo-connect]")', 'Archived habit is removed from active cards');
  await expectSpheres(['body', 'mind', 'relationships', 'work', 'recovery'], 'Archived historical snapshots still illuminate every recorded sphere');
  await click('.inventory-heading .button-quiet');
  await until('document.querySelector("[data-habit-id=demo-connect] .relic-art")?.dataset.state === "illuminated" && !document.querySelector(".completion-button")', 'Archive retains its selected-day historical gem without allowing logging');
  await click('.inventory-heading .button-quiet');
  await selectDay('2000-01-01');
  await expectSpheres([], 'Date switching subdues sockets while current-period rune stays illuminated');
  assert.equal(await evaluate('document.querySelector(".sanctuary-rune").dataset.state'), 'full');
  assert.equal(await evaluate('document.querySelector(".balance-wheel").getAttribute("aria-label").includes("2000-01-01")'), true);
  await selectDay(today);
  await expectSpheres(['body', 'mind', 'relationships', 'work', 'recovery'], 'Returning to today restores its saved gemstone states');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate('[...document.querySelectorAll(".sphere-gem, .sanctuary-rune")].every(node => getComputedStyle(node).animationName === "none")'), true);
  await writeFile(join(output, 'state-evidence.json'), JSON.stringify({ selectedDay: today, pastDay: '2000-01-01', nativeUiRuntimeVerified: false, source: 'Actual browser UI; synthetic in-memory data; all changes made through existing controls', screenshots: ['state-subdued-desktop.png','state-partial-desktop.png','state-all-five-desktop.png','state-all-five-390x844.png','rune-subdued.png','rune-partial.png','rune-diverse.png','rune-all-five.png'] }, null, 2));
}
