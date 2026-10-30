import { projectSphereContributions } from '../src/domain/sphereContributions.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { contributionSphereIds as ids, defaultContributions, validateContributionProfile, parseContributionProfile, type ContributionProfile } from '../src/domain/contributions.ts';
import { openActivityRepository, type SqlDatabase } from '../src/data/activityRepository.ts';
const sql = (version: number) => readFileSync(new URL('../src-tauri/migrations/' + ['001_initial.sql', '002_archive_habits.sql', '003_seed_once.sql', '004_habit_contributions.sql'][version - 1], import.meta.url), 'utf8');
function adapt(db: DatabaseSync): SqlDatabase {
    const bind = (query: string, args: unknown[]) => Object.fromEntries([...new Set(query.match(/\$\d+/g) ?? [])].map((key, i) => [key, args[i] as SQLInputValue]));
    return { async execute(q, args = []) { return { rowsAffected: Number(db.prepare(q).run(bind(q, args)).changes) }; }, async select<T>(q: string, args: unknown[] = []) { return db.prepare(q).all(bind(q, args)) as T; } };
}
function fixture(context: test.TestContext) {
    const parent = resolve(tmpdir());
    const directory = mkdtempSync(join(parent, 'relics-weights-'));
    const path = join(directory, 'synthetic.db');
    let db = new DatabaseSync(path);
    const migrate = (from = 1) => { db.exec('BEGIN'); try {
        for (let v = from; v <= 4; v++)
            db.exec(sql(v));
        db.exec('COMMIT');
    }
    catch (e) {
        db.exec('ROLLBACK');
        throw e;
    } };
    context.after(() => { db.close(); assert.equal(dirname(directory), parent); rmSync(directory, { recursive: true, force: true }); });
    return { get db() { return db; }, migrate, repo: () => openActivityRepository(adapt(db)), reopen() { db.close(); db = new DatabaseSync(path); return openActivityRepository(adapt(db)); } };
}
const guitar = () => { const p = defaultContributions(['mind', 'recovery']); p.values.mind = 7; p.values.recovery = 3; return p; };
test('W01 all 31 selections permit independent endpoints and full total50 without normalization', () => {
    for (let mask = 1; mask < 32; mask++) {
        const selected = ids.filter((_, i) => mask & (1 << i));
        for (const value of [1, 5, 10]) {
            const p = defaultContributions(selected);
            for (const s of selected)
                p.values[s] = value;
            assert.deepEqual(validateContributionProfile(p, selected), p);
        }
    }
    const p = defaultContributions(ids);
    for (const s of ids)
        p.values[s] = 10;
    assert.equal(Object.values(validateContributionProfile(p, ids).values).reduce((a, b) => a + b), 50);
});
test('W02-W04 strict ranges/types, exact map, set and default provenance', () => {
    for (const value of [0, 11, -1, 1.5, '5', true, null, NaN, Infinity]) {
        const p = defaultContributions(['mind']);
        (p.values as Record<string, unknown>).mind = value;
        assert.throws(() => validateContributionProfile(p, ['mind']));
    }
    for (const mutate of [(p: any) => delete p.values.body, (p: any) => p.values.extra = 0, (p: any) => p.extra = 1, (p: any) => p.version = 2, (p: any) => p.origin = 'other', (p: any) => p.values.body = 3, (p: any) => { p.origin = 'legacy-default'; p.values.mind = 6; }]) {
        const p = defaultContributions(['mind']);
        mutate(p);
        assert.throws(() => validateContributionProfile(p, ['mind']));
    }
    assert.throws(() => validateContributionProfile(defaultContributions(['mind']), []));
    assert.throws(() => parseContributionProfile('{"version":1,"origin":"user","values":{"body":0,"mind":5,"mind":7,"relationships":0,"work":0,"recovery":0}}', ['mind']));
});
test('W03 shared TS/Rust strict profile conformance vectors', () => {
    const cases = JSON.parse(readFileSync(new URL('./fixtures/contribution-profiles.json', import.meta.url), 'utf8')) as {
        name: string;
        json: string;
        spheres: string[];
        valid: boolean;
    }[];
    for (const c of cases) {
        if (c.valid)
            assert.doesNotThrow(() => parseContributionProfile(c.json, c.spheres), c.name);
        else
            assert.throws(() => parseContributionProfile(c.json, c.spheres), c.name);
    }
});
for (const start of [1, 2, 3])
    test('W05 schema' + start + ' migration preserves Oct26-27 history, archived identity and marked defaults', async (context) => {
        const f = fixture(context);
        for (let i = 1; i <= start; i++)
            f.db.exec(sql(i));
        f.db.prepare('INSERT INTO habits (id,name,spheres_json) VALUES (?,?,?)').run('old', 'Guitar', '["mind","recovery"]');
        for (const day of ['2026-10-26', '2026-10-27'])
            f.db.prepare('INSERT INTO activities (id,habit_id,habit_name_snapshot,spheres_snapshot_json,occurred_on,recorded_at,timezone) VALUES(?,?,?,?,?,?,?)').run(day, 'old', 'Old title', '["body"]', day, day + 'T12:00:00Z', 'UTC');
        if (start < 2)
            f.db.exec(sql(2));
        f.db.prepare('UPDATE habits SET archived_at=? WHERE id=?').run('2026-10-27T22:00:00Z', 'old');
        f.migrate(Math.max(start + 1, 3));
        let r = await f.repo();
        const old = (await r.listHabits('archived')).find(h => h.id === 'old')!;
        assert.equal(old.name, 'Guitar');
        assert.equal(old.archivedAt, '2026-10-27T22:00:00Z');
        assert.deepEqual(old.contributionProfile, defaultContributions(['mind', 'recovery'], 'legacy-default'));
        const entries = await r.list();
        assert.equal(entries.length, 2);
        assert.ok(entries.every(a => a.contributionSnapshot === null && a.habitName === 'Old title' && a.spheres[0] === 'body'));
        r = await f.reopen();
        assert.deepEqual(await r.list(), entries);
        await assert.rejects(r.log(old, '2000-01-01'));
        await r.restoreHabit('old');
        await r.log(old, '2000-01-01');
        assert.deepEqual((await r.list()).find(a => a.occurredOn === '2000-01-01')?.contributionSnapshot, old.contributionProfile);
    });
