// Tipos base
export type Lesson = { id: string; title: string };
export type Section = { id: string; title: string; lessons: Lesson[] };
export type Course  = { id: string; title: string; sections: Section[] };
export type Track   = { id: string; title: string; courses: Course[] };

// Helpers de texto
export function slugify(input: string) {
  return input
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
export function stripAfterComma(s: string) {
  const i = s.indexOf(",");
  return i >= 0 ? s.slice(0, i).trim() : s.trim();
}

// Progresso (localStorage)
export function isLessonDone(id: string): boolean {
  try { return localStorage.getItem(`dc:done:${id}`) === "1"; } catch { return false; }
}
export function setLessonDone(id: string, done: boolean) {
  try { done ? localStorage.setItem(`dc:done:${id}`, "1") : localStorage.removeItem(`dc:done:${id}`); } catch {}
}

export function sectionProgress(section: Section) {
  const total = section.lessons.length;
  const done  = section.lessons.filter(l => isLessonDone(l.id)).length;
  return { done, total, pct: total ? Math.round((done/total)*100) : 0 };
}
export function courseTotals(course: Course) {
  const total = course.sections.reduce((a, s) => a + s.lessons.length, 0);
  const done  = course.sections.reduce((a, s) => a + sectionProgress(s).done, 0);
  return { done, total, pct: total ? Math.round((done/total)*100) : 0 };
}
