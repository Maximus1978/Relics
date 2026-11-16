import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { createHabitMutationDriver } from './habit-sql-test-driver.mjs';

export function shiftDay(day, offset) {
  const date = new Date(day + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function seedMasteryHabit(db, monday, { id, name, icon = 'book', cycles, age = 7, archived = false }) {
  const spheres = '["mind"]';
  const profile = '{"version":1,"origin":"user","values":{"body":0,"mind":5,"relationships":0,"work":0,"recovery":0}}';
  db.prepare('INSERT INTO habits (id,name,spheres_json,archived_at,contribution_profile_json,icon_id) VALUES (?,?,?,?,?,?)')
    .run(id, name, spheres, archived ? monday + 'T12:00:00Z' : null, profile, icon);
  const start = cycles ? shiftDay(monday, -(cycles - 1) * 7 - age) : monday;
  if (cycles !== null) {
    db.prepare('INSERT INTO habit_frequency_segments VALUES (?,?,?,?,?,1)').run(id + '-weekly', id, 'weekly', start, start);
  }
  if (archived) {
    db.prepare("INSERT INTO habit_archive_pauses VALUES (?,?,?,NULL,'archive','recorded')").run(id + '-pause', id, monday);
  }
  const insert = db.prepare('INSERT INTO activities VALUES (?,?,?,?,?,?,?,?)');
  for (let cycle = 0; cycle < (cycles ?? 1); cycle++) {
    const date = cycles === null ? shiftDay(monday, -28) : shiftDay(start, cycle * 7);
    insert.run(id + '-' + date, id, name, spheres, date, date + 'T12:00:00Z', 'Etc/UTC', profile);
  }
  return { spheres, profile, start };
}

export async function checkMastery({ send, evaluate, until, click, viewport, screenshot, bindIpc }) {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys=ON');
  for (const name of ['001_initial.sql','002_archive_habits.sql','003_seed_once.sql','004_habit_contributions.sql','005_habit_rhythm.sql','006_habit_icons.sql']) {
    db.exec(readFileSync(new URL('../../src-tauri/migrations/' + name, import.meta.url), 'utf8'));
  }
  const clear = () => db.exec('DELETE FROM habit_archive_pauses; DELETE FROM habit_frequency_segments; DELETE FROM activities; DELETE FROM habits');
  clear();
  const monday = '2026-11-09';
  let localToday = monday;
  const tiers = ['stone','copper','bronze','silver','gold','platinum'];
  const names = ['Прогулка','Чтение','Велосипед','Гитара','Проект','Медитация'];
  const icons = ['walk','book','bicycle','music','work','meditation'];
  const cyclesByPhase = [[0,3,9,18,36,72],[1,5,12,24,48,84],[2,7,15,30,60,96]];
  for (const [phase, cycles] of cyclesByPhase.entries()) {
    for (const [tier, count] of cycles.entries()) {
      seedMasteryHabit(db, monday, {
        id: tiers[tier] + '-' + (phase + 1), name: names[tier] + (phase ? ' ' + (phase + 1) : ''),
        icon: icons[tier], cycles: count, age: tier === 2 ? 14 : tier === 3 || tier === 5 ? 21 : 7,
      });
    }
  }
  seedMasteryHabit(db, monday, { id: 'forging', name: 'Ковка серебра', cycles: 20, icon: 'music' });
  seedMasteryHabit(db, monday, { id: 'legacy', name: 'Привычка без ритма', cycles: null, icon: 'language' });
  seedMasteryHabit(db, monday, { id: 'archived', name: 'Архивный велосипед', cycles: 9, icon: 'bicycle', archived: true });
  db.prepare('INSERT INTO activities SELECT ?,id,name,spheres_json,?,?,?,contribution_profile_json FROM habits WHERE id=?')
    .run('stone-today', monday, monday + 'T12:00:00Z', 'Etc/UTC', 'stone-1');

  const summary = { exportedAt: monday + 'T12:00:00Z', habits: 1, archivedHabits: 0, activities: 9,
    formatVersion: 4, databaseSchemaVersion: 6, targetSchemaVersion: 6, frequencySegments: 1, configuredHabits: 1,
    archivePauses: 0, userEntries: 9, defaultEntries: 0, legacyEntries: 0 };
  const bind = (query, values = []) => Object.fromEntries([...new Set(query.match(/\$\d+/g) ?? [])].map((param, index) => [param, values[index]]));
  const mutateHabit = createHabitMutationDriver(db, () => localToday);
  let failDelete = false;
  await bindIpc(async (cmd, args = {}) => {
    if (cmd === 'plugin:sql|load') return args.db;
    if (cmd === 'plugin:sql|select') return db.prepare(args.query).all(bind(args.query, args.values));
    if (cmd === 'plugin:sql|execute') {
      if (failDelete && args.query.startsWith('DELETE FROM activities')) throw Error('Synthetic cancellation failure');
      const result = db.prepare(args.query).run(bind(args.query, args.values));
      return [Number(result.changes), Number(result.lastInsertRowid)];
    }
    if (cmd === 'mutate_habit') return mutateHabit(args.input);
    if (cmd === 'preview_backup') return { token: 'synthetic-v4-mastery', summary };
    if (cmd === 'restore_backup') {
      assert.equal(args.token, 'synthetic-v4-mastery');
      db.exec('BEGIN');
      try {
        clear();
        seedMasteryHabit(db, monday, { id: 'restored-mastery', name: 'Бронза из копии', cycles: 9, icon: 'work' });
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      return { summary, safetyFile: 'synthetic-protective-v4.json' };
    }
    if (cmd === 'cancel_backup') return null;
    throw Error('Unexpected Mastery test IPC ' + cmd);
  });
  const init = await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    (() => {
      const RealDate = Date;
      let time = new RealDate(2026, 10, 9, 12).getTime();
      window.Date = class extends RealDate {
        constructor(...args) { super(...(args.length ? args : [time])); }
        static now() { return time; }
      };
      window.__advanceMasteryClock = day => {
        time = new RealDate(2026, 10, day, 12).getTime();
        window.dispatchEvent(new Event('focus'));
      };
      window.isTauri = true;
      let id = 0;
      const pending = new Map();
      window.__TAURI_INTERNALS__ = {
        invoke: (cmd, args) => new Promise((resolve, reject) => {
          const next = ++id;
          pending.set(next, {resolve, reject});
          window.__chronicleTestIpc(JSON.stringify({id:next, cmd, args}));
        })
      };
      window.__chronicleTestResolve = (id, ok, value) => {
        const request = pending.get(id);
        if (!request) return;
        pending.delete(id);
        if (ok) request.resolve(value);
        else request.reject(new Error(value));
      };
    })()
  ` });
  const card = id => '[data-habit-id="' + id + '"]';
  const query = (id, selector = '') => 'document.querySelector(' + JSON.stringify(card(id) + (selector ? ' ' + selector : '')) + ')';
  const medal = id => query(id, '.habit-medal') + '?.dataset';
  const forging = id => query(id, '.relic-item__forging') + '?.textContent';
  const ready = (id, material, stage) => medal(id) + '?.material===' + JSON.stringify(material) + ' && ' + medal(id) + '?.stage===' + JSON.stringify(String(stage));
  const marked = (id, state) => query(id, '.completion-button') + '?.ariaPressed===' + JSON.stringify(String(state));
  async function select(day) {
    await evaluate(`(() => {
      const input = document.querySelector("input[type=date]");
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(day)});
      input.dispatchEvent(new Event('input', {bubbles:true}));
      input.dispatchEvent(new Event('change', {bubbles:true}));
    })()`);
    await until('document.querySelector(".observation-period").textContent.includes(' + JSON.stringify(day) + ')', 'Mastery scenario selects historical day ' + day);
  }
  async function edit(id) {
    await click(card(id) + ' .habit-actions summary');
    await click(card(id) + ' .habit-action-options button:first-child');
    await until('!!document.querySelector("#habit-name")', 'Mastery scenario opens habit editor for ' + id);
  }
  async function save() {
    await click('.creation-form button[type=submit]');
    await until('!document.querySelector(".creation-form") && !document.querySelector(".save-status").textContent.includes("Сохраняем")', 'Saved definition refreshes the Mastery inventory');
  }
  async function advance(day) {
    localToday = shiftDay(monday, day - 9);
    await evaluate('window.__advanceMasteryClock(' + day + ')');
    await until('document.querySelector("input[type=date]").max===' + JSON.stringify(localToday), 'Window resume advances actual local date to ' + localToday);
  }
  try {
    await viewport(1440, 1040);
    await send('Page.navigate', { url: 'http://127.0.0.1:1420' });
    await until('document.querySelectorAll("#habit-list .habit-medal").length===20', 'Real Sanctuary shows 20 active medals from a temporary SQLite journal');
    for (let stage = 1; stage <= 3; stage++) {
      for (const tier of tiers) {
        await until(ready(tier + '-' + stage, tier, stage), 'Runtime maps ' + tier + ' craftsmanship stage ' + stage);
      }
    }
    await until(marked('stone-1',true) + ' && ' + marked('copper-1',false), 'Current-week activity checks a card without advancing its material');
    assert.equal(await evaluate(medal('stone-1') + '.resonance'), '1');
    assert.equal(await evaluate(medal('copper-1') + '.resonance'), '1');
    assert.equal(await evaluate(medal('bronze-1') + '.resonance'), '0.5');
    assert.equal(await evaluate(medal('silver-1') + '.resonance'), '0');
    assert.match(await evaluate(query('platinum-3', '.relic-item__mastery') + '.textContent'), /Ковка завершена/);
    assert.match(await evaluate(query('legacy', '.relic-item__mastery') + '.textContent'), /Камень.*Выберите ритм/);
    assert.equal(await evaluate(medal('legacy') + '.icon'), 'language');
    await screenshot('mastery-six-tiers.png');
    await viewport(1440, 1360);
    await evaluate('document.querySelector("#inventory").scrollIntoView({block:"start"})');
    await screenshot('mastery-all-stages.png', false);
    await viewport(390, 844);
    await evaluate('document.querySelector("#inventory").scrollIntoView({block:"start"})');
    await until('document.documentElement.scrollWidth<=innerWidth', 'Mastery fits the narrow Sanctuary layout');
    await screenshot('mastery-narrow.png', false);
    await viewport(1440, 1000);
    await evaluate(query('forging') + '.scrollIntoView({block:"center"})');
    await until(forging('forging') + '?.includes("2 из 6 циклов")', 'Silver card shows actual phase-local Forging');
    assert.match(await evaluate(query('forging', '.completion-button') + '.getAttribute("aria-describedby")'), /habit-mastery-forging/);
    await screenshot('mastery-forging-legacy.png', false);

    await select(shiftDay(monday, -21));
    await until(marked('silver-1',true) + ' && ' + medal('silver-1') + '.resonance==="0"', 'Historical selected-day check stays lit on a medal with zero Resonance today');
    await screenshot('mastery-historical-zero.png');
    const copperDay = shiftDay(monday, -7);
    await select(copperDay);
    await until(marked('copper-1',true) + ' && ' + medal('copper-1') + '.resonance==="1"', 'Selecting an earlier date leaves Mastery v1 and current Resonance intact');

    failDelete = true;
    await click(card('copper-1') + ' .completion-button');
    await until('!!document.querySelector("#inventory [role=alert]") && ' + ready('copper-1','copper',1), 'Failed cancellation preserves the last saved Copper projection');
    failDelete = false;
    await click(card('copper-1') + ' .completion-button');
    await until(ready('copper-1','stone',3) + ' && ' + marked('copper-1',false), 'Persisted cancellation replays Copper to Stone stage 3');
    assert.equal(db.prepare('SELECT COUNT(*) n FROM activities WHERE habit_id=?').get('copper-1').n, 2);
    await click(card('copper-1') + ' .completion-button');
    await until(ready('copper-1','copper',1) + ' && ' + marked('copper-1',true), 'Re-recording restores legitimate Copper after persistence');
    assert.equal(db.prepare('SELECT COUNT(*) n FROM activities WHERE habit_id=?').get('copper-1').n, 3);

    await edit('copper-1');
    await click('input[name=habit-icon][value=bicycle]');
    await evaluate(`(() => {
      const range = document.querySelector('#contribution-range-mind');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(range, '8');
      range.dispatchEvent(new Event('input',{bubbles:true}));
      range.dispatchEvent(new Event('change',{bubbles:true}));
      const select = document.querySelector('#habit-frequency');
      select.value = 'daily';
      select.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    await save();
    await until(ready('copper-1','copper',1) + ' && ' + medal('copper-1') + '.icon==="bicycle"', 'Icon and pending frequency edits preserve earned material');
    const profile = JSON.parse(db.prepare('SELECT contribution_profile_json FROM habits WHERE id=?').get('copper-1').contribution_profile_json);
    assert.equal(profile.values.mind, 8);

    await click('.inventory-heading .button-quiet');
    await until(ready('archived','bronze',1) + ' && ' + medal('archived') + '.resonance==="0" && !' + query('archived','.completion-button'), 'Archived Bronze retains earned craftsmanship with a quiet medal and no logging');
    await screenshot('mastery-archive.png');
    await click(card('archived') + ' .restore-button');
    await until('!' + query('archived'), 'Restoring archived Mastery moves the habit back to the active inventory');
    await click('.inventory-heading .button-quiet');
    await until(ready('archived','bronze',1), 'Restored habit preserves earned Bronze');

    await edit('legacy');
    await evaluate('document.querySelector("#habit-frequency").value="weekly";document.querySelector("#habit-frequency").dispatchEvent(new Event("change",{bubbles:true}))');
    await save();
    await until(ready('legacy','stone',1) + ' && ' + forging('legacy') + '?.includes("0 из 1")', 'Explicit enrollment leaves pre-enrollment activities out of Forging');

    await advance(16);
    await until(forging('forging') + '?.includes("2 из 6 циклов") && ' + medal('forging') + '.resonance==="0.5"', 'First eligible shortfall holds Silver Forging while actual-date Resonance fades');
    await until(ready('copper-1','copper',1), 'Applied Daily frequency leaves earlier Weekly progress intact');
    await evaluate(query('forging') + '.scrollIntoView({block:"center"})');
    await screenshot('mastery-resonance-half.png', false);
    await advance(23);
    await until(ready('forging','silver',1) + ' && ' + forging('forging') + '?.includes("0 из 6 циклов") && ' + medal('forging') + '.resonance==="0"', 'Second eligible shortfall clears only unfinished Forging and keeps Silver');
    await screenshot('mastery-resonance-zero.png', false);
    await advance(30);
    await until(ready('forging','silver',1), 'Long absence preserves Silver');
    await select('2026-11-23');
    await click(card('forging') + ' .completion-button');
    await until(forging('forging') + '?.includes("1 из 6 циклов")', 'A recorded return resumes Forging from the protected checkpoint');

    await click('.app-rail button[data-backup]');
    await click('.backup-dialog .form-actions:first-of-type button:nth-child(2)');
    await until('!!document.querySelector(".backup-replacement")', 'Backup v4 preview retains explicit replacement confirmation');
    await click('.backup-dialog section .button-primary');
    await until('document.querySelector(".backup-dialog [role=status]")?.textContent.includes("завершено")', 'Synthetic v4 restore completes the repository reload path');
    await click('.backup-dialog>.form-actions:last-child button');
    await until(ready('restored-mastery','bronze',1) + ' && document.querySelectorAll("#habit-list .habit-medal").length===1', 'Fresh projection follows the restored journal and discards previous card results');

    db.prepare('INSERT INTO habit_frequency_segments VALUES (?,?,?,?,?,1)')
      .run('invalid-midweek','restored-mastery','daily','2026-11-10','2026-11-09');
    await send('Page.reload');
    await until('!!document.querySelector(".mastery-error[role=alert]") && !document.querySelector("#habit-list .habit-medal") && !!document.querySelector(".relic-item__unavailable-icon")', 'Contradictory history shows a non-destructive error with no fabricated Stone');
    await click(card('restored-mastery') + ' .completion-button');
    await until(marked('restored-mastery',true) + ' && !!document.querySelector(".mastery-error")', 'Logging remains available when Mastery inputs fail validation');
  } finally {
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: init.identifier });
    await send('Page.navigate', { url: 'http://127.0.0.1:1420' });
    await until('!!document.querySelector(".preview-notice") && document.querySelectorAll(".relic-item").length===6', 'Mastery integration returns to the ordinary synthetic preview');
    await bindIpc(null);
    db.close();
  }
}
