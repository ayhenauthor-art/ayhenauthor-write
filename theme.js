/* =========================================
   THE UNSENT LETTERS & STORIES
   Theme Manager — Adaptive Light / Dark
   ========================================= */

(() => {
  'use strict';

  const STORAGE_KEY = 'unsentLettersTheme';
  const root = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  /**
   * Get the active theme from localStorage or system preference.
   */
  const getTheme = () =>
    localStorage.getItem(STORAGE_KEY) || (mediaQuery.matches ? 'moonlight' : 'daylight');

  /**
   * Apply a theme to the document root.
   * @param {'daylight'|'moonlight'} theme
   */
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme === 'moonlight' ? 'dark' : 'light';
  };

  // Apply saved / detected theme immediately (blocks render)
  applyTheme(getTheme());

  /**
   * Update the toggle button's visual state and accessibility attributes.
   * @param {HTMLElement} toggle
   */
  const updateToggle = (toggle) => {
    const isMoonlight = root.dataset.theme === 'moonlight';
    const icon = toggle.querySelector('.theme-toggle-icon');
    const label = toggle.querySelector('.theme-toggle-label');

    toggle.setAttribute('aria-pressed', String(isMoonlight));
    toggle.setAttribute(
      'aria-label',
      `Current theme: ${isMoonlight ? 'Moonlight' : 'Daylight'}. Switch to ${isMoonlight ? 'Daylight' : 'Moonlight'} mode.`
    );

    if (icon) icon.textContent = isMoonlight ? '🌙' : '☀️';
    if (label) label.textContent = isMoonlight ? 'Moonlight' : 'Daylight';
  };

  /**
   * Inject the theme-toggle button into the navigation bar
   * (inserted before the hamburger menu button).
   */
  const injectToggle = () => {
    const nav = document.querySelector('nav');
    const hamburger = nav?.querySelector('.hamburger');
    if (!nav || !hamburger) return;

    // Check if toggle already exists (for pages that may have it static)
    if (nav.querySelector('.theme-toggle')) return;

    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.type = 'button';
    toggle.innerHTML =
      '<span class="theme-toggle-icon" aria-hidden="true"></span><span class="theme-toggle-label"></span>';

    nav.insertBefore(toggle, hamburger);
    updateToggle(toggle);
    return toggle;
  };

  /**
   * Handle the theme-switch click: apply, persist, animate.
   * @param {HTMLElement} toggle
   */
  const handleToggleClick = (toggle) => {
    const nextTheme = root.dataset.theme === 'moonlight' ? 'daylight' : 'moonlight';

    // Add transition class for smooth cross-fade
    root.classList.add('theme-transitioning');

    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    updateToggle(toggle);

    // Remove transition class after animation completes
    window.setTimeout(() => root.classList.remove('theme-transitioning'), 450);
  };

  /* ---- Boot ---- */
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = injectToggle();
    if (!toggle) return;

    toggle.addEventListener('click', () => handleToggleClick(toggle));
  });

  /* ---- Listen for system preference changes (only if user hasn't explicitly set a theme) ---- */
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', (event) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(event.matches ? 'moonlight' : 'daylight');
        // Update any toggle that exists on the page
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) updateToggle(toggle);
      }
    });
  }
})();