// src/components/ChallengeRunner.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Editor from "@monaco-editor/react";

type Test = { desc: string; run: string };

type Props = {
  language?: "html" | "javascript";
  seed: string;
  tests?: Test[];
  /** Para HTML: se fornecido, o código do aluno substitui <!-- __CODE__ --> */
  htmlTemplate?: string;
};

export default function ChallengeRunner({
  language = "javascript",
  seed,
  tests = [],
  htmlTemplate
}: Props) {
  const [code, setCode] = useState<string>(seed);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{ desc: string; pass: boolean; err?: string }[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // --------- helpers ---------
  const writePreview = useCallback(
    (src: string) => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      doc.open();
      doc.write(src);
      doc.close();
    },
    []
  );

  const makeHtml = useCallback(
    (user: string) => {
      if (htmlTemplate && htmlTemplate.includes("<!-- __CODE__ -->")) {
        return htmlTemplate.replace("<!-- __CODE__ -->", user);
      }
      // template padrão
      if (/<!doctype|<html/i.test(user)) return user;
      return `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
${user}
  </body>
</html>`;
    },
    [htmlTemplate]
  );

  // --------- live preview ---------
  useEffect(() => {
    if (language !== "html") return;
    const id = setTimeout(() => writePreview(makeHtml(code)), 120);
    return () => clearTimeout(id);
  }, [code, language, makeHtml, writePreview]);

  // Primeiro render
  useEffect(() => {
    if (language === "html") writePreview(makeHtml(code));
  }, [language, makeHtml, writePreview]);

  // --------- Run Tests ----------
  const runTests = useCallback(async () => {
    setRunning(true);
    const newResults: { desc: string; pass: boolean; err?: string }[] = [];

    // helpers básicos disponíveis em todos os desafios
    const helpers = `
      function isSorted(a){ for(let i=0;i<a.length-1;i++){ if(a[i]>a[i+1]) return false; } return true; }
    `;

    const execIn = language === "html" ? iframeRef.current?.contentWindow : window;

    for (const t of tests) {
      try {
        if (!execIn) throw new Error("Preview not ready");

        // Para HTML: rodamos DENTRO do iframe (DOM disponível) e
        // também expomos 'code' (string do HTML) para regex.
        const fn = new (execIn as any).Function(
          "code",
          `${helpers}\n/* user code string in 'code' */\nreturn (${t.run});`
        );

        const result = fn(code);
        const pass = result instanceof Promise ? !!(await result) : !!result;
        newResults.push({ desc: t.desc, pass });
      } catch (e: any) {
        newResults.push({ desc: t.desc, pass: false, err: e?.message || String(e) });
      }
    }

    setResults(newResults);
    setRunning(false);
  }, [tests, language, code]);

  // --------- keyboard: Ctrl+Enter -> run tests ---------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runTests();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runTests]);

  // --------- UI ---------
  const filename = language === "html" ? "index.html" : "index.js";
  const editorLang = language === "html" ? "html" : "javascript";

  return (
    <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[520px]">
      {/* LEFT: Editor + actions + results */}
      <div className="flex flex-col border rounded overflow-hidden">
        {/* header */}
        <div className="px-3 py-2 border-b bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-sm font-medium">{filename}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={runTests}
              disabled={running}
              className="px-3 py-1.5 rounded border hover:bg-gray-50"
              title="Ctrl + Enter"
            >
              {running ? "Running…" : "Check Your Code (Ctrl + Enter)"}
            </button>
            <button
              onClick={() => {
                setCode(seed);
                setResults([]);
              }}
              className="px-3 py-1.5 rounded border hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* editor */}
        <div className="grow">
          <Editor
            height="360px"
            defaultLanguage={editorLang}
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              tabSize: 2,
              insertSpaces: true,
              scrollBeyondLastLine: false
            }}
          />
        </div>

        {/* test results */}
        <div className="border-t">
          <div className="px-3 py-2 text-sm border-b bg-slate-50">Tests</div>
          <ul className="p-3 space-y-2 text-sm">
            {tests.length === 0 && (
              <li className="text-gray-500">No tests provided for this challenge.</li>
            )}
            {tests.map((t, i) => {
              const r = results[i];
              const state =
                r?.pass === true ? "text-green-700" : r ? "text-red-700" : "text-gray-600";
              const icon = r?.pass === true ? "✅" : r ? "❌" : "•";
              return (
                <li key={i} className={state}>
                  {icon} {t.desc}
                  {r?.err && <div className="text-xs text-gray-600">({r.err})</div>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* RIGHT: Preview */}
      <div className="border rounded overflow-hidden bg-white">
        <div className="px-3 py-2 text-sm border-b bg-slate-50">Preview</div>
        <iframe ref={iframeRef} className="w-full h-[560px] bg-white" />
      </div>
    </div>
  );
}
