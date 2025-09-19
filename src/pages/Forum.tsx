// src/pages/Forum.tsx
export default function Forum() {
  return (
    <div className="container-lg py-10 space-y-6">
      <section aria-labelledby="forum-title">
        <h2 id="forum-title" className="text-3xl md:text-4xl font-extrabold">
          Forum
        </h2>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl">section
          Bem-vindo ao <strong>DevCodeHub Forum</strong> — seu espaço para
          aprender, tirar dúvidas e compartilhar conhecimento com a comunidade.
        </p>
      </section>

      <section className="card p-6">
        <h3 className="text-xl font-semibold mb-3">Em breve</h3>
        <p className="text-zinc-600 dark:text-zinc-300">
          A área de discussões ainda está em construção. Em breve você poderá
          criar tópicos, responder e interagir com outros devs por aqui.
        </p>
      </section>
    </div>
  );
}
