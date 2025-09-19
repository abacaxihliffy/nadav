// src/pages/News.tsx
import { useMemo, useState } from "react";

type Article = {
  id: string;
  title: string;
  source: string;
  date: string; // ISO ou "2025-09-18"
  url: string;
  category: "Frontend" | "JavaScript" | "CSS" | "React" | "DevTools" | "General";
};

const MOCK: Article[] = [
  {
    id: "1",
    title: "Novidades do React 19: ações, use, e melhorias no SSR",
    source: "React Blog",
    date: "2025-07-02",
    url: "https://react.dev/",
    category: "React",
  },
  {
    id: "2",
    title: "Vite 6: build ainda mais rápido e DX refinada",
    source: "Vite",
    date: "2025-06-15",
    url: "https://vitejs.dev/",
    category: "DevTools",
  },
  {
    id: "3",
    title: "Nova proposta do TC39 para Anotações de Tipos em JS",
    source: "TC39",
    date: "2025-05-10",
    url: "https://tc39.es/",
    category: "JavaScript",
  },
  {
    id: "4",
    title: "Container Queries no CSS: padrões e casos de uso",
    source: "Web.dev",
    date: "2025-04-20",
    url: "https://web.dev/",
    category: "CSS",
  },
  {
    id: "5",
    title: "Acessibilidade na prática: padrões ARIA modernos",
    source: "MDN",
    date: "2025-03-12",
    url: "https://developer.mozilla.org/",
    category: "Frontend",
  },
  {
    id: "6",
    title: "Ferramentas de inspeção: Profiler e Coverage na DevTools",
    source: "Chrome DevTools",
    date: "2025-02-28",
    url: "https://developer.chrome.com/",
    category: "DevTools",
  },
];

const CATEGORIES: Array<Article["category"] | "Todos"> = [
  "Todos",
  "Frontend",
  "JavaScript",
  "CSS",
  "React",
  "DevTools",
  "General",
];

export default function News() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todos");
  const [sort, setSort] = useState<"new" | "old">("new");

  const items = useMemo(() => {
    let arr = [...MOCK];

    // filtro por categoria
    if (cat !== "Todos") {
      arr = arr.filter((a) => a.category === cat);
    }

    // busca por título/fonte
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }

    // ordenação por data
    arr.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === "new" ? db - da : da - db;
    });

    return arr;
  }, [query, cat, sort]);

  return (
    <div className="container-lg py-10 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">News</h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Atualizações e artigos sobre front-end, JS, React e ferramentas.
          </p>
        </div>

        {/* Filtros principais */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Categorias como “pílulas” */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition ${
                    active
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barra de busca + ordenação */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título ou fonte…"
          className="w-full sm:w-80 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600 dark:text-zinc-300">
            Ordenar:
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "new" | "old")}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700"
          >
            <option value="new">Mais recentes</option>
            <option value="old">Mais antigas</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      <ul className="grid gap-3">
        {items.map((a) => (
          <li key={a.id} className="card p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="min-w-0">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold hover:underline"
                  title={a.title}
                >
                  {a.title}
                </a>
                <div className="text-sm text-zinc-500">
                  {a.source} •{" "}
                  {new Date(a.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}{" "}
                  • {a.category}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-ghost"
                  aria-label={`Abrir "${a.title}"`}
                >
                  Ler →
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Estado vazio */}
      {items.length === 0 && (
        <div className="card p-6 text-center text-zinc-600 dark:text-zinc-300">
          Nenhum artigo encontrado para os filtros atuais.
        </div>
      )}
    </div>
  );
}
