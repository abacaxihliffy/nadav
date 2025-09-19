import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="border-b border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-950/30">
        <div className="container-lg py-16 md:py-24 grid gap-10 md:gap-12 md:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-zinc-300 dark:ring-zinc-700 mb-4">
              <span>FCC-style Curriculum Runner</span>
              <span className="hidden sm:inline text-zinc-400">•</span>
              <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">Editor + Preview em tempo real</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Aprenda construindo projetos com <span className="text-indigo-600">feedback imediato</span>.
            </h1>

            <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-300 max-w-prose">
              O DevCodeHub carrega desafios do freeCodeCamp, edita com Monaco Editor e mostra o preview ao vivo —
              tudo no navegador. Sem instalar nada.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/curriculum" className="btn-primary px-5 py-3 rounded-xl">
                Ver Curriculum
              </Link>
              <Link to="/learn/responsive-web-design" className="btn-ghost px-5 py-3 rounded-xl">
                Start Learning
              </Link>
            </div>

            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Dica: comece por <em>Scientific Computing with Python Certification</em> e avance no seu ritmo.
            </p>
          </div>

          {/* Ilustração / placeholder */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-grid card flex items-center justify-center">
              <span className="text-7xl">{"</>"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-lg py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold">Por que DevCodeHub?</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-prose">
          Conjunto de ferramentas pensado para aprender rápido e publicar projetos reais.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="card p-6">
            <h3 className="text-lg font-semibold">Editor + Preview</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              Monaco Editor integrado e preview em tempo real — veja o resultado do seu código na hora.
            </p>
          </article>

          <article className="card p-6">
            <h3 className="text-lg font-semibold">Desafios FCC</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              Trilhas do freeCodeCamp carregadas direto do conteúdo oficial, com progresso local.
            </p>
          </article>

          <article className="card p-6">
            <h3 className="text-lg font-semibold">Projetos Guiados</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              Roteiros passo-a-passo, exemplos de solução e testes automáticos quando disponíveis.
            </p>
          </article>

          <article className="card p-6">
            <h3 className="text-lg font-semibold">Dark Mode</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              Design focado em leitura no escuro, com contraste adequado e tipografia confortável.
            </p>
          </article>

          <article className="card p-6">
            <h3 className="text-lg font-semibold">Navegação Clara</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              Navbar fixa, CTA visível e atalhos para a próxima lição.
            </p>
          </article>

          <article className="card p-6">
            <h3 className="text-lg font-semibold">Performance</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              Vite + React com carregamento inteligente de trilhas para navegação fluida.
            </p>
          </article>
        </div>
      </section>

      {/* TEASER DE CURRICULUM */}
      <section className="border-y border-zinc-200/60 dark:border-zinc-800/60">
        <div className="container-lg py-14 md:py-16 grid gap-8 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold">Trilhas de aprendizado</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-prose">
              Comece por <strong>Responsive Web Design</strong> ou vá direto para
              <strong> Scientific Computing with Python</strong>. Seu progresso fica salvo no navegador.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/curriculum" className="btn-outline px-4 py-2 rounded-lg">Explorar trilhas</Link>
              <Link to="/learn/responsive-web-design" className="btn-primary px-4 py-2 rounded-lg">Primeira lição</Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-[16/10] rounded-2xl bg-grid card flex items-center justify-center">
              <span className="text-xl">Preview das lições</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-lg py-14 md:py-16">
        <div className="cta-strip">
          <div>
            <h3 className="text-xl md:text-2xl font-bold">Pronto para começar?</h3>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300">
              Leva menos de 1 minuto para abrir a primeira lição.
            </p>
          </div>
          <Link to="/learn/responsive-web-design" className="btn-primary px-5 py-3 rounded-xl self-start">
            Começar agora
          </Link>
        </div>
      </section>
    </div>
  );
}
