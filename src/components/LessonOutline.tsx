// src/components/LessonOutline.tsx
import { Link } from "react-router-dom";
import type { Track } from "../utils/loadCurriculum";
import { isLessonDone } from "../utils/progress";

export default function LessonOutline({
  track,
  currentLessonId,
}: {
  track: Track;
  currentLessonId: string;
}) {
  return (
    <aside className="hidden lg:block w-72 shrink-0 border-r pr-4 mr-8">
      <h3 className="text-sm font-semibold mb-3">{track.title}</h3>
      <ol className="space-y-1 text-sm">
        {track.lessons.map((l, idx) => {
          const done = isLessonDone(track.id, l.id);
          const active = l.id === currentLessonId;
          return (
            <li key={l.id}>
              <Link
                to={`/learn/${track.id}/${l.id}`}
                className={`flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-50 ${
                  active ? "bg-gray-100 font-medium" : ""
                }`}
              >
                <span className="w-5 text-center">{done ? "✅" : idx + 1}</span>
                <span className="line-clamp-1">{l.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
