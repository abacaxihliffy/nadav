// src/debugMount.ts
import { useEffect, useRef } from "react";

/** Loga 1x quando o componente monta (com contador acumulado por nome) */
export function useMountLog(name: string) {
  useEffect(() => {
    (window as any).__dc_mounts ??= {};
    (window as any).__dc_mounts[name] ??= 0;
    (window as any).__dc_mounts[name] += 1;
    const n = (window as any).__dc_mounts[name];
    const stack = new Error().stack?.split("\n").slice(2, 6).join("\n");
    // eslint-disable-next-line no-console
    console.log(`[MOUNT] ${name} #${n}`, stack);
  }, []);
}

/** Loga a cada render (útil pra ver re-renders) */
export function useRenderLog(name: string) {
  const renders = useRef(0);
  renders.current += 1;
  // eslint-disable-next-line no-console
  console.log(`[RENDER] ${name} ${renders.current}`);
}
