import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { medallionGeometryProof } from './medallion-geometry.mjs';
import { checkMedallionLayers } from './check-medallion-layers.mjs';

/** Exercise actual controls against the explicitly fictional, nonpersistent demo.
 * No test hooks, DOM-forced visual states or owner data are used.
 */
export async function checkSanctuaryStates({ output, send, evaluate, until, click, viewport, screenshot }) {
  const geometry = medallionGeometryProof({evaluate,output});
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
  async function go(view) {await click('.app-rail [data-nav='+view+']');await until('document.activeElement.id==='+JSON.stringify(view==='chronicle'?'journal-title':'sanctuary-title'),'State test navigates to '+view);}
  async function cancelMatching(name, day) {
    await go('chronicle');
    await click(`.entry button[aria-label="Отменить: ${name}, ${day}"]`);
    await until(`![...document.querySelectorAll('.entry button')].some(button => button.getAttribute('aria-label') === ${JSON.stringify(`Отменить: ${name}, ${day}`)})`, `Cancellation refreshes ${name} on ${day}`);
    await go('sanctuary');
  }
  await send('Page.reload');
  await viewport(1440, 900);
  await until('!document.querySelector("#chronicle") && document.querySelectorAll(".relic-item").length === 6', 'State scenarios start with isolated synthetic history');
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
  await cancelMatching('Гитара', '2000-01-01');
  await expectSpheres(['mind'], 'Cancelling a multisphere snapshot removes only its remaining contributions');
  await cancelMatching('Чтение', '2000-01-01');
  await expectSpheres([], 'Cancelling the last selected-day record returns gems to subdued');

  // Empty the synthetic journal using actual cancellation controls.
  await go('chronicle');
  while (await evaluate('document.querySelectorAll(".entry").length > 0')) {
    const count = await evaluate('document.querySelectorAll(".entry").length');
    await click('.entry button');
    await until(`document.querySelectorAll('.entry').length === ${count - 1}`, 'Synthetic record cancellation refreshes current-period observations');
  }
  await go('sanctuary');
  await click('.date-shortcuts button:first-child');
  await expectSpheres([], 'No current history leaves all selected-day gems subdued');
  await until('document.querySelector(".sanctuary-rune").dataset.state === "dormant"', 'Zero seven-day coverage subdues the original monogram');
  await screenshot('state-subdued-desktop.png');
  await closeup('medallion-dormant.png');
  await geometry.capture('dormant');
  await checkMedallionLayers({output,evaluate,send,viewport,screenshot});
  await closeup('habit-gem-subdued.png', '[data-habit-id="demo-walk"] .relic-art');
  await viewport(390, 844);
  await screenshot('state-subdued-narrow.png');
  await viewport(1440, 900);
  await selectDay('2000-01-01');
  await log('walk');
  await expectSpheres(['body','recovery'], 'DORMANT preserves illuminated gemstones on a recorded historical selected date');
  await until('document.querySelector(".sanctuary-medallion").dataset.state === "dormant"', 'Historical logging does not awaken an empty current week');
  await closeup('medallion-dormant-historical-gems.png');
  await cancelMatching('Прогулка','2000-01-01');
  await selectDay(today);

  await log('walk');
  await expectSpheres(['body', 'recovery'], 'Two-sphere completion awakens the selected day');
  await until('document.querySelector(".sanctuary-rune").dataset.state === "awakening"', 'Limited current-period coverage softly illuminates the rune');
  await screenshot('state-partial-desktop.png');
  await closeup('medallion-awakening.png');
  await geometry.capture('awakening');
  await log('read');
  await until('document.querySelector(".sanctuary-rune").dataset.state === "awakening"', 'Three sphere-days remain AWAKENING rather than invented diversity tiers');
  await closeup('medallion-awakening-more-coverage.png');
  await log('connect');
  await log('work');
  await expectSpheres(['body', 'mind', 'relationships', 'work', 'recovery'], 'All five recorded spheres illuminate matching shrines and sockets');
  await until('document.querySelector(".sanctuary-rune").dataset.state === "harmony"', 'All five selected-day spheres give HARMONY, not full-week RADIANCE');
  await screenshot('state-all-five-desktop.png');
  await closeup('medallion-harmony.png');
  await geometry.capture('harmony');
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
  await click('[data-habit-id="demo-connect"] .restore-button');
  await until('!document.querySelector("[data-habit-id=demo-connect]")','Restored synthetic habit leaves archive without losing its history');
  await click('.inventory-heading .button-quiet');
  await selectDay('2000-01-01');
  await expectSpheres([], 'Date switching subdues sockets while current-period rune stays illuminated');
  assert.equal(await evaluate('document.querySelector(".sanctuary-rune").dataset.state'), 'awakening');
  assert.equal(await evaluate('document.querySelector(".balance-wheel").getAttribute("aria-label").includes("2000-01-01")'), true);
  await selectDay(today);
  await expectSpheres(['body', 'mind', 'relationships', 'work', 'recovery'], 'Returning to today restores its saved gemstone states');
  // Fill the six preceding local calendar dates through existing controls.
  const week = await evaluate(`(() => {const anchor=new Date(document.querySelector('input[type=date]').max+'T12:00:00');return Array.from({length:7},(_,index)=>{const day=new Date(anchor);day.setDate(day.getDate()-6+index);return [day.getFullYear(),String(day.getMonth()+1).padStart(2,'0'),String(day.getDate()).padStart(2,'0')].join('-');});})()`);
  for (const day of week.slice(0,-1)) {
    await selectDay(day);
    for (const habit of ['walk','read','connect','work']) await log(habit);
  }
  await selectDay(today);
  await until('document.querySelector(".sanctuary-medallion").dataset.state === "radiance" && document.querySelector(".sanctuary-medallion").dataset.sphereDays === "35"','Exactly 35 distinct sphere-days give RADIANCE');
  await expectSpheres(['body','mind','relationships','work','recovery'],'RADIANCE retains the five actual selected-day gemstone states');
  await screenshot('state-radiance-desktop.png');
  await closeup('medallion-radiance.png');
  await geometry.capture('radiance');
  await geometry.finish();
  await viewport(390,844);
  await screenshot('state-radiance-narrow.png');
  for (const [width,height] of [[1920,1080],[2560,1440]]) {
    await viewport(width,height);
    await until('document.documentElement.scrollWidth <= innerWidth', `Radiant layered medallion fits ${width}px`);
    await screenshot(`state-radiance-${width}x${height}.png`);
  }
  await viewport(1440,900);
  await selectDay('2000-01-01');
  await expectSpheres([],'RADIANCE never activates gemstones on an empty historical selected date');
  await until('document.querySelector(".sanctuary-medallion").dataset.state === "radiance"','Historical date selection never reanchors full current-week coverage');
  assert.equal(await evaluate('[...document.querySelectorAll(".wheel-gem")].every(node=>node.dataset.state === "subdued")'),true);
  await closeup('medallion-radiance-historical-empty.png');
  await selectDay(today);
  await cancelMatching('Работа над своим проектом',week[0]);
  await until('document.querySelector(".sanctuary-medallion").dataset.state === "harmony" && document.querySelector(".sanctuary-medallion").dataset.sphereDays === "34"','Backdated cancellation recomputes RADIANCE to HARMONY immediately');
  await selectDay(week[0]);
  await log('work');
  await selectDay(today);
  await until('document.querySelector(".sanctuary-medallion").dataset.state === "radiance"','Backdated re-addition restores RADIANCE without storing a visual state');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate('[...document.querySelectorAll(".sphere-gem, .sanctuary-rune")].every(node => getComputedStyle(node).animationName === "none")'), true);
  await writeFile(join(output, 'state-evidence.json'), JSON.stringify({ selectedDay: today, pastDay: '2000-01-01', nativeUiRuntimeVerified: false, source: 'Actual browser UI; synthetic in-memory data; all changes made through existing controls', screenshots: ['state-subdued-desktop.png','state-partial-desktop.png','state-all-five-desktop.png','state-all-five-390x844.png','medallion-dormant.png','medallion-awakening.png','medallion-harmony.png','medallion-radiance.png'] }, null, 2));
}
