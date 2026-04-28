import { useEffect, useState } from "react";

const KEY = "focushub.v1";

type State = {
  studyHoursToday: number;
  screenTimeMinutes: number;
  streak: number;
  lastStudyDate: string | null;
  weekCompleted: boolean[]; // 7 days, Mon..Sun
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const todayDayIndex = () => {
  // Monday = 0
  const d = new Date().getDay();
  return (d + 6) % 7;
};

const initial: State = {
  studyHoursToday: 2.5,
  screenTimeMinutes: 142,
  streak: 7,
  lastStudyDate: null,
  weekCompleted: [true, true, true, false, false, false, false],
};

export const useFocusStore = () => {
  const [state, setState] = useState<State>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return initial;
      return { ...initial, ...JSON.parse(raw) };
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const logStudyHours = (h: number) => {
    setState((s) => {
      const newHours = s.studyHoursToday + h;
      const today = todayKey();
      const idx = todayDayIndex();
      const week = [...s.weekCompleted];
      week[idx] = true;
      const isNewDay = s.lastStudyDate !== today;
      return {
        ...s,
        studyHoursToday: newHours,
        weekCompleted: week,
        streak: isNewDay ? s.streak + 1 : s.streak,
        lastStudyDate: today,
      };
    });
  };

  const setScreenTime = (m: number) => setState((s) => ({ ...s, screenTimeMinutes: m }));

  // Focus score: weighted blend
  const focusScore = Math.round(
    Math.min(100,
      state.studyHoursToday * 12 +
        state.streak * 3 +
        Math.max(0, 60 - state.screenTimeMinutes / 4)
    )
  );

  return {
    state,
    todayDayIndex: todayDayIndex(),
    focusScore,
    logStudyHours,
    setScreenTime,
  };
};
