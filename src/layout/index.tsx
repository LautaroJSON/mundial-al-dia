import type { FC } from "hono/jsx";
import { Header } from "../components/Header";
import { raw } from "hono/html";

interface Props {
  title?: string;
  children: any;
}

export const Layout: FC<Props> = ({ title = "Mundial 2026", children }) => (
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0a3d1f" />
      <title>{title}</title>

      {/* PicoCSS — classless, ~10kb gzip */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
      />

      {/* Google Fonts — Bebas Neue + Inter */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap"
      />

      {/* htmx — partial HTML swaps sin JS framework */}
      <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer />

      {/* CSS propio — servido como archivo estático desde /styles/global.css */}
      <link rel="stylesheet" href="/styles/global.css" />
    </head>
    <body>
      <Header />

      <main class="main">{children}</main>

      <footer class="site-footer">
        Datos:{" "}
        <a href="https://www.football-data.org" target="_blank">
          football-data.org
        </a>
        &nbsp;·&nbsp; Horarios en Argentina (ART, UTC-3)
      </footer>
    </body>
    {raw(`
      <script>
        (function () {
          const paisSelect  = document.getElementById('pais-select');
          const stageSelect = document.getElementById('stage-select');
          const dayGroups   = document.querySelectorAll('.day-group');

          function applyFilters() {
            const pais  = paisSelect.value;
            const stage = stageSelect.value;

            dayGroups.forEach((group) => {
              const cards = group.querySelectorAll('.match-card');
              let visibleInGroup = 0;

              cards.forEach((card) => {
                const matchesPais =
                  pais === 'all' ||
                  card.dataset.home === pais ||
                  card.dataset.away === pais;

                const matchesStage =
                  stage === 'all' ||
                  card.dataset.stage === stage;

                const visible = matchesPais && matchesStage;
                card.style.display = visible ? '' : 'none';
                if (visible) visibleInGroup++;
              });

              // Si ninguna card del día es visible, ocultamos también el day-header
              group.style.display = visibleInGroup > 0 ? '' : 'none';
            });
          }

          paisSelect.addEventListener('change', applyFilters);
          stageSelect.addEventListener('change', applyFilters);
        })();
      </script>
      `)}
  </html>
);
