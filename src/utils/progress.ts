// src/utils/progress.ts
export type ProgressMap = Record<string, boolean>; // lessonId -> done

const KEY = (trackId: string) => `dch.progress.${trackId}`;

export function getProgress(trackId: string): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(KEY(trackId)) || "{}");
  } catch {
    return {};
  }
}

export function setLessonDone(trackId: string, lessonId: string, done: boolean) {
  const map = getProgress(trackId);
  map[lessonId] = done;
  localStorage.setItem(KEY(trackId), JSON.stringify(map));
}

export function isLessonDone(trackId: string, lessonId: string) {
  return !!getProgress(trackId)[lessonId];
}

export function getCompletion(trackId: string, lessonIds: string[]) {
  const map = getProgress(trackId);
  const done = lessonIds.filter((id) => map[id]).length;
  const total = lessonIds.length || 1;
  return { done, total, pct: Math.round((done / total) * 100) };
}
