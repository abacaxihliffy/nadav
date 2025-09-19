// src/pages/Learn.tsx
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { loadTracks } from "../utils/loadCurriculum";
import type { Track, Course, Section, Lesson } from "../utils/loadCurriculum";

function flatLessonsFromTrack(track: Track): Lesson[] {
  const byCourses = track.courses?.flatMap(
    (c) => c.sections?.flatMap((s) => s.lessons ?? []) ?? []
  );
  // fallback para modelos antigos (sem courses/sections)
  // @ts-ignore
  const legacy = (track as any).lessons as Lesson[] | undefined;
  return (byCourses?.length ? byCourses : legacy) ?? [];
}

export default function Learn() {
  const tracks = useMemo(() => loadTracks(), []);
  const singleTrack = tracks.length === 1 ? tracks[0] : null;

  // Caso ainda tenha várias trilhas algum dia, mantemos compatível
  const [activeTrackId, setActiveTrackId] = useState<string>(
    singleTrack?.id ?? tracks[0]?.id ?? ""
  );
  const activeTrack: Track | null = useMemo(
    () => tracks.find((t) => t.id === activeTrackId) ?? null,
    [tracks, activeTrackId]
  );

  const [openCourseId, setOpenCourseId] = useState<string | null>(null);

  if (!activeTrack) {
    return (
      <div className="container-lg py-10">
        <h2 className="text-2xl font-bold mb-2">Nada para exibir</h2>
        <p className="text-zinc-600 dark:text-zinc-300">
          Não encontramos conteúdo nesta trilha.
        </p>
      </div>
    );
  }

  const allLessons = flatLessonsFromTrack(activeTrack);
  const total = allLessons.length;

  return (
    <div className="container-lg py-10 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            {singleTrack ? activeTrack.title : "Learning Path"}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            {singleTrack
              ? "Seu curso completo — navegue pelas matérias e submatérias."
              : "Selecione uma trilha e continue seu progresso."}
          </p>
        </div>

        {/* Seletor só aparece quando houver mais de uma trilha */}
        {!singleTrack && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-zinc-600 dark:text-zinc-300">
              Trilha:
            </label>
            <select
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
              value={activeTrackId}
              onChange={(e) => setActiveTrackId(e.target.value)}
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Resumo do curso */}
      <div className="card p-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg truncate">{activeTrack.title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {total} lições (somando todas as matérias)
            </p>
          </div>
          <Link to="/curriculum" className="btn-ghost">
            Ver Curriculum
          </Link>
        </div>
        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded overflow-hidden">
          <div className="h-full bg-indigo-600" style={{ width: "0%" }} />
        </div>
      </div>

      {/* Matérias (Courses) */}
      <div className="grid gap-4">
        {(activeTrack.courses ?? []).map((course: Course) => {
          const lessonsInCourse =
            course.sections?.flatMap((s) => s.lessons ?? []) ?? [];
          const sectionsCount = course.sections?.length ?? 0;
          const lessonsCount = lessonsInCourse.length;
          const isOpen = openCourseId === course.id;

          return (
            <article key={course.id} className="card">
              <button
                className="w-full text-left p-5 flex items-center justify-between"
                onClick={() => setOpenCourseId(isOpen ? null : course.id)}
                aria-expanded={isOpen}
              >
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {sectionsCount} submatéria{sectionsCount === 1 ? "" : "s"} •{" "}
                    {lessonsCount} lição{lessonsCount === 1 ? "" : "es"}
                  </p>
                </div>
                <span className="text-zinc-500">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 p-5">
                  <ul className="grid gap-3">
                    {(course.sections ?? []).map((sec: Section) => {
                      const count = sec.lessons?.length ?? 0;
                      return (
                        <li key={sec.id} className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <h3 className="font-medium">{sec.title}</h3>
                              <p className="text-xs text-zinc-500">
                                {count} lição{count === 1 ? "" : "es"}
                              </p>
                            </div>
                            {/* Quando começarmos a popular lessons, esse botão pode levar para a 1ª lição. */}
                            <button className="btn-ghost">Abrir</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
