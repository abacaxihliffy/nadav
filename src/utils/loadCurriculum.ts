// src/utils/loadCurriculum.ts

// ---------- Tipos + helpers re-exportados (fonte única) ----------
export type { Lesson, Section, Course, Track } from "./curriculumTypes";
export {
  slugify,
  stripAfterComma,
  isLessonDone,
  setLessonDone,
  sectionProgress,
  courseTotals,
} from "./curriculumTypes";

import type { Track, Section, Lesson } from "./curriculumTypes";

// 1) Curso único (prioritário)
import { tracks as fullStackTracks } from "../content/en/fullstack";

// 2) Fallback: catálogo gerado automaticamente pelo script (29 trilhas FCC)
import { tracks as generatedTracks } from "../content/en/index";

// ---------- Catálogo efetivo ----------
const catalog: Track[] =
  (fullStackTracks && fullStackTracks.length ? fullStackTracks : generatedTracks) ?? [];

// ---------- API pública do loader ----------
/** Lista todas as trilhas (no nosso caso, 1: Full Stack Developer). */
export function loadTracks(): Track[] {
  return catalog;
}

/** Busca uma trilha pelo id (ex.: "full-stack"). */
export function getTrackById(id?: string | null): Track | null {
  if (!id) return null;
  return catalog.find((t) => t.id === id) ?? null;
}

/** Retorna o id da primeira trilha disponível (fallback). */
export function getFirstTrackId(): string | null {
  return catalog[0]?.id ?? null;
}

/** Pega o primeiro lessonId de um Course (1ª seção) OU de uma Section. */
export function getFirstLessonId(
  arg: { sections?: Section[]; lessons?: Lesson[] }
): string | null {
  if ("sections" in arg && arg.sections?.[0]?.lessons?.[0]) {
    return arg.sections[0].lessons[0].id;
  }
  if ("lessons" in arg && arg.lessons?.[0]) {
    return arg.lessons[0].id;
  }
  return null;
}
