'use client';

import { useEffect, useMemo, useState } from 'react';

type EventType = 'misa' | 'confesion' | 'adoracion' | 'actividad' | 'liturgia';

type CalendarEvent = {
  date: string; // YYYY-MM-DD
  title: string;
  time?: string;
  type: EventType;
};

const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const TYPE_STYLES: Record<EventType, { dot: string; badge: string; label: string }> = {
  misa: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'Misa',
  },
  confesion: {
    dot: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-800 border-violet-200',
    label: 'Confesión',
  },
  adoracion: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    label: 'Adoración',
  },
  actividad: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    label: 'Actividad',
  },
  liturgia: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    label: 'Liturgia',
  },
};

const HOLY_WEEK_START = '2026-03-29';
const HOLY_WEEK_END = '2026-04-05';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toYmd(y: number, m: number, d: number) {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}

function parseYmd(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function isBetweenInclusive(dateYmd: string, startYmd: string, endYmd: string) {
  return dateYmd >= startYmd && dateYmd <= endYmd;
}

function isBefore(dateYmd: string, limitYmd: string) {
  return dateYmd < limitYmd;
}

function sameMonth(dateYmd: string, y: number, m: number) {
  const dt = parseYmd(dateYmd);
  return dt.getFullYear() === y && dt.getMonth() === m;
}

function formatLongDate(dateYmd: string) {
  const dt = parseYmd(dateYmd);
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dt);
}

/**
 * Genera eventos fijos parroquiales para el mes visible,
 * SOLO hasta antes de Semana Santa (2026-03-29).
 */
function buildRecurringParishEvents(y: number, m: number): CalendarEvent[] {
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const events: CalendarEvent[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(y, m, d);
    const dow = dt.getDay(); // 0 Dom ... 6 Sáb
    const ymd = toYmd(y, m, d);

    // Solo hasta el día ANTERIOR al inicio de Semana Santa
    if (!isBefore(ymd, HOLY_WEEK_START)) continue;

    // MISAS
    // Lun-Vie 08:00
    if (dow >= 1 && dow <= 5) {
      events.push({ date: ymd, title: 'Santa Misa', time: '08:00', type: 'misa' });
    }
    // Mar-Vie 20:00
    if (dow >= 2 && dow <= 5) {
      events.push({ date: ymd, title: 'Santa Misa', time: '20:00', type: 'misa' });
    }
    // Sáb 20:00
    if (dow === 6) {
      events.push({ date: ymd, title: 'Santa Misa', time: '20:00', type: 'misa' });
    }
    // Dom 11:00 y 20:00
    if (dow === 0) {
      events.push({ date: ymd, title: 'Santa Misa', time: '11:00', type: 'misa' });
      events.push({ date: ymd, title: 'Santa Misa', time: '20:00', type: 'misa' });
    }

    // CONFESIONES
    // Mar 18:00-20:00
    if (dow === 2) {
      events.push({ date: ymd, title: 'Confesiones', time: '18:00–20:00', type: 'confesion' });
    }
    // Vie 09:00-12:00 y 17:00-20:00
    if (dow === 5) {
      events.push({ date: ymd, title: 'Confesiones', time: '09:00–12:00', type: 'confesion' });
      events.push({ date: ymd, title: 'Confesiones', time: '17:00–20:00', type: 'confesion' });
    }

    // ADORACIÓN
    // Jue 18:00-19:30
    if (dow === 4) {
      events.push({
        date: ymd,
        title: 'Adoración Eucarística',
        time: '18:00–19:30',
        type: 'adoracion',
      });
    }
    // Vie 08:30-10:00
    if (dow === 5) {
      events.push({
        date: ymd,
        title: 'Adoración Eucarística',
        time: '08:30–10:00',
        type: 'adoracion',
      });
    }
  }

  return events;
}

/**
 * Semana Santa 2026: 29/03/2026 al 05/04/2026
 */
function buildHolyWeekEventsForMonth(y: number, m: number): CalendarEvent[] {
  const holyWeek: CalendarEvent[] = [
    { date: '2026-03-29', title: 'Domingo de Ramos', type: 'liturgia' },
    { date: '2026-03-30', title: 'Lunes Santo', type: 'liturgia' },
    { date: '2026-03-31', title: 'Martes Santo', type: 'liturgia' },
    { date: '2026-04-01', title: 'Miércoles Santo', type: 'liturgia' },
    { date: '2026-04-02', title: 'Jueves Santo', type: 'liturgia' },
    { date: '2026-04-03', title: 'Viernes Santo', type: 'liturgia' },
    { date: '2026-04-04', title: 'Sábado Santo', type: 'liturgia' },
    { date: '2026-04-05', title: 'Domingo de Pascua', type: 'liturgia' },
  ];

  return holyWeek.filter((ev) => sameMonth(ev.date, y, m));
}

/**
 * Si más adelante tenés eventos externos cargados en JSON/API,
 * podés mapearlos acá a CalendarEvent[].
 */
