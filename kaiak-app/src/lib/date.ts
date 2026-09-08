const APP_TIMEZONE = process.env.APP_TIMEZONE || 'America/Bogota';

function tzOffsetMs(ref: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = dtf.formatToParts(ref);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const hour = get('hour') === '24' ? '0' : get('hour');

  const asUtc = Date.UTC(
    +get('year'),
    +get('month') - 1,
    +get('day'),
    +hour,
    +get('minute'),
    +get('second')
  );

  return asUtc - ref.getTime();
}

function datePartsInTz(ref: Date) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
  });
  const parts = dtf.formatToParts(ref);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { year: +get('year'), month: +get('month'), day: +get('day') };
}

export function startOfTodayEpoch(): number {
  const now = new Date();
  const offsetMs = tzOffsetMs(now);
  const { year, month, day } = datePartsInTz(now);

  const todayAt0001 = Date.UTC(year, month - 1, day, 0, 1, 0);
  return Math.floor((todayAt0001 - offsetMs) / 1000);
}

export function startOfTodayISO(): string {
  return new Date(startOfTodayEpoch() * 1000).toISOString();
}

// Fixed season start ("hoy" when the campaign begins). Set KM_CUTOFF_DATE=YYYY-MM-DD.
function kmCutoffEpochRaw(): number {
  const raw = process.env.KM_CUTOFF_DATE;
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split('-').map(Number);
    const ref = new Date(Date.UTC(y, m - 1, d, 0, 1, 0));
    return Math.floor((ref.getTime() - tzOffsetMs(ref)) / 1000);
  }
  return startOfTodayEpoch();
}

export function kmCutoffEpoch(): number {
  return kmCutoffEpochRaw();
}

export function kmCutoffISO(): string {
  return new Date(kmCutoffEpochRaw() * 1000).toISOString();
}