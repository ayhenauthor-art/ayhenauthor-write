/* =========================================
   THE UNSENT LETTERS & STORIES
   Seamless Page Transitions — Book-Inspired Navigation
   ========================================= */

(function () {
  'use strict';

  const SCROLL_POSITIONS_KEY = 'unsentScrollPositions';

  // =====================================
  // REDUCED MOTION CHECK
  // =====================================

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =====================================
  // SCROLL POSITION PRESERVATION
  // =====================================

  function getScrollPositions() {
    try {
      return JSON.parse(sessionStorage.getItem(SCROLL_POSITIONS_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveScrollPosition(path) {
    const positions = getScrollPositions();
    positions[path] = window.scrollY;
    sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
  }

  function restoreScrollPosition(path) {
    const positions = getScrollPositions();
    const pos = positions[path];
    if (pos !== undefined) {
      requestAnimationFrame(() => window.scrollTo(0, pos));
    }
  }

  // =====================================
  // THEME PRESERVATION
  // =====================================

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'daylight';
  }

  function preserveThemeBeforeTransition() {
    sessionStorage.setItem('unsentThemeBeforeTransition', getCurrentTheme());
  }

  function restoreThemeAfterTransition() {
    const saved = sessionStorage.getItem('unsentThemeBeforeTransition');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }

  // =====================================
  // CONTENT EXTRACTION & SWAP
  // =====================================

  function getNewHead(doc) {
    const head = document.createElement('head');
    const newHead = doc.querySelector('head');
    if (newHead) {
      // Copy only style & link elements (keep existing scripts, theme.js etc.)
      newHead.querySelectorAll('link, style').forEach(el => {
        head.appendChild(el.cloneNode(true));
      });
    }
    return head;
  }

  function getBodyAttributes(doc) {
    const oldBody = doc.body;
    const attrs = {};
    if (oldBody) {
      for (let i = 0; i < oldBody.attributes.length; i++) {
        const attr = oldBody.attributes[i];
        if (attr.name !== 'style') {
          attrs[attr.name] = attr.value;
        }
      }
    }
    return attrs;
  }

  /**
   * Remove ephemeral fixed/absolute elements that should not persist across pages
   */
  function removeEphemeralElements() {
    // Guide to the Archive
    const oldGuide = document.querySelector('.archive-guide');
    if (oldGuide) oldGuide.remove();
    // Share modal
    const oldShareModal = document.getElementById('shareModal');
    if (oldShareModal) oldShareModal.remove();
    // Instagram guide modal
    const oldInstaGuide = document.getElementById('instagramGuideModal');
    if (oldInstaGuide) oldInstaGuide.remove();
    // Poem decorative elements (floating petals, raindrops)
    const poemPetals = document.querySelector('.poem-petals');
    if (poemPetals) poemPetals.remove();
    const poemRaindrops = document.querySelector('.poem-raindrops-container');
    if (poemRaindrops) poemRaindrops.remove();
    // Toast
    const toast = document.querySelector('.quote-toast');
    if (toast) toast.remove();
    // Atmosphere modal
    const atmosModal = document.querySelector('.atmosphere-modal');
    if (atmosModal) atmosModal.remove();
  }

  /**
   * Swap all body content between <nav> and <footer> with content from the new page.
   * This is the robust fallback for pages without a single <main> wrapper.
   */
  function replaceContentBetweenNavAndFooter(doc) {
    const nav = document.querySelector('nav');
    const footer = document.querySelector('.site-footer');
    const newNav = doc.querySelector('nav');
    const newFooter = doc.querySelector('.site-footer');

    if (!nav || !footer) return false;

    // 1. Update nav active state (keep existing DOM for smoothness)
    if (newNav) {
      const oldLinks = nav.querySelectorAll('.nav-menu a');
      const newLinks = newNav.querySelectorAll('.nav-menu a');
      oldLinks.forEach((oldLink, i) => {
        if (newLinks[i]) {
          if (newLinks[i].classList.contains('active')) {
            oldLink.classList.add('active');
          } else {
            oldLink.classList.remove('active');
          }
          oldLink.href = newLinks[i].href;
        }
      });
    }

    // 2. Update footer
    if (footer && newFooter) {
      footer.outerHTML = newFooter.outerHTML;
    }

    // 3. Remove ALL existing content between nav and the (now replaced) footer
    const currentFooter = document.querySelector('.site-footer') || footer;
    let currentEl = nav.nextElementSibling;
    while (currentEl && currentEl !== currentFooter) {
      const next = currentEl.nextElementSibling;
      currentEl.remove();
      currentEl = next;
    }

    // 4. Insert ALL content from new page between nav and footer
    if (newNav && newFooter) {
      let newEl = newNav.nextElementSibling;
      const parent = nav.parentNode;
      const fragment = document.createDocumentFragment();
      while (newEl && newEl !== newFooter) {
        const next = newEl.nextElementSibling;
        fragment.appendChild(newEl.cloneNode(true));
        newEl = next;
      }
      if (currentFooter && currentFooter.parentNode) {
        parent.insertBefore(fragment, currentFooter);
      } else {
        parent.appendChild(fragment);
      }
      return true;
    }
    return false;
  }

  function swapContent(url, html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 0. Remove ephemeral elements before swapping
    removeEphemeralElements();

    // 1. Update document title
    const title = doc.querySelector('title');
    if (title) {
      document.title = title.textContent;
    }

    // 2. Update head styles (for dynamic CSS if any)
    const newHead = getNewHead(doc);
    const existingStyles = document.querySelectorAll(
      'head link[rel="stylesheet"], head style'
    );
    existingStyles.forEach(el => el.remove());
    newHead.querySelectorAll('link, style').forEach(el => {
      document.head.appendChild(el);
    });

    // 3. Update body attributes
    const bodyAttrs = getBodyAttributes(doc);
    Object.keys(bodyAttrs).forEach(attr => {
      document.body.setAttribute(attr, bodyAttrs[attr]);
    });

    // 4. Swap body content — try to find a single main container first
    const mainSelectors = [
      'main', '[role="main"]',
      '.about-page', '.quotes-page', '.essay-library',
      '.letter-popup-page', '.letters-page', '.garden-archive-page',
      '.page-404', '.letters-popup-page'
    ];

    let newMain = null;
    let oldMain = null;

    for (const sel of mainSelectors) {
      newMain = doc.querySelector(sel);
      oldMain = document.querySelector(sel);
      if (newMain && oldMain) break;
    }

    if (newMain && oldMain) {
      // Single main container found — straightforward swap
      oldMain.replaceWith(newMain.cloneNode(true));
    } else {
      // Fallback: replace everything between nav and footer
      replaceContentBetweenNavAndFooter(doc);
    }

    // 5. Update progress bar (if the new page has one and current doesn't)
    if (!document.getElementById('progress-bar') && doc.getElementById('progress-bar')) {
      const pb = document.createElement('div');
      pb.id = 'progress-bar';
      document.body.prepend(pb);
    }

    // 6. Restore theme after DOM swap
    restoreThemeAfterTransition();

    // 7. Re-initialize page scripts
    reinitializePage();
  }

  // =====================================
  // PAGE RE-INITIALIZATION
  // =====================================

  function reinitializePage() {
    if (typeof window.initApp === 'function') {
      window.initApp();
    }
    // Re-init share.js (it auto-detects piece on load)
    // Trigger any custom DOM events
    document.dispatchEvent(new CustomEvent('pageTransitionComplete'));
  }

  // =====================================
  // TRANSITION ANIMATION PLAYERS
  // =====================================

  const EXIT_DURATION = prefersReducedMotion() ? 50 : 350;
  const ENTER_DURATION = prefersReducedMotion() ? 50 : 400;

  function getTransitionContainer() {
    // Find the primary visible content container
    return (
      document.querySelector('main') ||
      document.querySelector('[role="main"]') ||
      document.querySelector('.about-page') ||
      document.querySelector('.quotes-page') ||
      document.querySelector('.essay-library') ||
      document.querySelector('.hero') ||
      document.querySelector('.article-header') ||
      document.querySelector('.letter-popup-section') ||
      document.querySelector('.letters-hero') ||
      document.querySelector('.garden-archive-hero') ||
      document.querySelector('.start-section') ||
      document.body
    );
  }

  function playExitAnimation(container) {
    return new Promise((resolve) => {
      if (prefersReducedMotion() || !container) {
        resolve();
        return;
      }

      // Detect the type of page for custom exit animation
      const isArticlePage =
        container.classList.contains('article-page') ||
        container.classList.contains('article-header') ||
        document.querySelector('.article-header') !== null;

      const isLibraryPage =
        container.classList.contains('essay-library') ||
        container.querySelector('.library-hero') !== null ||
        container.querySelector('.library-category-grid') !== null;

      // Get the specific element to animate (use body wrapper if container is body)
      const target = container === document.body ? document.body : container;
      target.classList.add('page-exit-active');
      target.classList.remove('page-enter-active');

      if (isArticlePage) {
        // Book page-turning exit: rotate from center-left, fade
        target.style.transition = `opacity ${EXIT_DURATION}ms ease, transform ${EXIT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        target.style.transformOrigin = 'left center';
        target.style.transform = 'perspective(1200px) rotateY(4deg) scale(0.96)';
        target.style.opacity = '0';
      } else if (isLibraryPage) {
        // Library exit: slide left slightly and fade
        target.style.transition = `opacity ${EXIT_DURATION}ms ease, transform ${EXIT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        target.style.transformOrigin = 'center center';
        target.style.transform = 'translateX(-30px) scale(0.98)';
        target.style.opacity = '0';
      } else {
        // Default exit: fade + slight upward drift
        target.style.transition = `opacity ${EXIT_DURATION}ms ease, transform ${EXIT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        target.style.transformOrigin = 'center center';
        target.style.transform = 'translateY(15px) scale(0.98)';
        target.style.opacity = '0';
      }

      setTimeout(() => {
        target.classList.remove('page-exit-active');
        resolve();
      }, EXIT_DURATION);
    });
  }

  function playEnterAnimation(container) {
    return new Promise((resolve) => {
      if (prefersReducedMotion() || !container) {
        resolve();
        return;
      }

      // Detect the type of page for custom enter animation
      const isArticlePage =
        container.classList.contains('article-page') ||
        container.classList.contains('article-header') ||
        document.querySelector('.article-header') !== null;

      const isLibraryPage =
        container.classList.contains('essay-library') ||
        container.querySelector('.library-hero') !== null ||
        container.querySelector('.library-category-grid') !== null;

      const target = container === document.body ? document.body : container;
      target.classList.add('page-enter-active');
      target.classList.remove('page-exit-active');

      // Set initial state for enter animation
      target.style.transition = 'none';

      if (isArticlePage) {
        // Book page-unfolding enter: start slightly rotated and scaled
        target.style.transformOrigin = 'left center';
        target.style.transform = 'perspective(1200px) rotateY(-2deg) scale(0.97)';
        target.style.opacity = '0.6';
      } else if (isLibraryPage) {
        // Library enter: slide in from right
        target.style.transformOrigin = 'center center';
        target.style.transform = 'translateX(20px) scale(0.98)';
        target.style.opacity = '0';
      } else {
        // Default enter: start slightly below
        target.style.transformOrigin = 'center center';
        target.style.transform = 'translateY(-12px) scale(0.99)';
        target.style.opacity = '0.7';
      }

      // Force reflow
      void target.offsetHeight;

      // Play enter animation
      target.style.transition = `opacity ${ENTER_DURATION}ms ease, transform ${ENTER_DURATION}ms cubic-bezier(0.16, 0.8, 0.2, 1)`;
      target.style.transform = 'perspective(1200px) rotateY(0deg) scale(1) translateX(0) translateY(0)';
      target.style.opacity = '1';

      setTimeout(() => {
        target.classList.remove('page-enter-active');
        // Clean up inline styles
        target.style.transition = '';
        target.style.transform = '';
        target.style.opacity = '';
        target.style.transformOrigin = '';
        resolve();
      }, ENTER_DURATION + 50);
    });
  }

  // =====================================
  // CORE NAVIGATION FUNCTION
  // =====================================

  function isInternalLink(anchor) {
    if (!anchor || !anchor.href) return false;
    if (anchor.hasAttribute('target') && anchor.getAttribute('target') === '_blank') return false;
    if (anchor.getAttribute('download') !== null) return false;
    if (anchor.href.startsWith('mailto:') || anchor.href.startsWith('tel:')) return false;
    if (anchor.href.includes('javascript:')) return false;

    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(anchor.href);

    // Same origin check
    if (targetUrl.origin !== currentUrl.origin) return false;

    // External share links
    if (
      targetUrl.hostname.includes('facebook.com') ||
      targetUrl.hostname.includes('twitter.com') ||
      targetUrl.hostname.includes('x.com')
    ) return false;

    // Hash-only navigation (same page)
    if (targetUrl.pathname === currentUrl.pathname && targetUrl.hash) return false;

    // Don't intercept if it's just a hash on current page
    if (targetUrl.pathname === currentUrl.pathname && !targetUrl.hash) return true;

    return true;
  }

  function navigateTo(url) {
    // Save scroll position for current page
    saveScrollPosition(window.location.pathname);

    const container = getTransitionContainer();

    preserveThemeBeforeTransition();

    // Play exit animation
    playExitAnimation(container).then(() => {
      // Fetch new page
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('Page load failed');
          return response.text();
        })
        .then(html => {
          // Swap content
          swapContent(url, html);

          // Update browser history
          history.pushState({ path: url }, '', url);

          // Play enter animation
          const newContainer = getTransitionContainer();
          playEnterAnimation(newContainer).then(() => {
            restoreScrollPosition(window.location.pathname);

            // Re-initialize scroll reveal for new content
            if (typeof window.initScrollReveal === 'function') {
              window.initScrollReveal();
            }
          });
        })
        .catch(() => {
          // Fallback: regular navigation
          window.location.href = url;
        });
    });
  }

  // =====================================
  // LINK INTERCEPTION
  // =====================================

  function handleClick(event) {
    const anchor = event.target.closest('a');
    if (!anchor) return;
    if (!isInternalLink(anchor)) return;

    // Skip if user wants to open in new tab
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (event.button !== 0) return; // Only left-click

    event.preventDefault();
    navigateTo(anchor.href);
  }

  function attachClickListener() {
    document.addEventListener('click', handleClick);
  }

  // =====================================
  // BROWSER BACK/FORWARD HANDLING
  // =====================================

  function handlePopState(event) {
    const state = event.state;
    if (state && state.path) {
      // Full navigation for popstate — we need to fetch
      const container = getTransitionContainer();
      preserveThemeBeforeTransition();

      playExitAnimation(container).then(() => {
        fetch(state.path)
          .then(response => {
            if (!response.ok) throw new Error('Failed to load');
            return response.text();
          })
          .then(html => {
            swapContent(state.path, html);
            const newContainer = getTransitionContainer();
            playEnterAnimation(newContainer).then(() => {
              restoreScrollPosition(window.location.pathname);
            });
          })
          .catch(() => {
            window.location.href = state.path;
          });
      });
    }
  }

  // =====================================
  // INITIALIZATION
  // =====================================

  function initTransitions() {
    attachClickListener();
    window.addEventListener('popstate', handlePopState);

    // If first load, store current URL state
    if (!history.state) {
      history.replaceState({ path: window.location.href }, '', window.location.href);
    }

    // Restore scroll position if navigating back
    restoreScrollPosition(window.location.pathname);

    // Listen for theme changes and preserve during transition
    document.addEventListener('pageTransitionComplete', () => {
      restoreScrollPosition(window.location.pathname);
    });

    // Expose for debugging
    window.__transitions = { navigateTo, prefersReducedMotion };
  }

  // Expose reinitialize for use by script.js
  window.reinitializePage = reinitializePage;

  // Start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTransitions);
  } else {
    initTransitions();
  }

})();
