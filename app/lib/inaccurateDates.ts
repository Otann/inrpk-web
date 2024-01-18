import { DateAccuracy } from './db/schema';

export const dayAccurateFormatter = new Intl.DateTimeFormat('ru', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const monthAccurateFormatter = new Intl.DateTimeFormat('ru', {
  month: '2-digit',
  year: 'numeric',
});

const yearAccurateFormatter = new Intl.DateTimeFormat('ru', {
  year: 'numeric',
});

export function formatInaccurateDate(
  date: Date | string | null | undefined,
  accuracy: string | null | undefined
) {
  if (accuracy === 'unknown') {
    return 'Неизвестно';
  }
  if (!date) {
    return 'Нет даты';
  }
  switch (accuracy) {
    case 'day':
      return dayAccurateFormatter.format(new Date(date));

    case 'month':
      return monthAccurateFormatter.format(new Date(date));

    case 'year':
      return yearAccurateFormatter.format(new Date(date));

    default:
      return 'Неизвестная точность';
  }
}

export function accuracyToFormat(accuracy: string): string | undefined {
  switch (accuracy) {
    case 'day':
      return 'd.m.Y';
    case 'month':
      return 'm.Y';
    case 'year':
      return 'Y';
    default:
      return undefined;
  }
}

export function accuracyToPlaceholder(accuracy: string): string | undefined {
  switch (accuracy) {
    case 'day':
      return 'дд.мм.гггг';
    case 'month':
      return 'мм.гггг';
    case 'year':
      return 'гггг';
    default:
      return undefined;
  }
}

export function accuracyToPattern(accuracy: string): string | undefined {
  switch (accuracy) {
    case 'day':
      return '\\d{1,2}\\.\\d{1,2}\\.\\d{4}';
    case 'month':
      return '\\d{1,2}\\.\\d{4}';
    case 'year':
      return '\\d{4}';
    default:
      return undefined;
  }
}

export function conformDateFormat(
  element: HTMLInputElement,
  accuracy: DateAccuracy
) {
  const val = element.value;

  if (accuracy === 'day' && /^\d{2}\.?\d{2}\.?\d{4}$/.test(val)) {
    const digits = val.replaceAll(/\D/g, '');
    const d = digits.substring(0, 2);
    const m = digits.substring(2, 4);
    const y = digits.substring(4, 8);
    element.value = `${d}.${m}.${y}`;
  }

  if (accuracy === 'month' && /^\d{2}\.?\d{4}$/.test(val)) {
    const digits = val.replaceAll(/\D/g, '');
    const m = digits.substring(0, 2);
    const y = digits.substring(2, 6);
    element.value = `${m}.${y}`;
  }
}

export function dateInputKeyDown(
  event: React.KeyboardEvent<HTMLInputElement>,
  accuracy: DateAccuracy
) {
  // we want to prevent form submission on enter
  if (event.key === 'Enter') {
    event.preventDefault();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  // and also apply formatting if possible
  const formatKeys = new Set(['Enter', 'Tab']);
  if (formatKeys.has(event.key)) {
    conformDateFormat(event.currentTarget, accuracy);
  }
}

export function parseDate(value: string | null) {
  if (!value) return value;
  const d = value.substring(0, 2);
  const m = value.substring(2, 4);
  const y = value.substring(4, 8);
  return new Date(parseInt(y), parseInt(m), parseInt(d));
}

function compareAsNumber(aStr: string, bStr: string) {
  const a = parseInt(aStr);
  const b = parseInt(bStr);
  if (a === b) return 0;
  else if (a > b) return 1;
  else return -1;
}

/**
 * a = b ->  0
 * a > b ->  1
 * a < b -> -1
 */
export function compareDate(a: string, b: string) {
  const year = compareAsNumber(a.substring(6, 10), b.substring(6, 10));
  if (year !== 0) return year;

  const month = compareAsNumber(a.substring(3, 5), b.substring(3, 5));
  if (month !== 0) return month;

  return compareAsNumber(a.substring(0, 2), b.substring(0, 2));
}

export function compareString(a: string, b: string) {
  if (a === b) return 0;
  else if (a > b) return 1;
  else return -1;
}
