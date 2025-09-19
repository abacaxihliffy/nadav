// src/pages/Curriculum.tsx
import { Link } from "react-router-dom";
import { loadTracks } from "../utils/loadCurriculum";

export default function Curriculum() {
  const tracks = loadTracks();

  return (
    <div className="container-lg py-10 space-y-8">
      <section aria-labelledby="curr-title">
        <h1 id="curr-title" className="text-3xl md:text-4xl font-extrabold">
          Curriculum
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl">
          Escolha uma trilha de aprendizado e comece a evoluir 🚀
        </p>
      </section>

      {tracks.length === 0 ? (
        <div className="card p-6 text-zinc-600 dark:text-zinc-300">
          Nenhuma trilha encontrada.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tracks.map((track) => (
            <article
              key={track.id}
              className="card p-6 hover:shadow-lg transition"
              aria-labelledby={`track-${track.id}`}
            >
              <h2 id={`track-${track.id}`} className="text-xl font-semibold">
                {track.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {track.hours} horas {track.cert ? "• Certificação incluída" : ""}
              </p>

              <div className="mt-4">
                <Link
                  to={`/learn/${track.id}`}
                  className="btn-primary px-4 py-2 rounded-lg"
                >
                  Acessar trilha
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
