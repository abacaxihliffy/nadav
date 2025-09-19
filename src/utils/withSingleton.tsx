import { useEffect, useState } from "react";

/**
 * Garante que só UMA instância do componente renderize.
 * A 2ª instância monta mas retorna null – sem mudar a ordem de hooks.
 */
export function withSingleton<P>(name: string, Comp: React.ComponentType<P>) {
  const key = `__dc_singleton_${name}`;
  return function SingletonComp(props: P) {
    const [ok, setOk] = useState(false);

    useEffect(() => {
      const w = window as any;
      if (w[key]) return;        // já existe; esta instância não renderiza
      w[key] = true;             // reserva a vaga
      setOk(true);
      // sem cleanup! não "libera a vaga" para evitar flapping em HMR
    }, []);

    if (!ok) return null;
    return <Comp {...props} />;
  };
}
