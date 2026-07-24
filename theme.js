/* Reading Atmospheres — a persistent, accessible palette for the library. */
(() => {
  'use strict';

  const STORAGE_KEY = 'unsentLettersAtmosphere';
  const root = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const atmospheres = [
    { id: 'daylight', icon: '☀️', name: 'Daylight', note: 'A sunlit desk, clear and quietly hopeful.' },
    { id: 'moonlight', icon: '🌙', name: 'Moonlight', note: 'Warm lamplight for the last chapter of the day.' },
    { id: 'starlight', icon: '✨', name: 'Starlight', note: 'Ink-blue stillness beneath a page of stars.' },
    { id: 'autumn', icon: '🍂', name: 'Autumn', note: 'An amber armchair beside rustling leaves.' },
    { id: 'rainfall', icon: '🌧', name: 'Rainfall', note: 'A windowpane hush and a cup close at hand.' },
    { id: 'spring', icon: '🌸', name: 'Spring', note: 'Soft blossom light for new beginnings.' }
  ];

  const selectedAtmosphere = () => localStorage.getItem(STORAGE_KEY);
  const preferredAtmosphere = () => selectedAtmosphere() || (mediaQuery.matches ? 'moonlight' : 'daylight');

  const applyAtmosphere = (atmosphere) => {
    root.dataset.theme = atmosphere;
    root.style.colorScheme = ['moonlight', 'starlight', 'rainfall'].includes(atmosphere) ? 'dark' : 'light';
  };

  // Apply before first paint.
  applyAtmosphere(preferredAtmosphere());

  const modalMarkup = () => `
    <button class="atmosphere-orb" type="button" aria-label="Choose your reading atmosphere" aria-haspopup="dialog" aria-expanded="false" aria-controls="readingAtmosphereModal">
      <span class="orrery" aria-hidden="true"><span class="orrery-orbit orbit-one"></span><span class="orrery-orbit orbit-two"></span><span class="orrery-star star-one"></span><span class="orrery-star star-two"></span><span class="orrery-core"></span></span>
      <span class="atmosphere-orb-label">Reading atmosphere</span>
    </button>
    <div class="atmosphere-modal" id="readingAtmosphereModal" role="dialog" aria-modal="true" aria-labelledby="atmosphereModalTitle" aria-hidden="true">
      <div class="atmosphere-modal-backdrop"></div>
      <section class="atmosphere-modal-panel" role="document">
        <button class="atmosphere-modal-close" type="button" aria-label="Close reading atmospheres">×</button>
        <p class="atmosphere-modal-kicker">The Unsent Letters &amp; Stories</p>
        <h2 id="atmosphereModalTitle">✨ Choose Your Reading Atmosphere</h2>
        <p class="atmosphere-modal-intro">Choose the room that best suits this moment. Every palette is tuned for an easy, unhurried read.</p>
        <div class="atmosphere-grid" role="list">${atmospheres.map(item => `
          <button class="atmosphere-card" type="button" data-atmosphere="${item.id}" role="listitem" aria-pressed="false">
            <span class="atmosphere-card-icon" aria-hidden="true">${item.icon}</span>
            <span class="atmosphere-card-copy"><strong>${item.name}</strong><small>${item.note}</small></span>
            <span class="palette-preview palette-${item.id}" aria-hidden="true"><i></i><i></i><i></i></span>
          </button>`).join('')}</div>
      </section>
    </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    if (!nav || nav.querySelector('.atmosphere-orb')) return;

    // Build nav-right container for the orb trigger
    let navRight = nav.querySelector('.nav-right');
    if (!navRight) {
      navRight = document.createElement('div');
      navRight.className = 'nav-right';
      nav.appendChild(navRight);
    }

    // Parse modalMarkup into separate trigger and modal elements
    const temp = document.createElement('div');
    temp.innerHTML = modalMarkup();
    const trigger = temp.querySelector('.atmosphere-orb');
    const modal = temp.querySelector('.atmosphere-modal');

    // Insert trigger into nav-right
    navRight.appendChild(trigger);

    // Append modal to document body (never inside nav)
    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.atmosphere-modal-close');
    let opener = null;
    const updateSelection = () => {
      const current = root.dataset.theme;
      modal.querySelectorAll('.atmosphere-card').forEach(card => {
        const active = card.dataset.atmosphere === current;
        card.classList.toggle('is-selected', active);
        card.setAttribute('aria-pressed', String(active));
      });
    };
    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('atmosphere-modal-open');
      opener?.focus();
    };
    const open = () => {
      opener = trigger;
      updateSelection();
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('atmosphere-modal-open');
      closeButton.focus();
    };
    trigger.addEventListener('click', open);
    closeButton.addEventListener('click', close);
    modal.addEventListener('click', event => { if (event.target === modal || event.target.classList.contains('atmosphere-modal-backdrop')) close(); });
    modal.querySelectorAll('.atmosphere-card').forEach(card => card.addEventListener('click', () => {
      const next = card.dataset.atmosphere;
      root.classList.add('theme-transitioning');
      applyAtmosphere(next);
      localStorage.setItem(STORAGE_KEY, next);
      updateSelection();
      window.setTimeout(() => root.classList.remove('theme-transitioning'), 350);
    }));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('is-open')) close(); });
    updateSelection();
  });

  mediaQuery.addEventListener?.('change', event => {
    if (!selectedAtmosphere()) applyAtmosphere(event.matches ? 'moonlight' : 'daylight');
  });
})();
