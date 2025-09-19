// src/pages/Lesson.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import yaml from "js-yaml";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
// import rehypeSanitize from "rehype-sanitize"; // opcional, se endurecer segurança
import { loadTracks } from "../utils/loadCurriculum";
import ChallengeRunner from "../components/ChallengeRunner";
import LessonOutline from "../components/LessonOutline";

type Parsed =
  | {
      title: string;
      description?: string;
      instructions?: string;
      hints?: string;
      seed?: string;
      tests?: string;
      solutions?: string;
    }
  | null;

/* ---------------- Parser estilo FCC ---------------- */
function parseFccMd(raw: string, lessonId: string): Parsed {
  let content = raw;

  // frontmatter YAML
  let metaTitle: string | undefined;
  const fm = content.match(/^---\s*([\s\S]*?)\s*---\s*/);
  if (fm) {
    try {
      const meta: any = yaml.load(fm[1]) ?? {};
      if (meta?.title) metaTitle = String(meta.title);
    } catch {
      /* ignore */
    }
    content = content.slice(fm[0].length);
  }

  // seções "# --section--"
  const sectionRegex = /^#{1,6}\s+--([a-z-]+)--\s*$/gim;
  const sections: { key: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = sectionRegex.exec(content))) {
    sections.push({ key: m[1].toLowerCase(), start: m.index, end: -1 });
  }
  for (let i = 0; i < sections.length; i++) {
    sections[i].end = i < sections.length - 1 ? sections[i + 1].start : content.length;
  }
  const getBody = (key: string) => {
    const s = sections.find((x) => x.key === key);
    if (!s) return undefined;
    const slice = content.slice(s.start, s.end);
    return slice.replace(/^#{1,6}\s+--[a-z-]+--\s*$/im, "").trim();
  };

  // título
  let title = metaTitle;
  if (!title) {
    const h1 = content.match(/^#\s+(?!--)[^\n]+$/m);
    if (h1) title = h1[0].replace(/^#\s+/, "").trim();
  }
  if (!title) title = lessonId;

  return {
    title,
    description: getBody("description"),
    instructions: getBody("instructions"),
    hints: getBody("hints"),
    seed: getBody("seed"),
    tests: getBody("tests"),
    solutions: getBody("solutions"),
  };
}

/* --------------- Helpers: seed/tests/hints --------------- */
function extractFirstCodeBlock(md: string | undefined) {
  if (!md) return null;
  const m = md.match(/```([a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/m);
  if (m) return { lang: (m[1] || "").toLowerCase(), code: m[2] };
  return { lang: "", code: md.trim() };
}

// pega blocos ```js ... ``` dentro de um markdown
function extractJsBlocks(md?: string) {
  if (!md) return [] as string[];
  const out: string[] = [];
  const re = /```(?:js|javascript)\s*\n([\s\S]*?)```/gim;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) out.push(m[1].trim());
  return out;
}

// converte 'assert.*' em expressão booleana para o runner
function assertToRun(expr: string) {
  const s = expr.replace(/;\s*$/, "").trim();

  if (/assert\.match\s*\(/i.test(s)) {
    const m = s.match(/^assert\.match\s*\(\s*code\s*,\s*(.+)\)\s*;?$/i);
    if (m) return `${m[1]}.test(code)`;
  }
  if (/assert\.equal\s*\(/i.test(s)) {
    const m = s.match(/^assert\.equal\s*\((.+?),\s*(.+?)\)\s*;?$/i);
    if (m) return `(${m[1]}) === (${m[2]})`;
  }
  if (/assert\.strictEqual\s*\(/i.test(s)) {
    const m = s.match(/^assert\.strictEqual\s*\((.+?),\s*(.+?)\)\s*;?$/i);
    if (m) return `(${m[1]}) === (${m[2]})`;
  }
  if (/assert\.isTrue\s*\(/i.test(s)) {
    const m = s.match(/^assert\.isTrue\s*\((.+)\)\s*;?$/i);
    if (m) return `!!(${m[1]})`;
  }
  if (/assert\.isFalse\s*\(/i.test(s)) {
    const m = s.match(/^assert\.isFalse\s*\((.+)\)\s*;?$/i);
    if (m) return `!(${m[1]})`;
  }
  if (/assert\.include\s*\(/i.test(s)) {
    const m = s.match(/^assert\.include\s*\((.+?),\s*(.+?)\)\s*;?$/i);
    if (m) return `(${m[1]}).includes(${m[2]})`;
  }

  // fallback: remove "assert." e deixa a expressão
  return s.replace(/^assert\./, "").replace(/\)\s*;?$/, ")");
}

/* -------------------- Componente -------------------- */
export default function Lesson() {
  const { trackId = "", lessonId = "" } = useParams();
  const navigate = useNavigate();

  // trilhas para prev/next
  const tracks = useMemo(() => loadTracks(), []);
  const currentTrack = tracks.find((t) => t.id === trackId) || null;
  const lessonIndex =
    currentTrack?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson =
    lessonIndex > 0 ? currentTrack!.lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex >= 0 &&
    lessonIndex < (currentTrack?.lessons.length ?? 0) - 1
      ? currentTrack!.lessons[lessonIndex + 1]
      : null;

  // estado
  const [loading, setLoading] = useState(true);
  const [parsed, setParsed] = useState<Parsed>(null);
  const [error, setError] = useState<string | null>(null);

  // globs lazy
  const mdModules = useMemo(
    () =>
      import.meta.glob("../content/en/**/blocks/**/*.md", {
        as: "raw",
        eager: false,
      }) as Record<string, () => Promise<string>>,
    []
  );
  const ymlModules = useMemo(
    () =>
      import.meta.glob("../content/en/**/blocks/**/*.{yml,yaml}", {
        as: "raw",
        eager: false,
      }) as Record<string, () => Promise<string>>,
    []
  );

  // buscar arquivo de forma mais robusta: tenta combinar /{trackId}/.../{lessonId}.md
  const findMdCandidate = useCallback(() => {
    const lid = lessonId.toLowerCase();
    const candidates = Object.keys(mdModules).filter(
      (k) =>
        k.includes(`/${trackId}/`) &&
        (k.toLowerCase().endsWith(`${lid}.md`) ||
          k.toLowerCase().includes(`/${lid}`))
    );
    // preferir arquivo que termina com {lessonId}.md
    candidates.sort(
      (a, b) =>
        Number(b.toLowerCase().endsWith(`${lid}.md`)) -
        Number(a.toLowerCase().endsWith(`${lid}.md`))
    );
    return candidates[0];
  }, [mdModules, trackId, lessonId]);

  // carregar conteúdo da lição
  useEffect(() => {
    let cancelled = false;

    async function loadLesson() {
      try {
        setLoading(true);
        setError(null);
        setParsed(null);

        // tenta .md
        const mdKey = findMdCandidate();
        if (mdKey) {
          const raw = await mdModules[mdKey]();
          if (cancelled) return;
          setParsed(parseFccMd(raw, lessonId));
          setLoading(false);
          return;
        }

        // tenta .yml
        const ymlCandidates = Object.keys(ymlModules).filter((k) =>
          k.includes(`/${trackId}/`)
        );
        for (const k of ymlCandidates) {
          const raw = await ymlModules[k]();
          if (cancelled) return;
          try {
            const doc: any = yaml.load(raw);
            if (doc?.id === lessonId) {
              setParsed({
                title: doc.title || "Lesson",
                description: Array.isArray(doc.description)
                  ? doc.description.join("\n\n")
                  : doc.description,
                instructions: Array.isArray(doc.instructions)
                  ? doc.instructions.join("\n\n")
                  : doc.instructions,
                hints: Array.isArray(doc.hints)
                  ? doc.hints.join("\n\n")
                  : doc.hints,
                seed: Array.isArray(doc.seed)
                  ? doc.seed.join("\n\n")
                  : doc.seed,
                tests: Array.isArray(doc.tests)
                  ? doc.tests.join("\n\n")
                  : doc.tests,
                solutions: Array.isArray(doc.solutions)
                  ? doc.solutions.join("\n\n")
                  : doc.solutions,
              });
              setLoading(false);
              return;
            }
          } catch {
            /* continua procurando */
          }
        }

        setParsed(null);
        setLoading(false);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Falha ao carregar a lição.");
          setLoading(false);
        }
      }
    }

    loadLesson();

    // rolar pro topo a cada mudança
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      cancelled = true;
    };
  }, [trackId, lessonId, findMdCandidate, mdModules, ymlModules]);

  // título da aba: depende do parsed
  useEffect(() => {
    document.title = parsed?.title
      ? `${parsed.title} — DevCodeHub`
      : "Lesson — DevCodeHub";
  }, [parsed?.title]);

  // atalhos de teclado: ← / → para navegar entre lições
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevLesson) {
        navigate(`/learn/${trackId}/${prevLesson.id}`);
      } else if (e.key === "ArrowRight" && nextLesson) {
        navigate(`/learn/${trackId}/${nextLesson.id}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, nextLesson, prevLesson, trackId]);

  /* ---- estados ---- */
  if (loading)
    return (
      <div className="container-lg py-10">
        <div className="h-6 w-40 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container-lg py-10">
        <div className="rounded-xl border border-red-300 bg-red-50 text-red-800 px-4 py-3">
          Erro: {error}
        </div>
      </div>
    );

  if (!parsed)
    return (
      <div className="container-lg py-10 space-y-4">
        <h1 className="text-2xl font-bold">Lição não encontrada</h1>
        <p className="text-zinc-500">
          Volte para o{" "}
          <Link to="/curriculum" className="text-indigo-600 hover:underline">
            Curriculum
          </Link>
          .
        </p>
      </div>
    );

  /* ---- preparar runner ---- */
  const seedInfo = extractFirstCodeBlock(parsed.seed);
  let testsList: { desc: string; run: string }[] = [];
  try {
    if (parsed.tests) {
      const loaded = yaml.load(parsed.tests);
      if (Array.isArray(loaded)) testsList = loaded as any;
    }
  } catch {
    /* ignore */
  }

  // se não tem tests, gera dos hints
  if (testsList.length === 0 && parsed.hints) {
    const blocks = extractJsBlocks(parsed.hints);
    testsList = blocks.map((code, i) => ({
      desc: `Hint ${i + 1}`,
      run: assertToRun(code),
    }));
  }

  // detecção de HTML (mais ampla)
  const looksLikeHtml =
    seedInfo?.lang === "html" ||
    /<\s*(html|head|body|div|p|h[1-6]|style|script)\b/i.test(
      seedInfo?.code || ""
    ) ||
    /document\.querySelector|getComputedStyle/i.test(parsed.hints || "");
  const language = (looksLikeHtml ? "html" : "javascript") as
    | "javascript"
    | "html";

  const htmlTemplate =
    language === "html"
      ? `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body><!-- __CODE__ --></body></html>`
      : undefined;

  /* ----------------- RENDER ----------------- */
  return (
    <div className="container-lg py-10">
      <div className="flex">
        {/* Sidebar com outline da trilha (desktop) */}
        {currentTrack && (
          <LessonOutline track={currentTrack} currentLessonId={lessonId} />
        )}

        {/* Conteúdo principal */}
        <div className="min-w-0 flex-1 space-y-8">
          {/* breadcrumb */}
          <nav className="text-sm text-zinc-500">
            <Link to="/curriculum" className="text-indigo-600 hover:underline">
              Curriculum
            </Link>
            <span className="mx-2">/</span>
            <Link
              to={`/learn/${trackId}`}
              className="text-indigo-600 hover:underline"
            >
              {currentTrack?.title ?? trackId}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-800 dark:text-zinc-200">
              {parsed.title}
            </span>
          </nav>

          {/* título */}
          <h1 className="text-3xl md:text-4xl font-extrabold">
            {parsed.title}
          </h1>

          {/* descrição / instruções / dicas */}
          <div className="grid md:grid-cols-2 gap-8">
            {parsed.description && (
              <section className="card p-6">
                <h2 className="text-xl font-semibold mb-3">Descrição</h2>
                <div className="prose-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    // rehypePlugins={[rehypeRaw, rehypeSanitize]} // se ativar sanitize, adicione aqui
                  >
                    {parsed.description}
                  </ReactMarkdown>
                </div>
              </section>
            )}

            {parsed.instructions && (
              <section className="card p-6">
                <h2 className="text-xl font-semibold mb-3">Instruções</h2>
                <div className="prose-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {parsed.instructions}
                  </ReactMarkdown>
                </div>
              </section>
            )}

            {parsed.hints && (
              <section className="card p-6 md:col-span-2">
                <h2 className="text-xl font-semibold mb-3">Dicas</h2>
                <div className="prose-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {parsed.hints}
                  </ReactMarkdown>
                </div>
              </section>
            )}
          </div>

          {/* editor + preview */}
          {(seedInfo?.code || testsList.length > 0) && (
            <section className="card p-6">
              <h2 className="text-xl font-semibold mb-3">Editor</h2>
              <ChallengeRunner
                language={language}
                seed={seedInfo?.code || ""}
                tests={testsList}
                htmlTemplate={htmlTemplate}
              />
            </section>
          )}

          {/* navegação */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800">
            {prevLesson ? (
              <Link
                to={`/learn/${trackId}/${prevLesson.id}`}
                className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                ← {prevLesson.title}
              </Link>
            ) : (
              <span />
            )}

            {nextLesson ? (
              <Link
                to={`/learn/${trackId}/${nextLesson.id}`}
                className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                {nextLesson.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
