import { checkContributionEditor } from './check-contribution-editor.mjs';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { checkSanctuaryStates } from './check-sanctuary-states.mjs';

const output = process.argv[2];
if (!output) throw new Error('Browser evidence output directory is required.');
const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const target = targets.find(target => target.type === 'page');
if (!target) throw new Error('Edge debugging page is unavailable.');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let identifier = 0;
const pending = new Map();
const runtimeErrors = [];
const checks = [];
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.text);
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id); clearTimeout(request.timeout);
  if (message.error) request.reject(new Error(JSON.stringify(message.error)));
  else request.resolve(message.result);
});
function send(method, params = {}) {
  const id = ++identifier;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(id, { resolve, reject, timeout }); socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error((response.exceptionDetails.exception?.description ?? response.exceptionDetails.text).slice(0,1600));
  return response.result.value;
}
async function until(expression, description) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) { checks.push(description); return; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Browser check failed: ${description}`);
}
async function press(key, code, virtualKey) {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: virtualKey, ...(key === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: virtualKey });
}
async function click(selector) {
  const point = await evaluate(`(() => { const element = document.querySelector(${JSON.stringify(selector)}); if (!element) throw Error('Missing control'); element.scrollIntoView({block:'center'}); const bounds = element.getBoundingClientRect(); return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }; })()`);
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
}
async function viewport(width, height = 1000) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
}
async function screenshot(name) {
  await evaluate('window.scrollTo(0, 0)');
  const captured = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(join(output, name), Buffer.from(captured.data, 'base64'));
}
const card = '[data-habit-id="demo-guitar"]';
try {
  await send('Page.enable'); await send('Runtime.enable');
  await viewport(1440, 900);
  await send('Page.navigate', { url: 'http://127.0.0.1:1420' });
  await until('document.querySelectorAll(".relic-item").length === 6', 'Six explicitly synthetic preview habits render');
  await until('[...document.images].every(image => image.complete && image.naturalWidth > 0)', 'Local decorative artwork loads successfully');
  await until('document.querySelectorAll(".sanctuary-scene").length === 1 && document.querySelector(".sanctuary-scene").naturalWidth >= 1500 && new URL(document.querySelector(".sanctuary-scene").src).origin === location.origin', 'One high-resolution environment is bundled locally');
  await until('document.querySelector(".preview-notice").textContent.includes("не сохраняются")', 'Preview storage limitation is visible');
  assert.equal(await evaluate('document.querySelectorAll(".sphere-shrine").length'), 5);
  const wideMedallions=[];
  for (const [width, height] of [[1440,900],[1280,800],[1000,800],[1920,1080],[2560,1440],[390,844],[320,844]]) {
    await viewport(width,height);
    await until('document.documentElement.scrollWidth <= innerWidth', `No horizontal overflow at ${width}x${height}`);
    await until('document.querySelector(".observation-period").getBoundingClientRect().top >= document.querySelector(".balance-caption").getBoundingClientRect().bottom', `Timeframe labels remain below the central panel at ${width}px`);
    await until('[...document.querySelectorAll(".sphere-shrine")].every(shrine => { const name = shrine.querySelector("h2").getBoundingClientRect(); const count = shrine.querySelector(".recorded-ring").getBoundingClientRect(); return name.bottom <= count.top + 1 || name.right <= count.left + 1 || count.right <= name.left + 1; })', `Sphere names and recorded-day counts remain separate at ${width}px`);
    if (width >= 1000) {
      if (width === 1440) assert.ok(await evaluate('document.querySelector(".chronicle > summary").getBoundingClientRect().bottom <= innerHeight'), 'Complete Chronicle summary visible at 1440x900');
      assert.ok(await evaluate('document.querySelector(".relic-item").getBoundingClientRect().bottom <= innerHeight'), `Complete first inventory row visible at ${width}x${height}`);
      assert.ok(await evaluate('document.querySelector(".balance-wheel").getBoundingClientRect().width >= 210'), 'Prominent central wheel');
      if (width>=1920) {
        const size=await evaluate('(()=>{const wheel=document.querySelector(".balance-wheel").getBoundingClientRect();const track=document.querySelector(".balance-center").getBoundingClientRect();return {wheel:wheel.width,track:track.width};})()');
        assert.ok(size.wheel>=size.track*.95,'Medallion fills the available central track on wide desktop');
        assert.ok(size.wheel>=(width===1920?400:560),'Wide-screen medallion grows beyond the old 270px cap');
        wideMedallions.push({viewport:width,...size});
      }
      const arrangement = await evaluate('(() => { const center = document.querySelector(".balance-center").getBoundingClientRect(); const shrines = [...document.querySelectorAll(".sphere-shrine")].map(element=>element.getBoundingClientRect()); return {left:shrines.filter(bounds=>bounds.right<=center.left+2).length,right:shrines.filter(bounds=>bounds.left>=center.right-2).length}; })()');
      assert.deepEqual(arrangement, {left:2,right:3});
      if (width >= 1280) assert.equal(await evaluate('document.querySelector(".app-rail").getBoundingClientRect().width'),180);
      else assert.equal(await evaluate('document.querySelector(".app-rail").getBoundingClientRect().width'),76);
    }
    if (width < 760) assert.equal(await evaluate('document.querySelector(".world-backdrop").getBoundingClientRect().left'),0);
    await screenshot(`sanctuary-${width}x${height}.png`);
  }
  assert.ok(wideMedallions[1].wheel>wideMedallions[0].wheel,'Medallion continues growing from 1920 to 2560');
  await writeFile(join(output,'wide-medallion-layout.json'),JSON.stringify(wideMedallions,null,2));
  checks.push('Five shrine installation, central circle, rail and inventory composition verified at target viewports');
  await writeFile(join(output, 'rendered-dom.html'), await evaluate('document.documentElement.outerHTML'));
  await viewport(1440, 900);

  await evaluate('document.activeElement.blur(); window.scrollTo(0, 0)');
  await press('Tab', 'Tab', 9);
  await until('document.activeElement.matches(".skip-link")', 'Tab reaches skip link');
  await press('Enter', 'Enter', 13);
  await until('document.activeElement.id === "habits-title"', 'Keyboard skip link reaches habits');

  await click('.inventory-heading .button-primary');
  await until('document.activeElement.id === "habit-name"', 'Creation form receives keyboard focus');
  await screenshot('sanctuary-create.png');
  await click('.creation-form button[type="submit"]');
  await until('document.querySelector("#habit-validation-error") && document.activeElement.id === "habit-name"', 'Empty-name validation retains focus');
  await send('Input.insertText', { text: 'Проверка интерфейса' });
  await click('.creation-form button[type="submit"]');
  await until('document.querySelector("#habit-validation-error") && document.activeElement.type === "checkbox"', 'Empty-sphere validation focuses selection');
  await screenshot('sanctuary-validation.png');
  await press('Escape', 'Escape', 27);
  await until('!document.querySelector(".creation-form") && document.activeElement.matches(".inventory-heading .button-primary")', 'Escape cancels and returns focus');

  await click(`${card} .completion-button`);
  await until('document.querySelector("[data-habit-id=demo-guitar] .completion-button").disabled && document.querySelector("[data-habit-id=demo-guitar] .completion-button").textContent.includes("Отмечено")', 'One-click completion has unambiguous disabled saved state');
  await click('.date-shortcuts button:nth-child(2)');
  await until('document.querySelector(".date-shortcuts button:nth-child(2)").getAttribute("aria-pressed") === "true" && !document.querySelector("[data-habit-id=demo-guitar] .completion-button").disabled', 'Yesterday selects its own completion state');
  await click(`${card} .completion-button`);
  await until('document.querySelector("[data-habit-id=demo-guitar] .completion-button").disabled && document.querySelector("[data-habit-id=demo-guitar] .completion-button").textContent.includes("Отмечено")', 'Backdated completion works in the in-memory preview');
  await click('.date-shortcuts button:first-child');
  await until('document.querySelector(".date-shortcuts button:first-child").getAttribute("aria-pressed") === "true"', 'Today shortcut restores selected day');

  await click(`${card} .habit-actions summary`);
  await screenshot('sanctuary-actions.png');
  await press('Tab', 'Tab', 9);
  await until('document.activeElement.textContent === "Изменить"', 'Context actions are reachable by keyboard');
  await press('Enter', 'Enter', 13);
  await until('document.querySelector("#habit-name")?.value === "Гитара"', 'Editing reuses the existing definition');
  await screenshot('sanctuary-edit.png');
  await evaluate('document.querySelector("#habit-name").select()');
  await send('Input.insertText', { text: 'Гитара у окна' });
  await click('.creation-form button[type="submit"]');
  await until('!document.querySelector(".creation-form") && document.querySelector("[data-habit-id=demo-guitar] h4").textContent === "Гитара у окна"', 'Edited definition renders');
  await click('.chronicle > summary');
  await until('document.querySelector(".chronicle").open && [...document.querySelectorAll(".entry h3")].filter(title => title.textContent === "Гитара").length === 2', 'Expandable journal preserves historical name snapshots');
  await screenshot('sanctuary-journal.png');

  await click(`${card} .habit-actions summary`);
  await click(`${card} .habit-action-options button:nth-child(2)`);
  await until('document.querySelector(".archive-confirmation")?.textContent.includes("сохранятся") && document.activeElement.textContent === "Отмена"', 'Archive confirmation explains preserved history and focuses Cancel');
  await press('Escape', 'Escape', 27);
  await until('!document.querySelector(".archive-confirmation")', 'Archive confirmation cancels with Escape');
  await click(`${card} .habit-actions summary`);
  await click(`${card} .habit-action-options button:nth-child(2)`);
  await screenshot('sanctuary-archive-confirm.png');
  await click('.archive-confirmation .form-actions button:last-child');
  await until('!document.querySelector("[data-habit-id=demo-guitar]")', 'Archive hides the active card');
  await click('.inventory-heading .button-quiet');
  await until('document.querySelectorAll(".relic-item").length === 1 && !document.querySelector(".completion-button")', 'Archive management omits completion controls');
  await screenshot('sanctuary-archived.png');
  await click(`${card} .habit-actions summary`);
  await click(`${card} .habit-action-options button:nth-child(2)`);
  await until('!document.querySelector("[data-habit-id=demo-guitar]")', 'Restore removes the card from the archive');
  await click('.inventory-heading .button-quiet');
  await until('document.querySelector("[data-habit-id=demo-guitar] h4")?.textContent === "Гитара у окна"', 'Restore retains edited definition');
  const entryCount = await evaluate('document.querySelectorAll(".entry").length');
  await click('.entry button');
  await until(`document.querySelectorAll('.entry').length === ${entryCount - 1}`, 'Existing journal cancellation remains accessible');

  await send('Page.reload');
  await until('document.querySelector("[data-habit-id=demo-guitar] h4")?.textContent === "Гитара"', 'Preview reload discards changes');
  for (const width of [320, 390, 768, 1000, 1280]) {
    await viewport(width);
    await until('document.documentElement.scrollWidth <= window.innerWidth', `No horizontal overflow at ${width}px`);
    const dimensions = await evaluate(`(() => { const targets = [...document.querySelectorAll('button, input[type=date], .habit-actions summary, .chronicle > summary')].filter(element => element.getClientRects().length); return targets.every(element => element.getBoundingClientRect().height >= 44); })()`);
    assert.ok(dimensions, `44px action targets at ${width}px`);
    if (width === 390) await screenshot('sanctuary-mobile.png');
  }
  checks.push('Visible controls retain 44px target height across responsive widths');
  await viewport(640);
  await evaluate('document.documentElement.style.fontSize = "200%"');
  await until('document.documentElement.scrollWidth <= window.innerWidth', 'Text enlargement has no horizontal overflow');
  await evaluate('document.documentElement.style.fontSize = ""');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate('getComputedStyle(document.documentElement).scrollBehavior'), 'auto');
  checks.push('Reduced motion removes smooth scrolling');
  await viewport(1280, 1100);
  await click('.app-rail button[data-backup]');
  await until('document.querySelector(".backup-unavailable")?.textContent.includes("Windows") && ![...document.querySelectorAll(".backup-dialog button")].some(button => button.textContent === "Создать копию")', 'Browser backup utility clearly unavailable; no fake file actions');
  await screenshot('sanctuary-backup-unavailable.png');
  await press('Escape', 'Escape', 27);
  await until('!document.querySelector(".backup-dialog") && document.activeElement.matches(".app-rail button[data-backup]")', 'Backup dialog closes and restores keyboard focus');
  await checkContributionEditor({send,evaluate,until,click,viewport,screenshot});
  await checkSanctuaryStates({ output, send, evaluate, until, click, viewport, screenshot });
  assert.deepEqual(runtimeErrors, []);
  await writeFile(join(output, 'result.json'), JSON.stringify({ browserRendering: 'passed', interactionChecks: checks, runtimeErrors, nativeUiRuntimeVerified: false, storage: 'Synthetic in-memory demonstration; resets on reload' }, null, 2));
  console.log(`Sanctuary browser verification passed: ${checks.length} checks. Native runtime remains unverified.`);
} catch (failure) {
  await screenshot('failure.png').catch(() => {});
  await writeFile(join(output, 'failure-dom.html'), await evaluate('document.documentElement.outerHTML')).catch(() => {});
  await writeFile(join(output, 'failure.json'), JSON.stringify({ message: failure.message, checks, runtimeErrors, focus: await evaluate('document.activeElement.outerHTML'), layout: await evaluate('Object.fromEntries([".world-installation", ".balance-center", ".relic-inventory", ".relic-item", ".chronicle > summary"].map(selector => [selector, document.querySelector(selector)?.getBoundingClientRect().toJSON()]))') }, null, 2)).catch(() => {});
  throw failure;
} finally { socket.close(); }
