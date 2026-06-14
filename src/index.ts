import { Hono } from "hono";
import homePage from "./routes/home";

const app = new Hono();

app.get("/", homePage);

app.onError((err, c) => {
  console.error("Error:", err.message);
  return c.html(
    `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>Error — Mundial 2026</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"/>
    </head>
    <body style="max-width:480px;margin:4rem auto;padding:1rem">
      <h2>⚠️ Algo salió mal</h2>
      <p>${err.message}</p>
      <p>
        Asegurate de haber configurado la variable de entorno
        <code>API_TOKEN</code> en tu archivo <code>.env</code>.
      </p>
      <a href="/">← Volver</a>
    </body>
    </html>`,
    500,
  );
});

export default app;
