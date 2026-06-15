// ─────────────────────────────────────────────
//  Caché usando Cache API de Cloudflare Workers
// ─────────────────────────────────────────────
//
//  `caches.default` es un objeto global que Workers provee sin configurar nada.
//  Funciona como un cache HTTP — guarda Responses y las devuelve por URL.
//
//  Usamos una URL falsa como clave ("http://cache/live-matches")
//  porque Cache API está diseñada para cachear respuestas HTTP,
//  no strings arbitrarios como KV. La URL no tiene que existir,
//  solo sirve como identificador único.

const CACHE_HOST = "http://cache";

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
): Promise<T> {
  const cache = caches.default;
  const cacheKey = new Request(`${CACHE_HOST}/${key}`);

  // Intentamos leer del cache
  const hit = await cache.match(cacheKey);

  // Si existe el dato, lo tramos como JSON y lo devolvemos
  if (hit) {
    console.log(`[cache] HIT  "${key}"`);
    return hit.json() as Promise<T>;
  }

  // No había nada — llamamos a la función real
  console.log(`[cache] MISS "${key}" — llamando a la API...`);
  const data = await fn();

  // Guardamos la respuesta en el cache con el TTL como Cache-Control
  // Cloudflare lee el header max-age y expira la entrada automáticamente
  await cache.put(
    cacheKey,
    new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `max-age=${ttlSeconds}`,
      },
    }),
  );

  return data;
}
