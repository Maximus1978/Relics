import { localDay } from '../domain/activity.ts';

export function yesterday(now = new Date()): string {
  return localDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
}

export function displayDay(day: string): string {
  const date = new Date(`${day}T12:00:00`);
  return Number.isNaN(date.getTime()) ? 'Выберите дату' : date.toLocaleDateString('ru-RU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}
