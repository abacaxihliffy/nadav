import { useMemo } from "react";
import { Link } from "react-router-dom";
import { loadTracks, getFirstLessonId } from "../utils/loadCurriculum";
import { withSingleton } from "../utils/withSingleton";
// (opcional) logs de debug
import { useMountLog, useRenderLog } from "../debugMount";

function FooterImpl() {
  useMountLog?.("Footer");
  useRenderLog?.("Footer");

  const year = new Date().getFullYear();

  const { firstTrack, firstLessonId } = useMemo(() => {
    const tracks = loadTracks();
    const ft = tracks[0];
    return {
      firstTrack: ft || null,
      firstLessonId: ft ? getFirstLessonId(ft) : null,
    };
  }, []);

  const linkCls =
    "hover:underline focus:underline outline-none rounded-sm " +
    "text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white " +
    "focus-visible:ring-2 focus-visible:ring-indigo-500/60";

  return (
    <footer
      id="app-footer"
      className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      aria-labelledby="footer-brand"
    >
      <div className="container-lg py-12 grid gap-10 md:grid-cols-4 text-sm">
        {/* Marca */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img
              src="/devcodehub.svg"
              alt="DevCodeHub logo"
              className="w-8 h-8 rounded-lg"
              loading="lazy"
            />
            <span
              id="footer-brand"
              className="font-semibold text-lg text-zinc-900 dark:text-zinc-100"
            >
              DevCodeHub
            </span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-300">
            Aprenda a programar com desafios práticos e feedback imediato.
          </p>
        </div>

        {/* Curriculum */}
        <nav aria-labelledby="footer-curriculum">
          <h4
            id="footer-curriculum"
            className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3"
          >
            Curriculum
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/curriculum" className={linkCls}>
                Trilhas
              </Link>
            </li>
            {firstTrack && (
              <li>
                <Link to={`/learn/${firstTrack.id}`} className={linkCls}>
                  {firstTrack.title}
                </Link>
              </li>
            )}
            {firstTrack && firstLessonId && (
              <li>
                <Link
                  to={`/learn/${firstTrack.id}/${firstLessonId}`}
                  className={linkCls}
                >
                  Primeira lição
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Comunidade */}
        <nav aria-labelledby="footer-community">
          <h4
            id="footer-community"
            className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3"
          >
            Comunidade
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/forum" className={linkCls}>
                Forum
              </Link>
            </li>
            <li>
              <Link to="/news" className={linkCls}>
                News
              </Link>
            </li>
          </ul>
        </nav>

        {/* Social */}
        <nav aria-labelledby="footer-social">
          <h4
            id="footer-social"
            className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3"
          >
            Social
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                Twitter
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="container-lg py-6 text-center text-xs text-zinc-600 dark:text-zinc-400">
          © {year} DevCodeHub. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

export default withSingleton("Footer", FooterImpl);
