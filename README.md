# Mundial al Día

Mundial al Día es una pequeña aplicación server-side que muestra partidos en vivo del Mundial 2026. Está construida como un Worker de Cloudflare usando `Hono` y `TypeScript`, con renderizado HTML en el servidor (sin framework cliente pesado). El objetivo es ofrecer una experiencia rápida, accesible y con actualizaciones en tiempo real de resultados y estados de partido.

**Estado**: prototipo funcional — listo para desplegar en Cloudflare Workers.

**Stack principal**

- **Runtime**: Cloudflare Workers
- **Framework HTTP**: `hono`
- **Lenguaje**: `TypeScript` (JSX vía `hono/jsx`)
- **Estilos**: PicoCSS + `public/styles/global.css`
- **Data source**: `football-data.org` API
- **Cache**: Cloudflare KV (binding `CACHE`)

**Scripts** (en `package.json`)

- `npm run dev` — ejecuta `wrangler dev` para desarrollo local.
- `npm run deploy` — despliega con `wrangler deploy --minify`.
- `npm run cf-typegen` — genera tipos de bindings de Cloudflare.

**Estructura clave**

- `src/index.ts` — punto de entrada del Worker y manejo de errores.
- `src/routes/home.tsx` — ruta principal que renderiza el partido en vivo.
- `src/layout/index.tsx` — layout HTML compartido (PicoCSS, fonts, htmx).
- `src/components/MatchCard/index.tsx` — componente que muestra un partido.
- `src/libs/api.ts` — cliente de `football-data.org`, helpers y caché KV.
- `public/` — activos estáticos (CSS, imágenes).

**Comportamiento y decisiones técnicas**

- Renderizado server-side con `hono/jsx` para mantener la app liviana.
- Uso de PicoCSS para un CSS classless pequeño y rápido.
- `htmx` incluido para futuros swaps parciales si se añaden endpoints HTML.
- Caché en KV con TTLs pensados para balancear frescura y coste:
  - `live`: 30s para ver goles casi en tiempo real
  - `scheduled`: 2 minutos para horarios
  - `all`: 5 minutos para itinerario completo

Configuración necesaria

- `API_TOKEN` (requerido): token para `football-data.org`.
- `CACHE` (obligatorio): binding a un namespace KV en Cloudflare.
- `COMPETITION_CODE` (opcional): código de la competición (por defecto `WC`).

Recomendación de bindings en `wrangler.toml` / `wrangler.jsonc`:

- Definir `main` apuntando a `src/index.ts` (ya configurado).
- Añadir el binding KV:

  {
  "binding": "CACHE",
  "id": "<tu-kv-id-aqui>"
  }

Cómo ejecutar localmente

1. Instalar dependencias y `wrangler` globalmente (si no está):

```bash
npm install
npm install -g wrangler
```

2. Guardar el token API como secreto para `wrangler dev` / deploy:

```bash
wrangler secret put API_TOKEN
# (Opcional) wrangler secret put COMPETITION_CODE
```

3. Ejecutar en modo desarrollo:

```bash
npm run dev
```

Despliegue

1. Configurar el namespace KV en el panel de Cloudflare y añadir el binding `CACHE` en `wrangler.jsonc`.
2. Ejecutar:

```bash
npm run deploy
```

Notas de seguridad y límites

- `football-data.org` aplica límites de uso: evita llamadas excesivas; la app usa KV para mitigarlo.
- Nunca comites tus secretos (API_TOKEN) en el repo.

Arquitectura (resumen rápido)

- Worker (`src/index.ts`) expone rutas con `Hono`.
- `src/libs/api.ts` orquesta llamadas a la API externa y gestiona caché en KV.
- Componentes en `src/components` generan HTML reutilizable vía JSX.

Ideas y próximos pasos sugeridos (si quieres continuar)

- Añadir página de `Itinerario` que liste todos los partidos por fecha.
- Mejorar la experiencia móvil y accesibilidad (aria, focus states).
- Añadir tests unitarios para helpers de `src/libs/api.ts`.
- Integrar monitorización/observabilidad (Sentry, Logs, o Workers Observability).

Contribuir

- Abrir issues o pull requests. Mantén PRs pequeños y enfocados.

Licencia

- Añade una licencia si planeas open-source (MIT es habitual para este tipo de proyectos).

Contacto

- Si querés, puedo adaptar este README para incluir demo en vivo, capturas o badges CI.

---

Generado automáticamente como README profesional por el equipo; adaptalo según tu deploy final.