function getManualActivitiesForMonth(_y: number, _m: number): CalendarEvent[] {
  return [];
}

export default function CalendariosPage() {
  const now = new Date();
  const [cursor, setCursor] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [liturgicalApiEvents, setLiturgicalApiEvents] = useState<CalendarEvent[]>([]);

  const y = cursor.getFullYear();
  const m = cursor.getMonth();

  const monthLabel = new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
  }).format(cursor);

  const firstDay = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const pad = firstDay.getDay(); // 0 domingo

  const emptyCells: (number | null)[] = Array.from(
    { length: pad },
    () => null as number | null
  );
  const dayCells: (number | null)[] = Array.from(
    { length: daysInMonth },
    (_, i) => (i + 1) as number | null
  );
  const cells: (number | null)[] = [...emptyCells, ...dayCells];



  useEffect(() => {
    let active = true;
    fetch(`/api/calendario-liturgico?year=${y}&country=AR&diocese=mendoza`)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const mapped: CalendarEvent[] = (data?.items || [])
          .filter((it: any) => sameMonth(it.date, y, m))
          .map((it: any) => ({
            date: it.date,
            title: it.celebration || it.saint || 'Celebración litúrgica',
            type: 'liturgia' as EventType,
          }));
        setLiturgicalApiEvents(mapped);
      })
      .catch(() => setLiturgicalApiEvents([]));
    return () => { active = false; };
  }, [y, m, liturgicalApiEvents]);

  const events = useMemo(() => {
    const recurring = buildRecurringParishEvents(y, m);
    const holyWeek = buildHolyWeekEventsForMonth(y, m);
    const manual = getManualActivitiesForMonth(y, m);
    return [...recurring, ...holyWeek, ...manual, ...liturgicalApiEvents];
  }, [y, m, liturgicalApiEvents]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, [events]);

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] ?? [] : [];

  const prevMonth = () => setCursor(new Date(y, m - 1, 1));
  const nextMonth = () => setCursor(new Date(y, m + 1, 1));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl border bg-white/90 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={prevMonth}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
            aria-label="Mes anterior"
          >
            ◀
          </button>

          <h1 className="text-lg font-semibold capitalize">{monthLabel}</h1>

          <button
            onClick={nextMonth}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
            aria-label="Mes siguiente"
          >
            ▶
          </button>
        </div>

        {/* Leyenda */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(TYPE_STYLES) as EventType[]).map((t) => (
            <span
              key={t}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${TYPE_STYLES[t].badge}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${TYPE_STYLES[t].dot}`} />
              {TYPE_STYLES[t].label}
            </span>
          ))}
        </div>
      </div>

      {/* Grilla del calendario */}
      <div className="rounded-2xl border bg-white/90 p-4 shadow-sm">
        <div className="mb-3 grid grid-cols-7 gap-2">
          {WEEK_DAYS.map((wd) => (
            <div key={wd} className="text-center text-xs font-semibold text-gray-600">
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-20 rounded-xl bg-gray-50" />;
            }

            const ymd = toYmd(y, m, day);
            const dayEvents = eventsByDate[ymd] ?? [];
            const uniqueTypes = Array.from(new Set(dayEvents.map((e) => e.type)));
            const isSelected = selectedDate === ymd;
            const holyWeekDay = isBetweenInclusive(ymd, HOLY_WEEK_START, HOLY_WEEK_END);

            return (
              <button
                key={`day-${ymd}`}
                type="button"
                onClick={() => setSelectedDate(ymd)}
                className={[
                  'h-20 rounded-xl border p-2 text-left transition',
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : holyWeekDay
                    ? 'border-rose-300 bg-rose-50 hover:bg-rose-100'
                    : 'border-gray-200 bg-white hover:bg-gray-50',
                ].join(' ')}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-semibold">{day}</span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {uniqueTypes.slice(0, 4).map((t) => (
                    <span
                      key={`${ymd}-${t}`}
                      className={`inline-block h-2.5 w-2.5 rounded-full ${TYPE_STYLES[t].dot}`}
                      title={TYPE_STYLES[t].label}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalle del día seleccionado */}
      <div className="rounded-2xl border bg-white/90 p-4 shadow-sm">
        {!selectedDate ? (
          <p className="text-sm text-gray-600">
            Tocá un día del calendario para ver sus celebraciones y horarios.
          </p>
        ) : (
          <div className="space-y-3">
            <h2 className="text-base font-semibold capitalize">{formatLongDate(selectedDate)}</h2>

            {selectedEvents.length === 0 ? (
              <p className="text-sm text-gray-600">No hay actividades registradas para este día.</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((ev, i) => (
                  <div key={`${ev.date}-${ev.title}-${i}`} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{ev.title}</p>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs ${TYPE_STYLES[ev.type].badge}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${TYPE_STYLES[ev.type].dot}`} />
                        {TYPE_STYLES[ev.type].label}
                      </span>
                    </div>
                    {ev.time ? <p className="mt-1 text-sm text-gray-700">Horario: {ev.time}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
