import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatToBrazilianDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function formatToBrazilianDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
}

export function getBrazilianTimeISOString(): string {
  const now = new Date();
  const brazilianTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
  return brazilianTime.toISOString();
}

export function getCurrentBrazilianTime(): Date {
  const now = new Date();
  return new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
}