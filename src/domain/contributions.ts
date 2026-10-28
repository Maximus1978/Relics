import type { SphereId } from './activity.ts';
export const contributionSphereIds = ['body', 'mind', 'relationships', 'work', 'recovery'] as const;
export type ContributionValues = Record<SphereId, number>;
export type ContributionProfile = {
    version: 1;
    origin: 'user' | 'legacy-default';
    values: ContributionValues;
};
export class ContributionError extends Error {
    constructor(message = 'Для каждой выбранной сферы укажите целое число от 1 до 10.') { super(message); this.name = 'ContributionError'; }
}
function keys(value: unknown, expected: readonly string[]): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
        && Object.keys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key));
}
export function validateContributionProfile(value: unknown, selected: readonly string[]): ContributionProfile {
    if (!keys(value, ['version', 'origin', 'values']) || value.version !== 1
        || (value.origin !== 'user' && value.origin !== 'legacy-default')
        || !keys(value.values, contributionSphereIds) || selected.length < 1 || selected.length > 5
        || new Set(selected).size !== selected.length || selected.some(id => !contributionSphereIds.includes(id as SphereId)))
        throw new ContributionError();
    const values = {} as ContributionValues;
    for (const sphere of contributionSphereIds) {
        const number = value.values[sphere];
        if (typeof number !== 'number' || !Number.isInteger(number) || (selected.includes(sphere)
            ? number < 1 || number > 10 || (value.origin === 'legacy-default' && number !== 5) : number !== 0))
            throw new ContributionError();
        values[sphere] = number;
    }
    return { version: 1, origin: value.origin, values };
}
export function defaultContributions(selected: readonly string[], origin: ContributionProfile['origin'] = 'user'): ContributionProfile {
    return validateContributionProfile({ version: 1, origin, values: Object.fromEntries(contributionSphereIds.map(id => [id, selected.includes(id) ? 5 : 0])) }, selected);
}
export function parseContributionProfile(json: string, selected: readonly string[]): ContributionProfile {
    // JSON.parse alone silently collapses duplicate members. Check the original object keys first.
    const seen = new Set<string>();
    let depth = 0;
    let quoted = false;
    let escape = false;
    let token = '';
    let objectIndex = 0;
    const stack: number[] = [];
    for (let index = 0; index < json.length; index++) {
        const character = json[index];
        if (quoted) {
            token += character;
            if (escape) {
                escape = false;
                continue;
            }
            if (character === '\\') {
                escape = true;
                continue;
            }
            if (character === '"') {
                quoted = false;
                let next = index + 1;
                while (/\s/.test(json[next] ?? '') && next < json.length)
                    next++;
                if (json[next] === ':') {
                    const name = JSON.parse(token) as string;
                    const key = stack.join('/') + ':' + name;
                    if (seen.has(key))
                        throw new ContributionError('В профиле повторяется поле.');
                    seen.add(key);
                }
            }
            continue;
        }
        if (character === '"') {
            quoted = true;
            token = '"';
        }
        else if (/[0-9-]/.test(character)) {
            let end = index + 1;
            while (end < json.length && /[0-9.eE+-]/.test(json[end]))
                end++;
            if (/[.eE]/.test(json.slice(index, end)))
                throw new ContributionError();
            index = end - 1;
        }
        else if (character === '{') {
            depth++;
            stack.push(++objectIndex);
        }
        else if (character === '}') {
            depth--;
            stack.pop();
        }
    }
    if (depth !== 0 || quoted)
        throw new ContributionError();
    try {
        return validateContributionProfile(JSON.parse(json), selected);
    }
    catch (error) {
        if (error instanceof ContributionError)
            throw error;
        throw new ContributionError();
    }
}
