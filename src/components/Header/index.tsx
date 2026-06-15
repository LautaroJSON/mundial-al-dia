export const Header = () => (
  <header class="site-header">
    <div class="header-inner">
      <h1 class="site-title">
        <img
          src="https://crests.football-data.org/wm26.png"
          alt="Mundial 2026"
          class="site-logo"
          width={50}
        />
        MUNDIAL <span>2026</span>
      </h1>
      <div class="live-badge">
        <span class="live-dot" />
        EN VIVO
      </div>
    </div>
    <div class="carrusel-container">
      <span class="site-title-animation">FIFA world cup</span>
    </div>
    <nav class="tab-nav">
      <div class="intinerary-tab">
        <a href="/">Inicio</a>
      </div>
      <div class="intinerary-tab">
        <a href="/intinerario">Itinerario</a>
      </div>
    </nav>
  </header>
);