test('W07 invalid legacy set rolls back added columns and allows a corrected retry', context => {
    const f = fixture(context);
    f.db.exec(sql(1));
    f.db.exec(sql(2));
    f.db.exec(sql(3));
    f.db.prepare('UPDATE habits SET spheres_json=? WHERE id=?').run('["mind","mind"]', 'read');
    assert.throws(() => f.migrate(4));
    assert.ok(!f.db.prepare('PRAGMA table_info(habits)').all().some(c => c.name === 'contribution_profile_json'));
    f.db.prepare('UPDATE habits SET spheres_json=? WHERE id=?').run('["mind"]', 'read');
    f.migrate(4);
    assert.ok(f.db.prepare('PRAGMA table_info(habits)').all().some(c => c.name === 'contribution_profile_json'));
});
test('W08-W13 values/origin survive edit/reopen; snapshots, duplicate retry and stale habit remain safe', async (context) => {
    const f = fixture(context);
    f.migrate();
    let r = await f.repo();
    const old = (await r.listHabits()).find(h => h.id === 'read')!;
    await r.log(old, '2000-01-01');
    assert.equal((await r.list())[0].contributionSnapshot?.origin, 'legacy-default');
    const habit = await r.createHabit('Guitar', ['mind', 'recovery'], guitar());
    await r.log(habit, '2000-01-02');
    const before = await r.list();
    const changed = guitar();
    changed.values.mind = 4;
    await r.updateHabit(habit.id, 'Гитара', ['mind', 'recovery'], changed);
    await r.log(habit, '2000-01-02');
    assert.deepEqual(await r.list(), before);
    await r.log(habit, '2000-01-03');
    assert.equal((await r.list())[0].contributionSnapshot?.values.mind, 4);
    const invalid = guitar();
    invalid.values.mind = 11;
    await assert.rejects(r.updateHabit(habit.id, 'damaged', ['mind', 'recovery'], invalid));
    r = await f.reopen();
    assert.equal((await r.listHabits()).find(h => h.id === habit.id)?.contributionProfile?.values.mind, 4);
    assert.equal((await r.list()).find(a => a.occurredOn === '2000-01-02')?.contributionSnapshot?.values.mind, 7);
    await r.archiveHabit(habit.id);
    await assert.rejects(r.log(habit, '2000-01-04'));
    await r.restoreHabit(habit.id);
    const entry = (await r.list()).find(a => a.occurredOn === '2000-01-02')!;
    await r.remove(entry.id);
    await r.log(habit, '2000-01-02');
    assert.equal((await r.list()).find(a => a.occurredOn === '2000-01-02')?.contributionSnapshot?.values.mind, 4);
});
test('W12 INSERT SELECT snapshots an edit immediately before insertion without mixing fields', async (context) => {
    const f = fixture(context);
    f.migrate();
    const adapter = adapt(f.db);
    const p = guitar();
    const repo = await openActivityRepository({ ...adapter, async execute(q, args) { if (q.startsWith('INSERT INTO activities'))
            f.db.prepare('UPDATE habits SET name=?,spheres_json=?,contribution_profile_json=? WHERE id=?').run('Coherent', '["mind","recovery"]', JSON.stringify(p), 'read'); return adapter.execute(q, args); } });
    const stale = (await repo.listHabits()).find(h => h.id === 'read')!;
    await repo.log(stale, '2000-01-01');
    const [a] = await repo.list();
    assert.equal(a.habitName, 'Coherent');
    assert.deepEqual(a.spheres, ['mind', 'recovery']);
    assert.deepEqual(a.contributionSnapshot, p);
});

test('T05 actual SQLite edit/reopen/archive/backdated cancellation uses immutable journal profiles',async context=>{
 const f=fixture(context);f.migrate();let r=await f.repo();
 const h=await r.createHabit('Guitar',['mind','recovery'],guitar());await r.log(h,'2000-01-02');
 const opts={startDay:'2000-01-01',endDayExclusive:'2000-01-10',asOfDay:'2000-01-10',weekStartsOn:1,trendWeeks:4};
 const before=projectSphereContributions(await r.list(),opts);
 const next=guitar();next.values.mind=2;await r.updateHabit(h.id,'Edited',['mind','recovery'],next);await r.archiveHabit(h.id);r=await f.reopen();
 assert.deepEqual(projectSphereContributions(await r.list(),opts),before);
 await r.restoreHabit(h.id);await r.log(h,'2000-01-03');const rows=await r.list();assert.equal(projectSphereContributions(rows,opts).period.totalUnits,15);
 await r.remove(rows.find(e=>e.occurredOn==='2000-01-03')!.id);r=await f.reopen();assert.deepEqual(projectSphereContributions(await r.list(),opts),before);
});
