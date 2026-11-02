import { changeFrequency, validateFrequency } from '../domain/habitRhythm.ts';
import { rhythmFixtures } from './rhythmFixtures.ts';
import { defaultContributions,validateContributionProfile } from '../domain/contributions.ts';
import { localDay, sampleHabits, validateDay, type Activity, type Habit } from '../domain/activity.ts';
import { HabitStateError, validateHabitInput } from '../domain/habit.ts';
import type { openActivityRepository } from '../data/activityRepository.ts';
import { yesterday } from '../ui/dates.ts';

export async function createSanctuaryPreview(): Promise<Awaited<ReturnType<typeof openActivityRepository>>> {
  const habits: Habit[] = [
    ...sampleHabits.map(habit => ({ ...structuredClone(habit), id: `demo-${habit.id}` })),
    { id: 'demo-guitar', name: 'Гитара', spheres: ['mind', 'recovery'], archivedAt: null, contributionProfile:defaultContributions(['mind','recovery']) },
    { id: 'demo-work', name: 'Работа над своим проектом', spheres: ['work', 'mind'], archivedAt: null, contributionProfile:defaultContributions(['work','mind']) },
    { id: 'demo-rest', name: 'Время для себя', spheres: ['recovery'], archivedAt: null, contributionProfile:defaultContributions(['recovery']) },
  ];
  let activities: Activity[] = [
    { id: 'demo-walk-today', habitId: 'demo-walk', habitName: 'Прогулка', spheres: ['body', 'recovery'], occurredOn: localDay(), recordedAt: new Date().toISOString(), timezone: 'Demo', contributionSnapshot:null },
    { id: 'demo-read-yesterday', habitId: 'demo-read', habitName: 'Чтение', spheres: ['mind'], occurredOn: yesterday(), recordedAt: new Date().toISOString(), timezone: 'Demo', contributionSnapshot:null },
  ];
  if (typeof window !== 'undefined') {
    const fixture=rhythmFixtures(new URLSearchParams(window.location.search).get('rhythmFixture')??'',localDay(),habits);
    if(fixture)activities=fixture;
  }
  function findHabit(id: string): Habit {
    const habit = habits.find(habit => habit.id === id);
    if (!habit) throw new HabitStateError('Привычка не найдена.');
    return habit;
  }
  return {
    async listHabits(status = 'active') {
      return structuredClone(habits.filter(habit => status === 'all' || (habit.archivedAt !== null) === (status === 'archived')));
    },
    async createHabit(name, selectedSpheres,profile,frequency) {
      const habit: Habit = { id: crypto.randomUUID(), ...validateHabitInput(name, selectedSpheres), archivedAt: null, contributionProfile:validateContributionProfile(profile??defaultContributions(selectedSpheres),selectedSpheres) };
      habit.frequencySegments=changeFrequency([],habit.id,{kind:'set',frequency:validateFrequency(frequency)},localDay(),crypto.randomUUID());habit.archivePauses=[];
      habits.push(habit);
      return structuredClone(habit);
    },
    async updateHabit(id, name, selectedSpheres,profile,rhythmChange={kind:'keep'}) { const input=validateHabitInput(name,selectedSpheres); const contributionProfile=validateContributionProfile(profile??defaultContributions(input.spheres),input.spheres);const habit=findHabit(id);const frequencySegments=changeFrequency(habit.frequencySegments??[],id,rhythmChange,localDay(),crypto.randomUUID());Object.assign(habit,input,{contributionProfile,frequencySegments}); },
    async archiveHabit(id) { const habit = findHabit(id); if(habit.archivedAt===null){habit.archivedAt=new Date().toISOString();(habit.archivePauses??=[]).push({id:crypto.randomUUID(),habitId:id,startOn:localDay(),endExclusiveOn:null,reason:'archive',provenance:'recorded'});} },
    async restoreHabit(id) { const habit=findHabit(id);habit.archivedAt=null;habit.archivePauses=(habit.archivePauses??[]).map(p=>p.endExclusiveOn===null?{...p,endExclusiveOn:localDay()}:p).filter(p=>p.startOn===null||p.startOn!==p.endExclusiveOn); },
    async list() { return structuredClone([...activities].sort((left, right) => right.occurredOn.localeCompare(left.occurredOn) || right.recordedAt.localeCompare(left.recordedAt))); },
    async log(definition, day) {
      validateDay(day);
      const habit = findHabit(definition.id);
      if (habit.archivedAt !== null) throw new HabitStateError('Восстановите привычку перед отметкой.');
      if (activities.some(entry => entry.habitId === habit.id && entry.occurredOn === day)) return;
      activities.push({ id: crypto.randomUUID(), habitId: habit.id, habitName: habit.name, spheres: [...habit.spheres],
        occurredOn: day, recordedAt: new Date().toISOString(), timezone: 'Demo', contributionSnapshot:structuredClone(habit.contributionProfile) });
    },
    async remove(id) { activities = activities.filter(entry => entry.id !== id); },
  };
}
